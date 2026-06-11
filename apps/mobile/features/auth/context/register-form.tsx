import { createContext, use, useMemo, useState, type ReactNode } from 'react';

type RegisterForm = {
  email: string;
  password: string;
  acceptPolicy: boolean;
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  oib: string;
};

const initialForm: RegisterForm = {
  email: '',
  password: '',
  acceptPolicy: false,
  firstName: '',
  lastName: '',
  birthDate: '',
  address: '',
  oib: '',
};

type RegisterFormContextValue = {
  form: RegisterForm;
  update: (patch: Partial<RegisterForm>) => void;
};

const RegisterFormContext = createContext<RegisterFormContextValue | null>(null);

export function RegisterFormProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const value = useMemo<RegisterFormContextValue>(
    () => ({ form, update: (patch) => setForm((current) => ({ ...current, ...patch })) }),
    [form],
  );
  return <RegisterFormContext value={value}>{children}</RegisterFormContext>;
}

export function useRegisterForm() {
  const context = use(RegisterFormContext);
  if (!context) {
    throw new Error('useRegisterForm must be used inside RegisterFormProvider');
  }
  return context;
}
