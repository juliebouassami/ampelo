import type { Locale } from './i18n'

export const STYLE_TAGS = [
  // Rouges
  'Cassis', 'Cerise', 'Frambroise', 'Prune', 'Sous-bois', 'Épicé', 'Poivré',
  'Réglisse', 'Tannique', 'Charpenté', 'Terreux',
  // Blancs
  'Agrumes', 'Minéral', 'Floral', 'Beurré', 'Toasté', 'Noisette', 'Miel', 'Frais', 'Moelleux',
  // Rosés
  'Groseille', 'Pêche', 'Fraise', 'Melon', 'Abricot', 'Garrigue', 'Pamplemousse',
  // Champagne & effervescent
  'Brioche', 'Pomme', 'Craie', 'Amande', 'Vineux', 'Noix', 'Cire',
] as const

export type StyleTag = (typeof STYLE_TAGS)[number]

export const STYLE_TAGS_PROMPT = STYLE_TAGS.join(', ')

const TAG_COLORS: Record<string, string> = {
  Cassis: '#4A1E2A',
  Cerise: '#6B2D3E',
  Frambroise: '#8B3A4A',
  Prune: '#5C2D4A',
  'Sous-bois': '#3D4A35',
  Épicé: '#7A4A2E',
  Poivré: '#4A3D35',
  Réglisse: '#3D2E4A',
  Tannique: '#4A1E2A',
  Charpenté: '#5C3D2E',
  Terreux: '#4A4035',
  Agrumes: '#6B5A2E',
  Minéral: '#3D5A6B',
  Floral: '#7A5A6B',
  Beurré: '#8B7A4A',
  Toasté: '#6B4A2E',
  Noisette: '#7A5A35',
  Miel: '#8B6B2E',
  Frais: '#2E6B4A',
  Moelleux: '#8B6B4A',
  Groseille: '#6B3A4A',
  Pêche: '#B87A5A',
  Fraise: '#9B4A5A',
  Melon: '#9B8B5A',
  Abricot: '#B87A4A',
  Garrigue: '#5A6B4A',
  Pamplemousse: '#C49A6A',
  Brioche: '#9B7A4A',
  Pomme: '#6B7A4A',
  Craie: '#8B8B7A',
  Amande: '#9B8B6A',
  Vineux: '#5C4A3D',
  Noix: '#4A3D2E',
  Cire: '#A89B7A',
}

const TAG_LABELS_EN: Record<string, string> = {
  Cassis: 'Blackcurrant',
  Cerise: 'Cherry',
  Frambroise: 'Raspberry',
  Prune: 'Plum',
  'Sous-bois': 'Forest floor',
  Épicé: 'Spicy',
  Poivré: 'Peppery',
  Réglisse: 'Licorice',
  Tannique: 'Tannic',
  Charpenté: 'Structured',
  Terreux: 'Earthy',
  Agrumes: 'Citrus',
  Minéral: 'Mineral',
  Floral: 'Floral',
  Beurré: 'Buttery',
  Toasté: 'Toasty',
  Noisette: 'Hazelnut',
  Miel: 'Honey',
  Frais: 'Fresh',
  Moelleux: 'Off-dry',
  Groseille: 'Redcurrant',
  Pêche: 'Peach',
  Fraise: 'Strawberry',
  Melon: 'Melon',
  Abricot: 'Apricot',
  Garrigue: 'Garrigue',
  Pamplemousse: 'Grapefruit',
  Brioche: 'Brioche',
  Pomme: 'Apple',
  Craie: 'Chalk',
  Amande: 'Almond',
  Vineux: 'Vinous',
  Noix: 'Walnut',
  Cire: 'Wax',
}

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag] ?? '#6B2D3E'
}

export function getTagLabel(tag: string, locale: Locale): string {
  return locale === 'en' ? TAG_LABELS_EN[tag] ?? tag : tag
}
