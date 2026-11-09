import { useId, useState, type DragEvent } from 'react';
import { IMAGE_ACCEPT, ImageFileError, readImage } from '../lib/image-file';
import { Icon } from './icon';
import styles from './image-drop.module.css';

interface ImageDropProps {
  label: string;
  value: string | null;
  minWidth: number;
  minHeight: number;
  onChange: (url: string | null) => void;
}

export function ImageDrop({ label, value, minWidth, minHeight, onChange }: ImageDropProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string>();

  const accept = async (file: File | undefined) => {
    if (!file) return;
    try {
      onChange(await readImage(file, minWidth, minHeight));
      setError(undefined);
    } catch (reason) {
      setError(reason instanceof ImageFileError ? reason.message : 'Slika se nije učitala. Pokušaj ponovno.');
    }
  };

  const drop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    void accept(event.dataTransfer.files[0]);
  };

  return (
    <div className={styles.field}>
      <span className={styles.label} id={`${id}-label`}>
        {label}
      </span>
      <label
        htmlFor={id}
        className={[
          styles.drop,
          dragging ? styles.dragging : '',
          value ? styles.filled : '',
          error ? styles.invalid : '',
        ].join(' ')}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        {value ? (
          <img src={value} alt="" className={styles.preview} />
        ) : (
          <>
            <Icon name="image" />
            <span className={styles.prompt}>Povuci sliku ili odaberi datoteku</span>
            <span className={styles.rules}>
              JPG ili PNG, najmanje {minWidth} × {minHeight}
            </span>
          </>
        )}
        <input
          id={id}
          className={styles.input}
          type="file"
          accept={IMAGE_ACCEPT}
          aria-labelledby={`${id}-label`}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => {
            void accept(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </label>
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {value && (
        <div className={styles.actions}>
          <label htmlFor={id} className={styles.action}>
            Zamijeni sliku
          </label>
          <button type="button" className={styles.action} onClick={() => onChange(null)}>
            Ukloni sliku
          </button>
        </div>
      )}
    </div>
  );
}
