// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Global Constants
// ============================================================================

import { PerfumeCatalogEntry, SubscriptionLimits, SubscriptionPlan } from '../types';

// ─── App Info ───────────────────────────────────────────────────────────────

export const APP_NAME = "L'Essence du Luxe";
export const APP_VERSION = '2.0.0';
export const APP_BUILD = 1;

// ─── Subscription Plans ─────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, { name: string; priceEUR: number; description: string }> = {
  free: { name: 'Gratuit', priceEUR: 0, description: '5 layerings/mois, 1 audit/semaine, avec ads' },
  alquimist: { name: 'Alquimiste', priceEUR: 4.99, description: 'Audits illimites, sans ads' },
  master: { name: 'Maitre', priceEUR: 9.99, description: 'Premium + PDF export + skins' },
  lifetime: { name: 'A Vie', priceEUR: 49.99, description: 'Acces permanent a tout' },
};

export const PLAN_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> = {
  free: {
    maxLayeringsPerMonth: 5,
    maxAuditsPerWeek: 1,
    ocrEnabled: false,
    quantumGenesisEnabled: false,
    adsEnabled: true,
    pdfExportEnabled: false,
    premiumSkinsEnabled: false,
  },
  alquimist: {
    maxLayeringsPerMonth: Infinity,
    maxAuditsPerWeek: Infinity,
    ocrEnabled: true,
    quantumGenesisEnabled: true,
    adsEnabled: false,
    pdfExportEnabled: false,
    premiumSkinsEnabled: false,
  },
  master: {
    maxLayeringsPerMonth: Infinity,
    maxAuditsPerWeek: Infinity,
    ocrEnabled: true,
    quantumGenesisEnabled: true,
    adsEnabled: false,
    pdfExportEnabled: true,
    premiumSkinsEnabled: true,
  },
  lifetime: {
    maxLayeringsPerMonth: Infinity,
    maxAuditsPerWeek: Infinity,
    ocrEnabled: true,
    quantumGenesisEnabled: true,
    adsEnabled: false,
    pdfExportEnabled: true,
    premiumSkinsEnabled: true,
  },
};

// ─── 6 Pilares Definitions ──────────────────────────────────────────────────

export const AUDIT_PILLARS = [
  { id: 1, name: 'Operation & Strategie', icon: 'compass', description: 'Nom, strategie et objectif du layering' },
  { id: 2, name: 'Actifs Reels', icon: 'flask', description: 'Perfumes reels utilises et leur profil olfactif' },
  { id: 3, name: 'Analyse de Cout', icon: 'calculator', description: 'Cout reel vs prix niche - epargne fiscale' },
  { id: 4, name: 'Technique Pas a Pas', icon: 'list-ol', description: 'Protocole chirurgical application' },
  { id: 5, name: 'Facteur Temps', icon: 'clock', description: 'Temps sechage, friction, longevite' },
  { id: 6, name: 'Compatibilite Chimique', icon: 'atom', description: 'Parentesco molecular et synergie' },
] as const;

// ─── Categories & Classifications ───────────────────────────────────────────

export const FRAGRANCE_FAMILIES = [
  'Floral', 'Oriental', 'Woody', 'Fresh', 'Citrus', 'Aquatic',
  'Gourmand', 'Chypre', 'Fougere', 'Aromatic', 'Leather', 'Musk',
] as const;

export const OCCASIONS = [
  'Daily', 'Work', 'Date Night', 'Formal Event', 'Sport', 'Beach',
  'Evening', 'Casual', 'Wedding', 'Travel',
] as const;

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;

export const CONCENTRATIONS = ['EDT', 'EDP', 'Parfum', 'Cologne', 'Extrait'] as const;

export const LONGEVITY_LABELS: Record<number, string> = {
  1: 'Tres faible (< 1h)',
  2: 'Faible (1-2h)',
  3: 'Moderate (2-4h)',
  4: 'Bonne (4-6h)',
  5: 'Tres bonne (6-8h)',
  6: 'Longue (8-10h)',
  7: 'Excellente (10-12h)',
  8: 'Extreme (12h+)',
};

