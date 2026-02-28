import { readFile, writeFile } from "node:fs/promises";
import { SESSION_STATE_PATH } from "./config.js";

/**
 * Saved session state for multi-day hackathon persistence.
 * Written at the end of Day 1, read at the start of Day 2.
 */
export interface SessionState {
  /** Claude Agent SDK session ID for resume */
  sessionId: string;
  /** ISO timestamp of when the session was saved */
  date: string;
  /** Team name chosen during /new-game */
  team?: string;
  /** Game name chosen during /new-game */
  gameName?: string;
  /** Which hackathon day this state was saved on */
  day: 1 | 2;
}

/**
 * Save the current session state to disk.
 * Called at the end of a session (Stop hook or explicit save).
 */
export async function saveSession(state: SessionState): Promise<void> {
  await writeFile(SESSION_STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Load a previously saved session state from disk.
 * Returns null if no saved state exists.
 */
export async function loadSession(): Promise<SessionState | null> {
  try {
    const raw = await readFile(SESSION_STATE_PATH, "utf-8");
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

/**
 * Determine which hackathon day it is based on saved state.
 *
 * Logic:
 * - If no saved state → Day 1
 * - If saved state exists and is from a different calendar day → Day 2
 * - If saved state exists and is from today → same day (resume)
 */
export async function detectDay(): Promise<1 | 2> {
  const state = await loadSession();
  if (!state) return 1;

  const savedDate = new Date(state.date);
  const now = new Date();

  // Different calendar day = Day 2
  if (savedDate.toDateString() !== now.toDateString()) {
    return 2;
  }

  // Same day = whatever day was saved
  return state.day;
}
