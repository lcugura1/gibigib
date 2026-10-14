import { useState, type SubmitEvent } from 'react';
import type { PlanDto, PlanInput } from '@gibigib/types';
import { Button } from '../../../shared/components/button';
import {
  EditorActions,
  EditorForm,
  EditorNote,
  EditorPanel,
  SwitchRow,
  editorStyles,
} from '../../../shared/components/editor-panel';
import { StatusPill } from '../../../shared/components/status-pill';
import { TextArea, TextField } from '../../../shared/components/text-field';
import { Toggle } from '../../../shared/components/toggle';
import { formatAmount, formatInteger, pluralize } from '../../../shared/lib/format';
import { formatPlanPrice } from '../plan-format';

const DESCRIPTION_MAX = 200;
const PAUSE_MAX = 30;
const COOLDOWN_MAX = 365;
const DURATION_MAX = 730;

interface PlanForm {
  name: string;
  price: string;
  durationDays: string;
  pauseMaxDays: string;
  pauseCooldownDays: string;
  description: string;
  visible: boolean;
}

type Errors = Partial<Record<keyof PlanForm, string>>;

const EMPTY_FORM: PlanForm = {
  name: '',
  price: '',
  durationDays: '30',
  pauseMaxDays: '0',
  pauseCooldownDays: '0',
  description: '',
  visible: true,
};

const toForm = (plan: PlanDto): PlanForm => ({
  name: plan.name,
  price: plan.price === null ? '' : formatAmount(plan.price),
  durationDays: plan.durationDays === null ? '' : String(plan.durationDays),
  pauseMaxDays: String(plan.pauseMaxDays),
  pauseCooldownDays: String(plan.pauseCooldownDays),
  description: plan.description,
  visible: plan.visible,
});

const parseAmount = (text: string) => {
  const normalized = text.trim().replace(/\./g, '').replace(',', '.');
  return /^\d+(\.\d{1,2})?$/.test(normalized) ? Number(normalized) : Number.NaN;
};

const parseWhole = (text: string) => (/^\d+$/.test(text.trim()) ? Number(text.trim()) : Number.NaN);

function validate(form: PlanForm): { errors: Errors; input?: PlanInput } {
  const errors: Errors = {};
  const price = form.price.trim() === '' ? null : parseAmount(form.price);
  const durationDays = form.durationDays.trim() === '' ? null : parseWhole(form.durationDays);
  const pauseMaxDays = parseWhole(form.pauseMaxDays);
  const pauseCooldownDays = parseWhole(form.pauseCooldownDays);

  if (form.name.trim() === '') errors.name = 'Upiši naziv plana.';
  if (price !== null && Number.isNaN(price)) errors.price = 'Upiši cijenu, npr. 29,99.';
  if (durationDays !== null && !(durationDays >= 1 && durationDays <= DURATION_MAX))
    errors.durationDays = `Upiši broj dana od 1 do ${DURATION_MAX}.`;
  if (!(pauseMaxDays >= 0 && pauseMaxDays <= PAUSE_MAX)) errors.pauseMaxDays = `Upiši broj dana od 0 do ${PAUSE_MAX}.`;
  if (!(pauseCooldownDays >= 0 && pauseCooldownDays <= COOLDOWN_MAX))
    errors.pauseCooldownDays = `Upiši broj dana od 0 do ${COOLDOWN_MAX}.`;
  if (form.description.length > DESCRIPTION_MAX)
    errors.description = `Opis može imati najviše ${DESCRIPTION_MAX} znakova.`;

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    input: {
      name: form.name.trim(),
      price,
      durationDays,
      pauseMaxDays,
      pauseCooldownDays,
      description: form.description.trim(),
      visible: form.visible,
    },
  };
}

const keepers = (count: number) =>
  `${formatInteger(count)} ${pluralize(count, {
    one: 'aktivan član zadržava',
    few: 'aktivna člana zadržavaju',
    other: 'aktivnih članova zadržava',
  })}`;

