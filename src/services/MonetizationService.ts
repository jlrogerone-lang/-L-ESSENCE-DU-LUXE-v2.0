// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Monetization Service
// RevenueCat + Google AdMob Integration
// ============================================================================

import { SubscriptionPlan, Subscription, SubscriptionLimits } from '../types';
import { PLAN_LIMITS, SUBSCRIPTION_PLANS } from '../utils/constants';
import { storageService } from './StorageService';

const LOG_TAG = '[MonetizationService]';

// AdMob configuration
const ADMOB_CONFIG = {
  bannerId: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || '',
  interstitialId: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || '',
  rewardedId: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || '',
};

class MonetizationService {
  private currentSubscription: Subscription;
  private subscriptionListeners: Array<(sub: Subscription) => void> = [];

  constructor() {
    this.currentSubscription = this.getDefaultSubscription();
  }

  // ─── Initialize RevenueCat ────────────────────────────────────────────────

  async initialize(): Promise<void> {
    try {
      console.log(LOG_TAG, 'Initializing monetization...');
      // Load saved subscription state
      const saved = await storageService.get<Subscription>('subscription_state');
      if (saved) {
        this.currentSubscription = saved;
      }
      console.log(LOG_TAG, 'Current plan:', this.currentSubscription.plan);
    } catch (error) {
      console.error(LOG_TAG, 'Initialization failed:', error);
    }
  }

  // ─── Purchase Subscription ────────────────────────────────────────────────

  async purchasePlan(plan: SubscriptionPlan): Promise<Subscription> {
    try {
      console.log(LOG_TAG, 'Purchasing plan:', plan);

      if (plan === 'free') {
        return this.setSubscription(this.getDefaultSubscription());
      }

      // In production, this calls RevenueCat SDK
      // For now, simulate the purchase flow
      const planInfo = SUBSCRIPTION_PLANS[plan];
      const newSubscription: Subscription = {
        plan,
        isActive: true,
        expiresAt: plan === 'lifetime'
          ? null
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        purchasedAt: new Date().toISOString(),
        isAutoRenew: plan !== 'lifetime',
        entitlements: this.getEntitlementsForPlan(plan),
        priceEUR: planInfo.priceEUR,
      };

      return this.setSubscription(newSubscription);
    } catch (error) {
      console.error(LOG_TAG, 'Purchase failed:', error);
      throw error;
    }
  }

  // ─── Restore Purchases ────────────────────────────────────────────────────

  async restorePurchases(): Promise<Subscription> {
    try {
      console.log(LOG_TAG, 'Restoring purchases...');
      // In production: RevenueCat.restorePurchases()
      const saved = await storageService.get<Subscription>('subscription_state');
      if (saved && saved.isActive) {
        return this.setSubscription(saved);
      }
      return this.currentSubscription;
    } catch (error) {
      console.error(LOG_TAG, 'Restore failed:', error);
      throw error;
    }
  }

  // ─── Cancel Subscription ──────────────────────────────────────────────────

  async cancelSubscription(): Promise<void> {
    try {
      console.log(LOG_TAG, 'Cancelling subscription...');
      const updated: Subscription = {
        ...this.currentSubscription,
        isAutoRenew: false,
      };
      await this.setSubscription(updated);
    } catch (error) {
      console.error(LOG_TAG, 'Cancel failed:', error);
      throw error;
    }
  }

  // ─── Entitlement Checking ─────────────────────────────────────────────────

  checkEntitlement(feature: string): boolean {
    return this.currentSubscription.entitlements.includes(feature);
  }

  canAccess(feature: string): boolean {
    const limits = this.getCurrentLimits();
    switch (feature) {
      case 'ocr': return limits.ocrEnabled;
      case 'quantum_genesis': return limits.quantumGenesisEnabled;
      case 'pdf_export': return limits.pdfExportEnabled;
      case 'premium_skins': return limits.premiumSkinsEnabled;
      case 'unlimited_audits': return limits.maxAuditsPerWeek === Infinity;
      case 'unlimited_layerings': return limits.maxLayeringsPerMonth === Infinity;
      default: return true;
    }
  }

  isPremium(): boolean {
    return this.currentSubscription.plan !== 'free' && this.currentSubscription.isActive;
  }

  shouldShowAds(): boolean {
    return PLAN_LIMITS[this.currentSubscription.plan].adsEnabled;
  }

  // ─── Subscription Info ────────────────────────────────────────────────────

  getCurrentSubscription(): Subscription {
    return { ...this.currentSubscription };
  }

  getCurrentLimits(): SubscriptionLimits {
    return PLAN_LIMITS[this.currentSubscription.plan];
  }

  getPlanName(plan?: SubscriptionPlan): string {
    return SUBSCRIPTION_PLANS[plan || this.currentSubscription.plan].name;
  }

  getPlanPrice(plan?: SubscriptionPlan): number {
    return SUBSCRIPTION_PLANS[plan || this.currentSubscription.plan].priceEUR;
  }

  getRemainingDays(): number | null {
    if (!this.currentSubscription.expiresAt) return null;
    const diff = new Date(this.currentSubscription.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  }

  isAutoRenewEnabled(): boolean {
    return this.currentSubscription.isAutoRenew;
  }

  // ─── AdMob ────────────────────────────────────────────────────────────────

  getBannerAdId(): string {
    return ADMOB_CONFIG.bannerId;
  }

  getInterstitialAdId(): string {
    return ADMOB_CONFIG.interstitialId;
  }

  getRewardedAdId(): string {
    return ADMOB_CONFIG.rewardedId;
  }

  // ─── Subscription Listeners ───────────────────────────────────────────────

  onSubscriptionChange(listener: (sub: Subscription) => void): () => void {
    this.subscriptionListeners.push(listener);
    return () => {
      this.subscriptionListeners = this.subscriptionListeners.filter((l) => l !== listener);
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async setSubscription(subscription: Subscription): Promise<Subscription> {
    this.currentSubscription = subscription;
    await storageService.save('subscription_state', subscription);
    this.subscriptionListeners.forEach((listener) => listener(subscription));
    console.log(LOG_TAG, 'Subscription updated:', subscription.plan);
    return subscription;
  }

  private getDefaultSubscription(): Subscription {
    return {
      plan: 'free',
      isActive: true,
      expiresAt: null,
      purchasedAt: null,
      isAutoRenew: false,
      entitlements: [],
      priceEUR: 0,
    };
  }

  private getEntitlementsForPlan(plan: SubscriptionPlan): string[] {
    switch (plan) {
      case 'alquimist':
        return ['unlimited_audits', 'unlimited_layerings', 'ocr', 'quantum_genesis', 'no_ads'];
      case 'master':
        return ['unlimited_audits', 'unlimited_layerings', 'ocr', 'quantum_genesis', 'no_ads', 'pdf_export', 'premium_skins'];
      case 'lifetime':
        return ['unlimited_audits', 'unlimited_layerings', 'ocr', 'quantum_genesis', 'no_ads', 'pdf_export', 'premium_skins', 'lifetime'];
      default:
        return [];
    }
  }
}

export const monetizationService = new MonetizationService();
export default MonetizationService;
