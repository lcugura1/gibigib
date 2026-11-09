import { useState, type ReactNode } from 'react';
import type { CatalogDto, MemberDetailDto } from '@gibigib/types';
import { Card } from '../../../../shared/components/card';
import { Icon, type IconName } from '../../../../shared/components/icon';
import { SectionLabel } from '../../../../shared/components/section-label';
import { useViewport } from '../../../../shared/layout/viewport';
import { formatDate } from '../../../../shared/lib/format';
import { revealMemberOib } from '../../services/member-state';
import styles from './profile-card.module.css';

const MASK = '••••••••';

function yearsSince(fromIso: string, toIso: string) {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const beforeAnniversary =
    to.getMonth() < from.getMonth() || (to.getMonth() === from.getMonth() && to.getDate() < from.getDate());
  return to.getFullYear() - from.getFullYear() - (beforeAnniversary ? 1 : 0);
}

type OibState = { kind: 'hidden' } | { kind: 'loading' } | { kind: 'shown'; value: string } | { kind: 'failed' };

interface ProfileCardProps {
  member: MemberDetailDto;
  catalog: CatalogDto;
  className?: string;
}

function Row({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) {
  return (
    <li className={styles.row}>
      <span className={styles.icon}>
        <Icon name={icon} />
      </span>
      <div className={styles.text}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{children}</p>
      </div>
    </li>
  );
}

export function ProfileCard({ member, catalog, className }: ProfileCardProps) {
  const compact = useViewport() === 'phone';
  const [oib, setOib] = useState<OibState>({ kind: 'hidden' });
  const gym = catalog.gyms.find((g) => g.id === member.homeGymId);
  const years = yearsSince(member.memberSince, member.asOf);

  const toggleOib = async () => {
    if (oib.kind === 'shown') {
      setOib({ kind: 'hidden' });
      return;
    }
    setOib({ kind: 'loading' });
    try {
      setOib({ kind: 'shown', value: await revealMemberOib(member.id) });
    } catch {
      setOib({ kind: 'failed' });
    }
  };

  return (
    <section className={className} aria-labelledby="profile-heading">
      {compact && (
        <SectionLabel id="profile-heading" className={styles.outerLabel}>
          Profil
        </SectionLabel>
      )}
      <Card className={styles.card}>
        {!compact && <SectionLabel id="profile-heading">Profil</SectionLabel>}
        <ul className={styles.rows}>
          {!compact && (
            <Row icon="mail" label="E-adresa">
              {member.email}
            </Row>
          )}
          <li className={styles.row}>
            <span className={styles.icon}>
              <Icon name="idCard" />
            </span>
            <div className={styles.text}>
              <p className={styles.label}>OIB</p>
              <p className={styles.value}>{oib.kind === 'shown' ? oib.value : `${MASK} ${member.oibLast3}`}</p>
              {oib.kind === 'failed' && <p className={styles.error}>OIB se nije učitao. Pokušaj ponovno.</p>}
            </div>
            <button type="button" className={styles.reveal} disabled={oib.kind === 'loading'} onClick={toggleOib}>
              {oib.kind === 'shown' ? 'Sakrij' : 'Prikaži'}
            </button>
          </li>
          <Row icon="calendar" label="Datum rođenja">
            {formatDate(member.birthDate)}
          </Row>
          <Row icon="clock" label="Član od">
            {formatDate(member.memberSince)}
            {years > 0 && ` · ${years} god.`}
          </Row>
          <Row icon="pin" label="Matična teretana">
            {gym ? (compact ? gym.name : `${gym.name} · ${gym.address}`) : '—'}
          </Row>
        </ul>
      </Card>
    </section>
  );
}
