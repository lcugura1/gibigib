import { useId } from 'react';
import type { GymDetailDto } from '@gibigib/types';
import { Dialog, type DialogPresentation } from '../../../shared/components/dialog';
import { Highlight, Popup } from '../../../shared/components/popup';
import { openDoor } from '../services/gym-state';

interface OpenDoorDialogProps {
  detail: GymDetailDto;
  presentation: DialogPresentation;
  onClose: () => void;
}

export function OpenDoorDialog({ detail, presentation, onClose }: OpenDoorDialogProps) {
  const titleId = useId();
  const { gym } = detail;

  return (
    <Dialog presentation={presentation} labelledBy={titleId} onClose={onClose}>
      <Popup
        titleId={titleId}
        icon="unlock"
        tone="accent"
        title={`Otvoriti vrata u ${gym.name}?`}
        description="Vrata se otključavaju na 5 sekundi. Otvaranje se bilježi u dnevnik promjena kao ručno."
        confirm={{
          label: 'Otvori vrata',
          busyLabel: 'Otvaram…',
          errorMessage: 'Vrata se nisu otvorila. Pokušaj ponovno.',
          tone: 'accent',
          onConfirm: () => openDoor(gym.id),
        }}
      >
        <Highlight label="Vrata" value="Glavni ulaz" note={`${gym.address} · kontroler online`} />
      </Popup>
    </Dialog>
  );
}
