import { useId } from 'react';
import { Dialog, type DialogPresentation } from '../../../shared/components/dialog';
import { Highlight, Popup } from '../../../shared/components/popup';
import { openDoor } from '../services/gym-state';

interface OpenDoorDialogProps {
  gym: { id: string; name: string; address: string };
  presentation: DialogPresentation;
  onClose: () => void;
}

export function OpenDoorDialog({ gym, presentation, onClose }: OpenDoorDialogProps) {
  const titleId = useId();

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
