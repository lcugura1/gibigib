import { useId, useState, type SubmitEvent } from 'react';
import type { CatalogDto, TrainerDto, TrainerInput } from '@gibigib/types';
import { Button } from '../../../shared/components/button';
import { Dialog } from '../../../shared/components/dialog';
import { EditorActions, EditorForm, EditorPanel, editorStyles } from '../../../shared/components/editor-panel';
import { Popup } from '../../../shared/components/popup';
import { TagInput } from '../../../shared/components/tag-input';
import { SelectBox, TextArea, TextField } from '../../../shared/components/text-field';
import { useViewport } from '../../../shared/layout/viewport';
import { IMAGE_ACCEPT, ImageFileError, readImage } from '../../../shared/lib/image-file';
import { TrainerPhoto } from './trainer-list';
import styles from './trainer-editor.module.css';

const PHOTO_MIN = 400;
const MAX_SPECIALTIES = 6;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INSTAGRAM = /^@?[a-z0-9._]{1,30}$/i;

interface TrainerForm {
  name: string;
  role: string;
  photoUrl: string | null;
  specialties: string[];
  experienceYears: string;
  instagram: string;
  email: string;
  certifications: string;
  bio: string;
  gymId: string;
}

type Errors = Partial<Record<keyof TrainerForm, string>>;

const toForm = (trainer: TrainerDto | undefined, defaultGym: string): TrainerForm =>
  trainer
    ? { ...trainer, specialties: [...trainer.specialties], experienceYears: String(trainer.experienceYears) }
    : {
        name: '',
        role: '',
        photoUrl: null,
        specialties: [],
        experienceYears: '',
        instagram: '',
        email: '',
        certifications: '',
        bio: '',
        gymId: defaultGym,
      };

function validate(form: TrainerForm): { errors: Errors; input?: TrainerInput } {
  const errors: Errors = {};
  const years = /^\d+$/.test(form.experienceYears.trim()) ? Number(form.experienceYears.trim()) : Number.NaN;
  const instagram = form.instagram.trim();
  const email = form.email.trim();

  if (form.name.trim() === '') errors.name = 'Upiši ime i prezime.';
  if (form.role.trim() === '') errors.role = 'Upiši ulogu, npr. Osobni trener.';
  if (!(years >= 0 && years <= 60)) errors.experienceYears = 'Upiši broj godina od 0 do 60.';
  if (instagram && !INSTAGRAM.test(instagram)) errors.instagram = 'Upiši korisničko ime, npr. @gibigib.';
  if (email && !EMAIL.test(email)) errors.email = 'Upiši ispravnu e-adresu.';
  if (form.gymId === '') errors.gymId = 'Odaberi teretanu.';

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    input: {
      name: form.name.trim(),
      role: form.role.trim(),
      photoUrl: form.photoUrl,
      specialties: form.specialties,
      experienceYears: years,
      instagram: instagram && !instagram.startsWith('@') ? `@${instagram}` : instagram,
      email,
      certifications: form.certifications.trim(),
      bio: form.bio.trim(),
      gymId: form.gymId,
    },
  };
}

interface TrainerEditorProps {
  trainer: TrainerDto | undefined;
  catalog: CatalogDto;
  framed: boolean;
  onSave: (input: TrainerInput) => Promise<void>;
  onRemove: () => Promise<void>;
  onCancel: () => void;
}

