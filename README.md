# Ampélo

Web app mobile pour identifier les cépages et comprendre les arômes d'un vin — en scannant une bouteille ou une carte de restaurant.

**Live :** [ampelo.vercel.app](https://ampelo.vercel.app)  
**Repo :** [github.com/juliebouassami/ampelo](https://github.com/juliebouassami/ampelo)

---

## Le problème

En France, le cépage n'est pas obligatoire sur l'étiquette. Or c'est lui qui guide les arômes — et choisir un vin sans le connaître, c'est difficile, que ce soit en rayon ou au restaurant.

## La solution

Ampélo photographie une étiquette ou une carte des vins et révèle instantanément :
- Les **cépages** (avec pourcentages estimés si non indiqués)
- Les **notes aromatiques** par famille (Fruité, Floral, Épicé, Terreux, Boisé, Minéral)
- Le **terroir** — ce que le sol apporte au vin
- Un **tag aromatique** précis pour se repérer rapidement

Pas de compte, pas d'installation. Juste un site web accessible depuis le téléphone.

---

## Fonctionnalités

### V1 — Scan bouteille
- Photographier l'étiquette (recto ou verso)
- Obtenir cépages, notes aromatiques, terroir

### V2 — Fiche enrichie + carte restaurant
- Notes aromatiques organisées par familles
- Terroir en une phrase
- **Mode carte** : scanner une page de carte de restaurant → liste de tous les vins détectés
- Filtre par tag aromatique
- Tap sur un vin → fiche détaillée complète

### V3 — Polish (en cours)
- Copy d'accueil expliquant le concept
- 32 tags aromatiques précis (1 mot) inspirés de *La Carte des Vins s'il vous plaît*
- Erreur → rouvrir directement la caméra (pas retour à l'accueil)
- Fiche détaillée au tap depuis la carte restaurant

---

## Tags aromatiques (32)

Un tag par vin, choisi selon le cépage dominant et le terroir.

**Rouges :** Cassis · Cerise · Frambroise · Prune · Sous-bois · Épicé · Poivré · Réglisse · Tannique · Charpenté · Terreux

**Blancs :** Agrumes · Minéral · Floral · Beurré · Toasté · Noisette · Miel · Frais · Moelleux

**Rosés :** Groseille · Pêche · Fraise · Melon · Abricot · Garrigue · Pamplemousse

**Champagne & effervescent :** Brioche · Pomme · Craie · Amande · Vineux · Noix · Cire

---

## Design

- **Palette :** parchemin crème · bordeaux profond · or
- **Typo :** Playfair Display (titres, italique) + Inter (corps)
- **Mobile-first** — pensé pour iPhone au restaurant

---

## Stack technique

- **Next.js 16** + TypeScript + Tailwind CSS v4
- **OpenAI GPT-4o Vision** — analyse des photos d'étiquettes et cartes
- **Vercel** — déploiement
- **GitHub** — [juliebouassami/ampelo](https://github.com/juliebouassami/ampelo)
- Pas de base de données — aucune donnée stockée

---

## Développement local

```bash
# Prérequis : Node.js 20+
git clone https://github.com/juliebouassami/ampelo.git
cd ampelo
npm install

# Créer .env.local avec ta clé OpenAI
echo "OPENAI_API_KEY=sk-..." > .env.local

npm run dev
# → http://localhost:3000
```

---

## Roadmap

| Version | Fonctionnalité |
|---------|---------------|
| V1 ✅ | Scan bouteille → cépages |
| V2 ✅ | Notes aromatiques, terroir, scan carte restaurant |
| V3 🔄 | Tags précis, fiche au tap, retry caméra, copy onboarding |
| V4 | Cave personnelle locale, historique des scans |

---

## Coût

~0,01 $ par analyse OpenAI. Budget recommandé : 5 $ de crédit pour ~500 scans.

---

*Side project de Julie Bouassami — 2026*
