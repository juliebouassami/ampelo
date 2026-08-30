import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { TAG_RULES } from '@/lib/prompts'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPT = `Tu es un expert en vins français et mondiaux. On te donne les informations d'un vin repéré sur une carte de restaurant.

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
- ${TAG_RULES}

Si le vin est inconnu :
{
  "success": false,
  "erreur": "Vin non référencé."
}`

export async function POST(req: NextRequest) {
  try {
    const { nom, millesime, cepages } = await req.json()

    if (!nom) {
      return NextResponse.json(
        { success: false, erreur: 'Nom du vin manquant.' },
        { status: 400 }
      )
    }

    const userMessage = `Vin : ${nom}${millesime ? `\nMillésime : ${millesime}` : ''}${cepages ? `\nCépages : ${cepages}` : ''}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: PROMPT },
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
      { success: false, erreur: "Erreur lors de l'analyse. Réessayez." },
      { status: 500 }
    )
  }
}
