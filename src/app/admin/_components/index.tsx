// app/admin/_components/index.tsx
// Shared types, icons, Badge, and global admin CSS

export type View = "dashboard" | "users" | "content" | "pricing";

export interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string | null;
  createdAt: string;
}

export interface ContentRow {
  id: string;
  title: string;
  sport: string;
  level: string;
  instructor: string;
  duration: number | null;
  createdAt: string;
}

export interface PricingPlan {
  id: "explorer" | "summit" | "apex";
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  color: string;
  features: string[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

export const Icon = {
  Grid: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Users: () => (
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
  Play: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="m10 8 5 3-5 3V8z" fill="currentColor" stroke="none" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  Tag: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  LogOut: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  TrendUp: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Edit: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  ),
  Save: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
};

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    admin: "rgba(244,63,94,0.15)",
    instructor: "rgba(245,158,11,0.15)",
    student: "rgba(56,189,248,0.1)",
    explorer: "rgba(56,189,248,0.1)",
    summit: "rgba(245,158,11,0.15)",
    apex: "rgba(244,63,94,0.15)",
    beginner: "rgba(56,189,248,0.1)",
    intermediate: "rgba(245,158,11,0.15)",
    advanced: "rgba(244,63,94,0.15)",
  };
  const text: Record<string, string> = {
    admin: "#f43f5e",
    instructor: "#f59e0b",
    student: "#38bdf8",
    explorer: "#38bdf8",
    summit: "#f59e0b",
    apex: "#f43f5e",
    beginner: "#38bdf8",
    intermediate: "#f59e0b",
    advanced: "#f43f5e",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.6rem",
        borderRadius: 6,
        background: colors[value] ?? "rgba(71,85,105,0.2)",
        color: text[value] ?? "#94a3b8",
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "capitalize" as const,
      }}
    >
      {value ?? "—"}
    </span>
  );
}

export function fmtDuration(s: number | null) {
  if (!s) return "—";
  return `${Math.floor(s / 60)}m`;
}

// ─── Global admin CSS (inject once in layout) ─────────────────────────────────

export const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

:root {
  --navy:   #0f172a;
  --surface:#141f35;
  --card:   #1a2744;
  --border: rgba(71,85,105,0.25);
  --snow:   #f8fafc;
  --muted:  #94a3b8;
  --slate:  #475569;
  --ice:    #38bdf8;
  --powder: #7dd3fc;
  --gold:   #f59e0b;
  --rose:   #f43f5e;
}



/* Layout */
.admin-shell  { display: flex; min-height: 100vh; }
.admin-main   { flex: 1; overflow-y: auto; padding: 2.5rem 2.75rem; }

/* Page header */
.page-eyebrow { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
                color: var(--ice); margin-bottom: 0.35rem; }
.page-title   { font-family: 'Lora', serif; font-size: 1.9rem; font-weight: 400;
                color: var(--snow); margin-bottom: 2rem; }

/* Cards */
.card-block {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem;
}
.card-title { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
              text-transform: uppercase; color: var(--muted); margin-bottom: 1.25rem; }

/* Table */
.table-wrap { background: var(--card); border: 1px solid var(--border);
              border-radius: 14px; overflow: hidden; }
.table-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
}
.search-wrap { position: relative; }
.search-input {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border);
  border-radius: 8px; padding: 0.55rem 0.9rem 0.55rem 2.2rem;
  color: var(--snow); font-family: 'Sora', sans-serif; font-size: 0.8rem;
  outline: none; width: 220px;
}
.search-input::placeholder { color: var(--slate); }
.search-input:focus { border-color: var(--ice); }
.search-icon {
  position: absolute; left: 0.7rem; top: 50%; transform: translateY(-50%);
  width: 13px; height: 13px; stroke: var(--slate); fill: none; stroke-width: 2;
  pointer-events: none;
}

table { width: 100%; border-collapse: collapse; }
thead th {
  padding: 0.75rem 1.5rem; text-align: left; font-size: 0.65rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--slate);
  border-bottom: 1px solid var(--border);
}
tbody tr { border-bottom: 1px solid rgba(71,85,105,0.12); transition: background 0.15s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: rgba(56,189,248,0.03); }
tbody td { padding: 0.9rem 1.5rem; font-size: 0.8rem; color: var(--muted); vertical-align: middle; }
.td-name  { color: var(--snow); font-weight: 500; }
.td-email { color: var(--muted); font-size: 0.75rem; }

/* Buttons */
.btn { display: inline-flex; align-items: center; gap: 0.45rem;
       border-radius: 9px; padding: 0.65rem 1.1rem; cursor: pointer;
       font-family: 'Sora', sans-serif; font-size: 0.78rem; font-weight: 600;
       letter-spacing: 0.06em; border: none; transition: opacity 0.15s, transform 0.1s; }
.btn:hover  { opacity: 0.9; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn svg    { width: 14px; height: 14px; }
.btn-primary { background: var(--ice); color: var(--navy); }
.btn-ghost   { background: rgba(255,255,255,0.06); color: var(--muted); border: 1px solid var(--border); }
.btn-add     { background: rgba(56,189,248,0.08); color: var(--ice); border: 1px solid rgba(56,189,248,0.2); }

.icon-btn {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border);
  border-radius: 7px; padding: 0.4rem; cursor: pointer; color: var(--muted);
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  display: inline-flex; align-items: center;
}
.icon-btn svg { width: 14px; height: 14px; }
.icon-btn:hover { border-color: var(--ice); color: var(--ice); background: rgba(56,189,248,0.06); }
.icon-btn.danger:hover { border-color: var(--rose); color: var(--rose); background: rgba(244,63,94,0.06); }

/* Toast */
.toast {
  position: fixed; bottom: 2rem; right: 2rem;
  background: #1a3a2a; border: 1px solid #34d399; border-radius: 10px;
  padding: 0.75rem 1.25rem; color: #34d399; font-size: 0.8rem; font-weight: 500;
  display: flex; align-items: center; gap: 0.5rem;
  animation: rise 0.3s ease both; z-index: 100;
}
.toast svg { width: 14px; height: 14px; stroke: #34d399; }

@keyframes rise { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:translateY(0); } }

@media (max-width: 768px) {
  .admin-main { padding: 1.5rem; }
}
`;
