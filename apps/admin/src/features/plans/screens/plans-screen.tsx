import type { PlanInput, PlansDto } from '@gibigib/types';
import { useNavigate, useParams } from 'react-router';
import { EmptyState } from '../../../shared/components/empty-state';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { LoadError } from '../../../shared/components/load-error';
import { SectionLabel } from '../../../shared/components/section-label';
import { ManagementHeader } from '../../../shared/layout/management-header';
import { MasterDetail } from '../../../shared/layout/master-detail';
import { PLANS_HREF } from '../../../shared/layout/navigation';
import { useSplitLayout, useViewport } from '../../../shared/layout/viewport';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { PlanEditor } from '../components/plan-editor';
import { PlanCards, PlanRows } from '../components/plan-list';
import { formatMemberships, popularSlug } from '../plan-format';
import { NEW_PLAN, plans$, retryPlans, savePlan, setPlanVisible } from '../services/plans-state';
import styles from './plans-screen.module.css';

const LOADING: Remote<PlansDto> = { status: 'loading' };
const HINT = 'Isključen plan nestaje iz aplikacije za nove članove. Postojeće članarine traju do kraja.';

const hrefOf = (slug: string) => `${PLANS_HREF}/${slug}`;

const gymsPhrase = (count: number) => (count === 4 ? 'sve četiri teretane' : `svih ${count} teretana`);

export function PlansScreen() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const split = useSplitLayout();
  const phone = useViewport() === 'phone';
  const view = useObservable(plans$, LOADING);
  const data = view.status === 'ready' ? view.data : undefined;
  const creating = planId === NEW_PLAN;
  const selectedSlug = creating ? undefined : (planId ?? (split ? data?.plans[0]?.slug : undefined));
  const selected = data?.plans.find((plan) => plan.slug === selectedSlug);
  const popular = data && popularSlug(data.plans);
  const toggleVisible = (slug: string, visible: boolean) => void setPlanVisible(slug, visible).catch(() => undefined);

  const save = async (input: PlanInput) => {
    const slug = await savePlan(selected?.slug ?? null, input);
    if (!split) navigate(PLANS_HREF);
    else if (creating) navigate(hrefOf(slug), { replace: true });
  };

  const subtitle = data
    ? phone
      ? `Vrijede u ${gymsPhrase(data.gymCount)}`
      : `Vrijede u ${gymsPhrase(data.gymCount)} · ${formatMemberships(data.activeMemberships)}`
    : 'Učitavam planove…';

  return (
    <MasterDetail
      busy={view.status === 'loading'}
      header={
        <ManagementHeader title="Planovi" subtitle={subtitle} action={{ label: 'Novi plan', to: hrefOf(NEW_PLAN) }} />
      }
      back={{ to: PLANS_HREF, label: 'Planovi' }}
      detailOpen={planId !== undefined}
      status={view.status === 'error' && <LoadError title="Planovi se nisu učitali" onRetry={retryPlans} />}
      list={
        <section className={styles.list} aria-labelledby="plans-heading">
          {!phone && <SectionLabel id="plans-heading">Planovi</SectionLabel>}
          {view.status === 'loading' && <ListSkeleton variant={phone ? 'cards' : 'table'} />}
          {data &&
            (phone ? (
              <PlanCards plans={data.plans} popular={popular} hrefOf={hrefOf} onVisible={toggleVisible} />
            ) : (
              <PlanRows
                plans={data.plans}
                popular={popular}
                selected={split ? selected?.slug : undefined}
                hrefOf={hrefOf}
                onVisible={toggleVisible}
              />
            ))}
          {data && <p className={styles.hint}>{HINT}</p>}
        </section>
      }
      detail={
        data &&
        (creating || selected ? (
          <PlanEditor
            key={selected?.slug ?? NEW_PLAN}
            plan={selected}
            framed={split || !phone}
            onSave={save}
            onCancel={() => {
              if (!split || creating) navigate(PLANS_HREF);
            }}
          />
        ) : (
          planId && (
            <EmptyState
              icon="tag"
              title="Plan nije pronađen."
              action={{ label: 'Svi planovi', onClick: () => navigate(PLANS_HREF) }}
            >
              Možda je preimenovan ili uklonjen.
            </EmptyState>
          )
        ))
      }
    />
  );
}
