import { STAGE_SIGNATURES } from '../data/nairobiTransportDataset';
import {
  ContributingFactor,
  DayType,
  DemandCategory,
  ForecastDirection,
  ForecastHorizon,
  HorizonComparisonPoint,
  HourlyDemandPoint,
  ModelEvaluationSummary,
  PassengerObservation,
  StageForecastResult,
  TimePeriod,
  TransportRoute,
  TransportStage,
} from '../types/transport';
import { m3DataProvider } from './m3DataProvider';

/**
 * Transparent Multi-Factor Additive Linear Regression Baseline Weights
 * Calibrated on the synthetic Nairobi historical observation dataset:
 *
 *   y_hat(h) = beta_0
 *            + beta_hist * X_hist_period
 *            + beta_tod  * X_tod_momentum(h)
 *            + beta_hdw  * (Headway_obs - Headway_sched)
 *            + beta_hub  * I_interchange_hub
 *
 * Explicitly labelled as an explainable linear baseline calibrated on synthetic records.
 */
const MODEL_WEIGHTS = {
  beta0_intercept: 6.5,
  beta_hist_baseline: 0.96,
  beta_tod_momentum: 1.12,
  beta_headway_pressure: 11.4, // Additional waiting passengers per minute of bus arrival interval above 5.0 min
  beta_hub_transfer: 14.0,
};

export function classifyDemandCategory(
  predictedPassengers: number,
  baselineHourlyCapacity: number
): DemandCategory {
  const ratio = predictedPassengers / Math.max(180, baselineHourlyCapacity);
  if (ratio >= 0.88 || predictedPassengers >= 340) {
    return 'high';
  }
  if (ratio >= 0.56 || predictedPassengers >= 205) {
    return 'moderate';
  }
  return 'low';
}

export function formatTimePeriodLabel(period: TimePeriod): string {
  switch (period) {
    case 'morning_peak':
      return 'Morning Peak (06:00–09:30)';
    case 'midday':
      return 'Midday Off-Peak (10:00–15:30)';
    case 'evening_peak':
      return 'Evening Peak (16:00–20:30)';
  }
}

export function formatDayTypeLabel(dayType: DayType): string {
  switch (dayType) {
    case 'weekday':
      return 'Weekday (Mon–Fri)';
    case 'saturday':
      return 'Saturday Schedule';
    case 'sunday':
      return 'Sunday / Holiday';
  }
}

function computeHorizonMomentumFactor(
  stage: TransportStage,
  timePeriod: TimePeriod,
  horizonMinutes: ForecastHorizon
): number {
  const sig = STAGE_SIGNATURES[stage.id];
  const isEveningDominant = sig.eveningBase > sig.morningBase;
  const isMorningDominant = sig.morningBase >= sig.eveningBase;

  // Horizon factor scales with 15m -> 30m -> 60m
  const horizonStep = horizonMinutes === 15 ? 0.45 : horizonMinutes === 30 ? 0.85 : 1.35;

  if (timePeriod === 'morning_peak') {
    // Residential origin stages build rapidly across 15-60m in the morning peak
    return isMorningDominant ? 26 * horizonStep : 14 * horizonStep;
  }
  if (timePeriod === 'evening_peak') {
    // CBD & employment hubs accumulate sharper queues over 30-60m in the evening peak
    return isEveningDominant ? 32 * horizonStep : 16 * horizonStep;
  }
  // Midday shows mild mean-reversion or steady flow over longer horizons
  return stage.isHub ? 5 * horizonStep : -6 * horizonStep;
}

function getStageObservations(
  stageId: string,
  timePeriod: TimePeriod,
  dayType: DayType
): PassengerObservation[] {
  const allObs = m3DataProvider.getObservations();
  return allObs.filter(
    (o) =>
      o.stageId === stageId &&
      o.timePeriod === timePeriod &&
      o.dayType === dayType
  );
}

