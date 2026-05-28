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
  "style": "un seul mot parmi : Puissant, Minéral, Fruité, Frais, Moelleux",
  "cepages": [
    { "nom": "Cabernet Sauvignon", "pourcentage": 70 },
    { "nom": "Merlot", "pourcentage": 30 }
  ],
  "notes_aromatiques": [
    { "famille": "Fruits", "notes": ["cerise noire", "cassis", "prune"] },
    { "famille": "Épices", "notes": ["poivre", "réglisse"] },
    { "famille": "Terreux", "notes": ["sous-bois", "champignon"] }
  ],
  "terroir": "Terrains argilo-calcaires : structure, rondeur et légère minéralité",
  "elevage": "Élevage en fût de chêne 18 mois : vanille, toast et noisette grillée"
}

Règles :
- Cépages : utilise les pourcentages de l'étiquette si présents, sinon estime d'après l'appellation.
- Notes aromatiques : 2 à 4 familles pertinentes parmi Fruits / Épices / Terreux / Floraux / Boisé. 3 à 5 notes par famille, concrètes et évocatrices.
- Terroir : une phrase courte expliquant ce que le sol et la région apportent au vin. Commence par le type de sol si connu.
- Élevage : une phrase courte si l'élevage est connu ou typique de l'appellation. Si le vin est élevé en inox ou sans élevage notable, indique "Pas d'élevage boisé : fruit pur et fraîcheur préservée". Si inconnu, chaîne vide.
- Style : choisis le plus représentatif du vin parmi Puissant (charpenté, tannique), Minéral (tendu, acide, salin), Fruité (arômes de fruits mûrs, accessible), Frais (léger, aromatique, peu d'alcool), Moelleux (sucre résiduel, texture ronde).

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
    console.error('Analyze error:', err)
    return NextResponse.json(
      { success: false, erreur: "Erreur lors de l'analyse. Réessayez." },
      { status: 500 }
    )
  }
}
