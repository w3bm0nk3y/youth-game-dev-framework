# iPad Testing Guide

## How to Test Your Game on iPad

### Step 1: Publish Your Game
1. In Roblox Studio: **File > Publish to Roblox**
2. Set the game to **Private** (you can change to Public later)
3. Make sure "Phone" and "Tablet" are enabled in **Game Settings > Access > Playable Devices**

### Step 2: Open on iPad
1. Open the **Roblox app** on your iPad
2. Search for your game by name, OR:
   - Go to your profile > Creations
   - Find your game there
3. Tap **Play**!

### Step 3: Test Everything
Use the checklist below to make sure your game works well on iPad.

---

## iPad Testing Checklist

### Loading
- [ ] Game loads in under 15 seconds
- [ ] No error messages on screen
- [ ] Player spawns in the correct location

### Controls
- [ ] Can move around using the virtual joystick
- [ ] Can look around by swiping
- [ ] Jump button works
- [ ] Can interact with ClickDetectors by tapping
- [ ] Custom buttons are easy to tap with thumbs
- [ ] No accidental inputs (buttons too close together)

### UI (User Interface)
- [ ] All text is readable (not too small)
- [ ] Buttons are big enough (at least 44x44 pixels)
- [ ] Nothing is hidden behind the Roblox top bar
- [ ] UI doesn't overlap with the joystick or jump button
- [ ] Colors have enough contrast to read easily
- [ ] Shop/menu screens work correctly

### Performance
- [ ] Game runs smoothly (no stuttering or freezing)
- [ ] FPS stays above 30 (use the FPS counter from mobile-optimization skill)
- [ ] No noticeable lag when actions happen
- [ ] Camera doesn't freak out in tight spaces

### Gameplay
- [ ] Core mechanic works the same as on desktop
- [ ] Can complete the main objective
- [ ] Can't get stuck in any spot
- [ ] Respawning works correctly
- [ ] Scoring/points/coins work correctly

### Sound (if applicable)
- [ ] Music plays
- [ ] Sound effects trigger at the right time
- [ ] Volume is comfortable (not too loud)

---

## Common iPad Issues & Fixes

### "Buttons are too small"
- Use `UDim2.new(0, 60, 0, 60)` minimum for touch buttons
- Better: use Scale sizing like `UDim2.new(0.1, 0, 0.08, 0)` so it adapts

### "UI is behind the top bar"
- Don't place UI at `Position = UDim2.new(0, 0, 0, 0)`
- Start at least 36 pixels from the top: `UDim2.new(0, 0, 0, 36)`
- Or use Roblox's `ScreenInsets` property on your ScreenGui

### "It's laggy"
- Check part count: View > Stats in Studio
- Reduce lighting effects (Bloom, Blur, SunRays)
- Don't create/destroy parts every frame
- Use `Debris:AddItem()` to clean up temporary parts

### "Touch controls feel wrong"
- Make sure Roblox's default controls aren't conflicting with your custom buttons
- Place custom buttons away from the joystick (bottom-left) and jump (bottom-right)
- Add a small cooldown to prevent double-taps

### "Text is blurry"
- Set `TextScaled = true` on TextLabels
- Use fonts like `GothamBold` or `SourceSansBold` — they're clearer at small sizes
- Don't use tiny font sizes — let TextScaled handle it

---

## Quick iPad Test Cycle

For fast iteration during the hackathon:

1. **Make a change** in Roblox Studio on your laptop
2. **Publish**: File > Publish to Roblox (Ctrl+Shift+P)
3. **On iPad**: Close the game (leave the experience), reopen it
4. **Test** the change
5. **Note** what needs fixing
6. **Repeat**

This takes about 30-60 seconds per cycle. Don't wait until the end to test — test early and test often!

## Pro Tip
Keep the Roblox Studio **Output window** open (View > Output) while someone tests on iPad. Server errors will show there even though the iPad player can't see them.
