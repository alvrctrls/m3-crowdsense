import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  evaluateForecastModelOnSyntheticData,
  forecastAllStages,
  forecastStageDemand,
} from '../services/demandForecastService';
import {
  generateOverviewInsights,
  generateSaccoRecommendations,
} from '../services/insightsAndPlanningService';
import { m3DataProvider } from '../services/m3DataProvider';
import {
  AIInsightItem,
  DashboardSection,
  DayType,
  DemandCategory,
  ForecastHorizon,
  M3ProviderStatus,
  ModelEvaluationSummary,
  OperationalRecommendation,
  PassengerObservation,
  SaccoOperator,
  StageForecastResult,
  TimePeriod,
  TransportRoute,
  TransportStage,
} from '../types/transport';

interface SummaryMetrics {
  monitoredStagesCount: number;
  highDemandStagesCount: number;
  moderateDemandStagesCount: number;
  lowDemandStagesCount: number;
  networkPredictedPassengers: number;
  networkObservedBaseline: number;
  networkDeltaPercent: number;
  overallNetworkDemandCategory: DemandCategory;
  averageConfidencePercent: number;
}

interface CrowdSenseContextValue {
  // Navigation
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;

  // Shared Global Filters & Selections
  selectedTimePeriod: TimePeriod;
  setSelectedTimePeriod: (period: TimePeriod) => void;
  selectedDayType: DayType;
  setSelectedDayType: (day: DayType) => void;
  selectedHorizon: ForecastHorizon;
  setSelectedHorizon: (horizon: ForecastHorizon) => void;
  selectedStageId: string;
  setSelectedStageId: (stageId: string) => void;
  selectedSaccoFilter: string | 'all';
  setSelectedSaccoFilter: (saccoId: string | 'all') => void;
  selectedPlanningSaccoId: string;
  setSelectedPlanningSaccoId: (saccoId: string) => void;
  selectedDemandCategoryFilter: 'all' | DemandCategory;
  setSelectedDemandCategoryFilter: (cat: 'all' | DemandCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Cross-view navigation actions
  navigateToStageInsights: (stageId: string) => void;
  navigateToStageOnMap: (stageId: string) => void;
  navigateToStageForecast: (stageId: string) => void;
  navigateToSaccoPlanning: (saccoId: string) => void;
  resetAllFilters: () => void;

  // Underlying Entities from m3DataProvider
  providerStatus: M3ProviderStatus;
  stages: TransportStage[];
  routes: TransportRoute[];
  saccos: SaccoOperator[];
  observations: PassengerObservation[];

  // Derived Forecasts & Analytics
  allStageForecasts: StageForecastResult[];
  filteredStageForecasts: StageForecastResult[];
  selectedStage: TransportStage;
  selectedStageForecast: StageForecastResult;
  summaryMetrics: SummaryMetrics;
  overviewInsights: AIInsightItem[];
  planningSacco: SaccoOperator;
  planningSaccoForecasts: StageForecastResult[];
  planningRecommendations: OperationalRecommendation[];
  modelEvaluation: ModelEvaluationSummary;
}

const CrowdSenseContext = createContext<CrowdSenseContextValue | undefined>(
  undefined
);

export const CrowdSenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const stages = useMemo(() => m3DataProvider.getStages(), []);
  const routes = useMemo(() => m3DataProvider.getRoutes(), []);
  const saccos = useMemo(() => m3DataProvider.getSaccos(), []);
  const observations = useMemo(() => m3DataProvider.getObservations(), []);
  const providerStatus = useMemo(() => m3DataProvider.getProviderStatus(), []);
  const modelEvaluation = useMemo(
    () => evaluateForecastModelOnSyntheticData(),
    []
  );

