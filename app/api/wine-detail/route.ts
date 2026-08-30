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
  "style": "one tag from the list below",
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
- Estimate percentages based on typical appellation proportions.
- Aromatic notes: 2 to 4 families among Fruity / Floral / Spicy / Earthy / Oaky / Mineral.
- Terroir: one short sentence about what the soil and region bring to the wine.
- ${getTagRules(locale)}

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
  "style": "un tag de la liste ci-dessous",
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
- Estime les pourcentages d'après les proportions typiques de l'appellation.
- Notes aromatiques : 2 à 4 familles parmi Fruité / Floral / Épicé / Terreux / Boisé / Minéral.
- Terroir : une phrase courte sur ce que le sol et la région apportent.
- ${getTagRules(locale)}

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
    const { nom, millesime, cepages } = body

    if (!nom) {
      return NextResponse.json(
        { success: false, erreur: locale === 'en' ? 'Missing wine name.' : 'Nom du vin manquant.' },
        { status: 400 }
      )
    }

    const userMessage = locale === 'en'
      ? `Wine: ${nom}${millesime ? `\nVintage: ${millesime}` : ''}${cepages ? `\nGrape varieties: ${cepages}` : ''}`
      : `Vin : ${nom}${millesime ? `\nMillésime : ${millesime}` : ''}${cepages ? `\nCépages : ${cepages}` : ''}`

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
