"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Curriculum", href: "#curriculum" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Mountain className="h-7 w-7 text-ice transition-transform duration-300 group-hover:scale-110" />
              <span className="font-heading text-xl font-bold tracking-tight text-snow">
                SkiLesson
                <span className="text-ice">.ai</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-snow/70 transition-colors hover:text-snow hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-snow/70 transition-colors hover:text-snow hover:bg-white/5"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 lg:flex">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-snow/70 transition-colors hover:text-snow"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-full bg-ice px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:bg-powder hover:shadow-lg hover:shadow-ice/20"
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center rounded-lg p-2 text-snow/70 transition-colors hover:text-snow lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-navy/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-2xl font-semibold text-snow/80 transition-colors hover:text-snow"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-2xl font-semibold text-snow/80 transition-colors hover:text-snow"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 flex flex-col items-center gap-4"
              >
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-snow/60 transition-colors hover:text-snow"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full bg-ice px-8 py-3 text-lg font-semibold text-navy transition-all hover:bg-powder"
                    >
                      Start Free Trial
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
