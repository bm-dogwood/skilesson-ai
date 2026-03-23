"use client";

import { useState, useMemo } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  level: string | null;
  sport: string | null;
  createdAt: string;
  plan: string | null;
  subStatus: string | null;
  totalLessons: number;
  completed: number;
  inProgress: number;
  progressPct: number;
};

type SortKey = "name" | "createdAt" | "progressPct" | "totalLessons";

const LEVEL_STYLE: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  beginner: {
    color: "var(--ice)",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.25)",
  },
  intermediate: {
    color: "var(--gold)",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  advanced: {
    color: "var(--rose)",
    bg: "rgba(244,63,94,0.1)",
    border: "rgba(244,63,94,0.25)",
  },
};

const PLAN_STYLE: Record<string, { color: string; bg: string }> = {
  explorer: { color: "var(--powder)", bg: "rgba(125,211,252,0.1)" },
  summit: { color: "var(--gold)", bg: "rgba(245,158,11,0.1)" },
  apex: { color: "var(--rose)", bg: "rgba(244,63,94,0.1)" },
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <div className="stu-avatar">{initials || "?"}</div>;
}

function ProgressBar({ pct }: { pct: number }) {
  const color =
    pct >= 75 ? "var(--ice)" : pct >= 40 ? "var(--gold)" : "var(--slate)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div className="prog-track">
        <div
          className="prog-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span
        style={{ fontSize: "0.72rem", color: "var(--slate)", minWidth: "30px" }}
      >
        {pct}%
      </span>
    </div>
  );
}

