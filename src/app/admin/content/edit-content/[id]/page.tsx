"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
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
    // Clear success message when user starts editing
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
        headers: {
          "Content-Type": "application/json",
        },
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
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Lesson</h1>
            <p className="text-gray-600 mt-1">
              Update lesson details and content
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Success</p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                value={lesson.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter lesson title"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                  touched.title && !lesson.title.trim()
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {touched.title && !lesson.title.trim() && (
                <p className="text-sm text-red-500 mt-1">Title is required</p>
              )}
            </div>

            {/* Sport Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sport <span className="text-red-500">*</span>
              </label>
              <input
                name="sport"
                type="text"
                value={lesson.sport}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter sport name (e.g., Soccer, Basketball)"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                  touched.sport && !lesson.sport.trim()
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {touched.sport && !lesson.sport.trim() && (
                <p className="text-sm text-red-500 mt-1">Sport is required</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={lesson.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter lesson description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-y"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a detailed description of what students will learn
              </p>
            </div>

            {/* Level Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="level"
                value={lesson.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                <option value="Beginner">
                  Beginner - No experience needed
                </option>
                <option value="Intermediate">
                  Intermediate - Some experience required
                </option>
                <option value="Advanced">Advanced - Experienced players</option>
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Lesson
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/content")}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            All changes will be immediately visible to students
          </p>
        </div>
      </div>
    </div>
  );
}
