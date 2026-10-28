import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bus,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  HelpCircle,
  Info,
  MapPin,
  Route,
  Users,
} from 'lucide-react';
import { useCrowdSense } from '../../context/CrowdSenseContext';
import { formatTimePeriodLabel } from '../../services/demandForecastService';
import {
  DayTypeSelector,
  DemandCategoryBadge,
  DirectionIndicator,
  HorizonSelector,
  TimePeriodSelector,
} from '../common/DemandBadge';

export const SaccoPlanningView: React.FC = () => {
  const {
    stages,
    routes,
    saccos,
    planningSacco,
    setSelectedPlanningSaccoId,
    planningSaccoForecasts,
    planningRecommendations,
    selectedTimePeriod,
    setSelectedTimePeriod,
    selectedDayType,
    setSelectedDayType,
    selectedHorizon,
    setSelectedHorizon,
    navigateToStageInsights,
    navigateToStageForecast,
  } = useCrowdSense();

  const saccoRoutes = routes.filter((r) =>
    planningSacco.routeIds.includes(r.id)
  );
  const stageMap = new Map(stages.map((s) => [s.id, s]));

  const totalSaccoPredictedDemand = planningSaccoForecasts.reduce(
    (sum, f) => sum + f.predictedPassengers,
    0
  );
  const highDemandCount = planningSaccoForecasts.filter(
    (f) => f.predictedCategory === 'high'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Simulation Disclaimer */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#171717]/8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#171717]/5 border border-[#171717]/12 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00e575]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#171717]">
              OPERATIONAL SIMULATION · DEMONSTRATION DATA ONLY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            SACCO Service Planning & Advisory Insights
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Explore corridor capacity patterns and advisory operational reviews
            for demonstration SACCO fleets.
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

      {/* SACCO Selector & Fleet Summary Bar */}
      <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#171717]/8">
          <div className="space-y-1">
            <label
              htmlFor="sacco-planning-selector"
              className="text-[11px] font-bold uppercase tracking-wider text-[#006d34] block"
            >
              Select Demonstration SACCO Operator
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <select
                id="sacco-planning-selector"
                value={planningSacco.id}
                onChange={(e) => setSelectedPlanningSaccoId(e.target.value)}
                className="h-10 px-3.5 rounded-lg bg-[#f3f4ee] border border-[#171717]/15 text-sm font-bold text-[#171717] focus:outline-none focus:border-[#171717]"
              >
                {saccos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) — {s.stageIds.length} stages,{' '}
                    {s.routeIds.length} routes
                  </option>
                ))}
              </select>
              <span className="text-xs text-[#6b7280]">
                {planningSacco.serviceCoverageNote}
              </span>
            </div>
          </div>

          {/* Quick SACCO Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {saccos.map((sc) => {
              const active = sc.id === planningSacco.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedPlanningSaccoId(sc.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border ${
                    active
                      ? 'bg-[#171717] text-[#ffffff] border-[#171717]'
                      : 'bg-[#ffffff] text-[#6b7280] border-[#171717]/12 hover:text-[#171717]'
                  }`}
                >
                  {sc.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 SACCO Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          <div className="p-3.5 rounded-xl bg-[#f7f7f2] border border-[#171717]/8">
            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <span>Associated Routes & Stages</span>
              <Route className="w-4 h-4 text-[#171717]" />
            </div>
            <div className="text-2xl font-bold text-[#171717] tabular-nums mt-1.5">
              {saccoRoutes.length} routes · {planningSacco.stageIds.length}{' '}
              stages
            </div>
            <div className="text-[11px] text-[#6b7280] mt-1 truncate">
              {planningSacco.primaryCorridors.join(' · ')}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f7f7f2] border border-[#171717]/8">
            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <span>Demo Fleet & Unit Size</span>
              <Bus className="w-4 h-4 text-[#006d34]" />
            </div>
            <div className="text-2xl font-bold text-[#171717] tabular-nums mt-1.5">
              {planningSacco.demoActiveVehicles} vehicles
            </div>
            <div className="text-[11px] text-[#6b7280] mt-1 tabular-nums">
              Typical capacity: {planningSacco.typicalVehicleCapacity} seats /
              unit (synthetic)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f7f7f2] border border-[#171717]/8">
            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <span>SACCO-Attributed Demand (+{selectedHorizon}m)</span>
              <Users className="w-4 h-4 text-[#171717]" />
            </div>
            <div className="text-2xl font-bold text-[#171717] tabular-nums mt-1.5">
              {totalSaccoPredictedDemand.toLocaleString()} pax
            </div>
            <div className="text-[11px] text-[#6b7280] mt-1">
              Across {planningSaccoForecasts.length} served stages (
              {formatTimePeriodLabel(selectedTimePeriod)})
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f7f7f2] border border-[#171717]/8">
            <div className="flex items-center justify-between text-xs text-[#6b7280]">
              <span>High-Pressure SACCO Stages</span>
              <AlertCircle className="w-4 h-4 text-[#b91c1c]" />
            </div>
            <div className="text-2xl font-bold text-[#171717] tabular-nums mt-1.5">
              {highDemandCount} of {planningSaccoForecasts.length}
            </div>
            <div className="text-[11px] text-[#6b7280] mt-1">
              Advisory review points identified below
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Potential Operational Actions (7 cols) + SACCO Stages & Routes Breakdown (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Potential Operational Actions Panel */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#171717]/8">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#006d34] flex items-center gap-1.5">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Advisory Decision Support · Non-Automated</span>
                </div>
                <h2 className="text-xl font-bold text-[#171717] mt-0.5">
                  Potential Operational Actions for {planningSacco.name}
                </h2>
              </div>
              <span className="text-xs font-mono-tabular bg-[#f3f4ee] px-2.5 py-1 rounded border border-[#171717]/10">
                {formatTimePeriodLabel(selectedTimePeriod)} · +{selectedHorizon}m
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#f3f4ee] border border-[#171717]/10 text-xs text-[#171717] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#006d34] shrink-0 mt-0.5" />
              <div>
                <strong>Simulation & Advisory Notice:</strong> These suggestions
                are calculated from {planningSacco.name}&apos;s synthetic forecast
                outputs. They do not automatically dispatch vehicles or alter
                schedules, and never recommend withdrawing service from low-demand
                community stages.
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="space-y-3.5">
              {planningRecommendations.map((rec) => {
                const isEquity = rec.priority === 'equity_safeguard';
                const isHigh = rec.priority === 'high_attention';

                return (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      isEquity
                        ? 'bg-[#00e575]/8 border-[#006d34]/25'
                        : 'bg-[#f7f7f2] border-[#171717]/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isEquity
                              ? 'bg-[#00e575] text-[#171717]'
                              : isHigh
                              ? 'bg-[#ffebee] text-[#b91c1c]'
                              : 'bg-[#fff4e5] text-[#86521b]'
                          }`}
                        >
                          {rec.category.replace(/_/g, ' ')}
                        </span>
                        {rec.routeCode && (
                          <span className="text-xs font-mono-tabular font-semibold text-[#171717]">
                            {rec.routeCode}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateToStageInsights(rec.stageId)}
                        className="text-xs font-semibold text-[#006d34] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Inspect {rec.stageName}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-[#171717]">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-[#171717] mt-1 leading-relaxed">
                      {rec.advisoryAction}
                    </p>

                    {/* Supporting Data vs Unavailable Data vs Equity Breakdown */}
                    <div className="mt-3 pt-2.5 border-t border-[#171717]/8 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
                      <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#171717]/8">
                        <div className="font-semibold text-[#171717] flex items-center gap-1 mb-0.5">
                          <CheckCircle2 className="w-3 h-3 text-[#006d34]" />
                          <span>Supporting Synthetic Data</span>
                        </div>
                        <p className="text-[#6b7280] leading-snug">
                          {rec.supportingDataExplanation}
                        </p>
                      </div>

                      <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#171717]/8">
                        <div className="font-semibold text-[#171717] flex items-center gap-1 mb-0.5">
                          <HelpCircle className="w-3 h-3 text-[#86521b]" />
                          <span>Information Not Yet Available</span>
                        </div>
                        <p className="text-[#6b7280] leading-snug">
                          {rec.unavailableInformationNote}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-start gap-1.5 text-[11px] text-[#005226] font-medium">
                      <HeartHandshake className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{rec.accessibilityAndEquityNote}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Associated Stages & Routes Demand Table for Selected SACCO */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          {/* SACCO Stages Demand List */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
              Stage-by-Stage Forecast for {planningSacco.name}
            </div>
            <h2 className="text-lg font-bold text-[#171717] mb-3">
              Served Transport Stages ({planningSaccoForecasts.length})
            </h2>

            <div className="space-y-2.5">
              {planningSaccoForecasts.map((f) => {
                const stg = stageMap.get(f.stageId)!;
                return (
                  <div
                    key={stg.id}
                    className="p-3 rounded-xl bg-[#f7f7f2] border border-[#171717]/8 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#006d34]" />
                          <span>{stg.name}</span>
                        </div>
                        <div className="text-[11px] text-[#6b7280]">
                          {stg.corridor} · Priority:{' '}
                          <span className="font-medium text-[#171717]">
                            {stg.accessibilityPriority.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      <DemandCategoryBadge
                        category={f.predictedCategory}
                        size="sm"
                      />
                    </div>

                    <div className="pt-2 border-t border-[#171717]/6 flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
                      <div>
                        <span className="text-[#6b7280]">SACCO Forecast: </span>
                        <strong className="text-[#171717]">
                          {f.predictedPassengers} pax
                        </strong>{' '}
                        <span className="text-[#6b7280]">
                          (Obs: {f.observedDemoDemand})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <DirectionIndicator
                          direction={f.direction}
                          deltaPercent={f.deltaPercent}
                        />
                        <button
                          type="button"
                          onClick={() => navigateToStageForecast(stg.id)}
                          className="text-[11px] font-semibold text-[#006d34] hover:underline"
                        >
                          Forecast →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SACCO Routes Schedule Summary */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
              Corridor Route Coverage
            </div>
            <h2 className="text-lg font-bold text-[#171717] mb-3">
              Associated Demonstration Routes ({saccoRoutes.length})
            </h2>

            <div className="space-y-2.5">
              {saccoRoutes.map((rt) => (
                <div
                  key={rt.id}
                  className="p-3 rounded-xl bg-[#f3f4ee] border border-[#171717]/8 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-[#171717]">
                    <span>
                      {rt.routeNumber}: {rt.name}
                    </span>
                    <span className="font-mono-tabular text-[11px] text-[#6b7280]">
                      {rt.distanceKm} km
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6b7280] tabular-nums">
                    <span>Corridor: {rt.corridor}</span>
                    <span>
                      Sched Headway ({selectedTimePeriod.replace('_', ' ')}):{' '}
                      <strong className="text-[#171717]">
                        Every {rt.scheduledHeadwayMinutes[selectedTimePeriod]}{' '}
                        min
                      </strong>
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
