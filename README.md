# m3 CrowdSense

**m3 CrowdSense** is an AI-assisted public transport demand intelligence dashboard for the Greater Nairobi Metropolitan Area.

While the core **m3** application serves commuters with route discovery and navigation, **m3 CrowdSense** acts as the companion operational intelligence and planning layer for **SACCO owners, fleet dispatchers, bus drivers, and public transport planners**.

---

## 1. What m3 CrowdSense Does

- **Network Demand Overview**: Monitors 30 transport stages across 13 Greater Nairobi corridors (CBD, Thika Superhighway, Waiyaki Way, Ngong Road, Jogoo Road, Outering Road, Mombasa Road, Kiambu Road, and Lang'ata/Magadi Road) across Morning Peak, Midday, and Evening Peak windows.
- **Interactive Spatial Demand Map**: Displays stage-level demand categories (**Low**, **Moderate**, **High Pressure**) on an interactive MapTiler/Leaflet street and corridor map with SACCO, category, and search filters.
- **Per-Stage Diagnostics (`Stage Insights`)**: Compares observed baseline boarding queues against 15-, 30-, and 60-minute predictions, highlighting headway gaps, kerbside dwell times, and data completeness.
- **Explainable Demand Forecasting (`Forecasts`)**: Uses a transparent, deterministic multi-factor linear baseline ($\beta_{\text{hist}}, \beta_{\text{tod}}, \beta_{\text{hdw}}, \beta_{\text{hub}}$) to estimate waiting passenger volume and 90% confidence intervals without black-box guesswork.
- **SACCO Fleet & Driver Decision Support (`SACCO Planning`)**: Generates advisory operational actions per SACCO—such as tightening dispatch headways, reviewing vehicle seat capacity on surging corridors, or coordinating stage bay turnover—while enforcing **People First** equity safeguards so low-demand community stages never lose baseline coverage.

> **Important Distinction**: CrowdSense estimates **waiting and boarding passenger demand at stage kerbsides**, which is distinct from physical **vehicular road traffic congestion**.

---

## 2. Running Concurrently with the Core `m3` Repository

**m3 CrowdSense** is architected as a standalone companion repository that runs alongside the primary **m3** commuter app and connects through a typed provider contract (`IM3DataProvider` in `src/services/m3DataProvider.ts`).

```text
┌───────────────────────────────────────┐       ┌──────────────────────────────────────────┐
│           m3 Commuter App             │       │              m3 CrowdSense               │
│  (Commuter Navigation & Stage Check)  │       │ (SACCO Owners, Bus Drivers & Planners)   │
├───────────────────────────────────────┤       ├──────────────────────────────────────────┤
│ • Commuter route queries & stage pins │       │ • 15 / 30 / 60-min stage demand forecast │
│ • Aggregated stage check-ins          │──────▶│ • Headway & dwell-time pressure alerts   │
│ • Bus arrival headway telemetry       │ REST  │ • Advisory SACCO fleet allocation        │
│ • Shared Stage IDs & Route IDs        │  API  │ • Driver & marshal stage queue visibility│
└───────────────────────────────────────┘       └──────────────────────────────────────────┘
```

### How the Two Repos Work Together for Drivers & SACCO Owners

1. **Shared Domain Identifiers**: Both repositories use stable stage IDs (`stg-kencom`, `stg-roysambu`, `stg-githurai-45`, etc.), route IDs (`rt-45-roysambu`, `rt-105-westlands`), and SACCO codes (`SMET`, `CHOP`, `FRWD`, `2NKD`, `EMBS`, `LATM`).
2. **Offline / Standalone Demo Mode (Default)**: When `VITE_M3_API_BASE_URL` is unset, CrowdSense automatically uses `DemoM3DataProvider` (`1,260` deterministic synthetic observations across 30 stages) and displays `m3 CONNECTION: DEMO MODE`.
3. **Concurrent Live Integration Mode**: When running concurrently with the `m3` backend service:
   - Point `VITE_M3_API_BASE_URL` in `.env` to the running `m3` backend API (e.g., `http://localhost:4000/api/v1`).
   - `createM3DataProvider()` switches to `HttpM3DataProvider` without changing any UI components or forecasting logic.
   - **For SACCO Owners & Dispatchers**: Aggregated commuter demand signals from `m3` feed into CrowdSense's `SACCO Planning` view to highlight where additional vehicles or tighter headways are needed over the next 15–60 minutes.
   - **For Bus Drivers & Stage Marshals**: Provides stage-by-stage queue pressure and dwell-time expectations along their assigned corridor before they depart the terminus.

---

## 3. Quick Start & Environment Variables

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Run TypeScript checks & deterministic forecast verification suite
npm run lint
npx tsx src/services/verifyForecastEngine.ts

# Build for production
npm run build
```

### Environment Configuration (`.env`)

```env
# Optional: URL of the concurrent m3 backend service for SACCO/driver telemetry.
# Leave empty to run in deterministic Demo Mode (DemoM3DataProvider).
VITE_M3_API_BASE_URL=""

# Optional: MapTiler API key for custom vector/raster street tiles.
# Falls back automatically to high-clarity Voyager/Positron/OSM street tiles if omitted.
VITE_MAPTILER_API_KEY=""
```
