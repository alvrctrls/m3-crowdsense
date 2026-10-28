import {
  AIInsightItem,
  DayType,
  ForecastHorizon,
  OperationalRecommendation,
  StageForecastResult,
  TimePeriod,
} from '../types/transport';
import {
  formatTimePeriodLabel,
  forecastAllStages,
} from './demandForecastService';
import { m3DataProvider } from './m3DataProvider';

/**
 * Generates dynamic AI Insights for the Overview page directly from the active
 * synthetic dataset and forecast calculations.
 */
export function generateOverviewInsights(params: {
  timePeriod: TimePeriod;
  dayType: DayType;
  horizonMinutes: ForecastHorizon;
  saccoFilterId?: string | 'all';
}): AIInsightItem[] {
  const stages = m3DataProvider.getStages();
  const stageMap = new Map(stages.map((s) => [s.id, s]));

  const allForecasts = forecastAllStages({
    timePeriod: params.timePeriod,
    dayType: params.dayType,
    horizonMinutes: params.horizonMinutes,
    saccoFilterId: params.saccoFilterId ?? 'all',
  });

  // Filter by SACCO if selected
  const relevantForecasts =
    params.saccoFilterId && params.saccoFilterId !== 'all'
      ? allForecasts.filter((f) => {
          const stg = stageMap.get(f.stageId);
          return stg ? stg.saccoIds.includes(params.saccoFilterId!) : true;
        })
      : allForecasts;

  const sortedByDemand = [...relevantForecasts].sort(
    (a, b) => b.predictedPassengers - a.predictedPassengers
  );

  const sortedByGrowth = [...relevantForecasts].sort(
    (a, b) => b.deltaPercent - a.deltaPercent
  );

  const sortedByHeadwayPressure = [...relevantForecasts].sort(
    (a, b) =>
      b.estimatedBusIntervalMinutes * b.capacityUtilizationRatio -
      a.estimatedBusIntervalMinutes * a.capacityUtilizationRatio
  );

  const insights: AIInsightItem[] = [];
  const usedStages = new Set<string>();

  // 1. Highest volume / rising peak stage insight
  const topRise = sortedByGrowth[0] ?? sortedByDemand[0];
  if (topRise) {
    const stg = stageMap.get(topRise.stageId)!;
    usedStages.add(stg.id);
    const periodWords =
      params.timePeriod === 'evening_peak'
        ? 'the evening peak'
        : params.timePeriod === 'morning_peak'
        ? 'the morning peak'
        : 'the midday window';

    insights.push({
      id: `ins-rise-${stg.id}-${params.timePeriod}-${params.horizonMinutes}`,
      stageId: stg.id,
      stageName: stg.name,
      corridor: stg.corridor,
      severity: topRise.predictedCategory,
      headline: `Simulated demand is expected to ${topRise.deltaPercent >= 0 ? 'rise' : 'adjust'} at ${stg.name} during ${periodWords}.`,
      detail: `Projected at ${topRise.predictedPassengers} waiting passengers over the next ${params.horizonMinutes} min (${topRise.deltaPercent >= 0 ? '+' : ''}${topRise.deltaPercent}% vs. observed period average of ${topRise.observedDemoDemand} pax).`,
      metricBadge: `${topRise.predictedPassengers} pax · ${topRise.deltaPercent >= 0 ? '+' : ''}${topRise.deltaPercent}%`,
      timePeriod: params.timePeriod,
      horizonMinutes: params.horizonMinutes,
    });
  }

  // 2. Highest absolute capacity utilization insight
  const topCapacity =
    sortedByDemand.find((f) => !usedStages.has(f.stageId)) ?? sortedByDemand[0];
  if (topCapacity) {
    const stg = stageMap.get(topCapacity.stageId)!;
    usedStages.add(stg.id);
    const utilPct = Math.round(topCapacity.capacityUtilizationRatio * 100);
    insights.push({
      id: `ins-cap-${stg.id}-${params.timePeriod}-${params.horizonMinutes}`,
      stageId: stg.id,
      stageName: stg.name,
      corridor: stg.corridor,
      severity: topCapacity.predictedCategory,
      headline: `${stg.name} shows ${utilPct}% simulated stage capacity pressure (${topCapacity.predictedCategory.toUpperCase()}).`,
      detail: `Estimated ${topCapacity.predictedPassengers} passengers against a ${stg.baselineHourlyCapacity} pax reference capacity, with ~${topCapacity.estimatedDwellSeconds}s kerbside dwell times.`,
      metricBadge: `${utilPct}% capacity ratio`,
      timePeriod: params.timePeriod,
      horizonMinutes: params.horizonMinutes,
    });
  }

  // 3. Headway / arrival interval pressure insight
  const topHeadway =
    sortedByHeadwayPressure.find((f) => !usedStages.has(f.stageId)) ??
    sortedByHeadwayPressure[0];
  if (topHeadway) {
    const stg = stageMap.get(topHeadway.stageId)!;
    usedStages.add(stg.id);
    insights.push({
      id: `ins-hdw-${stg.id}-${params.timePeriod}-${params.horizonMinutes}`,
      stageId: stg.id,
      stageName: stg.name,
      corridor: stg.corridor,
      severity: topHeadway.predictedCategory,
      headline: `Arrival intervals of ~${topHeadway.estimatedBusIntervalMinutes} min contribute to queue buildup at ${stg.name}.`,
      detail: `Along ${stg.corridor}, bus arrival spacing accounts for +${topHeadway.contributingFactors.find((c) => c.id === 'factor-headway')?.contributionPassengers ?? 12} simulated waiting passengers in the ${params.horizonMinutes}-min forecast.`,
      metricBadge: `${topHeadway.estimatedBusIntervalMinutes}m interval`,
      timePeriod: params.timePeriod,
      horizonMinutes: params.horizonMinutes,
    });
  }

  // 4. Comparative lower-pressure / balanced corridor insight
  const lowestPressure = [...relevantForecasts]
    .reverse()
    .find((f) => !usedStages.has(f.stageId));
  if (lowestPressure) {
    const stg = stageMap.get(lowestPressure.stageId)!;
    insights.push({
      id: `ins-bal-${stg.id}-${params.timePeriod}-${params.horizonMinutes}`,
      stageId: stg.id,
      stageName: stg.name,
      corridor: stg.corridor,
      severity: lowestPressure.predictedCategory,
      headline: `${stg.name} remains in the ${lowestPressure.predictedCategory} demand band (${lowestPressure.predictedPassengers} pax).`,
      detail: `Baseline feeder service along ${stg.corridor} should be maintained to preserve predictable commuter connections (${stg.dataStatus === 'complete_demo' ? '94%+ sample completeness' : 'interpolated feeder coverage'}).`,
      metricBadge: `${lowestPressure.predictedPassengers} pax (${lowestPressure.predictedCategory})`,
      timePeriod: params.timePeriod,
      horizonMinutes: params.horizonMinutes,
    });
  }

  return insights;
}

