/**
 * Youth Game Dev Framework — Entry Point
 *
 * A Claude Agent SDK wrapper that provides an enhanced hackathon experience
 * for young Roblox developers. Wires together:
 *   - 5 youth-friendly subagents (game-designer, luau-tutor, world-builder, bug-squasher, play-tester)
 *   - 4 engagement hooks (achievements, frustration detection, safety guardrails, session briefing)
 *   - 3 custom MCP tools (Luau syntax checker, progress board, snippet generator)
 *   - Session persistence (Day 1 → Day 2)
 *   - Local plugin loading (skills, commands, docs)
 *
 * Usage:
 *   npx tsx src/index.ts                  # Start a new session
 *   npx tsx src/index.ts --resume         # Resume from saved session
 *   npx tsx src/index.ts "Build an obby"  # Start with an initial prompt
 */

import { mkdirSync } from "node:fs";
import * as readline from "node:readline/promises";
import { query } from "@anthropic-ai/claude-agent-sdk";
import type { SDKMessage, SdkPluginConfig } from "@anthropic-ai/claude-agent-sdk";

import { agents } from "./agents/index.js";
import { hooks } from "./hooks/index.js";
import { robloxToolsServer } from "./tools/index.js";
import { loadSession, saveSession, detectDay } from "./session.js";
import { PLUGIN_DIR, GAME_PROJECT_DIR } from "./config.js";

// ─── Ensure game project directory exists ────────────────────────
mkdirSync(GAME_PROJECT_DIR, { recursive: true });

// ─── Activity dedup state ──────────────────────────────────────
/** Track last printed progress messages to avoid flooding the console. */
const recentProgress = new Map<string, number>(); // key → timestamp
const DEDUP_WINDOW_MS = 5_000;

/** Called by displayMessage whenever it prints activity output. */
let onActivity: (() => void) | undefined;

// ─── Parse CLI args ────────────────────────────────────────────
const args = process.argv.slice(2);
const shouldResume = args.includes("--resume");
const initialPrompt = args.filter((a) => !a.startsWith("--")).join(" ");

// ─── Plugin config ─────────────────────────────────────────────
const pluginConfig: SdkPluginConfig[] = [
  {
    type: "local",
    path: PLUGIN_DIR,
  },
];

// ─── System prompt append for youth context ────────────────────
const youthSystemAppend = `
You are helping a kid and their friends build a Roblox game at a weekend hackathon.

IMPORTANT BEHAVIOR:
- Use simple, encouraging language. Avoid jargon.
- When explaining concepts, use analogies to games they know (Adopt Me, Brookhaven, Tower of Hell, Blox Fruits).
- Celebrate their progress! Every working feature is an achievement.
- When they're stuck, break problems into the smallest possible next step.
- Always suggest playtesting on iPad after major changes.
- Keep code examples short (under 20 lines when possible) with comments on every block.
- When referencing ANY Roblox Studio UI element (Explorer, Properties, Output, Terrain Editor, Toolbox, etc.), always give step-by-step navigation. These kids may have never opened Studio before. Example: instead of "open the Explorer", say "go to the View tab at the top > click Explorer (it's the tree on the right side)".

FOUR-LAYER COGNITIVE HIERARCHY:
- Layer 1 (Build It!): Actual Luau scripting, placing parts, wiring events → use luau-tutor or bug-squasher
- Layer 2 (Design It!): Feature design, what goes where, game structure → use game-designer
- Layer 3 (Think It Through!): Game balance, fun factor, fairness, player experience → use game-designer or play-tester
- Layer 4 (Team Up!): Multi-system features requiring scripting + building + UI together → coordinate agents

AVAILABLE COMMANDS:
- /new-game — Start a new game project with guided brainstorming
- /playtest — Run a guided playtesting session
- /ship-it — Publishing checklist
- /show-progress — View the team progress board

AVAILABLE AGENTS (use Task tool to delegate):
- game-designer: Brainstorming, game mechanics, feature planning
- luau-tutor: Teaching Luau scripting, writing code
- world-builder: Roblox Studio environment design
- bug-squasher: Debugging and fixing errors
- play-tester: Evaluating game feel and player experience
`;

