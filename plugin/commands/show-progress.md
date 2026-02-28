---
name: show-progress
description: Display the team progress board showing what everyone has accomplished.
---

# /show-progress — Team Progress Board

Read and display the team progress board from `progress-board.md`.

## If the file exists:
Display the contents in a friendly format. Highlight:
- Total number of accomplishments
- Most recent entries
- Encourage: "Look at all this progress! You're building something awesome."

## If the file doesn't exist:
Say: "No progress tracked yet! As you build your game, I'll track what you accomplish. Want to start building?"

## How progress gets tracked:
Progress is automatically tracked when using the SDK wrapper (via the `update_progress` MCP tool).
In standalone plugin mode, you can manually add entries:
- Ask "What did you just finish?" and "What are you working on next?"
- Append to progress-board.md in the format: `| time | name | what | next |`
