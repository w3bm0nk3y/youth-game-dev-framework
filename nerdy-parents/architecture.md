# Architecture Overview

The Youth Game Dev Framework is a Claude-powered AI mentoring system for kids building Roblox games. It runs in two modes — as a **Claude Code plugin** (Option A) or as a **Claude Agent SDK wrapper** (Option B) — but both share the same core design.

## System Overview

```mermaid
flowchart TB
    User["Kid at keyboard"]

    subgraph Framework
        direction TB
        Entry["index.ts — Entry Point"]
        SP["System Prompt\n(youth-friendly behavior rules)"]
        Agents["5 Subagents"]
        Hooks["4 Engagement Hooks"]
        MCP["3 MCP Tools"]
        Plugin["Plugin Layer\n(commands, skills, docs)"]
    end

    User -->|types a question| Entry
    Entry --> SP
    Entry --> Agents
    Entry --> Hooks
    Entry --> MCP
    Entry --> Plugin
    Entry -->|streamed response| User

    style User fill:#f9f,stroke:#333
    style Entry fill:#bbf,stroke:#333
```

In **Plugin mode** (Option A), the user runs `claude` directly and loads the `plugin/` folder. Claude Code handles routing, and the plugin provides agents, commands, skills, docs, and a shell-based safety hook.

In **SDK mode** (Option B), `src/index.ts` orchestrates everything: it builds a system prompt, registers agents and hooks, starts an MCP tool server, loads the plugin, and runs a conversation loop with session persistence.

## Agent Routing

When a kid asks a question, the system uses a four-layer cognitive hierarchy to route it to the right agent.

```mermaid
flowchart LR
    Q["User question"]

    subgraph Detection["Four-Layer Keyword Detection"]
        direction TB
        L1["Layer 1 — Build It!\n'how do I', 'code', 'script',\n'error', 'bug', 'doesn't work'"]
        L2["Layer 2 — Design It!\n'where should', 'what kind',\n'layout', 'how many', 'features'"]
        L3["Layer 3 — Think It Through!\n'fair', 'balanced', 'fun',\n'boring', 'too easy', 'too hard'"]
        L4["Layer 4 — Team Up!\nmultiple systems,\nteam coordination"]
    end

    LT["luau-tutor\n(Sonnet)"]
    WB["world-builder\n(Haiku)"]
    BS["bug-squasher\n(Sonnet)"]
    GD["game-designer\n(Sonnet)"]
    PT["play-tester\n(Haiku)"]

    Q --> Detection
    L1 -->|scripting| LT
    L1 -->|environment| WB
    L1 -->|errors| BS
    L2 --> GD
    L2 -->|environment| WB
    L3 --> GD
    L3 --> PT
    L4 -->|coordinates| GD

    style Q fill:#f9f,stroke:#333
```

## Hook Lifecycle

The SDK wrapper (Option B) uses four hook events to enhance the experience. Each hook fires at a specific point in the conversation lifecycle.

```mermaid
sequenceDiagram
    participant U as User
    participant S as SDK Wrapper
    participant C as Claude
    participant H as Hooks

    Note over S,H: SessionStart
    S->>H: sessionBriefing
    H-->>S: Set Day 1 or Day 2 tone

    U->>S: Types a message
    Note over S,H: UserPromptSubmit
    S->>H: frustrationDetector
    H-->>S: Inject encouragement if frustrated

    S->>C: Forward prompt
    C->>S: Wants to use a tool

    Note over S,H: PreToolUse
    S->>H: safetyGuardrails
    H-->>S: Allow or block the tool call

    C->>S: Tool finished

    Note over S,H: PostToolUse
    S->>H: achievementTracker
    H-->>S: Celebrate if milestone reached

    C->>U: Streamed response
```

## Agents

| Agent | Role | Model | Tools | Layers |
|-------|------|-------|-------|--------|
| **game-designer** | Brainstorming, mechanics, feature planning | Sonnet | Read, Glob, Grep, Write | 2–3 |
| **luau-tutor** | Teaching Luau scripting, writing code | Sonnet | Read, Write, Edit, Bash, Glob, Grep | 1 |
| **world-builder** | Environment design, terrain, lighting | Haiku | Read, Write, Glob | 1–2 |
| **bug-squasher** | Debugging and fixing errors | Sonnet | Read, Grep, Glob, Edit, Bash | 1 |
| **play-tester** | Game feel evaluation, playtesting guidance | Haiku | Read, Glob, Grep | 3 |

The orchestrator (main Claude instance) runs on **Sonnet** and delegates to subagents via the Task tool. Haiku is used for agents that don't need heavy reasoning (world-builder, play-tester), keeping latency low and cost down.

## MCP Tools

The SDK wrapper runs a custom MCP server (`roblox-dev-tools`) with three tools:

| Tool | What It Does |
|------|-------------|
| **check_luau_syntax** | Basic Luau syntax validation — catches mismatched brackets, unbalanced block keywords (`do`/`end`, `repeat`/`until`), common typos (`funtcion`, `===`), and JavaScript-isms (`!==`). Runs before the kid pastes code into Studio. |
| **update_progress** | Appends an entry to the team progress board (`progress-board.md`). Tracks who did what and what's next, formatted as a markdown table. |
| **roblox_snippet** | Generates common Roblox code patterns (touch-to-collect, click-to-buy, leaderboard, round-system, etc.) with explanations and customization tips. 10 patterns available. |

## Session Persistence

The framework supports multi-day hackathons with automatic session saving.

**Day 1:** When the kid quits (via `/quit` or Ctrl+D), the session state is written to `session-state.json` — including the Claude Agent SDK session ID, team name, game name, and the current day.

**Day 2:** Running with `--resume` loads the saved state, detects that it's a new calendar day, and sets the tone to "Ship It Day!" The SDK resumes the previous Claude conversation so the AI remembers everything from Day 1.

Day detection logic:
- No saved state → Day 1
- Saved state from a different calendar day → Day 2
- Saved state from today → same day (resume in progress)