  const [activeSection, setActiveSection] =
    useState<DashboardSection>('overview');
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<TimePeriod>('evening_peak');
  const [selectedDayType, setSelectedDayType] = useState<DayType>('weekday');
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>(30);
  const [selectedStageId, setSelectedStageId] = useState<string>('stg-kencom');
  const [selectedSaccoFilter, setSelectedSaccoFilter] = useState<
    string | 'all'
  >('all');
  const [selectedPlanningSaccoId, setSelectedPlanningSaccoId] =
    useState<string>('sacco-supermetro');
  const [selectedDemandCategoryFilter, setSelectedDemandCategoryFilter] =
    useState<'all' | DemandCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSaccoFilterChange = (saccoId: string | 'all') => {
    setSelectedSaccoFilter(saccoId);
    if (saccoId !== 'all') {
      setSelectedPlanningSaccoId(saccoId);
    }
  };

  const allStageForecasts = useMemo(() => {
    return forecastAllStages({
      timePeriod: selectedTimePeriod,
      dayType: selectedDayType,
      horizonMinutes: selectedHorizon,
      saccoFilterId: selectedSaccoFilter,
    });
  }, [
    selectedTimePeriod,
    selectedDayType,
    selectedHorizon,
    selectedSaccoFilter,
  ]);

  const stageMap = useMemo(
    () => new Map(stages.map((s) => [s.id, s])),
    [stages]
  );

