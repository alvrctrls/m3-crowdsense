import React, { useMemo, useState } from 'react';
import {
  Compass,
  Maximize2,
  Minus,
  Navigation,
  Plus,
} from 'lucide-react';
import {
  DemandCategory,
  StageForecastResult,
  TransportRoute,
  TransportStage,
} from '../../types/transport';

interface NairobiDemandMapProps {
  stages: TransportStage[];
  forecasts: StageForecastResult[];
  routes: TransportRoute[];
  selectedStageId: string;
  onSelectStage: (stageId: string) => void;
  compactPreview?: boolean;
  onExpandFullMap?: () => void;
}

// Bounding box for greater Nairobi commuter network
const LAT_MIN = -1.365;
const LAT_MAX = -1.202;
const LNG_MIN = 36.732;
const LNG_MAX = 36.915;

const SVG_WIDTH = 900;
const SVG_HEIGHT = 580;

function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  const xRatio = (lng - LNG_MIN) / (LNG_MAX - LNG_MIN);
  const yRatio = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN);
  return {
    x: Math.round(60 + xRatio * (SVG_WIDTH - 120)),
    y: Math.round(45 + yRatio * (SVG_HEIGHT - 90)),
  };
}

export const NairobiDemandMap: React.FC<NairobiDemandMapProps> = ({
  stages,
  forecasts,
  routes,
  selectedStageId,
  onSelectStage,
  compactPreview = false,
  onExpandFullMap,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);
  const [tileLoadError, setTileLoadError] = useState<boolean>(false);

  const mapTilerKey = import.meta.env?.VITE_MAPTILER_API_KEY;
  const hasMapTilerKey =
    typeof mapTilerKey === 'string' &&
    mapTilerKey.trim().length > 0 &&
    !tileLoadError;

  const forecastMap = useMemo(
    () => new Map(forecasts.map((f) => [f.stageId, f])),
    [forecasts]
  );

  const stageCoordMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number; stage: TransportStage }>();
    stages.forEach((stg) => {
      const pt = projectLatLng(stg.coordinates.lat, stg.coordinates.lng);
      m.set(stg.id, { ...pt, stage: stg });
    });
    return m;
  }, [stages]);

  const handleZoomIn = () => setZoom((z) => Math.min(2.2, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, Number((z - 0.25).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as HTMLElement).closest('[data-stage-marker="true"]')) {
      return;
    }
    setIsDragging(true);
    setDragOrigin({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const maxPan = 220 * zoom;
    const nx = Math.max(-maxPan, Math.min(maxPan, e.clientX - dragOrigin.x));
    const ny = Math.max(-maxPan, Math.min(maxPan, e.clientY - dragOrigin.y));
    setPan({ x: nx, y: ny });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const getMarkerStyle = (category: DemandCategory, isSelected: boolean) => {
    if (category === 'high') {
      return {
        fill: '#dc2626',
        ring: '#fca5a5',
        text: '#ffffff',
        badgeBg: '#ffebee',
        badgeText: '#b91c1c',
        codeLabel: 'HIGH',
        radius: isSelected ? 13 : 10,
      };
    }
    if (category === 'moderate') {
      return {
        fill: '#d97706',
        ring: '#fcd34d',
        text: '#ffffff',
        badgeBg: '#fff4e5',
        badgeText: '#86521b',
        codeLabel: 'MOD',
        radius: isSelected ? 12 : 9,
      };
    }
    return {
      fill: '#00e575',
      ring: '#006d34',
      text: '#171717',
      badgeBg: '#e6f9ef',
      badgeText: '#005226',
      codeLabel: 'LOW',
      radius: isSelected ? 12 : 8.5,
    };
  };

  return (
    <div className="relative w-full h-full bg-[#eef0ea] rounded-xl overflow-hidden border border-[#171717]/10 select-none">
      {/* Top-Left Status & Provider Mode Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-[#171717]/90 text-[#ffffff] text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#00e575]" />
          <span>DEMO SIMULATION · NAIROBI NETWORK</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-[#ffffff]/95 text-[#171717] border border-[#171717]/12 text-[10px] font-medium shadow-xs">
          {hasMapTilerKey
            ? 'MapTiler Backdrop + GIS Stage Layer'
            : 'Interactive Nairobi Corridor GIS Map (Demo Mode)'}
        </div>
      </div>

      {/* Top-Right Zoom / Recenter Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#ffffff]/95 p-1 rounded-lg border border-[#171717]/12 shadow-sm">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          aria-label="Zoom in map"
          className="p-1.5 rounded hover:bg-[#f3f4ee] text-[#171717] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          aria-label="Zoom out map"
          className="p-1.5 rounded hover:bg-[#f3f4ee] text-[#171717] transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Nairobi view"
          aria-label="Recenter map"
          className="px-2 py-1 rounded hover:bg-[#f3f4ee] text-[#171717] text-[11px] font-semibold flex items-center gap-1 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-[#006d34]" />
          <span>Reset</span>
        </button>
        {compactPreview && onExpandFullMap && (
          <button
            type="button"
            onClick={onExpandFullMap}
            className="ml-1 px-2.5 py-1 rounded bg-[#00e575] text-[#171717] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#00cb68] transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Full Map</span>
          </button>
        )}
      </div>

      {/* Optional MapTiler Static Backdrop when VITE_MAPTILER_API_KEY is configured */}
      {hasMapTilerKey && (
        <img
          src={`https://api.maptiler.com/maps/Positron/static/36.8235,-1.2835,11/900x580.png?key=${mapTilerKey}`}
          alt="Nairobi MapTiler Backdrop"
          referrerPolicy="no-referrer"
          onError={() => setTileLoadError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none"
        />
      )}

      {/* Interactive SVG GIS Canvas */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full h-full ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        role="region"
        aria-label="Nairobi transport stages demand map"
      >
        <defs>
          <pattern
            id="nairobi-grid"
            width="45"
            height="45"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 45 0 L 0 0 0 45"
              fill="none"
              stroke="#171717"
              strokeWidth="0.6"
              strokeOpacity="0.06"
            />
          </pattern>
        </defs>

        <g
          transform={`translate(${SVG_WIDTH / 2 + pan.x}, ${
            SVG_HEIGHT / 2 + pan.y
          }) scale(${zoom}) translate(${-SVG_WIDTH / 2}, ${-SVG_HEIGHT / 2})`}
        >
          {/* Coordinate Grid Background */}
          <rect
            x={-400}
            y={-400}
            width={SVG_WIDTH + 800}
            height={SVG_HEIGHT + 800}
            fill="url(#nairobi-grid)"
          />

          {/* Geographic Zones: Karura Forest (North), Nairobi National Park (South), CBD Core */}
          <polygon
            points="390,95 495,80 520,155 430,175"
            fill="#d9ead3"
            fillOpacity="0.55"
            stroke="#6b7b6c"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <text
            x="455"
            y="132"
            textAnchor="middle"
            className="text-[9px] fill-[#3b4a3d] font-semibold uppercase tracking-widest opacity-70"
          >
            Karura Forest
          </text>

          <polygon
            points="310,475 740,470 790,565 290,565"
            fill="#d9ead3"
            fillOpacity="0.5"
            stroke="#6b7b6c"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <text
            x="530"
            y="525"
            textAnchor="middle"
            className="text-[10px] fill-[#3b4a3d] font-semibold uppercase tracking-widest opacity-75"
          >
            Nairobi National Park Boundary
          </text>

          {/* Nairobi River Watercourse */}
          <path
            d="M 120,210 Q 320,255 455,275 T 820,235"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="3.5"
            strokeOpacity="0.65"
          />

          {/* Central Business District (CBD) Zone Ring */}
          <circle
            cx={455}
            cy={295}
            r={52}
            fill="#171717"
            fillOpacity="0.035"
            stroke="#171717"
            strokeOpacity="0.18"
            strokeDasharray="4 3"
          />
          <text
            x={455}
            y={236}
            textAnchor="middle"
            className="text-[9px] fill-[#6b7280] font-bold uppercase tracking-widest"
          >
            Nairobi CBD Core
          </text>

          {/* Major Nairobi Transport Corridor Polylines */}
          {routes.map((route) => {
            const pts = route.stageIds
              .map((sid) => stageCoordMap.get(sid))
              .filter(Boolean) as { x: number; y: number }[];
            if (pts.length < 2) return null;

            const isConnectedToSelected =
              route.stageIds.includes(selectedStageId);
            const pathD = pts
              .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ');

            return (
              <g key={route.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={isConnectedToSelected ? '#006d34' : '#171717'}
                  strokeOpacity={isConnectedToSelected ? 0.65 : 0.18}
                  strokeWidth={isConnectedToSelected ? 3.2 : 1.8}
                  strokeDasharray={isConnectedToSelected ? undefined : '4 3'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* Corridor Labels */}
          <text
            x={615}
            y={145}
            transform="rotate(-32 615 145)"
            className="text-[9px] fill-[#6b7280] font-semibold uppercase tracking-wider"
          >
            Thika Superhighway (A2)
          </text>
          <text
            x={290}
            y={215}
            transform="rotate(24 290 215)"
            className="text-[9px] fill-[#6b7280] font-semibold uppercase tracking-wider"
          >
            Waiyaki Way
          </text>
          <text
            x={605}
            y={308}
            className="text-[9px] fill-[#6b7280] font-semibold uppercase tracking-wider"
          >
            Jogoo Road Corridor
          </text>
          <text
            x={260}
            y={355}
            transform="rotate(-14 260 355)"
            className="text-[9px] fill-[#6b7280] font-semibold uppercase tracking-wider"
          >
            Ngong Road
          </text>
          <text
            x={545}
            y={395}
            transform="rotate(28 545 395)"
            className="text-[9px] fill-[#6b7280] font-semibold uppercase tracking-wider"
          >
            Mombasa Rd / Lusaka Rd
          </text>

          {/* Stage Markers */}
          {stages.map((stage) => {
            const coord = stageCoordMap.get(stage.id);
            const forecast = forecastMap.get(stage.id);
            if (!coord || !forecast) return null;

            const isSelected = stage.id === selectedStageId;
            const isHovered = stage.id === hoveredStageId;
            const style = getMarkerStyle(
              forecast.predictedCategory,
              isSelected
            );

            // Prevent label overlap in dense CBD cluster by offsetting label positions
            let labelOffsetY = -17;
            let labelOffsetX = 0;
            if (stage.id === 'stg-railways') {
              labelOffsetY = 24;
              labelOffsetX = 10;
            } else if (stage.id === 'stg-odeon') {
              labelOffsetY = -20;
              labelOffsetX = -14;
            } else if (stage.id === 'stg-kencom') {
              labelOffsetY = -18;
              labelOffsetX = 28;
            } else if (stage.id === 'stg-roysambu') {
              labelOffsetY = -18;
              labelOffsetX = -20;
            } else if (stage.id === 'stg-kasarani') {
              labelOffsetY = 22;
              labelOffsetX = 16;
            }

            return (
              <g
                key={stage.id}
                data-stage-marker="true"
                transform={`translate(${coord.x}, ${coord.y})`}
                onClick={() => onSelectStage(stage.id)}
                onMouseEnter={() => setHoveredStageId(stage.id)}
                onMouseLeave={() => setHoveredStageId(null)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${stage.name}: ${forecast.predictedCategory} predicted demand (${forecast.predictedPassengers} passengers)`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(stage.id);
                  }
                }}
              >
                {/* Selection / Active Halo */}
                {(isSelected || isHovered) && (
                  <circle
                    r={style.radius + 8}
                    fill={style.fill}
                    fillOpacity={0.22}
                    stroke={ isSelected ? '#171717' : style.fill }
                    strokeWidth={isSelected ? 2 : 1}
                  />
                )}

                {/* Outer Category Ring */}
                <circle
                  r={style.radius + 3}
                  fill="#ffffff"
                  stroke={isSelected ? '#171717' : style.fill}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />

                {/* Distinct Shape / Fill per Demand Category for Color-Blind Accessibility */}
                {forecast.predictedCategory === 'high' ? (
                  // High Demand: Bold Crimson Circle with Inner Exclamation Dot
                  <g>
                    <circle r={style.radius} fill={style.fill} />
                    <text
                      y={3.5}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-white font-mono-tabular"
                    >
                      !
                    </text>
                  </g>
                ) : forecast.predictedCategory === 'moderate' ? (
                  // Moderate Demand: Amber Diamond/Square-in-Circle
                  <g>
                    <circle r={style.radius} fill={style.fill} />
                    <rect
                      x={-3.5}
                      y={-3.5}
                      width={7}
                      height={7}
                      transform="rotate(45)"
                      fill="#ffffff"
                    />
                  </g>
                ) : (
                  // Low Demand: Electric Mint Circle with Dark Center Core
                  <g>
                    <circle r={style.radius} fill={style.fill} />
                    <circle r={3} fill="#171717" />
                  </g>
                )}

                {/* Stage Pill Label */}
                {(!compactPreview || isSelected || isHovered || stage.isHub) && (
                  <g transform={`translate(${labelOffsetX}, ${labelOffsetY})`}>
                    <rect
                      x={-58}
                      y={-10}
                      width={116}
                      height={19}
                      rx={4}
                      fill={isSelected ? '#171717' : '#ffffff'}
                      fillOpacity={0.95}
                      stroke="#171717"
                      strokeOpacity={isSelected ? 0.9 : 0.16}
                      strokeWidth={1}
                    />
                    <text
                      x={0}
                      y={2.5}
                      textAnchor="middle"
                      className={`text-[9.5px] font-semibold font-mono-tabular ${
                        isSelected ? 'fill-[#00e575]' : 'fill-[#171717]'
                      }`}
                    >
                      {stage.name.split('/')[0].trim()} · {forecast.predictedPassengers}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Bottom Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 bg-[#ffffff]/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-[#171717]/12 text-[11px] shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-[#171717] uppercase tracking-wider text-[10px]">
            Predicted Demand Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00e575] border border-[#171717]/40 inline-flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-[#171717]" />
            </span>
            <span className="text-[#171717] font-medium">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#d97706] inline-flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rotate-45" />
            </span>
            <span className="text-[#171717] font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#dc2626] text-white text-[8px] font-bold inline-flex items-center justify-center">
              !
            </span>
            <span className="text-[#171717] font-medium">High Pressure</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#6b7280] text-[10px]">
          <Navigation className="w-3 h-3 text-[#006d34]" />
          <span>Click any stage node to inspect forecast & factors</span>
        </div>
      </div>
    </div>
  );
};
