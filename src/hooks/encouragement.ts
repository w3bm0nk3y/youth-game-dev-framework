import type { HookCallback, UserPromptSubmitHookInput } from "@anthropic-ai/claude-agent-sdk";
import { FRUSTRATION_SIGNALS } from "../config.js";

/**
 * UserPromptSubmit hook that detects frustration signals in the user's
 * message and injects encouragement context before the AI responds.
 */
export const frustrationDetector: HookCallback = async (input, _toolUseId, _options) => {
  if (input.hook_event_name !== "UserPromptSubmit") return {};

  const hookInput = input as UserPromptSubmitHookInput;
  const prompt = hookInput.prompt?.toLowerCase() ?? "";

  const isFrustrated = FRUSTRATION_SIGNALS.some((signal) =>
    prompt.includes(signal),
  );

  if (isFrustrated) {
    return {
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit" as const,
        additionalContext: `The developer sounds frustrated. Before diving into the technical solution:
1. Acknowledge that what they're feeling is totally normal
2. Remind them that EVERY game developer gets stuck — it's part of the process
3. Break the problem into the smallest possible next step
4. Offer to explain the concept differently if they're confused
5. If they've been stuck for a while, suggest taking a 5-minute break or switching to a different part of the game
6. Keep your tone warm and encouraging — they're learning something hard and doing great`,
      },
    };
  }

  return {};
};
