// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Storage Service
// AsyncStorage + SecureStore wrapper
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const LOG_TAG = '[StorageService]';

class StorageService {
  // ─── Secure Storage (tokens, sensitive data) ──────────────────────────────

  async saveSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(LOG_TAG, `Error saving secure key "${key}":`, error);
      throw error;
    }
  }

  async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(LOG_TAG, `Error reading secure key "${key}":`, error);
      return null;
    }
  }

  async deleteSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(LOG_TAG, `Error deleting secure key "${key}":`, error);
    }
  }

  // ─── General Storage (cache, preferences) ─────────────────────────────────

  async save(key: string, value: unknown): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(LOG_TAG, `Error saving key "${key}":`, error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) return null;
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(LOG_TAG, `Error reading key "${key}":`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(LOG_TAG, `Error removing key "${key}":`, error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(LOG_TAG, 'Error clearing storage:', error);
    }
  }

  // ─── Cache with TTL ──────────────────────────────────────────────────────

  async saveWithTTL(key: string, value: unknown, ttlMs: number): Promise<void> {
    const cacheEntry = {
      data: value,
      expiresAt: Date.now() + ttlMs,
    };
    await this.save(key, cacheEntry);
  }

  async getWithTTL<T>(key: string): Promise<T | null> {
    const entry = await this.get<{ data: T; expiresAt: number }>(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      await this.remove(key);
      return null;
    }
    return entry.data;
  }
}

export const storageService = new StorageService();
export default StorageService;
