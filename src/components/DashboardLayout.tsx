"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  BookOpen,
  Mountain,
} from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "@/lib/auth-context";
import { LanguageToggle } from "./LanguageToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "A";
  const firstName = user?.name?.split(" ")[0] || "User";
  const planLabel = user?.isSubscribed ? "Pro" : "Free";

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <DashboardSidebar />

      <div className="md:pl-[260px] transition-all duration-300">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Mountain />
            <span className="text-xl font-bold text-sky-400">
              Skilesson
              <span className="text-slate-300">.ai</span>
            </span>
          </div>

          {/* Right side (user menu & logout) */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            {/* Mobile logout button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex md:hidden items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-red-400 hover:text-red-300 hover:bg-white/[0.06] transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>

            {/* Desktop user dropdown */}
            <div className="relative hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ice to-powder flex items-center justify-center">
                  <span className="text-xs font-bold text-navy">{initial}</span>
                </div>
                <span className="text-sm font-medium text-snow">
                  {firstName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl bg-[#1e293b] border border-white/[0.06] shadow-2xl z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-2 border-b border-white/[0.06]">
                        <p className="text-sm font-medium text-snow">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {planLabel} Plan
                        </p>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-snow hover:bg-white/[0.04] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          My Dashboard
                        </Link>
                        <Link
                          href="/dashboard/lessons"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-snow hover:bg-white/[0.04] transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          My Lessons
                        </Link>
                        <Link
                          href="/dashboard/history"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-snow hover:bg-white/[0.04] transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          History
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-snow hover:bg-white/[0.04] transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-snow hover:bg-white/[0.04] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-white/[0.06] pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
