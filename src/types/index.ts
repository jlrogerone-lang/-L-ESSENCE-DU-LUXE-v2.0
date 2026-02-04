// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Master Type Definitions
// 15+ TypeScript Interfaces - Strict Mode
// ============================================================================

// ─── Authentication ─────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface GoogleAuthToken {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scopes: string[];
}

export interface AuthState {
  user: AuthUser | null;
  googleToken: GoogleAuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── 6 PILARES - THE CORE DATA CLASS ───────────────────────────────────────
// MANDATORY: Nombre, Activos Reales, Analisis de Coste, Tecnica Paso a Paso,
//            Factor Tiempo, Compatibilidad Quimica

export interface Pillar1_OperationStrategy {
  operationName: string;
  strategy: string;
  occasion: string;
  season: string;
  timeOfDay: 'day' | 'night' | 'versatile';
  objective: string;
}

export interface Pillar2_RealAssets {
  perfumes: PerfumeAsset[];
  totalPerfumesUsed: number;
  notesProfile: {
    top: string[];
    heart: string[];
    base: string[];
  };
  families: string[];
}

export interface PerfumeAsset {
  id: string;
  name: string;
  brand: string;
  concentration: string;
  retailPriceEUR: number;
  costPerMlEUR: number;
  mlUsed: number;
  role: 'base' | 'heart' | 'accent' | 'booster';
}

export interface Pillar3_CostAnalysis {
  totalRetailPriceEUR: number;
  totalRealCostEUR: number;
  fiscalSavingsEUR: number;
  savingsPercentage: number;
  costPerApplication: number;
  nichePriceEquivalentEUR: number;
  valueRatio: number;
  breakdown: CostBreakdownItem[];
}

export interface CostBreakdownItem {
  perfumeName: string;
  brand: string;
  retailPriceEUR: number;
  realCostEUR: number;
  mlUsed: number;
  savingsEUR: number;
}

export interface Pillar4_StepByStepTechnique {
  steps: TechniqueStep[];
  totalSteps: number;
  estimatedApplicationTimeMinutes: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  warnings: string[];
}

export interface TechniqueStep {
  order: number;
  action: string;
  perfumeUsed: string;
  applicationZone: string;
  technique: 'spray' | 'dab' | 'layer' | 'cloud' | 'pulse_point';
  sprayCount: number;
  waitTimeSeconds: number;
  note: string;
}

export interface Pillar5_TimeFactor {
  totalDryingTimeMinutes: number;
  frictionWarning: boolean;
  frictionAdvice: string;
  layeringOrder: TimingStep[];
  longevityEstimateHours: number;
  sillageRating: number;
  reapplicationAdvice: string;
}

export interface TimingStep {
  order: number;
  perfumeName: string;
  dryTimeSeconds: number;
  mustWaitBeforeNext: boolean;
  instruction: string;
}

export interface Pillar6_ChemicalCompatibility {
  overallCompatibilityPercent: number;
  molecularFamilyMatch: boolean;
  sharedMolecules: string[];
  conflictingNotes: string[];
  synergyScore: number;
  pairAnalysis: PairCompatibility[];
  verdict: 'excellent' | 'good' | 'acceptable' | 'risky' | 'incompatible';
}

export interface PairCompatibility {
  perfumeA: string;
  perfumeB: string;
  compatibilityPercent: number;
  sharedNotes: string[];
  conflictNotes: string[];
}

export interface Audit6Pilars {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  pillar1: Pillar1_OperationStrategy;
  pillar2: Pillar2_RealAssets;
  pillar3: Pillar3_CostAnalysis;
  pillar4: Pillar4_StepByStepTechnique;
  pillar5: Pillar5_TimeFactor;
  pillar6: Pillar6_ChemicalCompatibility;
  overallScore: number;
  isValid: boolean;
  summary: string;
}

// ─── Inventory ──────────────────────────────────────────────────────────────

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  brand: string;
  concentration: 'EDT' | 'EDP' | 'Parfum' | 'Cologne' | 'Extrait';
  category: string;
  retailPriceEUR: number;
  purchasePriceEUR: number;
  mlTotal: number;
  mlRemaining: number;
  costPerMlEUR: number;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  family: string;
  season: string[];
  timeOfDay: 'day' | 'night' | 'versatile';
  longevityHours: number;
  sillage: number;
  isFavorite: boolean;
  imageUrl: string | null;
  addedAt: string;
  updatedAt: string;
}

