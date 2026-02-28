---
name: Roblox Game Loop
description: Use when building round systems, lobbies, intermissions, win conditions, team assignment, or any time-based game flow.
---

# Roblox Game Loop

## Overview
A game loop is the cycle your game goes through: waiting for players → starting a round → playing → ending → repeat. Most competitive and minigame Roblox games use this pattern.

## Standard Flow
```
Lobby (waiting) → Countdown → Teleport to Arena → Round (timed) → Check Winner → Show Results → Back to Lobby
```

---

## Full Round System

Put this **Script in ServerScriptService**.

```lua
-- Round System (Script in ServerScriptService)
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Settings
local LOBBY_TIME = 15    -- Seconds waiting in lobby
local ROUND_TIME = 120   -- Seconds per round
local RESULTS_TIME = 5   -- Seconds to show results
local MIN_PLAYERS = 2    -- Minimum to start

-- Create a status value that the UI can display
local status = Instance.new("StringValue")
status.Name = "GameStatus"
status.Value = "Waiting..."
status.Parent = ReplicatedStorage

-- Spawn locations
local lobbySpawn = workspace:WaitForChild("LobbySpawn")
local arenaSpawns = workspace:WaitForChild("ArenaSpawns"):GetChildren()

-- Teleport a player to a position
local function teleportPlayer(player, spawnPart)
    local character = player.Character
    if character and character:FindFirstChild("HumanoidRootPart") then
        character.HumanoidRootPart.CFrame = spawnPart.CFrame + Vector3.new(0, 3, 0)
    end
end

-- Teleport all players to lobby
local function teleportToLobby()
    for _, player in pairs(Players:GetPlayers()) do
        teleportPlayer(player, lobbySpawn)
    end
end

-- Teleport all players to random arena spawns
local function teleportToArena()
    local players = Players:GetPlayers()
    for i, player in pairs(players) do
        local spawn = arenaSpawns[((i - 1) % #arenaSpawns) + 1]
        teleportPlayer(player, spawn)
    end
end

-- Main game loop
while true do
    -- === LOBBY PHASE ===
    teleportToLobby()
    status.Value = "Waiting for players..."

    -- Wait for minimum players
    repeat
        task.wait(1)
        status.Value = "Waiting for players... (" .. #Players:GetPlayers() .. "/" .. MIN_PLAYERS .. ")"
    until #Players:GetPlayers() >= MIN_PLAYERS

    -- === COUNTDOWN PHASE ===
    for i = LOBBY_TIME, 1, -1 do
        status.Value = "Round starts in " .. i .. "..."
        task.wait(1)
    end

    -- === ROUND PHASE ===
    teleportToArena()
    status.Value = "Round started! Fight!"

    -- Track who's alive
    local alivePlayers = {}
    for _, player in pairs(Players:GetPlayers()) do
        table.insert(alivePlayers, player)
    end

    -- Round timer
    for i = ROUND_TIME, 1, -1 do
        status.Value = "Time: " .. i .. "s | Players: " .. #alivePlayers
        task.wait(1)

        -- Update alive list (remove dead players)
        local stillAlive = {}
        for _, player in pairs(alivePlayers) do
            if player.Character and player.Character:FindFirstChild("Humanoid") then
                if player.Character.Humanoid.Health > 0 then
                    table.insert(stillAlive, player)
                end
            end
        end
        alivePlayers = stillAlive

        -- Check win condition: last player standing
        if #alivePlayers <= 1 then
            break
        end
    end

    -- === RESULTS PHASE ===
    if #alivePlayers == 1 then
        local winner = alivePlayers[1]
        status.Value = winner.Name .. " wins!"
    elseif #alivePlayers == 0 then
        status.Value = "Draw! Nobody survived!"
    else
        status.Value = "Time's up! It's a tie!"
    end

    task.wait(RESULTS_TIME)
end
```

---

## Status Display UI

Create a **ScreenGui in StarterGui** with a TextLabel. Add this **LocalScript in StarterPlayerScripts**.

```lua
-- Status Display (LocalScript in StarterPlayerScripts)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")
local player = Players.LocalPlayer

local statusValue = ReplicatedStorage:WaitForChild("GameStatus")
local gui = player.PlayerGui:WaitForChild("StatusGui")
local statusLabel = gui:WaitForChild("StatusLabel")

statusValue.Changed:Connect(function()
    statusLabel.Text = statusValue.Value
end)
statusLabel.Text = statusValue.Value
```

---

## Team Assignment

For team-based games, assign players to teams randomly.

```lua
-- Team Assignment (add to your round system)
local Teams = game:GetService("Teams")

-- Create teams (do this once, or in the Explorer)
local redTeam = Instance.new("Team")
redTeam.Name = "Red"
redTeam.TeamColor = BrickColor.new("Bright red")
redTeam.Parent = Teams

local blueTeam = Instance.new("Team")
blueTeam.Name = "Blue"
blueTeam.TeamColor = BrickColor.new("Bright blue")
blueTeam.Parent = Teams

-- Assign players to teams
local function assignTeams()
    local players = Players:GetPlayers()
    for i, player in pairs(players) do
        if i % 2 == 0 then
            player.Team = redTeam
        else
            player.Team = blueTeam
        end
    end
end
```

---

## Tips for Good Game Loops

1. **Short rounds** — Kids have short attention spans. 1-3 minutes per round is ideal.
2. **Fast lobby** — Don't make them wait too long. 10-15 seconds is plenty.
3. **Clear status** — Always show a countdown or status message so players know what's happening
4. **Celebrate winners** — Show the winner's name big, play a sound, give them a moment
5. **Quick restart** — Get back into the action fast
6. **Min 2 players** — Set MIN_PLAYERS to 1 for testing, but 2+ for the real game
