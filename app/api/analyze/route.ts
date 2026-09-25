import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { normalizeLocale, type Locale } from '@/lib/i18n'
import { getTagRules } from '@/lib/prompts'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function getPrompt(locale: Locale): string {
  if (locale === 'en') {
    return `You are an expert in French and international wines. Analyze this photo of a wine label.

Return ONLY a valid JSON object, with no markdown, no explanation, and no surrounding text.

If you identify the wine:
{
  "success": true,
  "nom": "wine name (ex: Château Margaux, Gevrey-Chambertin, Sancerre…)",
  "domaine": "estate or producer name (ex: Domaine Leflaive, Château Pétrus…)",
  "millesime": "year visible on the label (ex: 2019) or empty string if not visible",
  "appellation": "AOC/AOP appellation or region (ex: Pomerol, Burgundy, Rhône Valley…)",
  "style": "first and most important tag, same value as tags[0]",
  "tags": ["ripe cherry", "soft tannins", "elegant", "floral"],
  "cepages": [
    { "nom": "Cabernet Sauvignon", "pourcentage": 70 },
    { "nom": "Merlot", "pourcentage": 30 }
  ],
  "notes_aromatiques": [
    { "famille": "Fruity", "notes": ["black cherry", "blackcurrant", "plum"] },
    { "famille": "Spicy", "notes": ["pepper", "licorice"] },
    { "famille": "Earthy", "notes": ["forest floor", "mushroom"] }
  ],
  "terroir": "Clay-limestone soils: structure, roundness and a subtle mineral finish"
}

Rules:
- Grape varieties: use percentages shown on the label when present, otherwise estimate from the typical blend of the appellation.
- Aromatic notes: 2 to 4 relevant families among Fruity / Floral / Spicy / Earthy / Oaky / Mineral. 3 to 4 concrete, evocative notes per family.
- Terroir: one short sentence explaining what the soil and region bring to the wine. Start with the soil type when known.
- ${getTagRules(locale, '4 to 6')}

If the image is not a recognizable wine label:
{
  "success": false,
  "erreur": "Message in English (ex: The image is too blurry to identify the wine. · This does not seem to be a wine label. · Wine not found in my knowledge base.)"
}`
  }

  return `Tu es un expert en vins français et mondiaux. Analyse cette photo d'étiquette de vin.

Retourne UNIQUEMENT un objet JSON valide, sans markdown, sans explication, sans texte autour.

Si tu identifies le vin :
{
  "success": true,
  "nom": "nom du vin (ex: Château Margaux, Gevrey-Chambertin, Sancerre…)",
  "domaine": "nom du domaine ou producteur (ex: Domaine Leflaive, Château Pétrus…)",
  "millesime": "année visible sur l'étiquette (ex: 2019) ou chaîne vide si non visible",
  "appellation": "appellation AOC/AOP ou région (ex: Pomerol, Bourgogne, Vallée du Rhône…)",
  "style": "premier tag le plus important, même valeur que tags[0]",
  "tags": ["cerise mûre", "tanins souples", "élégant", "floral"],
  "cepages": [
    { "nom": "Cabernet Sauvignon", "pourcentage": 70 },
    { "nom": "Merlot", "pourcentage": 30 }
  ],
  "notes_aromatiques": [
    { "famille": "Fruité", "notes": ["cerise noire", "cassis", "prune"] },
    { "famille": "Épicé", "notes": ["poivre", "réglisse"] },
    { "famille": "Terreux", "notes": ["sous-bois", "champignon"] }
  ],
  "terroir": "Terrains argilo-calcaires : structure, rondeur et légère minéralité"
}

Règles :
- Cépages : utilise les pourcentages de l'étiquette si présents, sinon estime d'après les proportions typiques de l'appellation.
- Notes aromatiques : 2 à 4 familles pertinentes parmi Fruité / Floral / Épicé / Terreux / Boisé / Minéral. 3 à 4 notes par famille, concrètes et évocatrices.
- Terroir : une phrase courte expliquant ce que le sol et la région apportent au vin. Commence par le type de sol si connu.
- ${getTagRules(locale, '4 à 6')}

Si l'image n'est pas une étiquette de vin reconnaissable :
{
  "success": false,
  "erreur": "Message en français (ex: Image trop floue pour identifier le vin. · Ceci ne semble pas être une étiquette de vin. · Vin non référencé dans ma base de connaissance.)"
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
      { success: false, erreur: locale === 'en' ? 'Error during analysis. Please try again.' : "Erreur lors de l'analyse. Réessayez." },
      { status: 500 }
    )
  }
}
