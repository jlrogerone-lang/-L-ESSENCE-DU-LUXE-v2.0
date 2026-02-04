// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Auth Context
// Global authentication state management
// CONNECTED: expo-auth-session -> AuthService -> FirebaseService
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { AuthContextType, AuthState, AuthUser, GoogleAuthToken } from '../types';
import { authService } from '../services/AuthService';
import { firebaseService } from '../services/FirebaseService';

// Complete pending web browser auth sessions on app startup
WebBrowser.maybeCompleteAuthSession();

const LOG_TAG = '[AuthContext]';

// Google OAuth configuration via environment variables
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';

const discovery = AuthSession.useAutoDiscovery && {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const initialState: AuthState = {
  user: null,
  googleToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshToken: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // Configure Google OAuth with expo-auth-session
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'com.essenceduluxe',
      }),
      extraParams: {
        access_type: 'offline',
      },
    },
    discovery || undefined,
  );

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken && authentication?.accessToken) {
        handleGoogleTokens(authentication.idToken, authentication.accessToken);
      } else if (response.params?.id_token) {
        // Fallback: exchange code for tokens if needed
        handleGoogleTokens(
          response.params.id_token,
          response.params.access_token || '',
        );
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Google Sign-In n\'a pas retourne de tokens valides',
        }));
      }
    } else if (response?.type === 'error') {
      console.error(LOG_TAG, 'Google OAuth error:', response.error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.error?.message || 'Erreur Google Sign-In',
      }));
    } else if (response?.type === 'dismiss') {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [response]);

  // Process Google tokens -> Firebase credential
  const handleGoogleTokens = async (idToken: string, accessToken: string) => {
    try {
      console.log(LOG_TAG, 'Processing Google tokens...');
      const user = await authService.signInWithGoogle(idToken, accessToken);
      console.log(LOG_TAG, 'Firebase auth success:', user.email);
      // State update happens via the auth state listener below
    } catch (error) {
      console.error(LOG_TAG, 'Firebase sign-in with Google tokens failed:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur d\'authentification Firebase',
      }));
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user: AuthUser | null) => {
      if (user) {
        const token = await authService.getStoredToken();
        setState({
          user,
          googleToken: token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        await firebaseService.saveUserProfile(user.uid, user);
      } else {
        setState({
          user: null,
          googleToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.getStoredToken().then((token) => {
        setState({
          user: currentUser,
          googleToken: token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (!request) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Google Sign-In n\'est pas pret. Verifiez la configuration OAuth.',
        }));
        return;
      }

      // Launch the Google OAuth browser prompt
      console.log(LOG_TAG, 'Launching Google Sign-In...');
      await promptAsync();
      // Result handled by the useEffect on `response` above
    } catch (error) {
      console.error(LOG_TAG, 'Sign-in launch failed:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de connexion',
      }));
    }
  }, [request, promptAsync]);

  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await authService.signOut();
      setState({
        user: null,
        googleToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de deconnexion',
      }));
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = await authService.refreshTokenIfNeeded();
      if (token) {
        setState((prev) => ({ ...prev, googleToken: token }));
      }
    } catch (error) {
      console.error(LOG_TAG, 'Token refresh failed:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, signInWithGoogle, signOut, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
