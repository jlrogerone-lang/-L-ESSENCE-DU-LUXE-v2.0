// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Authentication Service
// Firebase Auth + Google Sign-In (Zero Config for User)
// Uses shared Firebase config - NO duplicate initialization
// ============================================================================

import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  User,
} from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { AuthUser, GoogleAuthToken } from '../types';
import { getFirebaseApp } from './firebaseConfig';

const LOG_TAG = '[AuthService]';

// ─── Secure Store Keys ──────────────────────────────────────────────────────

const SECURE_KEYS = {
  GOOGLE_ID_TOKEN: 'google_id_token',
  GOOGLE_ACCESS_TOKEN: 'google_access_token',
  GOOGLE_REFRESH_TOKEN: 'google_refresh_token',
  TOKEN_EXPIRES_AT: 'token_expires_at',
};

class AuthService {
  private auth: Auth;
  private authStateListeners: Array<(user: AuthUser | null) => void> = [];

  constructor() {
    this.auth = getAuth(getFirebaseApp());
    this.initAuthStateListener();
  }

  // ─── Auth State Listener ──────────────────────────────────────────────────

  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (firebaseUser: User | null) => {
      const user = firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
      this.authStateListeners.forEach((listener) => listener(user));
    });
  }

  onAuthStateChange(listener: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(listener);
    return () => {
      this.authStateListeners = this.authStateListeners.filter((l) => l !== listener);
    };
  }

  // ─── Sign In with Google ──────────────────────────────────────────────────

  async signInWithGoogle(idToken: string, accessToken: string): Promise<AuthUser> {
    try {
      if (!idToken) {
        throw new Error('Google ID token is required for authentication');
      }
      console.log(LOG_TAG, 'Signing in with Google...');
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const result = await signInWithCredential(this.auth, credential);

      // Save tokens securely
      await this.saveTokens({
        idToken,
        accessToken,
        refreshToken: result.user.refreshToken || '',
        expiresAt: Date.now() + 3600 * 1000, // 1 hour
        scopes: ['openid', 'profile', 'email'],
      });

      console.log(LOG_TAG, 'Sign in successful:', result.user.email);
      return this.mapFirebaseUser(result.user);
    } catch (error) {
      console.error(LOG_TAG, 'Sign in failed:', error);
      throw error;
    }
  }

  // ─── Sign Out ─────────────────────────────────────────────────────────────

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
      await this.clearTokens();
      console.log(LOG_TAG, 'Signed out successfully');
    } catch (error) {
      console.error(LOG_TAG, 'Sign out failed:', error);
      throw error;
    }
  }

  // ─── Token Management ─────────────────────────────────────────────────────

  private async saveTokens(token: GoogleAuthToken): Promise<void> {
    await SecureStore.setItemAsync(SECURE_KEYS.GOOGLE_ID_TOKEN, token.idToken);
    await SecureStore.setItemAsync(SECURE_KEYS.GOOGLE_ACCESS_TOKEN, token.accessToken);
    await SecureStore.setItemAsync(SECURE_KEYS.GOOGLE_REFRESH_TOKEN, token.refreshToken);
    await SecureStore.setItemAsync(SECURE_KEYS.TOKEN_EXPIRES_AT, String(token.expiresAt));
  }

  async getStoredToken(): Promise<GoogleAuthToken | null> {
    try {
      const idToken = await SecureStore.getItemAsync(SECURE_KEYS.GOOGLE_ID_TOKEN);
      const accessToken = await SecureStore.getItemAsync(SECURE_KEYS.GOOGLE_ACCESS_TOKEN);
      const refreshToken = await SecureStore.getItemAsync(SECURE_KEYS.GOOGLE_REFRESH_TOKEN);
      const expiresAtStr = await SecureStore.getItemAsync(SECURE_KEYS.TOKEN_EXPIRES_AT);

      if (!idToken || !accessToken) return null;

      return {
        idToken,
        accessToken,
        refreshToken: refreshToken || '',
        expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : 0,
        scopes: ['openid', 'profile', 'email'],
      };
    } catch (error) {
      console.error(LOG_TAG, 'Error reading stored token:', error);
      return null;
    }
  }

  isTokenExpired(token: GoogleAuthToken): boolean {
    const bufferMs = 5 * 60 * 1000; // 5 min buffer
    return Date.now() >= token.expiresAt - bufferMs;
  }

  async refreshTokenIfNeeded(): Promise<GoogleAuthToken | null> {
    const token = await this.getStoredToken();
    if (!token) return null;
    if (!this.isTokenExpired(token)) return token;

    // Firebase handles token refresh internally
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const freshIdToken = await currentUser.getIdToken(true);
      const refreshedToken: GoogleAuthToken = {
        ...token,
        idToken: freshIdToken,
        expiresAt: Date.now() + 3600 * 1000,
      };
      await this.saveTokens(refreshedToken);
      return refreshedToken;
    }
    return null;
  }

  private async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(SECURE_KEYS.GOOGLE_ID_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_KEYS.GOOGLE_ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_KEYS.GOOGLE_REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_KEYS.TOKEN_EXPIRES_AT);
  }

  // ─── Current User ─────────────────────────────────────────────────────────

  getCurrentUser(): AuthUser | null {
    const user = this.auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  getFirebaseAuth(): Auth {
    return this.auth;
  }

  // ─── User Mapping ─────────────────────────────────────────────────────────

  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime || new Date().toISOString(),
      lastLoginAt: user.metadata.lastSignInTime || new Date().toISOString(),
    };
  }
}

export const authService = new AuthService();
export default AuthService;