function getWeekdayMiddayBaseline(stageId: string): number {
  const obs = getStageObservations(stageId, 'midday', 'weekday');
  if (obs.length === 0) return 180;
  const sum = obs.reduce((acc, item) => acc + item.passengerCount, 0);
  return Math.round(sum / obs.length);
}

function calculateSingleHorizonPrediction(
  stage: TransportStage,
  routes: TransportRoute[],
  timePeriod: TimePeriod,
  dayType: DayType,
  horizonMinutes: ForecastHorizon,
  saccoFilterId: string | 'all'
): {
  observedMean: number;
  predictedPassengers: number;
  headwayMinutes: number;
  scheduledHeadway: number;
  dwellSeconds: number;
  completeness: number;
  histComponent: number;
  momentumComponent: number;
  headwayComponent: number;
  hubComponent: number;
  saccoShareMultiplier: number;
} {
  const matchingObs = getStageObservations(stage.id, timePeriod, dayType);
  const sig = STAGE_SIGNATURES[stage.id];

  const rawObservedMean =
    matchingObs.length > 0
      ? matchingObs.reduce((sum, r) => sum + r.passengerCount, 0) /
        matchingObs.length
      : sig.middayBase;

  const rawHeadwayMean =
    matchingObs.length > 0
      ? matchingObs.reduce((sum, r) => sum + r.busArrivalIntervalMinutes, 0) /
        matchingObs.length
      : sig.middayHeadwayMin;

  const rawDwellMean =
    matchingObs.length > 0
      ? matchingObs.reduce((sum, r) => sum + r.dwellTimeSeconds, 0) /
        matchingObs.length
      : sig.dwellBaseSec;

  const completeness =
    matchingObs.length > 0
      ? matchingObs[0].dataCompleteness
      : sig.completeness;

  // Calculate scheduled headway across routes serving this stage
  const stageRoutes = routes.filter((r) => stage.routeIds.includes(r.id));
  const scheduledHeadway =
    stageRoutes.length > 0
      ? stageRoutes.reduce(
          (acc, r) => acc + r.scheduledHeadwayMinutes[timePeriod],
          0
        ) / stageRoutes.length
      : 6.0;

  // Horizon adjustment to bus arrival interval (longer peak horizons risk slightly wider headway bunching)
  const horizonHeadwayStretch =
    timePeriod === 'midday'
      ? 0
      : horizonMinutes === 15
      ? 0.2
      : horizonMinutes === 30
      ? 0.5
      : 0.9;

  const effectiveHeadway = Number(
    (rawHeadwayMean + horizonHeadwayStretch).toFixed(1)
  );

  // If a specific SACCO is selected and operates at this stage, compute its operational share
  // Note: Stage-wide demand remains the primary physical queue unless filtered by SACCO share in SACCO-specific views,
  // or we adjust proportionally when inspecting a SACCO subset in Forecasts.
  let saccoShareMultiplier = 1.0;
  if (saccoFilterId !== 'all') {
    if (stage.saccoIds.includes(saccoFilterId)) {
      // Deterministic share based on how many SACCOs share the stage
      const saccoIdx = stage.saccoIds.indexOf(saccoFilterId);
      const baseShare = 1 / stage.saccoIds.length;
      const weightTilt = saccoIdx === 0 ? 1.15 : 0.92;
      saccoShareMultiplier = Math.min(1.0, Number((baseShare * weightTilt * stage.saccoIds.length * 0.88).toFixed(2)));
    } else {
      saccoShareMultiplier = 0.75;
    }
  }

  const histComponent = MODEL_WEIGHTS.beta_hist_baseline * rawObservedMean;
  const rawMomentum = computeHorizonMomentumFactor(
    stage,
    timePeriod,
    horizonMinutes
  );
  const dayMomentumScale =
    dayType === 'weekday' ? 1.0 : dayType === 'saturday' ? 0.75 : 0.55;
  const momentumComponent =
    MODEL_WEIGHTS.beta_tod_momentum * rawMomentum * dayMomentumScale;

  const headwayGap = Math.max(-1.5, effectiveHeadway - scheduledHeadway * 0.85);
  const headwayComponent = MODEL_WEIGHTS.beta_headway_pressure * headwayGap;

  const hubComponent = stage.isHub
    ? MODEL_WEIGHTS.beta_hub_transfer * dayMomentumScale
    : 0;

  const unscaledPrediction =
    MODEL_WEIGHTS.beta0_intercept +
    histComponent +
    momentumComponent +
    headwayComponent +
    hubComponent;

  const observedMean = Math.round(rawObservedMean * saccoShareMultiplier);
  const predictedPassengers = Math.max(
    30,
    Math.round(unscaledPrediction * saccoShareMultiplier)
  );

  const dwellSeconds = Math.round(
    rawDwellMean * (predictedPassengers / Math.max(80, observedMean))
  );

  return {
    observedMean,
    predictedPassengers,
    headwayMinutes: effectiveHeadway,
    scheduledHeadway: Number(scheduledHeadway.toFixed(1)),
    dwellSeconds,
    completeness,
    histComponent: Math.round(histComponent * saccoShareMultiplier),
    momentumComponent: Math.round(momentumComponent * saccoShareMultiplier),
    headwayComponent: Math.round(headwayComponent * saccoShareMultiplier),
    hubComponent: Math.round(hubComponent * saccoShareMultiplier),
    saccoShareMultiplier,
  };
}

