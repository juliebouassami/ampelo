import type { Locale } from './i18n'
import { STYLE_TAGS_PROMPT } from './tags'

export function getTagRules(locale: Locale): string {
  if (locale === 'en') {
    return `Aromatic tag ("style"): choose ONE SINGLE word from this exact list:
${STYLE_TAGS_PROMPT}

Tag rules:
- Base it on the dominant grape variety and terroir, like a grape aroma chart.
- Choose the MOST PRECISE tag possible — do not use the same tag for all red wines.
- Examples: Cabernet → Cassis or Poivré; Pinot Noir → Cerise or Sous-bois; Sauvignon → Agrumes or Minéral; young Champagne → Pomme or Craie; aged Champagne → Vineux, Noix or Cire; Provence rosé → Pêche, Melon or Garrigue; fruity rosé → Fraise or Groseille.`
  }

  return `Tag aromatique ("style") : choisis UN SEUL mot parmi cette liste exacte :
${STYLE_TAGS_PROMPT}

Règles pour le tag :
- Base-toi sur le cépage dominant et le terroir, comme sur une carte des arômes de cépages.
- Choisis le tag le PLUS PRÉCIS possible — ne mets pas le même tag à tous les vins rouges.
- Exemples : Cabernet → Cassis ou Poivré ; Pinot Noir → Cerise ou Sous-bois ; Sauvignon → Agrumes ou Minéral ; Champagne jeune → Pomme ou Craie ; Champagne évolué → Vineux, Noix ou Cire ; Rosé Provence → Pêche, Melon ou Garrigue ; Rosé fruité → Fraise ou Groseille.`
}