/**
 * Generates advisory operational recommendations for a selected SACCO,
 * derived directly from the SACCO's associated routes, stages, and forecast outputs.
 * Explicitly preserves accessibility and service equity (never recommends cutting low-demand stages).
 */
export function generateSaccoRecommendations(params: {
  saccoId: string;
  timePeriod: TimePeriod;
  dayType: DayType;
  horizonMinutes: ForecastHorizon;
}): {
  saccoForecasts: StageForecastResult[];
  recommendations: OperationalRecommendation[];
} {
  const saccos = m3DataProvider.getSaccos();
  const stages = m3DataProvider.getStages();
  const routes = m3DataProvider.getRoutes();

  const sacco = saccos.find((s) => s.id === params.saccoId) ?? saccos[0];
  const saccoStages = stages.filter((stg) =>
    sacco.stageIds.includes(stg.id)
  );
  const saccoRoutes = routes.filter((rt) =>
    sacco.routeIds.includes(rt.id)
  );

  const saccoForecasts = saccoStages.map((stg) =>
    forecastAllStages({
      timePeriod: params.timePeriod,
      dayType: params.dayType,
      horizonMinutes: params.horizonMinutes,
      saccoFilterId: sacco.id,
    }).find((f) => f.stageId === stg.id)!
  );

  const sortedHigh = [...saccoForecasts].sort(
    (a, b) => b.predictedPassengers - a.predictedPassengers
  );

  const recommendations: OperationalRecommendation[] = [];

  // 1. High-demand frequency review on the SACCO's busiest stage for this time period
  const busiest = sortedHigh[0];
  if (busiest) {
    const stg = saccoStages.find((s) => s.id === busiest.stageId)!;
    const matchingRoute =
      saccoRoutes.find((r) => r.stageIds.includes(stg.id)) ?? saccoRoutes[0];

    recommendations.push({
      id: `rec-freq-${sacco.id}-${stg.id}-${params.timePeriod}`,
      saccoId: sacco.id,
      saccoName: sacco.name,
      stageId: stg.id,
      stageName: stg.name,
      routeId: matchingRoute?.id,
      routeCode: matchingRoute?.routeNumber,
      category: 'frequency_review',
      priority:
        busiest.predictedCategory === 'high'
          ? 'high_attention'
          : 'moderate_review',
      title: `Review ${sacco.name} dispatch frequency at ${stg.name} during ${formatTimePeriodLabel(params.timePeriod)}`,
      advisoryAction: `Advisory: Review whether departure intervals on ${matchingRoute?.routeNumber ?? 'associated routes'} (${stg.corridor}) can be tightened toward ${Math.max(3, Math.round(busiest.estimatedBusIntervalMinutes - 1.5))}–${Math.round(busiest.estimatedBusIntervalMinutes)} minutes over the next ${params.horizonMinutes}-minute window to moderate waiting queue growth.`,
      supportingDataExplanation: `Supported by ${sacco.name}'s synthetic stage forecast at ${stg.name}: ${busiest.predictedPassengers} predicted waiting passengers (${busiest.deltaPercent >= 0 ? '+' : ''}${busiest.deltaPercent}% vs. observed period baseline of ${busiest.observedDemoDemand} pax) and an estimated ${busiest.estimatedBusIntervalMinutes}-minute bus arrival interval.`,
      unavailableInformationNote:
        'Unavailable data: Real-time vehicle GPS locations, turnaround delays in CBD traffic, and driver shift availability are not tracked in this demonstration dataset.',
      accessibilityAndEquityNote:
        'Any schedule review should preserve predictable boarding intervals at downstream intermediate stages rather than running express-only bypass trips.',
    });
  }

  // 2. Vehicle capacity / load factor assessment at second busiest stage
  const secondBusiest = sortedHigh[1] ?? sortedHigh[0];
  if (secondBusiest) {
    const stg = saccoStages.find((s) => s.id === secondBusiest.stageId)!;
    const matchingRoute =
      saccoRoutes.find((r) => r.stageIds.includes(stg.id)) ?? saccoRoutes[0];
    const approxCoachLoads = Math.ceil(
      secondBusiest.predictedPassengers / Math.max(14, sacco.typicalVehicleCapacity)
    );

    recommendations.push({
      id: `rec-cap-${sacco.id}-${stg.id}-${params.timePeriod}`,
      saccoId: sacco.id,
      saccoName: sacco.name,
      stageId: stg.id,
      stageName: stg.name,
      routeId: matchingRoute?.id,
      routeCode: matchingRoute?.routeNumber,
      category: 'capacity_assessment',
      priority:
        secondBusiest.predictedCategory === 'high'
          ? 'high_attention'
          : 'moderate_review',
      title: `Assess vehicle capacity allocation along ${stg.corridor} (${stg.name})`,
      advisoryAction: `Advisory: Investigate whether ${sacco.name}'s typical ${sacco.typicalVehicleCapacity}-seat capacity units on ${matchingRoute?.routeNumber ?? stg.corridor} align with the projected ${secondBusiest.predictedPassengers}-passenger queue (~${approxCoachLoads} vehicle loads per 30-min window).`,
      supportingDataExplanation: `Derived from ${stg.name} capacity utilization ratio (${Math.round(secondBusiest.capacityUtilizationRatio * 100)}%) and historical ${params.dayType} ${params.timePeriod.replace('_', ' ')} boarding patterns (${secondBusiest.dataCompletenessPercent}% synthetic record completeness).`,
      unavailableInformationNote:
        'Unavailable data: Through-passenger occupancy onboard vehicles arriving from upstream stages and actual farebox load factors are not available.',
      accessibilityAndEquityNote:
        'Ensure boarding access for passengers with mobility needs, parents with children, and luggage-carrying commuters during high-load windows.',
    });
  }

  // 3. Dwell time & kerbside coordination where dwell time is highest
  const highestDwell = [...saccoForecasts].sort(
    (a, b) => b.estimatedDwellSeconds - a.estimatedDwellSeconds
  )[0];
  if (highestDwell) {
    const stg = saccoStages.find((s) => s.id === highestDwell.stageId)!;
    recommendations.push({
      id: `rec-dwell-${sacco.id}-${stg.id}-${params.timePeriod}`,
      saccoId: sacco.id,
      saccoName: sacco.name,
      stageId: stg.id,
      stageName: stg.name,
      category: 'dwell_time_investigation',
      priority: 'moderate_review',
      title: `Investigate stage dwell times and bay turnover at ${stg.name}`,
      advisoryAction: `Advisory: Review stage marshalling and boarding queue organization at ${stg.name}, where simulated kerbside dwell times reach ~${highestDwell.estimatedDwellSeconds} seconds during ${formatTimePeriodLabel(params.timePeriod)}.`,
      supportingDataExplanation: `Calculated from synthetic dwell-time observations (~${highestDwell.estimatedDwellSeconds}s) coinciding with ${highestDwell.predictedPassengers} waiting passengers and ${stg.saccoIds.length} demonstration SACCOs sharing the stage bay.`,
      unavailableInformationNote:
        'Unavailable data: Physical bay occupancy conflicts with other operators, pedestrian crossing friction, and municipal enforcement activity are not measured.',
      accessibilityAndEquityNote:
        'Dwell-time reviews must prioritize safe passenger boarding and alighting rather than rushing kerbside stops.',
    });
  }

  // 4. Accessibility & Service Equity safeguard for lower-demand or community link stage
  const communityStageForecast =
    [...saccoForecasts]
      .reverse()
      .find((f) => {
        const stg = saccoStages.find((s) => s.id === f.stageId);
        return stg?.accessibilityPriority === 'essential_community_link';
      }) ?? sortedHigh[sortedHigh.length - 1];

  if (communityStageForecast) {
    const stg = saccoStages.find(
      (s) => s.id === communityStageForecast.stageId
    )!;
    const matchingRoute =
      saccoRoutes.find((r) => r.stageIds.includes(stg.id)) ?? saccoRoutes[0];

    recommendations.push({
      id: `rec-equity-${sacco.id}-${stg.id}-${params.timePeriod}`,
      saccoId: sacco.id,
      saccoName: sacco.name,
      stageId: stg.id,
      stageName: stg.name,
      routeId: matchingRoute?.id,
      routeCode: matchingRoute?.routeNumber,
      category: 'accessibility_preservation',
      priority: 'equity_safeguard',
      title: `Protect baseline service coverage and community accessibility at ${stg.name}`,
      advisoryAction: `Advisory Safeguard: Maintain reliable baseline departures on ${matchingRoute?.routeNumber ?? stg.corridor} serving ${stg.name} (${communityStageForecast.predictedPassengers} predicted pax, ${communityStageForecast.predictedCategory.toUpperCase()} category). Do not withdraw vehicles from lower-volume or feeder windows to chase peak surges elsewhere.`,
      supportingDataExplanation: `Supported by stage profile classification (${stg.accessibilityPriority.replace(/_/g, ' ')}) and ${communityStageForecast.predictedPassengers} simulated commuters relying on ${stg.corridor} during ${formatTimePeriodLabel(params.timePeriod)}.`,
      unavailableInformationNote:
        'Unavailable data: Walking distance to alternative corridors, commuter household income sensitivity, and late-evening safety conditions are not captured in raw count logs.',
      accessibilityAndEquityNote:
        'People First Principle: Low or moderate predicted demand must never be used to justify removing public transport service from communities with limited mobility alternatives.',
    });
  }

  return {
    saccoForecasts,
    recommendations,
  };
}
