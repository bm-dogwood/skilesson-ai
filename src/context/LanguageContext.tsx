"use client";

import { createContext, useContext, useState } from "react";

type Language = "en" | "es";

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
}>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en"); // resets on refresh

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
