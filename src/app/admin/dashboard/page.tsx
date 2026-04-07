// app/admin/dashboard/page.tsx

import Link from "next/link";
import { Icon, Badge, ADMIN_CSS } from "../_components";
import {
  getDashboardStats,
  getRecentUsers,
  getPlanDistribution,
  getRevenueByMonth,
  getSignupsByDay,
  getChurnByMonth,
} from "@/lib/dashboard";

export default async function AdminDashboardPage() {
  const [stats, users, plans, revenue, signups, churn] = await Promise.all([
    getDashboardStats(),
    getRecentUsers(),
    getPlanDistribution(),
    getRevenueByMonth(),
    getSignupsByDay(),
    getChurnByMonth(),
  ]);

  // ── Plan donut config ──────────────────────────────────────────────────────
  const PLAN_COLORS: Record<string, { stroke: string; solid: string }> = {
    explorer: { stroke: "rgba(56,189,248,0.5)", solid: "#38bdf8" },
    summit: { stroke: "rgba(245,158,11,0.5)", solid: "#f59e0b" },
    apex: { stroke: "rgba(244,63,94,0.5)", solid: "#f43f5e" },
  };
  const CIRCUMFERENCE = 2 * Math.PI * 28; // r=28
  let donutOffset = 0;
  const donutSlices = plans.map((p) => {
    const dashArray = (p.pct / 100) * CIRCUMFERENCE;
    const slice = { ...p, dashArray, dashOffset: -donutOffset };
    donutOffset += dashArray;
    return slice;
  });

  // ── Signup sparkline SVG path ──────────────────────────────────────────────
  const sparkMax = Math.max(...signups.map((d) => d.count), 1);
  const SW = 280,
    SH = 60;
  const sparkPoints = signups.map((d, i) => {
    const x = (i / (signups.length - 1)) * SW;
    const y = SH - (d.count / sparkMax) * SH;
    return `${x},${y}`;
  });
  const sparkPath = `M ${sparkPoints.join(" L ")}`;
  const sparkFill = `M 0,${SH} L ${sparkPoints.join(" L ")} L ${SW},${SH} Z`;

  // ── Revenue line path ──────────────────────────────────────────────────────
  const revMax = Math.max(...revenue.map((r) => r.value), 1);
  const RW = 400,
    RH = 100;
  const revPoints = revenue.map((r, i) => {
    const x = (i / (revenue.length - 1)) * RW;
    const y = RH - (r.value / revMax) * RH * 0.85 - RH * 0.075;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const revPath = `M ${revPoints.join(" L ")}`;
  const revFill = `M 0,${RH} L ${revPoints.join(" L ")} L ${RW},${RH} Z`;

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const STAT_CARDS = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sub: `+${stats.newUsersThisMonth} this month`,
      delta: stats.userGrowthPct,
      positive: stats.userGrowthPct >= 0,
      icon: "users",
    },
    {
      label: "Active Subscriptions",
      value: stats.activeSubscriptions.toLocaleString(),
      sub: `+${stats.newSubsThisMonth} new this month`,
      delta: stats.subGrowthPct,
      positive: stats.subGrowthPct >= 0,
      icon: "tag",
    },
    {
      label: "Lessons Published",
      value: stats.totalLessons.toString(),
      sub: "Total across all sports",
      delta: null,
      positive: true,
      icon: "play",
    },
    {
      label: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      sub: `$${stats.yearlyRevenue.toLocaleString()} annual ARR`,
      delta: null,
      positive: true,
      icon: "trend",
    },
    {
      label: "Cancellations",
      value: stats.canceledThisMonth.toString(),
      sub: "This month",
      delta: null,
      positive: stats.canceledThisMonth === 0,
      icon: "churn",
    },
  ];

  return (
    <>
      <style>{`
        ${ADMIN_CSS}

        /* ── Stat grid ── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.9rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.2rem 1.35rem;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(56,189,248,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .stat-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(56,189,248,0.08);
          border: 1px solid rgba(56,189,248,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .stat-icon svg { width: 14px; height: 14px; stroke: var(--ice); }
        .stat-icon.rose { background: rgba(244,63,94,0.08); border-color: rgba(244,63,94,0.15); }
        .stat-icon.rose svg { stroke: var(--rose); }
        .stat-icon.gold { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.15); }
        .stat-icon.gold svg { stroke: var(--gold); }
        .stat-delta {
          font-size: 0.65rem; font-weight: 600;
          padding: 0.15rem 0.45rem; border-radius: 5px;
        }
        .stat-delta.pos { color: #34d399; background: rgba(52,211,153,0.1); }
        .stat-delta.neg { color: var(--rose); background: rgba(244,63,94,0.1); }
        .stat-val {
          font-family: 'Lora', serif;
          font-size: 1.65rem; font-weight: 400;
          color: var(--snow); line-height: 1;
          margin-bottom: 0.3rem;
        }
        .stat-lbl  { font-size: 0.68rem; color: var(--muted); font-weight: 500; }
        .stat-sub  { font-size: 0.62rem; color: var(--slate); margin-top: 0.2rem; }

        /* ── Charts grid ── */
        .charts-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 0.9rem;
          margin-bottom: 0.9rem;
        }
        .charts-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.9rem;
          margin-bottom: 2rem;
        }

        .card-block {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.35rem 1.5rem;
        }
        .card-title {
          font-size: 0.67rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 0.35rem;
        }
        .card-subtitle {
          font-size: 0.72rem; color: var(--slate); margin-bottom: 1.25rem;
        }

        /* ── Revenue line chart ── */
        .line-chart-wrap { position: relative; }
        .line-chart-svg { width: 100%; overflow: visible; }
        .rev-labels {
          display: flex; justify-content: space-between;
          margin-top: 0.5rem;
        }
        .rev-label { font-size: 0.58rem; color: var(--slate); }

        /* ── Signup sparkline ── */
        .spark-wrap { margin-top: 0.5rem; }
        .spark-meta {
          display: flex; align-items: baseline; gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .spark-big   { font-family: 'Lora', serif; font-size: 1.5rem; color: var(--snow); }
        .spark-trend { font-size: 0.68rem; color: #34d399; }

        /* ── Donut chart ── */
        .donut-wrap { display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
        .donut-legend { display: flex; flex-direction: column; gap: 0.55rem; }
        .legend-item { display: flex; align-items: center; gap: 0.45rem; font-size: 0.72rem; color: var(--muted); }
        .legend-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .legend-pct  { margin-left: auto; padding-left: 1rem; color: var(--snow); font-weight: 600; font-size: 0.72rem; }

        /* ── Churn chart ── */
        .churn-bars { display: flex; gap: 0.4rem; align-items: flex-end; height: 80px; margin-top: 0.5rem; }
        .churn-col  { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
        .churn-bar-wrap { width: 100%; flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 2px; }
        .churn-bar  { width: 100%; border-radius: 3px 3px 0 0; min-height: 2px; }
        .churn-bar.new      { background: rgba(56,189,248,0.4); }
        .churn-bar.canceled { background: rgba(244,63,94,0.4); }
        .churn-month { font-size: 0.55rem; color: var(--slate); text-transform: uppercase; }
        .churn-legend {
          display: flex; gap: 1rem; margin-bottom: 0.85rem;
        }
        .churn-leg-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.65rem; color: var(--muted); }
        .churn-dot { width: 6px; height: 6px; border-radius: 2px; }

        /* ── Quick actions ── */
        .quick-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0.9rem; margin-bottom: 2rem;
        }
        .quick-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 14px; padding: 1.1rem 1.35rem;
          text-decoration: none; display: flex; align-items: center;
          gap: 0.75rem; transition: border-color 0.2s, transform 0.15s;
        }
        .quick-card:hover { border-color: rgba(56,189,248,0.35); transform: translateY(-2px); }
        .quick-icon {
          width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .quick-icon svg { width: 15px; height: 15px; }
        .quick-label { font-size: 0.78rem; font-weight: 500; color: var(--snow); }
        .quick-sub   { font-size: 0.65rem; color: var(--slate); margin-top: 0.1rem; }

        @media (max-width: 1300px) {
          .stat-grid     { grid-template-columns: repeat(3, 1fr); }
          .charts-grid   { grid-template-columns: 1fr; }
          .charts-bottom { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 900px) {
          .stat-grid     { grid-template-columns: repeat(2, 1fr); }
          .charts-bottom { grid-template-columns: 1fr; }
          .quick-grid    { grid-template-columns: 1fr; }
        }
      `}</style>

      <p className="page-eyebrow">Overview</p>
      <h1 className="page-title">Dashboard</h1>

      {/* ── Stat cards ── */}
      <div className="stat-grid">
        {STAT_CARDS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-top">
              <div
                className={`stat-icon ${
                  s.icon === "churn" ? "rose" : s.icon === "tag" ? "gold" : ""
                }`}
              >
                {s.icon === "users" && <Icon.Users />}
                {s.icon === "tag" && <Icon.Tag />}
                {s.icon === "play" && <Icon.Play />}
                {s.icon === "trend" && <Icon.TrendUp />}
                {s.icon === "churn" && <Icon.TrendUp />}
              </div>
              {s.delta !== null && (
                <span className={`stat-delta ${s.positive ? "pos" : "neg"}`}>
                  {s.positive ? "▲" : "▼"} {Math.abs(s.delta)}%
                </span>
              )}
            </div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts row 1: Revenue line + Donut ── */}
      <div className="charts-grid">
        {/* Revenue line chart */}
        <div className="card-block">
          <div className="card-title">Revenue trend</div>
          <div className="card-subtitle">
            Monthly revenue — last 6 months · Peak $
            {Math.max(...revenue.map((r) => r.value)).toLocaleString()}
          </div>
          <div className="line-chart-wrap">
            <svg
              className="line-chart-svg"
              viewBox={`0 0 ${RW} ${RH}`}
              preserveAspectRatio="none"
              height="100"
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((f, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={RH * f}
                  x2={RW}
                  y2={RH * f}
                  stroke="rgba(71,85,105,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
              {/* Fill */}
              <path d={revFill} fill="url(#revGrad)" />
              {/* Line */}
              <path
                d={revPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {revenue.map((r, i) => {
                const x = (i / (revenue.length - 1)) * RW;
                const y = RH - (r.value / revMax) * RH * 0.85 - RH * 0.075;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <title>{`$${r.value.toLocaleString()}`}</title>
                  </g>
                );
              })}
            </svg>
            <div className="rev-labels">
              {revenue.map((r) => (
                <span className="rev-label" key={r.month}>
                  {r.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Plan distribution donut */}
        <div className="card-block">
          <div className="card-title">Plan distribution</div>
          <div className="card-subtitle">Active subscriptions by tier</div>
          <div className="donut-wrap">
            <svg viewBox="0 0 80 80" width="90" height="90">
              {donutSlices.length > 0 ? (
                donutSlices.map((s, i) => (
                  <circle
                    key={i}
                    cx="40"
                    cy="40"
                    r="28"
                    fill="none"
                    stroke={
                      PLAN_COLORS[s.plan]?.stroke ?? "rgba(71,85,105,0.3)"
                    }
                    strokeWidth="13"
                    strokeDasharray={`${s.dashArray} ${CIRCUMFERENCE}`}
                    strokeDashoffset={s.dashOffset}
                    strokeLinecap="butt"
                    transform="rotate(-90 40 40)"
                  />
                ))
              ) : (
                <circle
                  cx="40"
                  cy="40"
                  r="28"
                  fill="none"
                  stroke="rgba(71,85,105,0.3)"
                  strokeWidth="13"
                />
              )}
              <text
                x="40"
                y="36"
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="9"
                fontFamily="Lora,serif"
              >
                {stats.activeSubscriptions}
              </text>
              <text
                x="40"
                y="47"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="5.5"
              >
                active
              </text>
            </svg>
            <div className="donut-legend">
              {plans.length > 0 ? (
                plans.map((p) => (
                  <div className="legend-item" key={p.plan}>
                    <span
                      className="legend-dot"
                      style={{
                        background: PLAN_COLORS[p.plan]?.solid ?? "#475569",
                      }}
                    />
                    <span style={{ textTransform: "capitalize" }}>
                      {p.plan}
                    </span>
                    <span className="legend-pct">{p.pct}%</span>
                  </div>
                ))
              ) : (
                <div
                  className="legend-item"
                  style={{ color: "var(--slate)", fontSize: "0.7rem" }}
                >
                  No subscriptions yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts row 2: Signups sparkline + Churn + Mini stats ── */}
      <div className="charts-bottom">
        {/* New signups sparkline */}
        <div className="card-block">
          <div className="card-title">New signups</div>
          <div className="spark-meta">
            <span className="spark-big">{stats.newUsersThisMonth}</span>
            <span className="spark-trend">
              {stats.userGrowthPct >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(stats.userGrowthPct)}% vs last month
            </span>
          </div>
          <div className="spark-wrap">
            <svg
              viewBox={`0 0 ${SW} ${SH}`}
              preserveAspectRatio="none"
              width="100%"
              height="60"
            >
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={sparkFill} fill="url(#sparkGrad)" />
              <path
                d={sparkPath}
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: "0.62rem",
              color: "var(--slate)",
              marginTop: "0.4rem",
            }}
          >
            Last 30 days · {stats.totalUsers.toLocaleString()} total users
          </div>
        </div>

        {/* Churn bar chart */}
        <div className="card-block">
          <div className="card-title">Signups vs Cancellations</div>
          <div className="churn-legend">
            <div className="churn-leg-item">
              <div
                className="churn-dot"
                style={{ background: "rgba(56,189,248,0.6)" }}
              />
              New subs
            </div>
            <div className="churn-leg-item">
              <div
                className="churn-dot"
                style={{ background: "rgba(244,63,94,0.6)" }}
              />
              Canceled
            </div>
          </div>
          {(() => {
            const maxVal = Math.max(
              ...churn.map((c) => Math.max(c.newSubs, c.canceled)),
              1
            );
            return (
              <div className="churn-bars">
                {churn.map((c) => (
                  <div className="churn-col" key={c.month}>
                    <div className="churn-bar-wrap">
                      <div
                        className="churn-bar new"
                        style={{
                          height: `${Math.round((c.newSubs / maxVal) * 64)}px`,
                        }}
                        title={`New: ${c.newSubs}`}
                      />
                      <div
                        className="churn-bar canceled"
                        style={{
                          height: `${Math.round((c.canceled / maxVal) * 64)}px`,
                        }}
                        title={`Canceled: ${c.canceled}`}
                      />
                    </div>
                    <span className="churn-month">{c.month}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Key metrics mini card */}
        <div className="card-block">
          <div className="card-title">Key metrics</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            {[
              {
                label: "Annual ARR",
                value: `$${stats.yearlyRevenue.toLocaleString()}`,
                color: "#38bdf8",
              },
              {
                label: "Churn this month",
                value: stats.canceledThisMonth.toString(),
                color: stats.canceledThisMonth > 0 ? "#f43f5e" : "#34d399",
              },
              {
                label: "New subs this month",
                value: stats.newSubsThisMonth.toString(),
                color: "#34d399",
              },
              {
                label: "Total lessons",
                value: stats.totalLessons.toLocaleString(),
                color: "#f59e0b",
              },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                  {m.label}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: m.color,
                  }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="quick-grid">
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
            <div className="quick-sub">Lessons, sports &amp; instructors</div>
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
            <div className="quick-sub">Edit Explorer, Summit &amp; Apex</div>
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
                    <Badge
                      value={
                        u.subscription?.package?.name ?? u.subscription.plan
                      }
                    />
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
