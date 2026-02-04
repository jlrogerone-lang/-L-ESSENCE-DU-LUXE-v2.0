// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Reglages Screen (Settings)
// Tab 6: Profile, subscription, theme, language, logout
// CONNECTED: useAuth -> useMonetization -> StorageService
// ============================================================================

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper, Card, Button } from '../components/common';
import { COLORS } from '../styles/colors';
import { useAuth } from '../hooks/useAuth';
import { useMonetization } from '../hooks/useMonetization';
import { APP_NAME, APP_VERSION, SUBSCRIPTION_PLANS } from '../utils/constants';
import { formatPrice } from '../utils/helpers';
import { SubscriptionPlan } from '../types';

export function ReglagesScreen() {
  const { user, isLoggedIn, signIn, signOut } = useAuth();
  const {
    subscription, isPremium, buyPlan, restorePurchases, cancel,
    getPlanName, getRemainingDays, isAutoRenewEnabled,
  } = useMonetization();

  const handleSignOut = () => {
    Alert.alert(
      'Deconnexion',
      'Voulez-vous vous deconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Deconnecter', style: 'destructive', onPress: signOut },
      ],
    );
  };

  const handlePurchase = (plan: SubscriptionPlan) => {
    Alert.alert(
      `Passer a ${SUBSCRIPTION_PLANS[plan].name}`,
      `${formatPrice(SUBSCRIPTION_PLANS[plan].priceEUR)}/mois\n\n${SUBSCRIPTION_PLANS[plan].description}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Acheter', onPress: () => buyPlan(plan) },
      ],
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reglages</Text>

        {/* Profile Section */}
        <Card variant="elevated" style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          {isLoggedIn ? (
            <View>
              <Text style={styles.userName}>{user?.displayName || 'Utilisateur'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userMeta}>
                Membre depuis {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}
              </Text>
              <Button
                title="Deconnexion"
                variant="outline"
                size="sm"
                onPress={handleSignOut}
                style={styles.logoutBtn}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.notLoggedIn}>Non connecte</Text>
              <Button title="Connecter avec Google" onPress={signIn} />
            </View>
          )}
        </Card>

        {/* Subscription Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnement</Text>
          <View style={styles.currentPlan}>
            <Text style={styles.planName}>{getPlanName()}</Text>
            <Text style={isPremium ? styles.planActive : styles.planInactive}>
              {isPremium ? 'ACTIF' : 'GRATUIT'}
            </Text>
          </View>
          {subscription.expiresAt && (
            <Text style={styles.planMeta}>
              Expire dans {getRemainingDays()} jours
              {isAutoRenewEnabled ? ' (renouvellement auto)' : ''}
            </Text>
          )}

          {/* Plan Options */}
          <View style={styles.plansGrid}>
            {(Object.entries(SUBSCRIPTION_PLANS) as [SubscriptionPlan, typeof SUBSCRIPTION_PLANS[SubscriptionPlan]][]).map(
              ([key, plan]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.planOption,
                    subscription.plan === key && styles.planOptionActive,
                  ]}
                  onPress={() => key !== 'free' && key !== subscription.plan && handlePurchase(key)}
                  disabled={key === subscription.plan}
                >
                  <Text style={styles.planOptionName}>{plan.name}</Text>
                  <Text style={styles.planOptionPrice}>
                    {plan.priceEUR === 0 ? 'Gratuit' : formatPrice(plan.priceEUR)}
                  </Text>
                  <Text style={styles.planOptionDesc} numberOfLines={2}>
                    {plan.description}
                  </Text>
                  {subscription.plan === key && (
                    <Text style={styles.currentLabel}>Plan actuel</Text>
                  )}
                </TouchableOpacity>
              ),
            )}
          </View>

          <View style={styles.planActions}>
            <Button
              title="Restaurer achats"
              variant="outline"
              size="sm"
              onPress={restorePurchases}
            />
            {isPremium && (
              <Button
                title="Annuler abonnement"
                variant="ghost"
                size="sm"
                onPress={() =>
                  Alert.alert('Annuler', 'Confirmer l\'annulation ?', [
                    { text: 'Non', style: 'cancel' },
                    { text: 'Oui, annuler', style: 'destructive', onPress: cancel },
                  ])
                }
              />
            )}
          </View>
        </Card>

        {/* App Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom</Text>
            <Text style={styles.infoValue}>{APP_NAME}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Architecture</Text>
            <Text style={styles.infoValue}>Clean + MVVM + 6 Pilares</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IA</Text>
            <Text style={styles.infoValue}>Google Gemini (Token Delegation)</Text>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: COLORS.dark.primary, paddingTop: 16, marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text, marginBottom: 12 },
  userName: { fontSize: 18, fontWeight: '600', color: COLORS.dark.text },
  userEmail: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 2 },
  userMeta: { fontSize: 12, color: COLORS.dark.textMuted, marginTop: 4 },
  logoutBtn: { marginTop: 12, alignSelf: 'flex-start' },
  notLoggedIn: { fontSize: 14, color: COLORS.dark.textMuted, marginBottom: 12 },
  currentPlan: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  planName: { fontSize: 20, fontWeight: '700', color: COLORS.dark.text },
  planActive: { fontSize: 13, fontWeight: '700', color: COLORS.dark.success },
  planInactive: { fontSize: 13, fontWeight: '600', color: COLORS.dark.textMuted },
  planMeta: { fontSize: 12, color: COLORS.dark.textSecondary, marginBottom: 12 },
  plansGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  planOption: { width: '48%', backgroundColor: COLORS.dark.surfaceElevated, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.dark.border },
  planOptionActive: { borderColor: COLORS.dark.primary, borderWidth: 2 },
  planOptionName: { fontSize: 14, fontWeight: '700', color: COLORS.dark.text },
  planOptionPrice: { fontSize: 16, fontWeight: '700', color: COLORS.dark.primary, marginTop: 4 },
  planOptionDesc: { fontSize: 11, color: COLORS.dark.textMuted, marginTop: 4 },
  currentLabel: { fontSize: 10, fontWeight: '700', color: COLORS.dark.success, marginTop: 4 },
  planActions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  infoLabel: { fontSize: 14, color: COLORS.dark.textSecondary },
  infoValue: { fontSize: 14, color: COLORS.dark.text, fontWeight: '500' },
  bottomSpacer: { height: 32 },
});

export default ReglagesScreen;
