import type { AnalyticsRange, AuditEntryDto, AuditPageDto, AuditQuery } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { GYMS, local, mockNow } from '../../../shared/mock/fixtures';
import { respond } from '../../../shared/mock/respond';
import { AUDIT_KIND_LABEL } from '../audit-format';
import { auditEntries } from './audit-store';

export type AuditCriteria = Omit<AuditQuery, 'page' | 'pageSize'>;

export interface AuditApi {
  entries(query: AuditQuery): Observable<AuditPageDto>;
  exportCsv(criteria: AuditCriteria): Observable<string>;
}

const DAY_MS = 86_400_000;
const RANGE_DAYS: Record<Exclude<AnalyticsRange, 'today'>, number> = { '7d': 7, '30d': 30, '12m': 365 };

function rangeStart(range: AnalyticsRange) {
  const now = mockNow();
  return range === 'today'
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
    : new Date(now.getTime() - RANGE_DAYS[range] * DAY_MS);
}

function matching({ range, kind, actor, gymId }: AuditCriteria): AuditEntryDto[] {
  const from = local(rangeStart(range));
  return auditEntries().filter(
    (entry) =>
      entry.at >= from &&
      (!kind || entry.kind === kind) &&
      (!actor || entry.actor.kind === actor) &&
      (!gymId || entry.gymId === gymId),
  );
}

function sampleAudit(query: AuditQuery): AuditPageDto {
  const all = matching(query);
  const first = (query.page - 1) * query.pageSize;
  return {
    asOf: local(mockNow()),
    items: all.slice(first, first + query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
    total: all.length,
  };
}

const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

function sampleAuditCsv(criteria: AuditCriteria) {
  const gymName = (id: string | null) => (id ? (GYMS.find((gym) => gym.id === id)?.name ?? '') : 'Sve teretane');
  const header = ['Kada', 'Tko', 'Vrsta', 'Što', 'Detalji', 'Teretana'];
  const rows = matching(criteria).map((entry) => [
    entry.at.replace('T', ' ').slice(0, 16),
    entry.actor.name,
    AUDIT_KIND_LABEL[entry.kind],
    entry.title,
    entry.details.join(' · '),
    gymName(entry.gymId),
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
}

export const auditApi: AuditApi = {
  entries: (query) => respond(() => sampleAudit(query)),
  exportCsv: (criteria) => respond(() => sampleAuditCsv(criteria)),
};
