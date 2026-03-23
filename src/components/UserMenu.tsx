"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) return null;

  // ✅ Safe display name
  const displayName = user.name || user.email || "User";

  // ✅ Safe initial
  const initial = displayName.charAt(0).toUpperCase();

  // ✅ Derived plan (instead of user.plan)
  const plan = user.isSubscribed ? "Summit" : "Trial";

  // ✅ First name safely
  const firstName = displayName.split(" ")[0];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] transition-colors cursor-pointer"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#7dd3fc] flex items-center justify-center">
          <span className="text-xs font-bold text-[#0f172a]">{initial}</span>
        </div>

        {/* Name */}
        <span className="text-sm font-medium text-[#f8fafc] hidden sm:block">
          {firstName}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-[#475569] transition-transform duration-200 hidden sm:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#1e293b] border border-white/[0.08] shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-semibold text-[#f8fafc]">
                {displayName}
              </p>
              <p className="text-xs text-[#475569] mt-0.5">{plan} Plan</p>
            </div>

            {/* Links */}
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#f8fafc] hover:bg-white/[0.04] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </Link>

              <Link
                href="/dashboard/lessons"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#f8fafc] hover:bg-white/[0.04] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                My Lessons
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-[#f8fafc] hover:bg-white/[0.04] transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>

            {/* Sign Out */}
            <div className="border-t border-white/[0.06] py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
