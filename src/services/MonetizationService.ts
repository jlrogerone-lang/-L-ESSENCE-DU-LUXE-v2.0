// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Monetization Service
// RevenueCat + Google AdMob Integration
// PRODUCTION: Real RevenueCat SDK calls for purchases & restore
// ============================================================================

import { Platform } from 'react-native';
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { SubscriptionPlan, Subscription, SubscriptionLimits } from '../types';
import { PLAN_LIMITS, SUBSCRIPTION_PLANS } from '../utils/constants';
import { storageService } from './StorageService';

const LOG_TAG = '[MonetizationService]';

// RevenueCat API keys from environment
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '';
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '';

// RevenueCat entitlement identifiers matching dashboard configuration
const RC_ENTITLEMENT_PREMIUM = 'premium';
const RC_ENTITLEMENT_MASTER = 'master';
const RC_ENTITLEMENT_LIFETIME = 'lifetime';

// AdMob configuration
const ADMOB_CONFIG = {
  bannerId: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || '',
  interstitialId: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || '',
  rewardedId: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || '',
};

class MonetizationService {
  private currentSubscription: Subscription;
  private subscriptionListeners: Array<(sub: Subscription) => void> = [];
  private isInitialized = false;

  constructor() {
    this.currentSubscription = this.getDefaultSubscription();
  }

  // ─── Initialize RevenueCat SDK ──────────────────────────────────────────

  async initialize(userId?: string): Promise<void> {
    try {
      console.log(LOG_TAG, 'Initializing RevenueCat SDK...');

      const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

      if (!apiKey) {
        console.warn(LOG_TAG, 'RevenueCat API key not configured. Using offline mode.');
        const saved = await storageService.get<Subscription>('subscription_state');
        if (saved) {
          this.currentSubscription = saved;
        }
        return;
      }

      await Purchases.configure({ apiKey, appUserID: userId || undefined });
      this.isInitialized = true;

      // Set user attributes for analytics
      if (userId) {
        await Purchases.logIn(userId);
      }

      // Sync current entitlements from RevenueCat
      await this.syncEntitlements();

      // Listen for subscription changes
      Purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
        this.handleCustomerInfoUpdate(info);
      });

