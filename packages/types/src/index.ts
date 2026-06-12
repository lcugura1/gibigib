// Shared domain types for the GibiGib platform.
// Consumed by both @gibigib/api (backend) and @gibigib/mobile (app).

/** Standard health-check payload returned by the API. */
export interface ApiHealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  database: 'up' | 'down';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export type MembershipStatus = 'active' | 'expired' | 'pending';

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  priceEur: number;
  durationDays: number;
}

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  status: MembershipStatus;
  startsAt: string;
  expiresAt: string;
}

export interface AttendanceEntry {
  id: string;
  userId: string;
  checkedInAt: string;
  location: string;
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
}

export interface GymInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  openingHours: string;
}

export * from './auth';
