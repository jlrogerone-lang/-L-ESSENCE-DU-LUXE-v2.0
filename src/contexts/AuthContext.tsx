// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Auth Context
// Global authentication state management
// ============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { AuthContextType, AuthState, AuthUser, GoogleAuthToken } from '../types';
import { authService } from '../services/AuthService';
import { firebaseService } from '../services/FirebaseService';

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
      // Google Sign-In flow provides these tokens
      // In production, this uses expo-auth-session or @react-native-google-signin
      const idToken = ''; // Provided by Google Sign-In SDK
      const accessToken = ''; // Provided by Google Sign-In SDK
      await authService.signInWithGoogle(idToken, accessToken);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de connexion',
      }));
    }
  }, []);

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
      console.error('[AuthContext] Token refresh failed:', error);
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
