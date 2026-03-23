"use client";

// app/admin/_components/AdminSidebar.tsx

import { useEffect } from "react";
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

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  // Don't render sidebar until auth is confirmed
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
        .sidebar {
          width: 220px; flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 1.5rem 1rem;
          position: sticky; top: 0; height: 100vh;
        }

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

        @media (max-width: 768px) {
          .sidebar { display: none; }
        }
      `}</style>

      <aside className="sidebar">
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
      </aside>
    </>
  );
}
