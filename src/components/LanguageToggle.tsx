"use client";

import { useTranslation, type Language } from "@/hooks/useTranslation";

export function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <div
      className="inline-flex items-center gap-0.5 p-1 rounded-xl 
                 bg-white/[0.06] border border-white/[0.08]"
      aria-label="Language selector"
    >
      {(["en", "es"] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`
            px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide
            transition-all duration-150 border-none outline-none cursor-pointer
            ${
              lang === l
                ? "bg-ice/20 text-ice"
                : "bg-transparent text-slate-400 hover:text-slate-200"
            }
          `}
        >
          {l === "en" ? "🇺🇸 EN" : "🇪🇸 ES"}
        </button>
      ))}
    </div>
  );
}
