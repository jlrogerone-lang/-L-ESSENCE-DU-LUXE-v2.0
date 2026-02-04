// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Bibliotheque Service
// Google Custom Search API + Intelligent Cache
// ============================================================================

import axios from 'axios';
import { BibliothequeSearchResult } from '../types';
import { storageService } from './StorageService';
import { CACHE_TTL_MS } from '../utils/constants';
import { generateId } from '../utils/helpers';

const LOG_TAG = '[BibliothequeService]';

const SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';

interface GoogleSearchItem {
  title: string;
  snippet: string;
  link: string;
  pagemap?: {
    cse_thumbnail?: Array<{ src: string }>;
    metatags?: Array<Record<string, string>>;
  };
}

class BibliothequeService {
  private apiKey: string;
  private searchEngineId: string;
  private cache: Map<string, { data: BibliothequeSearchResult[]; expiresAt: number }> = new Map();

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_SEARCH_API_KEY || '';
    this.searchEngineId = process.env.EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID || '';
  }

  // ─── Search Perfumes ──────────────────────────────────────────────────────

  async searchPerfumes(query: string, page: number = 1): Promise<BibliothequeSearchResult[]> {
    try {
      const cacheKey = `biblio_${query}_${page}`;

      // Check memory cache
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        console.log(LOG_TAG, 'Returning cached results for:', query);
        return cached.data;
      }

      // Check persistent cache
      const persistentCache = await storageService.getWithTTL<BibliothequeSearchResult[]>(cacheKey);
      if (persistentCache) {
        this.cache.set(cacheKey, { data: persistentCache, expiresAt: Date.now() + CACHE_TTL_MS });
        return persistentCache;
      }

      console.log(LOG_TAG, 'Searching perfumes:', query, 'page:', page);

      const startIndex = (page - 1) * 10 + 1;
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          key: this.apiKey,
          cx: this.searchEngineId,
          q: `${query} perfume fragrance notes`,
          start: startIndex,
          num: 10,
        },
        timeout: 15000,
      });

      const items: GoogleSearchItem[] = response.data.items || [];
      const results: BibliothequeSearchResult[] = items.map((item) => this.mapSearchResult(item, query));

      // Save to cache
      this.cache.set(cacheKey, { data: results, expiresAt: Date.now() + CACHE_TTL_MS });
      await storageService.saveWithTTL(cacheKey, results, CACHE_TTL_MS);

      console.log(LOG_TAG, `Found ${results.length} results for:`, query);
      return results;
    } catch (error) {
      console.error(LOG_TAG, 'Search failed:', error);
      throw error;
    }
  }

  // ─── Get Perfume Details ──────────────────────────────────────────────────

  async getPerfumeDetails(perfumeName: string, brand: string): Promise<BibliothequeSearchResult | null> {
    try {
      const results = await this.searchPerfumes(`${brand} ${perfumeName}`);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(LOG_TAG, 'Error getting details:', error);
      return null;
    }
  }

  // ─── Recent Searches ──────────────────────────────────────────────────────

  async saveRecentSearch(query: string): Promise<void> {
    try {
      const recent = await this.getRecentSearches();
      const updated = [query, ...recent.filter((q) => q !== query)].slice(0, 20);
      await storageService.save('biblio_recent_searches', updated);
    } catch (error) {
      console.error(LOG_TAG, 'Error saving recent search:', error);
    }
  }

  async getRecentSearches(): Promise<string[]> {
    try {
      return (await storageService.get<string[]>('biblio_recent_searches')) || [];
    } catch (error) {
      console.error(LOG_TAG, 'Error getting recent searches:', error);
      return [];
    }
  }

  async clearRecentSearches(): Promise<void> {
    await storageService.remove('biblio_recent_searches');
  }

  // ─── Favorites ────────────────────────────────────────────────────────────

  async saveFavorite(result: BibliothequeSearchResult): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.find((f) => f.id === result.id)) {
        favorites.push(result);
        await storageService.save('biblio_favorites', favorites);
      }
    } catch (error) {
      console.error(LOG_TAG, 'Error saving favorite:', error);
    }
  }

  async removeFavorite(resultId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updated = favorites.filter((f) => f.id !== resultId);
      await storageService.save('biblio_favorites', updated);
    } catch (error) {
      console.error(LOG_TAG, 'Error removing favorite:', error);
    }
  }

  async getFavorites(): Promise<BibliothequeSearchResult[]> {
    try {
      return (await storageService.get<BibliothequeSearchResult[]>('biblio_favorites')) || [];
    } catch (error) {
      console.error(LOG_TAG, 'Error getting favorites:', error);
      return [];
    }
  }

  isFavorite(resultId: string, favorites: BibliothequeSearchResult[]): boolean {
    return favorites.some((f) => f.id === resultId);
  }

  // ─── Cache Management ────────────────────────────────────────────────────

  clearCache(): void {
    this.cache.clear();
    console.log(LOG_TAG, 'Memory cache cleared');
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private mapSearchResult(item: GoogleSearchItem, query: string): BibliothequeSearchResult {
    const thumbnail = item.pagemap?.cse_thumbnail?.[0]?.src || null;
    const { brand, perfumeName } = this.extractBrandAndName(item.title, query);

    return {
      id: generateId(),
      title: item.title,
      description: item.snippet || '',
      link: item.link,
      thumbnail,
      brand,
      perfumeName,
      notes: { top: [], heart: [], base: [] },
      retailPriceEUR: 0,
      concentration: '',
      family: '',
      source: new URL(item.link).hostname,
    };
  }

  private extractBrandAndName(title: string, query: string): { brand: string; perfumeName: string } {
    const knownBrands = [
      'Dior', 'Chanel', 'Gucci', 'Prada', 'Versace', 'Tom Ford', 'Creed',
      'Hugo Boss', 'YSL', 'Yves Saint Laurent', 'Armani', 'Giorgio Armani',
      'Hermes', 'Dolce & Gabbana', 'Jean Paul Gaultier', 'Carolina Herrera',
      'Chloe', 'Burberry', 'Valentino', 'Givenchy', 'Lancome', 'Bvlgari',
    ];

    let detectedBrand = '';
    for (const brand of knownBrands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        detectedBrand = brand;
        break;
      }
    }

    const perfumeName = title.split('-')[0].split('|')[0].trim();

    return {
      brand: detectedBrand || query.split(' ')[0] || '',
      perfumeName: perfumeName || query,
    };
  }
}

export const bibliothequeService = new BibliothequeService();
export default BibliothequeService;
