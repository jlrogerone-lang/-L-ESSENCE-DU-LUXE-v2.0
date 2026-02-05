// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Gemini AI Service
// 6 Pilares Auto-Audit + OCR + Quantum Genesis
// With exponential backoff retry logic for resilient API calls
// ============================================================================

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {
  Audit6Pilars,
  PerfumeEntry,
  QuantumGenesisResult,
  Layering,
} from '../types';
import {
  generateId,
  calculateFiscalSavings,
  estimateNichePriceEquivalent,
  calculateAuditScore,
} from '../utils/helpers';
import { withRetry, GEMINI_RETRY_OPTIONS, isRetryableError } from '../utils/retry';

const LOG_TAG = '[GeminiService]';

// Types for internal use
interface PerfumeAsset {
  id: string;
  name: string;
  brand: string;
  pricePaid: number;
  volumeMl: number;
  concentration: string;
  role: 'base' | 'heart' | 'accent' | 'booster';
}

interface OcrScanResult {
  name: string;
  brand: string;
  confidence: number;
  notes?: string[];
  description?: string;
}

class GeminiService {
  private model: GenerativeModel | null = null;
  private visionModel: GenerativeModel | null = null;
  private genAI: GoogleGenerativeAI | null = null;

  private initializeAI(): GoogleGenerativeAI {
    if (!this.genAI) {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
      if (!apiKey) {
        throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not configured. Please add it to your .env file.');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  private getModel(): GenerativeModel {
    if (!this.model) {
      const genAI = this.initializeAI();
      this.model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
        },
      });
    }
    return this.model;
  }

  private getVisionModel(): GenerativeModel {
    if (!this.visionModel) {
      const genAI = this.initializeAI();
      this.visionModel = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 4096,
        },
      });
    }
    return this.visionModel;
  }

  // ─── 6 Pilares Full Audit ─────────────────────────────────────────────────

  async performFullAudit(
    perfumeItems: PerfumeEntry[],
    layeringName?: string,
  ): Promise<Audit6Pilars> {
    console.log(LOG_TAG, 'Starting 6 Pilares audit for', perfumeItems.length, 'perfumes');

    const perfumeDescriptions = perfumeItems
      .map(
        (p) =>
          `${p.name} by ${p.brand} - Notes: ${p.notes?.join(', ') || 'N/A'} - Price: €${p.pricePaid || 0}`,
      )
      .join('\n');

    const prompt = `You are an expert perfumer and layering consultant. Analyze this perfume layering combination and generate a COMPLETE audit report in JSON format.

PERFUMES IN THIS LAYERING:
${perfumeDescriptions}

LAYERING NAME: "${layeringName || 'Custom Layering'}"

Generate a JSON response with this EXACT structure (all 6 pillars MUST be filled):
{
  "pillar1": {
    "strategyName": "creative name for this layering strategy",
    "strategy": "detailed strategy explanation",
    "occasion": "best occasion for wearing",
    "season": "best season",
    "timeOfDay": "day/night/versatile"
  },
  "pillar2_notes": {
    "topNotes": ["list of combined top notes"],
    "heartNotes": ["list of combined heart notes"],
    "baseNotes": ["list of combined base notes"]
  },
  "pillar4_steps": [
    {
      "order": 1,
      "action": "what to do",
      "perfumeUsed": "which perfume",
      "applicationZone": "where to apply",
      "technique": "spray/dab/layer",
      "sprayCount": 2,
      "waitTimeSeconds": 30
    }
  ],
  "pillar5": {
    "totalDryingTimeMinutes": 5,
    "longevityEstimateHours": 8,
    "sillageRating": 6,
    "reapplicationAdvice": "when to reapply"
  },
  "pillar6": {
    "overallCompatibilityPercent": 85,
    "sharedMolecules": ["list of shared aromatic molecules"],
    "conflictingNotes": ["any conflicting notes"],
    "synergyScore": 80,
    "verdict": "excellent/good/acceptable/risky"
  }
}

Be specific, technical, and thorough. Every field must have a real value.`;

    // Use retry logic for API call
    const generateWithRetry = async () => {
      const model = this.getModel();
      const result = await model.generateContent(prompt);
      return result.response.text();
    };

    const response = await withRetry(generateWithRetry, {
      ...GEMINI_RETRY_OPTIONS,
      retryCondition: (error) => isRetryableError(error),
    });

    const aiData = this.parseJsonResponse(response);

    // Build perfume assets for cost analysis
    const perfumeAssets: PerfumeAsset[] = perfumeItems.map((item, index) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      pricePaid: item.pricePaid || 0,
      volumeMl: item.volumeMl || 100,
      concentration: item.concentration || 'EDP',
      role: (index === 0 ? 'base' : index === 1 ? 'heart' : 'accent') as PerfumeAsset['role'],
    }));

    // PILLAR 3: Live fiscal calculation
    const nichePriceEquivalent = estimateNichePriceEquivalent(
      perfumeItems.flatMap((p) => p.notes || []),
      Math.max(...perfumeItems.map((p) => p.longevityHours || 6)),
      perfumeItems[0]?.sillage || 'moderate',
    );
    const pillar3 = calculateFiscalSavings(perfumeAssets, nichePriceEquivalent);

    const now = new Date().toISOString();
    const auditId = generateId();

    const audit: Audit6Pilars = {
      id: auditId,
      createdAt: now,
      updatedAt: now,
      pillar1: {
        strategyName: aiData.pillar1?.strategyName || layeringName || 'Custom Layering',
        strategy: aiData.pillar1?.strategy || 'Layering harmonieux multi-notes',
        occasion: aiData.pillar1?.occasion || 'Versatile',
        season: aiData.pillar1?.season || 'All seasons',
        timeOfDay: aiData.pillar1?.timeOfDay || 'versatile',
      },
      pillar2: {
        assets: perfumeAssets.map((a) => ({
          name: a.name,
          brand: a.brand,
          pricePaid: a.pricePaid,
          volumeMl: a.volumeMl,
        })),
        notesProfile: {
          top: aiData.pillar2_notes?.topNotes || [],
          heart: aiData.pillar2_notes?.heartNotes || [],
          base: aiData.pillar2_notes?.baseNotes || [],
        },
      },
      pillar3,
      pillar4: {
        steps: (aiData.pillar4_steps || []).map((step: Record<string, unknown>, i: number) => ({
          order: (step.order as number) || i + 1,
          action: (step.action as string) || `Apply ${perfumeItems[i]?.name || 'perfume'}`,
          perfumeUsed: (step.perfumeUsed as string) || perfumeItems[i]?.name || '',
          applicationZone: (step.applicationZone as string) || 'wrists',
          technique: (step.technique as string) || 'spray',
          sprayCount: (step.sprayCount as number) || 2,
          waitTimeSeconds: (step.waitTimeSeconds as number) || 30,
        })),
      },
      pillar5: {
        totalDryingTimeMinutes: aiData.pillar5?.totalDryingTimeMinutes || 5,
        longevityEstimateHours:
          aiData.pillar5?.longevityEstimateHours ||
          Math.max(...perfumeItems.map((p) => p.longevityHours || 6)),
        sillageRating: aiData.pillar5?.sillageRating || 6,
        reapplicationAdvice: aiData.pillar5?.reapplicationAdvice || 'Reapply after 6-8 hours',
      },
      pillar6: {
        overallCompatibilityPercent: aiData.pillar6?.overallCompatibilityPercent || 75,
        sharedMolecules: aiData.pillar6?.sharedMolecules || [],
        conflictingNotes: aiData.pillar6?.conflictingNotes || [],
        synergyScore: aiData.pillar6?.synergyScore || 70,
        verdict: aiData.pillar6?.verdict || 'good',
      },
      auditScore: 0,
      perfumes: perfumeItems.map((p) => p.name),
    };

    // Calculate overall score using live formula
    audit.auditScore = calculateAuditScore(audit);

    console.log(LOG_TAG, 'Audit complete. Score:', audit.auditScore);
    return audit;
  }

  // ─── OCR: Detect Perfume from Image ───────────────────────────────────────

  async detectPerfumeFromImage(imageBase64: string): Promise<OcrScanResult | null> {
    console.log(LOG_TAG, 'Starting OCR detection...');

    const prompt = `Analyze this image of a perfume bottle. Identify:
1. The perfume name
2. The brand
3. Any visible notes or description

Return JSON: { "name": "perfume name", "brand": "brand name", "confidence": 0.0-1.0, "notes": ["note1", "note2"], "description": "brief description" }

If you cannot identify a perfume in the image, return: { "name": null, "brand": null, "confidence": 0 }`;

    const generateWithRetry = async () => {
      const visionModel = this.getVisionModel();
      const result = await visionModel.generateContent([
        prompt,
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
      ]);
      return result.response.text();
    };

    const response = await withRetry(generateWithRetry, {
      ...GEMINI_RETRY_OPTIONS,
      maxAttempts: 2, // Fewer retries for vision tasks
    });

    const data = this.parseJsonResponse(response);

    if (!data.name || data.confidence < 0.3) {
      return null;
    }

    return {
      name: data.name as string,
      brand: (data.brand as string) || 'Unknown',
      confidence: (data.confidence as number) || 0,
      notes: (data.notes as string[]) || [],
      description: (data.description as string) || '',
    };
  }

  // ─── Quantum Genesis: Generate Optimal Layering ────────────────────────────

  async generateQuantumGenesis(
    inventory: PerfumeEntry[],
    occasion?: string,
    season?: string,
  ): Promise<QuantumGenesisResult> {
    console.log(LOG_TAG, 'Generating Quantum Genesis...');

    if (inventory.length < 2) {
      throw new Error('At least 2 perfumes are required for Quantum Genesis');
    }

    const inventoryDesc = inventory
      .map((p) => `${p.name} (${p.brand}) - Notes: ${p.notes?.join(', ') || 'N/A'}`)
      .join('\n');

    const prompt = `You are an expert perfumer. From this inventory, create an OPTIMAL layering combination.

AVAILABLE PERFUMES:
${inventoryDesc}

OCCASION: ${occasion || 'versatile'}
SEASON: ${season || 'all seasons'}

Select 2-3 perfumes that work best together based on molecular compatibility. Return JSON:
{
  "selectedPerfumes": ["exact perfume name 1", "exact perfume name 2"],
  "layeringName": "creative French name for this layering",
  "reasoning": "why these perfumes complement each other molecularly",
  "compatibilityScore": 85,
  "occasion": "ideal occasion",
  "mood": "the mood this creates"
}`;

    const generateWithRetry = async () => {
      const model = this.getModel();
      const result = await model.generateContent(prompt);
      return result.response.text();
    };

    const response = await withRetry(generateWithRetry, GEMINI_RETRY_OPTIONS);
    const data = this.parseJsonResponse(response);

    const selectedNames: string[] = (data.selectedPerfumes as string[]) || [];
    const selectedItems = inventory.filter((item) =>
      selectedNames.some(
        (name) =>
          item.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(item.name.toLowerCase()),
      ),
    );

    // Fallback to first 2 if AI selection doesn't match
    const finalSelection = selectedItems.length >= 2 ? selectedItems : inventory.slice(0, 2);

    // Perform full audit on the generated layering
    const audit = await this.performFullAudit(finalSelection, data.layeringName as string);

    const layering: Layering = {
      id: generateId(),
      name: (data.layeringName as string) || 'Genèse Quantique',
      perfumes: finalSelection,
      audit,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    return {
      layering,
      audit,
      reasoning: (data.reasoning as string) || 'Optimal combination based on molecular compatibility',
      compatibilityScore: (data.compatibilityScore as number) || audit.pillar6.overallCompatibilityPercent,
      occasion: (data.occasion as string) || occasion || 'versatile',
      mood: (data.mood as string) || 'sophisticated',
    };
  }

  // ─── Chemical Similarity Analysis ─────────────────────────────────────────

  async analyzeChemicalSimilarity(
    perfumeA: PerfumeEntry,
    perfumeB: PerfumeEntry,
  ): Promise<{ similarityPercent: number; sharedNotes: string[]; analysis: string }> {
    const prompt = `Compare these two perfumes for layering compatibility:

PERFUME A: ${perfumeA.name} (${perfumeA.brand}) - Notes: ${perfumeA.notes?.join(', ') || 'N/A'}
PERFUME B: ${perfumeB.name} (${perfumeB.brand}) - Notes: ${perfumeB.notes?.join(', ') || 'N/A'}

Return JSON: { "similarityPercent": 0-100, "sharedNotes": ["notes in common"], "analysis": "detailed compatibility analysis for layering" }`;

    const generateWithRetry = async () => {
      const model = this.getModel();
      const result = await model.generateContent(prompt);
      return result.response.text();
    };

    const response = await withRetry(generateWithRetry, GEMINI_RETRY_OPTIONS);
    const data = this.parseJsonResponse(response);

    return {
      similarityPercent: (data.similarityPercent as number) || 0,
      sharedNotes: (data.sharedNotes as string[]) || [],
      analysis: (data.analysis as string) || 'Analysis not available',
    };
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
          console.warn(LOG_TAG, 'Failed to parse extracted JSON from code block');
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
      console.warn(LOG_TAG, 'Could not parse AI response as JSON, returning empty object');
      return {};
    }
  }
}

export const geminiService = new GeminiService();
export default GeminiService;