export default function StudentsTable({ students }: { students: Student[] }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevel] = useState<string>("all");
  const [sportFilter, setSport] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);

  const levels = useMemo(() => {
    const s = new Set(
      students.map((s) => s.level?.toLowerCase()).filter(Boolean) as string[]
    );
    return Array.from(s);
  }, [students]);

  const sports = useMemo(() => {
    const s = new Set(
      students.map((s) => s.sport?.toLowerCase()).filter(Boolean) as string[]
    );
    return Array.from(s);
  }, [students]);

  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      const matchLevel =
        levelFilter === "all" || (s.level?.toLowerCase() ?? "") === levelFilter;
      const matchSport =
        sportFilter === "all" || (s.sport?.toLowerCase() ?? "") === sportFilter;
      return matchSearch && matchLevel && matchSport;
    });

    list = [...list].sort((a, b) => {
      let va: number | string = 0;
      let vb: number | string = 0;
      if (sortKey === "name") {
        va = a.name;
        vb = b.name;
      }
      if (sortKey === "createdAt") {
        va = a.createdAt;
        vb = b.createdAt;
      }
      if (sortKey === "progressPct") {
        va = a.progressPct;
        vb = b.progressPct;
      }
      if (sortKey === "totalLessons") {
        va = a.totalLessons;
        vb = b.totalLessons;
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [students, search, levelFilter, sportFilter, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <svg
      style={{
        width: 12,
        height: 12,
        stroke: sortKey === col ? "var(--ice)" : "var(--slate)",
        fill: "none",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        marginLeft: 4,
        flexShrink: 0,
        transform: sortKey === col && sortAsc ? "rotate(180deg)" : "none",
        transition: "transform 0.2s",
      }}
      viewBox="0 0 24 24"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
        }

        .stu-page { font-family: 'Sora', sans-serif; color: var(--snow); }

        /* Header */
        .stu-header { margin-bottom: 2rem; animation: fadeUp 0.35s ease both; }
        .stu-eyebrow { font-size:.68rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--ice); margin-bottom:.5rem; }
        .stu-title { font-family:'Lora',serif; font-size:2rem; font-weight:400; color:var(--snow); margin-bottom:.35rem; }
        .stu-sub { font-size:.85rem; color:var(--slate); font-weight:300; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Stat chips */
        .stat-chips { display:flex; gap:.75rem; flex-wrap:wrap; margin-bottom:1.75rem; animation: fadeUp .35s ease .05s both; }

        .stat-chip {
          display:flex; align-items:center; gap:.5rem;
          background:rgba(255,255,255,.025); border:1px solid rgba(71,85,105,.2);
          border-radius:10px; padding:.6rem 1rem;
        }

        .chip-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .chip-val { font-size:.9rem; font-weight:600; color:var(--snow); }
        .chip-lbl { font-size:.7rem; color:var(--slate); }

        /* Toolbar */
        .toolbar {
          display:flex; gap:.75rem; flex-wrap:wrap; align-items:center;
          margin-bottom:1rem; animation: fadeUp .35s ease .08s both;
        }

        .search-wrap { position:relative; flex:1; min-width:200px; }

        .search-icon {
          position:absolute; left:.85rem; top:50%; transform:translateY(-50%);
          width:15px; height:15px; stroke:var(--slate); fill:none; stroke-width:1.75;
          stroke-linecap:round; stroke-linejoin:round; pointer-events:none;
          transition:stroke .2s;
        }
        .search-wrap:focus-within .search-icon { stroke:var(--ice); }

        .search-input {
          width:100%; background:rgba(255,255,255,.03);
          border:1px solid rgba(71,85,105,.3); border-radius:10px;
          padding:.7rem .9rem .7rem 2.5rem; color:var(--snow);
          font-family:'Sora',sans-serif; font-size:.83rem; font-weight:300;
          outline:none; transition:border-color .2s, box-shadow .2s;
        }
        .search-input::placeholder { color:rgba(71,85,105,.55); }
        .search-input:focus { border-color:var(--ice); box-shadow:0 0 0 3px rgba(56,189,248,.1); }

        .filter-select {
          background:rgba(255,255,255,.03); border:1px solid rgba(71,85,105,.3);
          border-radius:10px; padding:.7rem 2rem .7rem .9rem; color:var(--snow);
          font-family:'Sora',sans-serif; font-size:.78rem;
          outline:none; cursor:pointer; appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right .7rem center;
          transition:border-color .2s;
        }
        .filter-select:focus { border-color:var(--ice); outline:none; }

        .result-count { font-size:.75rem; color:var(--slate); margin-left:auto; white-space:nowrap; }

        /* Table card */
        .table-card {
          background:rgba(255,255,255,.025); border:1px solid rgba(71,85,105,.2);
          border-radius:16px; overflow:hidden; animation: fadeUp .35s ease .12s both;
        }

        .tbl { width:100%; border-collapse:collapse; }

        .tbl thead tr { border-bottom:1px solid rgba(71,85,105,.2); }

        .tbl th {
          padding:.85rem 1.25rem; text-align:left;
          font-size:.65rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
          color:var(--slate); white-space:nowrap; user-select:none;
        }

        .th-btn {
          display:inline-flex; align-items:center; background:none; border:none;
          cursor:pointer; color:inherit; font:inherit; letter-spacing:inherit;
          text-transform:inherit; padding:0; transition:color .15s;
        }
        .th-btn:hover { color:var(--powder); }

        .tbl tbody tr {
          border-bottom:1px solid rgba(71,85,105,.08);
          transition:background .15s;
        }
        .tbl tbody tr:last-child { border-bottom:none; }
        .tbl tbody tr:hover { background:rgba(255,255,255,.02); }

        .tbl td { padding:.9rem 1.25rem; vertical-align:middle; }

        /* Avatar */
        .stu-avatar {
          width:34px; height:34px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg, var(--ice), var(--powder));
          display:flex; align-items:center; justify-content:center;
          font-size:.72rem; font-weight:600; color:var(--navy);
        }

        .name-cell { display:flex; align-items:center; gap:.75rem; }
        .name-text { font-size:.83rem; font-weight:500; color:var(--snow); }
        .email-text { font-size:.7rem; color:var(--slate); margin-top:.1rem; }

        /* Badges */
        .badge {
          display:inline-block; font-size:.65rem; font-weight:600;
          letter-spacing:.06em; text-transform:capitalize;
          padding:.2rem .6rem; border-radius:100px; border:1px solid transparent;
          white-space:nowrap;
        }

        /* Progress */
        .prog-track {
          flex:1; height:5px; background:rgba(71,85,105,.25);
          border-radius:3px; overflow:hidden; min-width:60px;
        }
        .prog-fill { height:100%; border-radius:3px; transition:width .4s ease; }

        /* Empty state */
        .empty-state {
          display:flex; flex-direction:column; align-items:center; gap:.75rem;
          padding:4rem 2rem; color:var(--slate); text-align:center;
        }
        .empty-icon { width:44px; height:44px; stroke:rgba(71,85,105,.4); fill:none; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; }
        .empty-title { font-size:.9rem; color:var(--snow); font-weight:500; }
        .empty-sub { font-size:.78rem; font-weight:300; }
      `}</style>

      <div className="stu-page">
        {/* Header */}
        <div className="stu-header">
          <p className="stu-eyebrow">Manage Students</p>
          <h1 className="stu-title">Students</h1>
          <p className="stu-sub">
            All registered students and their learning progress.
          </p>
        </div>

        {/* Stat chips */}
        <div className="stat-chips">
          {[
            { dot: "var(--ice)", val: students.length, lbl: "Total students" },
            {
              dot: "var(--gold)",
              val: students.filter((s) => s.subStatus === "active").length,
              lbl: "Active subscribers",
            },
            {
              dot: "#22c55e",
              val: students.filter((s) => s.progressPct === 100).length,
              lbl: "100% complete",
            },
            {
              dot: "var(--slate)",
              val: students.filter((s) => s.totalLessons === 0).length,
              lbl: "Not started",
            },
          ].map((c, i) => (
            <div className="stat-chip" key={i}>
              <div className="chip-dot" style={{ background: c.dot }} />
              <span className="chip-val">{c.val}</span>
              <span className="chip-lbl">{c.lbl}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {levels.length > 0 && (
            <select
              className="filter-select"
              value={levelFilter}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="all">All levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          )}

          {sports.length > 0 && (
            <select
              className="filter-select"
              value={sportFilter}
              onChange={(e) => setSport(e.target.value)}
            >
              <option value="all">All sports</option>
              {sports.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          )}

          <span className="result-count">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="table-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <div className="empty-title">No students found</div>
              <div className="empty-sub">
                Try adjusting your search or filters.
              </div>
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>
                    <button
                      className="th-btn"
                      onClick={() => toggleSort("name")}
                    >
                      Student <SortIcon col="name" />
                    </button>
                  </th>
                  <th>Level</th>
                  <th>Sport</th>
                  <th>Plan</th>
                  <th>
                    <button
                      className="th-btn"
                      onClick={() => toggleSort("progressPct")}
                    >
                      Progress <SortIcon col="progressPct" />
                    </button>
                  </th>
                  <th>
                    <button
                      className="th-btn"
                      onClick={() => toggleSort("totalLessons")}
                    >
                      Lessons <SortIcon col="totalLessons" />
                    </button>
                  </th>
                  <th>
                    <button
                      className="th-btn"
                      onClick={() => toggleSort("createdAt")}
                    >
                      Joined <SortIcon col="createdAt" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const lStyle = s.level
                    ? LEVEL_STYLE[s.level.toLowerCase()]
                    : null;
                  const pStyle = s.plan
                    ? PLAN_STYLE[s.plan.toLowerCase()]
                    : null;

                  return (
                    <tr key={s.id}>
                      {/* Name */}
                      <td>
                        <div className="name-cell">
                          <Avatar name={s.name} />
                          <div>
                            <div className="name-text">{s.name}</div>
                            <div className="email-text">{s.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td>
                        {lStyle ? (
                          <span
                            className="badge"
                            style={{
                              color: lStyle.color,
                              background: lStyle.bg,
                              borderColor: lStyle.border,
                            }}
                          >
                            {s.level}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "var(--slate)",
                              fontSize: ".75rem",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>

                      {/* Sport */}
                      <td>
                        {s.sport ? (
                          <span
                            style={{
                              fontSize: ".78rem",
                              color: "var(--snow)",
                              textTransform: "capitalize",
                            }}
                          >
                            {s.sport}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "var(--slate)",
                              fontSize: ".75rem",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>

                      {/* Plan */}
                      <td>
                        {pStyle && s.plan ? (
                          <span
                            className="badge"
                            style={{
                              color: pStyle.color,
                              background: pStyle.bg,
                              borderColor: "transparent",
                            }}
                          >
                            {s.plan}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "var(--slate)",
                              fontSize: ".75rem",
                            }}
                          >
                            Free
                          </span>
                        )}
                      </td>

                      {/* Progress */}
                      <td style={{ minWidth: "140px" }}>
                        <ProgressBar pct={s.progressPct} />
                        <div
                          style={{
                            fontSize: ".65rem",
                            color: "var(--slate)",
                            marginTop: ".25rem",
                          }}
                        >
                          {s.completed}/{s.totalLessons} completed
                          {s.inProgress > 0 && ` · ${s.inProgress} in progress`}
                        </div>
                      </td>

                      {/* Lessons */}
                      <td>
                        <span
                          style={{
                            fontSize: ".83rem",
                            color: "var(--snow)",
                            fontWeight: 500,
                          }}
                        >
                          {s.totalLessons}
                        </span>
                      </td>

                      {/* Joined */}
                      <td>
                        <span
                          style={{ fontSize: ".75rem", color: "var(--slate)" }}
                        >
                          {fmt(s.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
