// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Héritage (History Screen)
// Expo Router v4 - Layering history and audit records
// ============================================================================

import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { es } from 'date-fns/locale';

import { useAudit6Pilars } from '@hooks/useAudit6Pilars';
import type { Audit6Pilars } from '@types/index';

type GroupedAudits = {
  title: string;
  data: Audit6Pilars[];
};

export default function HeritageScreen() {
  const { auditHistory, loading } = useAudit6Pilars();

  const groupedHistory = useMemo(() => {
    if (!auditHistory.length) return [];

    const groups: Record<string, Audit6Pilars[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    auditHistory.forEach((audit) => {
      const date = new Date(audit.createdAt);
      if (isToday(date)) {
        groups.today.push(audit);
      } else if (isYesterday(date)) {
        groups.yesterday.push(audit);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(audit);
      } else {
        groups.older.push(audit);
      }
    });

    const result: GroupedAudits[] = [];
    if (groups.today.length) result.push({ title: 'Hoy', data: groups.today });
    if (groups.yesterday.length)
      result.push({ title: 'Ayer', data: groups.yesterday });
    if (groups.thisWeek.length)
      result.push({ title: 'Esta semana', data: groups.thisWeek });
    if (groups.older.length)
      result.push({ title: 'Anteriores', data: groups.older });

    return result;
  }, [auditHistory]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success/20';
    if (score >= 60) return 'bg-warning/20';
    return 'bg-error/20';
  };

  const renderAuditItem = ({ item }: { item: Audit6Pilars }) => (
    <TouchableOpacity
      className="bg-dark-charcoal rounded-xl p-4 mb-3 mx-4 border border-dark-border"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 bg-luxe-gold/10 rounded-full items-center justify-center">
              <Ionicons name="layers" size={20} color="#D4AF37" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-white font-semibold" numberOfLines={1}>
                {item.pillar1?.strategyName || 'Layering'}
              </Text>
              <Text className="text-text-muted text-xs">
                {format(new Date(item.createdAt), "HH:mm 'h'", { locale: es })}
              </Text>
            </View>
          </View>

          {/* Perfumes used */}
          {item.pillar2?.assets && (
            <View className="flex-row flex-wrap gap-1 mb-3">
              {item.pillar2.assets.slice(0, 3).map((asset, index) => (
                <View
                  key={index}
                  className="bg-dark-gray px-2 py-1 rounded-full"
                >
                  <Text className="text-text-secondary text-xs">
                    {asset.name}
                  </Text>
                </View>
              ))}
              {item.pillar2.assets.length > 3 && (
                <View className="bg-dark-gray px-2 py-1 rounded-full">
                  <Text className="text-text-muted text-xs">
                    +{item.pillar2.assets.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Fiscal Summary */}
          {item.pillar3 && (
            <View className="flex-row items-center gap-3">
              <View>
                <Text className="text-text-muted text-xs">Costo</Text>
                <Text className="text-white font-medium">
                  €{item.pillar3.totalRealCost.toFixed(2)}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#808080" />
              <View>
                <Text className="text-text-muted text-xs">Ahorro</Text>
                <Text className="text-success font-medium">
                  €{item.pillar3.fiscalSavings.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Score Badge */}
        <View
          className={`${getScoreBgColor(item.auditScore || 0)} px-3 py-2 rounded-lg items-center`}
        >
          <Text className={`${getScoreColor(item.auditScore || 0)} text-2xl font-bold`}>
            {item.auditScore || 0}
          </Text>
          <Text className="text-text-muted text-xs">/100</Text>
        </View>
      </View>

      {/* 6 Pillars Summary */}
      <View className="flex-row mt-4 pt-3 border-t border-dark-border">
        {[1, 2, 3, 4, 5, 6].map((pillar) => {
          const isComplete = Boolean(
            item[`pillar${pillar}` as keyof Audit6Pilars]
          );
          return (
            <View key={pillar} className="flex-1 items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isComplete ? 'bg-luxe-gold/20' : 'bg-dark-gray'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isComplete ? 'text-luxe-gold' : 'text-text-muted'
                  }`}
                >
                  P{pillar}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: GroupedAudits }) => (
    <View className="px-4 py-2 bg-oled-black">
      <Text className="text-text-secondary text-sm tracking-wide">
        {section.title.toUpperCase()}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8 pt-20">
      <View className="w-24 h-24 bg-dark-charcoal rounded-full items-center justify-center mb-6">
        <Ionicons name="time-outline" size={48} color="#808080" />
      </View>
      <Text className="text-white text-xl font-semibold text-center mb-2">
        Sin historial
      </Text>
      <Text className="text-text-secondary text-center">
        Tus auditorías de layering aparecerán aquí. Comienza creando tu primera
        combinación en L'Atelier.
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-oled-black">
      {/* Header */}
      <View className="px-6 pt-4 pb-4">
        <Text className="text-luxe-gold text-3xl font-bold tracking-wider">
          Héritage
        </Text>
        <Text className="text-text-secondary text-sm mt-1">
          Historial de auditorías y layerings
        </Text>
      </View>

      {/* Stats Summary */}
      {auditHistory.length > 0 && (
        <View className="flex-row mx-4 mb-4 gap-3">
          <View className="flex-1 bg-dark-charcoal rounded-xl p-4 border border-dark-border">
            <Text className="text-text-muted text-xs">Total auditorías</Text>
            <Text className="text-white text-2xl font-bold">
              {auditHistory.length}
            </Text>
          </View>
          <View className="flex-1 bg-dark-charcoal rounded-xl p-4 border border-dark-border">
            <Text className="text-text-muted text-xs">Score promedio</Text>
            <Text className="text-luxe-gold text-2xl font-bold">
              {Math.round(
                auditHistory.reduce((sum, a) => sum + (a.auditScore || 0), 0) /
                  auditHistory.length
              )}
            </Text>
          </View>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#D4AF37" size="large" />
        </View>
      ) : auditHistory.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={groupedHistory}
          renderItem={({ item: group }) => (
            <>
              {renderSectionHeader({ section: group })}
              {group.data.map((audit) => (
                <View key={audit.id}>
                  {renderAuditItem({ item: audit })}
                </View>
              ))}
            </>
          )}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
