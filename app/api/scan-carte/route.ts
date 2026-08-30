import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { normalizeLocale, type Locale } from '@/lib/i18n'
import { getTagRules } from '@/lib/prompts'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function getPrompt(locale: Locale): string {
  if (locale === 'en') {
    return `You are a wine expert. Analyze this photo of a restaurant wine list.

Return ONLY a valid JSON object, with no markdown, no explanation, and no surrounding text.

Identify every wine listed on the wine list and return:
{
  "success": true,
  "vins": [
    {
      "nom": "wine name or appellation WITHOUT the year (ex: Gevrey-Chambertin, Pouilly-Fumé…)",
      "millesime": "year if visible on the list (ex: 2021) or empty string",
      "cepages": "grape varieties in one line (ex: Pinot Noir, or Grenache · Syrah · Mourvèdre)",
      "notes": "3 to 4 short aromatic notes separated by · (ex: cherry · forest floor · spice)",
      "style": "one tag from the list below"
    }
  ]
}

Rules:
- Identify each distinct wine listed on the menu.
- The vintage must always be in the "millesime" field, never in "nom".
- For grape varieties: infer them from the appellation when they are not shown.
- For notes: concrete and evocative, maximum 4 words/phrases.
- ${getTagRules(locale)}
- If the image is not readable or is not a wine list:

{
  "success": false,
  "erreur": "Explanatory message in English"
}`
  }

  return `Tu es un expert en vins. Analyse cette photo d'une carte des vins de restaurant.

Retourne UNIQUEMENT un objet JSON valide, sans markdown, sans explication, sans texte autour.

Identifie tous les vins listés sur la carte et retourne :
{
  "success": true,
  "vins": [
    {
      "nom": "nom du vin ou appellation SANS l'année (ex: Gevrey-Chambertin, Pouilly-Fumé…)",
      "millesime": "année si visible sur la carte (ex: 2021) ou chaîne vide",
      "cepages": "cépages en une ligne (ex: Pinot Noir, ou Grenache · Syrah · Mourvèdre)",
      "notes": "3 à 4 notes aromatiques courtes séparées par · (ex: cerise · sous-bois · épices)",
      "style": "un tag de la liste ci-dessous"
    }
  ]
}

Règles :
- Identifie chaque vin distinct listé sur la carte.
- Le millésime doit toujours être dans le champ "millesime", jamais dans "nom".
- Pour les cépages : base-toi sur l'appellation si non indiqués.
- Pour les notes : concrètes et évocatrices, maximum 4 mots/expressions.
- ${getTagRules(locale)}
- Si l'image n'est pas lisible ou n'est pas une carte des vins :

{
  "success": false,
  "erreur": "Message en français explicatif"
}`
}

export async function POST(req: NextRequest) {
  let locale: Locale = 'fr'

  try {
    const body = await req.json()
    locale = normalizeLocale(body.locale)
    const { image, mimeType } = body

    if (!image || !mimeType) {
      return NextResponse.json(
        { success: false, erreur: locale === 'en' ? 'Missing image.' : 'Image manquante.' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: getPrompt(locale) },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${image}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
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
    console.error('Scan-carte error:', err)
    return NextResponse.json(
      { success: false, erreur: locale === 'en' ? 'Error during analysis. Please try again.' : "Erreur lors de l'analyse. Réessayez." },
      { status: 500 }
    )
  }
}
