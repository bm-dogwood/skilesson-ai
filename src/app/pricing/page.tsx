"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Snowflake,
  Mountain,
  Trophy,
  Check,
  ChevronDown,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useT } from "@/hooks/useT";

// ─── Plan icon: keyed by DB name, never changes with language ────────
const getPlanIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("explorer")) return Snowflake;
  if (n.includes("summit")) return Mountain;
  if (n.includes("apex")) return Trophy;
  return Sparkles;
};

// ─── Derive a slug from the DB name to look up translations ──────────
// "Explorer" → "explorer" | "Summit Pro" → "summit" | etc.
const getPlanSlug = (name: string): "explorer" | "summit" | "apex" | null => {
  const n = name.toLowerCase();
  if (n.includes("explorer")) return "explorer";
  if (n.includes("summit")) return "summit";
  if (n.includes("apex")) return "apex";
  return null;
};

// ─── FAQ accordion item ──────────────────────────────────────────────
function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="border-b border-slate-800/60"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-lg font-medium text-slate-100 pr-4">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-sky-400"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
export default function PricingPage() {
  const t = useT();
  const [isAnnual, setIsAnnual] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        const data = await res.json();
        setPlans(data.packages || []);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      }
    };
    fetchPackages();
  }, []);

  const handleSubscribe = async (plan: any) => {
    if (!session?.userId) {
      router.push("/signin");
      return;
    }
    setLoading(true);
    setSelectedPlan(plan.id);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.userId,
          packageId: plan.id,
          userEmail: session.user.email,
          billingCycle: isAnnual ? "annual" : "monthly",
          trialEnabled: true,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const getMaxSavings = () => {
    if (!plans.length) return 0;
    const savings = plans.map((plan) =>
      isAnnual ? plan.priceMonthly * 12 - plan.priceYearly : 0
    );
    return Math.max(...savings);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(125,211,252,0.05)_0%,_transparent_50%)]" />
      </div>

      <div className="relative">
        {/* ── Hero ── */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 text-sm font-medium text-sky-400 mb-8">
                <Zap className="h-3.5 w-3.5" />
                {t.pricing.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
            >
              <span className="text-white">{t.pricing.title1}</span>
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                {t.pricing.title2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              {t.pricing.subtitle}
            </motion.p>

            {/* Billing toggle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  !isAnnual ? "text-white" : "text-slate-500"
                }`}
              >
                {t.pricing.billingMonthly}
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] ${
                  isAnnual ? "bg-sky-500" : "bg-slate-600"
                }`}
                aria-label="Toggle annual billing"
              >
                <motion.div
                  className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md"
                  animate={{ x: isAnnual ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isAnnual ? "text-white" : "text-slate-500"
                }`}
              >
                {t.pricing.billingAnnual}
              </span>
              <AnimatePresence>
                {isAnnual && getMaxSavings() > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -8 }}
                    className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-3 py-1 text-xs font-semibold text-emerald-400"
                  >
                    {t.pricing.savingsLabel.replace(
                      "{{amount}}",
                      String(getMaxSavings())
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── Pricing cards ── */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan, index) => {
              const Icon = getPlanIcon(plan.name);
              const slug = getPlanSlug(plan.name);

              // ✅ Look up translated name + description; fall back to DB value if slug unknown
              const translatedPlan = slug ? t.pricing.plans[slug] : null;
              const displayName = translatedPlan?.name ?? plan.name;
              const displayDescription =
                translatedPlan?.description ?? plan.description;

              const isPopular =
                plan.name.toLowerCase().includes("summit") ||
                plan.name.toLowerCase().includes("pro");
              const price = isAnnual
                ? Math.round(plan.priceYearly / 12)
                : plan.priceMonthly;
              const totalPrice = isAnnual
                ? plan.priceYearly
                : plan.priceMonthly;
              const features =
                typeof plan.features === "string"
                  ? JSON.parse(plan.features)
                  : plan.features || [];
              const savings = isAnnual
                ? plan.priceMonthly * 12 - plan.priceYearly
                : 0;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className={`relative rounded-2xl p-px ${
                    isPopular ? "md:-mt-4 md:mb-[-16px]" : ""
                  }`}
                >
                  {/* Border gradient */}
                  <div
                    className={`absolute inset-0 rounded-2xl ${
                      isPopular
                        ? "bg-gradient-to-b from-amber-400/60 via-amber-500/20 to-amber-400/60"
                        : "bg-gradient-to-b from-slate-700/60 via-slate-800/30 to-slate-700/60"
                    }`}
                  />

                  {/* Most Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0f172a] shadow-lg shadow-amber-500/25">
                        <Mountain className="h-3.5 w-3.5" />
                        {t.pricing.mostPopular}
                      </span>
                    </div>
                  )}

                  {/* Card body */}
                  <div
                    className={`relative rounded-2xl p-8 lg:p-10 h-full ${
                      isPopular
                        ? "bg-[#0f172a]/95 backdrop-blur-xl"
                        : "bg-slate-900/80 backdrop-blur-xl"
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />

                    <div
                      className={`inline-flex items-center justify-center rounded-xl p-3 mb-6 ${
                        isPopular
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-sky-500/10 text-sky-400"
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    {/* ✅ Translated name */}
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {displayName}
                    </h3>

                    {/* ✅ Translated description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {displayDescription}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-white tracking-tight">
                          ${price}
                        </span>
                        <span className="text-slate-500 text-sm font-medium">
                          {t.pricing.perMonth}
                        </span>
                      </div>
                      {isAnnual && (
                        <motion.div
                          key="annual-detail"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 space-y-1"
                        >
                          <p className="text-sm text-slate-500">
                            ${totalPrice} {t.pricing.billedAnnually}
                          </p>
                          {savings > 0 && (
                            <p className="text-sm font-semibold text-emerald-400">
                              {t.pricing.savePerYear.replace(
                                "{{amount}}",
                                String(savings)
                              )}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubscribe(plan)}
                      disabled={loading && selectedPlan === plan.id}
                      className={`w-full rounded-xl py-3.5 px-6 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mb-8 ${
                        isPopular
                          ? "bg-gradient-to-r from-amber-500 to-amber-400 text-[#0f172a] hover:shadow-lg hover:shadow-amber-500/25"
                          : "bg-sky-500 text-white hover:shadow-lg hover:shadow-sky-500/25"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading && selectedPlan === plan.id ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {t.pricing.trialButton}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>

                    <div className="h-px bg-slate-800 mb-8" />

                    {/* Features — these come from DB, untranslated for now */}
                    <ul className="space-y-3.5">
                      {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check
                            className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                              isPopular ? "text-amber-400" : "text-sky-400"
                            }`}
                          />
                          <span className="text-sm text-slate-300 leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Guarantee ── */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm px-8 py-5">
              <Shield className="h-8 w-8 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-semibold text-lg">
                  {t.pricing.guarantee.title}
                </p>
                <p className="text-slate-400 text-sm mt-0.5">
                  {t.pricing.guarantee.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t.pricing.faq.heading}
              </h2>
              <p className="text-slate-400 text-lg">
                {t.pricing.faq.subheading}
              </p>
            </motion.div>

            <div>
              {t.pricing.faq.items.map(
                (faq: { question: string; answer: string }, index: number) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    index={index}
                  />
                )
              )}
            </div>
          </div>
        </section>

        {/* ── Enterprise ── */}
        <section className="pb-32 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto relative rounded-2xl p-px"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/30 via-purple-500/20 to-sky-500/30" />
            <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-xl px-8 py-12 sm:px-12 sm:py-16 text-center">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />
              <div className="inline-flex items-center justify-center rounded-xl bg-sky-500/10 p-3 mb-6">
                <Users className="h-8 w-8 text-sky-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t.pricing.enterprise.heading}
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {t.pricing.enterprise.sub}
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-8 py-3.5 text-sm font-semibold text-sky-400 transition-all duration-200 hover:bg-sky-500/20 hover:border-sky-400/50"
              >
                {t.pricing.enterprise.cta}
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
