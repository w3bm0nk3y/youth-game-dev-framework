import type { HookCallbackMatcher, HookEvent } from "@anthropic-ai/claude-agent-sdk";

import { achievementTracker } from "./achievements.js";
import { frustrationDetector } from "./encouragement.js";
import { safetyGuardrails } from "./safety.js";
import { sessionBriefing } from "./session-briefing.js";

/**
 * All engagement hooks for the Roblox hackathon, organized by event type.
 *
 * Passed to query({ options: { hooks } }).
 *
 * Hook event flow:
 *   SessionStart  → sessionBriefing (set Day 1/Day 2 tone)
 *   UserPromptSubmit → frustrationDetector (inject encouragement if needed)
 *   PreToolUse    → safetyGuardrails (block dangerous commands, restrict paths)
 *   PostToolUse   → achievementTracker (celebrate milestones)
 */
export const hooks: Partial<Record<HookEvent, HookCallbackMatcher[]>> = {
  SessionStart: [
    {
      hooks: [sessionBriefing],
    },
  ],

  UserPromptSubmit: [
    {
      hooks: [frustrationDetector],
    },
  ],

  PreToolUse: [
    {
      hooks: [safetyGuardrails],
    },
  ],

  PostToolUse: [
    {
      hooks: [achievementTracker],
    },
  ],
};
