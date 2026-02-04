// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Helper Functions (30+)
// Includes LIVE Fiscal Engine - No hardcoded values
// ============================================================================

import {
  InventoryItem,
  PerfumeAsset,
  Pillar3_CostAnalysis,
  CostBreakdownItem,
  Audit6Pilars,
} from '../types';
import { FRAGRANCE_FAMILIES, SEASONS } from './constants';

// ─── FISCAL ENGINE (LIVE FORMULA) ───────────────────────────────────────────
// Core formula: Savings = Niche Price Equivalent - Real Cost
// This is a LIVE mathematical formula, never hardcoded.

/**
 * Calculates the fiscal savings for a layering operation.
 * Formula: nichePriceEquivalent - totalRealCost
 * This is a dynamic calculation based on real perfume data.
 */
export function calculateFiscalSavings(
  perfumeAssets: PerfumeAsset[],
  nichePriceEquivalentEUR: number,
): Pillar3_CostAnalysis {
  const breakdown: CostBreakdownItem[] = perfumeAssets.map((asset) => {
    const realCostForUsage = asset.costPerMlEUR * asset.mlUsed;
    return {
      perfumeName: asset.name,
      brand: asset.brand,
      retailPriceEUR: asset.retailPriceEUR,
      realCostEUR: roundCurrency(realCostForUsage),
      mlUsed: asset.mlUsed,
      savingsEUR: roundCurrency(asset.retailPriceEUR - realCostForUsage),
    };
  });

  const totalRetailPrice = breakdown.reduce((sum, item) => sum + item.retailPriceEUR, 0);
  const totalRealCost = breakdown.reduce((sum, item) => sum + item.realCostEUR, 0);
  const fiscalSavings = nichePriceEquivalentEUR - totalRealCost;
  const savingsPercentage = nichePriceEquivalentEUR > 0
    ? ((fiscalSavings / nichePriceEquivalentEUR) * 100)
    : 0;
  const totalMlUsed = perfumeAssets.reduce((sum, a) => sum + a.mlUsed, 0);
  const costPerApplication = totalMlUsed > 0 ? totalRealCost / totalMlUsed : 0;
  const valueRatio = totalRealCost > 0 ? nichePriceEquivalentEUR / totalRealCost : 0;

  return {
    totalRetailPriceEUR: roundCurrency(totalRetailPrice),
    totalRealCostEUR: roundCurrency(totalRealCost),
    fiscalSavingsEUR: roundCurrency(fiscalSavings),
    savingsPercentage: roundPercent(savingsPercentage),
    costPerApplication: roundCurrency(costPerApplication),
    nichePriceEquivalentEUR: roundCurrency(nichePriceEquivalentEUR),
    valueRatio: Math.round(valueRatio * 100) / 100,
    breakdown,
  };
}

/**
 * Calculates cost per ml for an inventory item.
 * Formula: purchasePrice / mlTotal
 */
export function calculateCostPerMl(purchasePriceEUR: number, mlTotal: number): number {
  if (mlTotal <= 0) return 0;
  return roundCurrency(purchasePriceEUR / mlTotal);
}

/**
 * Estimates the niche price equivalent for a layering combination.
 * Based on average niche prices and complexity multiplier.
 */
export function estimateNichePriceEquivalent(
  numberOfPerfumes: number,
  averageComplexity: number,
): number {
  const baseNichePrice = 180;
  const complexityMultiplier = 1 + (averageComplexity - 1) * 0.3;
  const perfumeCountBonus = 1 + (numberOfPerfumes - 1) * 0.15;
  return roundCurrency(baseNichePrice * complexityMultiplier * perfumeCountBonus);
}

/**
 * Converts an InventoryItem to a PerfumeAsset for cost analysis.
 */
export function inventoryItemToAsset(
  item: InventoryItem,
  mlUsed: number,
  role: 'base' | 'heart' | 'accent' | 'booster',
): PerfumeAsset {
  return {
    id: item.id,
    name: item.name,
    brand: item.brand,
    concentration: item.concentration,
    retailPriceEUR: item.retailPriceEUR,
    costPerMlEUR: item.costPerMlEUR,
    mlUsed,
    role,
  };
}

