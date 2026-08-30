export type Locale = 'fr' | 'en'

export const DEFAULT_LOCALE: Locale = 'fr'

export function normalizeLocale(value: unknown): Locale {
  return value === 'en' ? 'en' : DEFAULT_LOCALE
}

export const ui = {
  fr: {
    meta: {
      title: "Ampélo — Découvrez les cépages de n'importe quel vin",
    },
    home: {
      intro1: "Le cépage façonne les arômes et le caractère du vin.",
      intro1b: "Pourtant, il n'est pas toujours indiqué.",
      bottle: 'Scannez une bouteille pour découvrir son cépage, ses arômes et son profil.',
      restaurant: "Au restaurant, scannez une carte pour comparer les vins et choisir celui qui s'accorde le mieux à vos envies.",
      scanBottle: 'Scanner une bouteille',
      bottleHint: 'étiquette recto ou verso',
      scanList: 'Scanner une carte des vins',
      switchLanguage: 'EN',
    },
    loading: 'Consultation de la cave…',
    error: {
      wineUnknown: 'Vin non identifié.',
      wineHelp: 'Essayez avec une photo plus nette, de face, bien éclairée.',
      listUnknown: 'Carte non reconnue.',
      listHelp: 'Essayez avec une photo plus nette, bien éclairée, en face de la carte.',
      connection: 'Erreur de connexion. Réessayez.',
    },
    actions: {
      retry: 'Réessayer',
      back: 'Retour',
      scanAnotherBottle: 'Scanner une autre bouteille',
      scanAnotherList: 'Scanner une autre carte',
      backToList: 'Retour à la carte',
    },
    result: {
      grapeVarieties: 'Cépages',
      aromaticNotes: 'Notes aromatiques',
      terroir: 'Terroir',
      listTitle: 'La carte',
      all: 'Tous',
      noWineForTag: 'Aucun vin pour ce tag.',
    },
  },
  en: {
    meta: {
      title: "Ampélo — Discover any wine's grape varieties",
    },
    home: {
      intro1: "Grape variety shapes a wine's aromas and character.",
      intro1b: 'Yet it is not always shown on the label.',
      bottle: 'Scan a bottle to discover its grape variety, aromas, and profile.',
      restaurant: 'At the restaurant, scan the wine list to compare bottles and choose with confidence.',
      scanBottle: 'Scan a bottle',
      bottleHint: 'front or back label',
      scanList: 'Scan a wine list',
      switchLanguage: 'FR',
    },
    loading: 'Consulting the cellar…',
    error: {
      wineUnknown: 'Wine not identified.',
      wineHelp: 'Try again with a sharper, front-facing, well-lit photo.',
      listUnknown: 'Wine list not recognized.',
      listHelp: 'Try again with a sharper, well-lit photo taken straight on.',
      connection: 'Connection error. Please try again.',
    },
    actions: {
      retry: 'Try again',
      back: 'Back',
      scanAnotherBottle: 'Scan another bottle',
      scanAnotherList: 'Scan another wine list',
      backToList: 'Back to the wine list',
    },
    result: {
      grapeVarieties: 'Grape varieties',
      aromaticNotes: 'Aromatic notes',
      terroir: 'Terroir',
      listTitle: 'The wine list',
      all: 'All',
      noWineForTag: 'No wine for this tag.',
    },
  },
} as const
