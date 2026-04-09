"use client";

// app/admin/_components/AdminSidebar.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "./index";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <Icon.Grid /> },
  { href: "/admin/users", label: "Users", icon: <Icon.Users /> },
  { href: "/admin/content", label: "Content", icon: <Icon.Play /> },
  { href: "/admin/pricing", label: "Pricing Plans", icon: <Icon.Tag /> },
];

export default function AdminSidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (
    status === "loading" ||
    !session ||
    (session.user as any)?.role !== "admin"
  ) {
    return null;
  }

  const initials = (session.user?.name ??
    session.user?.email ??
    "A")[0].toUpperCase();

  return (
    <>
      <style>{`
        /* ── Sidebar (desktop ≥ 769px) ── */
        .sidebar {
          width: 320px; flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 1.5rem 1rem;
          position: sticky; top: 0; height: 100vh;
        }

        /* ── Hamburger button (mobile / tablet only) ── */
        .sidebar-hamburger {
          display: none;
          position: fixed; top: 14px; left: 14px; z-index: 200;
          width: 38px; height: 38px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 9px;
          align-items: center; justify-content: center;
          cursor: pointer; flex-direction: column; gap: 5px;
          padding: 0;
        }
        .sidebar-hamburger span {
          display: block; width: 16px; height: 1.5px;
          background: var(--muted); border-radius: 2px;
          transition: transform 0.22s, opacity 0.22s;
        }
        .sidebar-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .sidebar-hamburger.open span:nth-child(2) { opacity: 0; }
        .sidebar-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Overlay (mobile / tablet only) ── */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0; z-index: 110;
          background: rgba(0, 0, 0, 0.55);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .sidebar-overlay.show { opacity: 1; pointer-events: all; }

        /* ── Drawer (mobile / tablet only) ── */
        .sidebar-drawer {
          display: none;
          position: fixed; top: 0; left: -240px;
          width: 220px; height: 100dvh; z-index: 120;
          background: var(--surface);
          border-right: 1px solid var(--border);
          flex-direction: column;
          padding: 1.5rem 1rem;
          transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
        }
        .sidebar-drawer.open { left: 0; }

        /* ── Shared inner styles ── */
        .brand {
          display: flex; align-items: center; gap: 0.65rem;
          margin-bottom: 2.5rem; text-decoration: none;
        }
        .brand-gem {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #f43f5e, #c2185b);
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .brand-gem svg { width: 14px; height: 14px; fill: white; }
        .brand-name {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--muted);
        }
        .nav-section-label {
          font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--slate); margin-bottom: 0.5rem; padding: 0 0.85rem;
        }
        .nav-item {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.6rem 0.85rem; border-radius: 9px; margin-bottom: 0.2rem;
          cursor: pointer; color: var(--muted); font-size: 0.82rem; font-weight: 400;
          transition: background 0.15s, color 0.15s;
          border: none; background: transparent; width: 100%; text-align: left;
          text-decoration: none;
        }
        .nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
        .nav-item:hover { background: rgba(56,189,248,0.06); color: var(--snow); }
        .nav-item.active { background: rgba(56,189,248,0.1); color: var(--ice); }
        .nav-item.active svg { stroke: var(--ice); }
        .nav-divider { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }
        .sidebar-footer { margin-top: auto; }
        .user-pill {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.65rem 0.85rem; border-radius: 9px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          margin-bottom: 0.5rem;
        }
        .user-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #f43f5e, #c2185b);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 700; color: white; flex-shrink: 0;
        }
        .user-info { flex: 1; min-width: 0; }
        .user-name {
          font-size: 0.75rem; font-weight: 500; color: var(--snow);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-role {
          font-size: 0.62rem; color: #f43f5e; letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .sidebar-hamburger { display: flex; }
          .sidebar-overlay { display: block; pointer-events: none; }
          .sidebar-drawer { display: flex; }
        }
      `}</style>

      {/* ── Hamburger (mobile/tablet) ── */}
      <button
        className={`sidebar-hamburger ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen((v) => !v)}
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
      >
        <span />
        <span />
        <span />
      </button>

      {/* ── Overlay ── */}
      <div
        className={`sidebar-overlay ${drawerOpen ? "show" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Mobile/tablet drawer ── */}
      <aside className={`sidebar-drawer ${drawerOpen ? "open" : ""}`}>
        <SidebarContent
          session={session}
          pathname={pathname}
          initials={initials}
        />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside className="sidebar">
        <SidebarContent
          session={session}
          pathname={pathname}
          initials={initials}
        />
      </aside>
    </>
  );
}

/* Extracted to avoid duplicating JSX */
function SidebarContent({
  session,
  pathname,
  initials,
}: {
  session: any;
  pathname: string;
  initials: string;
}) {
  return (
    <>
      <Link href="/admin/dashboard" className="brand">
        <div className="brand-gem">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
          </svg>
        </div>
        <span className="brand-name">Admin</span>
      </Link>

      <p className="nav-section-label">Navigation</p>
      <nav>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`nav-item ${pathname === n.href ? "active" : ""}`}
          >
            {n.icon}
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <hr className="nav-divider" />
        <div className="user-pill">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">
              {session.user?.name ?? session.user?.email}
            </div>
            <div className="user-role">Admin</div>
          </div>
        </div>
        <button
          className="nav-item"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <Icon.LogOut />
          Sign out
        </button>
      </div>
    </>
  );
}
