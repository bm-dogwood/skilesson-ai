'use client';

import { motion } from 'framer-motion';
import { Play, CheckCircle, Lock } from 'lucide-react';
import { getGradient } from '@/lib/thumbnail-gradients';

interface DemoVideoCardProps {
  id: string;
  title: string;
  duration: string;
  module: string;
  level: string;
  sport: string;
  instructor: string;
  isComplete?: boolean;
  isFree?: boolean;
  thumbnailVariant: number;
  onClick?: () => void;
}

export default function DemoVideoCard({
  title,
  duration,
  module,
  level,
  sport,
  instructor,
  isComplete = false,
  isFree = false,
  thumbnailVariant,
  onClick,
}: DemoVideoCardProps) {
  const gradient = getGradient(thumbnailVariant);

  const levelConfig: Record<string, { color: string; label: string }> = {
    beginner: { color: 'bg-sky-500', label: 'Beginner' },
    intermediate: { color: 'bg-amber-500', label: 'Intermediate' },
    advanced: { color: 'bg-red-500', label: 'Advanced' },
  };

  const sportConfig: Record<string, { color: string; label: string }> = {
    skiing: { color: 'bg-indigo-500/80', label: 'Skiing' },
    snowboarding: { color: 'bg-emerald-500/80', label: 'Snowboarding' },
  };

  const lv = levelConfig[level] || levelConfig.beginner;
  const sp = sportConfig[sport] || sportConfig.skiing;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group cursor-pointer rounded-xl overflow-hidden bg-slate-800/60 shadow-lg hover:shadow-xl hover:shadow-sky-500/10 transition-shadow"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative" style={{ aspectRatio: '16/9' }}>
        <div className={`absolute inset-0 ${gradient}`}>
          {/* Mountain silhouette */}
          <svg
            viewBox="0 0 400 100"
            className="absolute bottom-0 w-full h-1/2"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 L0,60 Q50,20 100,50 Q150,10 200,40 Q250,5 300,45 Q350,15 400,55 L400,100 Z"
              fill="rgba(255,255,255,0.1)"
            />
          </svg>
        </div>

        {/* Play icon overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm ring-2 ring-white/30">
            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
          </div>
        </motion.div>

        {/* Completion overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/90">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 z-10 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
          {duration}
        </div>

        {/* FREE badge */}
        {isFree && (
          <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
            Free
          </div>
        )}

        {/* Level badge */}
        <div
          className={`absolute top-2 right-2 z-10 ${lv.color} text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow`}
        >
          {lv.label}
        </div>

        {/* Sport badge */}
        <div
          className={`absolute bottom-2 left-2 z-10 ${sp.color} text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm`}
        >
          {sp.label}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-sky-400 font-medium uppercase tracking-wide mb-1">
          {module}
        </p>
        <h3 className="text-sm sm:text-base font-semibold text-white leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5">{instructor}</p>
        {isComplete && (
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">Completed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
