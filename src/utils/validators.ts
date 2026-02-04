// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Validation Functions
// ============================================================================

import { InventoryItem, Audit6Pilars, Layering, SubscriptionPlan } from '../types';
import { PLAN_LIMITS, CONCENTRATIONS, FRAGRANCE_FAMILIES } from './constants';

// ─── Email & Input Validators ───────────────────────────────────────────────

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email requis.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Format email invalide.' };
  }
  return { valid: true };
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL requise.' };
  }
  if (!/^https?:\/\/.+/.test(url)) {
    return { valid: false, error: 'URL invalide (doit commencer par http:// ou https://).' };
  }
  return { valid: true };
}

export function validatePerfumeName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Nom du parfum requis.' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Nom trop court (min 2 caracteres).' };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'Nom trop long (max 100 caracteres).' };
  }
  return { valid: true };
}

// ─── Inventory Item Validator ───────────────────────────────────────────────

export function validateInventoryItem(
  item: Partial<InventoryItem>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!item.name || item.name.trim().length < 2) {
    errors.push('Nom du parfum requis (min 2 caracteres).');
  }
  if (!item.brand || item.brand.trim().length < 2) {
    errors.push('Marque requise (min 2 caracteres).');
  }
  if (!item.concentration || !CONCENTRATIONS.includes(item.concentration as typeof CONCENTRATIONS[number])) {
    errors.push('Concentration invalide (EDT, EDP, Parfum, Cologne, Extrait).');
  }
  if (item.retailPriceEUR === undefined || item.retailPriceEUR < 0) {
    errors.push('Prix retail doit etre >= 0.');
  }
  if (item.purchasePriceEUR === undefined || item.purchasePriceEUR < 0) {
    errors.push("Prix d'achat doit etre >= 0.");
  }
  if (item.mlTotal === undefined || item.mlTotal <= 0) {
    errors.push('Volume total doit etre > 0 ml.');
  }
  if (item.mlRemaining !== undefined && item.mlTotal !== undefined && item.mlRemaining > item.mlTotal) {
    errors.push('Volume restant ne peut pas depasser le volume total.');
  }

  return { valid: errors.length === 0, errors };
}

// ─── Layering Validator ─────────────────────────────────────────────────────

export function validateLayering(layering: Partial<Layering>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!layering.name || layering.name.trim().length < 2) {
    errors.push('Nom du layering requis.');
  }
  if (!layering.perfumes || layering.perfumes.length < 2) {
    errors.push('Un layering necessite au moins 2 parfums.');
  }
  if (layering.perfumes && layering.perfumes.length > 5) {
    errors.push('Maximum 5 parfums par layering.');
  }

  return { valid: errors.length === 0, errors };
}

// ─── Audit Validator ────────────────────────────────────────────────────────

export function validateAudit6Pilars(audit: Audit6Pilars): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Pillar 1: Operation & Strategy
  if (!audit.pillar1.operationName) errors.push('Pilar 1: Nom operation manquant.');
  if (!audit.pillar1.strategy) errors.push('Pilar 1: Strategie manquante.');

  // Pillar 2: Real Assets
  if (audit.pillar2.totalPerfumesUsed < 1) errors.push('Pilar 2: Au moins 1 parfum requis.');
  if (audit.pillar2.perfumes.length === 0) errors.push('Pilar 2: Actifs reels vides.');

  // Pillar 3: Cost Analysis
  if (audit.pillar3.totalRealCostEUR < 0) errors.push('Pilar 3: Cout reel invalide.');
  if (audit.pillar3.nichePriceEquivalentEUR <= 0) errors.push('Pilar 3: Prix niche equivalent requis.');

  // Pillar 4: Step by Step
  if (audit.pillar4.totalSteps < 1) errors.push('Pilar 4: Au moins 1 etape requise.');
  if (audit.pillar4.steps.length === 0) errors.push('Pilar 4: Pas de technique definie.');

  // Pillar 5: Time Factor
  if (audit.pillar5.totalDryingTimeMinutes < 0) errors.push('Pilar 5: Temps sechage invalide.');
  if (audit.pillar5.longevityEstimateHours <= 0) errors.push('Pilar 5: Longevite requise.');

  // Pillar 6: Chemical Compatibility
  if (audit.pillar6.overallCompatibilityPercent < 0 || audit.pillar6.overallCompatibilityPercent > 100) {
    errors.push('Pilar 6: Compatibilite doit etre entre 0 et 100%.');
  }

  return { valid: errors.length === 0, errors };
}

// ─── Plan Eligibility ───────────────────────────────────────────────────────

export function canCreateLayering(
  plan: SubscriptionPlan,
  currentMonthCount: number,
): boolean {
  const limits = PLAN_LIMITS[plan];
  return currentMonthCount < limits.maxLayeringsPerMonth;
}

export function canPerformAudit(
  plan: SubscriptionPlan,
  currentWeekCount: number,
): boolean {
  const limits = PLAN_LIMITS[plan];
  return currentWeekCount < limits.maxAuditsPerWeek;
}

export function canUseOcr(plan: SubscriptionPlan): boolean {
  return PLAN_LIMITS[plan].ocrEnabled;
}

export function canUseQuantumGenesis(plan: SubscriptionPlan): boolean {
  return PLAN_LIMITS[plan].quantumGenesisEnabled;
}

export function shouldShowAds(plan: SubscriptionPlan): boolean {
  return PLAN_LIMITS[plan].adsEnabled;
}

// ─── Price Validator ────────────────────────────────────────────────────────

export function validatePrice(price: number): { valid: boolean; error?: string } {
  if (isNaN(price)) return { valid: false, error: 'Prix doit etre un nombre.' };
  if (price < 0) return { valid: false, error: 'Prix ne peut pas etre negatif.' };
  if (price > 10000) return { valid: false, error: 'Prix semble trop eleve (max 10 000 EUR).' };
  return { valid: true };
}

// ─── Volume Validator ───────────────────────────────────────────────────────

export function validateVolume(ml: number): { valid: boolean; error?: string } {
  if (isNaN(ml)) return { valid: false, error: 'Volume doit etre un nombre.' };
  if (ml <= 0) return { valid: false, error: 'Volume doit etre positif.' };
  if (ml > 1000) return { valid: false, error: 'Volume semble trop eleve (max 1000 ml).' };
  return { valid: true };
}
