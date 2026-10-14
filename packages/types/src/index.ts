// Shared domain types for the GibiGib platform.
// Consumed by @gibigib/api (backend), @gibigib/mobile (app) and @gibigib/admin (web).

/** Standard health-check payload returned by the API. */
export interface ApiHealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  database: 'up' | 'down';
}

export * from './auth';
export * from './attendance';
export * from './membership';
export * from './entry';
export * from './admin-overview';
export * from './admin-members';
export * from './admin-catalog';
export * from './admin-member-detail';
export * from './admin-entries';
export * from './admin-gym';
export * from './admin-revenue';
export * from './admin-plans';
export * from './admin-audit';
export * from './admin-events';
export * from './admin-trainers';
export * from './admin-devices';
