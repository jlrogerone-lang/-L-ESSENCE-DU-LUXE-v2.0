// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Cava Screen (Inventory)
// Tab 2: Perfume grid, search/filters, 6 pillar card, edit/audit
// CONNECTED: useInventory -> useAudit6Pilars -> PERFUME_CATALOG
// ============================================================================

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper, Card, LoadingSpinner } from '../components/common';
import { COLORS } from '../styles/colors';
import { useInventory } from '../hooks/useInventory';
import { useAudit6Pilars } from '../hooks/useAudit6Pilars';
import { InventoryItem } from '../types';
import { formatPrice, getCategoryColor, getCategoryEmoji } from '../utils/helpers';
import { PERFUME_CATALOG, CATALOG_BRANDS } from '../utils/constants';

export function CavaScreen() {
  const { items, isLoading, searchItems, deleteItem, toggleFavorite, addItem } = useInventory();
  const { performAudit, isAuditing } = useAudit6Pilars();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  const filteredItems = searchQuery
    ? searchItems(searchQuery)
    : selectedBrand
      ? items.filter((i) => i.brand === selectedBrand)
      : items;

  const handleAddFromCatalog = useCallback(
    async (catalogEntry: typeof PERFUME_CATALOG[0]) => {
      await addItem({
        name: catalogEntry.name,
        brand: catalogEntry.brand,
        concentration: catalogEntry.concentration as InventoryItem['concentration'],
        category: catalogEntry.family,
        retailPriceEUR: catalogEntry.retailPriceEUR,
        purchasePriceEUR: 0,
        mlTotal: 100,
        mlRemaining: 100,
        costPerMlEUR: 0,
        notes: catalogEntry.notes,
        family: catalogEntry.family,
        season: catalogEntry.season,
        timeOfDay: catalogEntry.timeOfDay,
        longevityHours: catalogEntry.longevityHours,
        sillage: catalogEntry.sillage,
        isFavorite: false,
        imageUrl: null,
      });
    },
    [addItem],
  );

  const renderInventoryItem = useCallback(
    ({ item }: { item: InventoryItem }) => (
      <Card style={styles.perfumeCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.familyDot, { backgroundColor: getCategoryColor(item.family) }]} />
            <Text style={styles.perfumeName}>{item.name}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Text style={styles.favoriteIcon}>{item.isFavorite ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.brand}>{item.brand} | {item.concentration}</Text>
        <Text style={styles.family}>{getCategoryEmoji(item.family)} {item.family}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>Retail: {formatPrice(item.retailPriceEUR)}</Text>
          <Text style={styles.metaText}>Cout/ml: {formatPrice(item.costPerMlEUR)}</Text>
          <Text style={styles.metaText}>{item.longevityHours}h | Sillage {item.sillage}/8</Text>
        </View>
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Top: {item.notes.top.join(', ')}</Text>
          <Text style={styles.notesLabel}>Coeur: {item.notes.heart.join(', ')}</Text>
          <Text style={styles.notesLabel}>Base: {item.notes.base.join(', ')}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => deleteItem(item.id)}
          >
            <Text style={styles.actionBtnText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </Card>
    ),
    [toggleFavorite, deleteItem],
  );

  const renderCatalogItem = useCallback(
    ({ item }: { item: typeof PERFUME_CATALOG[0] }) => (
      <Card style={styles.catalogCard}>
        <Text style={styles.catalogName}>{item.name}</Text>
        <Text style={styles.catalogBrand}>{item.brand} | {item.concentration}</Text>
        <Text style={styles.catalogPrice}>{formatPrice(item.retailPriceEUR)}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddFromCatalog(item)}
        >
          <Text style={styles.addBtnText}>+ Ajouter a ma Cava</Text>
        </TouchableOpacity>
      </Card>
    ),
    [handleAddFromCatalog],
  );

  if (isLoading) {
    return <LoadingSpinner message="Chargement de votre cava..." />;
  }

  return (
    <ScreenWrapper>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un parfum..."
          placeholderTextColor={COLORS.dark.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Toggle Inventory / Catalog */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, !showCatalog && styles.toggleBtnActive]}
          onPress={() => setShowCatalog(false)}
        >
          <Text style={[styles.toggleText, !showCatalog && styles.toggleTextActive]}>
            Ma Cava ({items.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, showCatalog && styles.toggleBtnActive]}
          onPress={() => setShowCatalog(true)}
        >
          <Text style={[styles.toggleText, showCatalog && styles.toggleTextActive]}>
            Catalogue ({PERFUME_CATALOG.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Brand Filters */}
      {!showCatalog && (
        <FlatList
          horizontal
          data={[null, ...CATALOG_BRANDS]}
          keyExtractor={(item) => item || 'all'}
          renderItem={({ item: brand }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedBrand === brand && styles.filterChipActive]}
              onPress={() => setSelectedBrand(brand)}
            >
              <Text style={[styles.filterChipText, selectedBrand === brand && styles.filterChipTextActive]}>
                {brand || 'Tous'}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        />
      )}

      {/* Items List */}
      {showCatalog ? (
        <FlatList
          data={searchQuery ? PERFUME_CATALOG.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
          ) : PERFUME_CATALOG}
          keyExtractor={(item) => item.id}
          renderItem={renderCatalogItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderInventoryItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Votre Cava est vide</Text>
              <Text style={styles.emptySubtitle}>
                Ajoutez des parfums depuis le Catalogue ou la Bibliotheque
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: { paddingHorizontal: 0, paddingTop: 12, paddingBottom: 8 },
  searchInput: {
    backgroundColor: COLORS.dark.surface, borderWidth: 1, borderColor: COLORS.dark.border,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: COLORS.dark.text,
  },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: COLORS.dark.surface },
  toggleBtnActive: { backgroundColor: COLORS.dark.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.dark.textSecondary },
  toggleTextActive: { color: '#000' },
  filterRow: { marginBottom: 8, maxHeight: 36 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: COLORS.dark.surface, marginRight: 6, borderWidth: 1, borderColor: COLORS.dark.border },
  filterChipActive: { backgroundColor: COLORS.dark.primary, borderColor: COLORS.dark.primary },
  filterChipText: { fontSize: 12, color: COLORS.dark.textSecondary },
  filterChipTextActive: { color: '#000' },
  listContent: { paddingBottom: 32 },
  perfumeCard: { marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  familyDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  perfumeName: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text, flex: 1 },
  favoriteIcon: { fontSize: 22, color: COLORS.dark.primary },
  brand: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 2 },
  family: { fontSize: 12, color: COLORS.dark.textMuted, marginTop: 2 },
  cardMeta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metaText: { fontSize: 11, color: COLORS.dark.textMuted },
  notesSection: { marginTop: 8, gap: 2 },
  notesLabel: { fontSize: 11, color: COLORS.dark.textSecondary },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: COLORS.dark.surfaceElevated },
  actionBtnText: { fontSize: 12, color: COLORS.dark.error },
  catalogCard: { marginBottom: 8, padding: 12 },
  catalogName: { fontSize: 15, fontWeight: '600', color: COLORS.dark.text },
  catalogBrand: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  catalogPrice: { fontSize: 14, fontWeight: '600', color: COLORS.dark.primary, marginTop: 4 },
  addBtn: { marginTop: 8, backgroundColor: COLORS.dark.primary, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#000' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark.textSecondary },
  emptySubtitle: { fontSize: 13, color: COLORS.dark.textMuted, marginTop: 8, textAlign: 'center' },
});

export default CavaScreen;
