// app/admin/dashboard/page.tsx

import Link from "next/link";
import { Icon, Badge, ADMIN_CSS } from "../_components";
import {
  getDashboardStats,
  getRecentUsers,
  getPlanDistribution,
  getRevenueByMonth,
} from "@/lib/dashboard";
const STATS = {
  totalUsers: 12483,
  activeSubscriptions: 3841,
  totalLessons: 296,
  monthlyRevenue: 48320,
};

const RECENT_USERS = [
  {
    id: "1",
    name: "Ava Mitchell",
    email: "ava@example.com",
    role: "student",
    plan: "summit",
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    role: "instructor",
    plan: "apex",
    createdAt: "2024-11-03",
  },
  {
    id: "3",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "student",
    plan: null,
    createdAt: "2025-03-01",
  },
  {
    id: "4",
    name: "James Okafor",
    email: "james@example.com",
    role: "admin",
    plan: "apex",
    createdAt: "2024-06-15",
  },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const users = await getRecentUsers();
  const plans = await getPlanDistribution();
  const revenue = await getRevenueByMonth();

  const STAT_CARDS = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      delta: "+",
      positive: true,
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubscriptions.toLocaleString(),
      delta: "+",
      positive: true,
    },
    {
      label: "Lessons Published",
      value: stats.totalLessons.toString(),
      delta: "+",
      positive: true,
    },
    {
      label: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toFixed(0)}`,
      delta: "+",
      positive: true,
    },
  ];
  return (
    <>
      <style>{`
        ${ADMIN_CSS}

        /* Stat grid */
        .stat-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1rem; margin-bottom: 2.5rem;
        }
        .stat-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 14px; padding: 1.35rem 1.5rem;
        }
        .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
        .stat-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .stat-icon svg { width: 16px; height: 16px; stroke: var(--ice); }
        .stat-delta { font-size: 0.7rem; font-weight: 500; }
        .stat-delta.pos { color: #34d399; }
        .stat-delta.neg { color: var(--rose); }
        .stat-val { font-family: 'Lora', serif; font-size: 1.8rem; font-weight: 400; color: var(--snow); }
        .stat-lbl { font-size: 0.7rem; color: var(--muted); margin-top: 0.2rem; }

        /* Charts row */
        .chart-row { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1rem; margin-bottom: 2rem; }

        .bar-chart { display: flex; align-items: flex-end; gap: 0.5rem; height: 120px; }
        .bar-col   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; }
        .bar       { width: 100%; border-radius: 5px 5px 0 0; background: rgba(56,189,248,0.25);
                     transition: background 0.2s; cursor: default; }
        .bar:hover { background: var(--ice); }
        .bar-month { font-size: 0.58rem; color: var(--slate); text-transform: uppercase; }

        .donut-wrap   { display: flex; align-items: center; justify-content: center; gap: 2rem; }
        .donut-legend { display: flex; flex-direction: column; gap: 0.6rem; }
        .legend-item  { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--muted); }
        .legend-dot   { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .legend-pct   { margin-left: auto; padding-left: 1rem; color: var(--snow); font-weight: 500; }

        /* Quick-action cards */
        .quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .quick-card {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px;
          padding: 1.25rem 1.5rem; text-decoration: none; display: flex; align-items: center;
          gap: 0.85rem; transition: border-color 0.2s, transform 0.15s;
        }
        .quick-card:hover { border-color: rgba(56,189,248,0.35); transform: translateY(-2px); }
        .quick-icon {
          width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .quick-icon svg { width: 16px; height: 16px; }
        .quick-label { font-size: 0.8rem; font-weight: 500; color: var(--snow); }
        .quick-sub   { font-size: 0.68rem; color: var(--slate); margin-top: 0.15rem; }

        @media (max-width: 1200px) {
          .stat-grid  { grid-template-columns: repeat(2, 1fr); }
          .chart-row  { grid-template-columns: 1fr; }
          .quick-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .stat-grid  { grid-template-columns: 1fr 1fr; }
          .quick-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <p className="page-eyebrow">Overview</p>
      <h1 className="page-title">Dashboard</h1>

      {/* ── Stat cards ── */}
      <div className="stat-grid">
        {STAT_CARDS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-top">
              <div className="stat-icon">
                <Icon.TrendUp />
              </div>
              <span className={`stat-delta ${s.positive ? "pos" : "neg"}`}>
                {s.delta}
              </span>
            </div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="chart-row">
        <div className="card-block">
          <div className="card-title">Revenue — last 6 months</div>
          {revenue.map(({ month, value }) => (
            <div className="bar-col" key={month}>
              <div
                className="bar"
                style={{ height: `${value}%` }}
                title={`${month}: ${value}`}
              />
              <span className="bar-month">{month}</span>
            </div>
          ))}
        </div>

        <div className="card-block">
          <div className="card-title">Plan distribution</div>
          <div className="donut-wrap">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="28"
                fill="none"
                stroke="rgba(56,189,248,0.3)"
                strokeWidth="12"
                strokeDasharray="74 176"
                strokeDashoffset="0"
              />
              <circle
                cx="40"
                cy="40"
                r="28"
                fill="none"
                stroke="rgba(245,158,11,0.5)"
                strokeWidth="12"
                strokeDasharray="62 176"
                strokeDashoffset="-74"
              />
              <circle
                cx="40"
                cy="40"
                r="28"
                fill="none"
                stroke="rgba(244,63,94,0.5)"
                strokeWidth="12"
                strokeDasharray="40 176"
                strokeDashoffset="-136"
              />
            </svg>
            <div className="donut-legend">
              {[
                { label: "Explorer", pct: "42%", color: "#38bdf8" },
                { label: "Summit", pct: "35%", color: "#f59e0b" },
                { label: "Apex", pct: "23%", color: "#f43f5e" },
              ].map(({ label, pct, color }) => (
                <div className="legend-item" key={label}>
                  <span className="legend-dot" style={{ background: color }} />
                  {label}
                  <span className="legend-pct">{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="quick-grid" style={{ marginBottom: "2rem" }}>
        <Link href="/admin/users" className="quick-card">
          <div
            className="quick-icon"
            style={{ background: "rgba(56,189,248,0.1)" }}
          >
            <Icon.Users />
          </div>
          <div>
            <div className="quick-label">Manage Users</div>
            <div className="quick-sub">View, edit and delete accounts</div>
          </div>
        </Link>
        <Link href="/admin/content" className="quick-card">
          <div
            className="quick-icon"
            style={{ background: "rgba(245,158,11,0.1)" }}
          >
            <Icon.Play />
          </div>
          <div>
            <div className="quick-label">Manage Content</div>
            <div className="quick-sub">Lessons, sports & instructors</div>
          </div>
        </Link>
        <Link href="/admin/pricing" className="quick-card">
          <div
            className="quick-icon"
            style={{ background: "rgba(244,63,94,0.1)" }}
          >
            <Icon.Tag />
          </div>
          <div>
            <div className="quick-label">Pricing Plans</div>
            <div className="quick-sub">Edit Explorer, Summit & Apex</div>
          </div>
        </Link>
      </div>

      {/* ── Recent users ── */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Recent Users
          </span>
          <Link
            href="/admin/users"
            className="btn btn-ghost"
            style={{ fontSize: "0.72rem" }}
          >
            View all →
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="td-name">{u.name ?? "—"}</td>
                <td className="td-email">{u.email}</td>
                <td>
                  <Badge value={u.role} />
                </td>
                <td>
                  {u.subscription?.plan ? (
                    <Badge value={u.subscription.plan} />
                  ) : (
                    <span style={{ color: "var(--slate)" }}>Free</span>
                  )}
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
