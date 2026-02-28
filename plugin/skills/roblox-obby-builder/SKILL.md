---
name: Roblox Obby Builder
description: Use when building an obby (obstacle course) game, designing checkpoints, creating obstacles, or setting difficulty curves for platforming challenges.
---

# Roblox Obby Builder

## What's an Obby?
An obby (obstacle course) is one of the most popular Roblox game types. Players jump, climb, and dodge through a series of obstacles to reach the end. Think Tower of Hell, Mega Easy Obby, or Escape Room.

## Core Components

### 1. Stages
Groups of obstacles between checkpoints. Each stage should have a theme or new mechanic.

### 2. Checkpoints (SpawnLocations)
Save the player's progress so they don't restart from the beginning when they fall.

### 3. Kill Bricks
Parts that reset the player to their last checkpoint.

### 4. Moving Obstacles
Parts that move, rotate, appear/disappear, or otherwise challenge the player.

---

## Checkpoint System

Put this **Script in ServerScriptService**. It tracks each player's current stage.

```lua
-- Checkpoint System (Server Script in ServerScriptService)
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    -- Create leaderstats for stage tracking
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local stage = Instance.new("IntValue")
    stage.Name = "Stage"
    stage.Value = 1
    stage.Parent = leaderstats

    -- When the player's character loads, move them to their checkpoint
    player.CharacterAdded:Connect(function(character)
        local checkpoint = workspace.Checkpoints:FindFirstChild("Checkpoint_" .. stage.Value)
        if checkpoint then
            -- Wait for the character to fully load
            local rootPart = character:WaitForChild("HumanoidRootPart")
            task.wait(0.1)
            rootPart.CFrame = checkpoint.CFrame + Vector3.new(0, 3, 0)
        end
    end)
end)
```

### Checkpoint Touch Script
Put this **Script inside each checkpoint part**.

```lua
-- Checkpoint Touch Script (inside each checkpoint part)
-- Name checkpoints: Checkpoint_1, Checkpoint_2, etc.
local checkpoint = script.Parent
local stageNumber = tonumber(checkpoint.Name:match("%d+")) -- Gets the number from the name

checkpoint.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if not player then return end

    local stage = player.leaderstats and player.leaderstats:FindFirstChild("Stage")
    if stage and stageNumber and stageNumber > stage.Value then
        stage.Value = stageNumber
        print(player.Name .. " reached stage " .. stageNumber .. "!")
    end
end)
```

---

## Kill Brick Script

Put this **Script inside any kill brick** (lava, spikes, void triggers).

```lua
-- Kill Brick (Script inside the dangerous part)
local killPart = script.Parent

killPart.Touched:Connect(function(hit)
    local humanoid = hit.Parent and hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0 -- Respawns at last checkpoint
    end
end)
```

---

## Moving Platform

```lua
-- Moving Platform (Script inside the part)
local platform = script.Parent
local startPos = platform.Position
local endPos = startPos + Vector3.new(20, 0, 0) -- Moves 20 studs to the right
local speed = 3 -- Seconds for one direction

while true do
    -- Move to end position
    local tween = game:GetService("TweenService"):Create(
        platform,
        TweenInfo.new(speed, Enum.EasingStyle.Linear),
        {Position = endPos}
    )
    tween:Play()
    tween.Completed:Wait()

    -- Move back to start
    local tweenBack = game:GetService("TweenService"):Create(
        platform,
        TweenInfo.new(speed, Enum.EasingStyle.Linear),
        {Position = startPos}
    )
    tweenBack:Play()
    tweenBack.Completed:Wait()
end
```

---

## Disappearing Platform

```lua
-- Disappearing Platform (Script inside the part)
local platform = script.Parent
local visibleTime = 2   -- Seconds visible
local hiddenTime = 1.5  -- Seconds hidden

while true do
    -- Visible
    platform.Transparency = 0
    platform.CanCollide = true
    task.wait(visibleTime)

    -- Fade out warning (optional)
    platform.Transparency = 0.5
    task.wait(0.3)

    -- Hidden
    platform.Transparency = 1
    platform.CanCollide = false
    task.wait(hiddenTime)
end
```

---

## Tips for Fun Obbys

1. **Start EASY** — First 3 stages should be completable by everyone
2. **Gradually increase difficulty** — Don't make stage 4 impossible
3. **Add variety** — Don't repeat the same obstacle type 5 times in a row
4. **Use color coding**:
   - Green/blue = safe platforms
   - Red = danger/kill bricks
   - Yellow = moving or timed platforms
   - Purple/neon = special (speed boost, teleporter)
5. **Playtest every stage on iPad** — touch controls make jumping harder
6. **Add a celebration at the end!** — Confetti, a crown, or a special area

## Workspace Organization
```
Workspace/
├── Checkpoints/
│   ├── Checkpoint_1 (SpawnLocation)
│   ├── Checkpoint_2
│   └── Checkpoint_3
├── Stage_1/
│   ├── Platform_1
│   ├── KillBrick_1
│   └── MovingPlatform_1
├── Stage_2/
│   └── ...
└── Stage_3/
    └── ...
```
