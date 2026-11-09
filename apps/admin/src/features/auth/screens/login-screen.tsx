import { useState, type SubmitEvent } from 'react';
import { firstValueFrom } from 'rxjs';
import { useNavigate, useSearchParams } from 'react-router';
import logo from '../../../assets/logo.jpg';
import { Button } from '../../../shared/components/button';
import { LOGIN_RETURN_PARAM } from '../../../shared/layout/navigation';
import { TextField } from '../../../shared/components/text-field';
import { SignInError, authApi } from '../services/auth-api';
import styles from './login-screen.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeReturn = (target: string | null) => (target?.startsWith('/') && !target.startsWith('//') ? target : '/');

type Mode = 'sign-in' | 'reset' | 'reset-sent';
type Errors = Partial<Record<'email' | 'password' | 'form', string>>;

const SIGN_IN_ERROR = {
  'wrong-password': { password: 'Pogrešna lozinka. Pokušaj ponovno.' },
  'unknown-account': { form: 'Pogrešna e-adresa ili lozinka.' },
} as const;

export function LoginScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const signIn = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Errors = {};
    if (!EMAIL.test(email.trim())) found.email = 'Upiši ispravnu e-adresu.';
    if (!password) found.password = 'Upiši lozinku.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      await firstValueFrom(authApi.signIn(email.trim(), password));
      navigate(safeReturn(params.get(LOGIN_RETURN_PARAM)), { replace: true });
    } catch (reason) {
      setErrors(
        reason instanceof SignInError
          ? SIGN_IN_ERROR[reason.reason]
          : { form: 'Prijava nije uspjela. Pokušaj ponovno.' },
      );
      setBusy(false);
    }
  };

  const requestReset = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setErrors({ email: 'Upiši ispravnu e-adresu.' });
      return;
    }
    setBusy(true);
    try {
      await firstValueFrom(authApi.requestPasswordReset(email.trim()));
      setMode('reset-sent');
    } catch {
      setErrors({ form: 'Slanje nije uspjelo. Pokušaj ponovno.' });
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setPassword('');
  };

  const emailField = (
    <TextField
      label="E-adresa"
      type="email"
      autoComplete="username"
      placeholder="npr. ime@primjer.hr"
      value={email}
      error={errors.email}
      onChange={(e) => {
        setEmail(e.target.value);
        setErrors((current) => ({ ...current, email: undefined, form: undefined }));
      }}
    />
  );

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <img className={styles.logo} src={logo} alt="GibiGib" width={170} height={170} />
        <div className={styles.titles}>
          <h1 className={styles.title}>{mode === 'sign-in' ? 'Prijava za administratore' : 'Zaboravljena lozinka'}</h1>
          <p className={styles.subtitle}>
            {mode === 'sign-in' ? 'Upravljanje teretanama GibiGib' : 'Poslat ćemo ti poveznicu za novu lozinku.'}
          </p>
        </div>

        {mode === 'sign-in' && (
          <form className={styles.form} noValidate onSubmit={signIn}>
            {emailField}
            <TextField
              label="Lozinka"
              type="password"
              autoComplete="current-password"
              value={password}
              error={errors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((current) => ({ ...current, password: undefined, form: undefined }));
              }}
            />
            {errors.form && (
              <p className={styles.error} role="alert">
                {errors.form}
              </p>
            )}
            <Button type="submit" block disabled={busy}>
              {busy ? 'Prijavljujem…' : 'Prijavi se'}
            </Button>
            <button type="button" className={styles.link} onClick={() => switchMode('reset')}>
              Zaboravljena lozinka
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form className={styles.form} noValidate onSubmit={requestReset}>
            {emailField}
            {errors.form && (
              <p className={styles.error} role="alert">
                {errors.form}
              </p>
            )}
            <Button type="submit" block disabled={busy}>
              {busy ? 'Šaljem…' : 'Pošalji poveznicu'}
            </Button>
            <button type="button" className={styles.link} onClick={() => switchMode('sign-in')}>
              Natrag na prijavu
            </button>
          </form>
        )}

        {mode === 'reset-sent' && (
          <div className={styles.form}>
            <p className={styles.notice} role="status">
              Ako postoji račun za {email.trim()}, poslali smo poveznicu za novu lozinku. Provjeri e-poštu.
            </p>
            <Button block onClick={() => switchMode('sign-in')}>
              Natrag na prijavu
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
