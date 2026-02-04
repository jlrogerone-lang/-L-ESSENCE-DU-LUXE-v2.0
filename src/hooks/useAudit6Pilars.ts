// ============================================================================
// L'ESSENCE DU LUXE v2.0 - useAudit6Pilars Hook
// Core hook for 6 Pillar audits, Quantum Genesis, and OCR
// Connects: GeminiService -> FirebaseService -> UI
// ============================================================================

import { useState, useCallback } from 'react';
import { Audit6Pilars, InventoryItem, OcrScanResult, QuantumGenesisResult } from '../types';
import { geminiService } from '../services/GeminiService';
import { firebaseService } from '../services/FirebaseService';
import { useAuth } from './useAuth';
import { AUDIT_PILLARS } from '../utils/constants';
import { calculateAuditScore } from '../utils/helpers';

export function useAudit6Pilars() {
  const [currentAudit, setCurrentAudit] = useState<Audit6Pilars | null>(null);
  const [audits, setAudits] = useState<Audit6Pilars[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrScanResult | null>(null);
  const [genesisResult, setGenesisResult] = useState<QuantumGenesisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getUserId } = useAuth();

  // ─── Perform Full 6 Pillar Audit ──────────────────────────────────────────

  const performAudit = useCallback(
    async (perfumes: InventoryItem[], layeringName: string): Promise<Audit6Pilars> => {
      const userId = getUserId();
      if (!userId) throw new Error('Non authentifie');
      if (perfumes.length < 2) throw new Error('Minimum 2 parfums requis');

      try {
        setIsAuditing(true);
        setError(null);

        const audit = await geminiService.performFullAudit(perfumes, layeringName, userId);
        await firebaseService.saveAudit(userId, audit);

        setCurrentAudit(audit);
        setAudits((prev) => [audit, ...prev]);
        return audit;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur audit';
        setError(message);
        throw err;
      } finally {
        setIsAuditing(false);
      }
    },
    [getUserId],
  );

  // ─── Get Stored Audit ─────────────────────────────────────────────────────

  const getAudit = useCallback(
    async (auditId: string): Promise<Audit6Pilars | null> => {
      const userId = getUserId();
      if (!userId) return null;
      try {
        const audit = await firebaseService.getAudit(userId, auditId);
        if (audit) setCurrentAudit(audit);
        return audit;
      } catch {
        return null;
      }
    },
    [getUserId],
  );

  // ─── Load All Audits ──────────────────────────────────────────────────────

  const loadAudits = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const allAudits = await firebaseService.getAllAudits(userId);
      setAudits(allAudits);
    } catch (err) {
      console.error('[useAudit6Pilars] Error loading audits:', err);
    }
  }, [getUserId]);

  // ─── Quantum Genesis ──────────────────────────────────────────────────────

  const generateQuantumGenesis = useCallback(
    async (
      inventory: InventoryItem[],
      occasion?: string,
      season?: string,
    ): Promise<QuantumGenesisResult> => {
      const userId = getUserId();
      if (!userId) throw new Error('Non authentifie');
      if (inventory.length < 2) throw new Error('Minimum 2 parfums en inventaire');

      try {
        setIsAuditing(true);
        setError(null);

        const result = await geminiService.generateQuantumGenesis(
          inventory,
          userId,
          occasion,
          season,
        );

        setGenesisResult(result);
        setCurrentAudit(result.audit);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur Genesis';
        setError(message);
        throw err;
      } finally {
        setIsAuditing(false);
      }
    },
    [getUserId],
  );

  // ─── OCR Detection ────────────────────────────────────────────────────────

  const detectFromImage = useCallback(
    async (imageBase64: string): Promise<OcrScanResult> => {
      try {
        setIsAuditing(true);
        setError(null);
        const result = await geminiService.detectPerfumeFromImage(imageBase64);
        setOcrResult(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur OCR';
        setError(message);
        throw err;
      } finally {
        setIsAuditing(false);
      }
    },
    [],
  );

  // ─── Pillar Helpers ───────────────────────────────────────────────────────

  const getPillarExplanation = useCallback((pillarNumber: number): string => {
    const pillar = AUDIT_PILLARS.find((p) => p.id === pillarNumber);
    return pillar ? `${pillar.name}: ${pillar.description}` : '';
  }, []);

  const getOverallScore = useCallback((): number => {
    if (!currentAudit) return 0;
    return calculateAuditScore(currentAudit);
  }, [currentAudit]);

  const isAuditValid = useCallback((): boolean => {
    if (!currentAudit) return false;
    return (
      !!currentAudit.pillar1.operationName &&
      currentAudit.pillar2.totalPerfumesUsed > 0 &&
      currentAudit.pillar3.totalRealCostEUR >= 0 &&
      currentAudit.pillar4.totalSteps > 0 &&
      currentAudit.pillar5.longevityEstimateHours > 0 &&
      currentAudit.pillar6.overallCompatibilityPercent >= 0
    );
  }, [currentAudit]);

  const getAuditSummary = useCallback((): string => {
    if (!currentAudit) return 'Aucun audit en cours';
    return currentAudit.summary;
  }, [currentAudit]);

  const clearResults = useCallback(() => {
    setCurrentAudit(null);
    setOcrResult(null);
    setGenesisResult(null);
    setError(null);
  }, []);

  return {
    currentAudit,
    audits,
    isAuditing,
    ocrResult,
    genesisResult,
    error,
    performAudit,
    getAudit,
    loadAudits,
    generateQuantumGenesis,
    detectFromImage,
    getPillarExplanation,
    getOverallScore,
    isAuditValid,
    getAuditSummary,
    clearResults,
  };
}

export default useAudit6Pilars;
