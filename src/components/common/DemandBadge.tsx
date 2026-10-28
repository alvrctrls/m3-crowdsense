import React from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import {
  DayType,
  DemandCategory,
  ForecastDirection,
  ForecastHorizon,
  TimePeriod,
} from '../../types/transport';

export const DemandCategoryBadge: React.FC<{
  category: DemandCategory;
  size?: 'sm' | 'md';
}> = ({ category, size = 'sm' }) => {
  const paddingClass =
    size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (category === 'high') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase rounded bg-[#ffebee] text-[#b91c1c] border border-[#dc2626]/20 whitespace-nowrap shrink-0 ${paddingClass}`}
      >
        <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>High Demand</span>
      </span>
    );
  }

  if (category === 'moderate') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase rounded bg-[#fff4e5] text-[#86521b] border border-[#d97706]/25 whitespace-nowrap shrink-0 ${paddingClass}`}
      >
        <Layers className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>Moderate</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase rounded bg-[#00e575]/15 text-[#005226] border border-[#00e575]/40 whitespace-nowrap shrink-0 ${paddingClass}`}
    >
      <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>Low Demand</span>
    </span>
  );
};

export const DirectionIndicator: React.FC<{
  direction: ForecastDirection;
  deltaPercent: number;
}> = ({ direction, deltaPercent }) => {
  const formatted = `${deltaPercent >= 0 ? '+' : ''}${deltaPercent.toFixed(1)}%`;

  if (direction === 'rising') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#b91c1c] tabular-nums whitespace-nowrap">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Rising ({formatted})</span>
      </span>
    );
  }

  if (direction === 'easing') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f7642] tabular-nums whitespace-nowrap">
        <ArrowDownRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Easing ({formatted})</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6b7280] tabular-nums whitespace-nowrap">
      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>Stable ({formatted})</span>
    </span>
  );
};

export const TimePeriodSelector: React.FC<{
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  compact?: boolean;
}> = ({ value, onChange, compact = false }) => {
  const options: { id: TimePeriod; label: string; sub: string }[] = [
    { id: 'morning_peak', label: 'Morning Peak', sub: '06:00–09:30' },
    { id: 'midday', label: 'Midday', sub: '10:00–15:30' },
    { id: 'evening_peak', label: 'Evening Peak', sub: '16:00–20:30' },
  ];

  return (
    <div
      role="group"
      aria-label="Time period selector"
      className="inline-flex items-center p-1 rounded-lg bg-[#f3f4ee] border border-[#171717]/10"
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              active
                ? 'bg-[#00e575] text-[#171717] shadow-xs border border-[#171717]/10'
                : 'text-[#6b7280] hover:text-[#171717]'
            }`}
          >
            <span>{opt.label}</span>
            {!compact && (
              <span
                className={`text-[10px] font-normal tabular-nums ${
                  active ? 'text-[#171717]/80' : 'text-[#6b7280]'
                }`}
              >
                {opt.sub}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const HorizonSelector: React.FC<{
  value: ForecastHorizon;
  onChange: (horizon: ForecastHorizon) => void;
}> = ({ value, onChange }) => {
  const horizons: ForecastHorizon[] = [15, 30, 60];
  return (
    <div
      role="group"
      aria-label="Forecast horizon selector"
      className="inline-flex items-center p-1 rounded-lg bg-[#f3f4ee] border border-[#171717]/10"
    >
      {horizons.map((h) => {
        const active = value === h;
        return (
          <button
            key={h}
            type="button"
            onClick={() => onChange(h)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold tabular-nums transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
              active
                ? 'bg-[#171717] text-[#ffffff]'
                : 'text-[#6b7280] hover:text-[#171717]'
            }`}
          >
            <Clock className="w-3 h-3 shrink-0 text-[#00e575]" />
            <span>+{h} min</span>
          </button>
        );
      })}
    </div>
  );
};

export const DayTypeSelector: React.FC<{
  value: DayType;
  onChange: (day: DayType) => void;
}> = ({ value, onChange }) => {
  const days: { id: DayType; label: string }[] = [
    { id: 'weekday', label: 'Weekday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  return (
    <div
      role="group"
      aria-label="Day type selector"
      className="inline-flex items-center p-1 rounded-lg bg-[#f3f4ee] border border-[#171717]/10"
    >
      {days.map((d) => {
        const active = value === d.id;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onChange(d.id)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              active
                ? 'bg-[#ffffff] text-[#171717] shadow-xs border border-[#171717]/10'
                : 'text-[#6b7280] hover:text-[#171717]'
            }`}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
};
