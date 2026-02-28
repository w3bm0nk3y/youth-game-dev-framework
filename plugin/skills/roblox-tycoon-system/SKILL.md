---
name: Roblox Tycoon System
description: Use when building a tycoon game, designing earn-buy-upgrade loops, creating droppers and collectors, or setting up player-owned bases.
---

# Roblox Tycoon System

## What's a Tycoon?
A tycoon game has a simple, addictive loop: earn money → buy things → earn money faster → buy better things. Think Lumber Tycoon, Restaurant Tycoon, or any "[Theme] Tycoon" game.

## Core Loop
```
Earn → Buy → Upgrade → Earn More → Buy More → ...
```

## Core Components

### 1. Dropper — Generates items/money over time
### 2. Collector — Collects items and converts to cash
### 3. Buttons — Players step on them to buy upgrades
### 4. Leaderboard — Shows player money

---

## Leaderboard + Cash Setup

Put this **Script in ServerScriptService**.

```lua
-- Tycoon Leaderboard (Script in ServerScriptService)
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Value = 0
    cash.Parent = leaderstats
end)
```

---

## Dropper Script

The dropper creates parts that fall down to the collector. Put this **Script inside the dropper part**.

```lua
-- Dropper (Script inside the dropper part)
local dropper = script.Parent
local dropInterval = 2      -- Seconds between drops
local dropValue = 1          -- Cash value of each drop
local dropColor = Color3.fromRGB(255, 215, 0) -- Gold color

while true do
    task.wait(dropInterval)

    -- Create a dropped item
    local item = Instance.new("Part")
    item.Name = "DroppedItem"
    item.Size = Vector3.new(1, 1, 1)
    item.Color = dropColor
    item.Material = Enum.Material.Neon
    item.Position = dropper.Position - Vector3.new(0, 2, 0)
    item.Anchored = false

    -- Store the cash value
    local value = Instance.new("IntValue")
    value.Name = "Value"
    value.Value = dropValue
    value.Parent = item

    -- Clean up after 15 seconds if not collected
    game:GetService("Debris"):AddItem(item, 15)

    item.Parent = workspace
end
```

---

## Collector Script

Collects dropped items and adds their value to the player's cash. Put this **Script inside the collector part**.

```lua
-- Collector (Script inside the collector part)
-- The collector should be at the bottom where items fall
local collector = script.Parent
local ownerName = "Player1" -- Change to the tycoon owner's name

collector.Touched:Connect(function(hit)
    if hit.Name == "DroppedItem" then
        local value = hit:FindFirstChild("Value")
        if not value then return end

        -- Find the tycoon owner
        local player = game.Players:FindFirstChild(ownerName)
        if player and player:FindFirstChild("leaderstats") then
            local cash = player.leaderstats:FindFirstChild("Cash")
            if cash then
                cash.Value = cash.Value + value.Value
            end
        end

        -- Remove the collected item
        hit:Destroy()
    end
end)
```

---

## Purchase Button

Players step on buttons to buy things. Put this **Script inside a button part**.

```lua
-- Purchase Button (Script inside the button part)
local button = script.Parent
local price = 50              -- Cost to buy
local itemToUnlock = "Wall_1" -- Name of the part to make visible
local purchased = false

-- Set up the button appearance
button.Color = Color3.fromRGB(0, 200, 0) -- Green = available

button.Touched:Connect(function(hit)
    if purchased then return end

    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if not player then return end

    local cash = player.leaderstats and player.leaderstats:FindFirstChild("Cash")
    if not cash then return end

    if cash.Value >= price then
        cash.Value = cash.Value - price
        purchased = true

        -- Unlock the item
        local item = workspace:FindFirstChild(itemToUnlock)
        if item then
            item.Transparency = 0
            item.CanCollide = true
        end

        -- Remove the button
        button:Destroy()
        print(player.Name .. " purchased " .. itemToUnlock .. "!")
    else
        print(player.Name .. " needs " .. (price - cash.Value) .. " more cash!")
    end
end)
```

---

## Tips for Fun Tycoons

1. **Start cheap** — First few purchases should cost 10-50 cash
2. **Visible progress** — Each purchase should change something the player can SEE
3. **Increasing rewards** — Upgraded droppers should earn more money faster
4. **Tiered unlocks** — Group purchases into tiers (Starter → Bronze → Silver → Gold)
5. **Give players something to do** — Don't make them just wait; add mini-games or quests
6. **Rebirth system** — Reset progress for a permanent multiplier (advanced!)

## Workspace Organization
```
Workspace/
├── Tycoon_1/
│   ├── Dropper
│   ├── Collector
│   ├── Buttons/
│   │   ├── Button_Wall1 (price: 50)
│   │   ├── Button_Dropper2 (price: 200)
│   │   └── Button_Upgrade1 (price: 500)
│   ├── Unlockables/
│   │   ├── Wall_1 (starts invisible)
│   │   ├── Dropper_2 (starts invisible)
│   │   └── Upgrade_1 (starts invisible)
│   └── Base (the platform)
```