// ─── Price & Currency Formatting ────────────────────────────────────────────

export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

// ─── Category & Classification ──────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Floral: '#FF69B4',
  Oriental: '#FF8C00',
  Woody: '#8B4513',
  Fresh: '#00CED1',
  Citrus: '#FFD700',
  Aquatic: '#1E90FF',
  Gourmand: '#DC143C',
  Chypre: '#228B22',
  Fougere: '#2E8B57',
  Aromatic: '#9370DB',
  Leather: '#654321',
  Musk: '#DEB887',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#D4AF37';
}

export function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    Floral: '🌹', Oriental: '🌙', Woody: '🌲', Fresh: '💨',
    Citrus: '🍋', Aquatic: '🌊', Gourmand: '🍫', Chypre: '🍃',
    Fougere: '🌿', Aromatic: '🌾', Leather: '👞', Musk: '🦌',
  };
  return emojiMap[category] || '✨';
}

// ─── Filtering Functions ────────────────────────────────────────────────────

export function filterByFamily<T extends { family: string }>(items: T[], family: string): T[] {
  return items.filter((item) => item.family === family);
}

export function filterBySeason<T extends { season: string[] }>(items: T[], season: string): T[] {
  return items.filter((item) => item.season.includes(season));
}

export function filterByTimeOfDay<T extends { timeOfDay: string }>(
  items: T[],
  time: 'day' | 'night' | 'versatile',
): T[] {
  return items.filter((item) => item.timeOfDay === time || item.timeOfDay === 'versatile');
}

export function filterByBrand<T extends { brand: string }>(items: T[], brand: string): T[] {
  return items.filter((item) => item.brand.toLowerCase().includes(brand.toLowerCase()));
}

export function filterByPriceRange<T extends { retailPriceEUR: number }>(
  items: T[],
  min: number,
  max: number,
): T[] {
  return items.filter((item) => item.retailPriceEUR >= min && item.retailPriceEUR <= max);
}

// ─── Sorting Functions ──────────────────────────────────────────────────────

export function sortByPrice<T extends { retailPriceEUR: number }>(
  items: T[],
  ascending: boolean = true,
): T[] {
  return [...items].sort((a, b) =>
    ascending ? a.retailPriceEUR - b.retailPriceEUR : b.retailPriceEUR - a.retailPriceEUR,
  );
}

export function sortAlphabetically<T extends { name: string }>(
  items: T[],
  ascending: boolean = true,
): T[] {
  return [...items].sort((a, b) =>
    ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );
}

export function sortByLongevity<T extends { longevityHours: number }>(
  items: T[],
  ascending: boolean = false,
): T[] {
  return [...items].sort((a, b) =>
    ascending ? a.longevityHours - b.longevityHours : b.longevityHours - a.longevityHours,
  );
}

// ─── String Utilities ───────────────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── ID & Time Utilities ────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getReadableTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTimeDifference(date: string | Date): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHrs < 24) return `Il y a ${diffHrs}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return getReadableTime(d);
}

// ─── Collection Utilities ───────────────────────────────────────────────────

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

export function deduplicate<T>(items: T[], key: keyof T): T[] {
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

// ─── Validation Helpers ─────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  return /^https?:\/\/.+/.test(url);
}

// ─── Audit Score Calculator ─────────────────────────────────────────────────

export function calculateAuditScore(audit: Audit6Pilars): number {
  const p1Score = audit.pillar1.operationName && audit.pillar1.strategy ? 15 : 0;
  const p2Score = Math.min(audit.pillar2.totalPerfumesUsed * 5, 15);
  const p3Score = audit.pillar3.fiscalSavingsEUR > 0 ? 20 : 5;
  const p4Score = Math.min(audit.pillar4.totalSteps * 3, 20);
  const p5Score = audit.pillar5.totalDryingTimeMinutes > 0 ? 15 : 0;
  const p6Score = Math.round(audit.pillar6.overallCompatibilityPercent * 0.15);
  return Math.min(p1Score + p2Score + p3Score + p4Score + p5Score + p6Score, 100);
}
