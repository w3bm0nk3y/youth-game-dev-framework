import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Root of the project directory */
export const PROJECT_ROOT = resolve(__dirname, "..");

/** Where the plugin files live */
export const PLUGIN_DIR = resolve(PROJECT_ROOT, "plugin");

/** Where game project files are kept during the hackathon */
export const GAME_PROJECT_DIR = resolve(PROJECT_ROOT, "game-project");

/** Session state file for Day 1 → Day 2 persistence */
export const SESSION_STATE_PATH = resolve(PROJECT_ROOT, "session-state.json");

/** Team progress board file */
export const PROGRESS_BOARD_PATH = resolve(
  PROJECT_ROOT,
  "progress-board.md",
);

/** Safe file path segments — hooks use this to restrict edits.
 *  Uses both slash directions so it works on Windows and Unix. */
export const SAFE_PATH_SEGMENTS = [
  "game-project",
  "roblox-game",
];

/** Blocked bash patterns for safety guardrails.
 *  Covers both Unix and Windows destructive commands. */
export const BLOCKED_BASH_PATTERNS: RegExp[] = [
  // Unix
  /rm\s+-rf/,
  /curl.*\|.*sh/,
  /sudo/,
  /chmod/,
  // Windows
  /rmdir\s+\/s/i,
  /del\s+\/[fq]/i,
  /format\s+[a-z]:/i,
  // Cross-platform
  /npm.*install.*-g/,
];

/** Frustration signal phrases for encouragement hook */
export const FRUSTRATION_SIGNALS = [
  "i give up",
  "this is impossible",
  "i can't",
  "nothing works",
  "i hate this",
  "this is stupid",
  "it's broken",
  "ugh",
  "i don't understand",
  "this doesn't make sense",
  "help me",
];
