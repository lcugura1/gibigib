import { useId, useState } from 'react';
import type { EventDto, EventInput, EventStatus } from '@gibigib/types';
import { Button } from '../../../shared/components/button';
import { Dialog } from '../../../shared/components/dialog';
import { EditorActions, EditorForm, EditorPanel, editorStyles } from '../../../shared/components/editor-panel';
import { ImageDrop } from '../../../shared/components/image-drop';
import { Popup } from '../../../shared/components/popup';
import { TextArea, TextField } from '../../../shared/components/text-field';
import { useViewport } from '../../../shared/layout/viewport';
import { EventStatusPill } from './event-list';
import styles from './event-editor.module.css';

const TEXT_MAX = 1000;
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 675;

type Errors = Partial<Record<'title' | 'date' | 'text', string>>;

function validate(form: EventInput): Errors {
  const errors: Errors = {};
  if (form.title.trim() === '') errors.title = 'Upiši naslov objave.';
  if (form.date === '') errors.date = 'Odaberi datum.';
  if (form.text.length > TEXT_MAX) errors.text = `Tekst može imati najviše ${TEXT_MAX} znakova.`;
  return errors;
}

const EMPTY: EventInput = { title: '', date: '', imageUrl: null, text: '' };

interface EventEditorProps {
  event: EventDto | undefined;
  framed: boolean;
  onSave: (input: EventInput, status: EventStatus) => Promise<void>;
  onRemove: () => Promise<void>;
  onCancel: () => void;
}

const SAVED: Record<EventStatus, string> = {
  PUBLISHED: 'Objava je vidljiva u aplikaciji.',
  DRAFT: 'Skica je spremljena.',
};

export function EventEditor({ event, framed, onSave, onRemove, onCancel }: EventEditorProps) {
  const phone = useViewport() === 'phone';
  const confirmId = useId();
  const initial: EventInput = event
    ? { title: event.title, date: event.date, imageUrl: event.imageUrl, text: event.text }
    : EMPTY;
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<EventStatus | null>(null);
  const [result, setResult] = useState<{ ok: true; status: EventStatus } | { ok: false } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const published = event?.status === 'PUBLISHED';
  const dirty = (Object.keys(form) as (keyof EventInput)[]).some((key) => form[key] !== initial[key]);

  const set =
    <K extends keyof EventInput>(key: K) =>
    (value: EventInput[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
      setResult(null);
    };

  const save = async (status: EventStatus) => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(status);
    try {
      await onSave({ ...form, title: form.title.trim(), text: form.text.trim() }, status);
      setResult({ ok: true, status });
    } catch {
      setResult({ ok: false });
    } finally {
      setBusy(null);
    }
  };

  const cancel = () => {
    setForm(initial);
    setErrors({});
    setResult(null);
    onCancel();
  };

  return (
    <EditorPanel
      label={event ? 'Uredi objavu' : 'Nova objava'}
      framed={framed}
      aside={<EventStatusPill status={event?.status ?? 'DRAFT'} />}
    >
      <EditorForm
        onSubmit={(e) => {
          e.preventDefault();
          void save('PUBLISHED');
        }}
      >
        <TextField
          label="Naslov"
          value={form.title}
          maxLength={80}
          error={errors.title}
          onChange={(e) => set('title')(e.target.value)}
        />
        <TextField
          className={styles.date}
          label="Datum"
          type="date"
          value={form.date}
          error={errors.date}
          onChange={(e) => set('date')(e.target.value)}
        />
        <ImageDrop
          label="Slika"
          value={form.imageUrl}
          minWidth={IMAGE_WIDTH}
          minHeight={IMAGE_HEIGHT}
          onChange={set('imageUrl')}
        />
        <TextArea
          label="Tekst"
          value={form.text}
          error={errors.text}
          hint="Prikazuje se u aplikaciji ispod slike."
          onChange={(e) => set('text')(e.target.value)}
        />
        {result && !result.ok && (
          <p className={editorStyles.error} role="alert">
            Spremanje nije uspjelo. Pokušaj ponovno.
          </p>
        )}
        <EditorActions status={busy ? 'Spremam…' : result?.ok ? SAVED[result.status] : undefined}>
          {event && (
            <Button variant="danger" className={styles.remove} onClick={() => setConfirming(true)}>
              Obriši
            </Button>
          )}
          {!event && (
            <Button variant="text" onClick={cancel}>
              Odustani
            </Button>
          )}
          <Button variant="outline" disabled={busy !== null} onClick={() => void save('DRAFT')}>
            {published ? 'Vrati u skice' : 'Spremi skicu'}
          </Button>
          <Button type="submit" disabled={busy !== null || (published && !dirty)}>
            {published ? 'Spremi' : 'Objavi'}
          </Button>
        </EditorActions>
      </EditorForm>

      {confirming && event && (
        <Dialog presentation={phone ? 'sheet' : 'popup'} labelledBy={confirmId} onClose={() => setConfirming(false)}>
          <Popup
            titleId={confirmId}
            icon="xCircle"
            tone="danger"
            title="Obrisati objavu?"
            description={
              published
                ? `„${event.title}” nestaje iz aplikacije za sve članove. Ovo se ne može poništiti.`
                : `Skica „${event.title}” se briše. Ovo se ne može poništiti.`
            }
            confirm={{
              label: 'Obriši objavu',
              busyLabel: 'Brišem…',
              errorMessage: 'Brisanje nije uspjelo. Pokušaj ponovno.',
              tone: 'danger',
              onConfirm: onRemove,
            }}
          />
        </Dialog>
      )}
    </EditorPanel>
  );
}
