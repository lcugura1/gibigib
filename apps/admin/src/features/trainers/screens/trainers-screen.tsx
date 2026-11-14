import type { TrainerInput, TrainersDto } from '@gibigib/types';
import { useNavigate, useParams } from 'react-router';
import { useCatalog } from '../../../shared/catalog/catalog';
import { EmptyState } from '../../../shared/components/empty-state';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { LoadError } from '../../../shared/components/load-error';
import { SectionLabel } from '../../../shared/components/section-label';
import { ManagementHeader } from '../../../shared/layout/management-header';
import { MasterDetail } from '../../../shared/layout/master-detail';
import { TRAINERS_HREF } from '../../../shared/layout/navigation';
import { useSplitLayout, useViewport } from '../../../shared/layout/viewport';
import { formatInteger, pluralize } from '../../../shared/lib/format';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { TrainerEditor } from '../components/trainer-editor';
import { TrainerGrid, TrainerRows } from '../components/trainer-list';
import { NEW_TRAINER, removeTrainer, retryTrainers, saveTrainer, trainers$ } from '../services/trainers-state';
import styles from './trainers-screen.module.css';

const LOADING: Remote<TrainersDto> = { status: 'loading' };

const hrefOf = (id: string) => `${TRAINERS_HREF}/${id}`;

const formatTrainers = (count: number) =>
  `${formatInteger(count)} ${pluralize(count, { one: 'trener', few: 'trenera', other: 'trenera' })}`;

export function TrainersScreen() {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const split = useSplitLayout();
  const phone = useViewport() === 'phone';
  const catalog = useCatalog();
  const view = useObservable(trainers$, LOADING);
  const data = view.status === 'ready' ? view.data : undefined;
  const trainers = data?.trainers ?? [];
  const creating = trainerId === NEW_TRAINER;
  const selectedId = creating ? undefined : (trainerId ?? (split ? trainers[0]?.id : undefined));
  const selected = trainers.find((trainer) => trainer.id === selectedId);

  const save = async (input: TrainerInput) => {
    const id = await saveTrainer(selected?.id ?? null, input);
    if (!split) navigate(TRAINERS_HREF);
    else if (creating) navigate(hrefOf(id), { replace: true });
  };

  const remove = async () => {
    if (!selected) return;
    await removeTrainer(selected.id);
    navigate(TRAINERS_HREF, { replace: true });
  };

  const subtitle = data
    ? phone
      ? `${formatTrainers(trainers.length)} u aplikaciji`
      : `${formatTrainers(trainers.length)} · prikazuju se u aplikaciji`
    : 'Učitavam trenere…';

  return (
    <MasterDetail
      busy={view.status === 'loading'}
      header={
        <ManagementHeader
          title="Treneri"
          subtitle={subtitle}
          action={{ label: 'Dodaj trenera', to: hrefOf(NEW_TRAINER) }}
        />
      }
      back={{ to: TRAINERS_HREF, label: 'Treneri' }}
      detailOpen={trainerId !== undefined}
      status={view.status === 'error' && <LoadError title="Treneri se nisu učitali" onRetry={retryTrainers} />}
      list={
        <section className={styles.list} aria-labelledby="trainers-heading">
          {!phone && <SectionLabel id="trainers-heading">Svi treneri</SectionLabel>}
          {view.status === 'loading' && <ListSkeleton variant="cards" />}
          {data && trainers.length === 0 && (
            <div className={styles.empty}>
              <EmptyState icon="person" title="Još nema trenera." size="small">
                Dodani treneri prikazuju se članovima u aplikaciji.
              </EmptyState>
            </div>
          )}
          {trainers.length > 0 &&
            (phone ? (
              <TrainerRows trainers={trainers} hrefOf={hrefOf} />
            ) : (
              <TrainerGrid
                trainers={trainers}
                catalog={catalog}
                selected={split ? selected?.id : undefined}
                hrefOf={hrefOf}
              />
            ))}
        </section>
      }
      detail={
        data &&
        (creating || selected ? (
          <TrainerEditor
            key={selected?.id ?? NEW_TRAINER}
            trainer={selected}
            catalog={catalog}
            framed={split || !phone}
            onSave={save}
            onRemove={remove}
            onCancel={() => {
              if (!split || creating) navigate(TRAINERS_HREF);
            }}
          />
        ) : (
          trainerId && (
            <EmptyState
              icon="person"
              title="Trener nije pronađen."
              action={{ label: 'Svi treneri', onClick: () => navigate(TRAINERS_HREF) }}
            >
              Možda je uklonjen.
            </EmptyState>
          )
        ))
      }
    />
  );
}
