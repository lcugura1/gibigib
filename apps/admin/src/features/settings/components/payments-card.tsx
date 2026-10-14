import { useState } from 'react';
import type { SettingsDto } from '@gibigib/types';
import { Button } from '../../../shared/components/button';
import { Icon } from '../../../shared/components/icon';
import { StatusPill } from '../../../shared/components/status-pill';
import { useViewport } from '../../../shared/layout/viewport';
import { SettingsCard } from './settings-card';
import styles from './payments-card.module.css';

const STRIPE_DASHBOARD = 'https://dashboard.stripe.com';

const listOf = (items: readonly string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} i ${items.at(-1)}` : (items[0] ?? '');

interface PaymentsCardProps {
  stripe: SettingsDto['stripe'];
  onConnect: () => Promise<void>;
}

export function PaymentsCard({ stripe, onConnect }: PaymentsCardProps) {
  const phone = useViewport() === 'phone';
  const [state, setState] = useState<'idle' | 'busy' | 'failed'>('idle');

  const connect = async () => {
    setState('busy');
    try {
      await onConnect();
      setState('idle');
    } catch {
      setState('failed');
    }
  };

  const pill = stripe.connected ? (
    <StatusPill level="ok">{phone ? 'Povezan' : 'Stripe povezan'}</StatusPill>
  ) : (
    <StatusPill level="muted">Nije povezan</StatusPill>
  );

  if (phone) {
    return (
      <SettingsCard id="payments-settings" label="Plaćanja" flush>
        {stripe.connected ? (
          <a className={styles.row} href={STRIPE_DASHBOARD} target="_blank" rel="noreferrer">
            <Icon name="card" />
            <span className={styles.rowLabel}>Stripe</span>
            {pill}
            <Icon name="external" className={styles.muted} />
          </a>
        ) : (
          <button type="button" className={styles.row} disabled={state === 'busy'} onClick={connect}>
            <Icon name="card" />
            <span className={styles.rowLabel}>{state === 'busy' ? 'Povezujem…' : 'Poveži Stripe'}</span>
            {pill}
          </button>
        )}
      </SettingsCard>
    );
  }

  return (
    <SettingsCard id="payments-settings" label="Plaćanja" aside={pill}>
      <div className={styles.account}>
        <span className={styles.tile} aria-hidden="true">
          <Icon name="card" />
        </span>
        <div>
          <p className={styles.accountLabel}>Račun</p>
          <p className={styles.accountName}>{stripe.accountName ?? 'Stripe nije povezan'}</p>
        </div>
      </div>
      <p className={styles.text}>
        {stripe.connected
          ? `${listOf(stripe.methods)}.`
          : 'Poveži Stripe da članovi mogu plaćati članarine u aplikaciji.'}
      </p>
      {state === 'failed' && (
        <p className={styles.error} role="alert">
          Povezivanje nije uspjelo. Pokušaj ponovno.
        </p>
      )}
      {stripe.connected ? (
        <a className={styles.manage} href={STRIPE_DASHBOARD} target="_blank" rel="noreferrer">
          <Icon name="external" />
          Upravljaj u Stripeu
        </a>
      ) : (
        <Button block disabled={state === 'busy'} onClick={connect}>
          <Icon name="link" />
          {state === 'busy' ? 'Povezujem…' : 'Poveži Stripe'}
        </Button>
      )}
    </SettingsCard>
  );
}
