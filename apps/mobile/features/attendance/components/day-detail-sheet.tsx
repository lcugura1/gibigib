import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SectionLabel } from '@/shared/components/section-label';
import { colors } from '@/shared/theme/colors';
import { useAttendance } from '@/features/attendance/context/attendance';
import { formatVisitDate } from '@/features/attendance/data/visits';

export function DayDetailSheet() {
  const { selectedDate, clearSelection } = useAttendance();

  return (
    <Modal
      visible={selectedDate !== null}
      transparent
      animationType="fade"
      onRequestClose={clearSelection}
    >
      {selectedDate ? <DayDetailContent key={selectedDate} date={selectedDate} /> : null}
    </Modal>
  );
}

function DayDetailContent({ date }: { date: string }) {
  const { visits, colorOptions, tagVisit, clearSelection } = useAttendance();
  const visit = visits.find((item) => item.date === date);

  const [color, setColor] = useState(visit?.color ?? colorOptions[0]);
  const [label, setLabel] = useState(visit?.label ?? '');

  const save = () => {
    tagVisit(date, color, label);
    clearSelection();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Pressable
        onPress={clearSelection}
        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', padding: 24 }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: colors.surfaceBorder,
            padding: 24,
            gap: 20,
          }}
        >
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '700' }}>
              {formatVisitDate(date)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Dolazak u {visit?.time}</Text>
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <SectionLabel>Boja</SectionLabel>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {colorOptions.map((option) => {
                const active = option === color;
                return (
                  <Pressable key={option} onPress={() => setColor(option)} hitSlop={6}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: option,
                        borderWidth: active ? 3 : 0,
                        borderColor: colors.textPrimary,
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <SectionLabel>Oznaka</SectionLabel>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="npr. Push, Noge, Kardio…"
              placeholderTextColor={colors.textSecondary}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={save}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
                borderRadius: 14,
                borderCurve: 'continuous',
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: colors.textPrimary,
                fontSize: 16,
              }}
            />
          </View>

          <Pressable onPress={save}>
            <LinearGradient
              colors={[colors.buttonPrimaryFrom, colors.buttonPrimaryTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 50,
                borderRadius: 14,
                borderCurve: 'continuous',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.buttonPrimaryText, fontSize: 16, fontWeight: '700' }}>Spremi</Text>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
