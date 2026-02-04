// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Inventory Context
// Full CRUD with Firebase real-time sync
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { InventoryContextType, InventoryItem } from '../types';
import { firebaseService } from '../services/FirebaseService';
import { useAuthContext } from './AuthContext';
import { generateId, calculateCostPerMl } from '../utils/helpers';

const InventoryContext = createContext<InventoryContextType>({
  items: [],
  isLoading: true,
  error: null,
  addItem: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},
  getItemById: () => undefined,
  toggleFavorite: async () => {},
  refreshInventory: async () => {},
});

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state: authState } = useAuthContext();

  // Real-time Firebase listener
  useEffect(() => {
    if (!authState.user?.uid) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = firebaseService.onInventoryChange(
      authState.user.uid,
      (updatedItems: InventoryItem[]) => {
        setItems(updatedItems);
        setIsLoading(false);
        setError(null);
      },
    );

    return unsubscribe;
  }, [authState.user?.uid]);

  const addItem = useCallback(
    async (itemData: Omit<InventoryItem, 'id' | 'userId' | 'addedAt' | 'updatedAt'>) => {
      if (!authState.user?.uid) throw new Error('Non authentifie');
      try {
        setError(null);
        const now = new Date().toISOString();
        const newItem: InventoryItem = {
          ...itemData,
          id: generateId(),
          userId: authState.user.uid,
          costPerMlEUR: calculateCostPerMl(itemData.purchasePriceEUR, itemData.mlTotal),
          addedAt: now,
          updatedAt: now,
        };
        await firebaseService.saveInventoryItem(authState.user.uid, newItem);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur ajout inventaire');
        throw err;
      }
    },
    [authState.user?.uid],
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<InventoryItem>) => {
      if (!authState.user?.uid) throw new Error('Non authentifie');
      try {
        setError(null);
        const enrichedUpdates = { ...updates };
        if (updates.purchasePriceEUR !== undefined || updates.mlTotal !== undefined) {
          const current = items.find((i) => i.id === id);
          const price = updates.purchasePriceEUR ?? current?.purchasePriceEUR ?? 0;
          const ml = updates.mlTotal ?? current?.mlTotal ?? 1;
          enrichedUpdates.costPerMlEUR = calculateCostPerMl(price, ml);
        }
        await firebaseService.updateInventoryItem(authState.user.uid, id, enrichedUpdates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur mise a jour');
        throw err;
      }
    },
    [authState.user?.uid, items],
  );

  const deleteItem = useCallback(
    async (id: string) => {
      if (!authState.user?.uid) throw new Error('Non authentifie');
      try {
        setError(null);
        await firebaseService.deleteInventoryItem(authState.user.uid, id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur suppression');
        throw err;
      }
    },
    [authState.user?.uid],
  );

  const getItemById = useCallback(
    (id: string): InventoryItem | undefined => {
      return items.find((item) => item.id === id);
    },
    [items],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        await updateItem(id, { isFavorite: !item.isFavorite });
      }
    },
    [items, updateItem],
  );

  const refreshInventory = useCallback(async () => {
    if (!authState.user?.uid) return;
    try {
      setIsLoading(true);
      const allItems = await firebaseService.getAllInventoryItems(authState.user.uid);
      setItems(allItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement inventaire');
    } finally {
      setIsLoading(false);
    }
  }, [authState.user?.uid]);

  return (
    <InventoryContext.Provider
      value={{ items, isLoading, error, addItem, updateItem, deleteItem, getItemById, toggleFavorite, refreshInventory }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventoryContext must be used within InventoryProvider');
  }
  return context;
}

export default InventoryContext;
