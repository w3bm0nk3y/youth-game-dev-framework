import { sep } from "node:path";
import type { HookCallback, PreToolUseHookInput } from "@anthropic-ai/claude-agent-sdk";
import { BLOCKED_BASH_PATTERNS, SAFE_PATH_SEGMENTS } from "../config.js";

/**
 * Normalize a file path for cross-platform segment matching.
 * Converts backslashes to forward slashes so checks work on Windows and Unix.
 */
function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/").toLowerCase();
}

/**
 * PreToolUse hook that enforces safety guardrails for young developers.
 *
 * - Blocks dangerous bash commands (rm -rf, sudo, curl|sh, rmdir /s, etc.)
 * - Restricts file writes to the game project directory
 *
 * Works on both Windows and Unix.
 */
export const safetyGuardrails: HookCallback = async (input, _toolUseId, _options) => {
  if (input.hook_event_name !== "PreToolUse") return {};

  const hookInput = input as PreToolUseHookInput;
  const toolName = hookInput.tool_name;
  const toolInput = hookInput.tool_input as Record<string, unknown>;

  // Block dangerous bash commands (Unix and Windows)
  if (toolName === "Bash") {
    const command = (toolInput?.command as string) ?? "";

    if (BLOCKED_BASH_PATTERNS.some((pattern) => pattern.test(command))) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse" as const,
          permissionDecision: "deny" as const,
          permissionDecisionReason:
            "This command isn't needed for Roblox game development. Let's focus on building your game!",
        },
      };
    }
  }

  // Keep file edits within the game project directory
  if (toolName === "Write" || toolName === "Edit") {
    const filePath = normalizePath((toolInput?.file_path as string) ?? "");

    // Allow if the path contains any of the safe directory segments
    const isSafe = SAFE_PATH_SEGMENTS.some((segment) =>
      filePath.includes(`/${segment}/`) || filePath.includes(`/${segment}`)
    );

    // Also allow plugin/framework directory writes (for progress board, etc.)
    const isProjectPath =
      filePath.includes("/plugin/") ||
      filePath.includes("/youth-game-dev-framework/");

    if (!isSafe && !isProjectPath) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse" as const,
          permissionDecision: "deny" as const,
          permissionDecisionReason:
            "Let's keep our work in the game project folder!",
        },
      };
    }
  }

  return {};
};
