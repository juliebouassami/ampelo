import { STYLE_TAGS_PROMPT } from './tags'

export const TAG_RULES = `Tag aromatique ("style") : choisis UN SEUL mot parmi cette liste exacte :
${STYLE_TAGS_PROMPT}

Règles pour le tag :
- Base-toi sur le cépage dominant et le terroir, comme sur une carte des arômes de cépages.
- Choisis le tag le PLUS PRÉCIS possible — ne mets pas le même tag à tous les vins rouges.
- Exemples : Cabernet → Cassis ou Poivré ; Pinot Noir → Cerise ou Sous-bois ; Sauvignon → Agrumes ou Minéral ; Champagne jeune → Pomme ou Craie ; Champagne évolué → Vineux, Noix ou Cire ; Rosé Provence → Pêche, Melon ou Garrigue ; Rosé fruité → Fraise ou Groseille.`
