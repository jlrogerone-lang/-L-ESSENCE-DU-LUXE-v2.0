// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Bibliotheque Context
// Search, favorites, and cache state management
// ============================================================================

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { BibliothequeContextType, BibliothequeSearchResult, InventoryItem } from '../types';
import { bibliothequeService } from '../services/BibliothequeService';
import { useAuthContext } from './AuthContext';
import { useInventoryContext } from './InventoryContext';
import { generateId } from '../utils/helpers';

const BibliothequeContext = createContext<BibliothequeContextType>({
  searchResults: [],
  favorites: [],
  recentSearches: [],
  isLoading: false,
  error: null,
  search: async () => {},
  addFavorite: async () => {},
  removeFavorite: async () => {},
  addToInventory: async () => {},
  clearSearch: () => {},
});

export function BibliothequeProvider({ children }: { children: ReactNode }) {
  const [searchResults, setSearchResults] = useState<BibliothequeSearchResult[]>([]);
  const [favorites, setFavorites] = useState<BibliothequeSearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useInventoryContext();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [favs, recent] = await Promise.all([
      bibliothequeService.getFavorites(),
      bibliothequeService.getRecentSearches(),
    ]);
    setFavorites(favs);
    setRecentSearches(recent);
  };

  const search = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await bibliothequeService.searchPerfumes(query);
      setSearchResults(results);
      await bibliothequeService.saveRecentSearch(query);
      setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (result: BibliothequeSearchResult) => {
    await bibliothequeService.saveFavorite(result);
    setFavorites((prev) => {
      if (prev.find((f) => f.id === result.id)) return prev;
      return [...prev, result];
    });
  }, []);

  const removeFavorite = useCallback(async (id: string) => {
    await bibliothequeService.removeFavorite(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addToInventory = useCallback(
    async (result: BibliothequeSearchResult) => {
      const newItem: Omit<InventoryItem, 'id' | 'userId' | 'addedAt' | 'updatedAt'> = {
        name: result.perfumeName,
        brand: result.brand,
        concentration: (result.concentration as InventoryItem['concentration']) || 'EDP',
        category: result.family || 'Unknown',
        retailPriceEUR: result.retailPriceEUR || 0,
        purchasePriceEUR: 0,
        mlTotal: 100,
        mlRemaining: 100,
        costPerMlEUR: 0,
        notes: result.notes,
        family: result.family || 'Unknown',
        season: ['Spring', 'Summer', 'Autumn', 'Winter'],
        timeOfDay: 'versatile',
        longevityHours: 6,
        sillage: 4,
        isFavorite: false,
        imageUrl: result.thumbnail,
      };
      await addItem(newItem);
    },
    [addItem],
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return (
    <BibliothequeContext.Provider
      value={{
        searchResults,
        favorites,
        recentSearches,
        isLoading,
        error,
        search,
        addFavorite,
        removeFavorite,
        addToInventory,
        clearSearch,
      }}
    >
      {children}
    </BibliothequeContext.Provider>
  );
}

export function useBibliothequeContext(): BibliothequeContextType {
  const context = useContext(BibliothequeContext);
  if (!context) {
    throw new Error('useBibliothequeContext must be used within BibliothequeProvider');
  }
  return context;
}

export default BibliothequeContext;
