// ============================================================================
// L'ESSENCE DU LUXE v2.0 - L'Atelier (Home Screen)
// Expo Router v4 - Main perfume layering workshop
// ============================================================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useInventory } from '@hooks/useInventory';
import { useAudit6Pilars } from '@hooks/useAudit6Pilars';
import { calculateFiscalSavings } from '@utils/helpers';

export default function AtelierScreen() {
  const { inventory, loading: inventoryLoading } = useInventory();
  const { performAudit, loading: auditLoading, lastAudit } = useAudit6Pilars();

  const fiscalSummary = useMemo(() => {
    if (!inventory.length) return null;

    const totalCost = inventory.reduce((sum, p) => sum + (p.pricePaid || 0), 0);
    const estimatedNicheValue = inventory.reduce(
      (sum, p) => sum + (p.nichePriceEquivalent || p.pricePaid * 3),
      0
    );
    const savings = estimatedNicheValue - totalCost;
    const savingsPercent = totalCost > 0 ? (savings / estimatedNicheValue) * 100 : 0;

    return {
      totalCost,
      estimatedNicheValue,
      savings,
      savingsPercent,
    };
  }, [inventory]);

  const handleStartLayering = () => {
    if (inventory.length >= 2) {
      performAudit(inventory.slice(0, 2));
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
            L'Atelier
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            Votre laboratoire de layering parfumé
          </Text>
        </View>

        {/* Fiscal Summary Card */}
        {fiscalSummary && (
          <View className="mx-4 mb-6">
            <LinearGradient
              colors={['#1A1A1A', '#0D0D0D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-5 border border-luxe-gold/20"
            >
              <View className="flex-row items-center mb-4">
                <Ionicons name="analytics" size={20} color="#D4AF37" />
                <Text className="text-luxe-gold text-sm font-semibold ml-2 tracking-wide">
                  MOTOR FISCAL
                </Text>
              </View>

              <View className="flex-row justify-between mb-4">
                <View>
                  <Text className="text-text-muted text-xs">Coût réel</Text>
                  <Text className="text-white text-xl font-bold">
                    €{fiscalSummary.totalCost.toFixed(2)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-text-muted text-xs">Valeur niche</Text>
                  <Text className="text-luxe-platinum text-xl font-bold">
                    €{fiscalSummary.estimatedNicheValue.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="bg-dark-charcoal rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-text-secondary text-sm">
                    Ahorro Fiscal
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-success text-2xl font-bold">
                      €{fiscalSummary.savings.toFixed(2)}
                    </Text>
                    <View className="bg-success/20 rounded-full px-2 py-1 ml-2">
                      <Text className="text-success text-xs font-semibold">
                        {fiscalSummary.savingsPercent.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-text-secondary text-sm mb-3 tracking-wide">
            ACCIONES RÁPIDAS
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleStartLayering}
              disabled={inventory.length < 2 || auditLoading}
              className="flex-1 bg-luxe-gold/10 border border-luxe-gold/30 rounded-xl p-4"
              activeOpacity={0.7}
            >
              <Ionicons name="layers" size={24} color="#D4AF37" />
              <Text className="text-luxe-gold font-semibold mt-2">
                Nuevo Layering
              </Text>
              <Text className="text-text-muted text-xs mt-1">
                Auditoría 6 Pilares
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/lenez')}
              className="flex-1 bg-dark-gray border border-dark-border rounded-xl p-4"
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={24} color="#E5E4E2" />
              <Text className="text-luxe-platinum font-semibold mt-2">
                Escanear
              </Text>
              <Text className="text-text-muted text-xs mt-1">
                Detectar perfume
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inventory Preview */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-secondary text-sm tracking-wide">
              MI COLECCIÓN
            </Text>
            <TouchableOpacity onPress={() => router.push('/cava')}>
              <Text className="text-luxe-gold text-sm">Ver todo →</Text>
            </TouchableOpacity>
          </View>

          {inventoryLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator color="#D4AF37" size="large" />
            </View>
          ) : inventory.length === 0 ? (
            <View className="bg-dark-charcoal rounded-xl p-6 items-center">
              <Ionicons name="flask-outline" size={48} color="#808080" />
              <Text className="text-text-secondary mt-3 text-center">
                Tu colección está vacía
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/bibliotheque')}
                className="mt-4 bg-luxe-gold/20 px-4 py-2 rounded-full"
              >
                <Text className="text-luxe-gold font-semibold">
                  Explorar Bibliothèque
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {inventory.slice(0, 5).map((perfume) => (
                <TouchableOpacity
                  key={perfume.id}
                  onPress={() => router.push(`/perfume/${perfume.id}`)}
                  className="bg-dark-charcoal rounded-xl p-4 mr-3 w-36"
                  activeOpacity={0.7}
                >
                  <View className="w-16 h-16 bg-dark-gray rounded-lg mb-3 items-center justify-center">
                    <Ionicons name="water" size={24} color="#D4AF37" />
                  </View>
                  <Text
                    className="text-white font-semibold text-sm"
                    numberOfLines={1}
                  >
                    {perfume.name}
                  </Text>
                  <Text className="text-text-muted text-xs" numberOfLines={1}>
                    {perfume.brand}
                  </Text>
                  <Text className="text-luxe-gold text-xs mt-1">
                    €{perfume.pricePaid?.toFixed(2) || '—'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Last Audit Summary */}
        {lastAudit && (
          <View className="px-4 mt-6">
            <Text className="text-text-secondary text-sm mb-3 tracking-wide">
              ÚLTIMA AUDITORÍA
            </Text>
            <View className="bg-dark-charcoal rounded-xl p-4 border border-dark-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-success/20 rounded-full items-center justify-center">
                    <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-white font-semibold">
                      {lastAudit.perfumes?.join(' + ') || 'Layering'}
                    </Text>
                    <Text className="text-text-muted text-xs">
                      Score: {lastAudit.score || 85}/100
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons name="chevron-forward" size={20} color="#808080" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