  const filteredStageForecasts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allStageForecasts.filter((f) => {
      const stage = stageMap.get(f.stageId);
      if (!stage) return false;

      if (
        selectedSaccoFilter !== 'all' &&
        !stage.saccoIds.includes(selectedSaccoFilter)
      ) {
        return false;
      }

      if (
        selectedDemandCategoryFilter !== 'all' &&
        f.predictedCategory !== selectedDemandCategoryFilter
      ) {
        return false;
      }

      if (q.length > 0) {
        const matchName = stage.name.toLowerCase().includes(q);
        const matchCorridor = stage.corridor.toLowerCase().includes(q);
        const matchNeighbourhood = stage.neighbourhood
          .toLowerCase()
          .includes(q);
        const matchCode = stage.code.toLowerCase().includes(q);
        if (
          !matchName &&
          !matchCorridor &&
          !matchNeighbourhood &&
          !matchCode
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    allStageForecasts,
    stageMap,
    selectedSaccoFilter,
    selectedDemandCategoryFilter,
    searchQuery,
  ]);

  const selectedStage = useMemo(
    () => stageMap.get(selectedStageId) ?? stages[0],
    [stageMap, selectedStageId, stages]
  );

  const selectedStageForecast = useMemo(
    () =>
      allStageForecasts.find((f) => f.stageId === selectedStage.id) ??
      forecastStageDemand({
        stageId: selectedStage.id,
        timePeriod: selectedTimePeriod,
        dayType: selectedDayType,
        horizonMinutes: selectedHorizon,
        saccoFilterId: selectedSaccoFilter,
      }),
    [
      allStageForecasts,
      selectedStage.id,
      selectedTimePeriod,
      selectedDayType,
      selectedHorizon,
      selectedSaccoFilter,
    ]
  );

  const summaryMetrics: SummaryMetrics = useMemo(() => {
    const activeSet =
      selectedSaccoFilter === 'all'
        ? allStageForecasts
        : allStageForecasts.filter((f) => {
            const stg = stageMap.get(f.stageId);
            return stg ? stg.saccoIds.includes(selectedSaccoFilter) : true;
          });

    const monitoredStagesCount = activeSet.length;
    const highDemandStagesCount = activeSet.filter(
      (f) => f.predictedCategory === 'high'
    ).length;
    const moderateDemandStagesCount = activeSet.filter(
      (f) => f.predictedCategory === 'moderate'
    ).length;
    const lowDemandStagesCount = activeSet.filter(
      (f) => f.predictedCategory === 'low'
    ).length;

    const networkPredictedPassengers = activeSet.reduce(
      (sum, f) => sum + f.predictedPassengers,
      0
    );
    const networkObservedBaseline = activeSet.reduce(
      (sum, f) => sum + f.observedDemoDemand,
      0
    );

    const networkDeltaPercent = Number(
      (
        ((networkPredictedPassengers - networkObservedBaseline) /
          Math.max(1, networkObservedBaseline)) *
        100
      ).toFixed(1)
    );

    const highShare =
      highDemandStagesCount / Math.max(1, monitoredStagesCount);
    const overallNetworkDemandCategory: DemandCategory =
      highShare >= 0.4
        ? 'high'
        : highDemandStagesCount >= 2 || moderateDemandStagesCount >= 4
        ? 'moderate'
        : 'low';

    const averageConfidencePercent = Math.round(
      activeSet.reduce((sum, f) => sum + f.confidenceScorePercent, 0) /
        Math.max(1, monitoredStagesCount)
    );

    return {
      monitoredStagesCount,
      highDemandStagesCount,
      moderateDemandStagesCount,
      lowDemandStagesCount,
      networkPredictedPassengers,
      networkObservedBaseline,
      networkDeltaPercent,
      overallNetworkDemandCategory,
      averageConfidencePercent,
    };
  }, [allStageForecasts, selectedSaccoFilter, stageMap]);

  const overviewInsights = useMemo(
    () =>
      generateOverviewInsights({
        timePeriod: selectedTimePeriod,
        dayType: selectedDayType,
        horizonMinutes: selectedHorizon,
        saccoFilterId: selectedSaccoFilter,
      }),
    [
      selectedTimePeriod,
      selectedDayType,
      selectedHorizon,
      selectedSaccoFilter,
    ]
  );

  const planningSacco = useMemo(
    () =>
      saccos.find((s) => s.id === selectedPlanningSaccoId) ?? saccos[0],
    [saccos, selectedPlanningSaccoId]
  );

  const { saccoForecasts: planningSaccoForecasts, recommendations: planningRecommendations } =
    useMemo(
      () =>
        generateSaccoRecommendations({
          saccoId: planningSacco.id,
          timePeriod: selectedTimePeriod,
          dayType: selectedDayType,
          horizonMinutes: selectedHorizon,
        }),
      [
        planningSacco.id,
        selectedTimePeriod,
        selectedDayType,
        selectedHorizon,
      ]
    );

  const navigateToStageInsights = (stageId: string) => {
    setSelectedStageId(stageId);
    setActiveSection('stages');
  };

  const navigateToStageOnMap = (stageId: string) => {
    setSelectedStageId(stageId);
    setActiveSection('map');
  };

  const navigateToStageForecast = (stageId: string) => {
    setSelectedStageId(stageId);
    setActiveSection('forecasts');
  };

  const navigateToSaccoPlanning = (saccoId: string) => {
    setSelectedPlanningSaccoId(saccoId);
    setSelectedSaccoFilter(saccoId);
    setActiveSection('sacco');
  };

  const resetAllFilters = () => {
    setSelectedSaccoFilter('all');
    setSelectedDemandCategoryFilter('all');
    setSearchQuery('');
  };

  return (
    <CrowdSenseContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedTimePeriod,
        setSelectedTimePeriod,
        selectedDayType,
        setSelectedDayType,
        selectedHorizon,
        setSelectedHorizon,
        selectedStageId,
        setSelectedStageId,
        selectedSaccoFilter,
        setSelectedSaccoFilter: handleSaccoFilterChange,
        selectedPlanningSaccoId,
        setSelectedPlanningSaccoId,
        selectedDemandCategoryFilter,
        setSelectedDemandCategoryFilter,
        searchQuery,
        setSearchQuery,
        navigateToStageInsights,
        navigateToStageOnMap,
        navigateToStageForecast,
        navigateToSaccoPlanning,
        resetAllFilters,
        providerStatus,
        stages,
        routes,
        saccos,
        observations,
        allStageForecasts,
        filteredStageForecasts,
        selectedStage,
        selectedStageForecast,
        summaryMetrics,
        overviewInsights,
        planningSacco,
        planningSaccoForecasts,
        planningRecommendations,
        modelEvaluation,
      }}
    >
      {children}
    </CrowdSenseContext.Provider>
  );
};

export function useCrowdSense(): CrowdSenseContextValue {
  const ctx = useContext(CrowdSenseContext);
  if (!ctx) {
    throw new Error('useCrowdSense must be used within a CrowdSenseProvider');
  }
  return ctx;
}
