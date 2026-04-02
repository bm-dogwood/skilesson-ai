"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/hooks/useTranslation";

export default function AICoachUpload() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [instructorFeedback, setInstructorFeedback] = useState("");
  const [generateImage, setGenerateImage] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fallbackResponses = [
    {
      positive: t("coachUpload.fallbackPositive1"),
      correction: t("coachUpload.fallbackCorrection1"),
      fix: t("coachUpload.fallbackFix1"),
      why: t("coachUpload.fallbackWhy1"),
    },
  ];

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("generateImage", String(generateImage));
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai-coach-media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error === "SUBSCRIPTION_REQUIRED") {
        setResult({ error: "subscription" });
        return;
      }
      if (!data.success) {
        setResult(fallbackResponses[0]);
        return;
      }
      setResult({ ...data.data.feedback, image: data.data.image });
    } catch {
      setResult(fallbackResponses[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.type.startsWith("image/") || f.type.startsWith("video/")))
      setFile(f);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .ac-root {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #0b0d14;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .ac-root::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 55% 35% at 20% 10%, rgba(99,102,241,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 45% 35% at 80% 90%, rgba(168,85,247,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .ac-wrap { position: relative; width: 100%; max-width: 560px; padding-top: 1.5rem; }

        /* Header */
        .ac-header { text-align: center; margin-bottom: 1.25rem; }
        .ac-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 999px;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.22);
          color: #a5b4fc; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 0.7rem;
        }
        .ac-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #818cf8; box-shadow: 0 0 5px #818cf8;
          animation: blink 2.2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .ac-title { font-size: 1.65rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 0.3rem; }
        .ac-sub { color: #475569; font-size: 0.8rem; }

        /* Card */
        .ac-card {
          background: rgba(15,18,28,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 1.5rem;
          backdrop-filter: blur(24px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .ac-card.drag { border-color: rgba(99,102,241,0.4); box-shadow: 0 0 0 3px rgba(99,102,241,0.08), 0 24px 48px rgba(0,0,0,0.45); }

        /* Upload zone */
        .ac-dropzone {
          border: 1.5px dashed rgba(255,255,255,0.09); border-radius: 14px;
          padding: 2rem 1.5rem; text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .ac-dropzone:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.02); }
        .ac-icons { display: flex; justify-content: center; gap: 8px; margin-bottom: 1rem; }
        .ac-icon-box {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #4b5563;
        }
        .ac-drop-title { font-size: 0.9rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.25rem; }
        .ac-drop-sub { font-size: 0.73rem; color: #334155; margin-bottom: 1.1rem; }
        .ac-file-input-wrap { position: relative; display: inline-block; }
        .ac-file-input-wrap input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

        /* Buttons */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 10px;
          font: 600 0.82rem 'Inter', sans-serif; color: #fff;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          border: none; cursor: pointer;
          box-shadow: 0 2px 12px rgba(99,102,241,0.3);
          transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
          position: relative; overflow: hidden;
        }
        .btn-primary::before { content:''; position:absolute; inset:0; background:linear-gradient(rgba(255,255,255,0.1),transparent); pointer-events:none; }
        .btn-primary:hover { opacity:0.9; transform:translateY(-1px); box-shadow:0 4px 18px rgba(99,102,241,0.4); }
        .btn-primary:disabled { opacity:0.35; cursor:not-allowed; transform:none; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px;
          font: 500 0.75rem 'Inter', sans-serif; color: #64748b;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer; transition: all 0.18s;
        }
        .btn-ghost:hover { background:rgba(255,255,255,0.06); color:#94a3b8; border-color:rgba(255,255,255,0.1); }

        /* Preview */
        .ac-preview {
          border-radius: 12px; overflow: hidden;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          position: relative; margin-bottom: 0.875rem;
        }
        .ac-preview img, .ac-preview video { width:100%; max-height:220px; object-fit:contain; display:block; }
        .ac-preview-close {
          position:absolute; top:8px; right:8px; width:28px; height:28px; border-radius:7px;
          background:rgba(9,10,18,0.8); backdrop-filter:blur(6px);
          border:1px solid rgba(255,255,255,0.09); color:#64748b;
          display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:5; transition:color 0.18s;
        }
        .ac-preview-close:hover { color:#e2e8f0; }
        .ac-preview-bar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .ac-filename { flex:1; min-width:0; font-size:0.72rem; color:#334155; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:flex; align-items:center; gap:4px; }

        /* Toggle */
        .toggle-row { display:flex; align-items:center; gap:8px; }
        .tog { position:relative; width:32px; height:18px; cursor:pointer; flex-shrink:0; }
        .tog input { opacity:0; width:0; height:0; }
        .tog-slider { position:absolute; inset:0; border-radius:999px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); transition:background 0.2s; }
        .tog-slider::after { content:''; position:absolute; top:2px; left:2px; width:12px; height:12px; border-radius:50%; background:#475569; transition:all 0.2s; }
        .tog input:checked + .tog-slider { background:rgba(99,102,241,0.55); border-color:rgba(99,102,241,0.35); }
        .tog input:checked + .tog-slider::after { transform:translateX(14px); background:#fff; }
        .tog-label { font-size:0.75rem; color:#475569; }

        /* Loading */
        .ac-loading { display:flex; flex-direction:column; align-items:center; padding:2rem 0; gap:0.75rem; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .ac-spinner { width:30px; height:30px; border-radius:50%; border:2px solid rgba(255,255,255,0.06); border-top-color:#6366f1; animation:spin 0.85s linear infinite; }
        .ac-loading-text { font-size:0.8rem; color:#475569; }
        .ac-loading-text span { color:#94a3b8; font-weight:600; }

        /* 2-col feedback grid */
        .ac-feedback-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-bottom:0.75rem; }
        .ac-feedback-item { border-radius:11px; padding:0.7rem 0.875rem; border:1px solid transparent; transition:transform 0.15s; }
        .ac-feedback-item:hover { transform:translateY(-1px); }
        .ac-fb-header { display:flex; align-items:center; gap:5px; margin-bottom:4px; }
        .ac-fb-icon { width:18px; height:18px; border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:700; flex-shrink:0; }
        .ac-fb-label { font-size:0.6rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; }
        .ac-fb-text { font-size:0.78rem; color:#94a3b8; line-height:1.5; }

        /* Coaching image */
        .ac-coaching-img { width:100%; border-radius:12px; border:1px solid rgba(255,255,255,0.06); margin-bottom:0.75rem; }

        /* Lessons */
        .ac-lessons { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:11px; overflow:hidden; margin-bottom:0.75rem; }
        .ac-lessons-header { padding:0.5rem 0.875rem; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.62rem; font-weight:700; letter-spacing:0.09em; text-transform:uppercase; color:#334155; }
        .ac-lesson-row { display:flex; align-items:center; gap:8px; padding:0.5rem 0.875rem; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:background 0.15s; font-size:0.8rem; color:#64748b; }
        .ac-lesson-row:last-child { border-bottom:none; }
        .ac-lesson-row:hover { background:rgba(255,255,255,0.03); color:#94a3b8; }
        .ac-lesson-num { font-size:0.65rem; color:#1e293b; min-width:24px; }
        .ac-lesson-arrow { margin-left:auto; color:#1e293b; font-size:0.7rem; }

        /* Actions */
        .ac-actions { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:0.875rem; }

        /* Divider */
        .ac-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:0.875rem 0; }

        /* Instructor */
        .ac-instructor-header { display:flex; align-items:center; gap:6px; font-size:0.78rem; font-weight:600; color:#475569; margin-bottom:0.625rem; }
        .ac-textarea {
          width:100%; box-sizing:border-box; padding:0.7rem 0.875rem;
          background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06);
          border-radius:10px; color:#94a3b8; font-size:0.8rem; font-family:'Inter',sans-serif;
          line-height:1.55; resize:none; outline:none; transition:border-color 0.2s; margin-bottom:0.5rem;
        }
        .ac-textarea:focus { border-color:rgba(99,102,241,0.35); }
        .ac-textarea::placeholder { color:#1e293b; }
        .ac-instr-actions { display:flex; gap:6px; }

        /* Footer */
        .ac-footer { text-align:center; font-size:0.68rem; color:#1e293b; margin-top:1rem; }

        /* Sub error */
        .ac-sub-error { text-align:center; padding:1.75rem; background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.12); border-radius:14px; }
      `}</style>

      <div className="ac-root">
        <div className="ac-wrap">
          {/* Header */}
          <motion.div
            className="ac-header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="ac-badge">
              <span className="ac-badge-dot" />
              AI-Powered Analysis
            </div>
            <h1 className="ac-title">{t("coachUpload.pageTitle")}</h1>
            <p className="ac-sub">{t("coachUpload.pageSubtitle")}</p>
          </motion.div>

          {/* Card */}
          <motion.div
            className={`ac-card ${dragActive ? "drag" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Upload state */}
            <AnimatePresence mode="wait">
              {!file && !loading && !result && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="ac-dropzone">
                    <div className="ac-icons">
                      <div className="ac-icon-box">
                        <PhotoIcon style={{ width: 18, height: 18 }} />
                      </div>
                      <div className="ac-icon-box">
                        <VideoCameraIcon style={{ width: 18, height: 18 }} />
                      </div>
                      <div className="ac-icon-box">
                        <CloudArrowUpIcon style={{ width: 18, height: 18 }} />
                      </div>
                    </div>
                    <p className="ac-drop-title">
                      {t("coachUpload.dragDropText")}
                    </p>
                    <p className="ac-drop-sub">
                      {t("coachUpload.dragDropSupports")}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFile(f);
                      }}
                    />
                    <button
                      className="btn-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CloudArrowUpIcon style={{ width: 14, height: 14 }} />
                      {t("coachUpload.selectFile")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File preview state */}
            <AnimatePresence mode="wait">
              {file && !loading && !result && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="ac-preview">
                    <button
                      className="ac-preview-close"
                      onClick={() => setFile(null)}
                    >
                      <XMarkIcon style={{ width: 14, height: 14 }} />
                    </button>
                    {file.type.startsWith("image") ? (
                      <img src={URL.createObjectURL(file)} alt="preview" />
                    ) : (
                      <video src={URL.createObjectURL(file)} controls />
                    )}
                  </div>
                  <div className="ac-preview-bar">
                    <div className="toggle-row" style={{ flex: 1 }}>
                      <label className="tog">
                        <input
                          type="checkbox"
                          checked={generateImage}
                          onChange={(e) => setGenerateImage(e.target.checked)}
                        />
                        <span className="tog-slider" />
                      </label>
                      <span className="tog-label">Generate illustration</span>
                    </div>
                    <span className="ac-filename">
                      {file.type.startsWith("image") ? (
                        <PhotoIcon style={{ width: 12, height: 12 }} />
                      ) : (
                        <VideoCameraIcon style={{ width: 12, height: 12 }} />
                      )}
                      {file.name}
                    </span>
                    <button
                      className="btn-primary"
                      onClick={handleUpload}
                      disabled={loading}
                    >
                      <SparklesIcon style={{ width: 14, height: 14 }} />
                      {t("coachUpload.analyzeButton")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  key="loading"
                  className="ac-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="ac-spinner" />
                  <p className="ac-loading-text">
                    <span>{t("coachUpload.aiCoach")}</span>{" "}
                    {t("coachUpload.aiAnalyzing")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {result && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.38 }}
                >
                  {result.error === "subscription" ? (
                    <div className="ac-sub-error">
                      <p style={{ fontSize: "1.2rem", marginBottom: 6 }}>🔒</p>
                      <p
                        style={{
                          color: "#f1f5f9",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          marginBottom: 4,
                        }}
                      >
                        Subscription Required
                      </p>
                      <p
                        style={{
                          color: "#475569",
                          fontSize: "0.78rem",
                          marginBottom: "1rem",
                        }}
                      >
                        Upgrade to unlock AI Coach.
                      </p>
                      <button className="btn-primary">View Plans</button>
                    </div>
                  ) : (
                    <>
                      {/* 2-col feedback grid */}
                      <div className="ac-feedback-grid">
                        {[
                          {
                            key: "positive",
                            label: "Well done",
                            color: "#4ade80",
                            bg: "rgba(74,222,128,0.07)",
                            border: "rgba(74,222,128,0.18)",
                            icon: "✓",
                          },
                          {
                            key: "correction",
                            label: "Improve",
                            color: "#fbbf24",
                            bg: "rgba(251,191,36,0.07)",
                            border: "rgba(251,191,36,0.18)",
                            icon: "△",
                          },
                          {
                            key: "fix",
                            label: "How to fix",
                            color: "#60a5fa",
                            bg: "rgba(96,165,250,0.07)",
                            border: "rgba(96,165,250,0.18)",
                            icon: "→",
                          },
                          {
                            key: "why",
                            label: "Why it matters",
                            color: "#c084fc",
                            bg: "rgba(192,132,252,0.07)",
                            border: "rgba(192,132,252,0.18)",
                            icon: "◎",
                          },
                        ].map(({ key, label, color, bg, border, icon }, i) =>
                          result[key] ? (
                            <motion.div
                              key={key}
                              className="ac-feedback-item"
                              style={{ background: bg, borderColor: border }}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06 }}
                            >
                              <div className="ac-fb-header">
                                <div
                                  className="ac-fb-icon"
                                  style={{ background: `${color}22`, color }}
                                >
                                  {icon}
                                </div>
                                <span className="ac-fb-label" style={{ color }}>
                                  {label}
                                </span>
                              </div>
                              <p className="ac-fb-text">{result[key]}</p>
                            </motion.div>
                          ) : null
                        )}
                      </div>

                      {result.image && (
                        <img
                          src={result.image}
                          alt="Coaching illustration"
                          className="ac-coaching-img"
                        />
                      )}

                      {result.lessons?.length > 0 && (
                        <div className="ac-lessons">
                          <div className="ac-lessons-header">
                            {t("coachUpload.recommendedLessons")}
                          </div>
                          {result.lessons.map((lesson: string, idx: number) => (
                            <div key={idx} className="ac-lesson-row">
                              <span className="ac-lesson-num">
                                #{String(idx + 1).padStart(2, "0")}
                              </span>
                              <span>{lesson}</span>
                              <span className="ac-lesson-arrow">→</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="ac-actions">
                        <button className="btn-ghost">
                          {t("coachUpload.helpful")}
                        </button>
                        <button className="btn-ghost">
                          {t("coachUpload.askClarification")}
                        </button>
                        <button className="btn-ghost">
                          {t("coachUpload.saveFeedback")}
                        </button>
                      </div>

                      <hr className="ac-divider" />

                      <div className="ac-instructor-header">
                        <ChatBubbleLeftRightIcon
                          style={{ width: 14, height: 14 }}
                        />
                        {t("coachUpload.instructorFeedbackTitle")}
                      </div>
                      <textarea
                        className="ac-textarea"
                        value={instructorFeedback}
                        onChange={(e) => setInstructorFeedback(e.target.value)}
                        placeholder={t(
                          "coachUpload.instructorFeedbackPlaceholder"
                        )}
                        rows={2}
                      />
                      <div className="ac-instr-actions">
                        <button
                          className="btn-ghost"
                          onClick={() => setNotesSaved(true)}
                        >
                          {notesSaved ? "✓ Saved" : t("coachUpload.saveNotes")}
                        </button>
                        <button className="btn-ghost">
                          {t("coachUpload.requestExpertReview")}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <p className="ac-footer">{t("coachUpload.footerPowered")}</p>
        </div>
      </div>
    </>
  );
}
