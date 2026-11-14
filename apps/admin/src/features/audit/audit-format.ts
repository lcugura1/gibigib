import type { AuditActorKind, AuditKind } from '@gibigib/types';
import { formatInteger, pluralize } from '../../shared/lib/format';

export const AUDIT_KIND_LABEL: Record<AuditKind, string> = {
  DEVICE: 'Uređaj',
  MEMBERSHIP: 'Članarina',
  PLAN: 'Plan',
  PAYMENT: 'Plaćanje',
  EVENT: 'Objava',
  TRAINER: 'Trener',
  SETTINGS: 'Postavke',
};

export const AUDIT_ACTOR_LABEL: Record<AuditActorKind, string> = {
  OWNER: 'Vlasnik',
  SYSTEM: 'Sustav',
  MEMBER: 'Član',
};

export const formatChanges = (count: number) =>
  `${formatInteger(count)} ${pluralize(count, { one: 'promjena', few: 'promjene', other: 'promjena' })}`;

export const formatChangesGenitive = (count: number) =>
  `${formatInteger(count)} ${pluralize(count, { one: 'promjene', few: 'promjene', other: 'promjena' })}`;
