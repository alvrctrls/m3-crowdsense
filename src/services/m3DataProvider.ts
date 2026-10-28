import {
  NAIROBI_ROUTES,
  NAIROBI_SACCOS,
  NAIROBI_STAGES,
  SYNTHETIC_OBSERVATIONS,
} from '../data/nairobiTransportDataset';
import {
  IM3DataProvider,
  M3ProviderStatus,
  PassengerObservation,
  SaccoOperator,
  TransportRoute,
  TransportStage,
} from '../types/transport';

/**
 * DemoM3DataProvider supplies the deterministic synthetic dataset for m3 CrowdSense.
 * Used whenever VITE_M3_API_BASE_URL is not configured.
 */
export class DemoM3DataProvider implements IM3DataProvider {
  getProviderStatus(): M3ProviderStatus {
    return {
      mode: 'DEMO_MODE',
      displayBadge: 'm3 CONNECTION: DEMO MODE',
      configuredBaseUrl: null,
      lastSyncIso: '2026-10-28T08:30:00+03:00 (Synthetic Snapshot)',
      isLiveConnected: false,
      providerDescription:
        'Using deterministic synthetic Nairobi stage, SACCO, route, and passenger count records (DemoM3DataProvider). No external calls are made to the m3 commuter navigation app.',
    };
  }

  getStages(): TransportStage[] {
    return NAIROBI_STAGES;
  }

  getRoutes(): TransportRoute[] {
    return NAIROBI_ROUTES;
  }

  getSaccos(): SaccoOperator[] {
    return NAIROBI_SACCOS;
  }

  getObservations(): PassengerObservation[] {
    return SYNTHETIC_OBSERVATIONS;
  }
}

/**
 * HttpM3DataProvider prepares the architecture for future integration with a real
 * m3 API base URL without changing dashboard components or the forecasting interface.
 * To prevent fake network failures, it safely falls back to the cached synthetic schema
 * until a verified live m3 endpoint is connected.
 */
export class HttpM3DataProvider implements IM3DataProvider {
  private readonly baseUrl: string;
  private readonly fallback = new DemoM3DataProvider();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.trim();
  }

  getProviderStatus(): M3ProviderStatus {
    return {
      mode: 'HTTP_CONFIGURED',
      displayBadge: 'm3 CONNECTION: DEMO MODE (API URL CONFIGURED)',
      configuredBaseUrl: this.baseUrl,
      lastSyncIso: '2026-10-28T08:30:00+03:00 (Awaiting Verified Handshake)',
      isLiveConnected: false,
      providerDescription: `Configured with VITE_M3_API_BASE_URL (${this.baseUrl}). Serving deterministic synthetic fallback dataset until verified privacy-preserving passenger observation endpoints are enabled.`,
    };
  }

  getStages(): TransportStage[] {
    return this.fallback.getStages();
  }

  getRoutes(): TransportRoute[] {
    return this.fallback.getRoutes();
  }

  getSaccos(): SaccoOperator[] {
    return this.fallback.getSaccos();
  }

  getObservations(): PassengerObservation[] {
    return this.fallback.getObservations();
  }
}

export function createM3DataProvider(): IM3DataProvider {
  const rawUrl = import.meta.env?.VITE_M3_API_BASE_URL;
  if (typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    return new HttpM3DataProvider(rawUrl);
  }
  return new DemoM3DataProvider();
}

export const m3DataProvider: IM3DataProvider = createM3DataProvider();