export function TrainerEditor({ trainer, catalog, framed, onSave, onRemove, onCancel }: TrainerEditorProps) {
  const phone = useViewport() === 'phone';
  const photoId = useId();
  const confirmId = useId();
  const initial = toForm(trainer, catalog.gyms[0]?.id ?? '');
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [photoError, setPhotoError] = useState<string>();
  const [state, setState] = useState<'idle' | 'busy' | 'saved' | 'failed'>('idle');
  const [confirming, setConfirming] = useState(false);

  const set =
    <K extends keyof TrainerForm>(key: K) =>
    (value: TrainerForm[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
      setState('idle');
    };

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      set('photoUrl')(await readImage(file, PHOTO_MIN, PHOTO_MIN));
      setPhotoError(undefined);
    } catch (reason) {
      setPhotoError(reason instanceof ImageFileError ? reason.message : 'Fotografija se nije učitala.');
    }
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

  return (
    <EditorPanel
      label={trainer ? 'Uredi trenera' : 'Novi trener'}
      framed={framed}
      aside={
        trainer && (
          <button type="button" className={styles.remove} onClick={() => setConfirming(true)}>
            Ukloni
          </button>
        )
      }
    >
      <EditorForm onSubmit={submit}>
        <div className={styles.photoRow}>
          <TrainerPhoto trainer={{ name: form.name || '?', photoUrl: form.photoUrl }} />
          <label htmlFor={photoId} className={styles.photoButton}>
            {form.photoUrl ? 'Promijeni fotografiju' : 'Dodaj fotografiju'}
            <input
              id={photoId}
              className={styles.file}
              type="file"
              accept={IMAGE_ACCEPT}
              onChange={(event) => {
                void pickPhoto(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </label>
        </div>
        {photoError && (
          <p className={editorStyles.error} role="alert">
            {photoError}
          </p>
        )}
        <TextField
          label="Ime i prezime"
          value={form.name}
          maxLength={60}
          autoComplete="off"
          error={errors.name}
          onChange={(e) => set('name')(e.target.value)}
        />
        <TextField
          label="Uloga"
          value={form.role}
          maxLength={60}
          error={errors.role}
          onChange={(e) => set('role')(e.target.value)}
        />
        <SelectBox
          label="Teretana"
          value={form.gymId}
          options={catalog.gyms.map((gym) => ({ value: gym.id, label: gym.name }))}
          error={errors.gymId}
          onChange={set('gymId')}
        />
        <TagInput
          label="Specijalnosti"
          values={form.specialties}
          placeholder="npr. Kondicija"
          max={MAX_SPECIALTIES}
          maxLength={24}
          onChange={set('specialties')}
        />
        <div className={editorStyles.pair}>
          <TextField
            label="Godine iskustva"
            inputMode="numeric"
            value={form.experienceYears}
            error={errors.experienceYears}
            onChange={(e) => set('experienceYears')(e.target.value)}
          />
          <TextField
            label="Instagram"
            placeholder="@korisnik"
            value={form.instagram}
            maxLength={31}
            error={errors.instagram}
            onChange={(e) => set('instagram')(e.target.value)}
          />
        </div>
        <TextField
          label="E-adresa"
          type="email"
          autoComplete="off"
          value={form.email}
          maxLength={120}
          error={errors.email}
          onChange={(e) => set('email')(e.target.value)}
        />
        <TextArea
          className={styles.short}
          label="Certifikati"
          value={form.certifications}
          maxLength={300}
          onChange={(e) => set('certifications')(e.target.value)}
        />
        <TextArea
          label="Biografija"
          value={form.bio}
          maxLength={600}
          hint="Prikazuje se na profilu trenera u aplikaciji."
          onChange={(e) => set('bio')(e.target.value)}
        />
        {state === 'failed' && (
          <p className={editorStyles.error} role="alert">
            Spremanje nije uspjelo. Pokušaj ponovno.
          </p>
        )}
        <EditorActions
          status={state === 'busy' ? 'Spremam…' : state === 'saved' ? 'Promjene su spremljene.' : undefined}
        >
          <Button variant="text" onClick={cancel} disabled={state === 'busy'}>
            Odustani
          </Button>
          <Button type="submit" disabled={state === 'busy'}>
            Spremi
          </Button>
        </EditorActions>
      </EditorForm>

      {confirming && trainer && (
        <Dialog presentation={phone ? 'sheet' : 'popup'} labelledBy={confirmId} onClose={() => setConfirming(false)}>
          <Popup
            titleId={confirmId}
            icon="xCircle"
            tone="danger"
            title={`Ukloniti trenera ${trainer.name}?`}
            description="Profil trenera nestaje iz aplikacije. Članovi ga više neće moći pronaći ni kontaktirati."
            confirm={{
              label: 'Ukloni trenera',
              busyLabel: 'Uklanjam…',
              errorMessage: 'Uklanjanje nije uspjelo. Pokušaj ponovno.',
              tone: 'danger',
              onConfirm: onRemove,
            }}
          />
        </Dialog>
      )}
    </EditorPanel>
  );
}
