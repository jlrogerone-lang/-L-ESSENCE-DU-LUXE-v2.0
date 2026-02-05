// ============================================================================
// L'ESSENCE DU LUXE v2.0 - La Cava (Inventory Screen)
// Expo Router v4 - Personal perfume collection
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useInventory } from '@hooks/useInventory';
import type { PerfumeEntry } from '@types/index';

type SortOption = 'name' | 'brand' | 'price' | 'date';

export default function CavaScreen() {
  const { inventory, loading, removePerfume } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result = [...inventory];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.notes?.some((n) => n.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'brand':
          comparison = a.brand.localeCompare(b.brand);
          break;
        case 'price':
          comparison = (a.pricePaid || 0) - (b.pricePaid || 0);
          break;
        case 'date':
        default:
          comparison =
            new Date(b.addedAt || 0).getTime() -
            new Date(a.addedAt || 0).getTime();
      }
      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [inventory, searchQuery, sortBy, sortAsc]);

  const handleDelete = (perfume: PerfumeEntry) => {
    Alert.alert(
      'Eliminar Perfume',
      `¿Estás seguro de que quieres eliminar "${perfume.name}" de tu colección?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removePerfume(perfume.id),
        },
      ]
    );
  };

  const renderPerfumeItem = ({ item }: { item: PerfumeEntry }) => (
    <TouchableOpacity
      onPress={() => router.push(`/perfume/${item.id}`)}
      className="bg-dark-charcoal rounded-xl p-4 mb-3 mx-4 border border-dark-border"
      activeOpacity={0.7}
    >
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

          <View className="flex-row items-center mt-2">
            {item.pricePaid && (
              <View className="bg-luxe-gold/10 px-2 py-1 rounded-full mr-2">
                <Text className="text-luxe-gold text-xs font-medium">
                  €{item.pricePaid.toFixed(2)}
                </Text>
              </View>
            )}
            {item.volumeMl && (
              <View className="bg-dark-gray px-2 py-1 rounded-full">
                <Text className="text-text-secondary text-xs">
                  {item.volumeMl}ml
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleDelete(item)}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      {item.notes && item.notes.length > 0 && (
        <View className="flex-row flex-wrap mt-3 gap-1">
          {item.notes.slice(0, 4).map((note, index) => (
            <View key={index} className="bg-dark-gray px-2 py-1 rounded-full">
              <Text className="text-text-secondary text-xs">{note}</Text>
            </View>
          ))}
          {item.notes.length > 4 && (
            <View className="bg-dark-gray px-2 py-1 rounded-full">
              <Text className="text-text-muted text-xs">
                +{item.notes.length - 4}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="px-4 pt-2 pb-4">
      {/* Search Bar */}
      <View className="flex-row items-center bg-dark-charcoal rounded-xl px-4 py-3 mb-4 border border-dark-border">
        <Ionicons name="search" size={20} color="#808080" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar en tu colección..."
          placeholderTextColor="#808080"
          className="flex-1 ml-3 text-white text-base"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#808080" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Options */}
      <View className="flex-row items-center justify-between">
        <Text className="text-text-secondary text-sm">
          {filteredAndSorted.length} perfumes
        </Text>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setSortAsc(!sortAsc)}
            className="p-2"
          >
            <Ionicons
              name={sortAsc ? 'arrow-up' : 'arrow-down'}
              size={18}
              color="#D4AF37"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const options: SortOption[] = ['date', 'name', 'brand', 'price'];
              const currentIndex = options.indexOf(sortBy);
              setSortBy(options[(currentIndex + 1) % options.length]);
            }}
            className="flex-row items-center bg-dark-charcoal px-3 py-2 rounded-lg ml-2"
          >
            <Ionicons name="funnel-outline" size={16} color="#D4AF37" />
            <Text className="text-luxe-gold text-sm ml-2 capitalize">
              {sortBy === 'date' ? 'Reciente' : sortBy}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8 pt-20">
      <View className="w-24 h-24 bg-dark-charcoal rounded-full items-center justify-center mb-6">
        <Ionicons name="wine-outline" size={48} color="#808080" />
      </View>
      <Text className="text-white text-xl font-semibold text-center mb-2">
        Tu Cava está vacía
      </Text>
      <Text className="text-text-secondary text-center mb-6">
        Comienza agregando perfumes desde la Bibliothèque Universelle o escaneando
        con Le Nez
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/bibliotheque')}
        className="bg-luxe-gold/20 border border-luxe-gold/30 px-6 py-3 rounded-full"
      >
        <Text className="text-luxe-gold font-semibold">
          Explorar Bibliothèque
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-oled-black">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-luxe-gold text-3xl font-bold tracking-wider">
          La Cava
        </Text>
        <Text className="text-text-secondary text-sm mt-1">
          Tu colección personal de fragancias
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#D4AF37" size="large" />
        </View>
      ) : inventory.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredAndSorted}
          renderItem={renderPerfumeItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB - Add Perfume */}
      <TouchableOpacity
        onPress={() => router.push('/bibliotheque')}
        className="absolute bottom-24 right-6 w-14 h-14 bg-luxe-gold rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#000000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
