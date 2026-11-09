import type { EntriesPageDto, EntriesQuery } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { respond } from '../../../shared/mock/respond';
import { sampleEntries, sampleEntriesCsv } from './sample-data';

export type EntriesCriteria = Omit<EntriesQuery, 'page' | 'pageSize'>;

export interface EntriesApi {
  entries(query: EntriesQuery): Observable<EntriesPageDto>;
  exportCsv(criteria: EntriesCriteria): Observable<string>;
}

export const entriesApi: EntriesApi = {
  entries: (query) => respond(() => sampleEntries(query)),
  exportCsv: (criteria) => respond(() => sampleEntriesCsv(criteria)),
};
