import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../../../shared/components/card';
import { Icon } from '../../../shared/components/icon';
import { SETTINGS_HREF } from '../../../shared/layout/navigation';
import styles from './stripe-missing.module.css';

interface StripeMissingProps {
  compact: boolean;
  onConnect: () => Promise<void>;
}

export function StripeMissing({ compact, onConnect }: StripeMissingProps) {
  const [state, setState] = useState<'idle' | 'busy' | 'failed'>('idle');

  const connect = async () => {
    setState('busy');
    try {
      await onConnect();
    } catch {
      setState('failed');
    }
  };

  return (
    <Card className={`${styles.card} ${compact ? styles.compact : ''}`} aria-labelledby="stripe-heading">
      <span className={styles.icon}>
        <Icon name="card" />
      </span>
      <h2 id="stripe-heading" className={styles.title}>
        Stripe nije povezan
      </h2>
      <p className={styles.text}>Prihodi će se pojaviti ovdje čim povežeš Stripe račun teretane.</p>
      <div className={styles.actions}>
        <button type="button" className={styles.connect} disabled={state === 'busy'} onClick={connect}>
          {!compact && <Icon name="link" />}
          {state === 'busy' ? 'Povezujem…' : 'Poveži Stripe'}
        </button>
        {!compact && (
          <Link className={styles.settings} to={SETTINGS_HREF}>
            Otvori postavke
          </Link>
        )}
      </div>
      {state === 'failed' && (
        <p className={styles.error} role="alert">
          Povezivanje nije uspjelo. Pokušaj ponovno.
        </p>
      )}
      <p className={styles.note}>
        {compact ? 'Članarine i ulazi rade i bez toga.' : 'Članarine, ulazi i popunjenost rade i bez toga.'}
      </p>
    </Card>
  );
}
