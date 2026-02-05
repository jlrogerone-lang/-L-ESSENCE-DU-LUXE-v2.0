// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Réglages (Settings Screen)
// Expo Router v4 - User settings, subscription, and account management
// ============================================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

import { useAuth } from '@hooks/useAuth';
import { useMonetization } from '@hooks/useMonetization';
import { SUBSCRIPTION_PLANS } from '@utils/constants';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
};

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  danger,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-4 px-4"
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          danger ? 'bg-error/20' : 'bg-dark-gray'
        }`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? '#E74C3C' : '#D4AF37'}
        />
      </View>
      <View className="flex-1 ml-3">
        <Text className={`font-medium ${danger ? 'text-error' : 'text-white'}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-text-muted text-sm">{subtitle}</Text>
        )}
      </View>
      {rightElement || (onPress && (
        <Ionicons name="chevron-forward" size={20} color="#808080" />
      ))}
    </TouchableOpacity>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="text-text-secondary text-sm px-4 mb-2 tracking-wide">
        {title}
      </Text>
      <View className="bg-dark-charcoal rounded-xl mx-4 border border-dark-border">
        {children}
      </View>
    </View>
  );
}

export default function ReglagesScreen() {
  const { user, signOut, deleteAccount } = useAuth();
  const {
    currentPlan,
    isSubscribed,
    purchasePlan,
    restorePurchases,
    loading: monetizationLoading,
  } = useMonetization();

  const [notifications, setNotifications] = React.useState(true);
  const [haptics, setHaptics] = React.useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es irreversible. Se eliminarán todos tus datos, incluyendo tu colección y historial.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirmar eliminación',
              'Escribe "ELIMINAR" para confirmar',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Confirmar',
                  style: 'destructive',
                  onPress: (text) => {
                    if (text === 'ELIMINAR') {
                      deleteAccount();
                    } else {
                      Alert.alert('Texto incorrecto', 'La cuenta no fue eliminada');
                    }
                  },
                },
              ],
              'plain-text'
            );
          },
        },
      ]
    );
  };

  const handleUpgrade = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (plan) {
      Alert.alert(
        `Upgrade a ${plan.name}`,
        `${plan.description}\n\nPrecio: ${plan.price}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Suscribirse',
            onPress: () => purchasePlan(planId),
          },
        ]
      );
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('Completado', 'Tus compras han sido restauradas');
    } catch {
      Alert.alert('Error', 'No se pudieron restaurar las compras');
    }
  };

  const getPlanBadgeColor = () => {
    switch (currentPlan) {
      case 'lifetime':
        return 'bg-luxe-gold';
      case 'master':
        return 'bg-accent-purple';
      case 'alquimist':
        return 'bg-accent-blue';
      default:
        return 'bg-dark-gray';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-oled-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-luxe-gold text-3xl font-bold tracking-wider">
            Réglages
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            Configuración y cuenta
          </Text>
        </View>

        {/* User Card */}
        <View className="mx-4 mb-6">
          <LinearGradient
            colors={['#1A1A1A', '#0D0D0D']}
            className="rounded-2xl p-5 border border-luxe-gold/20"
          >
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-luxe-gold/20 rounded-full items-center justify-center">
                <Text className="text-luxe-gold text-2xl font-bold">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-lg font-semibold">
                  {user?.displayName || 'Usuario'}
                </Text>
                <Text className="text-text-muted text-sm">{user?.email}</Text>
                <View className={`${getPlanBadgeColor()} self-start px-2 py-0.5 rounded-full mt-1`}>
                  <Text className="text-xs font-semibold text-black">
                    {currentPlan.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Subscription Section */}
        {!isSubscribed && (
          <SettingSection title="SUSCRIPCIÓN">
            <View className="p-4">
              <Text className="text-white font-semibold mb-3">
                Desbloquea todas las funciones
              </Text>
              {SUBSCRIPTION_PLANS.filter((p) => p.id !== 'free').map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  onPress={() => handleUpgrade(plan.id)}
                  className="flex-row items-center justify-between py-3 border-b border-dark-border"
                >
                  <View>
                    <Text className="text-white font-medium">{plan.name}</Text>
                    <Text className="text-text-muted text-sm">
                      {plan.layeringsPerMonth === -1
                        ? 'Layerings ilimitados'
                        : `${plan.layeringsPerMonth} layerings/mes`}
                    </Text>
                  </View>
                  <View className="bg-luxe-gold/20 px-3 py-1 rounded-full">
                    <Text className="text-luxe-gold font-semibold">
                      {plan.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <SettingItem
              icon="refresh"
              title="Restaurar compras"
              onPress={handleRestorePurchases}
            />
          </SettingSection>
        )}

        {/* Preferences Section */}
        <SettingSection title="PREFERENCIAS">
          <SettingItem
            icon="notifications"
            title="Notificaciones"
            subtitle="Recibe alertas y recordatorios"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#3D3D3D', true: '#D4AF37' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <View className="h-px bg-dark-border mx-4" />
          <SettingItem
            icon="pulse"
            title="Vibraciones"
            subtitle="Feedback háptico"
            rightElement={
              <Switch
                value={haptics}
                onValueChange={setHaptics}
                trackColor={{ false: '#3D3D3D', true: '#D4AF37' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="SOPORTE">
          <SettingItem
            icon="help-circle"
            title="Centro de ayuda"
            onPress={() => Linking.openURL('https://essenceduluxe.com/help')}
          />
          <View className="h-px bg-dark-border mx-4" />
          <SettingItem
            icon="mail"
            title="Contactar soporte"
            subtitle="soporte@essenceduluxe.com"
            onPress={() => Linking.openURL('mailto:soporte@essenceduluxe.com')}
          />
          <View className="h-px bg-dark-border mx-4" />
          <SettingItem
            icon="star"
            title="Valorar la app"
            onPress={() =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.essenceduluxe.perfumerie'
              )
            }
          />
        </SettingSection>

        {/* Legal Section */}
        <SettingSection title="LEGAL">
          <SettingItem
            icon="document-text"
            title="Términos de servicio"
            onPress={() => Linking.openURL('https://essenceduluxe.com/terms')}
          />
          <View className="h-px bg-dark-border mx-4" />
          <SettingItem
            icon="shield-checkmark"
            title="Política de privacidad"
            onPress={() => Linking.openURL('https://essenceduluxe.com/privacy')}
          />
        </SettingSection>

        {/* Account Section */}
        <SettingSection title="CUENTA">
          <SettingItem
            icon="log-out"
            title="Cerrar sesión"
            onPress={handleSignOut}
          />
          <View className="h-px bg-dark-border mx-4" />
          <SettingItem
            icon="trash"
            title="Eliminar cuenta"
            subtitle="Acción irreversible"
            onPress={handleDeleteAccount}
            danger
          />
        </SettingSection>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-luxe-gold font-semibold">L'Essence du Luxe</Text>
          <Text className="text-text-muted text-sm">
            Versión {Constants.expoConfig?.version || '2.0.0'}
          </Text>
          <Text className="text-text-muted text-xs mt-1">
            Made with ♦ for perfume lovers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
