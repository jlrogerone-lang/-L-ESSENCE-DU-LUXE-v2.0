// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Atelier Screen (Dashboard)
// Tab 1: Daily layering, 6-pillar audit summary, AI recommendations
// CONNECTED: useAuth -> useInventory -> useAudit6Pilars -> useMonetization
// ============================================================================

import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper, Card, Button, LoadingSpinner } from '../components/common';
import { COLORS } from '../styles/colors';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useAudit6Pilars } from '../hooks/useAudit6Pilars';
import { useMonetization } from '../hooks/useMonetization';
import { AUDIT_PILLARS } from '../utils/constants';
import { formatPrice, getReadableTime } from '../utils/helpers';

export function AtelierScreen() {
  const { user, isLoggedIn, getUserDisplayName } = useAuth();
  const { items, stats, isLoading: inventoryLoading } = useInventory();
  const { currentAudit, audits, loadAudits, isAuditing } = useAudit6Pilars();
  const { isPremium, subscription } = useMonetization();

  useEffect(() => {
    if (isLoggedIn) {
      loadAudits();
    }
  }, [isLoggedIn, loadAudits]);

  if (inventoryLoading) {
    return <LoadingSpinner message="Chargement de votre atelier..." />;
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Bienvenue, {getUserDisplayName() || 'Artisan'}
          </Text>
          <Text style={styles.subtitle}>Votre Atelier de Parfumerie</Text>
        </View>

        {/* Stats Overview */}
        <Card variant="elevated" style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Collection</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Parfums</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalBrands}</Text>
              <Text style={styles.statLabel}>Marques</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatPrice(stats.totalRetailValueEUR)}</Text>
              <Text style={styles.statLabel}>Valeur</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValueGold}>{formatPrice(stats.totalSavingsEUR)}</Text>
              <Text style={styles.statLabel}>Economise</Text>
            </View>
          </View>
        </Card>

        {/* Latest Audit */}
        {currentAudit && (
          <Card variant="glass" style={styles.auditCard}>
            <Text style={styles.sectionTitle}>Dernier Audit 6 Pilares</Text>
            <Text style={styles.auditName}>{currentAudit.pillar1.operationName}</Text>
            <View style={styles.pillarGrid}>
              {AUDIT_PILLARS.map((pillar) => (
                <View key={pillar.id} style={styles.pillarBadge}>
                  <Text style={styles.pillarNumber}>{pillar.id}</Text>
                  <Text style={styles.pillarName}>{pillar.name}</Text>
                </View>
              ))}
            </View>
            <View style={styles.auditDetails}>
              <Text style={styles.auditDetail}>
                Score: {currentAudit.overallScore}/100
              </Text>
              <Text style={styles.auditDetail}>
                Economie: {formatPrice(currentAudit.pillar3.fiscalSavingsEUR)}
              </Text>
              <Text style={styles.auditDetail}>
                Compatibilite: {currentAudit.pillar6.overallCompatibilityPercent}%
              </Text>
              <Text style={styles.auditDetail}>
                Longevite: {currentAudit.pillar5.longevityEstimateHours}h
              </Text>
            </View>
          </Card>
        )}

        {/* Audit History */}
        {audits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historique Audits</Text>
            {audits.slice(0, 5).map((audit) => (
              <Card key={audit.id} style={styles.historyItem}>
                <Text style={styles.historyName}>{audit.pillar1.operationName}</Text>
                <Text style={styles.historyMeta}>
                  Score: {audit.overallScore}/100 | {getReadableTime(audit.createdAt)}
                </Text>
              </Card>
            ))}
          </View>
        )}

        {/* Subscription Status */}
        <Card style={styles.planCard}>
          <Text style={styles.sectionTitle}>Plan Actif</Text>
          <Text style={isPremium ? styles.planPremium : styles.planFree}>
            {subscription.plan === 'free' ? 'Gratuit' : subscription.plan.toUpperCase()}
          </Text>
          {!isPremium && (
            <Text style={styles.upgradeHint}>
              Passez a Alquimiste pour des audits illimites
            </Text>
          )}
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  header: { paddingTop: 16, paddingBottom: 24 },
  greeting: { fontSize: 24, fontWeight: '700', color: COLORS.dark.primary },
  subtitle: { fontSize: 14, color: COLORS.dark.textSecondary, marginTop: 4 },
  statsCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', color: COLORS.dark.text },
  statValueGold: { fontSize: 18, fontWeight: '700', color: COLORS.dark.primary },
  statLabel: { fontSize: 11, color: COLORS.dark.textMuted, marginTop: 2 },
  auditCard: { marginBottom: 16 },
  auditName: { fontSize: 18, fontWeight: '600', color: COLORS.dark.primary, marginBottom: 12 },
  pillarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  pillarBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.surfaceElevated, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  pillarNumber: { fontSize: 11, fontWeight: '700', color: COLORS.dark.primary, marginRight: 4 },
  pillarName: { fontSize: 10, color: COLORS.dark.textSecondary },
  auditDetails: { gap: 4 },
  auditDetail: { fontSize: 13, color: COLORS.dark.textSecondary },
  section: { marginBottom: 16 },
  historyItem: { marginBottom: 8 },
  historyName: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  historyMeta: { fontSize: 12, color: COLORS.dark.textMuted, marginTop: 2 },
  planCard: { marginBottom: 16 },
  planFree: { fontSize: 20, fontWeight: '700', color: COLORS.dark.textSecondary },
  planPremium: { fontSize: 20, fontWeight: '700', color: COLORS.dark.primary },
  upgradeHint: { fontSize: 12, color: COLORS.dark.textMuted, marginTop: 4 },
  bottomSpacer: { height: 32 },
});

export default AtelierScreen;
