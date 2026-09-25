import type { Locale } from './i18n'
import { getPriorityTagRules } from './tags'

export function getTagRules(locale: Locale, countRule: string): string {
  return getPriorityTagRules(locale, countRule)
}
