import React from 'react';
import {
  ArrowRight,
  Bus,
  Filter,
  Info,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useCrowdSense } from '../../context/CrowdSenseContext';
import { formatTimePeriodLabel } from '../../services/demandForecastService';
import { DemandCategory } from '../../types/transport';
import {
  DemandCategoryBadge,
  DirectionIndicator,
  HorizonSelector,
  TimePeriodSelector,
} from '../common/DemandBadge';
import { NairobiDemandMap } from '../map/NairobiDemandMap';

export const DemandMapView: React.FC = () => {
  const {
    stages,
    routes,
    saccos,
    filteredStageForecasts,
    selectedStage,
    selectedStageForecast,
    setSelectedStageId,
    selectedTimePeriod,
    setSelectedTimePeriod,
    selectedHorizon,
    setSelectedHorizon,
    selectedSaccoFilter,
    setSelectedSaccoFilter,
    selectedDemandCategoryFilter,
    setSelectedDemandCategoryFilter,
    searchQuery,
    setSearchQuery,
    resetAllFilters,
    navigateToStageInsights,
    navigateToStageForecast,
  } = useCrowdSense();

  // Filter stage markers visible on the map to match the active search & filter criteria
  const visibleStageIds = new Set(
    filteredStageForecasts.map((f) => f.stageId)
  );
  const visibleStages = stages.filter((s) => visibleStageIds.has(s.id));

  const stageSaccos = saccos.filter((sc) =>
    selectedStage.saccoIds.includes(sc.id)
  );
  const stageRoutes = routes.filter((rt) =>
    selectedStage.routeIds.includes(rt.id)
  );

  const hasActiveFilters =
    selectedSaccoFilter !== 'all' ||
    selectedDemandCategoryFilter !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#171717]/8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717]/5 border border-[#171717]/12 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00e575]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#171717]">
              DEMO SIMULATION · SPATIAL CORRIDOR VIEW
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            Nairobi Demand Map
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Explore predicted waiting passenger pressure across Nairobi stages,
            corridors, and demonstration SACCO networks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <TimePeriodSelector
            value={selectedTimePeriod}
            onChange={setSelectedTimePeriod}
          />
          <HorizonSelector
            value={selectedHorizon}
            onChange={setSelectedHorizon}
          />
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#ffffff] rounded-2xl p-3.5 border border-[#171717]/8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[230px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-[#6b7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stage, corridor, or area..."
              aria-label="Search by stage or neighbourhood"
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs text-[#171717] placeholder:text-[#6b7280] focus:outline-none focus:border-[#171717]"
            />
          </div>

          {/* SACCO Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#6b7280]" />
            <label
              htmlFor="map-sacco-filter"
              className="text-xs font-medium text-[#6b7280] whitespace-nowrap"
            >
              SACCO:
            </label>
            <select
              id="map-sacco-filter"
              value={selectedSaccoFilter}
              onChange={(e) => setSelectedSaccoFilter(e.target.value)}
              className="h-9 px-2.5 rounded-lg bg-[#ffffff] border border-[#171717]/15 text-xs font-semibold text-[#171717] focus:outline-none focus:border-[#171717]"
            >
              <option value="all">All Demo SACCOs (6)</option>
              {saccos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Demand Category Filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#f3f4ee] border border-[#171717]/10">
            {(
              [
                { id: 'all', label: 'All Levels' },
                { id: 'high', label: 'High' },
                { id: 'moderate', label: 'Moderate' },
                { id: 'low', label: 'Low' },
              ] as { id: 'all' | DemandCategory; label: string }[]
            ).map((cat) => {
              const active = selectedDemandCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedDemandCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#171717] text-[#ffffff]'
                      : 'text-[#6b7280] hover:text-[#171717]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6b7280] tabular-nums">
            Showing{' '}
            <strong className="text-[#171717]">{visibleStages.length}</strong>{' '}
            of {stages.length} stages
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-2.5 py-1.5 rounded-lg bg-[#f3f4ee] hover:bg-[#e5e2e1] text-xs font-semibold text-[#171717] flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map + Selected Stage Detail Drawer (12-column grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Map Canvas (8 columns) */}
        <div className="lg:col-span-8 bg-[#ffffff] rounded-2xl p-3.5 border border-[#171717]/8 flex flex-col">
          {visibleStages.length === 0 ? (
            <div className="h-[520px] rounded-xl bg-[#f3f4ee] flex flex-col items-center justify-center p-6 text-center">
              <MapPin className="w-8 h-8 text-[#6b7280] mb-2" />
              <h3 className="text-base font-semibold text-[#171717]">
                No transport stages match the current filter combination
              </h3>
              <p className="text-xs text-[#6b7280] mt-1 max-w-md">
                Try clearing the search query or switching the demand category
                filter to view all {stages.length} demonstration stages across
                Greater Nairobi.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-[#00e575] text-[#171717] text-xs font-semibold hover:bg-[#00cb68] transition-colors"
              >
                Reset Map Filters
              </button>
            </div>
          ) : (
            <div className="h-[520px] w-full">
              <NairobiDemandMap
                stages={visibleStages}
                forecasts={filteredStageForecasts}
                routes={routes}
                selectedStageId={selectedStage.id}
                onSelectStage={(id) => setSelectedStageId(id)}
              />
            </div>
          )}

          {/* Quick Stage Switcher Pills underneath Map */}
          <div className="mt-3 pt-3 border-t border-[#171717]/8 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] shrink-0">
              Visible Stages:
            </span>
            {filteredStageForecasts.map((f) => {
              const stg = stages.find((s) => s.id === f.stageId);
              if (!stg) return null;
              const isSelected = stg.id === selectedStage.id;
              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setSelectedStageId(stg.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#171717] text-[#ffffff] border-[#171717]'
                      : 'bg-[#f3f4ee] text-[#171717] border-[#171717]/10 hover:bg-[#e5e2e1]'
                  }`}
                >
                  <span>{stg.name.split('/')[0].trim()}</span>
                  <span
                    className={`font-mono-tabular text-[10px] ${
                      isSelected ? 'text-[#00e575]' : 'text-[#6b7280]'
                    }`}
                  >
                    {f.predictedPassengers}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Side Panel (4 columns) */}
        <div className="lg:col-span-4 bg-[#ffffff] rounded-2xl p-4 border border-[#171717]/8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Stage Header */}
            <div className="pb-3 border-b border-[#171717]/8">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-mono-tabular font-semibold text-[#6b7280]">
                  {selectedStage.code} · {selectedStage.neighbourhood}
                </span>
                <DemandCategoryBadge
                  category={selectedStageForecast.predictedCategory}
                  size="md"
                />
              </div>
              <h2 className="text-xl font-bold text-[#171717]">
                {selectedStage.name}
              </h2>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {selectedStage.corridor} · Coords:{' '}
                <span className="font-mono-tabular">
                  {selectedStage.coordinates.lat.toFixed(4)},{' '}
                  {selectedStage.coordinates.lng.toFixed(4)}
                </span>
              </p>
            </div>

            {/* Forecast Summary Strip */}
            <div className="p-3.5 rounded-xl bg-[#f3f4ee] border border-[#171717]/8 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#6b7280] uppercase tracking-wider text-[10px]">
                  +{selectedHorizon} Min Predicted Demand
                </span>
                <span className="text-[11px] font-medium text-[#171717]">
                  {formatTimePeriodLabel(selectedTimePeriod)}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold text-[#171717] tabular-nums">
                    {selectedStageForecast.predictedPassengers}
                  </span>
                  <span className="text-xs text-[#6b7280] ml-1.5">
                    waiting pax
                  </span>
                </div>
                <DirectionIndicator
                  direction={selectedStageForecast.direction}
                  deltaPercent={selectedStageForecast.deltaPercent}
                />
              </div>

              <div className="pt-2 border-t border-[#171717]/8 grid grid-cols-3 gap-2 text-[11px] tabular-nums">
                <div>
                  <div className="text-[#6b7280]">Observed Demo</div>
                  <div className="font-bold text-[#171717]">
                    {selectedStageForecast.observedDemoDemand} pax
                  </div>
                </div>
                <div>
                  <div className="text-[#6b7280]">Bus Interval</div>
                  <div className="font-bold text-[#171717]">
                    ~{selectedStageForecast.estimatedBusIntervalMinutes} min
                  </div>
                </div>
                <div>
                  <div className="text-[#6b7280]">Capacity Ratio</div>
                  <div className="font-bold text-[#171717]">
                    {Math.round(
                      selectedStageForecast.capacityUtilizationRatio * 100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Contributing Factors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#006d34]" />
                  <span>Main Contributing Factors</span>
                </span>
                <span className="text-[10px] font-mono-tabular text-[#6b7280]">
                  Conf: {selectedStageForecast.confidenceScorePercent}%
                </span>
              </div>

              <div className="space-y-2">
                {selectedStageForecast.contributingFactors.map((factor) => (
                  <div
                    key={factor.id}
                    className="p-2.5 rounded-lg bg-[#f7f7f2] border border-[#171717]/8 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 font-semibold text-[#171717]">
                      <span>{factor.label}</span>
                      <span className="font-mono-tabular text-[11px] text-[#006d34]">
                        {factor.valueLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] mt-0.5 leading-snug">
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated SACCOs & Routes */}
            <div className="pt-2 border-t border-[#171717]/8 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#6b7280] font-semibold text-[11px] uppercase tracking-wider">
                <Bus className="w-3.5 h-3.5 text-[#171717]" />
                <span>Associated Demo SACCOs & Routes</span>
              </div>
              <p className="text-[#171717] font-medium">
                {stageSaccos.map((s) => s.name).join(' · ')}
              </p>
              <p className="text-[#6b7280] text-[11px]">
                Routes:{' '}
                {stageRoutes
                  .map((r) => `${r.routeNumber} (${r.corridor})`)
                  .join(' / ')}
              </p>
            </div>
          </div>

          {/* Actions & Congestion Distinction */}
          <div className="mt-4 pt-3 border-t border-[#171717]/8 space-y-2.5">
            <div className="flex items-start gap-2 text-[11px] text-[#6b7280] bg-[#f3f4ee] p-2.5 rounded-lg">
              <Info className="w-3.5 h-3.5 text-[#171717] shrink-0 mt-0.5" />
              <span>
                Indicates estimated kerbside passenger demand, distinct from
                vehicular road traffic congestion.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigateToStageInsights(selectedStage.id)}
                className="w-full py-2 px-3 rounded-lg bg-[#00e575] hover:bg-[#00cb68] text-[#171717] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Open Stage Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigateToStageForecast(selectedStage.id)}
                className="w-full py-2 px-3 rounded-lg bg-[#171717] hover:bg-[#313030] text-[#ffffff] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Inspect Forecast</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00e575]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
