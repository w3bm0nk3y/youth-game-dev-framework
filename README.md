# Youth Game Dev Framework

**Help your kid build a real Roblox game in a weekend.**

This is a parent-friendly framework that pairs your child with Claude, an AI coding mentor, to guide them through designing, building, and publishing their own Roblox game. Think of it as a weekend hackathon in a box — your kid brings the ideas, Claude helps them bring those ideas to life.

No prior coding experience needed. The framework uses simple language, game analogies, and step-by-step Roblox Studio navigation so your daughter or son can follow along even if they've never opened Studio before.

## What Your Kid Gets

- **5 AI mentors**, each specialized in a different part of game development:
  - **Game Designer** — Helps brainstorm ideas and plan what to build
  - **Luau Tutor** — Teaches Roblox's programming language, one concept at a time
  - **World Builder** — Guides them through building environments, terrain, and maps
  - **Bug Squasher** — Helps debug when something isn't working (and teaches them how to debug on their own)
  - **Play Tester** — Coaches them through testing their game and making it feel polished
- **Slash commands** to keep things moving: `/new-game`, `/playtest`, `/ship-it`, `/show-progress`
- **8 game pattern templates** — obby, tycoon, battle system, UI design, data saving, game loops, mobile optimization, and publishing
- **Built-in safety guardrails** — blocks dangerous terminal commands so your kid can experiment freely
- **Session saving** — Day 1 progress carries over to Day 2
- **Step-by-step Roblox Studio navigation** — every agent explains exactly where to click, what tab to open, and what panel to look at

## Windows 11 Setup Checklist

Follow these steps to get everything installed. You only need to do this once.

