import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPT = `Tu es un expert en vins français et mondiaux. Analyse cette photo d'étiquette de vin.

Retourne UNIQUEMENT un objet JSON valide, sans markdown, sans explication, sans texte autour.

Si tu identifies le vin :
{
  "success": true,
  "nom": "nom du vin (ex: Château Margaux, Gevrey-Chambertin, Sancerre…)",
  "domaine": "nom du domaine ou producteur (ex: Domaine Leflaive, Château Pétrus…)",
  "millesime": "année visible sur l'étiquette (ex: 2019) ou chaîne vide si non visible",
  "appellation": "appellation AOC/AOP ou région (ex: Pomerol, Bourgogne, Vallée du Rhône…)",
  "cepages": [
    { "nom": "Cabernet Sauvignon", "pourcentage": 70 },
    { "nom": "Merlot", "pourcentage": 30 }
  ]
}

Règles pour les cépages :
- Si les pourcentages figurent sur l'étiquette, utilise-les.
- Sinon, estime-les d'après les proportions typiques de l'appellation.
- Si tu n'as vraiment aucune base pour estimer, omets le champ "pourcentage".
- Toujours mettre au moins un cépage.

Si l'image n'est pas une étiquette de vin reconnaissable :
{
  "success": false,
  "erreur": "Message en français (ex: Image trop floue pour identifier le vin. · Ceci ne semble pas être une étiquette de vin. · Vin non référencé dans ma base de connaissance.)"
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
      max_tokens: 600,
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
    console.error('Analyze error:', err)
    return NextResponse.json(
      { success: false, erreur: "Erreur lors de l'analyse. Réessayez." },
      { status: 500 }
    )
  }
}
