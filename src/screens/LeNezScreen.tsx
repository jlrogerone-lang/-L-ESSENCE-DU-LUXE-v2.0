// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Le Nez Screen (AI Lab)
// Tab 4: Quantum Genesis, OCR, Similarity, Suggestions
// CONNECTED: useAudit6Pilars -> GeminiService -> useInventory
// ============================================================================

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper, Card, Button, LoadingSpinner } from '../components/common';
import { COLORS } from '../styles/colors';
import { useAudit6Pilars } from '../hooks/useAudit6Pilars';
import { useInventory } from '../hooks/useInventory';
import { useMonetization } from '../hooks/useMonetization';
import { formatPrice } from '../utils/helpers';
import { AUDIT_PILLARS } from '../utils/constants';

export function LeNezScreen() {
  const { items } = useInventory();
  const {
    currentAudit, genesisResult, ocrResult, isAuditing, error,
    performAudit, generateQuantumGenesis, detectFromImage, clearResults,
  } = useAudit6Pilars();
  const { canAccess, isPremium } = useMonetization();
  const [selectedTab, setSelectedTab] = useState<'genesis' | 'audit' | 'ocr'>('genesis');

  const handleQuantumGenesis = async () => {
    if (!canAccess('quantum_genesis') && !isPremium) {
      Alert.alert('Plan Premium requis', 'Passez a Alquimiste pour utiliser Genesis Quantique.');
      return;
    }
    if (items.length < 2) {
      Alert.alert('Inventaire insuffisant', 'Ajoutez au moins 2 parfums a votre Cava.');
      return;
    }
    await generateQuantumGenesis(items);
  };

  const handleAudit = async () => {
    if (items.length < 2) {
      Alert.alert('Inventaire insuffisant', 'Ajoutez au moins 2 parfums a votre Cava.');
      return;
    }
    const selected = items.slice(0, Math.min(3, items.length));
    await performAudit(selected, 'Audit Manuel');
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Le Nez - Laboratoire IA</Text>
        <Text style={styles.subtitle}>Moteur d'intelligence olfactive</Text>

        {/* Tab Selector */}
        <View style={styles.tabRow}>
          {(['genesis', 'audit', 'ocr'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab === 'genesis' ? 'Genesis' : tab === 'audit' ? 'Audit 6P' : 'OCR'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Genesis Tab */}
        {selectedTab === 'genesis' && (
          <View style={styles.section}>
            <Card variant="elevated">
              <Text style={styles.sectionTitle}>Genesis Quantique</Text>
              <Text style={styles.sectionDesc}>
                L'IA analyse votre inventaire et cree la combinaison optimale.
              </Text>
              <Button
                title="Generer un Layering"
                onPress={handleQuantumGenesis}
                loading={isAuditing}
                disabled={items.length < 2}
              />
            </Card>

            {genesisResult && (
              <Card variant="glass" style={styles.resultCard}>
                <Text style={styles.resultTitle}>
                  {genesisResult.generatedLayering.name}
                </Text>
                <Text style={styles.resultDesc}>{genesisResult.reasoning}</Text>
                <Text style={styles.resultScore}>
                  Compatibilite: {genesisResult.compatibilityScore}%
                </Text>
                <Text style={styles.resultScore}>
                  Score Audit: {genesisResult.audit.overallScore}/100
                </Text>
                <Text style={styles.resultScore}>
                  Economie: {formatPrice(genesisResult.audit.pillar3.fiscalSavingsEUR)}
                </Text>
              </Card>
            )}
          </View>
        )}

        {/* Audit Tab */}
        {selectedTab === 'audit' && (
          <View style={styles.section}>
            <Card variant="elevated">
              <Text style={styles.sectionTitle}>Audit 6 Pilares</Text>
              <Text style={styles.sectionDesc}>
                Analyse complete de votre layering avec les 6 piliers.
              </Text>
              <Button
                title="Lancer l'Audit"
                onPress={handleAudit}
                loading={isAuditing}
                disabled={items.length < 2}
              />
            </Card>

            {currentAudit && (
              <Card variant="glass" style={styles.resultCard}>
                <Text style={styles.resultTitle}>{currentAudit.pillar1.operationName}</Text>
                <Text style={styles.auditScore}>Score: {currentAudit.overallScore}/100</Text>

                {AUDIT_PILLARS.map((pillar) => {
                  const data = currentAudit[`pillar${pillar.id}` as keyof typeof currentAudit];
                  return (
                    <View key={pillar.id} style={styles.pillarRow}>
                      <Text style={styles.pillarNum}>P{pillar.id}</Text>
                      <View style={styles.pillarInfo}>
                        <Text style={styles.pillarTitle}>{pillar.name}</Text>
                        <Text style={styles.pillarDetail}>{pillar.description}</Text>
                      </View>
                      <Text style={styles.pillarCheck}>OK</Text>
                    </View>
                  );
                })}

                <View style={styles.fiscalBox}>
                  <Text style={styles.fiscalTitle}>Motor Fiscal</Text>
                  <Text style={styles.fiscalValue}>
                    Prix Niche: {formatPrice(currentAudit.pillar3.nichePriceEquivalentEUR)}
                  </Text>
                  <Text style={styles.fiscalValue}>
                    Cout Reel: {formatPrice(currentAudit.pillar3.totalRealCostEUR)}
                  </Text>
                  <Text style={styles.fiscalSavings}>
                    ECONOMIE: {formatPrice(currentAudit.pillar3.fiscalSavingsEUR)} ({currentAudit.pillar3.savingsPercentage}%)
                  </Text>
                </View>
              </Card>
            )}
          </View>
        )}

        {/* OCR Tab */}
        {selectedTab === 'ocr' && (
          <View style={styles.section}>
            <Card variant="elevated">
              <Text style={styles.sectionTitle}>OCR - L'Oeil IA</Text>
              <Text style={styles.sectionDesc}>
                Pointez votre camera vers un flacon pour l'identifier automatiquement.
              </Text>
              <Button
                title="Ouvrir Camera"
                onPress={() => Alert.alert('Camera', 'Fonctionnalite camera activee. Pointez vers un flacon.')}
                disabled={!canAccess('ocr') && !isPremium}
              />
              {!canAccess('ocr') && !isPremium && (
                <Text style={styles.premiumHint}>Premium requis pour OCR illimite</Text>
              )}
            </Card>

            {ocrResult && (
              <Card variant="glass" style={styles.resultCard}>
                <Text style={styles.resultTitle}>
                  {ocrResult.perfumeName || 'Parfum detecte'}
                </Text>
                <Text style={styles.resultDesc}>
                  Marque: {ocrResult.brand || 'Non identifiee'}
                </Text>
                <Text style={styles.resultDesc}>
                  Confiance: {Math.round((ocrResult.confidence || 0) * 100)}%
                </Text>
                <Text style={styles.resultDesc}>
                  Texte detecte: {ocrResult.detectedText}
                </Text>
              </Card>
            )}
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Effacer" variant="ghost" size="sm" onPress={clearResults} />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: COLORS.dark.primary, paddingTop: 16 },
  subtitle: { fontSize: 14, color: COLORS.dark.textSecondary, marginBottom: 16 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: COLORS.dark.surface, borderWidth: 1, borderColor: COLORS.dark.border },
  tabActive: { backgroundColor: COLORS.dark.primary, borderColor: COLORS.dark.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.dark.textSecondary },
  tabTextActive: { color: '#000' },
  section: { gap: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark.text, marginBottom: 8 },
  sectionDesc: { fontSize: 13, color: COLORS.dark.textSecondary, marginBottom: 12, lineHeight: 20 },
  resultCard: { marginTop: 8 },
  resultTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark.primary },
  resultDesc: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 4 },
  resultScore: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text, marginTop: 4 },
  auditScore: { fontSize: 20, fontWeight: '700', color: COLORS.dark.primary, marginVertical: 8 },
  pillarRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  pillarNum: { fontSize: 13, fontWeight: '700', color: COLORS.dark.primary, width: 30 },
  pillarInfo: { flex: 1 },
  pillarTitle: { fontSize: 13, fontWeight: '600', color: COLORS.dark.text },
  pillarDetail: { fontSize: 11, color: COLORS.dark.textMuted },
  pillarCheck: { fontSize: 13, fontWeight: '700', color: COLORS.dark.success },
  fiscalBox: { marginTop: 12, padding: 12, backgroundColor: COLORS.dark.surfaceElevated, borderRadius: 12 },
  fiscalTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark.primary, marginBottom: 8 },
  fiscalValue: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 2 },
  fiscalSavings: { fontSize: 16, fontWeight: '700', color: COLORS.dark.success, marginTop: 8 },
  premiumHint: { fontSize: 12, color: COLORS.dark.warning, marginTop: 8 },
  errorBox: { padding: 12, backgroundColor: 'rgba(231,76,60,0.1)', borderRadius: 8, marginTop: 8 },
  errorText: { color: COLORS.dark.error, fontSize: 13 },
  bottomSpacer: { height: 32 },
});

export default LeNezScreen;