- [ ] **Install Node.js** — Go to [nodejs.org](https://nodejs.org/), download the LTS version, and run the installer. Accept all defaults. To verify, open a terminal and run `node --version` — you should see something like `v20.x.x` or higher.
- [ ] **Install Git** — Go to [git-scm.com](https://git-scm.com/download/win) and download the installer. Accept all defaults. To verify, run `git --version` in your terminal.
- [ ] **Install Roblox Studio** — Go to [create.roblox.com](https://create.roblox.com/), sign in (or create an account), and download Roblox Studio. Your kid will need a Roblox account too.
- [ ] **Get an Anthropic API key** — Go to [console.anthropic.com](https://console.anthropic.com/), create an account, and generate an API key. This is what powers the AI mentor. You'll need to add a payment method — usage is pay-as-you-go.
- [ ] **Set the API key** — In your terminal, run:
  ```bash
  setx ANTHROPIC_API_KEY "your-key-here"
  ```
  Then close and reopen your terminal so it takes effect.
- [ ] **Clone this repo** — In your terminal, run:
  ```bash
  git clone https://github.com/w3bm0nk3y/youth-game-dev-framework.git
  cd youth-game-dev-framework
  npm install
  ```
- [ ] **Optional: iPad for playtesting** — Install the Roblox app on an iPad so your kid can test their game on a real device.

That's it — you're ready to go. See the Quick Start section below.

## Quick Start

There are two ways to use this framework. Pick whichever fits your setup.

### Option A: Standalone Plugin (simpler)

Use this if you already have [Claude Code](https://claude.ai/code) installed. Just point it at the plugin folder and you're ready to go.

1. Clone this repo:
   ```bash
   git clone https://github.com/w3bm0nk3y/youth-game-dev-framework.git
   ```

2. In your game project directory, create or edit `.claude/settings.json`:
   ```json
   {
     "plugins": ["/path/to/youth-game-dev-framework/plugin"]
   }
   ```

3. Run Claude Code normally:
   ```bash
   claude
   ```

That's it — your kid now has access to all 5 agents, slash commands, game skills, and reference docs.

### Option B: SDK Wrapper (full experience)

This runs a dedicated hackathon program with extra features like achievements, frustration detection, and session persistence across days.

1. Clone and install:
   ```bash
   git clone https://github.com/w3bm0nk3y/youth-game-dev-framework.git
   cd youth-game-dev-framework
   npm install
   ```

2. Set your API key:
   ```bash
   export ANTHROPIC_API_KEY=your-key-here
   ```

3. Start a new session:
   ```bash
   npx tsx src/index.ts
   ```

4. On Day 2, pick up where you left off:
   ```bash
   npx tsx src/index.ts --resume
   ```

**SDK Wrapper extras** (on top of everything in the plugin):
- Achievement celebrations when your kid hits milestones
- Frustration detection that injects encouragement when they're stuck
- Safety hooks that block dangerous terminal commands
- Day 1/Day 2 session briefing
- Custom tools: Luau syntax checker, team progress board, code snippet generator

## What a Session Looks Like

Your kid starts the program and sees:

```
╔════════════════════════════════════════════════╗
║   Youth Game Dev Framework — Roblox Hackathon  ║
║   Day 1 — Let's Build Something Amazing!       ║
╚════════════════════════════════════════════════╝

  Commands: /new-game  /playtest  /ship-it  /show-progress
  Type /quit to save & exit (your progress saves automatically!)
```

From there, they just start talking. "I want to build an obby game!" and the AI takes it from there — asking what kind of obstacles they want, showing them how to add parts in Studio, writing the scripts, and helping them test it.

## How the AI Mentors Work

The framework uses a **four-layer approach** to match your kid's question to the right kind of help:

| Layer | Name | What it covers | Example |
|-------|------|---------------|---------|
| 1 | **Build It!** | Writing code, placing parts, wiring events | "How do I make the door open when a player touches it?" |
| 2 | **Design It!** | Feature planning, layout, game structure | "We need a lobby, three arenas, and a leaderboard" |
| 3 | **Think It Through!** | Game balance, fun, fairness | "Is it fun if one weapon is way more powerful?" |
| 4 | **Team Up!** | Multi-system features needing everything together | "Add a shop where players buy weapons that change their avatar" |

Your kid doesn't need to think about layers — the AI routes their question automatically.

## Game Patterns Included

These are ready-made templates your kid can use as starting points:

- **Obby Builder** — Obstacle course with checkpoints, kill bricks, and a timer
- **Tycoon System** — Earn money, buy upgrades, expand your base
- **Battle System** — Health, damage, knockback, respawning
- **UI Design** — Menus, HUD, buttons, and notifications
- **Data Saving** — Save player progress between sessions
- **Game Loop** — Round-based games with lobbies and intermissions
- **Mobile Optimization** — Make sure everything works on iPad
- **Publishing** — Step-by-step guide to publish on Roblox

## Tips for Parents

- **You don't need to know how to code.** The AI handles the technical side. Your job is to be excited about what your kid is building.
- **Let them drive.** Resist the urge to take the keyboard. The AI is patient and will guide them through mistakes.
- **Start small.** An obby (obstacle course) or a simple tycoon game are great first projects. Don't try to build Blox Fruits on day one.
- **Playtest on iPad.** If you have an iPad with Roblox installed, have your kid test their game on it. Seeing their creation on a real device is incredibly motivating.
- **It's okay to quit and come back.** Progress saves automatically. Use `/quit` when they're done for the day.

## Project Structure

```
youth-game-dev-framework/
├── src/                    # SDK Wrapper (Option B)
│   ├── index.ts            # Entry point
│   ├── agents/             # AI mentor definitions
│   ├── hooks/              # Achievement, safety, encouragement hooks
│   └── tools/              # Luau checker, progress board, snippets
│
├── plugin/                 # Standalone Plugin (Option A)
│   ├── CLAUDE.md           # Core instructions
│   ├── agents/             # Agent definitions (markdown)
│   ├── commands/           # Slash commands
│   ├── skills/             # Game pattern templates
│   └── docs/               # Reference documentation
│
└── game-project/           # Sample game code
```

## License

MIT — use it, modify it, share it. If your kid builds something cool, we'd love to hear about it.
