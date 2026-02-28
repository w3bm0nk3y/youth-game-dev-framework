import type { HookCallback, PostToolUseHookInput } from "@anthropic-ai/claude-agent-sdk";

/** Track which achievements have been unlocked this session */
const unlocked = new Map<string, boolean>();

/** Count of scripts written (for milestone tracking) */
let scriptsWritten = 0;
let editsPerformed = 0;

/**
 * PostToolUse hook that tracks milestones and celebrates them.
 * Non-intrusive — adds celebration context only when a new achievement is hit.
 */
export const achievementTracker: HookCallback = async (input, _toolUseId, _options) => {
  if (input.hook_event_name !== "PostToolUse") return {};

  const hookInput = input as PostToolUseHookInput;
  const toolName = hookInput.tool_name;
  const toolInput = hookInput.tool_input as Record<string, unknown>;
  const filePath = (toolInput?.file_path as string) ?? "";
  const isLuauFile = filePath.endsWith(".lua") || filePath.endsWith(".luau");

  // --- First Script Written ---
  if (toolName === "Write" && isLuauFile && !unlocked.get("first-script")) {
    unlocked.set("first-script", true);
    scriptsWritten++;
    return {
      hookSpecificOutput: {
        hookEventName: "PostToolUse" as const,
        additionalContext:
          "ACHIEVEMENT UNLOCKED: First Script! You just wrote your first Luau script. You're officially a Roblox developer now!",
      },
    };
  }

  // --- Track script count ---
  if (toolName === "Write" && isLuauFile) {
    scriptsWritten++;

    if (scriptsWritten === 5 && !unlocked.get("five-scripts")) {
      unlocked.set("five-scripts", true);
      return {
        hookSpecificOutput: {
          hookEventName: "PostToolUse" as const,
          additionalContext:
            "ACHIEVEMENT UNLOCKED: Script Machine! You've written 5 scripts. Your game is really coming together!",
        },
      };
    }

    if (scriptsWritten === 10 && !unlocked.get("ten-scripts")) {
      unlocked.set("ten-scripts", true);
      return {
        hookSpecificOutput: {
          hookEventName: "PostToolUse" as const,
          additionalContext:
            "ACHIEVEMENT UNLOCKED: 10 Scripts Club! Double digits! You're building something seriously impressive.",
        },
      };
    }
  }

  // --- First Bug Fix ---
  if (toolName === "Edit" && isLuauFile && !unlocked.get("first-fix")) {
    unlocked.set("first-fix", true);
    editsPerformed++;
    return {
      hookSpecificOutput: {
        hookEventName: "PostToolUse" as const,
        additionalContext:
          "ACHIEVEMENT UNLOCKED: Bug Squasher! You just fixed your first bug. Even the best programmers spend most of their time debugging — you're learning a real skill!",
      },
    };
  }

  // --- Track edit count ---
  if (toolName === "Edit" && isLuauFile) {
    editsPerformed++;

    if (editsPerformed === 10 && !unlocked.get("ten-fixes")) {
      unlocked.set("ten-fixes", true);
      return {
        hookSpecificOutput: {
          hookEventName: "PostToolUse" as const,
          additionalContext:
            "ACHIEVEMENT UNLOCKED: Debugging Pro! 10 code edits. You're getting really good at improving your code!",
        },
      };
    }
  }

  // --- First UI File ---
  if (
    toolName === "Write" &&
    (filePath.toLowerCase().includes("gui") ||
      filePath.toLowerCase().includes("ui") ||
      filePath.toLowerCase().includes("screen")) &&
    !unlocked.get("first-ui")
  ) {
    unlocked.set("first-ui", true);
    return {
      hookSpecificOutput: {
        hookEventName: "PostToolUse" as const,
        additionalContext:
          "ACHIEVEMENT UNLOCKED: UI Designer! You're creating the interface players will see. Making games look good is a real art!",
      },
    };
  }

  return {};
};
