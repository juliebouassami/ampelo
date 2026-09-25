import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { normalizeLocale, type Locale } from '@/lib/i18n'
import { getTagRules } from '@/lib/prompts'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function getPrompt(locale: Locale): string {
  if (locale === 'en') {
    return `You are an expert in French and international wines. You are given information about a wine found on a restaurant wine list.

Return ONLY a valid JSON object, with no markdown, no explanation, and no surrounding text.

{
  "success": true,
  "nom": "wine name or appellation",
  "domaine": "estate or producer if known, otherwise empty string",
  "millesime": "year if provided, otherwise empty string",
  "appellation": "AOC/AOP appellation or region",
  "style": "first and most important tag, same value as tags[0]",
  "tags": ["ripe cherry", "soft tannins", "elegant", "floral"],
  "cepages": [
    { "nom": "Pinot Noir", "pourcentage": 100 }
  ],
  "notes_aromatiques": [
    { "famille": "Fruity", "notes": ["cherry", "raspberry"] },
    { "famille": "Earthy", "notes": ["forest floor", "mushroom"] }
  ],
  "terroir": "Limestone soils: minerality and tension"
}

Rules:
- Use the provided grape varieties when present, otherwise infer them from the appellation.
- If initial priority tags are provided, keep them when they are relevant and complete them up to 4 to 6 tags.
- Estimate percentages based on typical appellation proportions.
- Aromatic notes: 2 to 4 families among Fruity / Floral / Spicy / Earthy / Oaky / Mineral.
- Terroir: one short sentence about what the soil and region bring to the wine.
- ${getTagRules(locale, '4 to 6')}

If the wine is unknown:
{
  "success": false,
  "erreur": "Wine not found."
}`
  }

  return `Tu es un expert en vins français et mondiaux. On te donne les informations d'un vin repéré sur une carte de restaurant.

Retourne UNIQUEMENT un objet JSON valide, sans markdown, sans explication, sans texte autour.

{
  "success": true,
  "nom": "nom du vin ou appellation",
  "domaine": "domaine ou producteur si connu, sinon chaîne vide",
  "millesime": "année si fournie, sinon chaîne vide",
  "appellation": "appellation AOC/AOP ou région",
  "style": "premier tag le plus important, même valeur que tags[0]",
  "tags": ["cerise mûre", "tanins souples", "élégant", "floral"],
  "cepages": [
    { "nom": "Pinot Noir", "pourcentage": 100 }
  ],
  "notes_aromatiques": [
    { "famille": "Fruité", "notes": ["cerise", "framboise"] },
    { "famille": "Terreux", "notes": ["sous-bois", "champignon"] }
  ],
  "terroir": "Terrains calcaires : minéralité et tension"
}

Règles :
- Utilise les cépages fournis si présents, sinon déduis-les de l'appellation.
- Si des tags prioritaires initiaux sont fournis, conserve-les quand ils sont pertinents et complète-les jusqu'à 4 à 6 tags.
- Estime les pourcentages d'après les proportions typiques de l'appellation.
- Notes aromatiques : 2 à 4 familles parmi Fruité / Floral / Épicé / Terreux / Boisé / Minéral.
- Terroir : une phrase courte sur ce que le sol et la région apportent.
- ${getTagRules(locale, '4 à 6')}

Si le vin est inconnu :
{
  "success": false,
  "erreur": "Vin non référencé."
}`
}

export async function POST(req: NextRequest) {
  let locale: Locale = 'fr'

  try {
    const body = await req.json()
    locale = normalizeLocale(body.locale)
    const { nom, millesime, cepages, notes, tags } = body

    if (!nom) {
      return NextResponse.json(
        { success: false, erreur: locale === 'en' ? 'Missing wine name.' : 'Nom du vin manquant.' },
        { status: 400 }
      )
    }

    const userMessage = locale === 'en'
      ? `Wine: ${nom}${millesime ? `\nVintage: ${millesime}` : ''}${cepages ? `\nGrape varieties: ${cepages}` : ''}${notes ? `\nInitial notes: ${notes}` : ''}${Array.isArray(tags) && tags.length ? `\nInitial priority tags: ${tags.join(' · ')}` : ''}`
      : `Vin : ${nom}${millesime ? `\nMillésime : ${millesime}` : ''}${cepages ? `\nCépages : ${cepages}` : ''}${notes ? `\nNotes initiales : ${notes}` : ''}${Array.isArray(tags) && tags.length ? `\nTags prioritaires initiaux : ${tags.join(' · ')}` : ''}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: getPrompt(locale) },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 900,
      temperature: 0.2,
    })

    const raw = response.choices[0].message.content ?? ''
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()

    const data = JSON.parse(cleaned)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Wine-detail error:', err)
    return NextResponse.json(
      { success: false, erreur: locale === 'en' ? 'Error during analysis. Please try again.' : "Erreur lors de l'analyse. Réessayez." },
      { status: 500 }
    )
  }
}
