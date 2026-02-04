// ============================================================================
// L'ESSENCE DU LUXE v2.0 - useMonetization Hook
// Subscription management, feature gating, and ad control
// ============================================================================

import { useCallback, useMemo } from 'react';
import { SubscriptionPlan } from '../types';
import { useMonetizationContext } from '../contexts/MonetizationContext';
import { monetizationService } from '../services/MonetizationService';
import { SUBSCRIPTION_PLANS } from '../utils/constants';

export function useMonetization() {
  const context = useMonetizationContext();

  const buyPlan = useCallback(
    async (plan: SubscriptionPlan) => {
      await context.purchase(plan);
    },
    [context.purchase],
  );

  const restorePurchases = useCallback(async () => {
    await context.restore();
  }, [context.restore]);

  const cancel = useCallback(async () => {
    await context.cancelSubscription();
  }, [context.cancelSubscription]);

  const isPremium = useMemo(
    () => context.subscription.plan !== 'free' && context.subscription.isActive,
    [context.subscription],
  );

  const shouldShowAds = useMemo(
    () => context.limits.adsEnabled,
    [context.limits],
  );

  const getPlanName = useCallback(
    (plan?: SubscriptionPlan): string => {
      return SUBSCRIPTION_PLANS[plan || context.subscription.plan].name;
    },
    [context.subscription.plan],
  );

  const getPlanPrice = useCallback(
    (plan?: SubscriptionPlan): number => {
      return SUBSCRIPTION_PLANS[plan || context.subscription.plan].priceEUR;
    },
    [context.subscription.plan],
  );

  const getRemainingDays = useCallback((): number | null => {
    return monetizationService.getRemainingDays();
  }, [context.subscription]);

  const isAutoRenewEnabled = useMemo(
    () => context.subscription.isAutoRenew,
    [context.subscription],
  );

  const getBannerAdId = useCallback((): string => {
    return monetizationService.getBannerAdId();
  }, []);

  const getInterstitialAdId = useCallback((): string => {
    return monetizationService.getInterstitialAdId();
  }, []);

  const getRewardedAdId = useCallback((): string => {
    return monetizationService.getRewardedAdId();
  }, []);

  return {
    ...context,
    buyPlan,
    restorePurchases,
    cancel,
    isPremium,
    shouldShowAds,
    getPlanName,
    getPlanPrice,
    getRemainingDays,
    isAutoRenewEnabled,
    getBannerAdId,
    getInterstitialAdId,
    getRewardedAdId,
  };
}

export default useMonetization;