// ─── Main ──────────────────────────────────────────────────────
async function main(): Promise<void> {
  const day = await detectDay();
  const savedState = await loadSession();

  console.log("╔════════════════════════════════════════════════╗");
  console.log("║   Youth Game Dev Framework — Roblox Hackathon  ║");
  console.log(`║   Day ${day} ${day === 1 ? "— Let's Build Something Amazing!" : "— Ship It Day!"}${"".padEnd(day === 1 ? 6 : 18)}║`);
  console.log("╚════════════════════════════════════════════════╝");
  console.log();

  if (savedState?.gameName) {
    console.log(`  Game: ${savedState.gameName}`);
  }
  if (savedState?.team) {
    console.log(`  Team: ${savedState.team}`);
  }
  console.log("  Commands: /new-game  /playtest  /ship-it  /show-progress");
  console.log("  Type /quit to save & exit (your progress saves automatically!)");
  console.log();

  // Determine the prompt to send
  let prompt: string;
  if (initialPrompt) {
    prompt = initialPrompt;
  } else if (day === 2 && savedState) {
    prompt =
      "Good morning! Let's pick up where we left off yesterday. What should we work on first today?";
  } else {
    prompt =
      "Hi! I'm ready to build a Roblox game. What kind of game should we make?";
  }

  // Build reusable query options
  const resumeSessionId =
    shouldResume && savedState?.sessionId ? savedState.sessionId : undefined;

  const baseOptions = {
    systemPrompt: {
      type: "preset" as const,
      preset: "claude_code" as const,
      append: youthSystemAppend,
    },
    agents,
    hooks,
    mcpServers: {
      "roblox-dev-tools": robloxToolsServer,
    },
    plugins: pluginConfig,
    permissionMode: "acceptEdits" as const,
    allowedTools: [
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "Bash",
      "Task",
      "WebSearch",
      "WebFetch",
    ],
    cwd: GAME_PROJECT_DIR,
    model: "claude-sonnet-4-6",
  };

  let firstTurn = true;

  // Run a single query turn and stream its messages
  async function runTurn(turnPrompt: string, resumeId?: string): Promise<string | undefined> {
    console.log("\n   Thinking...\n");

    let lastActivityTime = Date.now();

    // Periodic fallback: print "Still working..." if nothing else has been
    // printed for 8 seconds. Guarantees no silent gaps longer than ~8s.
    const stillWorkingInterval = setInterval(() => {
      if (Date.now() - lastActivityTime > 7_000) {
        console.log("   [Still working...]");
        lastActivityTime = Date.now();
      }
    }, 8_000);

    // Wire up the activity callback so displayMessage can reset the timer
    onActivity = () => {
      lastActivityTime = Date.now();
    };

    const iter = query({
      prompt: turnPrompt,
      options: { ...baseOptions, resume: resumeId },
    });

    let capturedId: string | undefined;
    try {
      for await (const message of iter) {
        capturedId = captureSessionId(message, capturedId);
        displayMessage(message, firstTurn);
      }
    } finally {
      clearInterval(stillWorkingInterval);
      onActivity = undefined;
    }
    firstTurn = false;
    return capturedId;
  }

  // ─── First turn ─────────────────────────────────────────────
  let sessionId = await runTurn(prompt, resumeSessionId);

  // ─── Conversation loop ──────────────────────────────────────
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      let userInput: string;
      try {
        userInput = await rl.question("\nYou > ");
      } catch {
        // stdin closed (Ctrl+D)
        break;
      }

      const trimmed = userInput.trim();
      if (!trimmed) continue;
      if (trimmed === "/quit" || trimmed === "/exit") break;

      const turnId = await runTurn(trimmed, sessionId);
      if (turnId) sessionId = turnId;
    }
  } finally {
    rl.close();
  }

  // Save session state for Day 2 resume
  if (sessionId) {
    await saveSession({
      sessionId,
      date: new Date().toISOString(),
      day,
      team: savedState?.team,
      gameName: savedState?.gameName,
    });
    const resumeCmd = process.platform === "win32"
      ? "npx tsx .\\src\\index.ts --resume"
      : "npx tsx src/index.ts --resume";
    console.log("\n  Great work today! Your progress has been saved.");
    console.log("  To pick up where you left off, run:");
    console.log(`    ${resumeCmd}`);
    console.log();
  }
}