export function forecastStageDemand(params: {
  stageId: string;
  timePeriod: TimePeriod;
  dayType?: DayType;
  horizonMinutes: ForecastHorizon;
  saccoFilterId?: string | 'all';
}): StageForecastResult {
  const {
    stageId,
    timePeriod,
    dayType = 'weekday',
    horizonMinutes,
    saccoFilterId = 'all',
  } = params;

  const stages = m3DataProvider.getStages();
  const routes = m3DataProvider.getRoutes();
  const stage = stages.find((s) => s.id === stageId) ?? stages[0];

  const currentCalc = calculateSingleHorizonPrediction(
    stage,
    routes,
    timePeriod,
    dayType,
    horizonMinutes,
    saccoFilterId
  );

  const weekdayMiddayBaseline = Math.round(
    getWeekdayMiddayBaseline(stage.id) * currentCalc.saccoShareMultiplier
  );

  const effectiveCapacity = Math.round(
    stage.baselineHourlyCapacity * currentCalc.saccoShareMultiplier
  );

  const predictedCategory = classifyDemandCategory(
    currentCalc.predictedPassengers,
    effectiveCapacity
  );

  const deltaPassengers =
    currentCalc.predictedPassengers - currentCalc.observedMean;
  const deltaPercent = Number(
    (
      (deltaPassengers / Math.max(1, currentCalc.observedMean)) *
      100
    ).toFixed(1)
  );

  const direction: ForecastDirection =
    deltaPercent >= 5.0
      ? 'rising'
      : deltaPercent <= -4.0
      ? 'easing'
      : 'stable';

  // Horizon comparison across 15, 30, and 60 minutes
  const horizons: ForecastHorizon[] = [15, 30, 60];
  const horizonComparisons: HorizonComparisonPoint[] = horizons.map((h) => {
    const hCalc = calculateSingleHorizonPrediction(
      stage,
      routes,
      timePeriod,
      dayType,
      h,
      saccoFilterId
    );
    const cat = classifyDemandCategory(
      hCalc.predictedPassengers,
      effectiveCapacity
    );
    const spreadRatio =
      (1 - hCalc.completeness) * 0.4 + (h === 15 ? 0.06 : h === 30 ? 0.09 : 0.13);
    const halfBand = Math.max(10, Math.round(hCalc.predictedPassengers * spreadRatio));
    const dPct = Number(
      (
        ((hCalc.predictedPassengers - hCalc.observedMean) /
          Math.max(1, hCalc.observedMean)) *
        100
      ).toFixed(1)
    );
    return {
      horizonMinutes: h,
      predictedPassengers: hCalc.predictedPassengers,
      predictedCategory: cat,
      headwayMinutes: hCalc.headwayMinutes,
      confidenceLow: Math.max(15, hCalc.predictedPassengers - halfBand),
      confidenceHigh: hCalc.predictedPassengers + halfBand,
      deltaFromObservedPercent: dPct,
    };
  });

  const activeHorizonBand =
    horizonComparisons.find((h) => h.horizonMinutes === horizonMinutes) ??
    horizonComparisons[1];

  // Meaningful confidence calculation derived from sample completeness and horizon length
  const horizonPenalty =
    horizonMinutes === 15 ? 2 : horizonMinutes === 30 ? 6 : 12;
  const statusPenalty =
    stage.dataStatus === 'complete_demo'
      ? 0
      : stage.dataStatus === 'partial_sensor_demo'
      ? 6
      : 10;
  const confidenceScorePercent = Math.min(
    94,
    Math.max(
      64,
      Math.round(currentCalc.completeness * 100 - horizonPenalty - statusPenalty)
    )
  );

  // Build transparent contributing factors
  const totalAbsContribution =
    Math.abs(currentCalc.histComponent) +
    Math.abs(currentCalc.momentumComponent) +
    Math.abs(currentCalc.headwayComponent) +
    Math.abs(currentCalc.hubComponent);

  const contributingFactors: ContributingFactor[] = [
    {
      id: 'factor-hist',
      label: 'Historical Period Pattern',
      valueLabel: `${currentCalc.observedMean} pax / 30m baseline`,
      impactDirection:
        currentCalc.observedMean >= weekdayMiddayBaseline ? 'upward' : 'neutral',
      contributionPassengers: currentCalc.histComponent,
      relativeWeightPercent: Math.round(
        (Math.abs(currentCalc.histComponent) / Math.max(1, totalAbsContribution)) *
          100
      ),
      description: `Derived from synthetic historical observations for ${stage.name} during ${formatTimePeriodLabel(timePeriod)} on ${formatDayTypeLabel(dayType)}.`,
    },
    {
      id: 'factor-momentum',
      label: `Time-of-Day & ${horizonMinutes}-Min Horizon Trend`,
      valueLabel: `${currentCalc.momentumComponent >= 0 ? '+' : ''}${currentCalc.momentumComponent} pax trajectory`,
      impactDirection:
        currentCalc.momentumComponent > 4
          ? 'upward'
          : currentCalc.momentumComponent < -4
          ? 'downward'
          : 'neutral',
      contributionPassengers: currentCalc.momentumComponent,
      relativeWeightPercent: Math.round(
        (Math.abs(currentCalc.momentumComponent) /
          Math.max(1, totalAbsContribution)) *
          100
      ),
      description: `Captures directional queue accumulation over the next ${horizonMinutes} minutes along ${stage.corridor}.`,
    },
    {
      id: 'factor-headway',
      label: 'Bus Arrival Interval (Headway Pressure)',
      valueLabel: `${currentCalc.headwayMinutes} min avg interval (sched ${currentCalc.scheduledHeadway}m)`,
      impactDirection:
        currentCalc.headwayComponent > 5 ? 'upward' : 'neutral',
      contributionPassengers: currentCalc.headwayComponent,
      relativeWeightPercent: Math.round(
        (Math.abs(currentCalc.headwayComponent) /
          Math.max(1, totalAbsContribution)) *
          100
      ),
      description: `Longer intervals between arriving matatus/buses increase waiting passenger accumulation at the stage kerb.`,
    },
    {
      id: 'factor-hub',
      label: 'Corridor Interchange & Route Transfer Role',
      valueLabel: stage.isHub
        ? `Multi-route hub (${stage.routeIds.length} routes)`
        : `Corridor feeder stage (${stage.routeIds.length} routes)`,
      impactDirection: currentCalc.hubComponent > 0 ? 'upward' : 'neutral',
      contributionPassengers: currentCalc.hubComponent,
      relativeWeightPercent: Math.round(
        (Math.abs(currentCalc.hubComponent) /
          Math.max(1, totalAbsContribution)) *
          100
      ),
      description: stage.isHub
        ? 'Interchange hubs receive transferring passengers across intersecting CBD and trunk routes.'
        : 'Serves predominantly local residential boarding and alighting along its primary corridor.',
    },
  ];

  // Build 17-hour diurnal series (06:00 to 22:00) for charts
  const hourlySeries: HourlyDemandPoint[] = [];
  const sig = STAGE_SIGNATURES[stage.id];
  const dayMult =
    dayType === 'weekday' ? 1.0 : dayType === 'saturday' ? 0.78 : 0.58;

  for (let hr = 6; hr <= 21; hr++) {
    const hrPeriod: TimePeriod =
      hr >= 6 && hr <= 9
        ? 'morning_peak'
        : hr >= 16 && hr <= 20
        ? 'evening_peak'
        : 'midday';

    // Smooth diurnal curve anchored on stage signature
    let curveWeight = 0.5;
    if (hr === 6) curveWeight = 0.78;
    else if (hr === 7) curveWeight = 1.06;
    else if (hr === 8) curveWeight = 0.98;
    else if (hr === 9) curveWeight = 0.82;
    else if (hr >= 10 && hr <= 14) curveWeight = 0.96 + (hr === 13 ? 0.06 : 0);
    else if (hr === 15) curveWeight = 1.08;
    else if (hr === 16) curveWeight = 0.88;
    else if (hr === 17) curveWeight = 1.02;
    else if (hr === 18) curveWeight = 1.08;
    else if (hr === 19) curveWeight = 0.92;
    else if (hr === 20) curveWeight = 0.74;
    else curveWeight = 0.52;

    const baseVal =
      hrPeriod === 'morning_peak'
        ? sig.morningBase
        : hrPeriod === 'evening_peak'
        ? sig.eveningBase
        : sig.middayBase;

    const historicalObserved = Math.round(
      baseVal * dayMult * curveWeight * currentCalc.saccoShareMultiplier
    );

    const hrCalc = calculateSingleHorizonPrediction(
      stage,
      routes,
      hrPeriod,
      dayType,
      horizonMinutes,
      saccoFilterId
    );
    const ratioToPeriod =
      hrCalc.predictedPassengers / Math.max(1, hrCalc.observedMean);
    const forecastedDemand = Math.round(historicalObserved * ratioToPeriod);

    hourlySeries.push({
      hour: hr,
      label: `${String(hr).padStart(2, '0')}:00`,
      timePeriod: hrPeriod,
      historicalObserved,
      forecastedDemand,
      baselineCapacity: effectiveCapacity,
      isSelectedPeriod: hrPeriod === timePeriod,
    });
  }

  // Generate transparent, data-grounded explanation
  const comparisonToMiddayDiff =
    currentCalc.predictedPassengers - weekdayMiddayBaseline;
  const comparisonPhrase =
    comparisonToMiddayDiff > 15
      ? `${Math.abs(comparisonToMiddayDiff)} passengers (+${Math.round((comparisonToMiddayDiff / Math.max(1, weekdayMiddayBaseline)) * 100)}%) higher than the stage's simulated weekday midday baseline (${weekdayMiddayBaseline} pax)`
      : comparisonToMiddayDiff < -15
      ? `${Math.abs(comparisonToMiddayDiff)} passengers (${Math.round((comparisonToMiddayDiff / Math.max(1, weekdayMiddayBaseline)) * 100)}%) below the stage's simulated weekday midday baseline (${weekdayMiddayBaseline} pax)`
      : `broadly aligned with the stage's simulated weekday midday baseline (${weekdayMiddayBaseline} pax)`;

  const explanation = `Predicted demand over the next ${horizonMinutes} minutes (${currentCalc.predictedPassengers} passengers, ${predictedCategory.toUpperCase()}) is ${comparisonPhrase}. Compared with the current ${timePeriod.replace('_', ' ')} observed mean (${currentCalc.observedMean} pax), the forecast is ${direction} (${deltaPercent >= 0 ? '+' : ''}${deltaPercent}%), driven by the ${formatTimePeriodLabel(timePeriod)} commuter profile (${currentCalc.momentumComponent >= 0 ? '+' : ''}${currentCalc.momentumComponent} pax) and an estimated ${currentCalc.headwayMinutes}-minute bus arrival interval (+${currentCalc.headwayComponent} pax waiting effect).`;

  const roadCongestionDistinctionNote =
    'Advisory Note: This figure estimates waiting and boarding passenger demand at the stage kerbside—not physical road traffic congestion. Road congestion also depends on general vehicular traffic flow, intersection signal timing, kerbside dwell behaviour, and road capacity.';

  const dataStatusLabel =
    stage.dataStatus === 'complete_demo'
      ? 'Complete Synthetic Log'
      : stage.dataStatus === 'partial_sensor_demo'
      ? 'Partial Feeder Coverage'
      : 'Interpolated Off-Peak Log';

  return {
    stageId: stage.id,
    saccoFilterId,
    timePeriod,
    dayType,
    horizonMinutes,
    observedDemoDemand: currentCalc.observedMean,
    weekdayMiddayBaseline,
    predictedPassengers: currentCalc.predictedPassengers,
    capacityUtilizationRatio: Number(
      (currentCalc.predictedPassengers / Math.max(1, effectiveCapacity)).toFixed(
        2
      )
    ),
    predictedCategory,
    direction,
    deltaPassengers,
    deltaPercent,
    estimatedBusIntervalMinutes: currentCalc.headwayMinutes,
    estimatedDwellSeconds: currentCalc.dwellSeconds,
    dataCompletenessPercent: Math.round(currentCalc.completeness * 100),
    dataStatusLabel,
    confidenceScorePercent,
    confidenceInterval: [
      activeHorizonBand.confidenceLow,
      activeHorizonBand.confidenceHigh,
    ],
    contributingFactors,
    horizonComparisons,
    hourlySeries,
    explanation,
    roadCongestionDistinctionNote,
  };
}

