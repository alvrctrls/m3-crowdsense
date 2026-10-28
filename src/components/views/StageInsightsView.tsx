import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Database,
  Info,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useCrowdSense } from '../../context/CrowdSenseContext';
import {
  formatDayTypeLabel,
  formatTimePeriodLabel,
} from '../../services/demandForecastService';
import { DemandCategory } from '../../types/transport';
import { DemandTrendChart } from '../charts/DemandTrendChart';
import {
  DayTypeSelector,
  DemandCategoryBadge,
  DirectionIndicator,
  HorizonSelector,
  TimePeriodSelector,
} from '../common/DemandBadge';

type SortField =
  | 'name'
  | 'corridor'
  | 'observed'
  | 'predicted'
  | 'delta'
  | 'completeness';

export const StageInsightsView: React.FC = () => {
  const {
    stages,
    saccos,
    filteredStageForecasts,
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
    selectedDemandCategoryFilter,
    setSelectedDemandCategoryFilter,
    searchQuery,
    setSearchQuery,
    navigateToStageOnMap,
    navigateToStageForecast,
  } = useCrowdSense();

  const [sortField, setSortField] = useState<SortField>('predicted');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const stageMap = useMemo(
    () => new Map(stages.map((s) => [s.id, s])),
    [stages]
  );
  const saccoMap = useMemo(
    () => new Map(saccos.map((s) => [s.id, s])),
    [saccos]
  );

  const sortedForecasts = useMemo(() => {
    const list = [...filteredStageForecasts];
    list.sort((a, b) => {
      const stgA = stageMap.get(a.stageId)!;
      const stgB = stageMap.get(b.stageId)!;
      let cmp = 0;
      if (sortField === 'name') {
        cmp = stgA.name.localeCompare(stgB.name);
      } else if (sortField === 'corridor') {
        cmp = stgA.corridor.localeCompare(stgB.corridor);
      } else if (sortField === 'observed') {
        cmp = a.observedDemoDemand - b.observedDemoDemand;
      } else if (sortField === 'predicted') {
        cmp = a.predictedPassengers - b.predictedPassengers;
      } else if (sortField === 'delta') {
        cmp = a.deltaPercent - b.deltaPercent;
      } else if (sortField === 'completeness') {
        cmp = a.dataCompletenessPercent - b.dataCompletenessPercent;
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [filteredStageForecasts, stageMap, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'corridor');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#6b7280]" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-[#171717]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#171717]" />
    );
  };

  const selectedStageSaccos = selectedStage.saccoIds
    .map((id) => saccoMap.get(id)?.name)
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#171717]/8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717]/5 border border-[#171717]/12 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00e575]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#171717]">
              PER-STAGE DEMAND & HISTORICAL ANALYSIS · DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            Stage Insights
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Compare observed synthetic baselines against 15, 30, and 60-minute
            demand forecasts across Nairobi transport stages.
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

      {/* Filter Bar & Sortable Table Card */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#171717]/8 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#171717]/8 flex flex-wrap items-center justify-between gap-3 bg-[#f7f7f2]/50">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[220px] max-w-xs flex-1">
              <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter stages or corridors..."
                aria-label="Filter stages"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs text-[#171717] placeholder:text-[#6b7280] focus:outline-none focus:border-[#171717]"
              />
            </div>

            <select
              value={selectedSaccoFilter}
              onChange={(e) => setSelectedSaccoFilter(e.target.value)}
              aria-label="Filter by SACCO"
              className="h-9 px-2.5 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs font-semibold text-[#171717]"
            >
              <option value="all">All Demo SACCOs</option>
              {saccos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDemandCategoryFilter}
              onChange={(e) =>
                setSelectedDemandCategoryFilter(
                  e.target.value as 'all' | DemandCategory
                )
              }
              aria-label="Filter by predicted demand category"
              className="h-9 px-2.5 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs font-semibold text-[#171717]"
            >
              <option value="all">All Demand Categories</option>
              <option value="high">High Demand Only</option>
              <option value="moderate">Moderate Demand Only</option>
              <option value="low">Low Demand Only</option>
            </select>
          </div>

          <div className="text-xs text-[#6b7280] tabular-nums">
            Click any stage row to inspect detailed multi-horizon diagnostics (
            <strong className="text-[#171717]">{sortedForecasts.length}</strong>{' '}
            stages shown)
          </div>
        </div>

        {/* Sortable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f4ee] border-b border-[#171717]/8 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-[#171717]"
                  >
                    <span>Stage Name</span>
                    {renderSortIcon('name')}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('corridor')}
                    className="inline-flex items-center gap-1 hover:text-[#171717]"
                  >
                    <span>Area / Corridor</span>
                    {renderSortIcon('corridor')}
                  </button>
                </th>
                <th className="py-3 px-4">Associated Demo SACCOs</th>
                <th className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('observed')}
                    className="inline-flex items-center justify-end gap-1 hover:text-[#171717] ml-auto"
                  >
                    <span>Observed Demo</span>
                    {renderSortIcon('observed')}
                  </button>
                </th>
                <th className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('predicted')}
                    className="inline-flex items-center justify-end gap-1 hover:text-[#171717] ml-auto"
                  >
                    <span>Predicted (+{selectedHorizon}m)</span>
                    {renderSortIcon('predicted')}
                  </button>
                </th>
                <th className="py-3 px-4">Predicted Category</th>
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('delta')}
                    className="inline-flex items-center gap-1 hover:text-[#171717]"
                  >
                    <span>Forecast Direction</span>
                    {renderSortIcon('delta')}
                  </button>
                </th>
                <th className="py-3 px-4">Horizon</th>
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('completeness')}
                    className="inline-flex items-center gap-1 hover:text-[#171717]"
                  >
                    <span>Data Status</span>
                    {renderSortIcon('completeness')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]/6 text-xs">
              {sortedForecasts.map((f) => {
                const stg = stageMap.get(f.stageId)!;
                const isSelected = stg.id === selectedStage.id;
                const saccoNames = stg.saccoIds
                  .map((id) => saccoMap.get(id)?.name.replace(' Demo Fleet', '').replace(' Demo Transit', '').replace(' Demo Operations', '').replace(' Demo SACCO', '').replace(' Demo', ''))
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <tr
                    key={stg.id}
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#00e575]/12 font-medium'
                        : 'hover:bg-[#f7f7f2]'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#171717] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-4 rounded-full ${
                            isSelected ? 'bg-[#00e575]' : 'bg-transparent'
                          }`}
                        />
                        <div>
                          <div>{stg.name}</div>
                          <div className="text-[10px] font-mono-tabular text-[#6b7280] font-normal">
                            {stg.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#171717] whitespace-nowrap">
                      <div>{stg.corridor}</div>
                      <div className="text-[11px] text-[#6b7280]">
                        {stg.neighbourhood}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6b7280] max-w-[200px] truncate">
                      {saccoNames}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular text-[#171717]">
                      {f.observedDemoDemand} pax
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular font-bold text-[#171717]">
                      {f.predictedPassengers} pax
                    </td>
                    <td className="py-3 px-4">
                      <DemandCategoryBadge category={f.predictedCategory} />
                    </td>
                    <td className="py-3 px-4">
                      <DirectionIndicator
                        direction={f.direction}
                        deltaPercent={f.deltaPercent}
                      />
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-[#6b7280] whitespace-nowrap">
                      +{f.horizonMinutes} min
                    </td>
                    <td className="py-3 px-4 text-[#6b7280] whitespace-nowrap">
                      <span className="font-mono-tabular font-semibold text-[#171717]">
                        {f.dataCompletenessPercent}%
                      </span>{' '}
                      · {f.dataStatusLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Stage Deep-Dive Inspection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Detailed Profile, Plain-Language Explanation & Multi-Horizon Comparison (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Stage Identity & Coordinates */}
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#171717]/8">
              <div>
                <div className="text-[11px] font-mono-tabular font-semibold text-[#006d34] uppercase">
                  Selected Stage Profile · {selectedStage.code}
                </div>
                <h2 className="text-xl font-bold text-[#171717] mt-0.5">
                  {selectedStage.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7280] mt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#171717]" />
                    {selectedStage.corridor}
                  </span>
                  <span>·</span>
                  <span className="font-mono-tabular">
                    {selectedStage.coordinates.lat.toFixed(4)}°S,{' '}
                    {selectedStage.coordinates.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>
              <DemandCategoryBadge
                category={selectedStageForecast.predictedCategory}
                size="md"
              />
            </div>

            {/* Plain-Language Forecast Explanation */}
            <div className="p-3.5 rounded-xl bg-[#f3f4ee] border border-[#171717]/10 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#006d34]" />
                <span>Forecast Explanation (Calculated from Model Inputs)</span>
              </div>
              <p className="text-xs text-[#171717] leading-relaxed">
                {selectedStageForecast.explanation}
              </p>
              <p className="text-[11px] text-[#6b7280] pt-1 border-t border-[#171717]/8">
                {selectedStageForecast.roadCongestionDistinctionNote}
              </p>
            </div>

            {/* Predicted Demand over 15, 30, and 60 Minutes */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] mb-2">
                Multi-Horizon Demand Comparison (15m / 30m / 60m)
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {selectedStageForecast.horizonComparisons.map((hc) => {
                  const isCurrentHorizon =
                    hc.horizonMinutes === selectedHorizon;
                  return (
                    <button
                      key={hc.horizonMinutes}
                      type="button"
                      onClick={() => setSelectedHorizon(hc.horizonMinutes)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrentHorizon
                          ? 'bg-[#171717] text-[#ffffff] border-[#171717]'
                          : 'bg-[#f7f7f2] text-[#171717] border-[#171717]/10 hover:bg-[#f3f4ee]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                        <span
                          className={
                            isCurrentHorizon
                              ? 'text-[#00e575] font-bold'
                              : 'text-[#6b7280]'
                          }
                        >
                          +{hc.horizonMinutes} min
                        </span>
                        <span className="uppercase text-[10px] font-semibold">
                          {hc.predictedCategory}
                        </span>
                      </div>
                      <div className="text-xl font-bold tabular-nums mt-1">
                        {hc.predictedPassengers}{' '}
                        <span className="text-[11px] font-normal opacity-80">
                          pax
                        </span>
                      </div>
                      <div
                        className={`text-[10px] font-mono-tabular mt-1 ${
                          isCurrentHorizon
                            ? 'text-[#ffffff]/75'
                            : 'text-[#6b7280]'
                        }`}
                      >
                        {hc.deltaFromObservedPercent >= 0 ? '+' : ''}
                        {hc.deltaFromObservedPercent}% vs. obs
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Completeness & Quality Indicators */}
            <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#171717]/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#171717] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#006d34]" />
                  <span>Data Completeness & Quality</span>
                </span>
                <span className="font-mono-tabular font-bold text-[#0f7642]">
                  {selectedStageForecast.dataCompletenessPercent}% Complete (
                  {selectedStageForecast.dataStatusLabel})
                </span>
              </div>
              <p className="text-[11px] text-[#6b7280]">
                Infrastructure context: {selectedStage.infrastructureNotes}
              </p>
              {selectedStage.missingFieldsNote && (
                <p className="text-[11px] text-[#86521b] bg-[#fff4e5] px-2.5 py-1.5 rounded">
                  Note: {selectedStage.missingFieldsNote}
                </p>
              )}
              <div className="text-[11px] text-[#6b7280] pt-1">
                Associated Demo SACCOs:{' '}
                <strong className="text-[#171717]">{selectedStageSaccos}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 border-t border-[#171717]/8">
            <button
              type="button"
              onClick={() => navigateToStageOnMap(selectedStage.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-[#f3f4ee] hover:bg-[#e5e2e1] text-xs font-semibold text-[#171717] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Locate on Demand Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigateToStageForecast(selectedStage.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-[#00e575] hover:bg-[#00cb68] text-xs font-semibold text-[#171717] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Forecast Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Diurnal Trend Chart & Main Contributing Factors (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                  Historical Demo Observations vs. Forecasted Demand
                </div>
                <h3 className="text-lg font-bold text-[#171717]">
                  {selectedStage.name} — {formatDayTypeLabel(selectedDayType)}{' '}
                  Trend
                </h3>
              </div>
              <div className="text-xs font-mono-tabular bg-[#f3f4ee] px-2.5 py-1 rounded-md border border-[#171717]/8">
                Midday Baseline:{' '}
                <strong>{selectedStageForecast.weekdayMiddayBaseline} pax</strong>{' '}
                · Selected Period Obs:{' '}
                <strong>{selectedStageForecast.observedDemoDemand} pax</strong>
              </div>
            </div>

            <DemandTrendChart
              series={selectedStageForecast.hourlySeries}
              stageName={selectedStage.name}
              selectedTimePeriod={selectedTimePeriod}
              horizonMinutes={selectedHorizon}
              height={240}
            />
          </div>

          {/* Contributing Factors Breakdown */}
          <div className="pt-4 border-t border-[#171717]/8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#006d34]" />
                <span>
                  Main Factors Contributing to +{selectedHorizon}m Prediction (
                  {formatTimePeriodLabel(selectedTimePeriod)})
                </span>
              </div>
              <span className="text-xs font-mono-tabular text-[#6b7280]">
                90% Confidence Band: [
                {selectedStageForecast.confidenceInterval[0]}–
                {selectedStageForecast.confidenceInterval[1]} pax]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedStageForecast.contributingFactors.map((factor) => (
                <div
                  key={factor.id}
                  className="p-3 rounded-xl bg-[#f7f7f2] border border-[#171717]/8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#171717]">
                      <span>{factor.label}</span>
                      <span className="font-mono-tabular text-[#006d34]">
                        {factor.valueLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
                      {factor.description}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#171717]/6 flex items-center justify-between text-[11px] font-mono-tabular">
                    <span className="text-[#6b7280]">Relative Input Share</span>
                    <span className="font-semibold text-[#171717] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#006d34]" />
                      {factor.relativeWeightPercent}% of model signal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
