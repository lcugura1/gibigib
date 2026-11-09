import { useMemo } from 'react';
import { useParams } from 'react-router';
import { EmptyState } from '../../../shared/components/empty-state';
import { LoadError } from '../../../shared/components/load-error';
import { Skeleton, SkeletonCard } from '../../../shared/components/skeleton';
import { useCatalog } from '../../../shared/catalog/catalog';
import { BackBar } from '../../../shared/layout/back-bar';
import { MEMBERS_HREF } from '../../../shared/layout/navigation';
import { useObservable } from '../../../shared/lib/use-observable';
import { AttendanceCalendar } from '../components/detail/attendance-calendar';
import { ChangeLog } from '../components/detail/change-log';
import { MemberHero } from '../components/detail/member-hero';
import { MembershipCard } from '../components/detail/membership-card';
import { PausesCard } from '../components/detail/pauses-card';
import { Payments } from '../components/detail/payments';
import { ProfileCard } from '../components/detail/profile-card';
import { VisitsByGym } from '../components/detail/visits-by-gym';
import { memberDetail$, retryMember, type MemberView } from '../services/member-state';
import styles from './member-detail-screen.module.css';

const LOADING: MemberView = { status: 'loading' };

function DetailSkeleton() {
  return (
    <div className={styles.grid} aria-hidden="true">
      {[styles.membership, styles.calendar, styles.profile, styles.gyms].map((area) => (
        <SkeletonCard key={area} className={`${area} ${styles.skeleton}`}>
          <Skeleton width="40%" height="0.75rem" />
          <Skeleton width="60%" height="1.5rem" shape="block" />
          <Skeleton width="80%" height="0.75rem" />
          <Skeleton width="70%" height="0.75rem" />
        </SkeletonCard>
      ))}
    </div>
  );
}

export function MemberDetailScreen() {
  const { memberId = '' } = useParams();
  const view$ = useMemo(() => memberDetail$(memberId), [memberId]);
  const view = useObservable(view$, LOADING);
  const catalog = useCatalog();

  return (
    <div className={styles.screen} aria-busy={view.status === 'loading'}>
      <BackBar to={MEMBERS_HREF} label="Članovi" phoneTitle="Član" />

      {view.status === 'loading' && <DetailSkeleton />}

      {view.status === 'error' && <LoadError title="Član se nije učitao" onRetry={() => retryMember(memberId)} />}

      {view.status === 'notFound' && (
        <EmptyState icon="people" title="Član nije pronađen.">
          Moguće je da je zapis uklonjen ili da je poveznica neispravna. Vrati se na popis članova.
        </EmptyState>
      )}

      {view.status === 'ready' && (
        <>
          <MemberHero member={view.member} catalog={catalog} />
          <div className={styles.grid}>
            <MembershipCard className={styles.membership} member={view.member} />
            <AttendanceCalendar className={styles.calendar} member={view.member} />
            <VisitsByGym className={styles.gyms} member={view.member} catalog={catalog} />
            <ProfileCard className={styles.profile} member={view.member} catalog={catalog} />
            <PausesCard className={styles.pauses} member={view.member} />
            <Payments className={styles.payments} member={view.member} />
            <ChangeLog className={styles.log} member={view.member} />
          </div>
        </>
      )}
    </div>
  );
}
