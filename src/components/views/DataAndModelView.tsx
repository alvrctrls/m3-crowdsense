import React from 'react';
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  HeartHandshake,
  Layers,
  Link2,
  Scale,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useCrowdSense } from '../../context/CrowdSenseContext';

export const DataAndModelView: React.FC = () => {
  const {
    stages,
    routes,
    saccos,
    observations,
    providerStatus,
    modelEvaluation,
    navigateToStageInsights,
  } = useCrowdSense();

  const pipelineSteps = [
    {
      step: '01',
      title: 'Passenger observations',
      subtitle: 'Aggregated stage waiting & boarding counts',
      description:
        'Captures aggregated passenger counts per 30-minute window alongside bus arrival intervals (headways), stage identity, route ID, and day/time window—never tracking individual commuters.',
    },
    {
      step: '02',
      title: 'Data validation and aggregation',
      subtitle: 'Completeness scoring & baseline normalization',
      description:
        'Checks sample coverage across corridors, flags partial or interpolated feeder windows (e.g., late-evening Kasarani or Kawangware midday logs), and computes stage-specific weekday midday baselines.',
    },
    {
      step: '03',
      title: 'Demand forecasting service',
      subtitle: 'Explainable multi-factor additive linear baseline',
      description:
        'Combines historical period baselines (β_hist), directional time-of-day momentum over 15/30/60m horizons (β_tod), bus headway pressure (β_hdw), and interchange hub weights (β_hub).',
    },
    {
      step: '04',
      title: 'Stage-level forecasts',
      subtitle: 'Low / Moderate / High demand classification & confidence bands',
      description: `Produces reproducible passenger volume estimates, capacity utilization ratios, and completeness-adjusted confidence intervals across all ${stages.length} monitored Greater Nairobi stages.`,
    },
    {
      step: '05',
      title: 'Operational insights',
      subtitle: 'Advisory SACCO & planner decision support',
      description:
        'Translates stage forecasts into non-automated advisory reviews for service frequency, vehicle capacity, and dwell times while enforcing accessibility safeguards for underserved communities.',
    },
  ];

  const peopleFirstPrinciples = [
    {
      title: 'Use Aggregate Passenger Observations Where Possible',
      detail:
        'CrowdSense operates strictly on stage-level aggregated waiting and boarding counts per time window. It does not require CCTV facial recognition, MAC address tracking, or personal commuter profiles.',
    },
    {
      title: 'Avoid Identifying Individual Commuters',
      detail:
        'All data schemas (PassengerObservation) store only stageId, routeId, saccoId, timestamp window, and aggregate count—protecting commuter privacy across Nairobi stages.',
    },
    {
      title: 'Explain Forecasts in Accessible Language',
      detail:
        'Every forecast includes a plain-language explanation showing how historical baselines, peak directionality, and bus arrival intervals contributed to the estimate.',
    },
    {
      title: 'Keep Recommendations Advisory',
      detail:
        'Outputs are decision-support prompts for human SACCO dispatchers and public transport planners—never automated schedule cuts or autonomous vehicle dispatching.',
    },
    {
      title: 'Consider Accessibility and Service Equity',
      detail:
        'Lower predicted passenger demand at peripheral or residential feeder stages must never trigger recommendations to withdraw transport service from communities with limited mobility alternatives.',
    },
    {
      title: 'Require Real-World Validation Before Operational Use',
      detail:
        'Before any real-world deployment, models must be audited and validated against verified field observations collected in partnership with Nairobi commuters, SACCOs, and public agencies.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Mandatory Prominent Mode Banner */}
      <div className="pb-4 border-b border-[#171717]/8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ffebee] border border-[#dc2626]/25 text-[#b91c1c] text-xs font-bold tracking-wider uppercase">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            SYNTHETIC DEMO DATA — NOT VALIDATED ON REAL NAIROBI PASSENGER COUNTS
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Data &amp; Model Transparency
            </h1>
            <p className="text-sm text-[#6b7280] mt-1">
              Inspect the data pipeline, synthetic record completeness,
              forecasting methodology, evaluation limitations, and m3 provider
              architecture.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#171717] text-[#ffffff] text-xs font-mono-tabular flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00e575]" />
            <span>{providerStatus.displayBadge}</span>
          </div>
        </div>
      </div>

      {/* 1. System Pipeline Diagram + Role Explanation */}
      <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#006d34] mb-1">
          Architecture &amp; Forecasting Pipeline
        </div>
        <h2 className="text-lg font-bold text-[#171717] mb-4">
          End-to-End Demand Intelligence Flow
        </h2>

        <div className="max-w-3xl mx-auto space-y-2">
          {pipelineSteps.map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="p-4 rounded-xl bg-[#f7f7f2] border border-[#171717]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#171717] text-[#00e575] font-mono-tabular text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#171717]">
                      {item.title}
                    </div>
                    <div className="text-xs font-medium text-[#006d34]">
                      {item.subtitle}
                    </div>
                    <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
              {idx < pipelineSteps.length - 1 && (
                <div className="flex justify-center py-0.5 text-[#6b7280]">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 2. Split: Forecasting Method, Coefficients & Synthetic Evaluation (7 cols) + m3 Integration & Dataset Inventory (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Forecasting Method, Inputs & Synthetic Evaluation Metrics */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#006d34]" />
                <span>Forecasting Method &amp; Mathematical Specification</span>
              </div>
              <h2 className="text-lg font-bold text-[#171717] mt-0.5">
                {modelEvaluation.modelName}
              </h2>
              <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">
                {modelEvaluation.methodologySummary}
              </p>
            </div>

            {/* Model Feature Weights Table */}
            <div className="overflow-x-auto rounded-xl border border-[#171717]/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f3f4ee] border-b border-[#171717]/8 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
                    <th className="py-2.5 px-3">Input Feature</th>
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3 text-right">Weight</th>
                    <th className="py-2.5 px-3">Role in Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171717]/6">
                  {modelEvaluation.featureWeights.map((fw) => (
                    <tr key={fw.symbol}>
                      <td className="py-2.5 px-3 font-semibold text-[#171717]">
                        {fw.featureName}
                      </td>
                      <td className="py-2.5 px-3 font-mono-tabular text-[#006d34] font-semibold">
                        {fw.symbol}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-tabular font-bold text-[#171717]">
                        {fw.coefficientValue}
                      </td>
                      <td className="py-2.5 px-3 text-[#6b7280] text-[11px]">
                        {fw.intuitiveRole}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Internal Synthetic Hold-Out Evaluation Results */}
            <div className="p-4 rounded-xl bg-[#f3f4ee] border border-[#171717]/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                  Synthetic Hold-Out Evaluation (Internal Consistency Check)
                </div>
                <span className="text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded bg-[#fff4e5] text-[#86521b] border border-[#d97706]/25">
                  TEST DATA IS 100% SYNTHETIC
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs tabular-nums">
                <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#171717]/8">
                  <div className="text-[10px] text-[#6b7280] uppercase">
                    Training / Test Split
                  </div>
                  <div className="text-base font-bold text-[#171717] mt-0.5">
                    {modelEvaluation.trainingSetCount} /{' '}
                    {modelEvaluation.validationSetCount}
                  </div>
                  <div className="text-[10px] text-[#6b7280]">
                    {modelEvaluation.totalSyntheticObservations.toLocaleString()} total demo logs
                  </div>
                </div>

                <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#171717]/8">
                  <div className="text-[10px] text-[#6b7280] uppercase">
                    Synthetic MAE
                  </div>
                  <div className="text-base font-bold text-[#171717] mt-0.5">
                    ±{modelEvaluation.meanAbsoluteErrorPassengers} pax
                  </div>
                  <div className="text-[10px] text-[#6b7280]">
                    Mean absolute error
                  </div>
                </div>

                <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#171717]/8">
                  <div className="text-[10px] text-[#6b7280] uppercase">
                    Synthetic RMSE
                  </div>
                  <div className="text-base font-bold text-[#171717] mt-0.5">
                    {modelEvaluation.rootMeanSquaredErrorPassengers} pax
                  </div>
                  <div className="text-[10px] text-[#6b7280]">
                    Root mean sq. error
                  </div>
                </div>

                <div className="bg-[#ffffff] p-2.5 rounded-lg border border-[#171717]/8">
                  <div className="text-[10px] text-[#6b7280] uppercase">
                    Band Agreement
                  </div>
                  <div className="text-base font-bold text-[#0f7642] mt-0.5">
                    {modelEvaluation.categoryMatchRatePercent}%
                  </div>
                  <div className="text-[10px] text-[#6b7280]">
                    Low/Mod/High match
                  </div>
                </div>
              </div>
            </div>

            {/* Current Limitations */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#b91c1c] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Current Model &amp; Dataset Limitations</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#171717]">
                {modelEvaluation.limitations.map((lim, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 bg-[#f7f7f2] p-2.5 rounded-lg border border-[#171717]/8"
                  >
                    <span className="font-mono-tabular font-bold text-[#b91c1c]">
                      0{i + 1}.
                    </span>
                    <span className="text-[#6b7280]">{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Hypothetical m3 Integration & Data Quality / Missing Data Inventory */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          {/* Hypothetical Integration with m3 Commuter App */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#006d34] flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                <span>Hypothetical Integration with m3</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#171717] text-[#00e575] font-mono-tabular text-[10px] font-bold">
                {providerStatus.displayBadge}
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#171717]">
              Typed Provider Interface (IM3DataProvider)
            </h2>
            <p className="text-xs text-[#6b7280] leading-relaxed">
              {providerStatus.providerDescription}
            </p>

            <div className="p-3 rounded-xl bg-[#f3f4ee] border border-[#171717]/10 text-xs font-mono-tabular space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Active Implementation:</span>
                <span className="font-bold text-[#171717]">
                  {providerStatus.mode === 'DEMO_MODE'
                    ? 'DemoM3DataProvider'
                    : 'HttpM3DataProvider'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">VITE_M3_API_BASE_URL:</span>
                <span className="text-[#171717]">
                  {providerStatus.configuredBaseUrl ?? 'Not Configured (Demo Mode)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Dataset Snapshot:</span>
                <span className="text-[#171717]">
                  {providerStatus.lastSyncIso}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs tabular-nums">
              <div className="p-2.5 rounded-lg bg-[#f7f7f2] border border-[#171717]/8">
                <div className="text-[#6b7280] text-[11px]">
                  Transport Stages
                </div>
                <div className="text-lg font-bold text-[#171717]">
                  {stages.length} stages
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f7f7f2] border border-[#171717]/8">
                <div className="text-[#6b7280] text-[11px]">
                  Corridor Routes &amp; SACCOs
                </div>
                <div className="text-lg font-bold text-[#171717]">
                  {routes.length} routes · {saccos.length} SACCOs
                </div>
              </div>
            </div>
          </div>

          {/* Stage Data Quality & Missing-Data Indicators */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#171717]/8 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#006d34]" />
                <span>Data Quality &amp; Missing-Data Indicators</span>
              </div>
              <span className="text-xs font-mono-tabular text-[#171717] font-semibold">
                {observations.length} records
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {stages.map((stg) => (
                <div
                  key={stg.id}
                  onClick={() => navigateToStageInsights(stg.id)}
                  className="p-2.5 rounded-lg bg-[#f7f7f2] hover:bg-[#f3f4ee] border border-[#171717]/8 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#171717]">{stg.name}</span>
                    <span
                      className={`text-[10px] font-mono-tabular font-semibold px-2 py-0.5 rounded ${
                        stg.dataStatus === 'complete_demo'
                          ? 'bg-[#00e575]/15 text-[#005226]'
                          : 'bg-[#fff4e5] text-[#86521b]'
                      }`}
                    >
                      {stg.dataStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {stg.missingFieldsNote ? (
                    <p className="text-[11px] text-[#86521b] mt-1">
                      Missing-data indicator: {stg.missingFieldsNote}
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#6b7280] mt-0.5">
                      Full 7-day synthetic observation coverage across morning,
                      midday, and evening windows.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. People First, AI Second Section */}
      <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#171717]/8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#171717]/8">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#006d34] flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>Responsible Public Transport Governance</span>
            </div>
            <h2 className="text-xl font-bold text-[#171717] mt-0.5">
              People First, AI Second
            </h2>
          </div>
          <span className="text-xs text-[#6b7280]">
            Core design &amp; operational safeguards built into m3 CrowdSense
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {peopleFirstPrinciples.map((p, idx) => (
            <div
              key={p.title}
              className="p-4 rounded-xl bg-[#f7f7f2] border border-[#171717]/8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono-tabular text-[#006d34] font-bold mb-1.5">
                  <span>PRINCIPLE 0{idx + 1}</span>
                  {idx < 2 ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : idx < 4 ? (
                    <Users className="w-3.5 h-3.5" />
                  ) : (
                    <Scale className="w-3.5 h-3.5" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#171717]">{p.title}</h3>
                <p className="text-xs text-[#6b7280] mt-1.5 leading-relaxed">
                  {p.detail}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#171717]/6 flex items-center gap-1.5 text-[11px] font-semibold text-[#171717]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006d34]" />
                <span>Enforced in CrowdSense Architecture</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
