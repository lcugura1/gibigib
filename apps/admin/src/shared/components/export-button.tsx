import { useState } from 'react';
import { downloadCsv } from '../lib/download';
import glassStyles from './glass.module.css';
import { Icon } from './icon';
import styles from './export-button.module.css';

type ExportState = 'idle' | 'busy' | 'failed';

const LABEL: Record<ExportState, string> = {
  idle: 'Izvezi CSV',
  busy: 'Izvozim…',
  failed: 'Izvoz nije uspio',
};

interface ExportButtonProps {
  variant: 'button' | 'glass';
  fileName: string;
  onExport: () => Promise<string>;
}

export function ExportButton({ variant, fileName, onExport }: ExportButtonProps) {
  const [state, setState] = useState<ExportState>('idle');

  const run = async () => {
    setState('busy');
    try {
      downloadCsv(fileName, await onExport());
      setState('idle');
    } catch {
      setState('failed');
    }
  };

  if (variant === 'glass') {
    return (
      <button
        type="button"
        className={glassStyles.glass}
        aria-label={LABEL[state]}
        disabled={state === 'busy'}
        onClick={run}
      >
        <Icon name="download" />
      </button>
    );
  }

  return (
    <button type="button" className={styles.button} disabled={state === 'busy'} onClick={run}>
      <Icon name="download" />
      {LABEL[state]}
    </button>
  );
}
