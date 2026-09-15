import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MEMBERSHIP_PAUSE_COOLDOWN_DAYS, MEMBERSHIP_PAUSE_MAX_DAYS } from '@gibigib/types';
import { MembershipPopup } from '@/features/membership/components/membership-popup';
import {
  PopupError,
  PopupHeader,
  PopupHighlight,
  PopupIconBadge,
  PopupPrimaryButton,
  PopupRow,
  PopupTextButton,
  PopupWeekBar,
} from '@/features/membership/components/popup-elements';
import { useMembership } from '@/features/membership/context/membership';
import {
  formatDayMonth,
  formatDayMonthTime,
  formatTime,
  useMembershipPause,
} from '@/features/membership/hooks/use-membership-pause';

export function PauseMembershipScreen() {
  const router = useRouter();
  const { pause } = useMembership();
  const pauseState = useMembershipPause();
  const [snapshot] = useState(() => (pauseState.pausable && !pauseState.paused ? pauseState : null));
  const [phase, setPhase] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    if (!snapshot) router.back();
  }, [snapshot, router]);

  if (!snapshot) {
    return null;
  }

  if (!snapshot.canPause) {
    return (
      <MembershipPopup>
        {(close) => (
          <>
            <View style={{ gap: 16 }}>
              <PopupIconBadge icon="hourglass-outline" tone="muted" />
              <PopupHeader title="Pauza trenutno nije dostupna">
                {snapshot.lastPauseStartedAt
                  ? `Zadnja pauza počela je ${formatDayMonth(snapshot.lastPauseStartedAt)}.`
                  : null}
              </PopupHeader>
            </View>

            {snapshot.nextPauseAt ? (
              <PopupHighlight
                label="Sljedeća pauza od"
                value={formatDayMonth(snapshot.nextPauseAt)}
                accessibilityLabel={`Članarinu možeš ponovno pauzirati od ${formatDayMonth(snapshot.nextPauseAt)}`}
              />
            ) : null}

            <PopupPrimaryButton label="U redu" onPress={close} />
          </>
        )}
      </MembershipPopup>
    );
  }

  const loading = phase === 'loading';
  const pauseEndsAt = snapshot.pauseEndsIfPausedNow;

  return (
    <MembershipPopup locked={loading}>
      {(close) => {
        const confirm = async () => {
          setPhase('loading');
          try {
            await pause();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            close();
          } catch {
            setPhase('error');
          }
        };

        return (
          <>
            <View style={{ gap: 16 }}>
              <PopupIconBadge icon="pause-outline" />
              <PopupHeader title="Pauziraj članarinu">Dani pauze dodaju se na kraj članarine.</PopupHeader>
            </View>

            <View style={{ gap: 20, opacity: loading ? 0.5 : 1 }}>
              <PopupHighlight
                label="Pauza traje do"
                value={formatDayMonth(pauseEndsAt)}
                chip={formatTime(pauseEndsAt)}
                accessibilityLabel={`Pauza traje do ${formatDayMonthTime(pauseEndsAt)}`}
              >
                <PopupWeekBar
                  caption={`${MEMBERSHIP_PAUSE_MAX_DAYS} dana, zatim se članarina sama nastavlja`}
                />
              </PopupHighlight>

              <View style={{ gap: 12 }}>
                <PopupRow icon="lock-closed-outline">Ulaz u teretanu nije moguć dok traje pauza</PopupRow>
                <PopupRow icon="play-circle-outline">Možeš je nastaviti ranije u bilo kojem trenutku</PopupRow>
                <PopupRow icon="calendar-outline">
                  {`Sljedeća pauza moguća je ${MEMBERSHIP_PAUSE_COOLDOWN_DAYS} dana nakon početka ove`}
                </PopupRow>
              </View>
            </View>

            <View style={{ gap: 12 }}>
              {phase === 'error' ? <PopupError>Pauziranje nije uspjelo. Pokušaj ponovno.</PopupError> : null}
              <View style={{ gap: 4 }}>
                <PopupPrimaryButton
                  label={loading ? 'Pauziram…' : 'Pauziraj'}
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
