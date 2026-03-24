"use client";
import { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Submission {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string;
  aiFeedback: string;
  aiDescription?: string;
  instructorFeedback?: string;
  createdAt: string;
  status: "pending" | "completed" | "reviewed";
  user: { id: string; email: string; name?: string; avatar?: string };
  sport?: string;
  drill?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

interface FeedbackForm {
  [key: string]: { text: string; isSubmitting: boolean };
}

export default function InstructorPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "reviewed">(
    "pending"
  );
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let result = [...submissions];
    if (filter !== "all") result = result.filter((s) => s.status === filter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.user.email.toLowerCase().includes(q) ||
          s.user.name?.toLowerCase().includes(q) ||
          s.sport?.toLowerCase().includes(q) ||
          s.drill?.toLowerCase().includes(q)
      );
    }
    result.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setFilteredSubmissions(result);
  }, [submissions, filter, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/instructor/submissions");
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (id: string) => {
    const feedback = feedbackForms[id]?.text;
    if (!feedback?.trim()) return;
    setFeedbackForms((p) => ({ ...p, [id]: { ...p[id], isSubmitting: true } }));
    try {
      const res = await fetch("/api/instructor/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id, feedback: feedback.trim() }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setSubmissions((p) =>
        p.map((s) =>
          s.id === id
            ? {
                ...s,
                instructorFeedback: feedback.trim(),
                status: "reviewed" as const,
              }
            : s
        )
      );
      setFeedbackForms((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
      setSubmitSuccess(id);
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit feedback");
      setTimeout(() => setError(null), 3000);
    } finally {
      setFeedbackForms((p) => ({
        ...p,
        [id]: { ...p[id], isSubmitting: false },
      }));
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return email?.[0]?.toUpperCase() || "?";
  };

  const getLevelStyle = (level?: string) => {
    if (level === "advanced")
      return {
        bg: "rgba(244,63,94,0.12)",
        border: "rgba(244,63,94,0.35)",
        text: "#f43f5e",
      };
    if (level === "intermediate")
      return {
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.35)",
        text: "#f59e0b",
      };
    return {
      bg: "rgba(56,189,248,0.10)",
      border: "rgba(56,189,248,0.30)",
      text: "#38bdf8",
    };
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const reviewedCount = submissions.filter(
    (s) => s.status === "reviewed"
  ).length;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#0f172a",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "3px solid rgba(56,189,248,0.15)",
              borderTop: "3px solid #38bdf8",
              animation: "spin 0.85s linear infinite",
              margin: "0 auto",
            }}
          />
          <p
            style={{
              marginTop: "16px",
              color: "#7dd3fc",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "14px",
            }}
          >
            Loading submissions…
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}

        :root{
          --navy:#0f172a;
          --navy2:#1e293b;
          --navy3:#334155;
          --snow:#f8fafc;
          --ice:#38bdf8;
          --powder:#7dd3fc;
          --slate:#475569;
          --slate2:#64748b;
          --gold:#f59e0b;
          --rose:#f43f5e;
        }

        body{background:var(--navy);color:var(--snow);font-family:'DM Sans',sans-serif}

        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:var(--navy2)}
        ::-webkit-scrollbar-thumb{background:var(--navy3);border-radius:3px}

        .page{
          min-height:100vh;
          background:var(--navy);
          background-image:
            radial-gradient(ellipse 90% 55% at 50% -15%,rgba(56,189,248,0.065) 0%,transparent 65%),
            radial-gradient(ellipse 45% 35% at 95% 85%,rgba(245,158,11,0.045) 0%,transparent 55%),
            radial-gradient(ellipse 35% 25% at 5% 70%,rgba(244,63,94,0.03) 0%,transparent 50%);
        }

        /* Header */
        .header{
          position:sticky;top:0;z-index:40;
          background:rgba(15,23,42,0.9);
          backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(56,189,248,0.08);
        }
        .header-inner{max-width:960px;margin:0 auto;padding:0 24px}
        .header-top{display:flex;align-items:center;justify-content:space-between;padding:20px 0 0;gap:16px;flex-wrap:wrap}

        .logo-mark{
          width:42px;height:42px;border-radius:11px;
          background:linear-gradient(135deg,#38bdf8 0%,#0ea5e9 100%);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          box-shadow:0 0 22px rgba(56,189,248,0.32),0 4px 12px rgba(0,0,0,0.35);
        }

        .page-title{font-family:'Syne',sans-serif;font-size:23px;font-weight:800;color:var(--snow);letter-spacing:-0.4px;line-height:1}
        .page-sub{font-size:13px;color:var(--slate2);margin-top:3px;font-weight:400}

        .stat-chip{
          display:flex;align-items:center;gap:7px;padding:6px 14px;
          background:var(--navy2);border:1px solid var(--navy3);border-radius:100px;
          font-size:13px;font-weight:500;color:var(--snow);white-space:nowrap;
        }
        .stat-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}

        /* Filter bar */
        .filter-bar{display:flex;align-items:center;gap:8px;padding:14px 0 16px;flex-wrap:wrap}

        .tab{
          padding:7px 15px;border-radius:8px;
          font-size:13px;font-weight:500;cursor:pointer;
          transition:all 0.15s;border:1px solid transparent;white-space:nowrap;
          font-family:inherit;
        }
        .tab-on{background:rgba(56,189,248,0.13);border-color:rgba(56,189,248,0.38);color:var(--ice)}
        .tab-off{background:transparent;border-color:var(--navy3);color:var(--slate2)}
        .tab-off:hover{background:var(--navy2);border-color:var(--slate);color:var(--snow)}

        .search-wrap{position:relative;margin-left:auto}
        .search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--slate);pointer-events:none}
        .search-input{
          background:var(--navy2);border:1px solid var(--navy3);border-radius:8px;
          padding:8px 12px 8px 33px;font-size:13px;color:var(--snow);
          width:205px;transition:all 0.15s;font-family:inherit;
        }
        .search-input::placeholder{color:var(--slate)}
        .search-input:focus{outline:none;border-color:rgba(56,189,248,0.45);box-shadow:0 0 0 3px rgba(56,189,248,0.09);background:rgba(30,41,59,0.9)}

        /* Card */
        .card{
          background:var(--navy2);border:1px solid var(--navy3);
          border-radius:14px;overflow:hidden;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .card:hover{border-color:rgba(56,189,248,0.18);box-shadow:0 6px 28px rgba(0,0,0,0.32),0 0 0 1px rgba(56,189,248,0.06)}

        /* Card head */
        .card-head{
          display:flex;align-items:flex-start;justify-content:space-between;gap:14px;
          padding:18px 20px 15px;border-bottom:1px solid var(--navy3);flex-wrap:wrap;
          background:linear-gradient(180deg,rgba(30,41,59,0.6) 0%,transparent 100%);
        }

        .avatar{
          width:40px;height:40px;border-radius:11px;
          background:linear-gradient(135deg,#1e293b 0%,#334155 100%);
          border:1px solid rgba(56,189,248,0.22);
          display:flex;align-items:center;justify-content:center;
          color:var(--ice);font-family:'Syne',sans-serif;font-weight:700;font-size:14px;flex-shrink:0;
        }

        .student-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--snow);letter-spacing:-0.2px}

        .student-meta{display:flex;align-items:center;gap:7px;margin-top:4px;flex-wrap:wrap}
        .meta-text{font-size:12px;color:var(--slate2)}
        .meta-sep{color:var(--navy3);font-size:10px}

        .tag{
          display:inline-flex;align-items:center;
          padding:2px 9px;border-radius:100px;
          font-family:'DM Mono',monospace;font-size:10.5px;font-weight:500;
          letter-spacing:0.3px;border:1px solid;
        }
        .tag-sport{background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.22);color:var(--powder)}
        .tag-pending{background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.28);color:var(--gold)}
        .tag-reviewed{background:rgba(56,189,248,0.09);border-color:rgba(56,189,248,0.28);color:var(--ice)}

        .expand-btn{
          display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;
          border:1px solid var(--navy3);background:transparent;color:var(--slate2);
          font-size:12px;font-weight:500;cursor:pointer;transition:all 0.15s;white-space:nowrap;
          font-family:inherit;
        }
        .expand-btn:hover{background:var(--navy3);border-color:var(--slate);color:var(--snow)}

        /* Media */
        .media-wrap{position:relative;background:#060d1a;border-bottom:1px solid var(--navy3)}
        .media-badge{
          position:absolute;top:11px;left:11px;z-index:5;
          display:flex;align-items:center;gap:6px;
          background:rgba(6,13,26,0.78);backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.09);border-radius:6px;
          padding:3px 9px;font-family:'DM Mono',monospace;font-size:10px;
          letter-spacing:1.5px;text-transform:uppercase;color:var(--powder);
        }

        /* Panels */
        .section-label{
          font-family:'DM Mono',monospace;font-size:10px;
          letter-spacing:2px;text-transform:uppercase;color:var(--slate);margin-bottom:8px;
        }

        .ai-panel{
          background:rgba(56,189,248,0.04);
          border:1px solid rgba(56,189,248,0.12);border-left:3px solid var(--ice);
          border-radius:10px;padding:14px 16px;
        }
        .ai-icon{
          width:28px;height:28px;border-radius:8px;
          background:linear-gradient(135deg,#38bdf8,#0ea5e9);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          box-shadow:0 2px 8px rgba(56,189,248,0.28);
        }

        .feedback-panel{
          background:rgba(245,158,11,0.04);
          border:1px solid rgba(245,158,11,0.12);border-left:3px solid var(--gold);
          border-radius:10px;padding:14px 16px;
        }
        .feedback-icon{
          width:28px;height:28px;border-radius:8px;
          background:linear-gradient(135deg,#f59e0b,#d97706);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          box-shadow:0 2px 8px rgba(245,158,11,0.28);
        }

        .panel-text{font-size:14px;line-height:1.76;color:#cbd5e1}
        .panel-sub{font-size:13px;color:var(--slate2);margin-top:6px}

        .divider{border:none;border-top:1px solid var(--navy3);margin:16px 0}

        /* Textarea */
        .feedback-ta{
          width:100%;background:var(--navy);border:1px solid var(--navy3);border-radius:10px;
          padding:13px 14px;font-size:14px;line-height:1.76;color:var(--snow);
          resize:vertical;transition:all 0.15s;font-family:inherit;
        }
        .feedback-ta::placeholder{color:var(--slate)}
        .feedback-ta:focus{outline:none;border-color:rgba(245,158,11,0.45);box-shadow:0 0 0 3px rgba(245,158,11,0.09)}

        /* Buttons */
        .btn-primary{
          display:inline-flex;align-items:center;gap:7px;
          padding:9px 20px;border-radius:9px;
          background:linear-gradient(135deg,#38bdf8 0%,#0ea5e9 100%);
          border:none;color:#0f172a;font-size:13.5px;font-weight:600;
          cursor:pointer;transition:all 0.15s;
          box-shadow:0 2px 12px rgba(56,189,248,0.28);white-space:nowrap;
          font-family:inherit;
        }
        .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 18px rgba(56,189,248,0.38);background:linear-gradient(135deg,#7dd3fc 0%,#38bdf8 100%)}
        .btn-primary:disabled{opacity:0.32;cursor:not-allowed;transform:none;box-shadow:none}

        .btn-ghost{
          display:inline-flex;align-items:center;gap:5px;
          padding:6px 12px;border-radius:8px;border:1px solid var(--navy3);
          background:transparent;color:var(--slate2);font-size:12px;font-weight:500;
          cursor:pointer;transition:all 0.15s;font-family:inherit;
        }
        .btn-ghost:hover{background:var(--navy3);border-color:var(--slate);color:var(--snow)}

        /* Prompt tags */
        .prompt-tag{
          display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:100px;
          background:rgba(56,189,248,0.07);border:1px solid rgba(56,189,248,0.18);color:var(--powder);
          font-family:'DM Mono',monospace;font-size:10.5px;cursor:pointer;transition:all 0.15s;
        }
        .prompt-tag:hover{background:rgba(56,189,248,0.13);border-color:rgba(56,189,248,0.38);color:var(--ice)}

        /* Toast */
        .toast{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;font-size:14px;margin-bottom:18px}
        .toast-ok{background:rgba(56,189,248,0.09);border:1px solid rgba(56,189,248,0.22);border-left:3px solid var(--ice);color:var(--powder)}
        .toast-err{background:rgba(244,63,94,0.09);border:1px solid rgba(244,63,94,0.22);border-left:3px solid var(--rose);color:#fda4af}

        /* Empty */
        .empty{text-align:center;padding:80px 40px;border:1px dashed var(--navy3);border-radius:14px;background:var(--navy2)}
        .empty-icon{width:60px;height:60px;border-radius:14px;background:var(--navy3);display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
        .empty-title{font-family:'Syne',sans-serif;font-size:19px;font-weight:700;color:var(--snow);margin-bottom:7px}
        .empty-sub{font-size:14px;color:var(--slate2)}

        .word-count{font-family:'DM Mono',monospace;font-size:11px;color:var(--slate)}

        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="page">
        {/* ── Header ── */}
        <div className="header">
          <div className="header-inner">
            <div className="header-top">
              <div
                style={{ display: "flex", alignItems: "center", gap: "13px" }}
              >
                <div className="logo-mark">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div>
                  <div className="page-title">Instructor Review</div>
                  <div className="page-sub">
                    Student performance submissions
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <div className="stat-chip">
                  <span
                    className="stat-dot"
                    style={{
                      background: "#f59e0b",
                      boxShadow: "0 0 7px rgba(245,158,11,0.6)",
                    }}
                  />
                  {pendingCount} pending
                </div>
                <div className="stat-chip">
                  <span
                    className="stat-dot"
                    style={{
                      background: "#38bdf8",
                      boxShadow: "0 0 7px rgba(56,189,248,0.5)",
                    }}
                  />
                  {reviewedCount} reviewed
                </div>
              </div>
            </div>

            <div className="filter-bar">
              {(["pending", "reviewed", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`tab ${filter === f ? "tab-on" : "tab-off"}`}
                >
                  {f === "pending"
                    ? `Needs Review (${pendingCount})`
                    : f === "reviewed"
                    ? `Done (${reviewedCount})`
                    : "All"}
                </button>
              ))}
              <div className="search-wrap">
                <svg
                  className="search-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search student, sport…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "28px 24px 80px",
          }}
        >
          <AnimatePresence>
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="toast toast-err"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </motion.div>
            )}
            {submitSuccess && (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="toast toast-ok"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Feedback sent to student successfully.
              </motion.div>
            )}
          </AnimatePresence>

          {filteredSubmissions.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
              </div>
              <div className="empty-title">
                {filter === "pending" ? "Queue is clear" : "Nothing here"}
              </div>
              <div className="empty-sub">
                {filter === "pending"
                  ? "All caught up — new submissions will appear here."
                  : "No submissions match the current filter."}
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {filteredSubmissions.map((sub, i) => {
                const isExpanded = expandedItem === sub.id;
                const hasFeedback = !!sub.instructorFeedback;
                const form = feedbackForms[sub.id] || {
                  text: "",
                  isSubmitting: false,
                };
                const isPending = sub.status === "pending";
                const lvl = getLevelStyle(sub.level);
                const wordCount = form.text.trim()
                  ? form.text.trim().split(/\s+/).length
                  : 0;

                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 320,
                      damping: 28,
                    }}
                    className="card"
                  >
                    {/* Card head */}
                    <div className="card-head">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div className="avatar">
                          {getInitials(sub.user.name, sub.user.email)}
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span className="student-name">
                              {sub.user.name || sub.user.email.split("@")[0]}
                            </span>
                            <span
                              className={`tag ${
                                isPending ? "tag-pending" : "tag-reviewed"
                              }`}
                            >
                              {isPending ? "● pending" : "✓ reviewed"}
                            </span>
                            {sub.level && (
                              <span
                                className="tag"
                                style={{
                                  background: lvl.bg,
                                  borderColor: lvl.border,
                                  color: lvl.text,
                                }}
                              >
                                {sub.level}
                              </span>
                            )}
                          </div>
                          <div className="student-meta">
                            <span className="meta-text">{sub.user.email}</span>
                            <span className="meta-sep">·</span>
                            <span
                              className="meta-text"
                              style={{
                                fontFamily: "'DM Mono',monospace",
                                fontSize: "11px",
                              }}
                            >
                              {formatDistanceToNow(new Date(sub.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            {sub.sport && (
                              <>
                                <span className="meta-sep">·</span>
                                <span className="tag tag-sport">
                                  {sub.sport}
                                  {sub.drill ? ` · ${sub.drill}` : ""}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        className="expand-btn"
                        onClick={() =>
                          setExpandedItem(isExpanded ? null : sub.id)
                        }
                      >
                        <svg
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    </div>

                    {/* Media */}
                    <div className="media-wrap">
                      <div className="media-badge">
                        {sub.mediaType === "video" ? (
                          <>
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Video
                          </>
                        ) : (
                          <>
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                            Image
                          </>
                        )}
                      </div>
                      {sub.mediaType === "image" ? (
                        <img
                          src={sub.mediaUrl}
                          alt="Submission"
                          style={{
                            width: "100%",
                            objectFit: "contain",
                            display: "block",
                            maxHeight: isExpanded ? "570px" : "310px",
                            transition: "max-height 0.35s ease",
                          }}
                        />
                      ) : (
                        <video
                          src={sub.mediaUrl}
                          controls
                          poster={sub.thumbnailUrl}
                          style={{
                            width: "100%",
                            display: "block",
                            maxHeight: isExpanded ? "570px" : "310px",
                            transition: "max-height 0.35s ease",
                          }}
                        />
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: "20px" }}>
                      {/* AI Analysis */}
                      <div style={{ marginBottom: "14px" }}>
                        <div className="section-label">AI Analysis</div>
                        <div className="ai-panel">
                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div className="ai-icon">
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#0f172a"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              >
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                              </svg>
                            </div>
                            <div>
                              <p className="panel-text">{sub.aiFeedback}</p>
                              {sub.aiDescription && (
                                <p className="panel-sub">{sub.aiDescription}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="divider" />

                      {/* Instructor Feedback */}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          <div
                            className="section-label"
                            style={{ marginBottom: 0 }}
                          >
                            Your Feedback
                          </div>

                          {!hasFeedback && (
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                                flexWrap: "wrap",
                              }}
                            >
                              {[
                                "Great form",
                                "Work on follow-through",
                                "Solid improvement",
                                "Review fundamentals",
                              ].map((p) => (
                                <button
                                  key={p}
                                  className="prompt-tag"
                                  onClick={() => {
                                    const cur =
                                      feedbackForms[sub.id]?.text || "";
                                    setFeedbackForms((prev) => ({
                                      ...prev,
                                      [sub.id]: {
                                        ...prev[sub.id],
                                        text: cur ? `${cur.trimEnd()} ${p}` : p,
                                      },
                                    }));
                                    textareaRefs.current[sub.id]?.focus();
                                  }}
                                >
                                  <svg
                                    width="8"
                                    height="8"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                  </svg>
                                  {p}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="feedback-panel">
                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div className="feedback-icon">
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#0f172a"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {hasFeedback && !feedbackForms[sub.id] ? (
                                <div>
                                  <p className="panel-text">
                                    {sub.instructorFeedback}
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "8px",
                                      marginTop: "12px",
                                    }}
                                  >
                                    <button
                                      className="btn-ghost"
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          sub.instructorFeedback || ""
                                        )
                                      }
                                    >
                                      <svg
                                        width="11"
                                        height="11"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <rect
                                          x="9"
                                          y="9"
                                          width="13"
                                          height="13"
                                          rx="2"
                                        />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                      </svg>
                                      Copy
                                    </button>
                                    {isPending && (
                                      <button
                                        className="btn-ghost"
                                        onClick={() => {
                                          setFeedbackForms((p) => ({
                                            ...p,
                                            [sub.id]: {
                                              text:
                                                sub.instructorFeedback || "",
                                              isSubmitting: false,
                                            },
                                          }));
                                          setTimeout(
                                            () =>
                                              textareaRefs.current[
                                                sub.id
                                              ]?.focus(),
                                            80
                                          );
                                        }}
                                      >
                                        <svg
                                          width="11"
                                          height="11"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                  }}
                                >
                                  <textarea
                                    ref={(el) => {
                                      if (el) textareaRefs.current[sub.id] = el;
                                    }}
                                    className="feedback-ta"
                                    placeholder="Give specific, constructive guidance to help the student improve their technique…"
                                    rows={5}
                                    value={form.text}
                                    onChange={(e) =>
                                      setFeedbackForms((p) => ({
                                        ...p,
                                        [sub.id]: {
                                          ...p[sub.id],
                                          text: e.target.value,
                                        },
                                      }))
                                    }
                                    disabled={form.isSubmitting}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <span className="word-count">
                                      {wordCount > 0
                                        ? `${wordCount} word${
                                            wordCount !== 1 ? "s" : ""
                                          }`
                                        : "Start typing…"}
                                    </span>
                                    <button
                                      className="btn-primary"
                                      onClick={() => submitFeedback(sub.id)}
                                      disabled={
                                        !form.text?.trim() || form.isSubmitting
                                      }
                                    >
                                      {form.isSubmitting ? (
                                        <>
                                          <div
                                            style={{
                                              width: "13px",
                                              height: "13px",
                                              border:
                                                "2px solid rgba(15,23,42,0.3)",
                                              borderTop: "2px solid #0f172a",
                                              borderRadius: "50%",
                                              animation:
                                                "spin 0.8s linear infinite",
                                            }}
                                          />
                                          Sending…
                                        </>
                                      ) : (
                                        <>
                                          <svg
                                            width="13"
                                            height="13"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                          >
                                            <line
                                              x1="22"
                                              y1="2"
                                              x2="11"
                                              y2="13"
                                            />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                          </svg>
                                          Send Feedback
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
