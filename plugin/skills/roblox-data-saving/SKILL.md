---
name: Roblox Data Saving
description: Use when saving player data between sessions, implementing DataStoreService, or handling player progress persistence.
---

# Roblox Data Saving

## Overview
DataStoreService is like the game's long-term memory — it saves player data (coins, level, inventory) so it's still there when they come back tomorrow. Without it, everything resets when they leave!

## Important Rules
1. **Server only** — DataStoreService ONLY works in Scripts (server), NOT LocalScripts
2. **Wrap in pcall** — DataStore calls can fail (Roblox servers have bad days too). Always use pcall to handle errors.
3. **Don't save too often** — Roblox limits how frequently you can save (6 seconds between writes per key)
4. **Test in Studio** — Enable "Enable Studio Access to API Services" in Game Settings > Security

---

## Basic Save/Load System

Put this **Script in ServerScriptService**.

```lua
-- Data Save System (Script in ServerScriptService)
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local playerStore = DataStoreService:GetDataStore("PlayerData_v1")

-- What data to save for each player
local function getDefaultData()
    return {
        Coins = 0,
        Level = 1,
        Stage = 1,
    }
end

-- Load player data when they join
Players.PlayerAdded:Connect(function(player)
    local data = getDefaultData()

    -- Try to load saved data
    local success, savedData = pcall(function()
        return playerStore:GetAsync("Player_" .. player.UserId)
    end)

    if success and savedData then
        -- Use saved data (merge with defaults for new fields)
        for key, value in pairs(savedData) do
            data[key] = value
        end
        print(player.Name .. "'s data loaded!")
    else
        print(player.Name .. " is a new player! Using defaults.")
    end

    -- Create leaderstats from loaded data
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    for statName, statValue in pairs(data) do
        local stat = Instance.new("IntValue")
        stat.Name = statName
        stat.Value = statValue
        stat.Parent = leaderstats
    end
end)

-- Save player data when they leave
local function savePlayerData(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local data = {}
    for _, stat in pairs(leaderstats:GetChildren()) do
        if stat:IsA("IntValue") or stat:IsA("NumberValue") then
            data[stat.Name] = stat.Value
        end
    end

    local success, err = pcall(function()
        playerStore:SetAsync("Player_" .. player.UserId, data)
    end)

    if success then
        print(player.Name .. "'s data saved!")
    else
        warn("Failed to save " .. player.Name .. "'s data: " .. tostring(err))
    end
end

Players.PlayerRemoving:Connect(savePlayerData)

-- Also save when the server shuts down
game:BindToClose(function()
    for _, player in pairs(Players:GetPlayers()) do
        savePlayerData(player)
    end
end)
```

---

## Auto-Save Timer

Add this to the bottom of your data save script for periodic saving.

```lua
-- Auto-save every 60 seconds (add to end of data save script)
task.spawn(function()
    while true do
        task.wait(60)
        for _, player in pairs(Players:GetPlayers()) do
            task.spawn(function()
                savePlayerData(player)
            end)
        end
    end
end)
```

---

## Testing Tips

1. **Enable API access**: Game Settings > Security > Enable Studio Access to API Services
2. **Use a version suffix** like `PlayerData_v1` — if you change the data format, bump to `v2` so old data doesn't cause errors
3. **Test saving**: Add coins, leave the game, rejoin — coins should be there
4. **Don't panic if it fails in Studio** — DataStores can be unreliable in test mode. It'll work better in the published game.

## Common Mistakes
- Using DataStore in a LocalScript (only works on server!)
- Forgetting pcall (one error crashes the whole save system)
- Saving too often (Roblox will throttle you)
- Not calling `BindToClose` (data lost when server shuts down)
