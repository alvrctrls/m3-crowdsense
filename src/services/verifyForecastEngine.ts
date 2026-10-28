import {
  evaluateForecastModelOnSyntheticData,
  forecastAllStages,
  forecastStageDemand,
} from './demandForecastService';
import {
  generateOverviewInsights,
  generateSaccoRecommendations,
} from './insightsAndPlanningService';
import { DemoM3DataProvider } from './m3DataProvider';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Verification failed: ${message}`);
  }
}

export function runVerificationSuite() {
  const provider = new DemoM3DataProvider();
  const status = provider.getProviderStatus();
  assert(
    status.displayBadge === 'm3 CONNECTION: DEMO MODE',
    'Provider badge must be m3 CONNECTION: DEMO MODE when unconfigured'
  );
  assert(provider.getStages().length === 12, 'Expected 12 Nairobi demo stages');
  assert(provider.getSaccos().length === 6, 'Expected 6 Nairobi demo SACCOs');
  assert(provider.getRoutes().length === 10, 'Expected 10 Nairobi demo routes');
  assert(
    provider.getObservations().length === 504,
    'Expected 504 deterministic historical observations'
  );

  // 1. Reproducibility check
  const runA = forecastStageDemand({
    stageId: 'stg-kencom',
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  const runB = forecastStageDemand({
    stageId: 'stg-kencom',
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  assert(
    runA.predictedPassengers === runB.predictedPassengers &&
      runA.explanation === runB.explanation,
    'Forecast engine must be 100% deterministic for identical inputs'
  );

  // 2. Horizon sensitivity check (15m vs 30m vs 60m)
  const h15 = forecastStageDemand({
    stageId: 'stg-kencom',
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 15,
  });
  const h30 = forecastStageDemand({
    stageId: 'stg-kencom',
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  const h60 = forecastStageDemand({
    stageId: 'stg-kencom',
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 60,
  });
  assert(
    h15.predictedPassengers < h30.predictedPassengers &&
      h30.predictedPassengers < h60.predictedPassengers,
    'Evening peak forecast at Kencom must scale consistently across 15m, 30m, and 60m horizons'
  );

  // 3. Time-period sensitivity check
  const morningAll = forecastAllStages({
    timePeriod: 'morning_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  const middayAll = forecastAllStages({
    timePeriod: 'midday',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  const eveningAll = forecastAllStages({
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  const sumMidday = middayAll.reduce((s, f) => s + f.predictedPassengers, 0);
  const sumEvening = eveningAll.reduce((s, f) => s + f.predictedPassengers, 0);
  assert(
    sumEvening > sumMidday && morningAll.length === 12,
    'Evening peak network demand must exceed midday off-peak baseline'
  );

  // 4. Overview insights & SACCO recommendations responsiveness
  const insightsEvening = generateOverviewInsights({
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  assert(
    insightsEvening.length >= 3,
    'Overview insights should generate at least 3 dynamic observations'
  );

  const saccoA = generateSaccoRecommendations({
    saccoId: 'sacco-supermetro',
    timePeriod: 'morning_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  const saccoB = generateSaccoRecommendations({
    saccoId: 'sacco-forward',
    timePeriod: 'evening_peak',
    dayType: 'weekday',
    horizonMinutes: 30,
  });
  assert(
    saccoA.recommendations[0].title !== saccoB.recommendations[0].title,
    'SACCO recommendations must respond to different SACCO and time period selections'
  );
  assert(
    saccoA.recommendations.some(
      (r) => r.category === 'accessibility_preservation'
    ),
    'SACCO recommendations must include an accessibility & service equity safeguard'
  );

  // 5. Model evaluation metrics check
  const evalSummary = evaluateForecastModelOnSyntheticData();
  assert(
    evalSummary.isSyntheticData === true &&
      evalSummary.trainingSetCount === 403 &&
      evalSummary.validationSetCount === 101,
    'Model evaluation summary must report 403 training and 101 validation synthetic records'
  );

  console.log('ALL CROWDSENSE VERIFICATION CHECKS PASSED:', {
    kencomEvening15m: h15.predictedPassengers,
    kencomEvening30m: h30.predictedPassengers,
    kencomEvening60m: h60.predictedPassengers,
    syntheticMAE: evalSummary.meanAbsoluteErrorPassengers,
    syntheticRMSE: evalSummary.rootMeanSquaredErrorPassengers,
    categoryAgreementPct: evalSummary.categoryMatchRatePercent,
  });
}

runVerificationSuite();
