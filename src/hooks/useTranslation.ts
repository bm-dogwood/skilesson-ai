"use client";

import { useState, useCallback, useEffect } from "react";
import en from "@/lib/locales/en.json";
import es from "@/lib/locales/es.json";

export type Language = "en" | "es";

const locales = { en, es };

// Module-level singleton — all components share the same language
let _lang: Language = "en";
let _listeners: Array<() => void> = [];

// Restore from localStorage on first load
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("student-lang") as Language | null;
  if (saved === "en" || saved === "es") _lang = saved;
}

export function useTranslation() {
  const [lang, setLangState] = useState<Language>(_lang);

  // Subscribe to external language changes after mount, unsubscribe on unmount
  useEffect(() => {
    const listener = () => setLangState(_lang);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  }, []);

  const setLang = useCallback((newLang: Language) => {
    _lang = newLang;
    if (typeof window !== "undefined") {
      localStorage.setItem("student-lang", newLang);
    }
    _listeners.forEach((fn) => fn());
  }, []);

  /**
   * t("dashboard.welcomeBack")
   * t("lessons.pageSubtitleParts", { count: 12, completed: 5, inProgress: 2 })
   */
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const strings: any = locales[lang];
      const parts = key.split(".");
      let value: any = strings;

      for (const part of parts) {
        value = value?.[part];
        if (value === undefined) break;
      }

      // Fallback to English if key missing in current language
      if (typeof value !== "string") {
        let fallback: any = locales.en;
        for (const part of parts) {
          fallback = fallback?.[part];
          if (fallback === undefined) break;
        }
        value = typeof fallback === "string" ? fallback : key;
      }

      // Replace {variable} placeholders
      if (vars) {
        return Object.entries(vars).reduce(
          (str, [k, v]) =>
            str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
          value as string
        );
      }

      return value as string;
    },
    [lang]
  );

  return { t, lang, setLang };
}
