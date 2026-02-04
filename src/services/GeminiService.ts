// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Gemini AI Service
// 6 Pilares Auto-Audit + OCR + Quantum Genesis
// ============================================================================

import { GoogleGenerativeAI, GenerativeModel } from 'google-generative-ai';
import {
  Audit6Pilars,
  InventoryItem,
  OcrScanResult,
  QuantumGenesisResult,
  PerfumeAsset,
  Layering,
} from '../types';
import { generateId, calculateFiscalSavings, estimateNichePriceEquivalent, calculateAuditScore } from '../utils/helpers';

const LOG_TAG = '[GeminiService]';

class GeminiService {
  private model: GenerativeModel | null = null;
  private visionModel: GenerativeModel | null = null;

  private getModel(): GenerativeModel {
    if (!this.model) {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    }
    return this.model;
  }

  private getVisionModel(): GenerativeModel {
    if (!this.visionModel) {
      this.getModel(); // initializes both
    }
    return this.visionModel!;
  }

  // ─── 6 Pilares Full Audit ─────────────────────────────────────────────────

  async performFullAudit(
    perfumeItems: InventoryItem[],
    layeringName: string,
    userId: string,
  ): Promise<Audit6Pilars> {
    try {
      console.log(LOG_TAG, 'Starting 6 Pilares audit for:', layeringName);
      const model = this.getModel();

      const perfumeDescriptions = perfumeItems.map((p) =>
        `${p.name} by ${p.brand} (${p.concentration}) - ${p.family} - Top: ${p.notes.top.join(', ')} | Heart: ${p.notes.heart.join(', ')} | Base: ${p.notes.base.join(', ')} - Retail: ${p.retailPriceEUR}EUR - Longevity: ${p.longevityHours}h - Sillage: ${p.sillage}/8`,
      ).join('\n');

      const prompt = `You are an expert perfumer and layering consultant. Analyze this perfume layering combination and generate a COMPLETE audit report in JSON format.

PERFUMES IN THIS LAYERING:
${perfumeDescriptions}

LAYERING NAME: "${layeringName}"

Generate a JSON response with this EXACT structure (all 6 pillars MUST be filled):
{
  "pillar1": {
    "operationName": "creative name for this layering",
    "strategy": "detailed strategy explanation",
    "occasion": "best occasion for wearing",
    "season": "best season",
    "timeOfDay": "day/night/versatile",
    "objective": "what this layering achieves"
  },
  "pillar2_notes": {
    "topNotes": ["list of combined top notes"],
    "heartNotes": ["list of combined heart notes"],
    "baseNotes": ["list of combined base notes"],
    "families": ["olfactory families present"]
  },
  "pillar4_steps": [
    {
      "order": 1,
      "action": "what to do",
      "perfumeUsed": "which perfume",
      "applicationZone": "where to apply",
      "technique": "spray/dab/layer/cloud/pulse_point",
      "sprayCount": 2,
      "waitTimeSeconds": 30,
      "note": "additional tip"
    }
  ],
  "pillar5": {
    "totalDryingTimeMinutes": 5,
    "frictionWarning": true,
    "frictionAdvice": "never rub wrists together",
    "longevityEstimateHours": 8,
    "sillageRating": 6,
    "reapplicationAdvice": "when to reapply"
  },
  "pillar6": {
    "overallCompatibilityPercent": 85,
    "molecularFamilyMatch": true,
    "sharedMolecules": ["list of shared aromatic molecules"],
    "conflictingNotes": ["any conflicting notes"],
    "synergyScore": 80,
    "verdict": "excellent/good/acceptable/risky/incompatible"
  }
}

Be specific, technical, and thorough. Every field must have a real value.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const aiData = this.parseJsonResponse(response);

      // Build perfume assets for cost analysis
      const perfumeAssets: PerfumeAsset[] = perfumeItems.map((item, index) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        concentration: item.concentration,
        retailPriceEUR: item.retailPriceEUR,
        costPerMlEUR: item.costPerMlEUR,
        mlUsed: index === 0 ? 1.5 : 0.8,
        role: (index === 0 ? 'base' : index === 1 ? 'heart' : 'accent') as 'base' | 'heart' | 'accent' | 'booster',
      }));

      // PILLAR 3: Live fiscal calculation
      const nichePriceEquivalent = estimateNichePriceEquivalent(
        perfumeItems.length,
        perfumeItems.reduce((avg, p) => avg + p.sillage, 0) / perfumeItems.length,
      );
      const pillar3 = calculateFiscalSavings(perfumeAssets, nichePriceEquivalent);

      const now = new Date().toISOString();
      const auditId = generateId();

      const audit: Audit6Pilars = {
        id: auditId,
        createdAt: now,
        updatedAt: now,
        userId,
        pillar1: {
          operationName: aiData.pillar1?.operationName || layeringName,
          strategy: aiData.pillar1?.strategy || 'Layering harmonieux multi-notes',
          occasion: aiData.pillar1?.occasion || 'Versatile',
          season: aiData.pillar1?.season || 'All seasons',
          timeOfDay: aiData.pillar1?.timeOfDay || 'versatile',
          objective: aiData.pillar1?.objective || 'Creer une signature olfactive unique',
        },
        pillar2: {
          perfumes: perfumeAssets,
          totalPerfumesUsed: perfumeItems.length,
          notesProfile: {
            top: aiData.pillar2_notes?.topNotes || perfumeItems.flatMap((p) => p.notes.top),
            heart: aiData.pillar2_notes?.heartNotes || perfumeItems.flatMap((p) => p.notes.heart),
            base: aiData.pillar2_notes?.baseNotes || perfumeItems.flatMap((p) => p.notes.base),
          },
          families: aiData.pillar2_notes?.families || [...new Set(perfumeItems.map((p) => p.family))],
        },
        pillar3,
        pillar4: {
          steps: (aiData.pillar4_steps || []).map((step: Record<string, unknown>, i: number) => ({
            order: step.order || i + 1,
            action: step.action || `Appliquer ${perfumeItems[i]?.name || 'parfum'}`,
            perfumeUsed: step.perfumeUsed || perfumeItems[i]?.name || '',
            applicationZone: step.applicationZone || 'poignets',
            technique: step.technique || 'spray',
            sprayCount: step.sprayCount || 2,
            waitTimeSeconds: step.waitTimeSeconds || 30,
            note: step.note || '',
          })),
          totalSteps: aiData.pillar4_steps?.length || perfumeItems.length,
          estimatedApplicationTimeMinutes: Math.ceil(
            (aiData.pillar4_steps || []).reduce(
              (sum: number, s: Record<string, unknown>) => sum + ((s.waitTimeSeconds as number) || 30),
              0,
            ) / 60,
          ) || 3,
          difficultyLevel: perfumeItems.length <= 2 ? 'beginner' : perfumeItems.length <= 3 ? 'intermediate' : 'advanced',
          warnings: aiData.pillar5?.frictionWarning ? ['Ne jamais frotter les poignets ensemble'] : [],
        },
        pillar5: {
          totalDryingTimeMinutes: aiData.pillar5?.totalDryingTimeMinutes || 5,
          frictionWarning: aiData.pillar5?.frictionWarning !== false,
          frictionAdvice: aiData.pillar5?.frictionAdvice || 'Ne jamais frotter - tapotez delicatement',
          layeringOrder: perfumeItems.map((p, i) => ({
            order: i + 1,
            perfumeName: p.name,
            dryTimeSeconds: 30 + i * 15,
            mustWaitBeforeNext: i < perfumeItems.length - 1,
            instruction: `Appliquer ${p.name} et attendre ${30 + i * 15} secondes`,
          })),
          longevityEstimateHours: aiData.pillar5?.longevityEstimateHours ||
            Math.max(...perfumeItems.map((p) => p.longevityHours)),
          sillageRating: aiData.pillar5?.sillageRating ||
            Math.round(perfumeItems.reduce((s, p) => s + p.sillage, 0) / perfumeItems.length),
          reapplicationAdvice: aiData.pillar5?.reapplicationAdvice || 'Reappliquer apres 6-8 heures si necessaire',
        },
        pillar6: {
          overallCompatibilityPercent: aiData.pillar6?.overallCompatibilityPercent || 75,
          molecularFamilyMatch: aiData.pillar6?.molecularFamilyMatch !== false,
          sharedMolecules: aiData.pillar6?.sharedMolecules || [],
          conflictingNotes: aiData.pillar6?.conflictingNotes || [],
          synergyScore: aiData.pillar6?.synergyScore || 70,
          pairAnalysis: [],
          verdict: aiData.pillar6?.verdict || 'good',
        },
        overallScore: 0,
        isValid: true,
        summary: '',
      };

      // Calculate overall score using live formula
      audit.overallScore = calculateAuditScore(audit);
      audit.summary = `${audit.pillar1.operationName}: ${perfumeItems.length} parfums, ${audit.pillar3.fiscalSavingsEUR}EUR economises, compatibilite ${audit.pillar6.overallCompatibilityPercent}%, score ${audit.overallScore}/100`;

      console.log(LOG_TAG, 'Audit complete. Score:', audit.overallScore);
      return audit;
    } catch (error) {
      console.error(LOG_TAG, 'Error performing audit:', error);
      throw error;
    }
  }

  // ─── OCR: Detect Perfume from Image ───────────────────────────────────────

  async detectPerfumeFromImage(imageBase64: string): Promise<OcrScanResult> {
    try {
      console.log(LOG_TAG, 'Starting OCR detection...');
      const visionModel = this.getVisionModel();

      const prompt = `Analyze this image of a perfume bottle. Identify:
1. The perfume name
2. The brand
3. Any text visible on the bottle/box

Return JSON: { "perfumeName": "name", "brand": "brand", "detectedText": "all visible text", "confidence": 0.0-1.0, "suggestedSearch": "search query" }`;

      const result = await visionModel.generateContent([
        prompt,
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
      ]);

      const response = result.response.text();
      const data = this.parseJsonResponse(response);

      return {
        detectedText: data.detectedText || '',
        perfumeName: data.perfumeName || null,
        brand: data.brand || null,
        confidence: data.confidence || 0,
        suggestedSearch: data.suggestedSearch || `${data.brand} ${data.perfumeName}`,
        imageUri: '',
      };
    } catch (error) {
      console.error(LOG_TAG, 'OCR detection failed:', error);
      throw error;
    }
  }

  // ─── Quantum Genesis: Generate Layering ───────────────────────────────────

  async generateQuantumGenesis(
    inventory: InventoryItem[],
    userId: string,
    occasion?: string,
    season?: string,
  ): Promise<QuantumGenesisResult> {
    try {
      console.log(LOG_TAG, 'Generating Quantum Genesis...');
      const model = this.getModel();

      const inventoryDesc = inventory
        .map((p) => `${p.name} (${p.brand}, ${p.family}, ${p.concentration})`)
        .join(', ');

      const prompt = `You are an expert perfumer. From this inventory, create an OPTIMAL layering combination.

AVAILABLE PERFUMES: ${inventoryDesc}
OCCASION: ${occasion || 'versatile'}
SEASON: ${season || 'all'}

Select 2-4 perfumes that work best together. Return JSON:
{
  "selectedPerfumes": ["name1", "name2"],
  "layeringName": "creative name",
  "reasoning": "why these work together",
  "compatibilityScore": 85,
  "alternatives": ["alternative perfume suggestions"]
}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const data = this.parseJsonResponse(response);

      const selectedNames: string[] = data.selectedPerfumes || inventory.slice(0, 2).map((p) => p.name);
      const selectedItems = inventory.filter((item) =>
        selectedNames.some((name) => item.name.toLowerCase().includes(name.toLowerCase())),
      );

      // Perform full audit on the generated layering
      const audit = await this.performFullAudit(
        selectedItems.length >= 2 ? selectedItems : inventory.slice(0, 2),
        data.layeringName || 'Genesis Quantique',
        userId,
      );

      const layering: Layering = {
        id: generateId(),
        userId,
        name: data.layeringName || 'Genesis Quantique',
        perfumes: selectedItems.map((p) => p.id),
        audit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        rating: 0,
        notes: data.reasoning || '',
      };

      return {
        id: generateId(),
        generatedLayering: layering,
        audit,
        reasoning: data.reasoning || 'Combinaison optimale basee sur la compatibilite chimique',
        compatibilityScore: data.compatibilityScore || audit.pillar6.overallCompatibilityPercent,
        suggestedAlternatives: data.alternatives || [],
      };
    } catch (error) {
      console.error(LOG_TAG, 'Quantum Genesis failed:', error);
      throw error;
    }
  }

