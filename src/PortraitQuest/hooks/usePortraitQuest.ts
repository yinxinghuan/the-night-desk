import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  Ending, EventCard, FeedbackState, Locale, PortraitState, StatKey, Stats, ThemeCartridge,
} from '../types';
import {
  playClick, playCrisisPulse, playLose, playMidpoint, playNegative,
  playPositive, playStart, playWin, resumeAudio,
} from '../utils/sounds';

const INITIAL_STATS: Stats = { calm: 55, order: 55, trust: 55, truth: 55 };
const STAT_ORDER: StatKey[] = ['calm', 'order', 'trust', 'truth'];
const TOTAL_ROUNDS = 12;
const FEEDBACK_MS = 1100;
const GRACE_MS = 1500;

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function countFlag(flags: Set<string>, value: string) {
  return flags.has(value) ? 1 : 0;
}

function chooseEvent(events: EventCard[], round: number, flags: Set<string>, used: Set<string>): EventCard {
  const eligible = events.filter((event) => {
    if (used.has(event.id)) return false;
    if ((event.minRound ?? 1) > round || (event.maxRound ?? TOTAL_ROUNDS) < round) return false;
    if (event.requiresAny?.length && !event.requiresAny.some((flag) => flags.has(flag))) return false;
    if (event.excludesAny?.some((flag) => flags.has(flag))) return false;
    return true;
  });
  const fallback = events.filter((event) => !used.has(event.id));
  const pool = eligible.length ? eligible : fallback;
  return shuffled(pool)[0] ?? events[0];
}

function computeScore(rounds: number, stats: Stats, truthFlags: number, completed: boolean) {
  const sum = STAT_ORDER.reduce((total, key) => total + stats[key], 0);
  const min = Math.min(...STAT_ORDER.map((key) => stats[key]));
  return rounds * 100 + sum * 4 + min * 6 + truthFlags * 150 + (completed ? 800 : 0);
}

function resolveEnding(cartridge: ThemeCartridge, stats: Stats, flags: Set<string>, failedStat: StatKey | null): Ending {
  if (failedStat) return cartridge.endings[`fail_${failedStat}`];
  const values = STAT_ORDER.map((key) => stats[key]);
  if (Math.max(...values) - Math.min(...values) <= 12) return cartridge.endings.balanced;
  if (cartridge.specialEndingFlags.every((flag) => flags.has(flag))) return cartridge.endings.truth;
  const highest = [...STAT_ORDER].sort((a, b) => stats[b] - stats[a])[0];
  return cartridge.endings[highest];
}

