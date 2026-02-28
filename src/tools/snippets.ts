/**
 * Luau code snippet templates for common Roblox game patterns.
 * Each snippet includes: what it does, where to put it, the code, and how to customize.
 */

export type SnippetPattern =
  | "touch-to-collect"
  | "click-to-buy"
  | "leaderboard"
  | "round-system"
  | "teleporter"
  | "damage-on-touch"
  | "heal-zone"
  | "speed-boost"
  | "inventory-system"
  | "remote-event";

export interface Snippet {
  name: string;
  description: string;
  placement: string;
  code: string;
  customization: string;
}

export const snippets: Record<SnippetPattern, Snippet> = {
  "touch-to-collect": {
    name: "Touch to Collect",
    description: "Makes a part disappear when a player touches it and gives them points.",
    placement: "Put a Script inside the part you want players to collect.",
    code: `-- Touch to Collect Script
-- Put this Script inside the part you want to collect

local part = script.Parent

-- What happens when something touches the part
part.Touched:Connect(function(hit)
    -- Check if a player touched it (not just any part)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        -- Give the player a point on the leaderboard
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats then
            local coins = leaderstats:FindFirstChild("Coins")
            if coins then
                coins.Value = coins.Value + 1
            end
        end
        -- Make the part disappear
        part:Destroy()
    end
end)`,
    customization: `To customize:
- Change "Coins" to whatever your currency is called
- Change +1 to give more points
- Replace part:Destroy() with part.Transparency = 1 to hide instead of delete
- Add a sound: Instance.new("Sound", part).SoundId = "rbxassetid://YOUR_ID"`,
  },

  "click-to-buy": {
    name: "Click to Buy",
    description: "Makes a part that players can click to buy something with their coins.",
    placement: "Put a Script in ServerScriptService. Add a ClickDetector inside the shop part.",
    code: `-- Click to Buy Script
-- Put this Script in ServerScriptService
-- Add a ClickDetector inside your shop part

local shopPart = workspace:WaitForChild("ShopPart") -- Change this name!
local clickDetector = shopPart:WaitForChild("ClickDetector")
local price = 10 -- How many coins it costs

clickDetector.MouseClick:Connect(function(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local coins = leaderstats:FindFirstChild("Coins")
    if not coins then return end

    -- Check if they have enough coins
    if coins.Value >= price then
        coins.Value = coins.Value - price
        print(player.Name .. " bought the item!")
        -- Add your reward here:
        -- Example: Give them a tool, open a door, etc.
    else
        print(player.Name .. " doesn't have enough coins!")
    end
end)`,
    customization: `To customize:
- Change "ShopPart" to the name of your shop part in Workspace
- Change price = 10 to whatever cost you want
- Add your reward code where the comment says
- Add a BillboardGui above the part to show the price`,
  },

  leaderboard: {
    name: "Leaderboard",
    description: "Creates a leaderboard that shows when players join. Required for most coin/point systems.",
    placement: "Put a Script in ServerScriptService.",
    code: `-- Leaderboard Script
-- Put this Script in ServerScriptService
-- This creates the leaderboard that shows player stats

game.Players.PlayerAdded:Connect(function(player)
    -- Create the leaderstats folder (this name is special!)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats" -- Must be exactly this name!
    leaderstats.Parent = player

    -- Create a Coins stat
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0 -- Starting coins
    coins.Parent = leaderstats

    -- Create a Level stat
    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = 1 -- Starting level
    level.Parent = leaderstats

    print(player.Name .. " joined! Leaderboard created.")
end)`,
    customization: `To customize:
- Add more stats by copying the IntValue block
- Change starting values (coins.Value = 100 for starting coins)
- Use StringValue instead of IntValue for text stats
- The folder MUST be named "leaderstats" (lowercase!) for Roblox to show it`,
  },

  "round-system": {
    name: "Round System",
    description: "A basic game round system with lobby, countdown, gameplay, and results.",
    placement: "Put a Script in ServerScriptService.",
    code: `-- Round System Script
-- Put this Script in ServerScriptService

local LOBBY_TIME = 10     -- Seconds to wait in lobby
local ROUND_TIME = 60     -- Seconds per round
local MIN_PLAYERS = 1     -- Minimum players to start

-- Create a value to track round status
local status = Instance.new("StringValue")
status.Name = "GameStatus"
status.Parent = game.ReplicatedStorage

while true do
    -- LOBBY PHASE
    status.Value = "Waiting for players..."
    repeat
        task.wait(1)
    until #game.Players:GetPlayers() >= MIN_PLAYERS

    -- COUNTDOWN PHASE
    for i = LOBBY_TIME, 1, -1 do
        status.Value = "Round starts in " .. i .. " seconds!"
        task.wait(1)
    end

    -- ROUND PHASE
    status.Value = "Round in progress!"
    -- Teleport players to the arena here if needed

    for i = ROUND_TIME, 1, -1 do
        status.Value = "Time left: " .. i .. "s"
        task.wait(1)
    end

    -- RESULTS PHASE
    status.Value = "Round over!"
    task.wait(5)
end`,
    customization: `To customize:
- Change LOBBY_TIME, ROUND_TIME, and MIN_PLAYERS
- Add teleporting: player.Character:SetPrimaryPartCFrame(CFrame.new(x, y, z))
- Show status on screen with a TextLabel bound to GameStatus.Value
- Add win condition checking during the round phase`,
  },

  teleporter: {
    name: "Teleporter",
    description: "Teleports a player from one part to another when they touch it.",
    placement: "Put a Script inside the teleporter part.",
    code: `-- Teleporter Script
-- Put this Script inside the part that teleports players

local teleporter = script.Parent
local destination = workspace:WaitForChild("TeleportDestination") -- Change this!
local cooldown = {} -- Prevents teleporting too fast

teleporter.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if not player then return end
    if cooldown[player.UserId] then return end

    -- Set cooldown so they don't teleport repeatedly
    cooldown[player.UserId] = true

    -- Teleport the player
    local character = player.Character
    if character and character:FindFirstChild("HumanoidRootPart") then
        character.HumanoidRootPart.CFrame = destination.CFrame + Vector3.new(0, 3, 0)
    end

    -- Remove cooldown after 2 seconds
    task.delay(2, function()
        cooldown[player.UserId] = nil
    end)
end)`,
    customization: `To customize:
- Change "TeleportDestination" to the name of your destination part
- Change Vector3.new(0, 3, 0) to adjust height offset (so they don't land inside the part)
- Add particle effects: Instance.new("ParticleEmitter", teleporter)
- Change cooldown time (task.delay 2 seconds)`,
  },

  "damage-on-touch": {
    name: "Damage on Touch",
    description: "Hurts players when they touch a part (like lava or spikes).",
    placement: "Put a Script inside the dangerous part.",
    code: `-- Damage on Touch Script
-- Put this Script inside a danger part (lava, spikes, etc.)

local dangerPart = script.Parent
local damage = 25 -- How much health to remove
local cooldown = {} -- Prevents damage every frame

dangerPart.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character and character:FindFirstChild("Humanoid")
    if not humanoid then return end

    local player = game.Players:GetPlayerFromCharacter(character)
    if not player then return end
    if cooldown[player.UserId] then return end

    -- Set cooldown
    cooldown[player.UserId] = true

    -- Deal damage
    humanoid:TakeDamage(damage)
    print(player.Name .. " took " .. damage .. " damage!")

    -- Remove cooldown after 1 second
    task.delay(1, function()
        cooldown[player.UserId] = nil
    end)
end)`,
    customization: `To customize:
- Change damage = 25 to deal more or less damage
- Set damage = 100 for instant kill
- Use humanoid.Health = 0 for guaranteed kill (ignores ForceField)
- Change the cooldown time for faster/slower damage
- Make the part red and add a PointLight for a lava look`,
  },

  "heal-zone": {
    name: "Heal Zone",
    description: "Slowly heals players while they stand in an area.",
    placement: "Put a Script inside a transparent part that covers the healing area.",
    code: `-- Heal Zone Script
-- Put this Script inside a part that covers the healing area
-- Make the part semi-transparent so players can see it

local healZone = script.Parent
local healAmount = 5 -- Health restored per tick
local healInterval = 0.5 -- Seconds between heals
local playersInZone = {}

healZone.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character and character:FindFirstChild("Humanoid")
    local player = humanoid and game.Players:GetPlayerFromCharacter(character)
    if player and not playersInZone[player.UserId] then
        playersInZone[player.UserId] = true
    end
end)

healZone.TouchEnded:Connect(function(hit)
    local character = hit.Parent
    local player = game.Players:GetPlayerFromCharacter(character)
    if player then
        playersInZone[player.UserId] = nil
    end
end)

-- Healing loop
while true do
    task.wait(healInterval)
    for userId, _ in pairs(playersInZone) do
        local player = game.Players:GetPlayerByUserId(userId)
        if player and player.Character then
            local humanoid = player.Character:FindFirstChild("Humanoid")
            if humanoid and humanoid.Health < humanoid.MaxHealth then
                humanoid.Health = math.min(humanoid.Health + healAmount, humanoid.MaxHealth)
            end
        end
    end
end`,
    customization: `To customize:
- Change healAmount for faster/slower healing
- Change healInterval (lower = faster healing ticks)
- Make the part green and semi-transparent (Transparency = 0.5)
- Add a green ParticleEmitter for a visual effect
- Add a sound that plays while healing`,
  },

  "speed-boost": {
    name: "Speed Boost",
    description: "Temporarily makes a player run faster when they touch a part.",
    placement: "Put a Script inside the speed boost part.",
    code: `-- Speed Boost Script
-- Put this Script inside the boost part

local boostPart = script.Parent
local speedMultiplier = 2 -- How much faster (2 = double speed)
local duration = 5 -- How many seconds the boost lasts
local defaultSpeed = 16 -- Roblox default walk speed
local cooldown = {}

boostPart.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character and character:FindFirstChild("Humanoid")
    local player = humanoid and game.Players:GetPlayerFromCharacter(character)
    if not player then return end
    if cooldown[player.UserId] then return end

    -- Set cooldown
    cooldown[player.UserId] = true

    -- Apply speed boost
    humanoid.WalkSpeed = defaultSpeed * speedMultiplier
    print(player.Name .. " got a speed boost!")

    -- Remove boost after duration
    task.delay(duration, function()
        if humanoid and humanoid.Parent then
            humanoid.WalkSpeed = defaultSpeed
        end
        cooldown[player.UserId] = nil
    end)
end)`,
    customization: `To customize:
- Change speedMultiplier (2 = double, 3 = triple)
- Change duration for longer/shorter boost
- Add a trail effect to the character during boost
- Make the part yellow/orange with a sparkle effect
- Play a whoosh sound when activated`,
  },

  "inventory-system": {
    name: "Inventory System",
    description: "A basic inventory using a Folder in the player to store items.",
    placement: "Put a Script in ServerScriptService for the server side. Put a LocalScript in StarterPlayerScripts for the client UI (optional).",
    code: `-- Inventory System (Server)
-- Put this Script in ServerScriptService

local Players = game.Players
local ReplicatedStorage = game.ReplicatedStorage

-- Create a RemoteEvent for client-server communication
local addItemEvent = Instance.new("RemoteEvent")
addItemEvent.Name = "AddItem"
addItemEvent.Parent = ReplicatedStorage

-- Set up inventory when player joins
Players.PlayerAdded:Connect(function(player)
    local inventory = Instance.new("Folder")
    inventory.Name = "Inventory"
    inventory.Parent = player
    print(player.Name .. "'s inventory created!")
end)

-- Function to add an item to a player's inventory
local function addItem(player: Player, itemName: string)
    local inventory = player:FindFirstChild("Inventory")
    if not inventory then return false end

    -- Check if they already have this item
    if inventory:FindFirstChild(itemName) then
        -- Increase quantity
        local item = inventory:FindFirstChild(itemName)
        if item:IsA("IntValue") then
            item.Value = item.Value + 1
        end
    else
        -- Add new item
        local item = Instance.new("IntValue")
        item.Name = itemName
        item.Value = 1
        item.Parent = inventory
    end

    print(player.Name .. " received: " .. itemName)
    return true
end

-- Listen for add item requests from the server
-- (Call this from other server scripts)
_G.AddItemToPlayer = addItem`,
    customization: `To customize:
- Add more item properties (use a Folder per item instead of IntValue)
- Connect to DataStoreService to save inventory between sessions
- Add a max inventory size check
- Create a RemoteFunction so clients can request their inventory
- Add item rarity, descriptions, or icons as StringValues inside each item`,
  },

  "remote-event": {
    name: "Remote Event",
    description: "Sets up client-server communication (like walkie-talkies between the player's screen and the game server).",
    placement: "Put the Server Script in ServerScriptService. Put the LocalScript in StarterPlayerScripts.",
    code: `-- REMOTE EVENT EXAMPLE
-- Think of this like walkie-talkies between the player and the server

-- ==================================
-- SERVER SCRIPT (ServerScriptService)
-- ==================================
-- This runs on the server (the "referee")

local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Create the walkie-talkie channel
local myEvent = Instance.new("RemoteEvent")
myEvent.Name = "MyGameEvent"
myEvent.Parent = ReplicatedStorage

-- Listen for messages FROM players
myEvent.OnServerEvent:Connect(function(player, action, data)
    print(player.Name .. " sent: " .. action)

    if action == "RequestCoins" then
        -- Server validates the request (referee checks the play!)
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats and leaderstats:FindFirstChild("Coins") then
            leaderstats.Coins.Value = leaderstats.Coins.Value + 10
            -- Send confirmation back to the player
            myEvent:FireClient(player, "CoinsUpdated", leaderstats.Coins.Value)
        end
    end
end)

-- ==================================
-- LOCAL SCRIPT (StarterPlayerScripts)
-- ==================================
-- This runs on the player's device

--[[
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local myEvent = ReplicatedStorage:WaitForChild("MyGameEvent")

-- Send a message TO the server
myEvent:FireServer("RequestCoins")

-- Listen for messages FROM the server
myEvent.OnClientEvent:Connect(function(action, data)
    if action == "CoinsUpdated" then
        print("My coins are now: " .. data)
    end
end)
--]]`,
    customization: `To customize:
- Change "MyGameEvent" to a descriptive name for your event
- Add more action types in the if/elseif chain
- IMPORTANT: Always validate on the server! Never trust the client
- The client script is commented out — copy it to a separate LocalScript
- You can send tables as data: myEvent:FireServer("Buy", {item = "Sword", price = 50})`,
  },
};
