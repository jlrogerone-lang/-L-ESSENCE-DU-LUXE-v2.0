// ============================================================================
// L'ESSENCE DU LUXE v2.0 - useBibliotheque Hook
// Search, favorites, and recent searches management
// ============================================================================

import { useCallback, useMemo } from 'react';
import { BibliothequeSearchResult } from '../types';
import { useBibliothequeContext } from '../contexts/BibliothequeContext';
import { bibliothequeService } from '../services/BibliothequeService';

export function useBibliotheque() {
  const context = useBibliothequeContext();

  const searchPerfumes = useCallback(
    async (query: string) => {
      await context.search(query);
    },
    [context.search],
  );

  const getPerfumeDetails = useCallback(
    async (name: string, brand: string) => {
      return await bibliothequeService.getPerfumeDetails(name, brand);
    },
    [],
  );

  const addToFavorites = useCallback(
    async (result: BibliothequeSearchResult) => {
      await context.addFavorite(result);
    },
    [context.addFavorite],
  );

  const removeFromFavorites = useCallback(
    async (id: string) => {
      await context.removeFavorite(id);
    },
    [context.removeFavorite],
  );

  const isFavorite = useCallback(
    (resultId: string): boolean => {
      return context.favorites.some((f) => f.id === resultId);
    },
    [context.favorites],
  );

  const searchFavorites = useCallback(
    (query: string): BibliothequeSearchResult[] => {
      const q = query.toLowerCase();
      return context.favorites.filter(
        (f) =>
          f.perfumeName.toLowerCase().includes(q) ||
          f.brand.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q),
      );
    },
    [context.favorites],
  );

  const clearHistory = useCallback(async () => {
    await bibliothequeService.clearRecentSearches();
  }, []);

  const clearSearchCache = useCallback(() => {
    bibliothequeService.clearCache();
    context.clearSearch();
  }, [context.clearSearch]);

  const hasResults = useMemo(
    () => context.searchResults.length > 0,
    [context.searchResults],
  );

  return {
    ...context,
    searchPerfumes,
    getPerfumeDetails,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    searchFavorites,
    clearHistory,
    clearSearchCache,
    hasResults,
  };
}

export default useBibliotheque;
