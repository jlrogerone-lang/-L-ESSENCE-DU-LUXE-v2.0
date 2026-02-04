// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Layering Protocol Templates
// Pre-built audit templates for common layering combinations
// ============================================================================

import { Audit6Pilars } from '../types';

export interface ProtocolTemplate {
  id: string;
  name: string;
  description: string;
  perfumeIds: string[];
  season: string;
  occasion: string;
  timeOfDay: 'day' | 'night' | 'versatile';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const PROTOCOL_TEMPLATES: ProtocolTemplate[] = [
  {
    id: 'proto-001',
    name: 'Le Gentleman Classique',
    description: 'Combinaison elegante pour homme, woody-aromatic pour le bureau',
    perfumeIds: ['boss-001', 'dior-001'],
    season: 'Autumn',
    occasion: 'Work',
    timeOfDay: 'day',
    difficulty: 'beginner',
  },
  {
    id: 'proto-002',
    name: 'Nuit Orientale',
    description: 'Seduction orientale pour soiree speciale',
    perfumeIds: ['ysl-001', 'dg-001'],
    season: 'Winter',
    occasion: 'Date Night',
    timeOfDay: 'night',
    difficulty: 'intermediate',
  },
  {
    id: 'proto-003',
    name: 'Jardin de Fleurs',
    description: 'Bouquet floral lumineux pour le printemps',
    perfumeIds: ['chloe-001', 'gucci-002'],
    season: 'Spring',
    occasion: 'Daily',
    timeOfDay: 'day',
    difficulty: 'beginner',
  },
  {
    id: 'proto-004',
    name: 'Le Roi Oud',
    description: 'Layering premium ultra-luxe avec oud',
    perfumeIds: ['tf-002', 'gucci-005'],
    season: 'Winter',
    occasion: 'Formal Event',
    timeOfDay: 'night',
    difficulty: 'expert',
  },
  {
    id: 'proto-005',
    name: 'Fraicheur Marine',
    description: 'Aquatique et frais pour les journees chaudes',
    perfumeIds: ['armani-001', 'versace-002'],
    season: 'Summer',
    occasion: 'Beach',
    timeOfDay: 'day',
    difficulty: 'beginner',
  },
  {
    id: 'proto-006',
    name: 'Gourmand Nocturne',
    description: 'Douceur gourmande pour soirees hivernales',
    perfumeIds: ['ysl-003', 'prada-003'],
    season: 'Winter',
    occasion: 'Date Night',
    timeOfDay: 'night',
    difficulty: 'intermediate',
  },
  {
    id: 'proto-007',
    name: 'Signature Versatile',
    description: 'Signature universelle pour toutes occasions',
    perfumeIds: ['chanel-001', 'dior-001'],
    season: 'All',
    occasion: 'Daily',
    timeOfDay: 'versatile',
    difficulty: 'beginner',
  },
  {
    id: 'proto-008',
    name: 'Triple Menace',
    description: 'Layering 3 parfums pour projection maximale',
    perfumeIds: ['versace-001', 'jpg-001', 'tf-001'],
    season: 'Winter',
    occasion: 'Evening',
    timeOfDay: 'night',
    difficulty: 'advanced',
  },
  {
    id: 'proto-009',
    name: 'Elegance Feminine',
    description: 'Sophistication florale pour femmes',
    perfumeIds: ['dior-002', 'chanel-003'],
    season: 'Spring',
    occasion: 'Formal Event',
    timeOfDay: 'day',
    difficulty: 'intermediate',
  },
  {
    id: 'proto-010',
    name: 'Le Aventurier',
    description: 'Aventure olfactive pour homme audacieux',
    perfumeIds: ['creed-001', 'prada-001'],
    season: 'Autumn',
    occasion: 'Casual',
    timeOfDay: 'versatile',
    difficulty: 'intermediate',
  },
];

export const TOTAL_PROTOCOLS = PROTOCOL_TEMPLATES.length;