function PlanNote({ plan, form }: { plan: PlanDto | undefined; form: PlanForm }) {
  if (!plan) {
    return (
      <EditorNote label="Nakon spremanja">
        {form.visible
          ? 'Plan se odmah pojavljuje u aplikaciji za nove članove.'
          : 'Plan ostaje skriven dok ga ne prikažeš u aplikaciji.'}
      </EditorNote>
    );
  }
  if (plan.price === null || plan.activeMembers === 0) return null;
  return (
    <EditorNote label="Nova cijena vrijedi">
      Od sljedeće obnove. {keepers(plan.activeMembers)} {formatPlanPrice(plan.price)} do kraja trenutne članarine.
    </EditorNote>
  );
}

interface PlanEditorProps {
  plan: PlanDto | undefined;
  framed: boolean;
  onSave: (input: PlanInput) => Promise<void>;
  onCancel: () => void;
}

export function PlanEditor({ plan, framed, onSave, onCancel }: PlanEditorProps) {
  const initial = plan ? toForm(plan) : EMPTY_FORM;
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'busy' | 'saved' | 'failed'>('idle');
  const dirty = (Object.keys(form) as (keyof PlanForm)[]).some((key) => form[key] !== initial[key]);

  const set =
    <K extends keyof PlanForm>(key: K) =>
    (value: PlanForm[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
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

  const cancel = () => {
    setForm(initial);
    setErrors({});
    setState('idle');
    onCancel();
  };

  const status = { idle: undefined, busy: 'Spremam…', saved: 'Promjene su spremljene.', failed: undefined }[state];

  return (
    <EditorPanel
      label={plan ? 'Uredi plan' : 'Novi plan'}
      title={form.name.trim() || plan?.name || 'Bez naziva'}
      framed={framed}
      aside={
        form.visible ? <StatusPill level="ok">Aktivan</StatusPill> : <StatusPill level="muted">Skriven</StatusPill>
      }
    >
      <EditorForm onSubmit={submit}>
        <TextField
          label="Naziv"
          value={form.name}
          maxLength={40}
          error={errors.name}
          onChange={(e) => set('name')(e.target.value)}
        />
        <div className={editorStyles.pair}>
          <TextField
            label="Cijena (€)"
            inputMode="decimal"
            placeholder="Na upit"
            value={form.price}
            error={errors.price}
            onChange={(e) => set('price')(e.target.value)}
          />
          <TextField
            label="Trajanje (dana)"
            inputMode="numeric"
            placeholder="Po dogovoru"
            value={form.durationDays}
            error={errors.durationDays}
            onChange={(e) => set('durationDays')(e.target.value)}
          />
        </div>
        <div className={editorStyles.pair}>
          <TextField
            label="Pauza najviše (dana)"
            inputMode="numeric"
            value={form.pauseMaxDays}
            error={errors.pauseMaxDays}
            onChange={(e) => set('pauseMaxDays')(e.target.value)}
          />
          <TextField
            label="Razmak između pauza (dana)"
            inputMode="numeric"
            value={form.pauseCooldownDays}
            error={errors.pauseCooldownDays}
            onChange={(e) => set('pauseCooldownDays')(e.target.value)}
          />
        </div>
        <TextArea
          label="Opis u aplikaciji"
          value={form.description}
          error={errors.description}
          hint={`${form.description.length} / ${DESCRIPTION_MAX}`}
          onChange={(e) => set('description')(e.target.value)}
        />
        <SwitchRow title="Prikaži u aplikaciji" description="Novi članovi mogu kupiti ovaj plan">
          <Toggle checked={form.visible} label="Prikaži u aplikaciji" onChange={set('visible')} />
        </SwitchRow>
        <PlanNote plan={plan} form={form} />
        {state === 'failed' && (
          <p className={editorStyles.error} role="alert">
            Spremanje nije uspjelo. Pokušaj ponovno.
          </p>
        )}
        <EditorActions status={status}>
          <Button variant="text" onClick={cancel} disabled={state === 'busy'}>
            Odustani
          </Button>
          <Button type="submit" disabled={state === 'busy' || (plan !== undefined && !dirty)}>
            Spremi
          </Button>
        </EditorActions>
      </EditorForm>
    </EditorPanel>
  );
}
