import { useState, type SubmitEvent } from 'react';
import type { GymSettingsInput, SettingsDto } from '@gibigib/types';
import { Button } from '../../../shared/components/button';
import { EditorActions, editorStyles } from '../../../shared/components/editor-panel';
import { SegmentedControl } from '../../../shared/components/segmented-control';
import { SelectField } from '../../../shared/components/select-field';
import { TextField } from '../../../shared/components/text-field';
import { gymColor } from '../../../shared/domain/palette';
import { useViewport } from '../../../shared/layout/viewport';
import { SettingsCard } from './settings-card';
import styles from './gym-settings-card.module.css';

type GymSettings = SettingsDto['gyms'][number];

interface GymForm {
  name: string;
  address: string;
  capacity: string;
  weekdaysFrom: string;
  weekdaysTo: string;
  weekendFrom: string;
  weekendTo: string;
}

type Errors = Partial<Record<keyof GymForm | 'weekdays' | 'weekend', string>>;

const toTime = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

const toForm = (gym: GymSettings): GymForm => ({
  name: gym.name,
  address: gym.address,
  capacity: String(gym.capacity),
  weekdaysFrom: toTime(gym.openingHours.weekdays.from),
  weekdaysTo: toTime(gym.openingHours.weekdays.to),
  weekendFrom: toTime(gym.openingHours.weekend.from),
  weekendTo: toTime(gym.openingHours.weekend.to),
});

const parseHour = (time: string) => {
  const match = /^(\d{2}):00$/.exec(time);
  return match ? Number(match[1]) : Number.NaN;
};

function validate(form: GymForm): { errors: Errors; input?: GymSettingsInput } {
  const errors: Errors = {};
  const capacity = /^\d+$/.test(form.capacity.trim()) ? Number(form.capacity.trim()) : Number.NaN;
  const hours = {
    weekdays: { from: parseHour(form.weekdaysFrom), to: parseHour(form.weekdaysTo) },
    weekend: { from: parseHour(form.weekendFrom), to: parseHour(form.weekendTo) },
  };

  if (form.name.trim() === '') errors.name = 'Upiši naziv teretane.';
  if (!(capacity >= 1 && capacity <= 2000)) errors.capacity = 'Upiši broj osoba od 1 do 2000.';
  if (!/^.+,\s*\d{5}\s+\S.*$/.test(form.address.trim()))
    errors.address = 'Upiši adresu, npr. Lazinska ulica 40, 10000 Zagreb.';
  for (const key of ['weekdays', 'weekend'] as const) {
    const { from, to } = hours[key];
    if (Number.isNaN(from) || Number.isNaN(to)) errors[key] = 'Upiši pune sate, npr. 06:00.';
    else if (from >= to) errors[key] = 'Zatvaranje mora biti nakon otvaranja.';
  }

  if (Object.keys(errors).length > 0) return { errors };
  return { errors, input: { name: form.name.trim(), address: form.address.trim(), capacity, openingHours: hours } };
}

interface GymSettingsCardProps {
  gyms: readonly GymSettings[];
  selected: GymSettings;
  onSelect: (id: string) => void;
  onSave: (id: string, input: GymSettingsInput) => Promise<void>;
}

export function GymSettingsCard({ gyms, selected, onSelect, onSave }: GymSettingsCardProps) {
  const phone = useViewport() === 'phone';
  const gymIds = gyms.map((gym) => gym.id);

  const switcher = phone ? (
    <SelectField
      label="Uređuješ"
      value={selected.id}
      options={gyms.map((gym) => ({ value: gym.id, label: gym.name }))}
      onChange={onSelect}
      dotColor={gymColor(gymIds, selected.id)}
    />
  ) : (
    <SegmentedControl
      label="Teretana"
      options={gyms.map((gym) => ({ value: gym.id, label: gym.name }))}
      value={selected.id}
      onChange={onSelect}
      size="small"
    />
  );

  return (
    <SettingsCard id="gym-settings" label="Teretana" aside={!phone && switcher}>
      {phone && switcher}
      <GymForm key={selected.id} gym={selected} phone={phone} onSave={(input) => onSave(selected.id, input)} />
    </SettingsCard>
  );
}

function GymForm({
  gym,
  phone,
  onSave,
}: {
  gym: GymSettings;
  phone: boolean;
  onSave: (input: GymSettingsInput) => Promise<void>;
}) {
  const initial = toForm(gym);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'busy' | 'saved' | 'failed'>('idle');
  const dirty = (Object.keys(form) as (keyof GymForm)[]).some((key) => form[key] !== initial[key]);

  const set = (key: keyof GymForm, group?: 'weekdays' | 'weekend') => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, ...(group ? { [group]: undefined } : {}) }));
    setState('idle');
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validate(form);
    setErrors(result.errors);
    if (!result.input) return;
    setState('busy');
    try {
      await onSave(result.input);
      setState('saved');
    } catch {
      setState('failed');
    }
  };

  const hoursRow = (label: string, group: 'weekdays' | 'weekend', from: keyof GymForm, to: keyof GymForm) => (
    <div className={styles.hoursRow} role="group" aria-label={`Radno vrijeme ${label}`}>
      <span className={styles.day}>{label}</span>
      <input
        type="time"
        step={3600}
        aria-label={`${label} otvaranje`}
        aria-invalid={errors[group] ? true : undefined}
        value={form[from]}
        onChange={(e) => set(from, group)(e.target.value)}
      />
      <input
        type="time"
        step={3600}
        aria-label={`${label} zatvaranje`}
        aria-invalid={errors[group] ? true : undefined}
        value={form[to]}
        onChange={(e) => set(to, group)(e.target.value)}
      />
      {errors[group] && <p className={styles.error}>{errors[group]}</p>}
    </div>
  );

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={phone ? styles.stack : editorStyles.pair}>
        <TextField
          label="Naziv"
          value={form.name}
          maxLength={40}
          error={errors.name}
          onChange={(e) => set('name')(e.target.value)}
        />
        <TextField
          label="Kapacitet (osoba)"
          inputMode="numeric"
          value={form.capacity}
          error={errors.capacity}
          hint={phone ? undefined : 'Najviše ljudi odjednom, za popunjenost'}
          onChange={(e) => set('capacity')(e.target.value)}
        />
      </div>
      <TextField
        label="Adresa"
        value={form.address}
        maxLength={120}
        error={errors.address}
        onChange={(e) => set('address')(e.target.value)}
      />
      <fieldset className={styles.hours}>
        <legend>Radno vrijeme</legend>
        {hoursRow('Pon – Pet', 'weekdays', 'weekdaysFrom', 'weekdaysTo')}
        {hoursRow('Sub – Ned', 'weekend', 'weekendFrom', 'weekendTo')}
      </fieldset>
      {state === 'failed' && (
        <p className={editorStyles.error} role="alert">
          Spremanje nije uspjelo. Pokušaj ponovno.
        </p>
      )}
      <EditorActions status={state === 'busy' ? 'Spremam…' : state === 'saved' ? 'Promjene su spremljene.' : undefined}>
        {!phone && (
          <Button
            variant="text"
            disabled={!dirty || state === 'busy'}
            onClick={() => {
              setForm(initial);
              setErrors({});
            }}
          >
            Odustani
          </Button>
        )}
        <Button type="submit" block={phone} disabled={!dirty || state === 'busy'}>
          Spremi
        </Button>
      </EditorActions>
    </form>
  );
}
