import React, { useState } from 'react';
import { HourlyDemandPoint, TimePeriod } from '../../types/transport';

interface DemandTrendChartProps {
  series: HourlyDemandPoint[];
  stageName: string;
  selectedTimePeriod: TimePeriod;
  horizonMinutes: number;
  height?: number;
  showCapacityLine?: boolean;
}

export const DemandTrendChart: React.FC<DemandTrendChartProps> = ({
  series,
  stageName,
  selectedTimePeriod,
  horizonMinutes,
  height = 240,
  showCapacityLine = true,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!series || series.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-[#6b7280] bg-[#f3f4ee] rounded-lg">
        No diurnal series available for selected stage.
      </div>
    );
  }

  const width = 720;
  const padLeft = 44;
  const padRight = 20;
  const padTop = 24;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxDataVal = Math.max(
    ...series.map((d) =>
      Math.max(d.historicalObserved, d.forecastedDemand, d.baselineCapacity)
    ),
    200
  );
  const yMax = Math.ceil((maxDataVal * 1.12) / 50) * 50;

  const xForIndex = (idx: number) =>
    padLeft + (idx / Math.max(1, series.length - 1)) * plotW;
  const yForValue = (val: number) =>
    padTop + plotH - (Math.min(yMax, Math.max(0, val)) / yMax) * plotH;

  // Build SVG path for historical observed (solid dark)
  const histPoints = series.map((d, i) => `${xForIndex(i)},${yForValue(d.historicalObserved)}`);
  const histLinePath = `M ${histPoints.join(' L ')}`;
  const histAreaPath = `${histLinePath} L ${xForIndex(series.length - 1)},${padTop + plotH} L ${xForIndex(0)},${padTop + plotH} Z`;

  // Build SVG path for forecasted demand (dashed electric mint / high-contrast stroke)
  const forecastPoints = series.map((d, i) => `${xForIndex(i)},${yForValue(d.forecastedDemand)}`);
  const forecastLinePath = `M ${forecastPoints.join(' L ')}`;

  const capacityY = yForValue(series[0].baselineCapacity);

  // Determine active time period highlight band
  const periodIndices = series
    .map((d, idx) => (d.timePeriod === selectedTimePeriod ? idx : -1))
    .filter((idx) => idx !== -1);
  const bandStartX =
    periodIndices.length > 0 ? xForIndex(periodIndices[0]) : padLeft;
  const bandEndX =
    periodIndices.length > 0
      ? xForIndex(periodIndices[periodIndices.length - 1])
      : padLeft;

  const activePoint =
    hoverIndex !== null && series[hoverIndex]
      ? series[hoverIndex]
      : series.find((d) => d.isSelectedPeriod && (d.hour === 7 || d.hour === 13 || d.hour === 18)) ??
        series[Math.floor(series.length / 2)];

  const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

  return (
    <div className="w-full">
      {/* Legend & Active Readout Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#171717] inline-block" />
            <span className="text-[#6b7280] font-medium">
              Historical Demo Baseline
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#00e575] border border-[#171717]/30 inline-block rounded-xs" />
            <span className="text-[#171717] font-semibold">
              Predicted (+{horizonMinutes}m Horizon)
            </span>
          </div>
          {showCapacityLine && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 border-t border-dashed border-[#b91c1c] inline-block" />
              <span className="text-[#6b7280]">
                Stage Reference Capacity ({series[0].baselineCapacity} pax)
              </span>
            </div>
          )}
        </div>

        {activePoint && (
          <div className="flex items-center gap-2 bg-[#f3f4ee] px-2.5 py-1 rounded-md border border-[#171717]/8 tabular-nums">
            <span className="font-semibold text-[#171717]">
              {activePoint.label}
            </span>
            <span aria-hidden="true" className="text-[#6b7280]">
              ·
            </span>
            <span className="text-[#6b7280]">
              Obs:{' '}
              <strong className="text-[#171717]">
                {activePoint.historicalObserved}
              </strong>
            </span>
            <span aria-hidden="true" className="text-[#6b7280]">
              ·
            </span>
            <span className="text-[#0f7642] font-semibold">
              Forecast: {activePoint.forecastedDemand} pax
            </span>
          </div>
        )}
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
          role="img"
          aria-label={`Diurnal passenger demand chart for ${stageName}`}
        >
          {/* Active Time Period Highlight Band */}
          {periodIndices.length > 0 && (
            <rect
              x={Math.max(padLeft, bandStartX - 10)}
              y={padTop}
              width={Math.min(
                plotW,
                Math.max(24, bandEndX - bandStartX + 20)
              )}
              height={plotH}
              fill="#00e575"
              fillOpacity={0.08}
              rx={4}
            />
          )}

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = yForValue(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#171717"
                  strokeOpacity={0.07}
                  strokeDasharray={tick === 0 ? undefined : '3 3'}
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-[#6b7280] font-mono-tabular"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Reference Capacity Threshold Line */}
          {showCapacityLine && capacityY >= padTop && capacityY <= padTop + plotH && (
            <g>
              <line
                x1={padLeft}
                y1={capacityY}
                x2={width - padRight}
                y2={capacityY}
                stroke="#b91c1c"
                strokeWidth={1.2}
                strokeDasharray="5 4"
                strokeOpacity={0.65}
              />
            </g>
          )}

          {/* Historical Observed Area & Solid Line */}
          <path d={histAreaPath} fill="#171717" fillOpacity={0.05} />
          <path
            d={histLinePath}
            fill="none"
            stroke="#171717"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forecasted Demand Trajectory (Distinct Dashed + Mint Signal) */}
          <path
            d={forecastLinePath}
            fill="none"
            stroke="#006d34"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points & Interactive Columns */}
          {series.map((pt, idx) => {
            const cx = xForIndex(idx);
            const cyHist = yForValue(pt.historicalObserved);
            const cyForecast = yForValue(pt.forecastedDemand);
            const isHovered = hoverIndex === idx;

            return (
              <g
                key={pt.hour}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover hit column */}
                <rect
                  x={cx - plotW / series.length / 2}
                  y={padTop}
                  width={plotW / series.length}
                  height={plotH}
                  fill="transparent"
                />

                {isHovered && (
                  <line
                    x1={cx}
                    y1={padTop}
                    x2={cx}
                    y2={padTop + plotH}
                    stroke="#171717"
                    strokeOpacity={0.2}
                    strokeWidth={1}
                  />
                )}

                {/* Historical dot */}
                <circle
                  cx={cx}
                  cy={cyHist}
                  r={isHovered ? 4 : 2.5}
                  fill="#ffffff"
                  stroke="#171717"
                  strokeWidth={1.5}
                />

                {/* Forecasted dot */}
                <circle
                  cx={cx}
                  cy={cyForecast}
                  r={isHovered || pt.isSelectedPeriod ? 4.5 : 3}
                  fill="#00e575"
                  stroke="#171717"
                  strokeWidth={1.5}
                />

                {/* X-axis hour labels (every 2 hours) */}
                {(idx % 2 === 0 || idx === series.length - 1) && (
                  <text
                    x={cx}
                    y={height - 10}
                    textAnchor="middle"
                    className={`text-[10px] font-mono-tabular ${
                      pt.isSelectedPeriod
                        ? 'fill-[#171717] font-semibold'
                        : 'fill-[#6b7280]'
                    }`}
                  >
                    {pt.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
