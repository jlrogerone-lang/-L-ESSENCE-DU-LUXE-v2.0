// ============================================================================
// L'ESSENCE DU LUXE v2.0 - useAuth Hook
// Convenience hook wrapping AuthContext
// ============================================================================

import { useCallback, useMemo } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const { state, signInWithGoogle, signOut, refreshToken } = useAuthContext();

  const isLoggedIn = useMemo(() => state.isAuthenticated && !!state.user, [state]);

  const getUserEmail = useCallback((): string => {
    return state.user?.email || '';
  }, [state.user]);

  const getUserId = useCallback((): string => {
    return state.user?.uid || '';
  }, [state.user]);

  const getUserDisplayName = useCallback((): string => {
    return state.user?.displayName || '';
  }, [state.user]);

  const getUserPhoto = useCallback((): string | null => {
    return state.user?.photoURL || null;
  }, [state.user]);

  const handleSignIn = useCallback(async () => {
    await signInWithGoogle();
  }, [signInWithGoogle]);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const ensureTokenFresh = useCallback(async () => {
    await refreshToken();
  }, [refreshToken]);

  return {
    user: state.user,
    googleToken: state.googleToken,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    isLoggedIn,
    getUserEmail,
    getUserId,
    getUserDisplayName,
    getUserPhoto,
    signIn: handleSignIn,
    signOut: handleSignOut,
    ensureTokenFresh,
  };
}

export default useAuth;
