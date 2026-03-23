"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/instructor/dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Students",
    href: "/instructor/students",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Upload Lesson",
    href: "/instructor/upload",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "My Videos",
    href: "/instructor/videos",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
  },
];

const BOTTOM_ITEMS = [
  {
    label: "Settings",
    href: "/instructor/settings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function InstructorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const pageName =
    NAV_ITEMS.find((i) => i.href === pathname)?.label ??
    BOTTOM_ITEMS.find((i) => i.href === pathname)?.label ??
    "Dashboard";

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,400&display=swap');

        :root {
          --navy:   #0f172a;
          --snow:   #f8fafc;
          --ice:    #38bdf8;
          --powder: #7dd3fc;
          --slate:  #475569;
          --gold:   #f59e0b;
          --rose:   #f43f5e;
          --sidebar-w: 260px;
          --sidebar-cw: 70px;
          --sidebar-bg: #080f1e;
          --sidebar-border: rgba(71,85,105,0.18);
          --item-hover: rgba(56,189,248,0.07);
          --item-active: rgba(56,189,248,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .inst-shell {
          display: flex;
          min-height: 100vh;
          background: var(--navy);
          font-family: 'Sora', sans-serif;
          position: relative;
        }

        /* Overlay for mobile */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── SIDEBAR ── */
        .inst-sidebar {
          width: var(--sidebar-w);
          min-height: 100vh;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          z-index: 999;
        }

        /* Mobile sidebar styles */
        @media (max-width: 767px) {
          .inst-sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            transition: left 0.3s ease;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
          }
          
          .inst-sidebar.mobile-open {
            left: 0;
          }
        }

        .inst-sidebar.collapsed { 
          width: var(--sidebar-cw); 
        }

        @media (max-width: 767px) {
          .inst-sidebar.collapsed {
            width: var(--sidebar-w);
          }
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 1.1rem 1.25rem;
          border-bottom: 1px solid var(--sidebar-border);
          min-height: 68px;
          flex-shrink: 0;
          overflow: hidden;
        }

        .logo-gem {
          width: 34px; height: 34px; min-width: 34px;
          background: linear-gradient(135deg, var(--ice), var(--powder));
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }

        .logo-gem svg { width: 16px; height: 16px; fill: var(--navy); }

        .logo-text { overflow: hidden; white-space: nowrap; transition: opacity 0.2s, width 0.25s; }
        .collapsed .logo-text { opacity: 0; width: 0; pointer-events: none; }

        .logo-title { font-size: 0.82rem; font-weight: 600; color: var(--snow); letter-spacing: 0.04em; line-height: 1.2; }
        .logo-sub   { font-size: 0.65rem; color: var(--slate); letter-spacing: 0.1em; text-transform: uppercase; }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.6rem;
          display: flex; flex-direction: column; gap: 2px;
          overflow-y: auto; overflow-x: hidden;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }

        .nav-section-label {
          font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(71,85,105,0.5);
          padding: 0.75rem 0.65rem 0.4rem;
          white-space: nowrap; overflow: hidden; transition: opacity 0.2s;
        }
        .collapsed .nav-section-label { opacity: 0; }

        .nav-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.65rem 0.75rem; border-radius: 10px;
          color: var(--slate); text-decoration: none;
          font-size: 0.83rem; font-weight: 400;
          white-space: nowrap; overflow: hidden;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }

        .nav-item:hover  { background: var(--item-hover); color: var(--powder); }
        .nav-item.active { background: var(--item-active); color: var(--ice); font-weight: 500; }

        .nav-item.active::before {
          content: '';
          position: absolute; left: 0; top: 20%; height: 60%; width: 3px;
          background: var(--ice); border-radius: 0 3px 3px 0;
        }

        .nav-icon { width: 18px; height: 18px; min-width: 18px; flex-shrink: 0; }
        .nav-label { transition: opacity 0.2s; overflow: hidden; }
        .collapsed .nav-label { opacity: 0; width: 0; }

        /* Collapsed tooltips */
        .collapsed .nav-item[data-tip]:hover::after {
          content: attr(data-tip);
          position: absolute; left: calc(100% + 12px); top: 50%;
          transform: translateY(-50%);
          background: #1e293b; color: var(--snow);
          font-size: 0.75rem; padding: 0.35rem 0.7rem;
          border-radius: 7px; white-space: nowrap;
          border: 1px solid rgba(71,85,105,0.25);
          pointer-events: none; z-index: 100;
        }

        .sidebar-bottom {
          padding: 0.6rem 0.6rem 1.25rem;
          border-top: 1px solid var(--sidebar-border);
          display: flex; flex-direction: column; gap: 2px;
        }

        .collapse-btn {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 0.75rem; border-radius: 10px;
          color: var(--slate); background: none; border: none;
          cursor: pointer; font-family: 'Sora', sans-serif;
          font-size: 0.83rem; white-space: nowrap; overflow: hidden;
          transition: background 0.15s, color 0.15s; width: 100%;
        }
        .collapse-btn:hover { background: var(--item-hover); color: var(--powder); }

        .collapse-icon {
          width: 18px; height: 18px; min-width: 18px;
          stroke: currentColor; fill: none;
          stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;
          transition: transform 0.25s;
          flex-shrink: 0;
        }
        .collapsed .collapse-icon { transform: rotate(180deg); }

        .collapse-label { transition: opacity 0.2s; }
        .collapsed .collapse-label { opacity: 0; width: 0; overflow: hidden; }

        .user-chip {
          display: flex; align-items: center; gap: 0.7rem;
          padding: 0.65rem 0.75rem; border-radius: 10px; overflow: hidden;
          border: 1px solid var(--sidebar-border); margin-top: 0.5rem;
        }

        .user-avatar {
          width: 28px; height: 28px; min-width: 28px; border-radius: 50%;
          background: linear-gradient(135deg, var(--ice), var(--powder));
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 600; color: var(--navy);
        }

        .user-info { overflow: hidden; transition: opacity 0.2s; white-space: nowrap; }
        .collapsed .user-info { opacity: 0; width: 0; }

        .user-name { font-size: 0.78rem; font-weight: 500; color: var(--snow); }
        .user-role { font-size: 0.62rem; color: var(--slate); }

        /* ── MAIN ── */
        .inst-main { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          min-width: 0; 
          overflow: auto; 
          position: relative;
        }

        .inst-topbar {
          height: 68px; 
          border-bottom: 1px solid rgba(71,85,105,0.15);
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          padding: 0 1rem;
          background: rgba(8,15,30,0.6); 
          backdrop-filter: blur(8px);
          position: sticky; 
          top: 0; 
          z-index: 10; 
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .inst-topbar {
            padding: 0 2rem;
          }
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--snow);
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.15s;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .topbar-breadcrumb { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          font-size: 0.8rem; 
          color: var(--slate);
        }
        
        .topbar-breadcrumb span { 
          color: var(--snow); 
          font-weight: 500; 
        }

        .topbar-badge {
          display: flex; 
          align-items: center; 
          gap: 0.4rem;
          background: rgba(56,189,248,0.08); 
          border: 1px solid rgba(56,189,248,0.2);
          border-radius: 100px; 
          padding: 0.3rem 0.8rem;
          font-size: 0.7rem; 
          font-weight: 500; 
          color: var(--ice);
          letter-spacing: 0.08em; 
          text-transform: uppercase;
        }

        .topbar-dot {
          width: 6px; 
          height: 6px; 
          border-radius: 50%; 
          background: var(--ice);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }

        .inst-content { 
          flex: 1; 
          padding: 1.5rem 1rem; 
        }

        @media (min-width: 768px) {
          .inst-content { 
            padding: 2.5rem 2rem; 
          }
        }
      `}</style>

      <div className="inst-shell">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`inst-sidebar${collapsed ? " collapsed" : ""}${
            mobileMenuOpen ? " mobile-open" : ""
          }`}
        >
          <div className="sidebar-logo">
            <div className="logo-gem">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 9l10 13L22 9z" />
              </svg>
            </div>
            <div className="logo-text">
              <div className="logo-title">SkiLesson.ai</div>
              <div className="logo-sub">Instructor Portal</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${pathname === item.href ? " active" : ""}`}
                data-tip={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-bottom">
            {BOTTOM_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${pathname === item.href ? " active" : ""}`}
                data-tip={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}

            <button onClick={handleLogout} className="collapse-btn">
              <LogOut className="w-4 h-4" />
              <span className="nav-label">Sign Out</span>
            </button>

            <button
              className="collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
            >
              <svg className="collapse-icon" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="collapse-label">Collapse</span>
            </button>

            <div className="user-chip">
              <div className="user-avatar">IN</div>
              <div className="user-info">
                <div className="user-name">Instructor</div>
                <div className="user-role">Portal Member</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="inst-main">
          <header className="inst-topbar">
            <div className="flex items-center gap-2">
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="topbar-breadcrumb">
                Instructor Portal &rsaquo; <span>{pageName}</span>
              </div>
            </div>
            <div className="topbar-badge">
              <span className="topbar-dot" />
              Live
            </div>
          </header>

          <div className="inst-content">{children}</div>
        </div>
      </div>
    </>
  );
}
