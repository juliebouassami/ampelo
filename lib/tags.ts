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

export function getPriorityTagRules(locale: Locale, countRule: string): string {
  if (locale === 'en') {
    return `Priority tags ("tags"): return ${countRule} short tags, ordered from most important to least important.

Tag families:
- profile: fresh, round, powerful, elegant, gourmand, complex, mineral, tense, generous
- aromas: red fruit, black fruit, ripe cherry, citrus, floral, herbal, spicy, peppery, smoky, earthy, honey, hazelnut, cacao, leather, forest floor
- structure: soft tannins, marked tannins, bright acidity, round palate, silky texture, long finish, full-bodied, light-bodied
- ageing / evolution: discreet oak, oaky, vanilla, toasted, young, evolved, oxidative, patinated

Rules:
- Do not choose from a closed list. Use natural, useful restaurant-card language.
- Prefer broad, decision-helpful tags over overly precise tasting-school notes.
- Use a precise tag only when it is truly distinctive, for example "ripe cherry" instead of only "cherry".
- No food pairing or usage tags.
- Keep each tag to 1 to 3 words.
- The first 3 tags must be strong enough to display in a wine-list row.
- Also return "style" as the first tag for backward compatibility.`
  }

  return `Tags prioritaires ("tags") : retourne ${countRule} tags courts, du plus important au moins important.

Familles de tags :
- profil : frais, rond, puissant, élégant, gourmand, complexe, minéral, tendu, généreux
- arômes : fruit rouge, fruit noir, cerise mûre, agrumes, floral, herbacé, épicé, poivré, fumé, terreux, miel, noisette, cacao, cuir, sous-bois
- structure : tanins souples, tanins marqués, acidité vive, bouche ronde, texture soyeuse, finale longue, ample, léger
- élevage / évolution : boisé discret, boisé, vanillé, toasté, jeune, évolué, oxydatif, patiné

Règles :
- Ne choisis pas dans une liste fermée. Utilise un langage naturel, utile sur une carte de restaurant.
- Privilégie les tags larges qui aident à choisir le vin plutôt que les notes trop scolaires.
- Utilise un tag précis seulement s'il est vraiment distinctif, par exemple "cerise mûre" plutôt que seulement "cerise".
- Aucun tag d'accord mets-vin ou d'usage.
- Chaque tag doit faire 1 à 3 mots.
- Les 3 premiers tags doivent être assez forts pour être affichés dans une ligne de carte des vins.
- Retourne aussi "style" avec le premier tag pour compatibilité.`
}

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
  const normalized = tag.toLowerCase()

  if (TAG_COLORS[tag]) return TAG_COLORS[tag]
  if (/(tanin|tannin|charpent|structur|ample|puissant|powerful|full)/.test(normalized)) return '#4A1E2A'
  if (/(acid|frais|fresh|tendu|tense|min[ée]ral|mineral|agrum|citrus)/.test(normalized)) return '#3D5A6B'
  if (/(bois|oak|vanill|toast|fum[ée]|smok|evol|patin|oxid)/.test(normalized)) return '#6B4A2E'
  if (/(floral|fleur|violet|rose)/.test(normalized)) return '#7A5A6B'
  if (/(terre|earth|sous-bois|forest|cuir|leather|cacao|miel|honey|noisette|hazelnut)/.test(normalized)) return '#4A4035'

  return '#6B2D3E'
}

export function getTagLabel(tag: string, locale: Locale): string {
  return locale === 'en' ? TAG_LABELS_EN[tag] ?? tag : tag
}

export function getDisplayTags(tags?: string[], fallback?: string, limit = 6): string[] {
  const candidates = [...(tags ?? []), fallback].filter((tag): tag is string => Boolean(tag?.trim()))
  return [...new Set(candidates.map(tag => tag.trim()))].slice(0, limit)
}
