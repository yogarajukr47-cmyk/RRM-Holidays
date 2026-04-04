'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useTravelProfile, BADGES } from '@/hooks/useTravelProfile';
import { Trophy, X, Flame, Star, ChevronRight, Sparkles } from 'lucide-react';

export default function TravelProfileWidget() {
  const {
    profile,
    initialized,
    getLevelInfo,
    getNextBadge,
    getRecommendations,
    getBadgeNotification,
  } = useTravelProfile();

  const [expanded, setExpanded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // SSR-safe mount detection via useSyncExternalStore
  const mounted = useSyncExternalStore(
    () => () => {}, // no-op subscribe
    () => true,     // client snapshot
    () => false,    // server snapshot
  );

  // Poll for badge notifications
  useEffect(() => {
    if (!initialized) return;
    const interval = setInterval(() => {
      const msg = getBadgeNotification();
      if (msg) {
        setNotification(msg);
        setTimeout(() => setNotification(null), 4000);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [initialized, getBadgeNotification]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-widget]')) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  const levelInfo = getLevelInfo();
  const nextBadge = getNextBadge();
  const recommendations = getRecommendations();
  const recentBadges = profile.badges
    .slice(-3)
    .reverse()
    .map((id) => BADGES.find((b) => b.id === id))
    .filter(Boolean);

  if (!mounted || !initialized) return null;

  return (
    <>
      {/* ─── Badge Notification Toast ─── */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl shadow-amber-500/10">
            <Sparkles size={18} className="text-amber-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-amber-200">{notification}</span>
          </div>
        </div>
      )}

      {/* ─── Mobile Pill (shown on small screens) ─── */}
      <div className="sm:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <div
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-xl"
          data-profile-widget="mobile-pill"
        >
          <span className="text-xs font-bold text-amber-400">
            {levelInfo.icon} Level {levelInfo.level}
          </span>
          <span className="w-px h-3 bg-white/15" />
          <span className="text-xs font-medium text-orange-300 flex items-center gap-1">
            <Flame size={12} /> {profile.streak}d
          </span>
        </div>
      </div>

      {/* ─── Desktop Floating Button (bottom-right, above WhatsApp) ─── */}
      <div className="hidden sm:block fixed bottom-28 right-6 z-[60]" data-profile-widget>
        {/* Expanded Panel */}
        {expanded && (
          <div className="absolute bottom-16 right-0 w-80 animate-scale-in origin-bottom-right">
            <div className="rounded-2xl bg-neutral-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-b border-white/5">
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Close profile panel"
                >
                  <X size={16} className="text-stone-400" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-xl shadow-lg shadow-amber-500/20">
                    {levelInfo.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-400/80 uppercase tracking-wider">
                      Level {levelInfo.level}
                    </p>
                    <p className="text-sm font-bold text-stone-100">
                      {levelInfo.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-stone-400 flex items-center gap-1">
                    <Star size={12} className="text-amber-400" />
                    {profile.xp} XP
                  </span>
                  <span className="text-xs text-stone-500">
                    {levelInfo.xpCurrent}/{levelInfo.xpForNext}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700 ease-out"
                    style={{ width: `${levelInfo.xpProgress}%` }}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="px-5 py-3 flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Flame size={16} className="text-orange-400" />
                  <div>
                    <p className="text-xs text-stone-500">Streak</p>
                    <p className="text-sm font-bold text-orange-300">{profile.streak} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Trophy size={16} className="text-amber-400" />
                  <div>
                    <p className="text-xs text-stone-500">Badges</p>
                    <p className="text-sm font-bold text-amber-300">{profile.badges.length}/{BADGES.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Sparkles size={16} className="text-violet-400" />
                  <div>
                    <p className="text-xs text-stone-500">Places</p>
                    <p className="text-sm font-bold text-violet-300">{profile.viewedPlaces.length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Badges */}
              {recentBadges.length > 0 && (
                <div className="px-5 py-3 border-t border-white/5">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Recent Badges
                  </p>
                  <div className="flex gap-2">
                    {recentBadges.map((badge) => (
                      <div
                        key={badge!.id}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5"
                        title={badge!.desc}
                      >
                        <span className="text-base">{badge!.icon}</span>
                        <span className="text-xs font-medium text-stone-300">{badge!.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Badge */}
              {nextBadge && (
                <div className="px-5 py-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{nextBadge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-300 truncate">
                        Next: {nextBadge.name}
                      </p>
                      <p className="text-xs text-stone-500">{nextBadge.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-stone-600 flex-shrink-0" />
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="px-5 py-3 border-t border-white/5">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Suggestions
                  </p>
                  <ul className="space-y-1.5">
                    {recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-400">
                        <ChevronRight size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stats Footer */}
              <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-stone-200">{profile.visitCount}</p>
                    <p className="text-xs text-stone-500">Visits</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-stone-200">{profile.quizzesTaken}</p>
                    <p className="text-xs text-stone-500">Quizzes</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-stone-200">{profile.searchQueries.length}</p>
                    <p className="text-xs text-stone-500">Searches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/90 to-orange-600/90 backdrop-blur-xl border border-amber-400/20 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95 group"
          aria-label="Your travel profile"
          title={`Level ${levelInfo.level}: ${levelInfo.name}`}
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-15 bg-amber-500" />
          {/* Level badge */}
          <span className="relative z-10 text-lg font-bold text-white drop-shadow-sm">
            {levelInfo.level}
          </span>
          {/* XP glow on hover */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 text-lg font-bold text-white drop-shadow-sm">
            {levelInfo.level}
          </span>
        </button>
      </div>
    </>
  );
}