export const SILLAGE_LABELS: Record<number, string> = {
  1: 'Intime',
  2: 'Pres du corps',
  3: 'Moderate',
  4: 'Notable',
  5: 'Fort',
  6: 'Tres fort',
  7: 'Enorme',
  8: 'Beast mode',
};

// ─── Timeouts & Cache ───────────────────────────────────────────────────────

export const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min
export const API_TIMEOUT_MS = 30000;
export const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 min before expiry

// ─── Error Messages ─────────────────────────────────────────────────────────

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Verifiez votre internet.',
  AUTH_FAILED: "Echec de l'authentification Google.",
  AUTH_CANCELLED: "Connexion annulee par l'utilisateur.",
  TOKEN_EXPIRED: 'Session expiree. Reconnectez-vous.',
  GEMINI_ERROR: "Erreur du moteur IA. Reessayez.",
  SEARCH_ERROR: 'Erreur de recherche. Reessayez.',
  INVENTORY_FULL: 'Inventaire plein pour le plan gratuit.',
  AUDIT_LIMIT: "Limite d'audits atteinte cette semaine.",
  PURCHASE_FAILED: "Erreur lors de l'achat.",
  UNKNOWN_ERROR: 'Une erreur inconnue est survenue.',
};

// ─── Regex Patterns ─────────────────────────────────────────────────────────

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PERFUME_NAME: /^[a-zA-Z0-9\s'-]+$/,
};

// ─── PERFUME CATALOG: 53 PERFUMES ──────────────────────────────────────────
// Boss, Chloe, Gucci, Dior, Chanel, YSL, Prada, Versace, etc.

