import type { EventInput, EventStatus, EventsDto } from '@gibigib/types';
import { useNavigate, useParams } from 'react-router';
import { EmptyState } from '../../../shared/components/empty-state';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { LoadError } from '../../../shared/components/load-error';
import { SectionLabel } from '../../../shared/components/section-label';
import { SegmentedControl } from '../../../shared/components/segmented-control';
import { ManagementHeader } from '../../../shared/layout/management-header';
import { MasterDetail } from '../../../shared/layout/master-detail';
import { EVENTS_HREF } from '../../../shared/layout/navigation';
import { useSplitLayout, useViewport } from '../../../shared/layout/viewport';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { EventEditor } from '../components/event-editor';
import { EventCards, EventRows } from '../components/event-list';
import {
  NEW_EVENT,
  events$,
  filter$,
  removeEvent,
  retryEvents,
  saveEvent,
  selectFilter,
  type EventFilter,
} from '../services/events-state';
import styles from './events-screen.module.css';

const LOADING: Remote<EventsDto> = { status: 'loading' };

const hrefOf = (id: string) => `${EVENTS_HREF}/${id}`;

const FILTER_LABEL: Record<EventFilter, string> = { all: 'Sve', PUBLISHED: 'Objavljeno', DRAFT: 'Skica' };

const EMPTY_TEXT: Record<EventFilter, string> = {
  all: 'Objave se prikazuju članovima u aplikaciji. Dodaj prvu objavu.',
  PUBLISHED: 'Još nema objavljenih događaja.',
  DRAFT: 'Nema skica. Sve objave su objavljene.',
};

export function EventsScreen() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const split = useSplitLayout();
  const phone = useViewport() === 'phone';
  const view = useObservable(events$, LOADING);
  const filter = useObservable(filter$, filter$.value);
  const data = view.status === 'ready' ? view.data : undefined;
  const all = data?.events ?? [];
  const shown = filter === 'all' ? all : all.filter((event) => event.status === filter);
  const creating = eventId === NEW_EVENT;
  const selectedId = creating ? undefined : (eventId ?? (split ? shown[0]?.id : undefined));
  const selected = all.find((event) => event.id === selectedId);

  const count = (value: EventFilter) =>
    value === 'all' ? all.length : all.filter((event) => event.status === value).length;

  const save = async (input: EventInput, status: EventStatus) => {
    const id = await saveEvent(selected?.id ?? null, input, status);
    if (!split) navigate(EVENTS_HREF);
    else if (creating) navigate(hrefOf(id), { replace: true });
  };

  const remove = async () => {
    if (!selected) return;
    await removeEvent(selected.id);
    navigate(EVENTS_HREF, { replace: true });
  };

  const filters = (Object.keys(FILTER_LABEL) as EventFilter[]).map((value) => ({
    value,
    label: FILTER_LABEL[value],
    count: data && (!phone || value === filter) ? count(value) : undefined,
  }));

  return (
    <MasterDetail
      busy={view.status === 'loading'}
      header={
        <ManagementHeader
          title="Događaji"
          subtitle={phone ? 'Objave u aplikaciji za članove' : 'Objave koje članovi vide u aplikaciji'}
          action={{ label: 'Nova objava', to: hrefOf(NEW_EVENT) }}
        />
      }
      back={{ to: EVENTS_HREF, label: 'Događaji' }}
      detailOpen={eventId !== undefined}
      status={view.status === 'error' && <LoadError title="Objave se nisu učitale" onRetry={retryEvents} />}
      list={
        <section className={styles.list} aria-labelledby="events-heading">
          <div className={styles.head}>
            {!phone && <SectionLabel id="events-heading">Objave</SectionLabel>}
            <SegmentedControl
              label="Status objave"
              options={filters}
              value={filter}
              onChange={selectFilter}
              size="small"
              fill={phone}
            />
          </div>
          {view.status === 'loading' && <ListSkeleton variant={phone ? 'cards' : 'table'} />}
          {data && shown.length === 0 && (
            <div className={styles.empty}>
              <EmptyState icon="calendar" title="Nema objava." size="small">
                {EMPTY_TEXT[filter]}
              </EmptyState>
            </div>
          )}
          {shown.length > 0 &&
            (phone ? (
              <EventCards events={shown} hrefOf={hrefOf} />
            ) : (
              <EventRows events={shown} selected={split ? selected?.id : undefined} hrefOf={hrefOf} />
            ))}
        </section>
      }
      detail={
        data &&
        (creating || selected ? (
          <EventEditor
            key={selected?.id ?? NEW_EVENT}
            event={selected}
            framed={split || !phone}
            onSave={save}
            onRemove={remove}
            onCancel={() => navigate(EVENTS_HREF)}
          />
        ) : (
          eventId && (
            <EmptyState
              icon="calendar"
              title="Objava nije pronađena."
              action={{ label: 'Sve objave', onClick: () => navigate(EVENTS_HREF) }}
            >
              Možda je obrisana.
            </EmptyState>
          )
        ))
      }
    />
  );
}
