"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Language = "en" | "es";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en" as const, name: "English", flag: "🇬🇧", label: "EN" },
    { code: "es" as const, name: "Español", flag: "🇪🇸", label: "ES" },
  ];

  const currentLanguage =
    languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm font-medium text-snow/80 transition-all duration-200 hover:bg-white/10 hover:text-snow border border-white/10"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLanguage.label}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 min-w-[160px] overflow-hidden rounded-xl bg-navy/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setLang(language.code); // Now TypeScript knows this is "en" | "es"
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                    lang === language.code
                      ? "bg-ice/10 text-ice"
                      : "text-snow/70 hover:bg-white/5 hover:text-snow"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  {lang === language.code && (
                    <Check className="h-4 w-4 text-ice" />
                  )}
                </button>
              ))}
            </motion.div>

            {/* Backdrop click handler */}
            <div
              className="fixed inset-0 z-[-1]"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
