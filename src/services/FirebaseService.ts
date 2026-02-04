// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Firebase Realtime Database Service
// CRUD Operations for all entities
// Uses shared Firebase config - NO duplicate initialization
// ============================================================================

import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  Database,
  DataSnapshot,
  Unsubscribe,
} from 'firebase/database';
import { InventoryItem, Layering, Audit6Pilars, AuthUser } from '../types';
import { getFirebaseApp } from './firebaseConfig';

const LOG_TAG = '[FirebaseService]';

class FirebaseService {
  private db: Database;

  constructor() {
    this.db = getDatabase(getFirebaseApp());
  }

  // ─── User Profile ─────────────────────────────────────────────────────────

  async saveUserProfile(userId: string, profile: AuthUser): Promise<void> {
    try {
      await set(ref(this.db, `users/${userId}/profile`), profile);
      console.log(LOG_TAG, 'User profile saved:', userId);
    } catch (error) {
      console.error(LOG_TAG, 'Error saving profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const snapshot = await get(ref(this.db, `users/${userId}/profile`));
      return snapshot.exists() ? (snapshot.val() as AuthUser) : null;
    } catch (error) {
      console.error(LOG_TAG, 'Error getting profile:', error);
      return null;
    }
  }

  // ─── Inventory CRUD ───────────────────────────────────────────────────────

  async saveInventoryItem(userId: string, item: InventoryItem): Promise<string> {
    try {
      const itemRef = ref(this.db, `inventories/${userId}/items/${item.id}`);
      await set(itemRef, item);
      console.log(LOG_TAG, 'Inventory item saved:', item.id);
      return item.id;
    } catch (error) {
      console.error(LOG_TAG, 'Error saving inventory item:', error);
      throw error;
    }
  }

  async getInventoryItem(userId: string, itemId: string): Promise<InventoryItem | null> {
    try {
      const snapshot = await get(ref(this.db, `inventories/${userId}/items/${itemId}`));
      return snapshot.exists() ? (snapshot.val() as InventoryItem) : null;
    } catch (error) {
      console.error(LOG_TAG, 'Error getting inventory item:', error);
      return null;
    }
  }

  async getAllInventoryItems(userId: string): Promise<InventoryItem[]> {
    try {
      const snapshot = await get(ref(this.db, `inventories/${userId}/items`));
      if (!snapshot.exists()) return [];
      const data = snapshot.val();
      return Object.values(data) as InventoryItem[];
    } catch (error) {
      console.error(LOG_TAG, 'Error getting all inventory:', error);
      return [];
    }
  }

  async updateInventoryItem(
    userId: string,
    itemId: string,
    updates: Partial<InventoryItem>,
  ): Promise<void> {
    try {
      const itemRef = ref(this.db, `inventories/${userId}/items/${itemId}`);
      await update(itemRef, { ...updates, updatedAt: new Date().toISOString() });
      console.log(LOG_TAG, 'Inventory item updated:', itemId);
    } catch (error) {
      console.error(LOG_TAG, 'Error updating inventory item:', error);
      throw error;
    }
  }

  async deleteInventoryItem(userId: string, itemId: string): Promise<void> {
    try {
      await remove(ref(this.db, `inventories/${userId}/items/${itemId}`));
      console.log(LOG_TAG, 'Inventory item deleted:', itemId);
    } catch (error) {
      console.error(LOG_TAG, 'Error deleting inventory item:', error);
      throw error;
    }
  }

  onInventoryChange(userId: string, callback: (items: InventoryItem[]) => void): Unsubscribe {
    const itemsRef = ref(this.db, `inventories/${userId}/items`);
    return onValue(
      itemsRef,
      (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          callback([]);
          return;
        }
        callback(Object.values(snapshot.val()) as InventoryItem[]);
      },
      (error) => {
        console.error(LOG_TAG, 'Inventory listener error:', error);
        callback([]);
      },
    );
  }

  // ─── Layerings CRUD ──────────────────────────────────────────────────────

  async saveLayering(userId: string, layering: Layering): Promise<string> {
    try {
      const layeringRef = ref(this.db, `layerings/${userId}/items/${layering.id}`);
      await set(layeringRef, layering);
      console.log(LOG_TAG, 'Layering saved:', layering.id);
      return layering.id;
    } catch (error) {
      console.error(LOG_TAG, 'Error saving layering:', error);
      throw error;
    }
  }

  async getAllLayerings(userId: string): Promise<Layering[]> {
    try {
      const snapshot = await get(ref(this.db, `layerings/${userId}/items`));
      if (!snapshot.exists()) return [];
      return Object.values(snapshot.val()) as Layering[];
    } catch (error) {
      console.error(LOG_TAG, 'Error getting layerings:', error);
      return [];
    }
  }

  async deleteLayering(userId: string, layeringId: string): Promise<void> {
    try {
      await remove(ref(this.db, `layerings/${userId}/items/${layeringId}`));
      console.log(LOG_TAG, 'Layering deleted:', layeringId);
    } catch (error) {
      console.error(LOG_TAG, 'Error deleting layering:', error);
      throw error;
    }
  }

  // ─── Audits CRUD ─────────────────────────────────────────────────────────

  async saveAudit(userId: string, audit: Audit6Pilars): Promise<string> {
    try {
      const auditRef = ref(this.db, `audits/${userId}/items/${audit.id}`);
      await set(auditRef, audit);
      console.log(LOG_TAG, 'Audit saved:', audit.id);
      return audit.id;
    } catch (error) {
      console.error(LOG_TAG, 'Error saving audit:', error);
      throw error;
    }
  }

  async getAudit(userId: string, auditId: string): Promise<Audit6Pilars | null> {
    try {
      const snapshot = await get(ref(this.db, `audits/${userId}/items/${auditId}`));
      return snapshot.exists() ? (snapshot.val() as Audit6Pilars) : null;
    } catch (error) {
      console.error(LOG_TAG, 'Error getting audit:', error);
      return null;
    }
  }

  async getAllAudits(userId: string): Promise<Audit6Pilars[]> {
    try {
      const snapshot = await get(ref(this.db, `audits/${userId}/items`));
      if (!snapshot.exists()) return [];
      return Object.values(snapshot.val()) as Audit6Pilars[];
    } catch (error) {
      console.error(LOG_TAG, 'Error getting audits:', error);
      return [];
    }
  }

  // ─── Search History ───────────────────────────────────────────────────────

  async saveRecentSearch(userId: string, searchQuery: string): Promise<void> {
    try {
      const searchRef = push(ref(this.db, `searches/${userId}/recent`));
      await set(searchRef, { query: searchQuery, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error(LOG_TAG, 'Error saving search:', error);
    }
  }

  async getRecentSearches(userId: string): Promise<string[]> {
    try {
      const snapshot = await get(ref(this.db, `searches/${userId}/recent`));
      if (!snapshot.exists()) return [];
      const data = snapshot.val();
      const entries = Object.values(data) as Array<{ query: string; timestamp: string }>;
      return entries
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20)
        .map((e) => e.query);
    } catch (error) {
      console.error(LOG_TAG, 'Error getting searches:', error);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();
export default FirebaseService;
