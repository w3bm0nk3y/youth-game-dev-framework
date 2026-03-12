/**
 * Fun, kid-friendly progress messages shown during agent processing.
 *
 * Instead of boring "Thinking..." text, young developers see
 * game-dev-themed messages that rotate without back-to-back repeats.
 */

// ─── Initial "thinking" messages (shown when a prompt is submitted) ──
export const THINKING_MESSAGES: readonly string[] = [
  "Powering up the game engine...",
  "Rolling a natural 20...",
  "Brewing some code magic...",
  "Loading the fun module...",
  "Spawning new ideas...",
  "Consulting the game design scrolls...",
  "Charging up the creativity beam...",
  "Booting up the idea factory...",
  "Cranking the brainstorm machine...",
  "Unlocking a new skill tree...",
  "Equipping the code sword...",
  "Mining for brilliant ideas...",
  "Crafting your next feature...",
  "Mixing potions of productivity...",
  "Summoning the code wizards...",
  "Warming up the pixel forge...",
  "Scanning the blueprint library...",
  "Activating turbo mode...",
  "Entering the dev dimension...",
  "Connecting to the idea cloud...",
  "Downloading inspiration...",
  "Generating awesome sauce...",
  "Calculating coolness levels...",
  "Assembling the dream team...",
];

// ─── "Still working" messages (shown every ~8s during long waits) ────
export const STILL_WORKING_MESSAGES: readonly string[] = [
  "The code elves are busy...",
  "Loading the next checkpoint...",
  "Respawning ideas...",
  "Still on it — almost there!",
  "Building something cool...",
  "Leveling up your project...",
  "Running through the obstacle course...",
  "Collecting more power-ups...",
  "Debugging the dragon...",
  "Polishing the pixels...",
  "Stacking more bricks...",
  "Feeding the hamsters that power the server...",
  "Painting the final details...",
  "Tuning the game physics...",
  "Planting more code trees...",
  "Reticulating splines...",
  "Compiling awesomeness...",
  "Wrangling some rogue scripts...",
  "Double-checking the math...",
  "Almost got it — hang tight!",
];

// ─── Friendly tool names for progress messages ──────────────────────
export const TOOL_FLAVOR: Record<string, string> = {
  Read: "Reading your game files",
  Write: "Writing new code",
  Edit: "Editing your code",
  Bash: "Running a command",
  Glob: "Searching for files",
  Grep: "Searching through code",
  Task: "Calling in a helper agent",
  WebSearch: "Looking something up online",
  WebFetch: "Grabbing info from the web",
};

// ─── Shuffle-bag message picker ─────────────────────────────────────

/**
 * Creates a picker that cycles through every message in a shuffled bag
 * before reshuffling — no back-to-back duplicates (Fisher-Yates shuffle
 * with boundary dedup: if the last item of the old bag equals the first
 * item of the new bag, swap it forward).
 */
export function createMessagePicker(messages: readonly string[]): () => string {
  let bag: string[] = [];
  let index = 0;
  let lastPicked: string | undefined;

  function refill(): void {
    bag = [...messages];
    // Fisher-Yates shuffle
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    // Boundary dedup: avoid repeating the last message from the previous bag
    if (lastPicked !== undefined && bag.length > 1 && bag[0] === lastPicked) {
      const swapIdx = 1 + Math.floor(Math.random() * (bag.length - 1));
      [bag[0], bag[swapIdx]] = [bag[swapIdx], bag[0]];
    }
    index = 0;
  }

  return (): string => {
    if (index >= bag.length) {
      refill();
    }
    const picked = bag[index++];
    lastPicked = picked;
    return picked;
  };
}
