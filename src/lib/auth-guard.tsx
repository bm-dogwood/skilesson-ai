'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Mountain } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/signin?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#7dd3fc]">
            <Mountain className="w-6 h-6 text-[#0f172a]" />
          </div>
          <span
            className="text-xl font-bold text-[#f8fafc]"
            style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
          >
            SkiLesson<span className="text-[#38bdf8]">.ai</span>
          </span>
        </div>
        <div className="w-8 h-8 border-2 border-[#38bdf8]/30 border-t-[#38bdf8] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
