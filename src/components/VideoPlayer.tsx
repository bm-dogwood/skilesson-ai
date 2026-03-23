'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Lock,
  SkipForward,
  SkipBack,
} from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  duration: string;
  thumbnailGradient?: string;
  instructor?: string;
  level?: string;
  isLocked?: boolean;
  onComplete?: () => void;
}

function parseDuration(d: string): number {
  const parts = d.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({
  title,
  duration,
  thumbnailGradient = 'bg-gradient-to-br from-sky-400 via-sky-600 to-slate-100',
  instructor = 'Tyler Berglund',
  level = 'beginner',
  isLocked = false,
  onComplete,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const totalSeconds = parseDuration(duration);
  // Simulate in 30 seconds regardless of actual duration
  const speedMultiplier = totalSeconds / 30;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressPercent = totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0;

  const handlePlay = useCallback(() => {
    if (isLocked) return;
    if (!hasStarted) setHasStarted(true);
    setIsPlaying(true);
  }, [isLocked, hasStarted]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleToggle = useCallback(() => {
    if (isPlaying) handlePause();
    else handlePlay();
  }, [isPlaying, handlePause, handlePlay]);

  // Progress simulation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + speedMultiplier * 0.1;
          if (next >= totalSeconds) {
            setIsPlaying(false);
            onComplete?.();
            return totalSeconds;
          }
          return next;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speedMultiplier, totalSeconds, onComplete]);

  // Auto-hide controls
  useEffect(() => {
    if (hasStarted && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [hasStarted, isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    setCurrentTime(pct * totalSeconds);
  };

  const handleSkip = (delta: number) => {
    setCurrentTime((prev) => Math.max(0, Math.min(totalSeconds, prev + delta)));
  };

  const levelColor =
    level === 'beginner'
      ? 'bg-sky-500'
      : level === 'intermediate'
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-2xl select-none"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Gradient background / thumbnail */}
      <div className={`absolute inset-0 ${thumbnailGradient}`}>
        {/* Faux snow mountain silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3">
          <svg
            viewBox="0 0 1200 200"
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,200 L0,120 Q150,40 300,100 Q450,20 600,80 Q750,10 900,90 Q1050,30 1200,100 L1200,200 Z"
              fill="rgba(255,255,255,0.12)"
            />
            <path
              d="M0,200 L0,150 Q200,80 400,130 Q600,60 800,120 Q1000,70 1200,140 L1200,200 Z"
              fill="rgba(255,255,255,0.08)"
            />
          </svg>
        </div>
        {/* Subtle animated particles (snow) */}
        {hasStarted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/30"
                initial={{
                  x: `${(i * 97) % 100}%`,
                  y: '-5%',
                  opacity: 0.3 + Math.random() * 0.4,
                }}
                animate={{
                  y: '105%',
                  x: `${((i * 97) % 100) + (Math.random() - 0.5) * 20}%`,
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-md bg-slate-900/60"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 ring-2 ring-white/20">
              <Lock className="h-7 w-7 text-white/80" />
            </div>
            <p className="text-lg font-semibold text-white">Subscribe to unlock</p>
            <p className="text-sm text-white/60 max-w-xs text-center">
              Get unlimited access to all lessons, AI coaching, and progress tracking.
            </p>
            <button className="mt-2 rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors">
              Start Free Trial
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Pre-play state: big play button */}
      <AnimatePresence>
        {!hasStarted && !isLocked && (
          <motion.div
            key="play-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
            onClick={handlePlay}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30"
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/10"
                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <Play className="h-8 w-8 text-white ml-1" fill="white" />
            </motion.div>
            {/* Title overlay on pre-play */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <p className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wide">
                {level}
              </p>
              <p className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
                {title}
              </p>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                {instructor} &middot; {duration}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playing state: controls overlay */}
      {hasStarted && !isLocked && (
        <div className="absolute inset-0 z-20 cursor-pointer" onClick={handleToggle}>
          {/* Pause icon flash */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                key="paused-indicator"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                  <Play className="h-7 w-7 text-white ml-0.5" fill="white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top bar: title + quality badge */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-3 sm:p-4 flex items-start justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                    {title}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <span
                    className={`${levelColor} text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white`}
                  >
                    {level}
                  </span>
                  <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded text-white">
                    HD
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructor watermark */}
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-12 sm:top-14 right-3 sm:right-4 text-[10px] sm:text-xs text-white/50 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              Instructor: {instructor}
            </motion.div>
          )}

          {/* Bottom controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress bar */}
                <div
                  className="mx-3 sm:mx-4 mb-2 group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProgressClick(e);
                  }}
                >
                  <div className="relative h-1 group-hover:h-1.5 bg-white/20 rounded-full transition-all">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-sky-400 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                    {/* Scrubber dot */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-sky-400 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `calc(${progressPercent}% - 6px)` }}
                    />
                    {/* Buffer bar (fake) */}
                    <div
                      className="absolute left-0 top-0 h-full bg-white/10 rounded-full"
                      style={{ width: `${Math.min(progressPercent + 15, 100)}%` }}
                    />
                    {/* Actual progress on top of buffer */}
                    <div
                      className="absolute left-0 top-0 h-full bg-sky-400 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-1 sm:gap-3 px-3 sm:px-4 pb-3">
                  {/* Play/Pause */}
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle();
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    ) : (
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="white" />
                    )}
                  </button>

                  {/* Skip back */}
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip(-10);
                    }}
                  >
                    <SkipBack className="h-4 w-4 text-white/70" />
                  </button>

                  {/* Skip forward */}
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip(10);
                    }}
                  >
                    <SkipForward className="h-4 w-4 text-white/70" />
                  </button>

                  {/* Volume */}
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-white/70" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white/70" />
                    )}
                  </button>

                  {/* Time */}
                  <span className="text-[10px] sm:text-xs text-white/70 font-mono tabular-nums ml-1">
                    {formatTime(currentTime)} / {duration}
                  </span>

                  <div className="flex-1" />

                  {/* Fullscreen */}
                  <button
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Maximize className="h-4 w-4 text-white/70" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