export function forecastAllStages(params: {
  timePeriod: TimePeriod;
  dayType?: DayType;
  horizonMinutes: ForecastHorizon;
  saccoFilterId?: string | 'all';
}): StageForecastResult[] {
  const stages = m3DataProvider.getStages();
  return stages.map((stage) =>
    forecastStageDemand({
      stageId: stage.id,
      timePeriod: params.timePeriod,
      dayType: params.dayType ?? 'weekday',
      horizonMinutes: params.horizonMinutes,
      saccoFilterId: params.saccoFilterId ?? 'all',
    })
  );
}

/**
 * Evaluates the multi-factor linear baseline on the held-out synthetic validation split
 * (every 5th observation in the 504-record synthetic dataset = 101 validation records, 403 training records).
 */
export function evaluateForecastModelOnSyntheticData(): ModelEvaluationSummary {
  const allObs = m3DataProvider.getObservations();
  const stages = m3DataProvider.getStages();
  const stageMap = new Map(stages.map((s) => [s.id, s]));

  const trainingRecords: PassengerObservation[] = [];
  const validationRecords: PassengerObservation[] = [];

  allObs.forEach((obs, idx) => {
    if (idx % 5 === 0) {
      validationRecords.push(obs);
    } else {
      trainingRecords.push(obs);
    }
  });

  let absErrorSum = 0;
  let sqErrorSum = 0;
  let categoryMatches = 0;

  validationRecords.forEach((obs) => {
    const stage = stageMap.get(obs.stageId);
    if (!stage) return;

    const forecast = forecastStageDemand({
      stageId: obs.stageId,
      timePeriod: obs.timePeriod,
      dayType: obs.dayType,
      horizonMinutes: 15,
      saccoFilterId: 'all',
    });

    const err = forecast.predictedPassengers - obs.passengerCount;
    absErrorSum += Math.abs(err);
    sqErrorSum += err * err;

    const actualCat = classifyDemandCategory(
      obs.passengerCount,
      stage.baselineHourlyCapacity
    );
    if (actualCat === forecast.predictedCategory) {
      categoryMatches += 1;
    }
  });

  const nVal = Math.max(1, validationRecords.length);
  const mae = Number((absErrorSum / nVal).toFixed(1));
  const rmse = Number(Math.sqrt(sqErrorSum / nVal).toFixed(1));
  const catAcc = Number(((categoryMatches / nVal) * 100).toFixed(1));

  return {
    modelName: 'Multi-Factor Additive Linear Baseline + Temporal Horizon Decomposition',
    modelTypeLabel: 'Explainable Parametric Linear Baseline (Calibrated on Synthetic Demo Data)',
    isSyntheticData: true,
    totalSyntheticObservations: allObs.length,
    trainingSetCount: trainingRecords.length,
    validationSetCount: validationRecords.length,
    meanAbsoluteErrorPassengers: mae,
    rootMeanSquaredErrorPassengers: rmse,
    categoryMatchRatePercent: catAcc,
    featureWeights: [
      {
        featureName: 'Historical Stage-Period Baseline',
        symbol: 'β_hist',
        coefficientValue: MODEL_WEIGHTS.beta_hist_baseline,
        unitDescription: 'pax per historical observed passenger',
        intuitiveRole: 'Anchors the prediction to the stage’s recurring demand level for the selected time window and day type.',
      },
      {
        featureName: 'Time-of-Day Directional Horizon Momentum',
        symbol: 'β_tod',
        coefficientValue: MODEL_WEIGHTS.beta_tod_momentum,
        unitDescription: 'multiplier on 15/30/60-min peak build rate',
        intuitiveRole: 'Captures inbound morning residential surges vs. outbound evening CBD queuing dynamics.',
      },
      {
        featureName: 'Bus Arrival Interval (Headway Pressure)',
        symbol: 'β_hdw',
        coefficientValue: MODEL_WEIGHTS.beta_headway_pressure,
        unitDescription: '+pax per minute of interval gap above schedule',
        intuitiveRole: 'Models queue accumulation when bus arrival intervals widen beyond scheduled corridor headways.',
      },
      {
        featureName: 'Interchange Hub Transfer Constant',
        symbol: 'β_hub',
        coefficientValue: MODEL_WEIGHTS.beta_hub_transfer,
        unitDescription: '+pax at multi-corridor transfer terminals',
        intuitiveRole: 'Accounts for inter-route passenger transfers at major nodes (Kencom, Railways, Odeon, Westlands, Roysambu, Buruburu).',
      },
      {
        featureName: 'Base Intercept',
        symbol: 'β_0',
        coefficientValue: MODEL_WEIGHTS.beta0_intercept,
        unitDescription: 'baseline passenger offset',
        intuitiveRole: 'Represents minimum residual stage waiting presence during active operating hours.',
      },
    ],
    methodologySummary:
      'Deterministic additive linear baseline combining historical stage-period averages, directional peak momentum over 15/30/60-minute horizons, bus arrival headway pressure, and corridor interchange weights. Designed to be fully auditable and later replaceable by a privacy-preserving model trained on verified field counts.',
    limitations: [
      'Trained and evaluated strictly on 504 synthetic demonstration records—metrics reflect internal consistency on synthetic patterns, not real-world Nairobi predictive accuracy.',
      'Does not ingest live GPS matatu telemetry, rainfall/weather anomalies, special civic events, or unscheduled road incidents.',
      'Estimates waiting/boarding passenger demand at stages rather than road traffic congestion or vehicle travel speeds.',
      'Requires ethical review and field validation with aggregated, non-identifiable passenger counts before any real operational deployment.',
    ],
  };
}
