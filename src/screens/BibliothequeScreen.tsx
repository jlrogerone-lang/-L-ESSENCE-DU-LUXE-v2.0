// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Bibliotheque Screen (Web Search)
// Tab 3: Search with prediction, real-time web results, add to Cava
// CONNECTED: useBibliotheque -> BibliothequeService -> Google Custom Search
// ============================================================================

import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  TouchableOpacity, Modal,
} from 'react-native';
import { ScreenWrapper, Card, Button, LoadingSpinner } from '../components/common';
import { COLORS } from '../styles/colors';
import { useBibliotheque } from '../hooks/useBibliotheque';
import { BibliothequeSearchResult } from '../types';
import { truncate } from '../utils/helpers';

export function BibliothequeScreen() {
  const {
    searchResults, favorites, recentSearches, isLoading, error,
    searchPerfumes, addToFavorites, removeFromFavorites, isFavorite,
    addToInventory, clearSearch,
  } = useBibliotheque();

  const [query, setQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<BibliothequeSearchResult | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSearch = async () => {
    if (query.trim().length > 0) {
      await searchPerfumes(query.trim());
    }
  };

  const handleAddToCava = async (result: BibliothequeSearchResult) => {
    await addToInventory(result);
    setSelectedResult(null);
  };

  const displayList = showFavorites ? favorites : searchResults;

  return (
    <ScreenWrapper>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un parfum dans le monde..."
          placeholderTextColor={COLORS.dark.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggle, !showFavorites && styles.toggleActive]}
          onPress={() => setShowFavorites(false)}
        >
          <Text style={[styles.toggleText, !showFavorites && styles.toggleTextActive]}>
            Resultats ({searchResults.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggle, showFavorites && styles.toggleActive]}
          onPress={() => setShowFavorites(true)}
        >
          <Text style={[styles.toggleText, showFavorites && styles.toggleTextActive]}>
            Favoris ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      {!showFavorites && searchResults.length === 0 && recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recherches recentes</Text>
          <View style={styles.recentChips}>
            {recentSearches.slice(0, 8).map((s, i) => (
              <TouchableOpacity
                key={`${s}-${i}`}
                style={styles.recentChip}
                onPress={() => { setQuery(s); searchPerfumes(s); }}
              >
                <Text style={styles.recentChipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Loading */}
      {isLoading && <LoadingSpinner message="Recherche en cours..." />}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Results */}
      {!isLoading && (
        <FlatList
          data={displayList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedResult(item)}>
              <Card style={styles.resultCard}>
                <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.resultBrand}>{item.brand} - {item.perfumeName}</Text>
                <Text style={styles.resultDesc} numberOfLines={2}>{truncate(item.description, 120)}</Text>
                <View style={styles.resultActions}>
                  <TouchableOpacity
                    onPress={() => isFavorite(item.id) ? removeFromFavorites(item.id) : addToFavorites(item)}
                  >
                    <Text style={styles.favBtn}>{isFavorite(item.id) ? '★ Favori' : '☆ Favoriser'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAddToCava(item)}>
                    <Text style={styles.addCavaBtn}>+ Cava</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  {showFavorites ? 'Aucun favori' : 'Recherchez un parfum'}
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Detail Modal (Glassmorphism Pop-Up) */}
      <Modal
        visible={!!selectedResult}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedResult(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedResult && (
              <>
                <Text style={styles.modalTitle}>{selectedResult.perfumeName}</Text>
                <Text style={styles.modalBrand}>{selectedResult.brand}</Text>
                <Text style={styles.modalDesc}>{selectedResult.description}</Text>
                {selectedResult.notes.top.length > 0 && (
                  <View style={styles.modalNotes}>
                    <Text style={styles.noteLine}>Top: {selectedResult.notes.top.join(', ')}</Text>
                    <Text style={styles.noteLine}>Coeur: {selectedResult.notes.heart.join(', ')}</Text>
                    <Text style={styles.noteLine}>Base: {selectedResult.notes.base.join(', ')}</Text>
                  </View>
                )}
                <View style={styles.modalActions}>
                  <Button title="Ajouter a ma Cava" onPress={() => handleAddToCava(selectedResult)} />
                  <Button title="Fermer" variant="outline" onPress={() => setSelectedResult(null)} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: 8, paddingTop: 12, paddingBottom: 8 },
  searchInput: {
    flex: 1, backgroundColor: COLORS.dark.surface, borderWidth: 1, borderColor: COLORS.dark.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: COLORS.dark.text,
  },
  searchBtn: { backgroundColor: COLORS.dark.primary, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  searchBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  toggle: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: COLORS.dark.surface },
  toggleActive: { backgroundColor: COLORS.dark.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.dark.textSecondary },
  toggleTextActive: { color: '#000' },
  recentSection: { marginBottom: 12 },
  recentTitle: { fontSize: 13, color: COLORS.dark.textMuted, marginBottom: 8 },
  recentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  recentChip: { backgroundColor: COLORS.dark.surfaceElevated, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  recentChipText: { fontSize: 12, color: COLORS.dark.textSecondary },
  errorContainer: { padding: 12, backgroundColor: 'rgba(231,76,60,0.1)', borderRadius: 8, marginBottom: 8 },
  errorText: { color: COLORS.dark.error, fontSize: 13 },
  resultCard: { marginBottom: 8 },
  resultTitle: { fontSize: 15, fontWeight: '600', color: COLORS.dark.text },
  resultBrand: { fontSize: 13, color: COLORS.dark.primary, marginTop: 2 },
  resultDesc: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 4 },
  resultActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  favBtn: { fontSize: 13, color: COLORS.dark.primary },
  addCavaBtn: { fontSize: 13, fontWeight: '700', color: COLORS.dark.success },
  listContent: { paddingBottom: 32 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, color: COLORS.dark.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: COLORS.dark.overlay, justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.dark.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: COLORS.dark.borderLight },
  modalTitle: { fontSize: 22, fontWeight: '700', color: COLORS.dark.text },
  modalBrand: { fontSize: 15, color: COLORS.dark.primary, marginTop: 4 },
  modalDesc: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 12, lineHeight: 20 },
  modalNotes: { marginTop: 12, gap: 4 },
  noteLine: { fontSize: 12, color: COLORS.dark.textMuted },
  modalActions: { marginTop: 20, gap: 10 },
});

export default BibliothequeScreen;