export const PERFUME_CATALOG: PerfumeCatalogEntry[] = [
  // === HUGO BOSS (5) ===
  {
    id: 'boss-001', name: 'Boss Bottled', brand: 'Hugo Boss', concentration: 'EDT',
    family: 'Woody', retailPriceEUR: 75, notes: { top: ['Apple', 'Citrus', 'Bergamot'], heart: ['Geranium', 'Cinnamon'], base: ['Sandalwood', 'Cedar', 'Vetiver'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'versatile', longevityHours: 6, sillage: 4,
  },
  {
    id: 'boss-002', name: 'Boss The Scent', brand: 'Hugo Boss', concentration: 'EDT',
    family: 'Oriental', retailPriceEUR: 82, notes: { top: ['Ginger', 'Maninka'], heart: ['Lavender'], base: ['Leather', 'Maninka'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 7, sillage: 5,
  },
  {
    id: 'boss-003', name: 'Hugo Man', brand: 'Hugo Boss', concentration: 'EDT',
    family: 'Fresh', retailPriceEUR: 62, notes: { top: ['Green Apple', 'Basil'], heart: ['Sage', 'Geranium'], base: ['Fir', 'Cedar'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 5, sillage: 3,
  },
  {
    id: 'boss-004', name: 'Boss Bottled Infinite', brand: 'Hugo Boss', concentration: 'EDP',
    family: 'Woody', retailPriceEUR: 89, notes: { top: ['Mandarin', 'Apple'], heart: ['Sage', 'Cinnamon'], base: ['Sandalwood', 'Woody'] },
    season: ['Autumn', 'Spring'], timeOfDay: 'versatile', longevityHours: 8, sillage: 5,
  },
  {
    id: 'boss-005', name: 'Boss Bottled Night', brand: 'Hugo Boss', concentration: 'EDT',
    family: 'Woody', retailPriceEUR: 70, notes: { top: ['Lavender', 'Birch'], heart: ['African Violet', 'Jasmine'], base: ['Musk', 'Louro Amarelo'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 6, sillage: 4,
  },

  // === CHLOE (4) ===
  {
    id: 'chloe-001', name: 'Chloe Eau de Parfum', brand: 'Chloe', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 95, notes: { top: ['Peony', 'Lychee', 'Freesia'], heart: ['Rose', 'Lily of the Valley', 'Magnolia'], base: ['Virginia Cedar', 'Amber'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 6, sillage: 4,
  },
  {
    id: 'chloe-002', name: 'Chloe Nomade', brand: 'Chloe', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 98, notes: { top: ['Mirabelle'], heart: ['Freesia', 'Rose'], base: ['Oakmoss', 'Amberwood'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 7, sillage: 5,
  },
  {
    id: 'chloe-003', name: 'Love Story', brand: 'Chloe', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 88, notes: { top: ['Neroli', 'Pear'], heart: ['Stephanotis', 'Orange Blossom'], base: ['Cashmere Wood', 'Cedar'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 5, sillage: 3,
  },
  {
    id: 'chloe-004', name: 'Roses de Chloe', brand: 'Chloe', concentration: 'EDT',
    family: 'Floral', retailPriceEUR: 80, notes: { top: ['Bergamot', 'Aldehydes'], heart: ['Damask Rose', 'Magnolia'], base: ['White Musk', 'Amber'] },
    season: ['Spring'], timeOfDay: 'day', longevityHours: 4, sillage: 3,
  },

  // === GUCCI (5) ===
  {
    id: 'gucci-001', name: 'Gucci Guilty', brand: 'Gucci', concentration: 'EDT',
    family: 'Aromatic', retailPriceEUR: 85, notes: { top: ['Mandarin', 'Pink Pepper', 'Lavender'], heart: ['Lilac', 'Geranium', 'Orange Blossom'], base: ['Patchouli', 'Cedar', 'Amber'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 6, sillage: 4,
  },
  {
    id: 'gucci-002', name: 'Gucci Bloom', brand: 'Gucci', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 102, notes: { top: ['Natural Tuberose'], heart: ['Jasmine Sambac', 'Tuberose'], base: ['Rangoon Creeper'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 7, sillage: 5,
  },
  {
    id: 'gucci-003', name: 'Gucci Pour Homme II', brand: 'Gucci', concentration: 'EDT',
    family: 'Woody', retailPriceEUR: 78, notes: { top: ['Bergamot', 'Black Tea', 'Green Leaves'], heart: ['Cinnamon', 'Heliotrope'], base: ['Musk', 'Tobacco', 'Ebony'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 7, sillage: 5,
  },
  {
    id: 'gucci-004', name: 'Flora by Gucci', brand: 'Gucci', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 92, notes: { top: ['Citrus', 'Peony'], heart: ['Rose', 'Osmanthus'], base: ['Patchouli', 'Sandalwood'] },
    season: ['Spring'], timeOfDay: 'day', longevityHours: 5, sillage: 4,
  },
  {
    id: 'gucci-005', name: 'Gucci Oud', brand: 'Gucci', concentration: 'EDP',
    family: 'Oriental', retailPriceEUR: 155, notes: { top: ['Raspberry', 'Saffron'], heart: ['Bulgarian Rose', 'Oud'], base: ['Amber', 'Musk'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 10, sillage: 7,
  },

  // === DIOR (5) ===
  {
    id: 'dior-001', name: 'Sauvage', brand: 'Dior', concentration: 'EDT',
    family: 'Aromatic', retailPriceEUR: 95, notes: { top: ['Calabrian Bergamot', 'Pepper'], heart: ['Sichuan Pepper', 'Lavender', 'Geranium'], base: ['Ambroxan', 'Cedar', 'Labdanum'] },
    season: ['Spring', 'Summer', 'Autumn', 'Winter'], timeOfDay: 'versatile', longevityHours: 8, sillage: 6,
  },
  {
    id: 'dior-002', name: "J'adore", brand: 'Dior', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 120, notes: { top: ['Pear', 'Melon', 'Bergamot', 'Peach'], heart: ['Jasmine', 'Rose', 'Lily of the Valley'], base: ['Musk', 'Vanilla', 'Cedar', 'Blackberry'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 7, sillage: 5,
  },
  {
    id: 'dior-003', name: 'Dior Homme Intense', brand: 'Dior', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 110, notes: { top: ['Lavender', 'Pear'], heart: ['Iris', 'Ambrette'], base: ['Vetiver', 'Virginia Cedar'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 9, sillage: 6,
  },
  {
    id: 'dior-004', name: 'Miss Dior', brand: 'Dior', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 108, notes: { top: ['Blood Orange', 'Mandarin'], heart: ['Rose', 'Peony', 'Lily of the Valley'], base: ['Patchouli', 'Musk', 'Rosewood'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 7, sillage: 5,
  },
  {
    id: 'dior-005', name: 'Fahrenheit', brand: 'Dior', concentration: 'EDT',
    family: 'Woody', retailPriceEUR: 88, notes: { top: ['Lavender', 'Mandarin', 'Hawthorn'], heart: ['Nutmeg', 'Cedar', 'Violet'], base: ['Leather', 'Vetiver', 'Musk'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 8, sillage: 5,
  },

  // === CHANEL (5) ===
  {
    id: 'chanel-001', name: 'Bleu de Chanel', brand: 'Chanel', concentration: 'EDP',
    family: 'Woody', retailPriceEUR: 115, notes: { top: ['Citrus', 'Mint', 'Pink Pepper'], heart: ['Grapefruit', 'Nutmeg', 'Jasmine'], base: ['Cedar', 'Sandalwood', 'Patchouli', 'Incense'] },
    season: ['Spring', 'Summer', 'Autumn', 'Winter'], timeOfDay: 'versatile', longevityHours: 9, sillage: 6,
  },
  {
    id: 'chanel-002', name: 'Chanel No. 5', brand: 'Chanel', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 135, notes: { top: ['Aldehydes', 'Ylang-Ylang', 'Neroli'], heart: ['Rose', 'Jasmine', 'Lily of the Valley', 'Iris'], base: ['Sandalwood', 'Cedar', 'Vanilla', 'Musk', 'Vetiver'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 10, sillage: 6,
  },
  {
    id: 'chanel-003', name: 'Coco Mademoiselle', brand: 'Chanel', concentration: 'EDP',
    family: 'Oriental', retailPriceEUR: 125, notes: { top: ['Orange', 'Bergamot', 'Grapefruit'], heart: ['Rose', 'Jasmine', 'Litchi'], base: ['Musk', 'Vanilla', 'Vetiver', 'Patchouli'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 8, sillage: 5,
  },
  {
    id: 'chanel-004', name: 'Allure Homme Sport', brand: 'Chanel', concentration: 'EDT',
    family: 'Fresh', retailPriceEUR: 95, notes: { top: ['Orange', 'Aldehydes'], heart: ['Pepper', 'Cedar', 'Neroli'], base: ['Musk', 'Tonka Bean', 'Vetiver'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 6, sillage: 4,
  },
  {
    id: 'chanel-005', name: 'Chance Eau Tendre', brand: 'Chanel', concentration: 'EDT',
    family: 'Floral', retailPriceEUR: 110, notes: { top: ['Grapefruit', 'Quince'], heart: ['Jasmine', 'Hyacinth'], base: ['White Musk', 'Virginia Cedar', 'Amber'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 5, sillage: 3,
  },

  // === YSL (4) ===
  {
    id: 'ysl-001', name: 'La Nuit de L\'Homme', brand: 'Yves Saint Laurent', concentration: 'EDT',
    family: 'Oriental', retailPriceEUR: 88, notes: { top: ['Cardamom', 'Bergamot', 'Lavender'], heart: ['Cedar', 'Cumin', 'Vetiver'], base: ['Coumarin', 'Tonka Bean'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 5, sillage: 4,
  },
  {
    id: 'ysl-002', name: 'Y Eau de Parfum', brand: 'Yves Saint Laurent', concentration: 'EDP',
    family: 'Aromatic', retailPriceEUR: 95, notes: { top: ['Apple', 'Ginger', 'Bergamot'], heart: ['Sage', 'Juniper'], base: ['Amberwood', 'Tonka Bean', 'Cedar', 'Fougere'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 8, sillage: 6,
  },
  {
    id: 'ysl-003', name: 'Black Opium', brand: 'Yves Saint Laurent', concentration: 'EDP',
    family: 'Gourmand', retailPriceEUR: 105, notes: { top: ['Pink Pepper', 'Orange Blossom'], heart: ['Jasmine', 'Coffee'], base: ['Vanilla', 'Patchouli', 'Cedar'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 8, sillage: 6,
  },
  {
    id: 'ysl-004', name: 'Libre', brand: 'Yves Saint Laurent', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 100, notes: { top: ['Mandarin', 'Lavender', 'Black Currant'], heart: ['Orange Blossom', 'Jasmine'], base: ['Vanilla', 'Cedar', 'Musk'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 7, sillage: 5,
  },

  // === PRADA (4) ===
  {
    id: 'prada-001', name: 'Luna Rossa Carbon', brand: 'Prada', concentration: 'EDT',
    family: 'Aromatic', retailPriceEUR: 82, notes: { top: ['Bergamot', 'Pepper'], heart: ['Lavender'], base: ['Ambroxan', 'Patchouli'] },
    season: ['Spring', 'Summer', 'Autumn', 'Winter'], timeOfDay: 'versatile', longevityHours: 8, sillage: 5,
  },
  {
    id: 'prada-002', name: 'L\'Homme', brand: 'Prada', concentration: 'EDT',
    family: 'Aromatic', retailPriceEUR: 85, notes: { top: ['Iris', 'Neroli'], heart: ['Amber', 'Geranium'], base: ['Patchouli', 'Cedar', 'Sandalwood'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 7, sillage: 4,
  },
  {
    id: 'prada-003', name: 'Candy', brand: 'Prada', concentration: 'EDP',
    family: 'Gourmand', retailPriceEUR: 92, notes: { top: ['Caramel'], heart: ['Benzoin', 'Honey'], base: ['Musk', 'Vanilla', 'Benzoin'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 8, sillage: 6,
  },
  {
    id: 'prada-004', name: 'Infusion d\'Iris', brand: 'Prada', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 110, notes: { top: ['Mandarin', 'Galbanum', 'Orange Blossom'], heart: ['Iris', 'Iris Butter'], base: ['Vetiver', 'Cedar', 'Benzoin'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 6, sillage: 3,
  },

  // === VERSACE (4) ===
  {
    id: 'versace-001', name: 'Eros', brand: 'Versace', concentration: 'EDT',
    family: 'Aromatic', retailPriceEUR: 75, notes: { top: ['Mint', 'Green Apple', 'Lemon'], heart: ['Tonka Bean', 'Geranium', 'Ambroxan'], base: ['Vanilla', 'Vetiver', 'Oakmoss', 'Cedar'] },
    season: ['Spring', 'Summer', 'Autumn'], timeOfDay: 'versatile', longevityHours: 7, sillage: 6,
  },
  {
    id: 'versace-002', name: 'Dylan Blue', brand: 'Versace', concentration: 'EDT',
    family: 'Aromatic', retailPriceEUR: 72, notes: { top: ['Calabrian Bergamot', 'Grapefruit', 'Fig Leaf', 'Water'], heart: ['Violet Leaf', 'Papyrus', 'Patchouli', 'Black Pepper', 'Ambroxan'], base: ['Musk', 'Incense', 'Tonka Bean', 'Saffron'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 7, sillage: 5,
  },
  {
    id: 'versace-003', name: 'Bright Crystal', brand: 'Versace', concentration: 'EDT',
    family: 'Floral', retailPriceEUR: 68, notes: { top: ['Pomegranate', 'Yuzu', 'Iced Accord'], heart: ['Peony', 'Magnolia', 'Lotus'], base: ['Musk', 'Amber', 'Mahogany'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 4, sillage: 3,
  },
  {
    id: 'versace-004', name: 'Crystal Noir', brand: 'Versace', concentration: 'EDP',
    family: 'Oriental', retailPriceEUR: 78, notes: { top: ['Ginger', 'Cardamom', 'Pepper'], heart: ['Peony', 'Coconut', 'Gardenia'], base: ['Musk', 'Sandalwood', 'Amber'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 6, sillage: 4,
  },

  // === DOLCE & GABBANA (4) ===
  {
    id: 'dg-001', name: 'The One', brand: 'Dolce & Gabbana', concentration: 'EDP',
    family: 'Oriental', retailPriceEUR: 85, notes: { top: ['Grapefruit', 'Coriander', 'Basil'], heart: ['Ginger', 'Cardamom', 'Orange Blossom'], base: ['Cedar', 'Labdanum', 'Amber'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 7, sillage: 5,
  },
  {
    id: 'dg-002', name: 'Light Blue', brand: 'Dolce & Gabbana', concentration: 'EDT',
    family: 'Citrus', retailPriceEUR: 72, notes: { top: ['Sicilian Lemon', 'Apple', 'Bluebells'], heart: ['Jasmine', 'Bamboo', 'White Rose'], base: ['Cedar', 'Musk', 'Amber'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 4, sillage: 3,
  },
  {
    id: 'dg-003', name: 'K by Dolce & Gabbana', brand: 'Dolce & Gabbana', concentration: 'EDP',
    family: 'Aromatic', retailPriceEUR: 88, notes: { top: ['Blood Orange', 'Juniper', 'Citrus'], heart: ['Geranium', 'Clary Sage', 'Lavender'], base: ['Patchouli', 'Cedar'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'versatile', longevityHours: 7, sillage: 5,
  },
  {
    id: 'dg-004', name: 'The Only One', brand: 'Dolce & Gabbana', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 95, notes: { top: ['Violet', 'Bergamot'], heart: ['Coffee', 'Iris'], base: ['Vanilla', 'Patchouli', 'Caramel'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 8, sillage: 5,
  },

  // === TOM FORD (4) ===
  {
    id: 'tf-001', name: 'Tobacco Vanille', brand: 'Tom Ford', concentration: 'EDP',
    family: 'Gourmand', retailPriceEUR: 280, notes: { top: ['Tobacco Leaf', 'Spicy'], heart: ['Vanilla', 'Cacao', 'Tonka Bean', 'Tobacco Blossom'], base: ['Dried Fruits', 'Woody'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 12, sillage: 7,
  },
  {
    id: 'tf-002', name: 'Oud Wood', brand: 'Tom Ford', concentration: 'EDP',
    family: 'Woody', retailPriceEUR: 260, notes: { top: ['Oud', 'Rosewood', 'Cardamom'], heart: ['Sandalwood', 'Vetiver', 'Palissander'], base: ['Tonka Bean', 'Amber'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 10, sillage: 6,
  },
  {
    id: 'tf-003', name: 'Lost Cherry', brand: 'Tom Ford', concentration: 'EDP',
    family: 'Gourmand', retailPriceEUR: 310, notes: { top: ['Black Cherry', 'Cherry Liqueur'], heart: ['Cherry', 'Almond', 'Turkish Rose', 'Jasmine'], base: ['Peru Balsam', 'Roasted Tonka', 'Sandalwood', 'Vetiver', 'Cedar'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 10, sillage: 7,
  },
  {
    id: 'tf-004', name: 'Black Orchid', brand: 'Tom Ford', concentration: 'EDP',
    family: 'Oriental', retailPriceEUR: 145, notes: { top: ['Truffle', 'Bergamot', 'Black Currant'], heart: ['Orchid', 'Lotus Wood', 'Spices'], base: ['Dark Chocolate', 'Patchouli', 'Vanilla', 'Incense', 'Sandalwood', 'Vetiver'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 10, sillage: 7,
  },

  // === ACQUA DI GIO / ARMANI (4) ===
  {
    id: 'armani-001', name: 'Acqua di Gio', brand: 'Giorgio Armani', concentration: 'EDT',
    family: 'Aquatic', retailPriceEUR: 78, notes: { top: ['Calabrian Bergamot', 'Neroli', 'Green Tangerine'], heart: ['Marine Notes', 'Calone', 'Jasmine', 'Peach'], base: ['Patchouli', 'Cedar', 'Musk', 'Amber'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 5, sillage: 3,
  },
  {
    id: 'armani-002', name: 'Acqua di Gio Profumo', brand: 'Giorgio Armani', concentration: 'Parfum',
    family: 'Aquatic', retailPriceEUR: 105, notes: { top: ['Bergamot', 'Marine Notes'], heart: ['Geranium', 'Sage', 'Rosemary'], base: ['Patchouli', 'Amber', 'Incense'] },
    season: ['Spring', 'Summer', 'Autumn'], timeOfDay: 'versatile', longevityHours: 8, sillage: 5,
  },
  {
    id: 'armani-003', name: 'Armani Code', brand: 'Giorgio Armani', concentration: 'EDT',
    family: 'Oriental', retailPriceEUR: 82, notes: { top: ['Lemon', 'Bergamot'], heart: ['Star Anise', 'Olive Blossom'], base: ['Guaiac Wood', 'Tonka Bean', 'Leather'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 6, sillage: 4,
  },
  {
    id: 'armani-004', name: 'Si', brand: 'Giorgio Armani', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 98, notes: { top: ['Black Currant', 'Mandarin'], heart: ['Rose de Mai', 'Freesia', 'Neroli'], base: ['Vanilla', 'Ambroxan', 'Woody'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 7, sillage: 5,
  },

  // === JEAN PAUL GAULTIER (3) ===
  {
    id: 'jpg-001', name: 'Le Male', brand: 'Jean Paul Gaultier', concentration: 'EDT',
    family: 'Oriental', retailPriceEUR: 72, notes: { top: ['Mint', 'Lavender', 'Bergamot', 'Cardamom'], heart: ['Cinnamon', 'Orange Blossom', 'Cumin'], base: ['Vanilla', 'Tonka Bean', 'Amber', 'Cedar', 'Sandalwood'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 7, sillage: 5,
  },
  {
    id: 'jpg-002', name: 'Le Male Le Parfum', brand: 'Jean Paul Gaultier', concentration: 'EDP',
    family: 'Oriental', retailPriceEUR: 88, notes: { top: ['Cardamom', 'Lavender'], heart: ['Iris', 'Lavandin'], base: ['Vanilla', 'Woody Notes'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 9, sillage: 6,
  },
  {
    id: 'jpg-003', name: 'Scandal', brand: 'Jean Paul Gaultier', concentration: 'EDP',
    family: 'Gourmand', retailPriceEUR: 82, notes: { top: ['Blood Orange', 'Mandarin'], heart: ['Honey', 'Gardenia', 'Jasmine'], base: ['Caramel', 'Tonka Bean', 'Patchouli', 'Beeswax'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 8, sillage: 6,
  },

  // === HERMES (3) ===
  {
    id: 'hermes-001', name: 'Terre d\'Hermes', brand: 'Hermes', concentration: 'EDT',
    family: 'Woody', retailPriceEUR: 95, notes: { top: ['Orange', 'Grapefruit', 'Flint'], heart: ['Pepper', 'Geranium'], base: ['Vetiver', 'Cedar', 'Benzoin'] },
    season: ['Spring', 'Autumn'], timeOfDay: 'versatile', longevityHours: 7, sillage: 5,
  },
  {
    id: 'hermes-002', name: 'Un Jardin sur le Nil', brand: 'Hermes', concentration: 'EDT',
    family: 'Citrus', retailPriceEUR: 88, notes: { top: ['Green Mango', 'Lotus', 'Grapefruit'], heart: ['Peach', 'Orange', 'Calamus'], base: ['Frankincense', 'Vetiver', 'Musk'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 5, sillage: 3,
  },
  {
    id: 'hermes-003', name: 'Twilly d\'Hermes', brand: 'Hermes', concentration: 'EDP',
    family: 'Floral', retailPriceEUR: 92, notes: { top: ['Ginger'], heart: ['Tuberose'], base: ['Sandalwood', 'Vanilla'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 6, sillage: 4,
  },

  // === CAROLINA HERRERA (3) ===
  {
    id: 'ch-001', name: 'Good Girl', brand: 'Carolina Herrera', concentration: 'EDP',
    family: 'Oriental', retailPriceEUR: 95, notes: { top: ['Almond', 'Coffee'], heart: ['Tuberose', 'Jasmine Sambac', 'Orange Blossom'], base: ['Tonka Bean', 'Cacao', 'Cedar', 'Praline'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 8, sillage: 6,
  },
  {
    id: 'ch-002', name: '212 VIP Men', brand: 'Carolina Herrera', concentration: 'EDT',
    family: 'Aromatic', retailPriceEUR: 78, notes: { top: ['Caviar Lime', 'Passion Fruit'], heart: ['Vodka', 'Ginger', 'Mint'], base: ['Amber', 'Musk', 'King Wood'] },
    season: ['Spring', 'Summer'], timeOfDay: 'night', longevityHours: 5, sillage: 4,
  },
  {
    id: 'ch-003', name: 'CH Men Prive', brand: 'Carolina Herrera', concentration: 'EDT',
    family: 'Leather', retailPriceEUR: 82, notes: { top: ['Grapefruit', 'Pomelo'], heart: ['Whiskey', 'Cardamom', 'Cinnamon'], base: ['Leather', 'Woody', 'Benzoin'] },
    season: ['Autumn', 'Winter'], timeOfDay: 'night', longevityHours: 6, sillage: 4,
  },

  // === CREED (3) ===
  {
    id: 'creed-001', name: 'Aventus', brand: 'Creed', concentration: 'EDP',
    family: 'Chypre', retailPriceEUR: 340, notes: { top: ['Pineapple', 'Bergamot', 'Black Currant', 'Apple'], heart: ['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'], base: ['Musk', 'Oakmoss', 'Ambergris', 'Vanilla'] },
    season: ['Spring', 'Summer', 'Autumn', 'Winter'], timeOfDay: 'versatile', longevityHours: 10, sillage: 7,
  },
  {
    id: 'creed-002', name: 'Green Irish Tweed', brand: 'Creed', concentration: 'EDP',
    family: 'Aromatic', retailPriceEUR: 300, notes: { top: ['Lemon Verbena', 'Iris Leaves'], heart: ['Violet Leaves'], base: ['Ambergris', 'Sandalwood', 'Mysore'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 9, sillage: 5,
  },
  {
    id: 'creed-003', name: 'Silver Mountain Water', brand: 'Creed', concentration: 'EDP',
    family: 'Fresh', retailPriceEUR: 290, notes: { top: ['Bergamot', 'Mandarin', 'Neroli'], heart: ['Green Tea', 'Black Currant'], base: ['Musk', 'Sandalwood', 'Galbanum'] },
    season: ['Spring', 'Summer'], timeOfDay: 'day', longevityHours: 7, sillage: 4,
  },
];

// Total: 53 perfumes across 13 brands
export const TOTAL_CATALOG_PERFUMES = PERFUME_CATALOG.length;

export const CATALOG_BRANDS = [...new Set(PERFUME_CATALOG.map(p => p.brand))];