/**
 * Extract session ID from system init messages.
 */
function captureSessionId(
  message: SDKMessage,
  current: string | undefined,
): string | undefined {
  if (message.type === "system" && "subtype" in message && message.subtype === "init") {
    return message.session_id;
  }
  return current ?? (message as { session_id?: string }).session_id;
}

/**
 * Display SDK messages to the console in a youth-friendly format.
 *
 * Handles assistant text, errors, system lifecycle events, tool progress,
 * tool summaries, and task notifications. Deduplicates noisy progress
 * messages so the console stays readable.
 */
function displayMessage(message: SDKMessage, showSystemInit = true): void {
  switch (message.type) {
    case "assistant": {
      // Extract text content from the assistant message
      const content = message.message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (typeof block === "object" && block !== null && "type" in block) {
            if (block.type === "text" && "text" in block) {
              console.log(block.text as string);
              onActivity?.();
            }
          }
        }
      }
      break;
    }

    case "result": {
      if (message.subtype === "error") {
        const errMsg = "error" in message ? (message as { error: string }).error : "Unknown error";
        console.error("\nOops! Something went wrong:", errMsg);
        console.log("Don't worry — this happens sometimes. Try asking again!");
        onActivity?.();
      }
      break;
    }

    case "system": {
      if (!("subtype" in message)) break;
      if (message.subtype === "init" && showSystemInit) {
        const sysMsg = message as {
          tools?: string[];
          agents?: string[];
          mcp_servers?: Array<{ name: string; status: string }>;
        };
        console.log(
          `Ready! ${sysMsg.tools?.length ?? 0} tools, ${sysMsg.agents?.length ?? 0} agents, ${sysMsg.mcp_servers?.length ?? 0} MCP servers loaded.`,
        );
        console.log();
        onActivity?.();
      } else if (message.subtype === "task_started") {
        const desc = (message as { description?: string }).description ?? "";
        console.log(`   [Agent working: ${desc}]`);
        onActivity?.();
      } else if (message.subtype === "task_progress") {
        const last = (message as { last_tool_name?: string }).last_tool_name;
        if (last && !isDuplicate(`task_progress:${last}`)) {
          console.log(`   [Still working... using ${last}]`);
          onActivity?.();
        }
      } else if (message.subtype === "task_notification") {
        const status = (message as { status?: string }).status;
        const summary = (message as { summary?: string }).summary ?? "";
        if (status === "completed" && summary) {
          console.log(`   [Agent finished: ${summary}]`);
          onActivity?.();
        }
      }
      break;
    }

    case "tool_progress": {
      const toolMsg = message as { tool_name?: string; elapsed_time_seconds?: number };
      if (toolMsg.elapsed_time_seconds && toolMsg.elapsed_time_seconds >= 3) {
        const key = `tool_progress:${toolMsg.tool_name ?? "tool"}`;
        if (!isDuplicate(key)) {
          console.log(`   [Running ${toolMsg.tool_name ?? "tool"}...]`);
          onActivity?.();
        }
      }
      break;
    }

    case "tool_use_summary" as string: {
      const summary = (message as { summary?: string }).summary ?? "";
      if (summary) {
        console.log(`   [Tool: ${summary}]`);
        onActivity?.();
      }
      break;
    }
  }
}

/**
 * Returns true if a message with the given key was already printed
 * within the dedup window (5 seconds). Records the key if not a duplicate.
 */
function isDuplicate(key: string): boolean {
  const now = Date.now();
  const last = recentProgress.get(key);
  if (last !== undefined && now - last < DEDUP_WINDOW_MS) {
    return true;
  }
  recentProgress.set(key, now);
  return false;
}

// ─── Run ───────────────────────────────────────────────────────
main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
