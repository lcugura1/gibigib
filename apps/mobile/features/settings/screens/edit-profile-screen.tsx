import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { useAuth } from '@/features/auth/context/auth';
import { ApiError } from '@/features/auth/services/auth';
import { removeAvatar, updateAvatar } from '@/features/settings/services/profile';
import { SubScreen } from '@/features/settings/components/sub-screen';
import { colors } from '@/shared/theme/colors';

const SIZE = 120;

export function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.35,
      base64: true,
    });

    const asset = result.assets?.[0];
    if (result.canceled || !asset?.base64) return;

    const dataUri = `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`;
    setBusy(true);
    try {
      updateUser(await updateAvatar(dataUri));
    } catch (error) {
      Alert.alert('Greška', error instanceof ApiError ? error.message : 'Slika nije spremljena');
    } finally {
      setBusy(false);
    }
  };

  const clearImage = async () => {
    setBusy(true);
    try {
      updateUser(await removeAvatar());
    } catch (error) {
      Alert.alert('Greška', error instanceof ApiError ? error.message : 'Slika nije uklonjena');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SubScreen title="Uredi profil">
      <View style={{ alignItems: 'center', gap: 14, marginTop: 4 }}>
        <Pressable onPress={pickImage} disabled={busy} style={{ width: SIZE, height: SIZE }}>
          {user.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={{
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={52} color={colors.textSecondary} />
            </View>
          )}

          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: colors.background,
            }}
          >
            <Ionicons name="camera" size={18} color={colors.textOnLight} />
          </View>

          {busy ? (
            <View
              style={{
                position: 'absolute',
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.45)',
              }}
            >
              <ActivityIndicator color={colors.textPrimary} />
            </View>
          ) : null}
        </Pressable>

        <Pressable onPress={pickImage} disabled={busy} hitSlop={8}>
          <Text style={{ color: colors.accent, fontSize: 15, fontWeight: '700' }}>
            {user.avatarUrl ? 'Promijeni fotografiju' : 'Dodaj fotografiju'}
          </Text>
        </Pressable>

        {user.avatarUrl ? (
          <Pressable onPress={clearImage} disabled={busy} hitSlop={8}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Ukloni fotografiju</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={{ gap: 16 }}>
        <ReadonlyField label="Ime i prezime" value={`${user.firstName} ${user.lastName}`} />
        <ReadonlyField label="E-adresa" value={user.email} />
      </View>
    </SubScreen>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{label}</Text>
      <View
        style={{
          height: 56,
          borderRadius: 12,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.surfaceBorder,
          backgroundColor: colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 16 }}>{value}</Text>
        <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
      </View>
    </View>
  );
}
