'use client'

import { useLocale } from '@/i18n/context'
import { locales, localeNames } from '@/i18n/config'

export function LanguageSwitch() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="absolute top-4 right-4">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        className="px-3 py-1 border rounded-lg bg-background">
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </div>
  )
}
