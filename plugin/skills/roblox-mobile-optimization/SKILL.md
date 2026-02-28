---
name: Roblox Mobile Optimization
description: Use when optimizing for iPad, designing touch controls, fixing mobile UI, improving performance, or testing on mobile devices.
---

# Roblox Mobile Optimization

## Overview
At the hackathon, players will test on iPads. Mobile has different constraints than desktop: smaller screen, touch controls instead of mouse/keyboard, less processing power. Plan for mobile from the start!

## Touch Controls

### Default Roblox Touch Controls
Roblox automatically provides:
- **Virtual joystick** (bottom-left) for movement
- **Jump button** (bottom-right)
- **Touch to look around** (drag on screen)
- **Tap objects** with ClickDetectors

These work automatically — you don't need to code them!

### Custom Touch Buttons
For custom actions (attack, use item, open menu), make buttons BIG.

```lua
-- Create a mobile-friendly action button (LocalScript in StarterPlayerScripts)
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local gui = player.PlayerGui

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "MobileControls"
screenGui.Parent = gui

local actionButton = Instance.new("TextButton")
actionButton.Name = "ActionButton"
actionButton.Text = "Attack"
actionButton.Size = UDim2.new(0, 80, 0, 80)  -- 80x80 pixels (big for thumbs!)
actionButton.Position = UDim2.new(1, -100, 1, -200)  -- Bottom-right area
actionButton.AnchorPoint = Vector2.new(0.5, 0.5)
actionButton.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
actionButton.TextColor3 = Color3.fromRGB(255, 255, 255)
actionButton.TextScaled = true
actionButton.Font = Enum.Font.GothamBold

-- Make it round
local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0.5, 0)
corner.Parent = actionButton

actionButton.Parent = screenGui

-- Handle touch
actionButton.MouseButton1Click:Connect(function()
    -- Your action here (works for both touch AND mouse click)
    print("Action button pressed!")
end)
```

---

## UI Sizing for Mobile

### The Golden Rules
1. **Use Scale (not Offset) for sizing** — Scale adapts to screen size
2. **Minimum touch target: 44x44 pixels** — Apple's guideline, works for Roblox too
3. **Keep important UI away from edges** — The notch, status bar, and Roblox menu bar eat space
4. **Test with UDim2 Scale values** for responsive layouts

### Safe Area
```
┌──────────────────────────────┐
│  Roblox Top Bar (reserved)   │  ← Don't put UI here
├──────────────────────────────┤
│                              │
│       Safe Area              │
│    (put your UI here)        │
│                              │
│                              │
├──────────────────────────────┤
│ [Joystick]        [Jump Btn] │  ← Default controls area
└──────────────────────────────┘
```

### Responsive Frame Example
```lua
-- A frame that works on any screen size
local frame = Instance.new("Frame")
frame.Size = UDim2.new(0.8, 0, 0.6, 0)    -- 80% wide, 60% tall
frame.Position = UDim2.new(0.5, 0, 0.5, 0) -- Centered
frame.AnchorPoint = Vector2.new(0.5, 0.5)   -- Pivot from center
```

---

## Performance Tips

Mobile devices have less processing power. Keep things smooth!

### Part Count
- **Under 10,000 parts** is ideal for mobile
- Check: View > Stats > Primitives in Studio
- Use **MeshParts** instead of lots of small Parts for detailed objects
- **Union** multiple parts together when they don't need to move separately

### Scripts
- Avoid running lots of code every frame with `RunService.Heartbeat`
- Use `task.wait()` with reasonable intervals (0.1 seconds minimum)
- Don't create/destroy parts every frame

### Lighting
- Avoid too many PointLights and SpotLights (expensive on mobile)
- ShadowMap lighting mode is heavier than Voxel mode
- Reduce Bloom and other PostProcessing effects

### Terrain
- Large terrain is usually fine — it's optimized by Roblox
- But avoid painting too many different materials in a small area

### Testing Performance
```lua
-- FPS counter (LocalScript in StarterPlayerScripts)
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local gui = player.PlayerGui

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "FPSCounter"
screenGui.Parent = gui

local fpsLabel = Instance.new("TextLabel")
fpsLabel.Size = UDim2.new(0, 80, 0, 30)
fpsLabel.Position = UDim2.new(0, 5, 0, 5)
fpsLabel.BackgroundTransparency = 0.5
fpsLabel.TextColor3 = Color3.new(1, 1, 1)
fpsLabel.TextScaled = true
fpsLabel.Parent = screenGui

local frameCount = 0
local lastTime = tick()

RunService.Heartbeat:Connect(function()
    frameCount = frameCount + 1
    local now = tick()
    if now - lastTime >= 1 then
        fpsLabel.Text = "FPS: " .. frameCount
        frameCount = 0
        lastTime = now
    end
end)
```

---

## Device Detection

Check if the player is on mobile to show/hide controls.

```lua
-- Detect mobile (LocalScript)
local UserInputService = game:GetService("UserInputService")
local isMobile = UserInputService.TouchEnabled and not UserInputService.KeyboardEnabled

if isMobile then
    -- Show mobile-specific controls
    print("Mobile player detected!")
else
    -- Show desktop controls
    print("Desktop player detected!")
end
```

---

## iPad Testing Checklist

- [ ] Game loads in under 10 seconds
- [ ] FPS stays above 30 (use FPS counter above)
- [ ] All buttons are tappable with thumbs
- [ ] Text is readable without squinting
- [ ] UI doesn't overlap with Roblox's top bar
- [ ] Touch controls feel responsive
- [ ] No lag when lots of things happen at once
- [ ] Works in both portrait and landscape (or lock to landscape)
