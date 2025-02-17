'use client'

import { createContext, useContext, useState } from 'react'
import { Locale, defaultLocale, locales } from './config'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

type TranslationType = typeof zhCN

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationType
}>({
  locale: defaultLocale,
  setLocale: () => {},
  t: translations[defaultLocale],
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
      }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
