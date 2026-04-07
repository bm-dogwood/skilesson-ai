"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Trophy,
  Target,
  Hash,
} from "lucide-react";

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    level: "Beginner",
    sport: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    sport: false,
  });

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();

      if (data.success) {
        setLesson({
          title: data.lesson.title || "",
          description: data.lesson.description || "",
          level: data.lesson.level || "Beginner",
          sport: data.lesson.sport || "",
        });
      } else {
        setError("Failed to load lesson");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
    if (success) setSuccess(null);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validateForm = () => {
    if (!lesson.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!lesson.sport.trim()) {
      setError("Sport is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Lesson updated successfully!");
        setTimeout(() => {
          router.push("/admin/content");
        }, 1500);
      } else {
        setError(data.message || "Failed to update lesson");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating lesson. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-ice/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-ice border-t-transparent animate-spin"></div>
          </div>
          <p className="text-muted">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const levelOptions = {
    Beginner: { label: "Beginner", icon: Target, color: "#34d399" },
    Intermediate: { label: "Intermediate", icon: Trophy, color: "#f59e0b" },
    Advanced: { label: "Advanced", icon: Hash, color: "#f43f5e" },
  };

  return (
    <div className="admin-page">
      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
          padding: 2rem 0;
        }

        .form-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .form-card:hover {
          border-color: rgba(56, 189, 248, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(2, 6, 23, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 12px;
          color: #f8fafc;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
          background: rgba(2, 6, 23, 0.8);
        }

        .form-input.error {
          border-color: #f43f5e;
          background: rgba(244, 63, 94, 0.05);
        }

        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .form-label span {
          color: #f43f5e;
        }

        .btn-primary {
          background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(56, 189, 248, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(71, 85, 105, 0.2);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: rgba(71, 85, 105, 0.3);
          border-color: rgba(56, 189, 248, 0.3);
          color: #f8fafc;
        }

        .error-alert {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .success-alert {
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .level-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        select.form-input {
          cursor: pointer;
        }

        textarea.form-input {
          resize: vertical;
          font-family: inherit;
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-muted hover:text-ice transition-all duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-ice" />
              <span className="text-xs font-semibold text-ice tracking-wider uppercase">
                Edit Lesson
              </span>
            </div>
            <h1 className="text-3xl font-bold text-snow font-lora mb-2">
              {lesson.title || "Untitled Lesson"}
            </h1>
            <p className="text-muted text-sm">
              Update lesson details, content, and difficulty level
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="error-alert">
                <AlertCircle className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-rose mb-1">Error</p>
                  <p className="text-sm text-rose/90">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-rose/70 hover:text-rose transition-colors text-xl leading-none"
                >
                  ×
                </button>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="success-alert animate-in fade-in duration-300">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-400 mb-1">
                    Success
                  </p>
                  <p className="text-sm text-emerald-400/90">{success}</p>
                </div>
              </div>
            )}

            {/* Title Field */}
            <div>
              <label className="form-label">
                Title <span>*</span>
              </label>
              <input
                name="title"
                type="text"
                value={lesson.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter lesson title"
                className={`form-input ${
                  touched.title && !lesson.title.trim() ? "error" : ""
                }`}
              />
              {touched.title && !lesson.title.trim() && (
                <p className="text-xs text-rose mt-1.5">Title is required</p>
              )}
            </div>

            {/* Sport Field */}
            <div>
              <label className="form-label">
                Sport <span>*</span>
              </label>
              <input
                name="sport"
                type="text"
                value={lesson.sport}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter sport name (e.g., Soccer, Basketball)"
                className={`form-input ${
                  touched.sport && !lesson.sport.trim() ? "error" : ""
                }`}
              />
              {touched.sport && !lesson.sport.trim() && (
                <p className="text-xs text-rose mt-1.5">Sport is required</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={lesson.description}
                onChange={handleChange}
                rows={6}
                placeholder="Enter lesson description..."
                className="form-input"
              />
              <p className="text-xs text-muted mt-1.5">
                Provide a detailed description of what students will learn
              </p>
            </div>

            {/* Level Field */}
            <div>
              <label className="form-label">Difficulty Level</label>
              <select
                name="level"
                value={lesson.level}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Beginner">
                  🟢 Beginner - No experience needed
                </option>
                <option value="Intermediate">
                  🟡 Intermediate - Some experience required
                </option>
                <option value="Advanced">
                  🔴 Advanced - Experienced players
                </option>
              </select>

              {/* Level preview */}
              <div className="mt-3">
                <div
                  className="level-badge"
                  style={{
                    background:
                      lesson.level === "Beginner"
                        ? "rgba(52, 211, 153, 0.1)"
                        : lesson.level === "Intermediate"
                        ? "rgba(245, 158, 11, 0.1)"
                        : "rgba(244, 63, 94, 0.1)",
                    border: `1px solid ${
                      lesson.level === "Beginner"
                        ? "rgba(52, 211, 153, 0.3)"
                        : lesson.level === "Intermediate"
                        ? "rgba(245, 158, 11, 0.3)"
                        : "rgba(244, 63, 94, 0.3)"
                    }`,
                  }}
                >
                  {lesson.level === "Beginner" && (
                    <Target className="w-3 h-3" style={{ color: "#34d399" }} />
                  )}
                  {lesson.level === "Intermediate" && (
                    <Trophy className="w-3 h-3" style={{ color: "#f59e0b" }} />
                  )}
                  {lesson.level === "Advanced" && (
                    <Hash className="w-3 h-3" style={{ color: "#f43f5e" }} />
                  )}
                  <span
                    style={{
                      color:
                        lesson.level === "Beginner"
                          ? "#34d399"
                          : lesson.level === "Intermediate"
                          ? "#f59e0b"
                          : "#f43f5e",
                    }}
                  >
                    {lesson.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-ice/10">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 sm:flex-none justify-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Lesson
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/content")}
                className="btn-secondary flex-1 sm:flex-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted">
            All changes will be immediately visible to students
          </p>
        </div>
      </div>
    </div>
  );
}
