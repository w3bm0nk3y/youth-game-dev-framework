import type { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

import { gameDesigner } from "./game-designer.js";
import { luauTutor } from "./luau-tutor.js";
import { worldBuilder } from "./world-builder.js";
import { bugSquasher } from "./bug-squasher.js";
import { playTester } from "./play-tester.js";

/**
 * All youth-friendly subagents for the Roblox hackathon.
 *
 * These are passed to query({ options: { agents } }) so that
 * Claude's Task tool can invoke them by name.
 */
export const agents: Record<string, AgentDefinition> = {
  "game-designer": gameDesigner,
  "luau-tutor": luauTutor,
  "world-builder": worldBuilder,
  "bug-squasher": bugSquasher,
  "play-tester": playTester,
};
