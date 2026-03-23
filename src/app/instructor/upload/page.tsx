"use client";

import { useState, useRef, useCallback } from "react";

type Level = "Beginner" | "Intermediate" | "Advanced";

const LEVEL_META: Record<
  Level,
  { color: string; bg: string; border: string; desc: string }
> = {
  Beginner: {
    color: "var(--ice)",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.3)",
    desc: "For students just starting out on the slopes",
  },
  Intermediate: {
    color: "var(--gold)",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.3)",
    desc: "For students with basic ski fundamentals",
  },
  Advanced: {
    color: "var(--rose)",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.3)",
    desc: "For experienced skiers refining technique",
  },
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "url" | "uploading" | "done" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<Level>("Beginner");
  type Sport = "Skiing" | "Snowboarding";

  const [sport, setSport] = useState<Sport>("Skiing");

  const [lessons, setLessons] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusMessages = {
    idle: "",
    url: "Preparing secure upload URL…",
    uploading: `Uploading video… ${progress}%`,
    done: "Upload complete! Your video is being processed.",
    error: "Something went wrong. Please try again.",
  };

  const handleFile = (f: File | null) => {
    if (f && f.type.startsWith("video/")) setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }, []);

  const handleUpload = async () => {
    if (!file || !title.trim()) return;
    try {
      setStatus("url");
      setProgress(0);

      const res = await fetch("/api/mux/create-upload", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          level,
          sport,
        }),
      });
      const { uploadUrl, lessonId } = await res.json();

      // 🚀 optimistic lesson
      const newLesson = {
        id: lessonId,
        title,
        description,
        level,
        sport,

        status: "processing",
      };

      setLessons((prev) => [newLesson, ...prev]);

      // Simulate progress (real XHR progress event can replace this)
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) {
            clearInterval(interval);
            return p;
          }
          return p + Math.floor(Math.random() * 8) + 3;
        });
      }, 300);

      await fetch(uploadUrl, { method: "PUT", body: file });

      clearInterval(interval);
      setProgress(100);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const formatBytes = (b: number) => {
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  const lm = LEVEL_META[level];
  const canUpload = !!file && !!title.trim() && status !== "uploading";

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

        .up { font-family: 'Sora', sans-serif; color: var(--snow); }

        /* Page header */
        .up-header { margin-bottom: 2.5rem; animation: fadeUp 0.4s ease both; }
        .up-eyebrow { font-size:0.68rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--ice); margin-bottom:0.5rem; }
        .up-title { font-family:'Lora',serif; font-size:2rem; font-weight:400; color:var(--snow); margin-bottom:0.35rem; }
        .up-sub { font-size:0.85rem; color:var(--slate); font-weight:300; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Two-column grid */
        .up-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 860px) { .up-grid { grid-template-columns: 1fr; } }

        /* Shared card */
        .card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(71,85,105,0.2);
          border-radius: 16px;
          overflow: hidden;
          animation: fadeUp 0.4s ease both;
        }

        .card-head {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(71,85,105,0.15);
        }

        .card-head-icon {
          width:32px; height:32px; border-radius:9px;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
        }

        .card-head-icon svg { width:15px; height:15px; fill:none; stroke-width:1.75; stroke-linecap:round; stroke-linejoin:round; }
        .card-head-icon.ice    { background:rgba(56,189,248,0.12); }
        .card-head-icon.ice svg { stroke:var(--ice); }
        .card-head-icon.gold   { background:rgba(245,158,11,0.12); }
        .card-head-icon.gold svg { stroke:var(--gold); }

        .card-head-title { font-size:0.87rem; font-weight:600; color:var(--snow); }
        .card-head-sub { font-size:0.72rem; color:var(--slate); margin-top:0.1rem; }

        .card-body { padding: 1.5rem; display:flex; flex-direction:column; gap:1.1rem; }

        /* Fields */
        .field-label {
          display:block; font-size:0.68rem; font-weight:600;
          letter-spacing:0.15em; text-transform:uppercase;
          color:var(--slate); margin-bottom:0.5rem;
        }

        .field-input, .field-textarea {
          width:100%;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(71,85,105,0.3);
          border-radius:10px;
          padding:0.85rem 1rem;
          color:var(--snow);
          font-family:'Sora',sans-serif;
          font-size:0.875rem; font-weight:300;
          outline:none;
          transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance:none;
        }

        .field-input::placeholder, .field-textarea::placeholder { color:rgba(71,85,105,0.55); }

        .field-input:focus, .field-textarea:focus {
          border-color:var(--ice);
          background:rgba(56,189,248,0.04);
          box-shadow:0 0 0 3px rgba(56,189,248,0.1);
        }

        .field-textarea { resize:vertical; min-height:90px; }

        /* Level selector */
        .level-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; }

        .level-btn {
          display:flex; flex-direction:column; align-items:center; gap:0.35rem;
          padding:0.75rem 0.5rem; border-radius:10px;
          border:1px solid rgba(71,85,105,0.25);
          background:rgba(255,255,255,0.02);
          cursor:pointer; transition:all 0.15s; text-align:center;
        }

        .level-btn:hover { border-color:rgba(71,85,105,0.45); }

        .level-dot { width:8px; height:8px; border-radius:50%; }
        .level-name { font-size:0.75rem; font-weight:500; color:var(--snow); }
        .level-hint { font-size:0.62rem; color:var(--slate); line-height:1.4; }

        /* Tags */
        .tag-row { display:flex; gap:0.5rem; }

        .tag-input-wrap { flex:1; position:relative; }

        .tag-add-btn {
          background:rgba(56,189,248,0.1);
          border:1px solid rgba(56,189,248,0.25);
          border-radius:9px;
          color:var(--ice); font-family:'Sora',sans-serif;
          font-size:0.78rem; font-weight:500;
          padding:0 1rem; cursor:pointer;
          transition:background 0.15s;
          white-space:nowrap;
        }

        .tag-add-btn:hover { background:rgba(56,189,248,0.18); }

        .tags-wrap { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.5rem; }

        .tag-chip {
          display:flex; align-items:center; gap:0.35rem;
          background:rgba(56,189,248,0.08);
          border:1px solid rgba(56,189,248,0.2);
          border-radius:100px; padding:0.2rem 0.65rem;
          font-size:0.7rem; color:var(--ice); font-weight:500;
        }

        .tag-remove {
          background:none; border:none; cursor:pointer;
          color:rgba(56,189,248,0.5); font-size:0.85rem;
          line-height:1; padding:0; transition:color 0.15s;
        }
        .tag-remove:hover { color:var(--rose); }

        /* Drop zone */
        .dropzone {
          border:2px dashed rgba(71,85,105,0.3);
          border-radius:14px;
          padding:2.5rem 1.5rem;
          display:flex; flex-direction:column; align-items:center; gap:1rem;
          cursor:pointer; transition:all 0.2s; text-align:center;
          background:rgba(255,255,255,0.015);
        }

        .dropzone:hover, .dropzone.drag-over {
          border-color:var(--ice);
          background:rgba(56,189,248,0.04);
        }

        .dropzone-icon {
          width:48px; height:48px; border-radius:14px;
          background:rgba(56,189,248,0.1);
          display:flex; align-items:center; justify-content:center;
        }

        .dropzone-icon svg { width:22px; height:22px; stroke:var(--ice); fill:none; stroke-width:1.75; stroke-linecap:round; stroke-linejoin:round; }

        .dropzone-title { font-size:0.9rem; font-weight:500; color:var(--snow); }
        .dropzone-sub { font-size:0.75rem; color:var(--slate); font-weight:300; }
        .dropzone-link { color:var(--ice); text-decoration:underline; cursor:pointer; }

        /* File preview */
        .file-preview {
          display:flex; align-items:center; gap:1rem;
          background:rgba(56,189,248,0.05);
          border:1px solid rgba(56,189,248,0.2);
          border-radius:12px; padding:1rem 1.25rem;
        }

        .file-icon {
          width:40px; height:40px; border-radius:10px; flex-shrink:0;
          background:rgba(56,189,248,0.12);
          display:flex; align-items:center; justify-content:center;
        }
        .file-icon svg { width:18px; height:18px; stroke:var(--ice); fill:none; stroke-width:1.75; stroke-linecap:round; stroke-linejoin:round; }

        .file-info { flex:1; min-width:0; }
        .file-name { font-size:0.83rem; font-weight:500; color:var(--snow); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .file-size { font-size:0.7rem; color:var(--slate); margin-top:0.15rem; }

        .file-remove {
          background:none; border:none; cursor:pointer;
          color:var(--slate); font-size:1.1rem; line-height:1;
          transition:color 0.15s; padding:0;
        }
        .file-remove:hover { color:var(--rose); }

        /* Progress bar */
        .progress-wrap {
          background:rgba(71,85,105,0.2);
          border-radius:100px; height:6px; overflow:hidden;
          margin-top:0.5rem;
        }

        .progress-fill {
          height:100%;
          background:linear-gradient(90deg, var(--ice), var(--powder));
          border-radius:100px;
          transition:width 0.3s ease;
        }

        /* Status banner */
        .status-banner {
          display:flex; align-items:center; gap:0.6rem;
          border-radius:10px; padding:0.8rem 1rem;
          font-size:0.8rem; font-weight:400;
          animation: fadeUp 0.3s ease both;
        }

        .status-banner.uploading { background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.2); color:var(--powder); }
        .status-banner.done      { background:rgba(34,197,94,0.08);  border:1px solid rgba(34,197,94,0.2);  color:#4ade80; }
        .status-banner.error     { background:rgba(244,63,94,0.08);  border:1px solid rgba(244,63,94,0.2);  color:var(--rose); }
        .status-banner.url       { background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); color:var(--gold); }

        .status-banner svg { width:15px; height:15px; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; flex-shrink:0; stroke:currentColor; }

        /* Upload CTA */
        .upload-btn {
          width:100%; display:flex; align-items:center; justify-content:center; gap:0.6rem;
          background:var(--ice); border:none; border-radius:11px;
          padding:1rem; color:var(--navy);
          font-family:'Sora',sans-serif; font-size:0.82rem;
          font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
          cursor:pointer; transition:background 0.2s, transform 0.15s, box-shadow 0.2s;
          position:relative; overflow:hidden;
        }

        .upload-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,0.15));
          pointer-events:none;
        }

        .upload-btn:hover:not(:disabled) {
          background:var(--powder);
          transform:translateY(-1px);
          box-shadow:0 8px 24px rgba(56,189,248,0.25);
        }

        .upload-btn:active:not(:disabled) { transform:translateY(0); }
        .upload-btn:disabled { opacity:0.35; cursor:not-allowed; }

        .spinner {
          width:14px; height:14px;
          border:2px solid rgba(15,23,42,0.25);
          border-top-color:var(--navy);
          border-radius:50%;
          animation:spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* Right column tips card */
        .tips-list { display:flex; flex-direction:column; gap:0; }

        .tip-item {
          display:flex; align-items:flex-start; gap:0.75rem;
          padding:0.85rem 1.5rem;
          border-bottom:1px solid rgba(71,85,105,0.08);
          font-size:0.78rem; color:var(--slate); line-height:1.5;
        }

        .tip-item:last-child { border-bottom:none; }
        .tip-item strong { color:var(--snow); font-weight:500; }

        .tip-num {
          width:20px; height:20px; min-width:20px;
          border-radius:50%; background:rgba(56,189,248,0.1);
          border:1px solid rgba(56,189,248,0.2);
          display:flex; align-items:center; justify-content:center;
          font-size:0.62rem; font-weight:600; color:var(--ice);
          margin-top:1px;
        }

        /* Specs row */
        .specs-row {
          display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;
          padding:1rem 1.5rem;
        }

        .spec-item { display:flex; flex-direction:column; gap:0.2rem; }
        .spec-label { font-size:0.62rem; color:var(--slate); letter-spacing:0.1em; text-transform:uppercase; }
        .spec-val { font-size:0.8rem; font-weight:500; color:var(--snow); }
      `}</style>

      <div className="up">
        <div className="up-header">
          <p className="up-eyebrow">Content Management</p>
          <h1 className="up-title">Upload a Lesson</h1>
          <p className="up-sub">
            Add a new video lesson for your students to access and learn from.
          </p>
        </div>
        <div style={{ marginBottom: "2rem" }}>
          {lessons.map((l) => (
            <div
              key={l.id}
              style={{
                padding: "1rem",
                border: "1px solid rgba(71,85,105,0.3)",
                borderRadius: "10px",
                marginBottom: "0.75rem",
              }}
            >
              <div style={{ fontWeight: 600 }}>{l.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                {l.sport} • {l.level}
              </div>

              <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                {l.status === "processing"
                  ? "⏳ Processing video..."
                  : "✅ Ready"}
              </div>
            </div>
          ))}
        </div>
        <div className="up-grid">
          {/* ── Left: main form ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Lesson details card */}
            <div className="card" style={{ animationDelay: "0.05s" }}>
              <div className="card-head">
                <div className="card-head-icon ice">
                  <svg viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className="card-head-title">Lesson Details</div>
                  <div className="card-head-sub">
                    Basic info about this lesson
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <label className="field-label">Lesson Title *</label>
                  <input
                    className="field-input"
                    type="text"
                    placeholder="e.g. Mastering the Parallel Turn"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="field-label">Description</label>
                  <textarea
                    className="field-textarea"
                    placeholder="Briefly describe what students will learn in this lesson…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Sport *</label>

                  <div className="level-grid">
                    {(["Skiing", "Snowboarding"] as Sport[]).map((s) => {
                      const active = sport === s;

                      return (
                        <button
                          key={s}
                          className="level-btn"
                          onClick={() => setSport(s)}
                          style={
                            active
                              ? {
                                  borderColor: "var(--ice)",
                                  background: "rgba(56,189,248,0.08)",
                                }
                              : {}
                          }
                        >
                          <div
                            className="level-name"
                            style={active ? { color: "var(--ice)" } : {}}
                          >
                            {s}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="field-label">Skill Level</label>
                  <div className="level-grid">
                    {(["Beginner", "Intermediate", "Advanced"] as Level[]).map(
                      (l) => {
                        const m = LEVEL_META[l];
                        const active = level === l;
                        return (
                          <button
                            key={l}
                            className="level-btn"
                            onClick={() => setLevel(l)}
                            style={
                              active
                                ? { borderColor: m.border, background: m.bg }
                                : {}
                            }
                          >
                            <div
                              className="level-dot"
                              style={{ background: m.color }}
                            />
                            <div
                              className="level-name"
                              style={active ? { color: m.color } : {}}
                            >
                              {l}
                            </div>
                            <div className="level-hint">{m.desc}</div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Video upload card */}
            <div className="card" style={{ animationDelay: "0.1s" }}>
              <div className="card-head">
                <div className="card-head-icon gold">
                  <svg viewBox="0 0 24 24">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                <div>
                  <div className="card-head-title">Video File</div>
                  <div className="card-head-sub">
                    MP4, MOV, or WebM · max 2 GB
                  </div>
                </div>
              </div>

              <div className="card-body">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />

                {!file ? (
                  <div
                    className={`dropzone${dragging ? " drag-over" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="dropzone-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <div className="dropzone-title">Drop your video here</div>
                      <div className="dropzone-sub">
                        or <span className="dropzone-link">browse files</span>{" "}
                        from your computer
                      </div>
                    </div>
                    <div className="dropzone-sub">
                      MP4 · MOV · WebM · up to 2 GB
                    </div>
                  </div>
                ) : (
                  <div className="file-preview">
                    <div className="file-icon">
                      <svg viewBox="0 0 24 24">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" />
                      </svg>
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatBytes(file.size)}</div>
                      {status === "uploading" && (
                        <div
                          className="progress-wrap"
                          style={{ marginTop: "0.5rem" }}
                        >
                          <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      className="file-remove"
                      onClick={() => {
                        setFile(null);
                        setStatus("idle");
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                {status !== "idle" && (
                  <div className={`status-banner ${status}`}>
                    {status === "done" && (
                      <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {status === "error" && (
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    )}
                    {(status === "uploading" || status === "url") && (
                      <span
                        className="spinner"
                        style={{
                          borderColor: "rgba(56,189,248,0.25)",
                          borderTopColor: "var(--ice)",
                        }}
                      />
                    )}
                    {statusMessages[status]}
                  </div>
                )}

                <button
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={!canUpload}
                >
                  {status === "uploading" || status === "url" ? (
                    <>
                      <span className="spinner" /> Uploading…
                    </>
                  ) : status === "done" ? (
                    "Upload Another"
                  ) : (
                    <>
                      <svg
                        style={{
                          width: 15,
                          height: 15,
                          stroke: "var(--navy)",
                          fill: "none",
                          strokeWidth: 2,
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        }}
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Publish Lesson
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Tips card */}
            <div className="card" style={{ animationDelay: "0.15s" }}>
              <div className="card-head">
                <div className="card-head-icon ice">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <div className="card-head-title">Upload Tips</div>
                  <div className="card-head-sub">
                    For the best student experience
                  </div>
                </div>
              </div>
              <div className="tips-list">
                {[
                  {
                    title: "Good lighting",
                    body: "Film in well-lit conditions so students can clearly see your technique.",
                  },
                  {
                    title: "Stable footage",
                    body: "Use a tripod or helmet mount for smooth, watchable video.",
                  },
                  {
                    title: "Clear audio",
                    body: "Narrate your lesson so students can follow along on the slopes.",
                  },
                  {
                    title: "Short segments",
                    body: "Aim for 5–15 minute lessons. Shorter videos have higher completion rates.",
                  },
                  {
                    title: "MP4 preferred",
                    body: "H.264 MP4 files process fastest and are most compatible.",
                  },
                ].map((tip, i) => (
                  <div className="tip-item" key={i}>
                    <div className="tip-num">{i + 1}</div>
                    <div>
                      <strong>{tip.title}.</strong> {tip.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs card */}
            <div className="card" style={{ animationDelay: "0.2s" }}>
              <div className="card-head">
                <div className="card-head-icon gold">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <div className="card-head-title">Technical Specs</div>
                  <div className="card-head-sub">Recommended settings</div>
                </div>
              </div>
              <div className="specs-row">
                {[
                  { label: "Resolution", val: "1080p or higher" },
                  { label: "Format", val: "MP4 / MOV / WebM" },
                  { label: "Frame rate", val: "30fps or 60fps" },
                  { label: "Max size", val: "2 GB" },
                  { label: "Codec", val: "H.264" },
                  { label: "Duration", val: "5–60 min ideal" },
                ].map((s) => (
                  <div className="spec-item" key={s.label}>
                    <div className="spec-label">{s.label}</div>
                    <div className="spec-val">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
