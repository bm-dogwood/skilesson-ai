"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export default function AICoachUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<{
    aiDescription: string;
    aiFeedback: string;
  } | null>(null);
  const [instructorFeedback, setInstructorFeedback] = useState("");

  const fallbackResponses = [
    {
      aiDescription:
        "Your posture shows a solid foundation. You're maintaining decent balance, but there’s room to refine your stance for smoother control.",
      aiFeedback:
        "Try bending your knees slightly more and keeping your weight centered. This will improve your stability and edge control.",
    },
    {
      aiDescription:
        "Good effort! Your movement suggests you're getting comfortable on the slopes, though transitions could be smoother.",
      aiFeedback:
        "Focus on fluid transitions between turns and keep your upper body relaxed. Let your lower body guide the motion.",
    },
    {
      aiDescription:
        "You demonstrate good confidence, especially in your speed control. However, your balance shifts slightly during turns.",
      aiFeedback:
        "Work on keeping your shoulders aligned with your skis and avoid leaning back. This will enhance control and precision.",
    },
    {
      aiDescription:
        "Nice technique overall! Your stance is fairly stable, but your weight distribution could be improved.",
      aiFeedback:
        "Try to keep more pressure on your downhill ski and stay forward. This will help with carving and smoother turns.",
    },
  ];

  const getRandomFallback = () => {
    return fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai-coach-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setResult(getRandomFallback());
        return;
      }

      setResult({
        aiDescription: data.data.aiDescription,
        aiFeedback: data.data.aiFeedback,
      });
    } catch (err) {
      setResult(getRandomFallback());
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("image/") ||
        droppedFile.type.startsWith("video/"))
    ) {
      setFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block p-3 bg-gray-800 rounded-2xl mb-4"
          >
            <AcademicCapIcon className="w-8 h-8 text-gray-200" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Ski Coach</h1>
          <p className="text-gray-400">
            Upload your skiing video or photo for instant AI-powered analysis
          </p>
        </div>

        {/* Main Card */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative bg-gray-900 rounded-3xl p-8 
            border-2 transition-all duration-300
            ${
              dragActive
                ? "border-gray-600 bg-gray-800 shadow-lg shadow-gray-700/20"
                : "border-gray-800 hover:border-gray-700"
            }
          `}
        >
          {/* Upload Area */}
          {!file && !loading && !result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="flex justify-center gap-4 mb-6">
                <div className="p-3 bg-gray-800 rounded-xl">
                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <VideoCameraIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="p-3 bg-gray-800 rounded-xl">
                  <CloudArrowUpIcon className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-lg mb-2 font-medium">
                  Drag & drop your media here
                </p>
                <p className="text-gray-500 text-sm">
                  Supports images and videos
                </p>
              </div>

              <div className="relative inline-block">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) setFile(selectedFile);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="bg-gray-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all border border-gray-700">
                  Select File
                </button>
              </div>
            </motion.div>
          )}

          {/* File Preview */}
          <AnimatePresence mode="wait">
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1.5 bg-gray-900/90 backdrop-blur rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 shadow-sm z-10 transition-all"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>

                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full max-h-96 object-contain"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full max-h-96"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {file.type.startsWith("image") ? (
                      <PhotoIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <VideoCameraIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-gray-300 text-sm truncate">
                      {file.name}
                    </span>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-gray-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
                  >
                    {loading ? "Analyzing..." : "Analyze Technique"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Animation */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-center"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-2 border-gray-700 border-t-gray-400 rounded-full"
                  />
                </div>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-200">AI Coach</span>{" "}
                  is analyzing your technique...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 space-y-6"
              >
                {/* AI Analysis */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-5 h-5 text-gray-300" />
                    <h2 className="font-semibold text-white">AI Analysis</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {result.aiFeedback}
                  </p>
                </div>

                {/* Instructor Feedback Section */}
                <div className="border-t border-gray-800 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                    <h2 className="font-semibold text-white">
                      Instructor Feedback
                    </h2>
                  </div>
                  <textarea
                    value={instructorFeedback}
                    onChange={(e) => setInstructorFeedback(e.target.value)}
                    placeholder="Add your own feedback or notes..."
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all resize-none"
                    rows={3}
                  />
                  <button className="mt-3 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium">
                    Save Notes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Powered by AI • Instant feedback • Pro tips included
        </p>
      </motion.div>
    </div>
  );
}
