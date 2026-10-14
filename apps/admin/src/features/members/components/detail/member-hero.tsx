import { useState, type CSSProperties } from 'react';
import type { CatalogDto, MemberDetailDto } from '@gibigib/types';
import { Avatar } from '../../../../shared/components/avatar';
import { Icon } from '../../../../shared/components/icon';
import { StatusPill } from '../../../../shared/components/status-pill';
import { gymColor } from '../../../../shared/domain/palette';
import { useViewport } from '../../../../shared/layout/viewport';
import { formatDate } from '../../../../shared/lib/format';
import { isEnded } from '../../membership-rules';
import { STATUS_LABEL, STATUS_LEVEL } from '../../status';
import { CancelDialog, ExtendDialog, PauseDialog } from './member-dialogs';
import styles from './member-hero.module.css';

type OpenDialog = { kind: 'extend' | 'pause' | 'cancel'; snapshot: MemberDetailDto } | null;

interface MemberHeroProps {
  member: MemberDetailDto;
  catalog: CatalogDto;
}

export function MemberHero({ member, catalog }: MemberHeroProps) {
  const compact = useViewport() === 'phone';
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const { membership } = member;
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const gymName = catalog.gyms.find((gym) => gym.id === member.homeGymId)?.name ?? '';
  const ended = isEnded(member);
  const paused = membership.status === 'PAUSED';
  const presentation = compact ? 'sheet' : 'popup';
  const close = () => setDialog(null);
  const gymTag = { '--tag': gymColor(gymIds, member.homeGymId) } as CSSProperties;

  return (
    <section className={compact ? styles.phone : styles.hero} aria-label="Član">
      <div className={styles.identity}>
        <Avatar name={member.name} size="hero" />
        <div className={styles.names}>
          <h1 className={styles.name}>{member.name}</h1>
          {compact && <p className={styles.email}>{member.email}</p>}
          <p className={styles.meta}>
            <StatusPill level={STATUS_LEVEL[membership.status]}>{STATUS_LABEL[membership.status]}</StatusPill>
            {compact ? (
              <span>
                {membership.planName} · {gymName}
              </span>
            ) : (
              <span>
                {membership.planName} · matična teretana{' '}
                <span className={styles.gym} style={gymTag}>
                  {gymName}
                </span>{' '}
                · član od {formatDate(member.memberSince)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={() => setDialog({ kind: 'extend', snapshot: member })}
        >
          <Icon name="calendarPlus" />
          {ended ? 'Obnovi članarinu' : 'Produži članarinu'}
        </button>
        {!ended && (
          <>
            <button
              type="button"
              className={styles.outline}
              onClick={() => setDialog({ kind: 'pause', snapshot: member })}
            >
              <Icon name={paused ? 'play' : 'pause'} />
              {paused ? 'Nastavi' : 'Pauziraj'}
            </button>
            <button
              type="button"
              className={styles.danger}
              onClick={() => setDialog({ kind: 'cancel', snapshot: member })}
            >
              {compact ? 'Otkaži' : 'Otkaži članarinu'}
            </button>
          </>
        )}
      </div>

      {dialog?.kind === 'extend' && (
        <ExtendDialog member={dialog.snapshot} catalog={catalog} presentation={presentation} onClose={close} />
      )}
      {dialog?.kind === 'pause' && <PauseDialog member={dialog.snapshot} presentation={presentation} onClose={close} />}
      {dialog?.kind === 'cancel' && (
        <CancelDialog member={dialog.snapshot} presentation={presentation} onClose={close} />
      )}
    </section>
  );
}
