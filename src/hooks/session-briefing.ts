import { readFile } from "node:fs/promises";
import type { HookCallback, SessionStartHookInput } from "@anthropic-ai/claude-agent-sdk";
import { SESSION_STATE_PATH } from "../config.js";

/**
 * SessionStart hook that sets the tone and energy at the beginning
 * of each session. Detects Day 1 vs Day 2 based on saved session state.
 */
export const sessionBriefing: HookCallback = async (input, _toolUseId, _options) => {
  if (input.hook_event_name !== "SessionStart") return {};

  const hookInput = input as SessionStartHookInput;
  const isResume = hookInput.source === "resume";

  // Try to detect Day 2 by checking for saved session state
  let isDay2 = false;
  try {
    const raw = await readFile(SESSION_STATE_PATH, "utf-8");
    const state = JSON.parse(raw);
    if (state?.sessionId && state?.date) {
      const savedDate = new Date(state.date);
      const now = new Date();
      // If the saved date is from a different calendar day, it's Day 2
      isDay2 = savedDate.toDateString() !== now.toDateString();
    }
  } catch {
    // No saved state — this is Day 1 (or first run)
  }

  let briefing: string;

  if (isDay2 || isResume) {
    briefing = `HACKATHON DAY 2 — SHIP IT DAY! Today's goal: Polish, playtest, and publish!

Welcome back! Everything from yesterday is saved and ready. Focus on:
- Fix any bugs from yesterday
- Add juice (sounds, effects, UI polish)
- Playtest with your friends on iPad
- Get it ready to publish!

Pro tip: "Done is better than perfect." Ship what you have!

Use /playtest to run a guided testing session, or /ship-it when you're ready to publish.`;
  } else {
    briefing = `HACKATHON DAY 1! Welcome to your game development adventure!

Today's goal: Design your game concept and build the core gameplay.
By the end of today, you should have:
- A clear game idea that excites you
- The basic world built in Roblox Studio
- At least one working game mechanic (something players can DO)
- A name for your game!

Remember: Start simple, then add cool stuff. The best games start small!

Try /new-game to get started with your game concept, or just tell me what kind of game you want to build!`;
  }

  return {
    hookSpecificOutput: {
      hookEventName: "SessionStart" as const,
      additionalContext: briefing,
    },
  };
};
