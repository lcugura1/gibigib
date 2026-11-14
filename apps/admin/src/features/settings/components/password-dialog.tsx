import { useId, useState, type SubmitEvent } from 'react';
import { Button } from '../../../shared/components/button';
import { Dialog, dismissDialog, type DialogPresentation } from '../../../shared/components/dialog';
import { TextField } from '../../../shared/components/text-field';
import { closeDialog } from '../../../shared/lib/top-layer';
import { WrongPasswordError } from '../services/settings-api';
import { changePassword } from '../services/settings-state';
import styles from './password-dialog.module.css';

const MIN_LENGTH = 8;

type Errors = Partial<Record<'current' | 'next' | 'repeat' | 'form', string>>;

interface PasswordDialogProps {
  presentation: DialogPresentation;
  onClose: () => void;
}

export function PasswordDialog({ presentation, onClose }: PasswordDialogProps) {
  const titleId = useId();
  const [form, setForm] = useState({ current: '', next: '', repeat: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dialog = event.currentTarget.closest('dialog');
    const found: Errors = {};
    if (!form.current) found.current = 'Upiši trenutnu lozinku.';
    if (form.next.length < MIN_LENGTH) found.next = `Nova lozinka mora imati barem ${MIN_LENGTH} znakova.`;
    else if (form.next === form.current) found.next = 'Nova lozinka mora biti drukčija od trenutne.';
    if (form.repeat !== form.next) found.repeat = 'Lozinke se ne podudaraju.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      await changePassword({ current: form.current, next: form.next });
      if (dialog) closeDialog(dialog);
    } catch (reason) {
      setErrors(
        reason instanceof WrongPasswordError
          ? { current: 'Trenutna lozinka nije točna.' }
          : { form: 'Lozinka nije promijenjena. Pokušaj ponovno.' },
      );
      setBusy(false);
    }
  };

  return (
    <Dialog presentation={presentation} labelledBy={titleId} onClose={onClose}>
      <form className={styles.form} noValidate onSubmit={submit}>
        <div>
          <h2 id={titleId} className={styles.title}>
            Promijeni lozinku
          </h2>
          <p className={styles.text}>Nakon promjene prijavljuješ se novom lozinkom na svim uređajima.</p>
        </div>
        <TextField
          label="Trenutna lozinka"
          type="password"
          autoComplete="current-password"
          value={form.current}
          error={errors.current}
          onChange={(e) => set('current')(e.target.value)}
        />
        <TextField
          label="Nova lozinka"
          type="password"
          autoComplete="new-password"
          value={form.next}
          error={errors.next}
          hint={`Najmanje ${MIN_LENGTH} znakova.`}
          onChange={(e) => set('next')(e.target.value)}
        />
        <TextField
          label="Ponovi novu lozinku"
          type="password"
          autoComplete="new-password"
          value={form.repeat}
          error={errors.repeat}
          onChange={(e) => set('repeat')(e.target.value)}
        />
        {errors.form && (
          <p className={styles.error} role="alert">
            {errors.form}
          </p>
        )}
        <div className={styles.actions}>
          <Button type="submit" block disabled={busy}>
            {busy ? 'Spremam…' : 'Promijeni lozinku'}
          </Button>
          <Button variant="text" block onClick={dismissDialog}>
            Odustani
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
