"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Lang = "es" | "en"

interface LangContextType {
  lang: Lang
  toggleLang: () => void
}

const LangContext = createContext<LangContextType>({
  lang: "es",
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es")

  const toggleLang = () => setLang((l) => (l === "es" ? "en" : "es"))

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
