'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TravelProfile {
  visitCount: number;
  lastVisit: string;
  firstVisit: string;
  viewedPlaces: string[];
  viewedStates: string[];
  moodsExplored: string[];
  storiesViewed: string[];
  quizzesTaken: number;
  bookingAttempts: number;
  searchQueries: string[];
  badges: string[];
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
}

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  xp: number;
}

interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  xpCurrent: number;
  xpForNext: number;
  xpProgress: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'rrm-travel-profile';

const BADGES: Badge[] = [
  { id: 'first-visit', name: 'Explorer', desc: 'Visited RRM Holidays', icon: '🧭', xp: 10 },
  { id: '5-places', name: 'Wanderlust', desc: 'Viewed 5 destinations', icon: '🗺️', xp: 50 },
  { id: '10-places', name: 'Globe Trotter', desc: 'Viewed 10 destinations', icon: '🌍', xp: 100 },
  { id: 'all-states', name: 'South India Master', desc: 'Explored all 5 states', icon: '🏆', xp: 200 },
  { id: 'mood-explorer', name: 'Mood Oracle', desc: 'Tried all 5 moods', icon: '🎭', xp: 75 },
  { id: 'story-binge', name: 'Story Addict', desc: 'Viewed all 5 stories', icon: '📱', xp: 60 },
  { id: 'quiz-master', name: 'Quiz Champion', desc: 'Completed 3 quizzes', icon: '🧠', xp: 80 },
  { id: 'streak-3', name: 'Dedicated Traveller', desc: '3-day visit streak', icon: '🔥', xp: 40 },
  { id: 'streak-7', name: 'Travel Obsessed', desc: '7-day visit streak', icon: '⚡', xp: 150 },
  { id: 'searcher', name: 'Curious Mind', desc: 'Searched 10 times', icon: '🔍', xp: 30 },
  { id: 'returning', name: 'Familiar Face', desc: 'Visited 5 times', icon: '👋', xp: 25 },
  { id: 'planner', name: 'Trip Planner', desc: 'Tried to book 3 times', icon: '📋', xp: 60 },
];

const LEVEL_NAMES: Record<number, { name: string; icon: string }> = {
  1: { name: 'Newbie Explorer', icon: '🌱' },
  2: { name: 'Curious Traveller', icon: '🧭' },
  3: { name: 'Destination Seeker', icon: '🗺️' },
  4: { name: 'Trail Blazer', icon: '⛰️' },
  5: { name: 'Journey Master', icon: '🏔️' },
  6: { name: 'South India Expert', icon: '🌴' },
  7: { name: 'Travel Legend', icon: '👑' },
};

const ALL_SOUTH_INDIAN_STATES = [
  'Karnataka',
  'Kerala',
  'Tamil Nadu',
  'Goa',
  'Andhra Pradesh',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEmptyProfile(): TravelProfile {
  const now = new Date().toISOString();
  return {
    visitCount: 0,
    lastVisit: now,
    firstVisit: now,
    viewedPlaces: [],
    viewedStates: [],
    moodsExplored: [],
    storiesViewed: [],
    quizzesTaken: 0,
    bookingAttempts: 0,
    searchQueries: [],
    badges: [],
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: now,
  };
}

function loadProfile(): TravelProfile {
  if (typeof window === 'undefined') return getEmptyProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmptyProfile();
    return JSON.parse(raw) as TravelProfile;
  } catch {
    return getEmptyProfile();
  }
}

function saveProfile(profile: TravelProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

function calculateLevel(xp: number): number {
  // XP per level: level * 100
  // Level 1 → 2 needs 200 total XP, Level 2 → 3 needs 500 total XP, etc.
  // Formula: sum_{i=1}^{n} i*100 = 100 * n*(n+1)/2
  // We need the highest n such that 100*n*(n+1)/2 <= xp
  let level = 1;
  let accumulated = 0;
  for (let n = 1; n <= 7; n++) {
    accumulated += n * 100;
    if (xp >= accumulated) {
      level = n;
    } else {
      break;
    }
  }
  return level;
}

function xpForLevel(level: number): number {
  // Total XP needed to reach this level
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += i * 100;
  }
  return total;
}

function calculateStreak(lastActiveDate: string, today: string): number {
  if (!lastActiveDate) return 1;
  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day — streak continues (handled by caller)
    return 0; // signal no change
  }
  if (diffDays === 1) {
    // Consecutive day — increment streak
    return 1; // signal increment
  }
  // Gap of 2+ days — streak broken, reset to 1
  return -1; // signal reset to 1
}

