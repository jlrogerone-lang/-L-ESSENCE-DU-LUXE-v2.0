// ============================================================================
// L'ESSENCE DU LUXE v2.0 - useInventory Hook
// Inventory operations with filtering, sorting, and stats
// ============================================================================

import { useCallback, useMemo } from 'react';
import { InventoryItem } from '../types';
import { useInventoryContext } from '../contexts/InventoryContext';
import {
  filterByBrand,
  filterByFamily,
  filterBySeason,
  filterByTimeOfDay,
  filterByPriceRange,
  sortByPrice,
  sortAlphabetically,
  sortByLongevity,
  groupBy,
} from '../utils/helpers';

export function useInventory() {
  const context = useInventoryContext();

  const favorites = useMemo(
    () => context.items.filter((item) => item.isFavorite),
    [context.items],
  );

  const getByBrand = useCallback(
    (brand: string): InventoryItem[] => filterByBrand(context.items, brand),
    [context.items],
  );

  const getByFamily = useCallback(
    (family: string): InventoryItem[] => filterByFamily(context.items, family),
    [context.items],
  );

  const getBySeason = useCallback(
    (season: string): InventoryItem[] => filterBySeason(context.items, season),
    [context.items],
  );

  const getByTimeOfDay = useCallback(
    (time: 'day' | 'night' | 'versatile'): InventoryItem[] =>
      filterByTimeOfDay(context.items, time),
    [context.items],
  );

  const getByPriceRange = useCallback(
    (min: number, max: number): InventoryItem[] =>
      filterByPriceRange(context.items, min, max),
    [context.items],
  );

  const searchItems = useCallback(
    (query: string): InventoryItem[] => {
      const q = query.toLowerCase();
      return context.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.family.toLowerCase().includes(q),
      );
    },
    [context.items],
  );

  const sortedByPrice = useCallback(
    (ascending: boolean = true) => sortByPrice(context.items, ascending),
    [context.items],
  );

  const sortedAlphabetically = useCallback(
    (ascending: boolean = true) => sortAlphabetically(context.items, ascending),
    [context.items],
  );

  const sortedByLongevity = useCallback(
    (ascending: boolean = false) => sortByLongevity(context.items, ascending),
    [context.items],
  );

  const groupedByBrand = useMemo(
    () => groupBy(context.items, 'brand'),
    [context.items],
  );

  const groupedByFamily = useMemo(
    () => groupBy(context.items, 'family'),
    [context.items],
  );

  const stats = useMemo(() => {
    const items = context.items;
    const totalValue = items.reduce((sum, i) => sum + i.retailPriceEUR, 0);
    const totalPurchaseCost = items.reduce((sum, i) => sum + i.purchasePriceEUR, 0);
    const avgLongevity = items.length > 0
      ? items.reduce((sum, i) => sum + i.longevityHours, 0) / items.length
      : 0;
    const avgSillage = items.length > 0
      ? items.reduce((sum, i) => sum + i.sillage, 0) / items.length
      : 0;
    const brands = [...new Set(items.map((i) => i.brand))];

    return {
      totalItems: items.length,
      totalRetailValueEUR: Math.round(totalValue * 100) / 100,
      totalPurchaseCostEUR: Math.round(totalPurchaseCost * 100) / 100,
      totalSavingsEUR: Math.round((totalValue - totalPurchaseCost) * 100) / 100,
      averageLongevityHours: Math.round(avgLongevity * 10) / 10,
      averageSillage: Math.round(avgSillage * 10) / 10,
      totalBrands: brands.length,
      brandsList: brands,
      favoritesCount: favorites.length,
    };
  }, [context.items, favorites]);

  return {
    ...context,
    favorites,
    getByBrand,
    getByFamily,
    getBySeason,
    getByTimeOfDay,
    getByPriceRange,
    searchItems,
    sortedByPrice,
    sortedAlphabetically,
    sortedByLongevity,
    groupedByBrand,
    groupedByFamily,
    stats,
  };
}

export default useInventory;
