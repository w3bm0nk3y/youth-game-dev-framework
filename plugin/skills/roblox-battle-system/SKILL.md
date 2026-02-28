---
name: Roblox Battle System
description: Use when building combat mechanics, health systems, weapons, damage, respawning, or PvP/PvE gameplay.
---

# Roblox Battle System

## Overview
Battle systems let players fight enemies or each other. The key is making combat feel responsive and fair. Think Arsenal, Blox Fruits, or Bedwars.

## Core Components
1. **Health System** — Players have HP that decreases when damaged
2. **Weapons** — Tools that deal damage (swords, guns, abilities)
3. **Respawning** — What happens when you run out of HP
4. **Kill Feed / Leaderboard** — Tracking eliminations

---

## Sword Tool (Melee Weapon)

Create a **Tool** in ServerStorage. Add a **Part** named "Handle" inside it (required for tools). Then add this **Script** inside the Tool.

```lua
-- Sword Script (Script inside a Tool)
local tool = script.Parent
local handle = tool:WaitForChild("Handle")
local damage = 25
local cooldown = 0.5 -- Seconds between swings
local canSwing = true

tool.Activated:Connect(function()
    if not canSwing then return end
    canSwing = false

    -- Play swing animation (optional)
    -- Create a hitbox check
    local character = tool.Parent
    local humanoid = character and character:FindFirstChild("Humanoid")
    if not humanoid then canSwing = true return end

    -- Check for enemies in range
    local rootPart = character:FindFirstChild("HumanoidRootPart")
    if not rootPart then canSwing = true return end

    -- Find characters within range
    for _, other in pairs(workspace:GetChildren()) do
        if other:FindFirstChild("Humanoid") and other ~= character then
            local otherRoot = other:FindFirstChild("HumanoidRootPart")
            if otherRoot then
                local distance = (rootPart.Position - otherRoot.Position).Magnitude
                if distance <= 6 then -- 6 studs range
                    other.Humanoid:TakeDamage(damage)
                    print(character.Name .. " hit " .. other.Name .. " for " .. damage .. " damage!")
                end
            end
        end
    end

    -- Cooldown
    task.wait(cooldown)
    canSwing = true
end)
```

---

## Give Weapons on Spawn

Put this **Script in ServerScriptService**.

```lua
-- Give Weapons on Spawn (Script in ServerScriptService)
local Players = game:GetService("Players")
local ServerStorage = game:GetService("ServerStorage")

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        -- Wait for character to load
        character:WaitForChild("Humanoid")
        task.wait(0.5)

        -- Clone the sword from ServerStorage and give it to the player
        local sword = ServerStorage:FindFirstChild("Sword")
        if sword then
            local clone = sword:Clone()
            clone.Parent = player.Backpack
        end
    end)
end)
```

---

## Kill Tracking Leaderboard

```lua
-- Kill Tracking (Script in ServerScriptService)
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local kills = Instance.new("IntValue")
    kills.Name = "KOs"
    kills.Value = 0
    kills.Parent = leaderstats

    local deaths = Instance.new("IntValue")
    deaths.Name = "Deaths"
    deaths.Value = 0
    deaths.Parent = leaderstats

    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.Died:Connect(function()
            deaths.Value = deaths.Value + 1

            -- Find who killed them (creator tag)
            local creator = humanoid:FindFirstChild("creator")
            if creator and creator.Value then
                local killer = creator.Value
                local killerStats = killer:FindFirstChild("leaderstats")
                if killerStats then
                    local kos = killerStats:FindFirstChild("KOs")
                    if kos then
                        kos.Value = kos.Value + 1
                    end
                end
            end
        end)
    end)
end)
```

### Tag System for Kill Credit
When dealing damage, add a "creator" tag so the leaderboard knows who got the kill:

```lua
-- Add this to your weapon script when dealing damage:
local function tagHumanoid(humanoid, player)
    -- Remove old tag
    local oldTag = humanoid:FindFirstChild("creator")
    if oldTag then oldTag:Destroy() end

    -- Add new tag
    local tag = Instance.new("ObjectValue")
    tag.Name = "creator"
    tag.Value = player
    tag.Parent = humanoid

    -- Remove tag after 2 seconds (so kills are attributed correctly)
    game:GetService("Debris"):AddItem(tag, 2)
end
```

---

## Respawn Timer

```lua
-- Custom Respawn Timer (Script in ServerScriptService)
local Players = game:GetService("Players")
local RESPAWN_TIME = 3 -- Seconds before respawning

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.Died:Connect(function()
            task.wait(RESPAWN_TIME)
            player:LoadCharacter()
        end)
    end)
end)
```

---

## Tips for Fun Combat

1. **Keep damage balanced** — Kills should take 3-5 hits, not instant death
2. **Respawn fast** — Nobody likes waiting. 3-5 seconds max.
3. **Audio feedback** — Hit sounds, death sounds make combat feel good
4. **Visual feedback** — Flash the screen red when hit, show damage numbers
5. **Fair spawns** — Don't spawn players where they immediately get killed
6. **Test on iPad** — Make sure attack controls work with touch