// ─── Layering ───────────────────────────────────────────────────────────────

export interface Layering {
  id: string;
  userId: string;
  name: string;
  perfumes: string[];
  audit: Audit6Pilars | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  rating: number;
  notes: string;
}

export interface LayeringHistory {
  id: string;
  layeringId: string;
  action: 'created' | 'updated' | 'audited' | 'deleted';
  timestamp: string;
  details: string;
}

// ─── Bibliotheque ───────────────────────────────────────────────────────────

export interface BibliothequeSearchResult {
  id: string;
  title: string;
  description: string;
  link: string;
  thumbnail: string | null;
  brand: string;
  perfumeName: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  retailPriceEUR: number;
  concentration: string;
  family: string;
  source: string;
}

export interface OcrScanResult {
  detectedText: string;
  perfumeName: string | null;
  brand: string | null;
  confidence: number;
  suggestedSearch: string;
  imageUri: string;
}

export interface QuantumGenesisResult {
  id: string;
  generatedLayering: Layering;
  audit: Audit6Pilars;
  reasoning: string;
  compatibilityScore: number;
  suggestedAlternatives: string[];
}

// ─── Monetization ───────────────────────────────────────────────────────────

export type SubscriptionPlan = 'free' | 'alquimist' | 'master' | 'lifetime';

export interface Subscription {
  plan: SubscriptionPlan;
  isActive: boolean;
  expiresAt: string | null;
  purchasedAt: string | null;
  isAutoRenew: boolean;
  entitlements: string[];
  priceEUR: number;
}

export interface SubscriptionLimits {
  maxLayeringsPerMonth: number;
  maxAuditsPerWeek: number;
  ocrEnabled: boolean;
  quantumGenesisEnabled: boolean;
  adsEnabled: boolean;
  pdfExportEnabled: boolean;
  premiumSkinsEnabled: boolean;
}

// ─── Navigation ─────────────────────────────────────────────────────────────

export type RootTabParamList = {
  Atelier: undefined;
  Cava: undefined;
  Bibliotheque: undefined;
  LeNez: undefined;
  Heritage: undefined;
  Reglages: undefined;
};

// ─── Context Types ──────────────────────────────────────────────────────────

export interface AuthContextType {
  state: AuthState;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface InventoryContextType {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: Omit<InventoryItem, 'id' | 'userId' | 'addedAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => InventoryItem | undefined;
  toggleFavorite: (id: string) => Promise<void>;
  refreshInventory: () => Promise<void>;
}

export interface BibliothequeContextType {
  searchResults: BibliothequeSearchResult[];
  favorites: BibliothequeSearchResult[];
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  addFavorite: (result: BibliothequeSearchResult) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  addToInventory: (result: BibliothequeSearchResult) => Promise<void>;
  clearSearch: () => void;
}

export interface MonetizationContextType {
  subscription: Subscription;
  limits: SubscriptionLimits;
  isLoading: boolean;
  isPurchaseInProgress: boolean;
  purchase: (plan: SubscriptionPlan) => Promise<void>;
  restore: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  checkEntitlement: (feature: string) => boolean;
  canAccess: (feature: string) => boolean;
}

// ─── Perfume Catalog Reference ──────────────────────────────────────────────

export interface PerfumeCatalogEntry {
  id: string;
  name: string;
  brand: string;
  concentration: string;
  family: string;
  retailPriceEUR: number;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  season: string[];
  timeOfDay: 'day' | 'night' | 'versatile';
  longevityHours: number;
  sillage: number;
}
