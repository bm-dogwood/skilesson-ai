"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export function useT() {
  const { lang } = useLanguage();
  return translations[lang];
}
