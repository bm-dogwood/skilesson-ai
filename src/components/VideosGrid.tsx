"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Lesson = {
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
  totalStudents: number;
  completions: number;
  inProgress: number;
};

const LEVEL_STYLE: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  beginner: {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.25)",
  },
  intermediate: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  advanced: {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.1)",
    border: "rgba(244,63,94,0.25)",
  },
};

function fmtDuration(secs: number | null) {
  if (!secs) return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function VideoCard({
  lesson,
  view,
  onDelete,
}: {
  lesson: Lesson;
  view: "grid" | "list";
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const ls = LEVEL_STYLE[lesson.level?.toLowerCase()] ?? null;
  const dur = fmtDuration(lesson.duration);

  const thumb =
    lesson.thumbnailUrl ??
    (lesson.playbackId
      ? `https://image.mux.com/${lesson.playbackId}/thumbnail.jpg?width=640&time=2`
      : null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/lessons/${lesson.id}`, { method: "DELETE" });
      onDelete(lesson.id);
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(71,85,105,0.2)",
        borderRadius: 14,
        overflow: "hidden",
        display: view === "list" ? "grid" : "flex",
        gridTemplateColumns: view === "list" ? "200px 1fr" : undefined,
        flexDirection: view === "grid" ? "column" : undefined,
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(71,85,105,0.45)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(71,85,105,0.2)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          aspectRatio: view === "grid" ? "16/9" : undefined,
          minHeight: view === "list" ? 120 : undefined,
          background: "#080f1e",
          flexShrink: 0,
        }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={lesson.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: view === "grid" ? 160 : 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(71,85,105,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </div>
        )}

        {dur && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.75)",
              color: "#f8fafc",
              fontSize: "0.65rem",
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 5,
            }}
          >
            {dur}
          </div>
        )}

        {ls && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              color: ls.color,
              background: ls.bg,
              border: `1px solid ${ls.border}`,
              fontSize: "0.62rem",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 100,
              textTransform: "capitalize",
            }}
          >
            {lesson.level}
          </div>
        )}

        {/* Ready / Processing pill */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            padding: "3px 8px",
            borderRadius: 100,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: lesson.playbackId ? "#22c55e" : "#f59e0b",
              animation: lesson.playbackId
                ? undefined
                : "vpulse 1.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.62rem",
              color: lesson.playbackId ? "#4ade80" : "#f59e0b",
            }}
          >
            {lesson.playbackId ? "Ready" : "Processing"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "1rem 1.1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              color: "#475569",
              textTransform: "capitalize",
            }}
          >
            {lesson.sport}
          </span>
          <span style={{ fontSize: "0.68rem", color: "rgba(71,85,105,0.6)" }}>
            {fmtDate(lesson.createdAt)}
          </span>
        </div>

        <div
          style={{
            fontSize: "0.92rem",
            fontWeight: 600,
            color: "#f8fafc",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {lesson.title}
        </div>

        <div
          style={{
            fontSize: "0.75rem",
            color: "#475569",
            fontWeight: 300,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {lesson.description}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginTop: "0.15rem",
          }}
        >
          {[
            {
              icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
              label: `${lesson.totalStudents} student${
                lesson.totalStudents !== 1 ? "s" : ""
              }`,
              color: "#475569",
            },
            {
              icon: "M20 6L9 17l-5-5",
              label: `${lesson.completions} completed`,
              color: "#475569",
            },
            ...(lesson.inProgress > 0
              ? [
                  {
                    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-10V6m0 6l4 2",
                    label: `${lesson.inProgress} in progress`,
                    color: "#f59e0b",
                  },
                ]
              : []),
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.72rem",
                color: s.color,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={s.icon} />
              </svg>
              {s.label}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "auto",
            paddingTop: "0.6rem",
            borderTop: "1px solid rgba(71,85,105,0.1)",
          }}
        >
          {lesson.playbackId && (
            <a
              href={`https://stream.mux.com/${lesson.playbackId}.m3u8`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.7rem",
                borderRadius: 7,
                background: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.2)",
                color: "#38bdf8",
                fontSize: "0.7rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Preview
            </a>
          )}

          <div style={{ marginLeft: "auto" }}>
            {confirming ? (
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: "0.3rem 0.7rem",
                    borderRadius: 7,
                    background: "rgba(244,63,94,0.15)",
                    border: "1px solid rgba(244,63,94,0.3)",
                    color: "#f43f5e",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {deleting ? "…" : "Confirm delete"}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  style={{
                    padding: "0.3rem 0.7rem",
                    borderRadius: 7,
                    background: "rgba(71,85,105,0.12)",
                    border: "1px solid rgba(71,85,105,0.25)",
                    color: "#475569",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.3rem 0.7rem",
                  borderRadius: 7,
                  background: "rgba(244,63,94,0.07)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  color: "#f43f5e",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <svg
                  width="12"
                  height="12"
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
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideosGrid({
  lessons: initial,
}: {
  lessons: Lesson[];
}) {
  const [lessons, setLessons] = useState(initial);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevel] = useState("all");
  const [sportFilter, setSport] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const levels = useMemo(
    () =>
      [
        ...new Set(lessons.map((l) => l.level?.toLowerCase()).filter(Boolean)),
      ] as string[],
    [lessons]
  );
  const sports = useMemo(
    () =>
      [
        ...new Set(lessons.map((l) => l.sport?.toLowerCase()).filter(Boolean)),
      ] as string[],
    [lessons]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return lessons.filter((l) => {
      const mQ =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q);
      const mL =
        levelFilter === "all" || l.level?.toLowerCase() === levelFilter;
      const mS =
        sportFilter === "all" || l.sport?.toLowerCase() === sportFilter;
      return mQ && mL && mS;
    });
  }, [lessons, search, levelFilter, sportFilter]);

  const handleDelete = (id: string) =>
    setLessons((p) => p.filter((l) => l.id !== id));

  const ready = lessons.filter((l) => l.playbackId).length;
  const processing = lessons.filter((l) => !l.playbackId).length;
  const totalViews = lessons.reduce((a, l) => a + l.totalStudents, 0);

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(71,85,105,0.3)",
    borderRadius: 10,
    padding: "0.65rem 0.9rem",
    color: "#f8fafc",
    fontFamily: "Sora, sans-serif",
    fontSize: "0.82rem",
    outline: "none",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,400&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes vpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        * { box-sizing: border-box; }
        select option { background: #0f172a; }
      `}</style>

      <div style={{ fontFamily: "Sora, sans-serif", color: "#f8fafc" }}>
        {/* Header */}
        <div
          style={{ marginBottom: "2rem", animation: "fadeUp 0.35s ease both" }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#38bdf8",
              marginBottom: "0.5rem",
            }}
          >
            Content Library
          </p>
          <h1
            style={{
              fontFamily: "Lora, serif",
              fontSize: "2rem",
              fontWeight: 400,
              color: "#f8fafc",
              marginBottom: "0.35rem",
            }}
          >
            My Videos
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 300 }}>
            All lessons you've uploaded and published.
          </p>
        </div>

        {/* Stat chips */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
            animation: "fadeUp 0.35s ease 0.05s both",
          }}
        >
          {[
            { dot: "#38bdf8", val: lessons.length, lbl: "Total lessons" },
            { dot: "#22c55e", val: ready, lbl: "Ready" },
            { dot: "#f59e0b", val: processing, lbl: "Processing" },
            { dot: "#7dd3fc", val: totalViews, lbl: "Total views" },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(71,85,105,0.2)",
                borderRadius: 10,
                padding: "0.6rem 1rem",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c.dot,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#f8fafc",
                }}
              >
                {c.val}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#475569" }}>
                {c.lbl}
              </span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "1.25rem",
            animation: "fadeUp 0.35s ease 0.08s both",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <svg
              style={{
                position: "absolute",
                left: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: 15,
                height: 15,
                stroke: "#475569",
                fill: "none",
                strokeWidth: 1.75,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                pointerEvents: "none",
              }}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              style={{ ...inputStyle, width: "100%", paddingLeft: "2.5rem" }}
              placeholder="Search lessons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {levels.length > 0 && (
            <select
              style={inputStyle}
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
              style={inputStyle}
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

          {/* View toggle */}
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(71,85,105,0.2)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  background: view === v ? "rgba(56,189,248,0.12)" : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.6rem 0.75rem",
                  color: view === v ? "#38bdf8" : "#475569",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {v === "grid" ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <Link
            href="/instructor/upload"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#38bdf8",
              border: "none",
              borderRadius: 10,
              padding: "0.65rem 1.1rem",
              color: "#0f172a",
              fontFamily: "Sora, sans-serif",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Upload
          </Link>

          <span
            style={{
              fontSize: "0.75rem",
              color: "#475569",
              marginLeft: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {filtered.length} lesson{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              padding: "5rem 2rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(71,85,105,0.15)",
              borderRadius: 14,
              textAlign: "center",
              animation: "fadeUp 0.35s ease 0.12s both",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(71,85,105,0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
            <div
              style={{ fontSize: "0.9rem", color: "#f8fafc", fontWeight: 500 }}
            >
              {lessons.length === 0
                ? "No lessons uploaded yet"
                : "No lessons match your filters"}
            </div>
            <div
              style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 300 }}
            >
              {lessons.length === 0
                ? "Head to Upload Lesson to add your first video."
                : "Try adjusting your search or filters."}
            </div>
            {lessons.length === 0 && (
              <Link
                href="/instructor/upload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginTop: "0.5rem",
                  background: "#38bdf8",
                  borderRadius: 10,
                  padding: "0.65rem 1.1rem",
                  color: "#0f172a",
                  fontFamily: "Sora, sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                + Upload your first lesson
              </Link>
            )}
          </div>
        ) : (
          <div
            style={{
              display: view === "grid" ? "grid" : "flex",
              gridTemplateColumns:
                view === "grid"
                  ? "repeat(auto-fill, minmax(300px, 1fr))"
                  : undefined,
              flexDirection: view === "list" ? "column" : undefined,
              gap: view === "grid" ? "1.25rem" : "0.75rem",
              animation: "fadeUp 0.35s ease 0.12s both",
            }}
          >
            {filtered.map((l) => (
              <VideoCard
                key={l.id}
                lesson={l}
                view={view}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
