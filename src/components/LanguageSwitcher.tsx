"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      <button
        onClick={() => setLang("en")}
        className={`text-2xl ${lang === "en" ? "scale-110" : "opacity-50"}`}
      >
        🇬🇧
      </button>

      <button
        onClick={() => setLang("es")}
        className={`text-2xl ${lang === "es" ? "scale-110" : "opacity-50"}`}
      >
        🇪🇸
      </button>
    </div>
  );
}
