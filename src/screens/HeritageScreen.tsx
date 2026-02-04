// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Heritage Screen (Narratives)
// Tab 5: AI-generated layering history, app story, engagement
// CONNECTED: useAuth -> useAudit6Pilars -> useInventory
// ============================================================================

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenWrapper, Card } from '../components/common';
import { COLORS } from '../styles/colors';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useAudit6Pilars } from '../hooks/useAudit6Pilars';
import { getReadableTime } from '../utils/helpers';

export function HeritageScreen() {
  const { getUserDisplayName } = useAuth();
  const { stats } = useInventory();
  const { audits } = useAudit6Pilars();

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Heritage</Text>
        <Text style={styles.subtitle}>L'histoire de votre voyage olfactif</Text>

        {/* User Story */}
        <Card variant="elevated" style={styles.storyCard}>
          <Text style={styles.storyTitle}>Votre Parcours</Text>
          <Text style={styles.storyText}>
            {getUserDisplayName() || 'Artisan'}, vous avez commence votre voyage dans l'art du
            layering avec {stats.totalItems} parfums de {stats.totalBrands} maisons differentes.
            {audits.length > 0
              ? ` Vous avez realise ${audits.length} audits complets avec le systeme 6 Pilares.`
              : ' Votre premier audit 6 Pilares vous attend.'}
          </Text>
        </Card>

        {/* App Origin Story */}
        <Card variant="glass" style={styles.originCard}>
          <Text style={styles.originTitle}>L'Origine du Code</Text>
          <Text style={styles.originText}>
            L'Essence du Luxe est nee de la conviction qu'un layering parfait n'est pas un
            hasard mais une science. Le systeme des 6 Pilares transforme l'intuition en
            precision: chaque combinaison est analysee, chaque molecule evaluee, chaque
            economie calculee.
          </Text>
          <Text style={styles.originText}>
            Du Pilar 1 (Strategie) au Pilar 6 (Compatibilite Chimique), cette application
            represente des milliers d'heures de recherche en parfumerie distillees dans
            un moteur d'intelligence artificielle.
          </Text>
        </Card>

        {/* Audit Timeline */}
        {audits.length > 0 && (
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>Chronologie des Audits</Text>
            {audits.map((audit, index) => (
              <View key={audit.id} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {index < audits.length - 1 && <View style={styles.timelineLine} />}
                <Card style={styles.timelineCard}>
                  <Text style={styles.timelineName}>{audit.pillar1.operationName}</Text>
                  <Text style={styles.timelineScore}>
                    Score: {audit.overallScore}/100 | {audit.pillar2.totalPerfumesUsed} parfums
                  </Text>
                  <Text style={styles.timelineDate}>{getReadableTime(audit.createdAt)}</Text>
                </Card>
              </View>
            ))}
          </View>
        )}

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Vos Chiffres</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Parfums</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{audits.length}</Text>
              <Text style={styles.statLabel}>Audits</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalBrands}</Text>
              <Text style={styles.statLabel}>Maisons</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.favoritesCount}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: COLORS.dark.primary, paddingTop: 16 },
  subtitle: { fontSize: 14, color: COLORS.dark.textSecondary, marginBottom: 16 },
  storyCard: { marginBottom: 16 },
  storyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark.text, marginBottom: 8 },
  storyText: { fontSize: 14, color: COLORS.dark.textSecondary, lineHeight: 22 },
  originCard: { marginBottom: 16 },
  originTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark.primary, marginBottom: 8 },
  originText: { fontSize: 13, color: COLORS.dark.textSecondary, lineHeight: 20, marginBottom: 8 },
  timelineSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text, marginBottom: 12 },
  timelineItem: { flexDirection: 'row', marginBottom: 0, position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.dark.primary, marginTop: 16, marginRight: 12 },
  timelineLine: { position: 'absolute', left: 5, top: 28, width: 2, height: '100%', backgroundColor: COLORS.dark.border },
  timelineCard: { flex: 1, marginBottom: 8 },
  timelineName: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  timelineScore: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  timelineDate: { fontSize: 11, color: COLORS.dark.textMuted, marginTop: 2 },
  statsCard: { marginBottom: 16 },
  statsTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '700', color: COLORS.dark.primary },
  statLabel: { fontSize: 11, color: COLORS.dark.textMuted, marginTop: 2 },
  bottomSpacer: { height: 32 },
});

export default HeritageScreen;
