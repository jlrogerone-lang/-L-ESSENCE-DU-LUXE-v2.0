// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Monetization Context
// Subscription state + RevenueCat + AdMob integration
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { MonetizationContextType, Subscription, SubscriptionLimits, SubscriptionPlan } from '../types';
import { monetizationService } from '../services/MonetizationService';
import { PLAN_LIMITS } from '../utils/constants';

const defaultSubscription: Subscription = {
  plan: 'free',
  isActive: true,
  expiresAt: null,
  purchasedAt: null,
  isAutoRenew: false,
  entitlements: [],
  priceEUR: 0,
};

const MonetizationContext = createContext<MonetizationContextType>({
  subscription: defaultSubscription,
  limits: PLAN_LIMITS.free,
  isLoading: true,
  isPurchaseInProgress: false,
  purchase: async () => {},
  restore: async () => {},
  cancelSubscription: async () => {},
  checkEntitlement: () => false,
  canAccess: () => false,
});

export function MonetizationProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription>(defaultSubscription);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);

  const limits: SubscriptionLimits = PLAN_LIMITS[subscription.plan];

  useEffect(() => {
    initializeMonetization();
  }, []);

  const initializeMonetization = async () => {
    try {
      await monetizationService.initialize();
      const currentSub = monetizationService.getCurrentSubscription();
      setSubscription(currentSub);
    } catch (error) {
      console.error('[MonetizationContext] Init failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = monetizationService.onSubscriptionChange((sub) => {
      setSubscription(sub);
    });
    return unsubscribe;
  }, []);

  const purchase = useCallback(async (plan: SubscriptionPlan) => {
    try {
      setIsPurchaseInProgress(true);
      const newSub = await monetizationService.purchasePlan(plan);
      setSubscription(newSub);
    } catch (error) {
      console.error('[MonetizationContext] Purchase failed:', error);
      throw error;
    } finally {
      setIsPurchaseInProgress(false);
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      setIsLoading(true);
      const restoredSub = await monetizationService.restorePurchases();
      setSubscription(restoredSub);
    } catch (error) {
      console.error('[MonetizationContext] Restore failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(async () => {
    try {
      await monetizationService.cancelSubscription();
    } catch (error) {
      console.error('[MonetizationContext] Cancel failed:', error);
      throw error;
    }
  }, []);

  const checkEntitlement = useCallback(
    (feature: string): boolean => {
      return monetizationService.checkEntitlement(feature);
    },
    [subscription],
  );

  const canAccess = useCallback(
    (feature: string): boolean => {
      return monetizationService.canAccess(feature);
    },
    [subscription],
  );

  return (
    <MonetizationContext.Provider
      value={{
        subscription,
        limits,
        isLoading,
        isPurchaseInProgress,
        purchase,
        restore,
        cancelSubscription,
        checkEntitlement,
        canAccess,
      }}
    >
      {children}
    </MonetizationContext.Provider>
  );
}

export function useMonetizationContext(): MonetizationContextType {
  const context = useContext(MonetizationContext);
  if (!context) {
    throw new Error('useMonetizationContext must be used within MonetizationProvider');
  }
  return context;
}

export default MonetizationContext;