export function usePortraitQuest(cartridge: ThemeCartridge, locale: Locale) {
  const storageKey = `portrait_quest_best_${cartridge.id}`;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [currentEvent, setCurrentEvent] = useState<EventCard>(() => cartridge.events[0]);
  const [portrait, setPortrait] = useState<PortraitState>('arrival');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [inputLocked, setInputLocked] = useState(true);
  const [showMidpoint, setShowMidpoint] = useState(false);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(
    localStorage.getItem(storageKey)
      ?? (cartridge.id === 'night-desk' ? localStorage.getItem('portrait_quest_best') : null)
      ?? 0,
  ));
  const flagsRef = useRef(new Set<string>());
  const usedRef = useRef(new Set<string>());
  const timersRef = useRef<number[]>([]);
  const pendingNextRef = useRef<(() => void) | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (!isPlaying || Math.min(...STAT_ORDER.map((key) => stats[key])) >= 18) return;
    playCrisisPulse();
    const interval = window.setInterval(playCrisisPulse, 1400);
    return () => window.clearInterval(interval);
  }, [isPlaying, stats]);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    resumeAudio();
    playStart();
    const freshFlags = new Set<string>();
    const freshUsed = new Set<string>();
    flagsRef.current = freshFlags;
    usedRef.current = freshUsed;
    const first = chooseEvent(cartridge.events, 1, freshFlags, freshUsed);
    freshUsed.add(first.id);
    setStats(INITIAL_STATS);
    setRound(1);
    setCurrentEvent(first);
    setPortrait('arrival');
    setFeedback(null);
    setEnding(null);
    setScore(0);
    setShowMidpoint(false);
    setIsGameOver(false);
    setIsPlaying(true);
    setInputLocked(true);
    schedule(() => {
      setPortrait('neutral');
      setInputLocked(false);
    }, GRACE_MS);
  }, [cartridge.events, clearTimers, schedule]);

  const finish = useCallback((nextStats: Stats, completedRounds: number, failedStat: StatKey | null) => {
    const truthFlags = cartridge.discoveryFlags
      .reduce((total, flag) => total + countFlag(flagsRef.current, flag), 0);
    const completed = failedStat == null;
    const finalScore = computeScore(completedRounds, nextStats, truthFlags, completed);
    const resolved = resolveEnding(cartridge, nextStats, flagsRef.current, failedStat);
    setScore(finalScore);
    setEnding(resolved);
    setPortrait(completed ? 'resolved' : 'exhausted');
    setIsPlaying(false);
    setIsGameOver(true);
    setInputLocked(true);
    setBestScore((previous) => {
      const next = Math.max(previous, finalScore);
      localStorage.setItem(storageKey, String(next));
      return next;
    });
    if (completed) playWin(); else playLose();
  }, [cartridge, storageKey]);

  const advance = useCallback((nextRound: number, nextStats: Stats) => {
    const nextEvent = chooseEvent(cartridge.events, nextRound, flagsRef.current, usedRef.current);
    usedRef.current.add(nextEvent.id);
    setRound(nextRound);
    setCurrentEvent(nextEvent);
    setFeedback(null);
    setPortrait(Math.min(...STAT_ORDER.map((key) => nextStats[key])) < 18 ? 'exhausted' : 'neutral');
    setInputLocked(false);
  }, [cartridge.events]);

  const choose = useCallback((choiceIndex: 0 | 1) => {
    if (!isPlaying || inputLocked || feedback) return;
    resumeAudio();
    playClick();
    setInputLocked(true);
    const choice = currentEvent.choices[choiceIndex];
    choice.addFlags?.forEach((flag) => flagsRef.current.add(flag));
    const nextStats = { ...stats };
    STAT_ORDER.forEach((key) => {
      nextStats[key] = clamp(nextStats[key] + (choice.effects[key] ?? 0));
    });
    const failedStat = STAT_ORDER.find((key) => nextStats[key] <= 0) ?? null;
    const hasPositive = Object.values(choice.effects).some((value) => (value ?? 0) > 0);
    const hasNegative = Object.values(choice.effects).some((value) => (value ?? 0) < 0);
    if (hasPositive && !hasNegative) playPositive();
    else if (hasNegative) playNegative();
    setStats(nextStats);
    setPortrait(
      Math.min(...STAT_ORDER.map((key) => nextStats[key])) < 18
        ? 'exhausted'
        : choice.portrait ?? (hasPositive ? 'confident' : 'worried'),
    );
    schedule(() => {
      setFeedback({ outcome: choice.outcome[locale], effects: choice.effects });
    }, 220);

    const doNext = () => {
      if (failedStat) {
        finish(nextStats, round, failedStat);
      } else if (round >= TOTAL_ROUNDS) {
        finish(nextStats, TOTAL_ROUNDS, null);
      } else if (round === 6) {
        setShowMidpoint(true);
        playMidpoint();
        pendingNextRef.current = () => advance(round + 1, nextStats);
      } else {
        advance(round + 1, nextStats);
      }
    };
    schedule(doNext, FEEDBACK_MS);
  }, [advance, currentEvent.choices, feedback, finish, inputLocked, isPlaying, locale, round, schedule, stats]);

  const continueMidpoint = useCallback(() => {
    if (!showMidpoint) return;
    playClick();
    setShowMidpoint(false);
    const pending = pendingNextRef.current;
    pendingNextRef.current = null;
    pending?.();
  }, [showMidpoint]);

  const home = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
    setIsGameOver(false);
    setShowMidpoint(false);
    setFeedback(null);
    setInputLocked(true);
    setPortrait('arrival');
  }, [clearTimers]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!isPlaying && !isGameOver && event.key === 'Enter') start();
      else if (showMidpoint && event.key === 'Enter') continueMidpoint();
      else if (isGameOver && event.key === 'Enter') start();
      else if (isPlaying && !showMidpoint) {
        if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') choose(0);
        if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') choose(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, continueMidpoint, isGameOver, isPlaying, showMidpoint, start]);

  const midpointMode = useMemo<'investigate' | 'obey'>(
    () => flagsRef.current.has('investigate') ? 'investigate' : 'obey',
    [showMidpoint],
  );

  return {
    isPlaying, isGameOver, round, stats, currentEvent, portrait, feedback, inputLocked,
    showMidpoint, midpointMode, ending, score, bestScore, start, choose, continueMidpoint, home,
  };
}
