import { appendFile, readFile } from "node:fs/promises";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod/v4";
import { PROGRESS_BOARD_PATH } from "../config.js";
import { snippets, type SnippetPattern } from "./snippets.js";

/**
 * Custom MCP tool server providing Roblox-specific development tools.
 *
 * Tools:
 *   check_luau_syntax  — Basic Luau syntax validation
 *   update_progress    — Team progress board
 *   roblox_snippet     — Common code pattern generator
 */
export const robloxToolsServer = createSdkMcpServer({
  name: "roblox-dev-tools",
  version: "1.0.0",
  tools: [
    // ─── Luau Syntax Checker ───────────────────────────────────
    tool(
      "check_luau_syntax",
      "Check if a Luau script has any syntax errors before putting it in Roblox Studio. Catches common mistakes like missing 'end', unbalanced parentheses, and typos.",
      {
        script_content: z.string().describe("The Luau script code to validate"),
        script_name: z.string().optional().describe("Name of the script for reference"),
      },
      async (args) => {
        const errors: string[] = [];
        const code = args.script_content;
        const name = args.script_name ?? "script";

        // Basic bracket/paren/brace balance check
        const openParens = (code.match(/\(/g) ?? []).length;
        const closeParens = (code.match(/\)/g) ?? []).length;
        if (openParens !== closeParens) {
          errors.push(
            `Parentheses don't match: ${openParens} opening ( but ${closeParens} closing ). Check for a missing ) somewhere.`,
          );
        }

        const openBrackets = (code.match(/\[/g) ?? []).length;
        const closeBrackets = (code.match(/\]/g) ?? []).length;
        if (openBrackets !== closeBrackets) {
          errors.push(
            `Square brackets don't match: ${openBrackets} opening [ but ${closeBrackets} closing ].`,
          );
        }

        const openBraces = (code.match(/\{/g) ?? []).length;
        const closeBraces = (code.match(/\}/g) ?? []).length;
        if (openBraces !== closeBraces) {
          errors.push(
            `Curly braces don't match: ${openBraces} opening { but ${closeBraces} closing }.`,
          );
        }

        // Check for balanced block keywords (do/end, function/end, if/end, etc.)
        // Strip strings and comments first to avoid false positives
        const stripped = code
          .replace(/--\[\[[\s\S]*?\]\]/g, "") // block comments
          .replace(/--.*/g, "")               // line comments
          .replace(/"[^"]*"/g, '""')          // double-quoted strings
          .replace(/'[^']*'/g, "''");         // single-quoted strings

        const blockOpeners =
          (stripped.match(/\b(do|function|if|for|while|repeat)\b/g) ?? []).length -
          (stripped.match(/\brepeat\b/g) ?? []).length; // repeat uses 'until' not 'end'

        const repeatCount = (stripped.match(/\brepeat\b/g) ?? []).length;
        const untilCount = (stripped.match(/\buntil\b/g) ?? []).length;
        const endCount = (stripped.match(/\bend\b/g) ?? []).length;

        if (blockOpeners !== endCount) {
          errors.push(
            `Block keyword mismatch: found ${blockOpeners} block openers (do/function/if/for/while) but ${endCount} 'end' keywords. You might be missing an 'end' somewhere.`,
          );
        }

        if (repeatCount !== untilCount) {
          errors.push(
            `repeat/until mismatch: ${repeatCount} 'repeat' but ${untilCount} 'until'.`,
          );
        }

        // Check for common typos
        const typoPatterns: Array<[RegExp, string]> = [
          [/\blocal\s+function\s+\w+\s*[^(]/m, "Function definition might be missing parentheses ()."],
          [/\bfuntcion\b/i, "Typo: 'funtcion' should be 'function'."],
          [/\bretrun\b/i, "Typo: 'retrun' should be 'return'."],
          [/\bwahile\b/i, "Typo: 'wahile' should be 'while'."],
          [/\bteh\b/i, "Typo: 'teh' should be 'the' (in a comment maybe?)."],
          [/\bprnit\b/i, "Typo: 'prnit' should be 'print'."],
          [/===/, "Luau uses == for equality, not === (that's JavaScript!)."],
          [/!==/, "Luau uses ~= for not-equal, not !== (that's JavaScript!)."],
          [/!=(?!=)/, "Luau uses ~= for not-equal, not != (that's JavaScript/Python!)."],
        ];

        for (const [pattern, message] of typoPatterns) {
          if (pattern.test(code)) {
            errors.push(message);
          }
        }

        if (errors.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `${name}: Looks good! No syntax issues found. Ready to paste into Roblox Studio.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `${name}: Found ${errors.length} potential issue${errors.length > 1 ? "s" : ""} — easy fixes!\n\n${errors.map((e, i) => `${i + 1}. ${e}`).join("\n")}`,
            },
          ],
        };
      },
    ),

    // ─── Progress Board ────────────────────────────────────────
    tool(
      "update_progress",
      "Update the team progress board with what you just accomplished. Everyone can see the progress!",
      {
        player_name: z.string().describe("Your name"),
        what_you_did: z.string().describe("What you just built or fixed"),
        next_step: z.string().optional().describe("What you plan to do next"),
      },
      async (args) => {
        const timestamp = new Date().toLocaleTimeString();
        const entry = `| ${timestamp} | ${args.player_name} | ${args.what_you_did} | ${args.next_step ?? "TBD"} |\n`;

        try {
          // Try to read existing file; create header if it doesn't exist
          let existing = "";
          try {
            existing = await readFile(PROGRESS_BOARD_PATH, "utf-8");
          } catch {
            // File doesn't exist yet — create with header
            const header =
              "# Team Progress Board\n\n| Time | Who | What | Next |\n|------|-----|------|------|\n";
            await appendFile(PROGRESS_BOARD_PATH, header);
          }

          await appendFile(PROGRESS_BOARD_PATH, entry);

          return {
            content: [
              {
                type: "text" as const,
                text: `Progress updated! ${args.player_name} completed: "${args.what_you_did}". Everyone can see what you accomplished on the progress board.`,
              },
            ],
          };
        } catch (err) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Couldn't update the progress board (${String(err)}), but great job on: "${args.what_you_did}"!`,
              },
            ],
          };
        }
      },
    ),

    // ─── Roblox Code Snippet Generator ─────────────────────────
    tool(
      "roblox_snippet",
      "Generate a common Roblox code pattern with explanations. Great for learning common game mechanics!",
      {
        pattern: z
          .enum([
            "touch-to-collect",
            "click-to-buy",
            "leaderboard",
            "round-system",
            "teleporter",
            "damage-on-touch",
            "heal-zone",
            "speed-boost",
            "inventory-system",
            "remote-event",
          ])
          .describe("The code pattern you need"),
      },
      async (args) => {
        const snippet = snippets[args.pattern as SnippetPattern];

        if (!snippet) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Pattern "${args.pattern}" not found. Available patterns: ${Object.keys(snippets).join(", ")}`,
              },
            ],
          };
        }

        const output = `# ${snippet.name}

**What it does:** ${snippet.description}

**Where to put it:** ${snippet.placement}

\`\`\`lua
${snippet.code}
\`\`\`

## How to Customize
${snippet.customization}`;

        return {
          content: [{ type: "text" as const, text: output }],
        };
      },
    ),
  ],
});
