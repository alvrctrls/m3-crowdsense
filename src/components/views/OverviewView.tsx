import React from 'react';
import {
  Activity,
  ArrowRight,
  Clock,
  Info,
  MapPin,
  Radio,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCrowdSense } from '../../context/CrowdSenseContext';
import { formatTimePeriodLabel } from '../../services/demandForecastService';
import { DemandTrendChart } from '../charts/DemandTrendChart';
import {
  DayTypeSelector,
  DemandCategoryBadge,
  DirectionIndicator,
  HorizonSelector,
  TimePeriodSelector,
} from '../common/DemandBadge';
import { NairobiDemandMap } from '../map/NairobiDemandMap';

export const OverviewView: React.FC = () => {
  const {
    stages,
    routes,
    allStageForecasts,
    selectedStage,
    selectedStageForecast,
    setSelectedStageId,
    selectedTimePeriod,
    setSelectedTimePeriod,
    selectedDayType,
    setSelectedDayType,
    selectedHorizon,
    setSelectedHorizon,
    summaryMetrics,
    overviewInsights,
    navigateToStageInsights,
    navigateToStageOnMap,
    navigateToStageForecast,
  } = useCrowdSense();

  return (
    <div className="space-y-6">
      {/* Header & Global Time Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#171717]/8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717]/5 border border-[#171717]/12 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00e575]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#171717]">
              DEMO DATA · AI CONCEPT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            Demand Overview
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Understand passenger demand across Nairobi&apos;s transport network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <TimePeriodSelector
            value={selectedTimePeriod}
            onChange={setSelectedTimePeriod}
          />
          <DayTypeSelector
            value={selectedDayType}
            onChange={setSelectedDayType}
          />
          <HorizonSelector
            value={selectedHorizon}
            onChange={setSelectedHorizon}
          />
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Demonstration Stages Monitored */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>Demo Stages Monitored</span>
            <MapPin className="w-4 h-4 text-[#171717]" />
          </div>
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold tracking-tight text-[#171717] tabular-nums">
              {summaryMetrics.monitoredStagesCount}
            </span>
            <span className="text-xs text-[#6b7280] font-medium">
              Nairobi corridors
            </span>
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs text-[#6b7280] tabular-nums">
            <span>{routes.length} demo routes</span>
            <span>·</span>
            <span>504 synthetic logs</span>
          </div>
        </div>

        {/* Card 2: Stages with High Predicted Demand */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>High Predicted Demand</span>
            <Activity className="w-4 h-4 text-[#b91c1c]" />
          </div>
          <div className="my-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold tracking-tight text-[#171717] tabular-nums">
              {summaryMetrics.highDemandStagesCount}
            </span>
            <span className="text-xs text-[#6b7280] tabular-nums">
              of {summaryMetrics.monitoredStagesCount} stages
            </span>
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs tabular-nums">
            <span className="text-[#86521b] font-medium">
              {summaryMetrics.moderateDemandStagesCount} Moderate
            </span>
            <span className="text-[#6b7280]">·</span>
            <span className="text-[#0f7642] font-medium">
              {summaryMetrics.lowDemandStagesCount} Low
            </span>
          </div>
        </div>

        {/* Card 3: Predicted Passenger-Demand Indicator */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>Predicted Demand Indicator</span>
            <Users className="w-4 h-4 text-[#006d34]" />
          </div>
          <div className="my-3 flex items-center justify-between gap-2">
            <div>
              <span className="text-3xl font-bold tracking-tight text-[#171717] tabular-nums">
                {summaryMetrics.networkPredictedPassengers.toLocaleString()}
              </span>
              <span className="text-xs text-[#6b7280] ml-1.5">est. pax</span>
            </div>
            <DemandCategoryBadge
              category={summaryMetrics.overallNetworkDemandCategory}
            />
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs tabular-nums">
            <span className="text-[#6b7280]">
              Period baseline: {summaryMetrics.networkObservedBaseline.toLocaleString()}
            </span>
            <span
              className={`font-semibold ${
                summaryMetrics.networkDeltaPercent >= 0
                  ? 'text-[#b91c1c]'
                  : 'text-[#0f7642]'
              }`}
            >
              {summaryMetrics.networkDeltaPercent >= 0 ? '+' : ''}
              {summaryMetrics.networkDeltaPercent}%
            </span>
          </div>
        </div>

        {/* Card 4: Current Forecast Horizon */}
        <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
            <span>Current Forecast Horizon</span>
            <Clock className="w-4 h-4 text-[#171717]" />
          </div>
          <div className="my-3 flex items-baseline justify-between gap-2">
            <div>
              <span className="text-3xl font-bold tracking-tight text-[#171717] tabular-nums">
                +{selectedHorizon}
              </span>
              <span className="text-sm font-semibold text-[#171717] ml-1">
                minutes
              </span>
            </div>
            <span className="text-xs font-semibold text-[#0f7642] tabular-nums">
              {summaryMetrics.averageConfidencePercent}% avg conf.
            </span>
          </div>
          <div className="pt-2.5 border-t border-[#171717]/6 flex items-center justify-between text-xs text-[#6b7280]">
            <span className="truncate">
              {formatTimePeriodLabel(selectedTimePeriod)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Nairobi Demand Map Preview (7 cols) + AI Insights Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Nairobi Demand-Map Preview */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                Spatial Network Preview · {formatTimePeriodLabel(selectedTimePeriod)}
              </div>
              <h2 className="text-lg font-semibold text-[#171717]">
                Nairobi Stage Demand Categories
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigateToStageOnMap(selectedStage.id)}
              className="px-3 py-1.5 rounded-lg bg-[#f3f4ee] hover:bg-[#e5e2e1] text-xs font-semibold text-[#171717] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[340px] w-full">
            <NairobiDemandMap
              stages={stages}
              forecasts={allStageForecasts}
              routes={routes}
              selectedStageId={selectedStage.id}
              onSelectStage={(id) => setSelectedStageId(id)}
              compactPreview={true}
              onExpandFullMap={() => navigateToStageOnMap(selectedStage.id)}
            />
          </div>

          {/* Selected Stage Quick Strip below Map Preview */}
          <div className="mt-3 p-3 rounded-xl bg-[#f3f4ee] border border-[#171717]/8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                  Selected Stage ({selectedStage.code})
                </div>
                <div className="text-sm font-bold text-[#171717] flex items-center gap-2">
                  <span>{selectedStage.name}</span>
                  <span className="text-xs font-normal text-[#6b7280]">
                    · {selectedStage.corridor}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right tabular-nums">
                <div className="text-xs text-[#6b7280]">
                  +{selectedHorizon}m Forecast
                </div>
                <div className="text-sm font-bold text-[#171717]">
                  {selectedStageForecast.predictedPassengers} pax (
                  {selectedStageForecast.deltaPercent >= 0 ? '+' : ''}
                  {selectedStageForecast.deltaPercent}%)
                </div>
              </div>
              <DemandCategoryBadge
                category={selectedStageForecast.predictedCategory}
              />
              <button
                type="button"
                onClick={() => navigateToStageInsights(selectedStage.id)}
                className="px-3 py-1.5 rounded-lg bg-[#00e575] hover:bg-[#00cb68] text-[#171717] text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Stage Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Insights Panel */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#006d34] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>AI Insights · Calculated from Demo Forecast</span>
                </div>
                <h2 className="text-lg font-semibold text-[#171717]">
                  Period Observations & Pressure Points
                </h2>
              </div>
              <span className="text-[11px] font-mono-tabular text-[#6b7280]">
                +{selectedHorizon}m window
              </span>
            </div>

            <p className="text-xs text-[#6b7280] mb-3">
              Advisory observations generated dynamically from the synthetic
              dataset for{' '}
              <strong className="text-[#171717]">
                {formatTimePeriodLabel(selectedTimePeriod)}
              </strong>
              . Click any observation to inspect the stage in detail.
            </p>

            <div className="space-y-2.5">
              {overviewInsights.map((insight) => {
                const isSelected = insight.stageId === selectedStage.id;
                return (
                  <button
                    key={insight.id}
                    type="button"
                    onClick={() => navigateToStageInsights(insight.stageId)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#f3f4ee] border-[#171717]/30 shadow-2xs'
                        : 'bg-[#ffffff] hover:bg-[#f7f7f2] border-[#171717]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-[#6b7280]">
                        {insight.stageName} · {insight.corridor}
                      </span>
                      <DemandCategoryBadge
                        category={insight.severity}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs font-semibold text-[#171717] leading-snug">
                      {insight.headline}
                    </p>
                    <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
                      {insight.detail}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-mono-tabular font-semibold text-[#171717]">
                        {insight.metricBadge}
                      </span>
                      <span className="text-[#006d34] font-semibold inline-flex items-center gap-1">
                        <span>Inspect Stage Insights</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advisory Note distinguishing Passenger Demand from Road Congestion */}
          <div className="mt-4 p-3 rounded-xl bg-[#f3f4ee] border border-[#171717]/8 flex items-start gap-2.5 text-xs text-[#6b7280]">
            <Info className="w-4 h-4 text-[#171717] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#171717]">
                Passenger Demand vs. Road Congestion:
              </strong>{' '}
              Forecasts estimate waiting and boarding passenger volume at stage
              kerbsides. Actual road congestion also depends on general traffic
              flow, intersection bottlenecks, vehicle dwell times, and road
              capacity.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Diurnal Demand-Trend Chart for Selected Stage */}
      <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#006d34]" />
              <span>Diurnal Passenger Demand Profile (06:00–21:00)</span>
            </div>
            <h2 className="text-lg font-semibold text-[#171717] mt-0.5">
              {selectedStage.name} ({selectedStage.corridor})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label
              htmlFor="overview-stage-select"
              className="text-xs font-medium text-[#6b7280]"
            >
              Inspect Stage:
            </label>
            <select
              id="overview-stage-select"
              value={selectedStage.id}
              onChange={(e) => setSelectedStageId(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs font-semibold text-[#171717] focus:outline-none focus:border-[#171717]"
            >
              {stages.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  {stg.name} ({stg.corridor})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => navigateToStageForecast(selectedStage.id)}
              className="h-9 px-3 rounded-lg bg-[#ffffff] hover:bg-[#f7f7f2] border border-[#171717]/15 text-xs font-semibold text-[#171717] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open Full Forecast Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <DemandTrendChart
          series={selectedStageForecast.hourlySeries}
          stageName={selectedStage.name}
          selectedTimePeriod={selectedTimePeriod}
          horizonMinutes={selectedHorizon}
          height={235}
        />

        <div className="mt-3 pt-3 border-t border-[#171717]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6b7280]">
          <p className="leading-relaxed">{selectedStageForecast.explanation}</p>
          <div className="shrink-0">
            <DirectionIndicator
              direction={selectedStageForecast.direction}
              deltaPercent={selectedStageForecast.deltaPercent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
