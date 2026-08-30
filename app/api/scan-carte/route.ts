import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { TAG_RULES } from '@/lib/prompts'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPT = `Tu es un expert en vins. Analyse cette photo d'une carte des vins de restaurant.

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
- ${TAG_RULES}
- Si l'image n'est pas lisible ou n'est pas une carte des vins :

{
  "success": false,
  "erreur": "Message en français explicatif"
}`

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()

    if (!image || !mimeType) {
      return NextResponse.json(
        { success: false, erreur: 'Image manquante.' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: PROMPT },
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
      { success: false, erreur: "Erreur lors de l'analyse. Réessayez." },
      { status: 500 }
    )
  }
}
