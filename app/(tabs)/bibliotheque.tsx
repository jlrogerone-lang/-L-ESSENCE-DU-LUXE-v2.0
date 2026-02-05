// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Bibliothèque Universelle
// Expo Router v4 - Search and discover perfumes via Google Custom Search
// ============================================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBibliotheque } from '@hooks/useBibliotheque';
import { useInventory } from '@hooks/useInventory';
import { PERFUME_CATALOG } from '@utils/constants';

import type { PerfumeSearchResult } from '@types/index';

export default function BibliothequeScreen() {
  const { search, searchResults, loading, recentSearches, addToFavorites } =
    useBibliotheque();
  const { addPerfume } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCatalog, setShowCatalog] = useState(true);

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim().length < 2) return;

    Keyboard.dismiss();
    setShowCatalog(false);
    await search(searchQuery.trim());
  }, [searchQuery, search]);

  const handleAddToCollection = (item: PerfumeSearchResult) => {
    Alert.prompt(
      'Agregar a tu Cava',
      `¿Cuánto pagaste por "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar',
          onPress: (price) => {
            const pricePaid = parseFloat(price || '0');
            addPerfume({
              name: item.name,
              brand: item.brand,
              pricePaid: pricePaid || undefined,
              notes: item.notes,
              imageUrl: item.imageUrl,
            });
            Alert.alert('Agregado', `"${item.name}" ha sido agregado a tu Cava`);
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const renderSearchResult = ({ item }: { item: PerfumeSearchResult }) => (
    <View className="bg-dark-charcoal rounded-xl p-4 mb-3 mx-4 border border-dark-border">
      <View className="flex-row">
        <View className="w-16 h-16 bg-dark-gray rounded-lg items-center justify-center">
          <Ionicons name="water" size={28} color="#D4AF37" />
        </View>

        <View className="flex-1 ml-4">
          <Text className="text-white font-semibold text-base" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-text-muted text-sm" numberOfLines={1}>
            {item.brand}
          </Text>

          {item.notes && item.notes.length > 0 && (
            <View className="flex-row flex-wrap mt-2 gap-1">
              {item.notes.slice(0, 3).map((note, index) => (
                <View key={index} className="bg-dark-gray px-2 py-0.5 rounded-full">
                  <Text className="text-text-secondary text-xs">{note}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View className="flex-row mt-4 gap-2">
        <TouchableOpacity
          onPress={() => handleAddToCollection(item)}
          className="flex-1 bg-luxe-gold/20 border border-luxe-gold/30 py-2.5 rounded-lg flex-row items-center justify-center"
        >
          <Ionicons name="add-circle-outline" size={18} color="#D4AF37" />
          <Text className="text-luxe-gold font-semibold ml-2">Agregar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addToFavorites(item)}
          className="w-12 bg-dark-gray border border-dark-border rounded-lg items-center justify-center"
        >
          <Ionicons name="heart-outline" size={20} color="#E5E4E2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCatalogItem = ({ item }: { item: (typeof PERFUME_CATALOG)[0] }) => (
    <TouchableOpacity
      onPress={() => {
        setSearchQuery(item.name);
        handleSearch();
      }}
      className="bg-dark-charcoal rounded-xl p-4 mb-3 mx-4 border border-dark-border"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-dark-gray rounded-lg items-center justify-center">
          <Ionicons name="water" size={20} color="#D4AF37" />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-white font-semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-text-muted text-sm">{item.brand}</Text>
        </View>
        <View className="bg-luxe-gold/10 px-2 py-1 rounded-full">
          <Text className="text-luxe-gold text-xs font-medium">
            €{item.avgPrice.toFixed(0)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="px-4 pb-4">
      {/* Search Bar */}
      <View className="flex-row items-center bg-dark-charcoal rounded-xl px-4 py-3 border border-dark-border">
        <Ionicons name="search" size={20} color="#808080" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholder="Buscar perfumes, marcas, notas..."
          placeholderTextColor="#808080"
          className="flex-1 ml-3 text-white text-base"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setShowCatalog(true);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#808080" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleSearch}
          className="ml-3 bg-luxe-gold/20 p-2 rounded-lg"
          disabled={searchQuery.trim().length < 2}
        >
          <Ionicons
            name="arrow-forward"
            size={18}
            color={searchQuery.trim().length < 2 ? '#808080' : '#D4AF37'}
          />
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      {recentSearches.length > 0 && showCatalog && (
        <View className="mt-4">
          <Text className="text-text-secondary text-sm mb-2">
            BÚSQUEDAS RECIENTES
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {recentSearches.slice(0, 5).map((term, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSearchQuery(term);
                  handleSearch();
                }}
                className="bg-dark-charcoal px-3 py-1.5 rounded-full border border-dark-border"
              >
                <Text className="text-text-secondary text-sm">{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Section Title */}
      <View className="flex-row items-center justify-between mt-6 mb-2">
        <Text className="text-text-secondary text-sm tracking-wide">
          {showCatalog ? 'CATÁLOGO (60 PERFUMES)' : `RESULTADOS (${searchResults.length})`}
        </Text>
        {!showCatalog && (
          <TouchableOpacity onPress={() => setShowCatalog(true)}>
            <Text className="text-luxe-gold text-sm">Ver catálogo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-oled-black">
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-luxe-gold text-3xl font-bold tracking-wider">
          Bibliothèque
        </Text>
        <Text className="text-text-secondary text-sm mt-1">
          Descubre y agrega perfumes a tu colección
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#D4AF37" size="large" />
          <Text className="text-text-secondary mt-4">Buscando perfumes...</Text>
        </View>
      ) : (
        <FlatList
          data={showCatalog ? PERFUME_CATALOG : searchResults}
          renderItem={showCatalog ? renderCatalogItem : renderSearchResult}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !showCatalog ? (
              <View className="items-center justify-center px-8 pt-10">
                <Ionicons name="search-outline" size={48} color="#808080" />
                <Text className="text-text-secondary mt-4 text-center">
                  No se encontraron resultados para "{searchQuery}"
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