function checkBadges(profile: TravelProfile): string[] {
  const newBadges: string[] = [];
  const checks: Record<string, boolean> = {};

  for (const badge of BADGES) {
    if (profile.badges.includes(badge.id)) continue;

    switch (badge.id) {
      case 'first-visit':
        checks[badge.id] = profile.visitCount >= 1;
        break;
      case '5-places':
        checks[badge.id] = profile.viewedPlaces.length >= 5;
        break;
      case '10-places':
        checks[badge.id] = profile.viewedPlaces.length >= 10;
        break;
      case 'all-states': {
        const unique = new Set(profile.viewedStates);
        const matched = ALL_SOUTH_INDIAN_STATES.filter((s) => unique.has(s)).length;
        checks[badge.id] = matched >= 5;
        break;
      }
      case 'mood-explorer':
        checks[badge.id] = profile.moodsExplored.length >= 5;
        break;
      case 'story-binge':
        checks[badge.id] = profile.storiesViewed.length >= 5;
        break;
      case 'quiz-master':
        checks[badge.id] = profile.quizzesTaken >= 3;
        break;
      case 'streak-3':
        checks[badge.id] = profile.streak >= 3;
        break;
      case 'streak-7':
        checks[badge.id] = profile.streak >= 7;
        break;
      case 'searcher':
        checks[badge.id] = profile.searchQueries.length >= 10;
        break;
      case 'returning':
        checks[badge.id] = profile.visitCount >= 5;
        break;
      case 'planner':
        checks[badge.id] = profile.bookingAttempts >= 3;
        break;
    }

    if (checks[badge.id]) {
      newBadges.push(badge.id);
    }
  }

  return newBadges;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTravelProfile() {
  const initRef = useRef(false);
  const notificationRef = useRef<string | null>(null);

  const [profile, setProfile] = useState<TravelProfile>(() => {
    if (typeof window !== 'undefined') {
      return loadProfile();
    }
    return getEmptyProfile();
  });
  const [initialized, setInitialized] = useState(() => {
    return typeof window !== 'undefined';
  });

  // Load & update profile on mount (subscribe to localStorage)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const applyInit = () => {
      const loaded = loadProfile();
      const now = new Date().toISOString();
      const today = now.split('T')[0];

      // Increment visit count
      loaded.visitCount += 1;
      loaded.lastVisit = now;

      // Set first visit if new
      if (!loaded.firstVisit) {
        loaded.firstVisit = now;
      }

      // Calculate streak
      const lastActiveDate = loaded.lastActiveDate ? loaded.lastActiveDate.split('T')[0] : '';
      if (lastActiveDate === today) {
        // Already visited today — don't change streak
      } else if (lastActiveDate) {
        const streakAction = calculateStreak(lastActiveDate, today);
        if (streakAction === 1) {
          loaded.streak += 1;
        } else if (streakAction === -1) {
          loaded.streak = 1;
        }
      } else {
        loaded.streak = 1;
      }

      loaded.lastActiveDate = today;

      // Check for new badges
      const newBadges = checkBadges(loaded);
      if (newBadges.length > 0) {
        // Add XP for each new badge
        for (const badgeId of newBadges) {
          const badge = BADGES.find((b) => b.id === badgeId);
          if (badge) {
            loaded.xp += badge.xp;
          }
        }
        loaded.badges = [...loaded.badges, ...newBadges];
        // Store notification for the first new badge
        const firstBadge = BADGES.find((b) => b.id === newBadges[0]);
        if (firstBadge) {
          notificationRef.current = `${firstBadge.icon} Badge Unlocked: ${firstBadge.name}!`;
        }
      }

      // Recalculate level
      loaded.level = calculateLevel(loaded.xp);

      saveProfile(loaded);
      setProfile(loaded);
      setInitialized(true);
    };

    // Subscribe to the "mount" event via microtask to avoid synchronous setState in effect
    queueMicrotask(applyInit);
  }, []);

  // ─── Profile updater helper ────────────────────────────────────────────────

  const updateProfile = useCallback((updater: (prev: TravelProfile) => TravelProfile) => {
    setProfile((prev) => {
      const updated = updater(prev);
      // Check for new badges after update
      const newBadges = checkBadges(updated);
      if (newBadges.length > 0) {
        for (const badgeId of newBadges) {
          const badge = BADGES.find((b) => b.id === badgeId);
          if (badge) {
            updated.xp += badge.xp;
          }
        }
        updated.badges = [...updated.badges, ...newBadges];
        const firstBadge = BADGES.find((b) => b.id === newBadges[0]);
        if (firstBadge) {
          notificationRef.current = `${firstBadge.icon} Badge Unlocked: ${firstBadge.name}!`;
        }
      }
      updated.level = calculateLevel(updated.xp);
      saveProfile(updated);
      return updated;
    });
  }, []);

  // ─── Tracking Functions ────────────────────────────────────────────────────

  const trackPageView = useCallback(
    (placeName: string, state: string) => {
      updateProfile((prev) => {
        const viewedPlaces = prev.viewedPlaces.includes(placeName)
          ? prev.viewedPlaces
          : [...prev.viewedPlaces, placeName];

        const viewedStates = prev.viewedStates.includes(state)
          ? prev.viewedStates
          : [...prev.viewedStates, state];

        return { ...prev, viewedPlaces, viewedStates };
      });
    },
    [updateProfile],
  );

  const trackMood = useCallback(
    (mood: string) => {
      updateProfile((prev) => {
        const moodsExplored = prev.moodsExplored.includes(mood)
          ? prev.moodsExplored
          : [...prev.moodsExplored, mood];
        return { ...prev, moodsExplored };
      });
    },
    [updateProfile],
  );

  const trackStory = useCallback(
    (storyName: string) => {
      updateProfile((prev) => {
        const storiesViewed = prev.storiesViewed.includes(storyName)
          ? prev.storiesViewed
          : [...prev.storiesViewed, storyName];
        return { ...prev, storiesViewed };
      });
    },
    [updateProfile],
  );

  const trackQuiz = useCallback(() => {
    updateProfile((prev) => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1,
    }));
  }, [updateProfile]);

  const trackSearch = useCallback(
    (query: string) => {
      updateProfile((prev) => ({
        ...prev,
        searchQueries: [...prev.searchQueries, query],
      }));
    },
    [updateProfile],
  );

  const trackBooking = useCallback(() => {
    updateProfile((prev) => ({
      ...prev,
      bookingAttempts: prev.bookingAttempts + 1,
    }));
  }, [updateProfile]);

  const addXP = useCallback(
    (amount: number) => {
      updateProfile((prev) => ({
        ...prev,
        xp: prev.xp + amount,
      }));
    },
    [updateProfile],
  );

  // ─── Query Functions ───────────────────────────────────────────────────────

  const isReturningUser = profile.visitCount > 1;

  const getRecentSearches = useCallback((): string[] => {
    return profile.searchQueries.slice(-5).reverse();
  }, [profile.searchQueries]);

  const getLevelInfo = useCallback((): LevelInfo => {
    const level = profile.level;
    const info = LEVEL_NAMES[level] || LEVEL_NAMES[7];
    const currentLevelXp = xpForLevel(level - 1);
    const nextLevelXp = xpForLevel(level);
    const xpCurrent = profile.xp - currentLevelXp;
    const xpForNext = nextLevelXp - currentLevelXp;
    const xpProgress = xpForNext > 0 ? Math.min((xpCurrent / xpForNext) * 100, 100) : 100;

    return {
      level,
      name: info.name,
      icon: info.icon,
      xpCurrent,
      xpForNext,
      xpProgress,
    };
  }, [profile.xp, profile.level]);

  const getNextBadge = useCallback((): Badge | null => {
    for (const badge of BADGES) {
      if (profile.badges.includes(badge.id)) continue;
      return badge;
    }
    return null;
  }, [profile.badges]);

  const getRecommendations = useCallback((): string[] => {
    const recs: string[] = [];
    const statesSet = new Set(profile.viewedStates);
    const unvisitedStates = ALL_SOUTH_INDIAN_STATES.filter((s) => !statesSet.has(s));

    if (unvisitedStates.length > 0) {
      recs.push(`Explore ${unvisitedStates[0]} — you haven't visited it yet!`);
    }

    if (profile.moodsExplored.length < 5) {
      const allMoods = ['Adventure', 'Relaxation', 'Romance', 'Spiritual', 'Foodie'];
      const untried = allMoods.filter((m) => !profile.moodsExplored.includes(m));
      if (untried.length > 0) {
        recs.push(`Try the "${untried[0]}" mood search for new vibes!`);
      }
    }

    if (profile.quizzesTaken === 0) {
      recs.push('Take the Travel Quiz to discover your ideal destination!');
    }

    if (profile.streak < 3) {
      recs.push(`Visit tomorrow to build your streak (${profile.streak}/3 for a badge)!`);
    }

    return recs;
  }, [profile]);

  const getBadgeNotification = useCallback((): string | null => {
    const msg = notificationRef.current;
    notificationRef.current = null;
    return msg;
  }, []);

  return {
    profile,
    initialized,
    trackPageView,
    trackMood,
    trackStory,
    trackQuiz,
    trackSearch,
    trackBooking,
    isReturningUser,
    getRecentSearches,
    getRecommendations,
    getLevelInfo,
    getNextBadge,
    addXP,
    getBadgeNotification,
  };
}

export { BADGES, LEVEL_NAMES, type TravelProfile, type Badge, type LevelInfo };
export default useTravelProfile;
