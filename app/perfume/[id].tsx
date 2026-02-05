// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Perfume Detail Modal
// Expo Router v4 - Individual perfume view with 6 Pillars audit
// ============================================================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useInventory } from '@hooks/useInventory';
import { useAudit6Pilars } from '@hooks/useAudit6Pilars';
import { calculateFiscalSavings, estimateNichePriceEquivalent } from '@utils/helpers';

export default function PerfumeDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { inventory, updatePerfume, removePerfume } = useInventory();
  const { performAudit, loading: auditLoading } = useAudit6Pilars();

  const perfume = useMemo(
    () => inventory.find((p) => p.id === id),
    [inventory, id]
  );

  if (!perfume) {
    return (
      <SafeAreaView className="flex-1 bg-oled-black items-center justify-center">
        <Ionicons name="alert-circle" size={48} color="#E74C3C" />
        <Text className="text-white text-lg mt-4">Perfume no encontrado</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-dark-charcoal px-4 py-2 rounded-lg"
        >
          <Text className="text-luxe-gold">Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const fiscalAnalysis = useMemo(() => {
    if (!perfume.pricePaid) return null;

    const assets = [
      {
        name: perfume.name,
        brand: perfume.brand,
        pricePaid: perfume.pricePaid,
        volumeMl: perfume.volumeMl || 100,
        concentration: perfume.concentration || 'EDP',
      },
    ];

    const nicheEquivalent = estimateNichePriceEquivalent(
      perfume.notes || [],
      perfume.longevityHours || 6,
      perfume.sillage || 'moderate'
    );

    return calculateFiscalSavings(assets, nicheEquivalent);
  }, [perfume]);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar perfume',
      `¿Estás seguro de que quieres eliminar "${perfume.name}" de tu colección?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removePerfume(perfume.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleAudit = () => {
    if (inventory.length < 2) {
      Alert.alert(
        'Necesitas más perfumes',
        'Agrega al menos 2 perfumes a tu colección para crear un layering'
      );
      return;
    }

    const otherPerfume = inventory.find((p) => p.id !== perfume.id);
    if (otherPerfume) {
      performAudit([perfume, otherPerfume]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-oled-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={24} color="#E5E4E2" />
        </TouchableOpacity>
        <Text className="text-white font-semibold">Detalle</Text>
        <TouchableOpacity onPress={handleDelete} className="p-2">
          <Ionicons name="trash-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#1A1A1A', '#0D0D0D']}
          className="mx-4 mt-4 rounded-2xl p-6 border border-luxe-gold/20"
        >
          <View className="items-center">
            <View className="w-24 h-24 bg-dark-gray rounded-2xl items-center justify-center mb-4">
              <Ionicons name="water" size={48} color="#D4AF37" />
            </View>
            <Text className="text-white text-2xl font-bold text-center">
              {perfume.name}
            </Text>
            <Text className="text-luxe-gold text-lg">{perfume.brand}</Text>

            {/* Quick Info */}
            <View className="flex-row mt-4 gap-3">
              {perfume.pricePaid && (
                <View className="bg-luxe-gold/10 px-3 py-1.5 rounded-full">
                  <Text className="text-luxe-gold font-medium">
                    €{perfume.pricePaid.toFixed(2)}
                  </Text>
                </View>
              )}
              {perfume.volumeMl && (
                <View className="bg-dark-gray px-3 py-1.5 rounded-full">
                  <Text className="text-text-secondary">
                    {perfume.volumeMl}ml
                  </Text>
                </View>
              )}
              {perfume.concentration && (
                <View className="bg-dark-gray px-3 py-1.5 rounded-full">
                  <Text className="text-text-secondary">
                    {perfume.concentration}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Fiscal Analysis Card */}
        {fiscalAnalysis && (
          <View className="mx-4 mt-4">
            <Text className="text-text-secondary text-sm mb-2 tracking-wide">
              ANÁLISIS FISCAL (PILAR 3)
            </Text>
            <View className="bg-dark-charcoal rounded-xl p-4 border border-dark-border">
              <View className="flex-row justify-between mb-3">
                <View>
                  <Text className="text-text-muted text-xs">Coste real</Text>
                  <Text className="text-white text-xl font-bold">
                    €{fiscalAnalysis.totalRealCost.toFixed(2)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-text-muted text-xs">
                    Equivalente niche
                  </Text>
                  <Text className="text-luxe-platinum text-xl font-bold">
                    €{fiscalAnalysis.nichePriceEquivalent.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="bg-success/10 rounded-lg p-3 flex-row items-center justify-between">
                <Text className="text-success font-semibold">Ahorro fiscal</Text>
                <View className="flex-row items-center">
                  <Text className="text-success text-2xl font-bold">
                    €{fiscalAnalysis.fiscalSavings.toFixed(2)}
                  </Text>
                  <View className="bg-success/20 rounded-full px-2 py-0.5 ml-2">
                    <Text className="text-success text-xs font-semibold">
                      {fiscalAnalysis.savingsPercentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Notes Section */}
        {perfume.notes && perfume.notes.length > 0 && (
          <View className="mx-4 mt-4">
            <Text className="text-text-secondary text-sm mb-2 tracking-wide">
              NOTAS OLFATIVAS
            </Text>
            <View className="bg-dark-charcoal rounded-xl p-4 border border-dark-border">
              <View className="flex-row flex-wrap gap-2">
                {perfume.notes.map((note, index) => (
                  <View
                    key={index}
                    className="bg-dark-gray px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-text-secondary">{note}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Performance Section */}
        <View className="mx-4 mt-4">
          <Text className="text-text-secondary text-sm mb-2 tracking-wide">
            RENDIMIENTO
          </Text>
          <View className="bg-dark-charcoal rounded-xl p-4 border border-dark-border">
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 items-center">
                <Ionicons name="time-outline" size={24} color="#D4AF37" />
                <Text className="text-white font-semibold mt-1">
                  {perfume.longevityHours || '6-8'}h
                </Text>
                <Text className="text-text-muted text-xs">Longevidad</Text>
              </View>
              <View className="flex-1 items-center">
                <Ionicons name="expand-outline" size={24} color="#D4AF37" />
                <Text className="text-white font-semibold mt-1 capitalize">
                  {perfume.sillage || 'Moderado'}
                </Text>
                <Text className="text-text-muted text-xs">Sillage</Text>
              </View>
              <View className="flex-1 items-center">
                <Ionicons name="pricetag-outline" size={24} color="#D4AF37" />
                <Text className="text-white font-semibold mt-1">
                  €{((perfume.pricePaid || 0) / (perfume.volumeMl || 100)).toFixed(2)}
                </Text>
                <Text className="text-text-muted text-xs">€/ml</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="mx-4 mt-6">
          <TouchableOpacity
            onPress={handleAudit}
            disabled={auditLoading}
            className="bg-luxe-gold py-4 rounded-xl items-center flex-row justify-center"
          >
            <Ionicons name="layers" size={20} color="#000000" />
            <Text className="text-black font-semibold ml-2">
              {auditLoading ? 'Analizando...' : 'Crear Layering (6 Pilares)'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
