import React from 'react';
import {
  Activity,
  ArrowRight,
  Clock,
  Cpu,
  Database,
  Info,
  Layers,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { useCrowdSense } from '../../context/CrowdSenseContext';
import {
  formatDayTypeLabel,
  formatTimePeriodLabel,
  forecastStageDemand,
} from '../../services/demandForecastService';
import { TimePeriod } from '../../types/transport';
import { DemandTrendChart } from '../charts/DemandTrendChart';
import {
  DayTypeSelector,
  DemandCategoryBadge,
  DirectionIndicator,
  HorizonSelector,
  TimePeriodSelector,
} from '../common/DemandBadge';

export const ForecastsView: React.FC = () => {
  const {
    stages,
    saccos,
    selectedStage,
    selectedStageForecast,
    setSelectedStageId,
    selectedTimePeriod,
    setSelectedTimePeriod,
    selectedDayType,
    setSelectedDayType,
    selectedHorizon,
    setSelectedHorizon,
    selectedSaccoFilter,
    setSelectedSaccoFilter,
    modelEvaluation,
    navigateToSaccoPlanning,
    navigateToStageOnMap,
  } = useCrowdSense();

  // Compute comparison across all 3 time periods for the selected stage, day, and horizon
  const periodComparison = (
    ['morning_peak', 'midday', 'evening_peak'] as TimePeriod[]
  ).map((period) =>
    forecastStageDemand({
      stageId: selectedStage.id,
      timePeriod: period,
      dayType: selectedDayType,
      horizonMinutes: selectedHorizon,
      saccoFilterId: selectedSaccoFilter,
    })
  );

  const stageOperatingSaccos = saccos.filter((sc) =>
    selectedStage.saccoIds.includes(sc.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#171717]/8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717]/5 border border-[#171717]/12 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00e575]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#171717]">
              EXPLAINABLE LINEAR BASELINE · SYNTHETIC DEMO DATASET
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            AI Demand Forecasting Engine
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Inspect reproducible passenger-demand predictions across stages,
            SACCO operators, time windows, and 15/30/60-minute horizons.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-[#ffffff] px-3 py-2 rounded-xl border border-[#171717]/10">
          <Cpu className="w-4 h-4 text-[#006d34]" />
          <div>
            <div className="font-semibold text-[#171717]">
              {modelEvaluation.modelTypeLabel}
            </div>
            <div className="text-[11px] text-[#6b7280] tabular-nums">
              Deterministic Output · Same inputs always produce identical forecast
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Forecast Parameter Console */}
      <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-3 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#006d34]" />
          <span>Forecast Model Input Selectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
          {/* Selector 1: Transport Stage */}
          <div>
            <label
              htmlFor="forecast-stage-select"
              className="block text-xs font-semibold text-[#171717] mb-1.5"
            >
              1. Transport Stage
            </label>
            <select
              id="forecast-stage-select"
              value={selectedStage.id}
              onChange={(e) => setSelectedStageId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs font-semibold text-[#171717] focus:outline-none focus:border-[#171717]"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.corridor})
                </option>
              ))}
            </select>
          </div>

          {/* Selector 2: SACCO Scope */}
          <div>
            <label
              htmlFor="forecast-sacco-select"
              className="block text-xs font-semibold text-[#171717] mb-1.5"
            >
              2. SACCO Scope (Stage Operators)
            </label>
            <select
              id="forecast-sacco-select"
              value={selectedSaccoFilter}
              onChange={(e) => setSelectedSaccoFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs font-semibold text-[#171717] focus:outline-none focus:border-[#171717]"
            >
              <option value="all">
                All Stage SACCOs Combined ({stageOperatingSaccos.length} operators)
              </option>
              {saccos.map((sc) => {
                const servesStage = selectedStage.saccoIds.includes(sc.id);
                return (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}{' '}
                    {servesStage ? '(Serves Stage)' : '(Other Corridor)'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Selector 3: Day & Time Period */}
          <div>
            <span className="block text-xs font-semibold text-[#171717] mb-1.5">
              3. Day Profile & Time Period
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <TimePeriodSelector
                value={selectedTimePeriod}
                onChange={setSelectedTimePeriod}
                compact={true}
              />
              <DayTypeSelector
                value={selectedDayType}
                onChange={setSelectedDayType}
              />
            </div>
          </div>

          {/* Selector 4: Forecast Horizon */}
          <div>
            <span className="block text-xs font-semibold text-[#171717] mb-1.5">
              4. Forecast Horizon (15 / 30 / 60 Min)
            </span>
            <HorizonSelector
              value={selectedHorizon}
              onChange={setSelectedHorizon}
            />
          </div>
        </div>
      </div>

      {/* Primary Forecast Output Readout Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Output 1: Predicted Passenger Demand */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>Predicted Passenger Demand</span>
            <Activity className="w-4 h-4 text-[#006d34]" />
          </div>
          <div className="my-3 flex items-baseline justify-between gap-2">
            <div>
              <span className="text-3xl font-bold text-[#171717] tabular-nums">
                {selectedStageForecast.predictedPassengers}
              </span>
              <span className="text-xs text-[#6b7280] ml-1.5">
                passengers / 30m
              </span>
            </div>
            <DirectionIndicator
              direction={selectedStageForecast.direction}
              deltaPercent={selectedStageForecast.deltaPercent}
            />
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs text-[#6b7280] tabular-nums">
            <span>
              Observed demo: {selectedStageForecast.observedDemoDemand} pax
            </span>
            <span>
              Midday base: {selectedStageForecast.weekdayMiddayBaseline} pax
            </span>
          </div>
        </div>

        {/* Output 2: Predicted Demand Category & Capacity Ratio */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>Predicted Demand Category</span>
            <Layers className="w-4 h-4 text-[#171717]" />
          </div>
          <div className="my-3 flex items-center justify-between gap-2">
            <DemandCategoryBadge
              category={selectedStageForecast.predictedCategory}
              size="md"
            />
            <span className="text-2xl font-bold text-[#171717] tabular-nums">
              {Math.round(selectedStageForecast.capacityUtilizationRatio * 100)}%
            </span>
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs text-[#6b7280] tabular-nums">
            <span>Stage capacity ratio</span>
            <span>
              Ref: {selectedStage.baselineHourlyCapacity} pax/hr
            </span>
          </div>
        </div>

        {/* Output 3: Forecast Period & Bus Interval */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>Forecast Horizon & Headway</span>
            <Clock className="w-4 h-4 text-[#171717]" />
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-[#171717] tabular-nums">
                +{selectedHorizon} min
              </span>
              <span className="text-xs text-[#6b7280] ml-1.5">horizon</span>
            </div>
            <div className="text-right tabular-nums">
              <div className="text-sm font-bold text-[#171717]">
                ~{selectedStageForecast.estimatedBusIntervalMinutes} min
              </div>
              <div className="text-[11px] text-[#6b7280]">arrival interval</div>
            </div>
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs text-[#6b7280]">
            <span className="truncate">
              {formatTimePeriodLabel(selectedTimePeriod)}
            </span>
            <span className="tabular-nums">
              ~{selectedStageForecast.estimatedDwellSeconds}s dwell
            </span>
          </div>
        </div>

        {/* Output 4: Data Quality & Calculated Confidence Band */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>Data Quality & Confidence</span>
            <ShieldCheck className="w-4 h-4 text-[#006d34]" />
          </div>
          <div className="my-3 flex items-baseline justify-between tabular-nums">
            <div>
              <span className="text-2xl font-bold text-[#171717]">
                {selectedStageForecast.confidenceScorePercent}%
              </span>
              <span className="text-xs text-[#6b7280] ml-1.5">
                calc. confidence
              </span>
            </div>
            <span className="text-xs font-mono-tabular font-semibold text-[#0f7642]">
              [{selectedStageForecast.confidenceInterval[0]}–
              {selectedStageForecast.confidenceInterval[1]} pax]
            </span>
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs text-[#6b7280] tabular-nums">
            <span>
              Sample completeness: {selectedStageForecast.dataCompletenessPercent}%
            </span>
            <span>{selectedStageForecast.dataStatusLabel}</span>
          </div>
        </div>
      </div>

      {/* Main Analytical Split: Historical vs Forecasted Chart (7 cols) + Model Input Decomposition (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Historical vs. Forecasted Demand Visualization */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                  Historical Demo Baseline vs. +{selectedHorizon}m Forecasted
                  Curve
                </div>
                <h2 className="text-lg font-bold text-[#171717]">
                  {selectedStage.name} ({formatDayTypeLabel(selectedDayType)})
                </h2>
              </div>
              <span className="text-xs font-mono-tabular text-[#6b7280]">
                Solid: Historical · Dashed Mint: Forecast
              </span>
            </div>

            <DemandTrendChart
              series={selectedStageForecast.hourlySeries}
              stageName={selectedStage.name}
              selectedTimePeriod={selectedTimePeriod}
              horizonMinutes={selectedHorizon}
              height={250}
            />
          </div>

          {/* Cross-Period Comparison Matrix (Morning Peak vs Midday vs Evening Peak) */}
          <div className="pt-4 border-t border-[#171717]/8">
            <div className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2.5">
              Same-Day Period Comparison at {selectedStage.name} (+
              {selectedHorizon}m Horizon)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {periodComparison.map((pc) => {
                const isSelected = pc.timePeriod === selectedTimePeriod;
                return (
                  <button
                    key={pc.timePeriod}
                    type="button"
                    onClick={() => setSelectedTimePeriod(pc.timePeriod)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#f3f4ee] border-[#171717]/30'
                        : 'bg-[#ffffff] border-[#171717]/10 hover:bg-[#f7f7f2]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-[#171717] capitalize">
                        {pc.timePeriod.replace('_', ' ')}
                      </span>
                      <DemandCategoryBadge
                        category={pc.predictedCategory}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-baseline justify-between tabular-nums mt-2">
                      <div>
                        <span className="text-lg font-bold text-[#171717]">
                          {pc.predictedPassengers}
                        </span>
                        <span className="text-[11px] text-[#6b7280] ml-1">
                          pred
                        </span>
                      </div>
                      <span className="text-xs text-[#6b7280]">
                        Obs: {pc.observedDemoDemand}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Additive Model Input Factor Decomposition */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#006d34]">
                Transparent Model Input Decomposition
              </div>
              <h2 className="text-lg font-bold text-[#171717]">
                How the +{selectedHorizon}m Prediction Is Calculated
              </h2>
              <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">
                Each prediction is computed deterministically from the stage&apos;s
                synthetic historical records, time-of-day peak trajectory, bus
                arrival headway gap, and corridor transfer role:
              </p>
            </div>

            {/* Factor Cards */}
            <div className="space-y-2.5">
              {selectedStageForecast.contributingFactors.map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl bg-[#f7f7f2] border border-[#171717]/8"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#171717]">
                    <span>{f.label}</span>
                    <span className="font-mono-tabular text-[#006d34]">
                      {f.contributionPassengers >= 0 ? '+' : ''}
                      {f.contributionPassengers} pax ({f.relativeWeightPercent}%)
                    </span>
                  </div>
                  <div className="text-[11px] font-mono-tabular text-[#171717]/80 mt-0.5">
                    Input value: {f.valueLabel}
                  </div>
                  <p className="text-[11px] text-[#6b7280] mt-1 leading-snug">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Explanation Box */}
            <div className="p-3.5 rounded-xl bg-[#f3f4ee] border border-[#171717]/10 text-xs space-y-1.5">
              <div className="font-bold text-[#171717] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#006d34]" />
                <span>Plain-Language Forecast Summary</span>
              </div>
              <p className="text-[#171717] leading-relaxed">
                {selectedStageForecast.explanation}
              </p>
              <div className="pt-1.5 border-t border-[#171717]/8 text-[11px] text-[#6b7280] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#171717] shrink-0 mt-0.5" />
                <span>
                  Confidence interval (
                  {selectedStageForecast.confidenceInterval[0]}–
                  {selectedStageForecast.confidenceInterval[1]} pax) is derived
                  from stage sample completeness (
                  {selectedStageForecast.dataCompletenessPercent}%) and the +
                  {selectedHorizon}-minute projection horizon.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#171717]/8 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigateToStageOnMap(selectedStage.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-[#f3f4ee] hover:bg-[#e5e2e1] text-xs font-semibold text-[#171717] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View on Demand Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                navigateToSaccoPlanning(
                  selectedSaccoFilter !== 'all'
                    ? selectedSaccoFilter
                    : selectedStage.saccoIds[0]
                )
              }
              className="flex-1 py-2 px-3 rounded-lg bg-[#00e575] hover:bg-[#00cb68] text-xs font-semibold text-[#171717] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open SACCO Planning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
