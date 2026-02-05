// ============================================================================
// L'ESSENCE DU LUXE v2.0 - AdMob Service
// Google AdMob integration with lazy loading and performance optimization
// Supports Banner, Interstitial, and Rewarded ads
// ============================================================================

import { Platform } from 'react-native';
import {
  AdEventType,
  RewardedAdEventType,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const LOG_TAG = '[AdMobService]';

// Use test IDs in development
const isDev = __DEV__ || process.env.EXPO_PUBLIC_APP_ENV !== 'production';

const AD_UNIT_IDS = {
  banner: isDev ? TestIds.BANNER : (process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || TestIds.BANNER),
  interstitial: isDev ? TestIds.INTERSTITIAL : (process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || TestIds.INTERSTITIAL),
  rewarded: isDev ? TestIds.REWARDED : (process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || TestIds.REWARDED),
};

// Ad request configuration
const AD_REQUEST_OPTIONS = {
  requestNonPersonalizedAdsOnly: false,
  keywords: ['perfume', 'fragrance', 'luxury', 'beauty', 'cosmetics'],
};

type AdLoadState = 'idle' | 'loading' | 'loaded' | 'error';

interface AdState {
  interstitial: AdLoadState;
  rewarded: AdLoadState;
}

class AdMobService {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private adState: AdState = { interstitial: 'idle', rewarded: 'idle' };
  private isInitialized = false;

  // Callbacks for rewarded ads
  private rewardedEarnedCallback: ((reward: { type: string; amount: number }) => void) | null = null;

  // ─── Initialize Service ─────────────────────────────────────────────────

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log(LOG_TAG, 'Initializing AdMob service...');
      this.isInitialized = true;

      // Pre-load interstitial for faster display when needed
      this.preloadInterstitial();

      console.log(LOG_TAG, 'AdMob initialized successfully');
    } catch (error) {
      console.error(LOG_TAG, 'AdMob initialization failed:', error);
    }
  }

  // ─── Banner Ads ─────────────────────────────────────────────────────────

  getBannerAdUnitId(): string {
    return AD_UNIT_IDS.banner;
  }

  getBannerSize(): BannerAdSize {
    return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
  }

  getRequestOptions() {
    return AD_REQUEST_OPTIONS;
  }

  // ─── Interstitial Ads ───────────────────────────────────────────────────

  private preloadInterstitial(): void {
    if (this.adState.interstitial === 'loading' || this.adState.interstitial === 'loaded') {
      return;
    }

    try {
      console.log(LOG_TAG, 'Preloading interstitial ad...');
      this.adState.interstitial = 'loading';

      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, AD_REQUEST_OPTIONS);

      // Set up event listeners
      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log(LOG_TAG, 'Interstitial loaded');
        this.adState.interstitial = 'loaded';
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn(LOG_TAG, 'Interstitial error:', error);
        this.adState.interstitial = 'error';
        // Retry after delay
        setTimeout(() => this.preloadInterstitial(), 30000);
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log(LOG_TAG, 'Interstitial closed');
        this.adState.interstitial = 'idle';
        // Pre-load next ad
        setTimeout(() => this.preloadInterstitial(), 1000);
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error(LOG_TAG, 'Failed to preload interstitial:', error);
      this.adState.interstitial = 'error';
    }
  }

  isInterstitialReady(): boolean {
    return this.adState.interstitial === 'loaded' && this.interstitialAd !== null;
  }

  async showInterstitial(): Promise<boolean> {
    if (!this.isInterstitialReady()) {
      console.warn(LOG_TAG, 'Interstitial not ready');
      this.preloadInterstitial();
      return false;
    }

    try {
      console.log(LOG_TAG, 'Showing interstitial...');
      await this.interstitialAd!.show();
      return true;
    } catch (error) {
      console.error(LOG_TAG, 'Failed to show interstitial:', error);
      this.adState.interstitial = 'error';
      this.preloadInterstitial();
      return false;
    }
  }

  // ─── Rewarded Ads ───────────────────────────────────────────────────────

  preloadRewarded(): void {
    if (this.adState.rewarded === 'loading' || this.adState.rewarded === 'loaded') {
      return;
    }

    try {
      console.log(LOG_TAG, 'Preloading rewarded ad...');
      this.adState.rewarded = 'loading';

      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded, AD_REQUEST_OPTIONS);

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log(LOG_TAG, 'Rewarded ad loaded');
        this.adState.rewarded = 'loaded';
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log(LOG_TAG, 'Reward earned:', reward);
        if (this.rewardedEarnedCallback) {
          this.rewardedEarnedCallback(reward);
        }
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn(LOG_TAG, 'Rewarded ad error:', error);
        this.adState.rewarded = 'error';
        // Retry after delay
        setTimeout(() => this.preloadRewarded(), 30000);
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log(LOG_TAG, 'Rewarded ad closed');
        this.adState.rewarded = 'idle';
        this.rewardedEarnedCallback = null;
        // Pre-load next ad
        setTimeout(() => this.preloadRewarded(), 1000);
      });

      this.rewardedAd.load();
    } catch (error) {
      console.error(LOG_TAG, 'Failed to preload rewarded ad:', error);
      this.adState.rewarded = 'error';
    }
  }

  isRewardedReady(): boolean {
    return this.adState.rewarded === 'loaded' && this.rewardedAd !== null;
  }

  async showRewarded(
    onRewardEarned: (reward: { type: string; amount: number }) => void,
  ): Promise<boolean> {
    if (!this.isRewardedReady()) {
      console.warn(LOG_TAG, 'Rewarded ad not ready');
      this.preloadRewarded();
      return false;
    }

    try {
      console.log(LOG_TAG, 'Showing rewarded ad...');
      this.rewardedEarnedCallback = onRewardEarned;
      await this.rewardedAd!.show();
      return true;
    } catch (error) {
      console.error(LOG_TAG, 'Failed to show rewarded ad:', error);
      this.adState.rewarded = 'error';
      this.rewardedEarnedCallback = null;
      this.preloadRewarded();
      return false;
    }
  }

  // ─── Cleanup ────────────────────────────────────────────────────────────

  cleanup(): void {
    console.log(LOG_TAG, 'Cleaning up AdMob service...');

    if (this.interstitialAd) {
      this.interstitialAd.removeAllListeners();
      this.interstitialAd = null;
    }

    if (this.rewardedAd) {
      this.rewardedAd.removeAllListeners();
      this.rewardedAd = null;
    }

    this.adState = { interstitial: 'idle', rewarded: 'idle' };
    this.rewardedEarnedCallback = null;
  }
}

export const adMobService = new AdMobService();
export default AdMobService;
