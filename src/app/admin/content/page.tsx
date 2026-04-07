// app/dashboard/videos/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface LessonProgress {
  status: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  sport: string;
  playbackId: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  uploadId: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string | null };
  _count: { progress: number };
  progress: LessonProgress[];
}

const formatDuration = (seconds: number | null): string => {
  if (!seconds || seconds === 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const LEVEL_STYLE: Record<string, { bg: string; text: string }> = {
  beginner: { bg: "rgba(52,211,153,0.15)", text: "#34d399" },
  intermediate: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  advanced: { bg: "rgba(244,63,94,0.15)", text: "#f43f5e" },
};

function getLevelStyle(level: string) {
  return (
    LEVEL_STYLE[level?.toLowerCase()] ?? {
      bg: "rgba(71,85,105,0.2)",
      text: "#94a3b8",
    }
  );
}

export default function VideosPage() {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/lessons");
      const data = await res.json();
      if (data.success && Array.isArray(data.lessons)) setLessons(data.lessons);
      else throw new Error("Failed to fetch lessons");
    } catch (err) {
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const currentUserRole = (session?.user as any)?.role || "student";

  const sports = [
    "all",
    ...Array.from(new Set(lessons.map((l) => l.sport).filter(Boolean))),
  ];
  const filtered = lessons.filter((l) => {
    const matchSport = filter === "all" || l.sport === filter;
    const matchSearch =
      !search || l.title.toLowerCase().includes(search.toLowerCase());
    return matchSport && matchSearch;
  });

  const totalLessons = lessons.length;
  const totalEnrollments = lessons.reduce(
    (s, l) => s + (l._count?.progress || 0),
    0
  );
  const totalCompleted = lessons.reduce(
    (s, l) =>
      s + (l.progress?.filter((p) => p.status === "COMPLETED").length || 0),
    0
  );
  const completionRate =
    totalEnrollments > 0
      ? Math.round((totalCompleted / totalEnrollments) * 100)
      : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        :root {
          --navy:   #0f172a; --surface: #141f35; --card: #1a2744;
          --border: rgba(71,85,105,0.25); --snow: #f8fafc;
          --muted:  #94a3b8; --slate: #475569;
          --ice: #38bdf8; --gold: #f59e0b; --rose: #f43f5e; --green: #34d399;
        }
        .vp * { box-sizing: border-box; font-family: 'Sora', sans-serif; }

        /* ── Stat cards ── */
        .vp-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.9rem; margin-bottom: 2rem; }
        .vp-stat {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px;
          padding: 1.25rem 1.4rem; position: relative; overflow: hidden;
          transition: transform 0.15s, border-color 0.2s;
        }
        .vp-stat:hover { transform: translateY(-2px); }
        .vp-stat::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(56,189,248,0.03) 0%, transparent 60%);
          pointer-events:none;
        }
        .vp-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.8rem; }
        .vp-stat-icon {
          width:32px; height:32px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
        }
        .vp-stat-icon svg { width:15px; height:15px; }
        .vp-stat-val { font-family:'Lora',serif; font-size:1.7rem; font-weight:400; color:var(--snow); line-height:1; }
        .vp-stat-lbl { font-size:0.67rem; color:var(--muted); font-weight:500; margin-top:0.25rem; letter-spacing:0.04em; }

        /* ── Toolbar ── */
        .vp-toolbar {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .vp-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .vp-search-icon {
          position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px; stroke: var(--slate); fill: none; stroke-width: 2;
          pointer-events: none;
        }
        .vp-search {
          width: 100%; padding: 0.6rem 0.9rem 0.6rem 2.2rem;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 9px; color: var(--snow);
          font-family: 'Sora', sans-serif; font-size: 0.8rem; outline: none;
          transition: border-color 0.15s;
        }
        .vp-search::placeholder { color: var(--slate); }
        .vp-search:focus { border-color: var(--ice); }

        .vp-filters { display: flex; gap: 0.45rem; flex-wrap: wrap; }
        .vp-filter {
          padding: 0.45rem 0.9rem; border-radius: 7px; font-size: 0.7rem;
          font-weight: 500; border: 1px solid var(--border);
          background: rgba(255,255,255,0.04); color: var(--muted);
          cursor: pointer; transition: all 0.15s;
          font-family: 'Sora', sans-serif; text-transform: capitalize;
        }
        .vp-filter:hover  { border-color: var(--ice); color: var(--ice); }
        .vp-filter.active { background: rgba(56,189,248,0.1); border-color: rgba(56,189,248,0.35); color: var(--ice); }

        /* ── Add button ── */
        .vp-add-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.6rem 1.1rem; border-radius: 9px;
          background: var(--ice); color: var(--navy);
          font-family: 'Sora', sans-serif; font-size: 0.78rem; font-weight: 600;
          border: none; cursor: pointer; text-decoration: none;
          transition: opacity 0.15s, transform 0.1s; white-space: nowrap;
        }
        .vp-add-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .vp-add-btn svg { width: 13px; height: 13px; }

        /* ── Grid ── */
        .vp-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }

        /* ── Card ── */
        .vp-card {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .vp-card:hover {
          border-color: rgba(56,189,248,0.3); transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        /* Thumbnail */
        .vp-thumb {
          position: relative; aspect-ratio: 16/9;
          background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
          overflow: hidden;
        }
        .vp-thumb img { width:100%; height:100%; object-fit:cover; transition: transform 0.4s; }
        .vp-card:hover .vp-thumb img { transform: scale(1.04); }
        .vp-thumb-placeholder {
          display: flex; align-items: center; justify-content: center; height: 100%;
        }
        .vp-thumb-placeholder svg { width:40px; height:40px; stroke:rgba(56,189,248,0.2); }

        /* Play overlay */
        .vp-play-overlay {
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          background: rgba(0,0,0,0); transition: background 0.2s;
        }
        .vp-card:hover .vp-play-overlay { background: rgba(0,0,0,0.3); }
        .vp-play-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(56,189,248,0.9); display:flex; align-items:center; justify-content:center;
          opacity: 0; transform: scale(0.8); transition: opacity 0.2s, transform 0.2s;
        }
        .vp-card:hover .vp-play-btn { opacity: 1; transform: scale(1); }
        .vp-play-btn svg { width:18px; height:18px; fill:var(--navy); margin-left:2px; }

        /* Badges on thumb */
        .vp-level-badge {
          position: absolute; top: 0.65rem; left: 0.65rem;
          padding: 0.18rem 0.55rem; border-radius: 5px;
          font-size: 0.62rem; font-weight: 600; letter-spacing: 0.06em;
          text-transform: capitalize;
        }
        .vp-duration {
          position: absolute; bottom: 0.65rem; right: 0.65rem;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
          color: var(--snow); font-size: 0.65rem; font-weight: 600;
          padding: 0.2rem 0.55rem; border-radius: 5px; font-variant-numeric: tabular-nums;
        }

        /* Card body */
        .vp-body { padding: 1.1rem 1.25rem; display:flex; flex-direction:column; gap:0.85rem; flex:1; }

        .vp-title-row { display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem; }
        .vp-title { font-size:0.88rem; font-weight:600; color:var(--snow); line-height:1.35; flex:1; }
        .vp-sport {
          font-size:0.62rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
          padding:0.2rem 0.55rem; border-radius:5px;
          background:rgba(56,189,248,0.08); color:var(--ice); border:1px solid rgba(56,189,248,0.15);
          white-space:nowrap; flex-shrink:0;
        }
        .vp-desc { font-size:0.74rem; color:var(--muted); line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

        /* Mini stats */
        .vp-mini-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem; }
        .vp-mini { text-align:center; padding:0.55rem 0.35rem; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid var(--border); }
        .vp-mini-val { font-size:0.95rem; font-weight:600; color:var(--snow); line-height:1; }
        .vp-mini-lbl { font-size:0.58rem; color:var(--slate); margin-top:0.2rem; text-transform:uppercase; letter-spacing:0.06em; }

        /* Progress bar */
        .vp-progress-row { display:flex; justify-content:space-between; font-size:0.62rem; color:var(--slate); margin-bottom:0.35rem; }
        .vp-progress-track { height:3px; background:rgba(71,85,105,0.3); border-radius:2px; overflow:hidden; }
        .vp-progress-fill  { height:100%; background:linear-gradient(90deg, var(--ice), #7dd3fc); border-radius:2px; transition:width 0.5s; }

        /* Meta row */
        .vp-meta { display:flex; align-items:center; justify-content:space-between; padding-top:0.75rem; border-top:1px solid var(--border); }
        .vp-meta-item { display:flex; align-items:center; gap:0.35rem; font-size:0.65rem; color:var(--slate); }
        .vp-meta-item svg { width:12px; height:12px; }

        /* Actions */
        .vp-actions { display:flex; gap:0.5rem; }
        .vp-btn-primary {
          flex:1; text-align:center; padding:0.6rem; border-radius:8px;
          background:rgba(56,189,248,0.1); color:var(--ice);
          border:1px solid rgba(56,189,248,0.2); font-size:0.74rem; font-weight:600;
          text-decoration:none; transition:all 0.15s;
        }
        .vp-btn-primary:hover { background:rgba(56,189,248,0.18); border-color:rgba(56,189,248,0.4); }
        .vp-btn-ghost {
          padding:0.6rem 0.85rem; border-radius:8px;
          background:rgba(255,255,255,0.04); color:var(--muted);
          border:1px solid var(--border); font-size:0.74rem; font-weight:500;
          text-decoration:none; transition:all 0.15s;
        }
        .vp-btn-ghost:hover { border-color:var(--slate); color:var(--snow); }

        /* Loading / Error / Empty */
        .vp-center { display:flex; align-items:center; justify-content:center; min-height:300px; flex-direction:column; gap:1rem; }
        .vp-spinner { width:22px; height:22px; border:2px solid var(--border); border-top-color:var(--ice); border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }

        .vp-empty { text-align:center; padding:4rem 2rem; }
        .vp-empty-icon {
          width:56px; height:56px; margin:0 auto 1.25rem;
          background:rgba(56,189,248,0.07); border:1px solid rgba(56,189,248,0.15);
          border-radius:14px; display:flex; align-items:center; justify-content:center;
        }
        .vp-empty-icon svg { width:24px; height:24px; stroke:var(--ice); }
        .vp-empty h3 { font-family:'Lora',serif; font-size:1.1rem; color:var(--snow); margin:0 0 0.4rem; font-weight:400; }
        .vp-empty p  { font-size:0.78rem; color:var(--muted); margin:0 0 1.25rem; }

        .vp-error { background:rgba(244,63,94,0.07); border:1px solid rgba(244,63,94,0.2); border-radius:14px; padding:2rem; text-align:center; }
        .vp-error svg { width:32px; height:32px; stroke:var(--rose); margin:0 auto 0.75rem; display:block; }
        .vp-error h3 { color:var(--snow); font-size:0.9rem; margin:0 0 0.35rem; }
        .vp-error p  { color:var(--muted); font-size:0.78rem; margin:0 0 1rem; }
        .vp-retry {
          padding:0.55rem 1.1rem; border-radius:8px; background:rgba(244,63,94,0.12);
          color:var(--rose); border:1px solid rgba(244,63,94,0.25);
          font-family:'Sora',sans-serif; font-size:0.76rem; font-weight:600; cursor:pointer;
          transition:all 0.15s;
        }
        .vp-retry:hover { background:rgba(244,63,94,0.2); }

        @media(max-width:1200px) { .vp-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:900px)  { .vp-stats { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:700px)  { .vp-grid { grid-template-columns:1fr; } .vp-stats { grid-template-columns:1fr 1fr; } }
      `}</style>

      <div className="vp">
        {/* ── Header ── */}
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ice)",
            marginBottom: "0.35rem",
          }}
        >
          Content
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Lora',serif",
                fontSize: "1.9rem",
                fontWeight: 400,
                color: "var(--snow)",
                margin: "0 0 0.3rem",
              }}
            >
              Lesson Library
            </h1>
            <p
              style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}
            >
              Browse, manage and track all available lessons
            </p>
          </div>
          {(currentUserRole === "admin" ||
            currentUserRole === "instructor") && (
            <Link href="/admin/content/add-content" className="vp-add-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Lesson
            </Link>
          )}
        </div>

        {/* ── Stat cards ── */}
        <div className="vp-stats">
          {[
            {
              label: "Total Lessons",
              value: totalLessons,
              color: "#38bdf8",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path
                    d="m10 8 5 3-5 3V8z"
                    fill="currentColor"
                    stroke="none"
                  />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              ),
            },
            {
              label: "Total Enrollments",
              value: totalEnrollments,
              color: "#34d399",
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
              label: "Completion Rate",
              value: `${completionRate}%`,
              color: "#f59e0b",
              icon: (
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
            },
          ].map((s) => (
            <div className="vp-stat" key={s.label}>
              <div className="vp-stat-top">
                <div
                  className="vp-stat-icon"
                  style={{
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}30`,
                  }}
                >
                  <svg
                    style={{ width: 15, height: 15, stroke: s.color }}
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </div>
              </div>
              <div className="vp-stat-val">{s.value}</div>
              <div className="vp-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="vp-toolbar">
          <div className="vp-search-wrap">
            <svg className="vp-search-icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="vp-search"
              placeholder="Search lessons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="vp-filters">
            {sports.map((s) => (
              <button
                key={s}
                className={`vp-filter${filter === s ? " active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s === "all" ? "All Sports" : s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="vp-center">
            <div className="vp-spinner" />
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Loading lessons…
            </span>
          </div>
        ) : error ? (
          <div className="vp-error">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <h3>Failed to load lessons</h3>
            <p>{error}</p>
            <button className="vp-retry" onClick={fetchLessons}>
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="vp-empty">
            <div className="vp-empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="m10 8 5 3-5 3V8z" fill="currentColor" stroke="none" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h3>
              {lessons.length === 0 ? "No lessons yet" : "No results found"}
            </h3>
            <p>
              {lessons.length === 0
                ? "Create your first lesson to get started."
                : "Try a different search or filter."}
            </p>
            {lessons.length === 0 &&
              (currentUserRole === "admin" ||
                currentUserRole === "instructor") && (
                <Link
                  href="/admin/content/add-content"
                  className="vp-add-btn"
                  style={{ display: "inline-flex" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ width: 13, height: 13 }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Create First Lesson
                </Link>
              )}
          </div>
        ) : (
          <div className="vp-grid">
            {filtered.map((lesson) => {
              const completedCount =
                lesson.progress?.filter((p) => p.status === "COMPLETED")
                  .length || 0;
              const inProgressCount =
                lesson.progress?.filter((p) => p.status === "IN_PROGRESS")
                  .length || 0;
              const totalSt = lesson._count?.progress || 0;
              const rate = totalSt > 0 ? (completedCount / totalSt) * 100 : 0;
              const lvStyle = getLevelStyle(lesson.level);

              return (
                <div className="vp-card" key={lesson.id}>
                  {/* Thumbnail */}
                  <div className="vp-thumb">
                    {lesson.thumbnailUrl ? (
                      <img src={lesson.thumbnailUrl} alt={lesson.title} />
                    ) : (
                      <div className="vp-thumb-placeholder">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <path d="m10 8 5 3-5 3V8z" />
                        </svg>
                      </div>
                    )}
                    <div className="vp-play-overlay">
                      <div className="vp-play-btn">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 3l14 9-14 9V3z" />
                        </svg>
                      </div>
                    </div>
                    <span
                      className="vp-level-badge"
                      style={{ background: lvStyle.bg, color: lvStyle.text }}
                    >
                      {lesson.level || "Beginner"}
                    </span>
                    {lesson.duration && lesson.duration > 0 && (
                      <span className="vp-duration">
                        {formatDuration(lesson.duration)}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="vp-body">
                    <div>
                      <div className="vp-title-row">
                        <span className="vp-title">{lesson.title}</span>
                        <span className="vp-sport">
                          {lesson.sport || "General"}
                        </span>
                      </div>
                      <p className="vp-desc" style={{ marginTop: "0.4rem" }}>
                        {lesson.description || "No description provided"}
                      </p>
                    </div>

                    {/* Mini stats */}
                    <div className="vp-mini-stats">
                      <div className="vp-mini">
                        <div className="vp-mini-val">{totalSt}</div>
                        <div className="vp-mini-lbl">Enrolled</div>
                      </div>
                      <div
                        className="vp-mini"
                        style={{
                          borderColor: "rgba(52,211,153,0.15)",
                          background: "rgba(52,211,153,0.05)",
                        }}
                      >
                        <div
                          className="vp-mini-val"
                          style={{ color: "#34d399" }}
                        >
                          {completedCount}
                        </div>
                        <div className="vp-mini-lbl">Done</div>
                      </div>
                      <div
                        className="vp-mini"
                        style={{
                          borderColor: "rgba(245,158,11,0.15)",
                          background: "rgba(245,158,11,0.05)",
                        }}
                      >
                        <div
                          className="vp-mini-val"
                          style={{ color: "#f59e0b" }}
                        >
                          {inProgressCount}
                        </div>
                        <div className="vp-mini-lbl">Active</div>
                      </div>
                    </div>

                    {/* Progress */}
                    {totalSt > 0 && (
                      <div>
                        <div className="vp-progress-row">
                          <span>Completion</span>
                          <span
                            style={{ color: "var(--snow)", fontWeight: 600 }}
                          >
                            {Math.round(rate)}%
                          </span>
                        </div>
                        <div className="vp-progress-track">
                          <div
                            className="vp-progress-fill"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="vp-meta">
                      <div className="vp-meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span
                          style={{
                            maxWidth: 100,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lesson.user?.name ||
                            lesson.user?.email?.split("@")[0] ||
                            "Instructor"}
                        </span>
                      </div>
                      <div className="vp-meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        <span>
                          {new Date(lesson.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="vp-actions">
                      <Link
                        href={`/admin/content/view-content/${lesson.id}`}
                        className="vp-btn-primary"
                      >
                        View Lesson
                      </Link>
                      {(currentUserRole === "admin" ||
                        currentUserRole === "instructor") && (
                        <Link
                          href={`/admin/content/edit-content/${lesson.id}`}
                          className="vp-btn-ghost"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
