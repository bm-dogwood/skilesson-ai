"use client";

import Link from "next/link";
import {
  Mountain,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Send,
} from "lucide-react";
import { useState } from "react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Instructors", href: "/instructors" },
  ],
  curriculum: [
    { label: "Explorer", href: "/pricing" },
    { label: "Summit", href: "/pricing" },
    { label: "Apex", href: "/pricing" },
  ],
  support: [
    { label: "Home Page", href: "/" },
    { label: "Contact Us", href: "/contact" },
    { label: "Sign in", href: "/signin" },
    { label: "Pricing", href: "/pricing" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

const socials = [
  {
    icon: Instagram,
    href: "https://instagram.com/skilesson.ai",
    label: "Instagram",
  },
  { icon: Twitter, href: "https://twitter.com/skilessonai", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@skilessonai", label: "YouTube" },
  {
    icon: Facebook,
    href: "https://facebook.com/skilessonai",
    label: "Facebook",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative z-10 border-t border-white/5 bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Newsletter + social row */}
        <div className="mb-12 flex flex-col items-start justify-between gap-8 border-b border-white/5 pb-12 lg:flex-row lg:items-end">
          <div className="max-w-md">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Mountain className="h-7 w-7 text-ice" />
              <span className="font-heading text-xl font-bold tracking-tight text-snow">
                SkiLesson<span className="text-ice">.ai</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-snow/50">
              The premier online platform for ski and snowboard education. Learn
              from world-class instructors, track your progress, and hit the
              mountain with confidence.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <p className="mb-2 text-sm font-semibold text-snow/80">
              Stay in the loop
            </p>
            <p className="mb-4 text-sm text-snow/40">
              Get early access, tips, and mountain updates.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-snow placeholder:text-snow/30 focus:border-ice/40 focus:outline-none focus:ring-1 focus:ring-ice/20 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-ice px-4 py-2.5 text-navy transition-colors hover:bg-powder"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-snow/40">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-snow/50 transition-colors hover:text-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-snow/40">
              Curriculum
            </h3>
            <ul className="space-y-3">
              {footerLinks.curriculum.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-snow/50 transition-colors hover:text-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-snow/40">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-snow/50 transition-colors hover:text-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-snow/40">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-snow/50 transition-colors hover:text-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-snow/30">
            &copy; 2026 SkiLesson.ai &mdash; A Dogwood Brands Company
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-snow/30 transition-colors hover:text-ice"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