  // ─── Chemical Similarity Analysis ─────────────────────────────────────────

  async analyzeChemicalSimilarity(
    perfumeA: InventoryItem,
    perfumeB: InventoryItem,
  ): Promise<{ similarityPercent: number; sharedNotes: string[]; analysis: string }> {
    try {
      const model = this.getModel();

      const prompt = `Compare these two perfumes chemically:

PERFUME A: ${perfumeA.name} (${perfumeA.brand}) - Notes: Top[${perfumeA.notes.top.join(',')}] Heart[${perfumeA.notes.heart.join(',')}] Base[${perfumeA.notes.base.join(',')}] Family: ${perfumeA.family}

PERFUME B: ${perfumeB.name} (${perfumeB.brand}) - Notes: Top[${perfumeB.notes.top.join(',')}] Heart[${perfumeB.notes.heart.join(',')}] Base[${perfumeB.notes.base.join(',')}] Family: ${perfumeB.family}

Return JSON: { "similarityPercent": 0-100, "sharedNotes": ["notes in common"], "analysis": "detailed compatibility analysis" }`;

      const result = await model.generateContent(prompt);
      const data = this.parseJsonResponse(result.response.text());

      return {
        similarityPercent: data.similarityPercent || 0,
        sharedNotes: data.sharedNotes || [],
        analysis: data.analysis || 'Analyse non disponible',
      };
    } catch (error) {
      console.error(LOG_TAG, 'Similarity analysis failed:', error);
      throw error;
    }
  }

  // ─── JSON Response Parser ─────────────────────────────────────────────────

  private parseJsonResponse(text: string): Record<string, unknown> {
    try {
      // Try direct parse
      return JSON.parse(text);
    } catch {
      // Extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1].trim());
        } catch {
          console.warn(LOG_TAG, 'Failed to parse extracted JSON');
        }
      }
      // Try finding JSON object in text
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0]);
        } catch {
          console.warn(LOG_TAG, 'Failed to parse found JSON object');
        }
      }
      console.warn(LOG_TAG, 'Could not parse AI response as JSON');
      return {};
    }
  }
}

export const geminiService = new GeminiService();
export default GeminiService;
