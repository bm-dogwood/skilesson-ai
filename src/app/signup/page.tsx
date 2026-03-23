"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mountain, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const skillLevels = [
  {
    id: "beginner",
    label: "Beginner",
    description: "New to the slopes",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Comfortable on blues",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Tackling blacks & beyond",
  },
];

const sportOptions = [
  { id: "skiing", label: "Skiing" },
  { id: "snowboarding", label: "Snowboarding" },
  { id: "both", label: "Both" },
];

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [signingUpChild, setSigningUpChild] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!selectedSkill || !selectedSport) {
      alert("Please select skill level and sport");
      setLoading(false);
      return;
    }

    try {
      // ✅ 1. Create user
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          level: selectedSkill,
          sport: selectedSport,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // ✅ 2. Auto login
      await login(email, password);

      // ✅ 3. Success UI
      setShowWelcome(true);

      // ✅ 4. Redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-24 overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(125,211,252,0.05)_0%,_transparent_50%)]" />
      </div>

      {/* Welcome toast */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.1] backdrop-blur-xl px-6 py-3 shadow-2xl"
        >
          <p className="text-sm text-emerald-400 font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Welcome to SkiLesson.ai! You&apos;re signed in with the demo
            account.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        {/* Card */}
        <div className="relative rounded-2xl p-px">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-700/60 via-slate-800/30 to-slate-700/60" />

          <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-xl px-8 py-10 sm:px-10 sm:py-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />

            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center justify-center rounded-lg bg-sky-500/10 p-2">
                <Mountain className="h-6 w-6 text-sky-400" />
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                SkiLesson.ai
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-2xl sm:text-3xl font-bold text-white text-center mb-2"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              Start Your 7-Day Free Trial
            </h1>
            <p className="text-slate-400 text-center mb-8">
              No credit card required.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Skill Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {skillLevels.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedSkill(level.id)}
                      aria-pressed={selectedSkill === level.id}
                      className={`relative rounded-xl border p-3 text-center transition-all duration-200 cursor-pointer ${
                        selectedSkill === level.id
                          ? "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500/30"
                          : "border-slate-700/80 bg-slate-800/40 hover:border-slate-600"
                      }`}
                    >
                      {selectedSkill === level.id && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-3.5 w-3.5 text-sky-400" />
                        </div>
                      )}
                      <p
                        className={`text-sm font-semibold ${
                          selectedSkill === level.id
                            ? "text-sky-400"
                            : "text-slate-300"
                        }`}
                      >
                        {level.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {level.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sport Preference */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Sport Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {sportOptions.map((sport) => (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => setSelectedSport(sport.id)}
                      aria-pressed={selectedSport === sport.id}
                      className={`rounded-xl border p-3 text-center transition-all duration-200 cursor-pointer ${
                        selectedSport === sport.id
                          ? "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500/30"
                          : "border-slate-700/80 bg-slate-800/40 hover:border-slate-600"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          selectedSport === sport.id
                            ? "text-sky-400"
                            : "text-slate-300"
                        }`}
                      >
                        {sport.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Signing Up a Child */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={signingUpChild}
                    onChange={(e) => setSigningUpChild(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Signing up a child"
                  />
                  <div className="h-5 w-5 flex-shrink-0 rounded-md border border-slate-700/80 bg-slate-800/60 flex items-center justify-center peer-checked:border-sky-500 peer-checked:bg-sky-500/20 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-500/40">
                    {signingUpChild && (
                      <Check className="h-3.5 w-3.5 text-sky-400" />
                    )}
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    Signing up a child?
                  </span>
                </label>

                {signingUpChild && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4 overflow-hidden"
                  >
                    <div>
                      <label
                        htmlFor="child-name"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Child&apos;s Name
                      </label>
                      <input
                        id="child-name"
                        name="childName"
                        type="text"
                        placeholder="Child's full name"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="child-age"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Child&apos;s Age
                      </label>
                      <input
                        id="child-age"
                        name="childAge"
                        type="number"
                        min="3"
                        max="17"
                        placeholder="Age"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Agree to terms of service and privacy policy"
                    required
                    aria-required="true"
                  />
                  <div className="h-5 w-5 flex-shrink-0 rounded-md border border-slate-700/80 bg-slate-800/60 flex items-center justify-center peer-checked:border-sky-500 peer-checked:bg-sky-500/20 transition-all duration-200 mt-0.5 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-500/40">
                    {agreedToTerms && (
                      <Check className="h-3.5 w-3.5 text-sky-400" />
                    )}
                  </div>
                  <span className="text-sm text-slate-400">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-sky-400 hover:text-sky-300 transition-colors underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-sky-400 hover:text-sky-300 transition-colors underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.01 }}
                whileTap={loading ? {} : { scale: 0.99 }}
                className="w-full rounded-xl bg-sky-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:shadow-sky-400/30 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <a
                href="/signin"
                className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
