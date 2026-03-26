"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  Mountain,
  Play,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Snowflake,
  Sparkles,
  ChevronRight,
  Star,
  Brain,
  MessageCircle,
  BarChart3,
  Shield,
  Heart,
  Zap,
} from "lucide-react";
import { useT } from "@/hooks/useT";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/* ------------------------------------------------------------------ */
/*  Reusable scroll-reveal wrapper                                     */
/* ------------------------------------------------------------------ */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper with consistent padding                            */
/* ------------------------------------------------------------------ */
function Section({
  children,
  id,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 lg:py-40 ${
        dark ? "bg-navy-mid" : ""
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Mountain SVG background for the hero                               */
/* ------------------------------------------------------------------ */
function MountainBackground() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Real mountain background image */}
      {/* YouTube video background */}

      <video
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 `}
      >
        <source
          src="https://res.cloudinary.com/drm92i7dm/video/upload/v1774258829/skii_sl13uj.mp4"
          type="video/mp4"
        />
      </video>
      <div className="block md:hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/drm92i7dm/video/upload/v1774258829/skii_sl13uj.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {/* Sky gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1425]/80 via-[#0f1d35]/70 to-[#0f172a]" />

      {/* Aurora glow */}
      <div className="absolute top-0 left-1/4 h-[60vh] w-[60vw] rounded-full bg-ice/[0.03] blur-[120px]" />
      <div className="absolute top-20 right-1/4 h-[40vh] w-[40vw] rounded-full bg-powder/[0.02] blur-[100px]" />

      {/* Stars */}
      <div className="absolute top-[8%] left-[15%] h-1 w-1 rounded-full bg-white/40" />
      <div className="absolute top-[12%] left-[45%] h-0.5 w-0.5 rounded-full bg-white/30" />
      <div className="absolute top-[6%] right-[20%] h-1 w-1 rounded-full bg-white/25" />
      <div className="absolute top-[18%] left-[70%] h-0.5 w-0.5 rounded-full bg-white/35" />
      <div className="absolute top-[10%] left-[85%] h-1 w-1 rounded-full bg-white/20" />
      <div className="absolute top-[15%] left-[30%] h-0.5 w-0.5 rounded-full bg-white/30" />
      <div className="absolute top-[5%] left-[60%] h-0.5 w-0.5 rounded-full bg-white/25" />
      <div className="absolute top-[20%] right-[40%] h-1 w-1 rounded-full bg-white/20" />

      {/* Mountain range — front layer */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 300"
        fill="none"
        preserveAspectRatio="none"
        style={{ height: "30%" }}
      >
        <path
          d="M0 300 L0 250 L160 210 L300 240 L440 190 L560 220 L700 180 L840 210 L980 170 L1100 200 L1250 185 L1440 220 L1440 300Z"
          fill="#0f172a"
        />
      </svg>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO SECTION                                                       */
/* ------------------------------------------------------------------ */
function Hero() {
  const t = useT();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <MountainBackground />
      <LanguageSwitcher />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-ice/20 bg-ice/5 px-4 py-1.5"
        >
          <Snowflake className="h-3.5 w-3.5 text-ice" />
          <span className="text-xs font-medium tracking-wide text-ice">
            {"NOW IN EARLY ACCESS"}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          <span className="gradient-text">{t.hero.title1}</span>
          <br />
          <span className="text-snow/90">{t.hero.title2}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-snow/60 sm:text-xl"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/pricing"
            className="group flex items-center gap-2 rounded-full bg-ice px-8 py-4 text-base font-semibold text-navy shadow-lg shadow-ice/20 transition-all duration-200 hover:bg-powder hover:shadow-xl hover:shadow-ice/30"
          >
            {t.hero.ctaPrimary}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#how-it-works"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-snow/80 transition-all hover:border-white/20 hover:bg-white/10"
          >
            <Play className="h-4 w-4 text-ice" />
            {t.hero.ctaSecondary}
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 text-xs tracking-wide text-snow/30"
        >
          {"Free 7-day trial · Cancel anytime · No equipment needed to start"}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1"
        >
          <div className="h-1.5 w-1 rounded-full bg-ice/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SOCIAL PROOF / STATS                                               */
/* ------------------------------------------------------------------ */
function Stats() {
  const t = useT();

  const stats = [
    { value: "10,000+", label: t.stats.students, icon: Users },
    { value: "200+", label: t.stats.lessons, icon: BookOpen },
    { value: "3", label: t.stats.levels, icon: Target },
    { value: "50+", label: t.stats.instructors, icon: Award },
  ];

  return (
    <Section>
      <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1}>
            <div className="glass glass-hover group rounded-2xl p-6 text-center transition-all duration-300 sm:p-8">
              <stat.icon className="mx-auto mb-3 h-6 w-6 text-ice/60 transition-colors group-hover:text-ice" />
              <div className="font-heading text-3xl font-bold text-snow sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-snow/40">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <p className="mt-10 text-center text-sm text-snow/30">
          {
            "Taught by Olympians, PSIA-certified instructors, and professional athletes"
          }
        </p>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS                                                       */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const t = useT();

  const steps = [
    {
      step: "01",
      title: t.how.step1.title,
      description: t.how.step1.desc,
      icon: Target,
    },
    {
      step: "02",
      title: t.how.step2.title,
      description: t.how.step2.desc,
      icon: Play,
    },
    {
      step: "03",
      title: t.how.step3.title,
      description: t.how.step3.desc,
      icon: TrendingUp,
    },
  ];

  return (
    <Section id="how-it-works" dark>
      <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice">
            {"How It Works"}
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t.how.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-snow/50 sm:text-lg">
            {t.how.sub}
          </p>
        </div>
      </Reveal>

      <div className="relative mt-16 grid gap-8 sm:mt-20 lg:grid-cols-3 lg:gap-6">
        {/* Connector line (desktop) */}
        <div className="absolute top-24 left-[16.66%] hidden h-px w-[66.66%] bg-gradient-to-r from-ice/20 via-ice/10 to-ice/20 lg:block" />

        {steps.map((step, i) => (
          <Reveal key={step.step} delay={i * 0.15}>
            <div className="glass glass-hover group relative rounded-2xl p-8 transition-all duration-300 sm:p-10">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ice/10 transition-colors group-hover:bg-ice/20">
                  <step.icon className="h-6 w-6 text-ice" />
                </div>
                <span className="font-heading text-sm font-bold text-ice/40">
                  {step.step}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-snow/50">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  CURRICULUM PREVIEW                                                 */
/* ------------------------------------------------------------------ */
const levels = [
  {
    level: "Beginner",
    tag: "Start Here",
    color: "from-emerald-500/20 to-emerald-400/5",
    borderColor: "border-emerald-500/20 hover:border-emerald-400/40",
    tagColor: "text-emerald-400 bg-emerald-500/10",
    icon: Snowflake,
    topics: [
      "Gear selection and setup",
      "Balance and stance fundamentals",
      "Snowplow turns and stopping",
      "Riding the lift with confidence",
      "First green run preparation",
    ],
  },
  {
    level: "Intermediate",
    tag: "Most Popular",
    color: "from-ice/20 to-ice/5",
    borderColor: "border-ice/20 hover:border-ice/40",
    tagColor: "text-ice bg-ice/10",
    icon: Mountain,
    topics: [
      "Parallel turn technique",
      "Carving fundamentals",
      "Variable terrain tactics",
      "Speed control on blue runs",
      "Introduction to moguls",
    ],
  },
  {
    level: "Advanced",
    tag: "Push Limits",
    color: "from-gold/20 to-gold/5",
    borderColor: "border-gold/20 hover:border-gold/40",
    tagColor: "text-gold bg-gold/10",
    icon: Zap,
    topics: [
      "Black diamond strategy",
      "Powder skiing technique",
      "Mogul mastery",
      "Racing fundamentals",
      "Backcountry safety basics",
    ],
  },
];

function Curriculum() {
  const t = useT();

  return (
    <Section id="curriculum">
      <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice">
            {t.curriculum.badge || "Curriculum"}
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t.curriculum.heading || "Every level. Every style. Every goal."}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-snow/50 sm:text-lg">
            {t.curriculum.sub ||
              "Our curriculum is designed by certified instructors and structured for progression — whether you are clicking into skis for the first time or looking to conquer double blacks."}
          </p>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:mt-20 lg:grid-cols-3">
        {levels.map((level, i) => (
          <Reveal key={level.level} delay={i * 0.12}>
            <div
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-b ${level.color} ${level.borderColor} p-8 transition-all duration-300 sm:p-10`}
            >
              {/* Tag */}
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${level.tagColor}`}
              >
                {level.tag}
              </span>

              {/* Icon + title */}
              <div className="mt-6 flex items-center gap-3">
                <level.icon className="h-7 w-7 text-snow/60" />
                <h3 className="font-heading text-2xl font-bold">
                  {level.level}
                </h3>
              </div>

              {/* Topics */}
              <ul className="mt-6 space-y-3">
                {level.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 text-sm text-snow/60"
                  >
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ice/50" />
                    {topic}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-ice transition-colors hover:text-powder"
              >
                {t.curriculum.exploreLink || "Explore curriculum"}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  BUILT FOR FAMILIES                                                 */
/* ------------------------------------------------------------------ */
const familyFeatures = [
  {
    icon: Shield,
    title: "Kid-Safe Environment",
    description:
      "No ads, no distractions, no outside links. A safe learning space designed for young athletes ages 5 and up.",
  },
  {
    icon: Users,
    title: "Family Plans",
    description:
      "One subscription covers everyone. Parents and kids learn together with separate profiles and progress tracking.",
  },
  {
    icon: Heart,
    title: "Parent Dashboard",
    description:
      "See what your kids are learning, how they are progressing, and what skills they have mastered — all from your phone.",
  },
  {
    icon: Award,
    title: "Badges & Rewards",
    description:
      "Kids earn digital badges as they complete lessons and hit milestones. Real motivation built into every level.",
  },
];

function BuiltForFamilies() {
  const t = useT();

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left content */}
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice">
              {t.families.badge || "For Families"}
            </p>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.families.heading || "Built for families who ride together"}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-snow/50 sm:text-lg">
              {t.families.sub ||
                "Skiing is a family sport. Our platform is designed from the ground up to make learning fun, safe, and accessible for every member of the family — from five-year-olds to grandparents."}
            </p>
          </Reveal>
          {/* Family skiing photo */}
          <Reveal delay={0.15}>
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070&auto=format&fit=crop"
                alt="Family skiing together on a sunny mountain day"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* Right grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {familyFeatures.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.1}>
              <div className="glass glass-hover group rounded-xl p-6 transition-all duration-300">
                <feature.icon className="mb-3 h-5 w-5 text-ice/60 transition-colors group-hover:text-ice" />
                <h3 className="font-heading text-sm font-bold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-snow/40">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  AI COACH TEASER                                                    */
/* ------------------------------------------------------------------ */
function AICoach() {
  const t = useT();

  return (
    <Section dark>
      <div className="mx-auto max-w-4xl text-center">
        <Reveal delay={0.1}>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t.aiCoach.heading || "Your Personal "}
            <span className="gradient-text-gold">
              {t.aiCoach.highlight || "AI Snow Coach"}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-snow/50 sm:text-lg">
            {t.aiCoach.sub ||
              "Imagine a coach that knows exactly where you are in your journey, adapts to your pace, answers your questions, and keeps you motivated between lessons. That is what we are building."}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              {
                icon: Brain,
                title: t.aiCoach.feature1Title || "Adaptive Learning",
                desc:
                  t.aiCoach.feature1Desc ||
                  "AI adjusts your lesson plan based on what you have mastered and where you need work.",
              },
              {
                icon: MessageCircle,
                title: t.aiCoach.feature2Title || "Ask Anything",
                desc:
                  t.aiCoach.feature2Desc ||
                  "Get instant answers to technique questions, gear advice, and mountain conditions.",
              },
              {
                icon: BarChart3,
                title: t.aiCoach.feature3Title || "Smart Progress",
                desc:
                  t.aiCoach.feature3Desc ||
                  "AI-generated insights on your strengths, growth areas, and personalized next steps.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="glass rounded-xl p-6 text-center"
              >
                <item.icon className="mx-auto mb-3 h-6 w-6 text-gold/60" />
                <h3 className="font-heading text-sm font-bold">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-snow/40">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  INSTRUCTOR CREDIBILITY                                             */
/* ------------------------------------------------------------------ */
function Instructors() {
  const t = useT();

  const credentials = t.instructors?.credentials || [
    "PSIA / AASI Certified Level III",
    "Olympic & World Cup Athletes",
    "20+ Years Average Teaching Experience",
    "Vail, Aspen, Park City Veterans",
  ];

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Visual element */}
        <Reveal>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl">
            {/* Real photo: Ski instructor on Vail slopes */}
            <Image
              src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=2069&auto=format&fit=crop"
              alt="Ski instructor on pristine mountain slopes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-heading text-lg font-bold text-snow/90">
                {t.instructors.locationTitle || "Filmed on Location"}
              </p>
              <p className="mt-1 text-sm text-snow/60">
                {t.instructors.locations || "Vail, Aspen, Park City & more"}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Text content */}
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ice">
              {t.instructors.badge || "Our Instructors"}
            </p>
            <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.instructors.heading || "Learn from the best in the business"}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-snow/50 sm:text-lg">
              {t.instructors.sub ||
                "Every lesson is taught by a certified professional with real competition or resort experience. No amateurs. No shortcuts. The same instructors who train at Vail, Aspen, and Park City are now teaching you."}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-3">
              {credentials.map((cred: string) => (
                <li
                  key={cred}
                  className="flex items-center gap-3 text-sm text-snow/60"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ice/10">
                    <ChevronRight className="h-3 w-3 text-ice" />
                  </div>
                  {cred}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  FINAL CTA                                                          */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  const t = useT();

  return (
    <Section>
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ice/10 via-navy-light to-navy" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-ice/5 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-powder/5 blur-[80px]" />

          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-24">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-snow/50 sm:text-lg">
              {t.cta.subtitle}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/pricing"
                className="group flex items-center gap-2 rounded-full bg-ice px-8 py-4 text-base font-semibold text-navy shadow-lg shadow-ice/20 transition-all duration-200 hover:bg-powder hover:shadow-xl hover:shadow-ice/30"
              >
                {t.cta.button}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-snow/50 transition-colors hover:text-snow"
              >
                {t.ctaa.secondaryLink || "View pricing →"}
              </Link>
            </div>

            <p className="mt-6 text-xs text-snow/30">
              {t.ctaa.finePrint ||
                "7 days free · From $14.99/mo · Cancel anytime"}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE COMPOSITION                                                   */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <HowItWorks />
      <Curriculum />
      <Instructors />
      <BuiltForFamilies />
      <AICoach />
      <FinalCTA />
    </>
  );
}
