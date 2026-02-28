# Youth Game Dev Framework

A Claude Code plugin and SDK wrapper for youth Roblox game development at weekend hackathons. Designed for 11-year-old developers and their friends building games with Claude as their AI mentor.

## Two Deliverables

### A) Standalone Plugin (`plugin/`)

A local Claude Code plugin that works with the regular `claude` CLI. Provides youth-friendly agents, Roblox skills, slash commands, and reference docs.

**Install:**

```bash
# In your game project directory, create or edit .claude/settings.json:
{
  "plugins": ["/absolute/path/to/youth-game-dev-framework/plugin"]
}

# Then run Claude Code normally:
claude
```

**What you get:**
- 5 youth-friendly agents (game-designer, luau-tutor, world-builder, bug-squasher, play-tester)
- 4 slash commands (`/new-game`, `/playtest`, `/ship-it`, `/show-progress`)
- 8 Roblox game pattern skills (obby, tycoon, battle, UI, data saving, game loop, mobile, publishing)
- Reference docs (Luau cheatsheet, Roblox services, iPad testing guide)
- Shell-based safety hooks

### B) SDK Wrapper (`src/`)

A TypeScript program that runs Claude Agent SDK with the plugin loaded plus programmatic enhancements only possible in TypeScript.

**Install:**

```bash
cd youth-game-dev-framework
npm install
```

**Run:**

```bash
# New Day 1 session
npx tsx src/index.ts

# Resume Day 2
npx tsx src/index.ts --resume

# Start with a specific prompt
npx tsx src/index.ts "Build an obby game"
```

**Extra features over standalone plugin:**
- Achievement system (PostToolUse hooks celebrate milestones)
- Frustration detection (UserPromptSubmit hooks inject encouragement)
- Safety guardrails (PreToolUse hooks block dangerous commands)
- Day 1/Day 2 session briefing (SessionStart hooks)
- Session persistence (save/resume across hackathon days)
- Custom MCP tools (Luau syntax checker, team progress board, code snippet generator)

## Project Structure

```
youth-game-dev-framework/
├── src/                          # SDK Wrapper (Deliverable B)
│   ├── index.ts                  # Entry point — wires everything together
│   ├── config.ts                 # Shared constants and configuration
│   ├── session.ts                # Day 1/Day 2 session persistence
│   ├── agents/                   # TypeScript agent definitions
│   │   ├── game-designer.ts      # Creative design mentor (Sonnet)
│   │   ├── luau-tutor.ts         # Patient coding teacher (Sonnet)
│   │   ├── world-builder.ts      # Environment specialist (Haiku)
│   │   ├── bug-squasher.ts       # Debugging detective (Sonnet)
│   │   ├── play-tester.ts        # Playtesting coach (Haiku)
│   │   └── index.ts              # Barrel export
│   ├── hooks/                    # TypeScript hook callbacks
│   │   ├── achievements.ts       # PostToolUse — milestone celebrations
│   │   ├── encouragement.ts      # UserPromptSubmit — frustration detection
│   │   ├── safety.ts             # PreToolUse — command/path guardrails
│   │   ├── session-briefing.ts   # SessionStart — Day 1/2 briefing
│   │   └── index.ts              # Barrel export
│   └── tools/                    # Custom MCP tools
│       ├── roblox-tools-server.ts  # MCP server (syntax check, progress, snippets)
│       ├── snippets.ts           # 10 Luau code pattern templates
│       └── index.ts              # Barrel export
│
├── plugin/                       # Standalone Plugin (Deliverable A)
│   ├── .claude-plugin/
│   │   └── plugin.json           # Plugin manifest
│   ├── CLAUDE.md                 # Core plugin instructions
│   ├── commands/                 # Slash commands
│   │   ├── new-game.md           # /new-game — guided game concept creation
│   │   ├── playtest.md           # /playtest — structured testing session
│   │   ├── ship-it.md            # /ship-it — publishing checklist
│   │   └── show-progress.md      # /show-progress — team progress board
│   ├── agents/                   # Agent definitions (markdown)
│   │   ├── game-designer.md
│   │   ├── luau-tutor.md
│   │   ├── world-builder.md
│   │   ├── bug-squasher.md
│   │   └── play-tester.md
│   ├── skills/                   # Game pattern skills
│   │   ├── roblox-obby-builder/SKILL.md
│   │   ├── roblox-tycoon-system/SKILL.md
│   │   ├── roblox-battle-system/SKILL.md
│   │   ├── roblox-ui-design/SKILL.md
│   │   ├── roblox-data-saving/SKILL.md
│   │   ├── roblox-game-loop/SKILL.md
│   │   ├── roblox-mobile-optimization/SKILL.md
│   │   └── roblox-publishing/SKILL.md
│   ├── hooks/
│   │   └── hooks.json            # Shell-based safety hooks
│   └── docs/                     # Reference documentation
│       ├── luau-cheatsheet.md
│       ├── roblox-services.md
│       ├── ipad-testing.md
│       └── books/                # Placeholder for O'Reilly book conversions
│
├── package.json
├── tsconfig.json
└── BUILD-PLAN.md                 # Build plan documentation
```

## Four-Layer Cognitive Hierarchy

| Layer | Name | Scope | Agent |
|-------|------|-------|-------|
| 4 | Team Up! | Multi-system features | Coordinator |
| 3 | Think It Through! | Balance, fun, fairness | game-designer, play-tester |
| 2 | Design It! | Feature design, structure | game-designer, world-builder |
| 1 | Build It! | Scripting, building, wiring | luau-tutor, bug-squasher, world-builder |

## Requirements

- Node.js 18+
- npm
- Claude Code CLI (for standalone plugin mode)
- Anthropic API key (for SDK wrapper mode)
- Roblox Studio (on development laptops)
- Roblox app (on iPads for playtesting)
