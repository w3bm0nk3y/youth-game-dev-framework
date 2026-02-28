# Plugin vs SDK Wrapper

The framework runs in two modes. Both give your kid the same AI mentoring experience — the difference is what's managing the conversation and what extras are available.

## Option A: Claude Code Plugin

The plugin is a folder (`plugin/`) that Claude Code loads directly. Your kid runs `claude` in their terminal and the plugin adds game-dev capabilities on top of Claude Code's built-in features.

**What the plugin provides:**

| Component | Details |
|-----------|---------|
| **CLAUDE.md** | Core instruction file — youth-friendly behavior rules, four-layer cognitive hierarchy, Roblox quick reference, code safety rules |
| **5 agents** | game-designer, luau-tutor, world-builder, bug-squasher, play-tester (markdown definitions in `plugin/agents/`) |
| **4 slash commands** | `/new-game`, `/playtest`, `/ship-it`, `/show-progress` (markdown workflows in `plugin/commands/`) |
| **8 game skills** | Obby builder, tycoon system, battle system, UI design, data saving, game loop, mobile optimization, publishing (in `plugin/skills/`) |
| **3 reference docs** | Luau cheatsheet, Roblox services guide, iPad testing tips (in `plugin/docs/`) |
| **Safety hook** | Shell hook that blocks dangerous bash commands (`rm -rf`, `sudo`, `npm install -g`, etc.) via `plugin/hooks/hooks.json` |

**What it doesn't have:** No session persistence across days, no achievement celebrations, no frustration detection, no custom MCP tools (syntax checker, progress board, snippet generator).

## Option B: SDK Wrapper

The SDK wrapper (`src/index.ts`) uses the Claude Agent SDK to run its own conversation loop. It loads the plugin for agents/commands/skills/docs, then adds features on top.

**Everything in the plugin, plus:**

| Feature | How It Works |
|---------|-------------|
| **TypeScript hooks** | 4 event-driven hooks wired into the SDK conversation lifecycle (not shell hooks — these run in-process) |
| **Achievement tracking** | `PostToolUse` hook detects milestones (first script written, first playtest, etc.) and injects celebrations into the conversation |
| **Frustration detection** | `UserPromptSubmit` hook scans for frustration signals ("i give up", "nothing works", "this is stupid") and injects encouragement before the message reaches Claude |
| **Session persistence** | Saves session state to `session-state.json` at the end of Day 1. Running with `--resume` on Day 2 reloads the Claude conversation and sets the "Ship It Day!" tone |
| **Session briefing** | `SessionStart` hook sets the Day 1 or Day 2 opening message, including team/game name if previously set |
| **MCP tools** | 3 custom tools via an in-process MCP server: Luau syntax checker, team progress board, Roblox code snippet generator |
| **Safety guardrails** | `PreToolUse` hook blocks dangerous commands and restricts file edits to safe paths (`game-project/`, `roblox-game/`) |

## When to Use Which

**Choose the Plugin (Option A) if:**
- You have a Claude Max subscription (no API key needed)
- You want the simplest setup — just point Claude Code at the plugin folder
- Your kid is doing a single-session project (no Day 1 → Day 2 needed)
- You want to use Claude Code's built-in features (context window, `/help`, etc.) alongside the game-dev tools

**Choose the SDK Wrapper (Option B) if:**
- You want the full hackathon experience with Day 1 → Day 2 persistence
- You want achievement celebrations and frustration detection (these make a real difference for 11-year-olds)
- You want the MCP tools (syntax checking before pasting into Studio, progress board, snippet generator)
- You're comfortable with an API key and pay-as-you-go pricing

**Can I switch?** Yes. The plugin and SDK wrapper share the same agents, commands, skills, and docs. Starting with the plugin and moving to the SDK wrapper later is straightforward — you just run `npx tsx src/index.ts` instead of `claude`.
