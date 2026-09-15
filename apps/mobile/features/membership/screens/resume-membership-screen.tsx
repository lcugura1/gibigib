import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MembershipPopup } from '@/features/membership/components/membership-popup';
import {
  PopupError,
  PopupHeader,
  PopupHighlight,
  PopupHighlightNote,
  PopupIconBadge,
  PopupPrimaryButton,
  PopupRow,
  PopupTextButton,
} from '@/features/membership/components/popup-elements';
import { useMembership } from '@/features/membership/context/membership';
import { formatDayMonth, useMembershipPause } from '@/features/membership/hooks/use-membership-pause';

export function ResumeMembershipScreen() {
  const router = useRouter();
  const { resume } = useMembership();
  const pauseState = useMembershipPause();
  const [snapshot] = useState(() => (pauseState.paused ? pauseState : null));
  const [phase, setPhase] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    if (!snapshot) router.back();
  }, [snapshot, router]);

  if (!snapshot) {
    return null;
  }

  const loading = phase === 'loading';

  return (
    <MembershipPopup locked={loading}>
      {(close) => {
        const confirm = async () => {
          setPhase('loading');
          try {
            await resume();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            close();
          } catch {
            setPhase('error');
          }
        };

        return (
          <>
            <View style={{ gap: 16 }}>
              <PopupIconBadge icon="play-outline" />
              <PopupHeader title="Nastavi članarinu">
                Pauza završava odmah, a dani pauze dodaju se na kraj članarine.
              </PopupHeader>
            </View>

            <View style={{ gap: 20, opacity: loading ? 0.5 : 1 }}>
              {snapshot.endDateIfResumedNow ? (
                <PopupHighlight
                  label="Članarina sada ističe"
                  value={formatDayMonth(snapshot.endDateIfResumedNow)}
                  accessibilityLabel={`Članarina sada ističe ${formatDayMonth(snapshot.endDateIfResumedNow)}`}
                >
                  {snapshot.pausedLabel ? (
                    <PopupHighlightNote icon="pause-circle-outline">
                      {`Pauzirano ${snapshot.pausedLabel}`}
                    </PopupHighlightNote>
                  ) : null}
                </PopupHighlight>
              ) : null}

              <View style={{ gap: 12 }}>
                <PopupRow icon="lock-open-outline">Ulaz u teretanu odmah je ponovno moguć</PopupRow>
                {snapshot.nextPauseAt ? (
                  <PopupRow icon="refresh-outline">
                    {`Sljedeća pauza moguća je od ${formatDayMonth(snapshot.nextPauseAt)}`}
                  </PopupRow>
                ) : null}
              </View>
            </View>

            <View style={{ gap: 12 }}>
              {phase === 'error' ? <PopupError>Nastavak nije uspio. Pokušaj ponovno.</PopupError> : null}
              <View style={{ gap: 4 }}>
                <PopupPrimaryButton
                  label={loading ? 'Nastavljam…' : 'Nastavi'}
                  loading={loading}
                  onPress={confirm}
                />
                <PopupTextButton label="Odustani" disabled={loading} onPress={close} />
              </View>
            </View>
          </>
        );
      }}
    </MembershipPopup>
  );
}