      console.log(LOG_TAG, 'RevenueCat initialized. Plan:', this.currentSubscription.plan);
    } catch (error) {
      console.error(LOG_TAG, 'RevenueCat initialization failed:', error);
      // Fallback to cached subscription
      const saved = await storageService.get<Subscription>('subscription_state');
      if (saved) {
        this.currentSubscription = saved;
      }
    }
  }

  // ─── Sync Entitlements from RevenueCat ──────────────────────────────────

  private async syncEntitlements(): Promise<void> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      this.handleCustomerInfoUpdate(customerInfo);
    } catch (error) {
      console.error(LOG_TAG, 'Failed to sync entitlements:', error);
    }
  }

  private handleCustomerInfoUpdate(info: CustomerInfo): void {
    const { entitlements } = info;
    let plan: SubscriptionPlan = 'free';

    if (entitlements.active[RC_ENTITLEMENT_LIFETIME]) {
      plan = 'lifetime';
    } else if (entitlements.active[RC_ENTITLEMENT_MASTER]) {
      plan = 'master';
    } else if (entitlements.active[RC_ENTITLEMENT_PREMIUM]) {
      plan = 'alquimist';
    }

    const activeEntitlement = entitlements.active[RC_ENTITLEMENT_LIFETIME]
      || entitlements.active[RC_ENTITLEMENT_MASTER]
      || entitlements.active[RC_ENTITLEMENT_PREMIUM];

    const newSubscription: Subscription = {
      plan,
      isActive: plan !== 'free',
      expiresAt: activeEntitlement?.expirationDate || null,
      purchasedAt: activeEntitlement?.originalPurchaseDate || null,
      isAutoRenew: activeEntitlement?.willRenew ?? false,
      entitlements: this.getEntitlementsForPlan(plan),
      priceEUR: SUBSCRIPTION_PLANS[plan].priceEUR,
    };

    this.setSubscription(newSubscription);
  }

  // ─── Purchase Subscription via RevenueCat ───────────────────────────────

  async purchasePlan(plan: SubscriptionPlan): Promise<Subscription> {
    try {
      console.log(LOG_TAG, 'Purchasing plan:', plan);

      if (plan === 'free') {
        return this.setSubscription(this.getDefaultSubscription());
      }

      if (!this.isInitialized) {
        throw new Error('RevenueCat n\'est pas initialise. Verifiez votre connexion.');
      }

      // Get available offerings from RevenueCat
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) {
        throw new Error('Aucune offre disponible. Reessayez plus tard.');
      }

      // Map plan to RevenueCat package identifier
      const packageId = this.getPackageIdForPlan(plan);
      const targetPackage = currentOffering.availablePackages.find(
        (pkg: PurchasesPackage) => pkg.identifier === packageId,
      );

      if (!targetPackage) {
        throw new Error(`L'offre ${SUBSCRIPTION_PLANS[plan].name} n'est pas disponible.`);
      }

      // Execute the real purchase through RevenueCat -> Google Play / App Store
      const { customerInfo } = await Purchases.purchasePackage(targetPackage);
      this.handleCustomerInfoUpdate(customerInfo);

      console.log(LOG_TAG, 'Purchase successful:', plan);
      return this.currentSubscription;
    } catch (error: unknown) {
      // Handle user cancellation gracefully
      const purchaseError = error as { userCancelled?: boolean };
      if (purchaseError.userCancelled) {
        console.log(LOG_TAG, 'Purchase cancelled by user');
        return this.currentSubscription;
      }
      console.error(LOG_TAG, 'Purchase failed:', error);
      throw error;
    }
  }

  // ─── Restore Purchases via RevenueCat ───────────────────────────────────

  async restorePurchases(): Promise<Subscription> {
    try {
      console.log(LOG_TAG, 'Restoring purchases...');

      if (!this.isInitialized) {
        // Fallback to local cache
        const saved = await storageService.get<Subscription>('subscription_state');
        if (saved && saved.isActive) {
          return this.setSubscription(saved);
        }
        return this.currentSubscription;
      }

      const customerInfo = await Purchases.restorePurchases();
      this.handleCustomerInfoUpdate(customerInfo);

      console.log(LOG_TAG, 'Restore complete. Plan:', this.currentSubscription.plan);
      return this.currentSubscription;
    } catch (error) {
      console.error(LOG_TAG, 'Restore failed:', error);
      throw error;
    }
  }

  // ─── Cancel Subscription ────────────────────────────────────────────────

  async cancelSubscription(): Promise<void> {
    try {
      console.log(LOG_TAG, 'Cancelling subscription...');
      // RevenueCat handles cancellation through the store.
      // We just mark auto-renew as off locally; actual cancellation
      // happens in Google Play / App Store subscription management.
      const updated: Subscription = {
        ...this.currentSubscription,
        isAutoRenew: false,
      };
      await this.setSubscription(updated);
      console.log(LOG_TAG, 'Auto-renew disabled locally. User must cancel in store settings.');
    } catch (error) {
      console.error(LOG_TAG, 'Cancel failed:', error);
      throw error;
    }
  }

  // ─── Entitlement Checking ───────────────────────────────────────────────

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

  // ─── Subscription Info ──────────────────────────────────────────────────

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

  // ─── AdMob ──────────────────────────────────────────────────────────────

  getBannerAdId(): string {
    return ADMOB_CONFIG.bannerId;
  }

  getInterstitialAdId(): string {
    return ADMOB_CONFIG.interstitialId;
  }

  getRewardedAdId(): string {
    return ADMOB_CONFIG.rewardedId;
  }

  // ─── Subscription Listeners ─────────────────────────────────────────────

  onSubscriptionChange(listener: (sub: Subscription) => void): () => void {
    this.subscriptionListeners.push(listener);
    return () => {
      this.subscriptionListeners = this.subscriptionListeners.filter((l) => l !== listener);
    };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────

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

  private getPackageIdForPlan(plan: SubscriptionPlan): string {
    switch (plan) {
      case 'alquimist': return '$rc_monthly';
      case 'master': return '$rc_annual';
      case 'lifetime': return '$rc_lifetime';
      default: return '';
    }
  }
}

export const monetizationService = new MonetizationService();
export default MonetizationService;
