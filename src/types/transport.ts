export type TimePeriod = 'morning_peak' | 'midday' | 'evening_peak';

export type DayType = 'weekday' | 'saturday' | 'sunday';

export type ForecastHorizon = 15 | 30 | 60;

export type DemandCategory = 'low' | 'moderate' | 'high';

export type ForecastDirection = 'rising' | 'stable' | 'easing';

export type DashboardSection =
  | 'overview'
  | 'map'
  | 'stages'
  | 'forecasts'
  | 'sacco'
  | 'data';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface TransportStage {
  id: string;
  code: string;
  name: string;
  corridor: string;
  neighbourhood: string;
  coordinates: GeoCoordinates;
  saccoIds: string[];
  routeIds: string[];
  baselineHourlyCapacity: number;
  isHub: boolean;
  accessibilityPriority: 'standard' | 'essential_community_link' | 'major_interchange';
  infrastructureNotes: string;
  dataStatus: 'complete_demo' | 'partial_sensor_demo' | 'interpolated_demo';
  missingFieldsNote?: string;
}

export interface TransportRoute {
  id: string;
  routeNumber: string;
  name: string;
  corridor: string;
  originStageId: string;
  destinationStageId: string;
  stageIds: string[];
  saccoIds: string[];
  scheduledHeadwayMinutes: {
    morning_peak: number;
    midday: number;
    evening_peak: number;
  };
  distanceKm: number;
}

export interface SaccoOperator {
  id: string;
  code: string;
  name: string;
  primaryCorridors: string[];
  routeIds: string[];
  stageIds: string[];
  demoActiveVehicles: number;
  typicalVehicleCapacity: number;
  serviceCoverageNote: string;
}

export interface PassengerObservation {
  id: string;
  stageId: string;
  routeId: string;
  saccoId: string;
  timestamp: string;
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  dayType: DayType;
  hour: number; // 5 to 22
  timePeriod: TimePeriod;
  passengerCount: number; // Aggregated waiting/boarding passengers per 30-min window
  busArrivalIntervalMinutes: number;
  dwellTimeSeconds: number;
  dataCompleteness: number; // 0.0 to 1.0
}

export interface ContributingFactor {
  id: string;
  label: string;
  valueLabel: string;
  impactDirection: 'upward' | 'downward' | 'neutral';
  contributionPassengers: number;
  relativeWeightPercent: number;
  description: string;
}

export interface HourlyDemandPoint {
  hour: number;
  label: string;
  timePeriod: TimePeriod;
  historicalObserved: number;
  forecastedDemand: number;
  baselineCapacity: number;
  isSelectedPeriod: boolean;
}

export interface HorizonComparisonPoint {
  horizonMinutes: ForecastHorizon;
  predictedPassengers: number;
  predictedCategory: DemandCategory;
  headwayMinutes: number;
  confidenceLow: number;
  confidenceHigh: number;
  deltaFromObservedPercent: number;
}

export interface StageForecastResult {
  stageId: string;
  saccoFilterId: string | 'all';
  timePeriod: TimePeriod;
  dayType: DayType;
  horizonMinutes: ForecastHorizon;
  observedDemoDemand: number;
  weekdayMiddayBaseline: number;
  predictedPassengers: number;
  capacityUtilizationRatio: number;
  predictedCategory: DemandCategory;
  direction: ForecastDirection;
  deltaPassengers: number;
  deltaPercent: number;
  estimatedBusIntervalMinutes: number;
  estimatedDwellSeconds: number;
  dataCompletenessPercent: number;
  dataStatusLabel: string;
  confidenceScorePercent: number;
  confidenceInterval: [number, number];
  contributingFactors: ContributingFactor[];
  horizonComparisons: HorizonComparisonPoint[];
  hourlySeries: HourlyDemandPoint[];
  explanation: string;
  roadCongestionDistinctionNote: string;
}

export interface AIInsightItem {
  id: string;
  stageId: string;
  stageName: string;
  corridor: string;
  severity: DemandCategory;
  headline: string;
  detail: string;
  metricBadge: string;
  timePeriod: TimePeriod;
  horizonMinutes: ForecastHorizon;
}

export interface OperationalRecommendation {
  id: string;
  saccoId: string;
  saccoName: string;
  stageId: string;
  stageName: string;
  routeId?: string;
  routeCode?: string;
  category:
    | 'frequency_review'
    | 'capacity_assessment'
    | 'dwell_time_investigation'
    | 'accessibility_preservation';
  priority: 'high_attention' | 'moderate_review' | 'equity_safeguard';
  title: string;
  advisoryAction: string;
  supportingDataExplanation: string;
  unavailableInformationNote: string;
  accessibilityAndEquityNote: string;
}

export interface ModelFeatureWeight {
  featureName: string;
  symbol: string;
  coefficientValue: number;
  unitDescription: string;
  intuitiveRole: string;
}

export interface ModelEvaluationSummary {
  modelName: string;
  modelTypeLabel: string;
  isSyntheticData: boolean;
  totalSyntheticObservations: number;
  trainingSetCount: number;
  validationSetCount: number;
  meanAbsoluteErrorPassengers: number;
  rootMeanSquaredErrorPassengers: number;
  categoryMatchRatePercent: number;
  featureWeights: ModelFeatureWeight[];
  methodologySummary: string;
  limitations: string[];
}

export interface M3ProviderStatus {
  mode: 'DEMO_MODE' | 'HTTP_CONFIGURED';
  displayBadge: string;
  configuredBaseUrl: string | null;
  lastSyncIso: string;
  isLiveConnected: boolean;
  providerDescription: string;
}

export interface IM3DataProvider {
  getProviderStatus(): M3ProviderStatus;
  getStages(): TransportStage[];
  getRoutes(): TransportRoute[];
  getSaccos(): SaccoOperator[];
  getObservations(): PassengerObservation[];
}
