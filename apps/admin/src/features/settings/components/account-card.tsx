import { useState } from 'react';
import type { SettingsDto } from '@gibigib/types';
import { useNavigate } from 'react-router';
import { Icon } from '../../../shared/components/icon';
import { LOGIN_HREF } from '../../../shared/layout/navigation';
import { useViewport } from '../../../shared/layout/viewport';
import { setSignedIn } from '../../../shared/mock/session';
import { InlineSaveField } from './inline-save-field';
import { PasswordDialog } from './password-dialog';
import { SettingsCard } from './settings-card';
import styles from './account-card.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AccountCardProps {
  account: SettingsDto['account'];
  onSaveEmail: (email: string) => Promise<void>;
}

export function AccountCard({ account, onSaveEmail }: AccountCardProps) {
  const phone = useViewport() === 'phone';
  const navigate = useNavigate();
  const [changing, setChanging] = useState(false);

  const signOut = () => {
    setSignedIn(false);
    navigate(LOGIN_HREF, { replace: true });
  };

  const passwordRow = (
    <button type="button" className={styles.row} aria-haspopup="dialog" onClick={() => setChanging(true)}>
      <Icon name="lock" />
      <span className={styles.rowLabel}>Promijeni lozinku</span>
      <Icon name="chevron" className={styles.muted} />
    </button>
  );

  const signOutRow = (
    <button type="button" className={`${styles.row} ${styles.danger}`} onClick={signOut}>
      <Icon name="logout" />
      <span className={styles.rowLabel}>Odjava</span>
    </button>
  );

  const dialog = changing && (
    <PasswordDialog presentation={phone ? 'sheet' : 'popup'} onClose={() => setChanging(false)} />
  );

  if (phone) {
    return (
      <>
        <SettingsCard id="account-settings" label="Tvoj račun" flush>
          <div className={styles.row}>
            <Icon name="mail" />
            <span className={styles.rowLabel}>E-adresa</span>
            <span className={styles.value}>{account.email}</span>
          </div>
          {passwordRow}
        </SettingsCard>
        <div className={styles.signOutCard}>{signOutRow}</div>
        {dialog}
      </>
    );
  }

  return (
    <SettingsCard id="account-settings" label="Tvoj račun">
      <div className={styles.owner}>
        <span className={styles.avatar} aria-hidden="true">
          <Icon name="person" />
        </span>
        <div>
          <p className={styles.name}>{account.name}</p>
          <p className={styles.scope}>Pristup svim teretanama</p>
        </div>
      </div>
      <InlineSaveField
        key={account.email}
        label="E-adresa"
        type="email"
        autoComplete="email"
        initial={account.email}
        validate={(value) => (EMAIL.test(value) ? undefined : 'Upiši ispravnu e-adresu.')}
        onSave={onSaveEmail}
      />
      <div className={styles.buttons}>
        <div className={styles.outlined}>{passwordRow}</div>
        <div className={styles.outlined}>{signOutRow}</div>
      </div>
      {dialog}
    </SettingsCard>
  );
}
