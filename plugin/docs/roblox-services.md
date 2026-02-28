# Roblox Services Explained

Services are like departments in a company — each one handles a specific job. You access them with `game:GetService("ServiceName")`.

## The Most Important Services

### game.Players
**What it does:** Manages all the players in your game.

```lua
local Players = game:GetService("Players")

-- When a player joins
Players.PlayerAdded:Connect(function(player)
    print(player.Name .. " joined!")
end)

-- When a player leaves
Players.PlayerRemoving:Connect(function(player)
    print(player.Name .. " left!")
end)

-- Get all current players
local allPlayers = Players:GetPlayers()

-- Get a specific player
local player = Players:FindFirstChild("PlayerName")

-- In a LocalScript, get the current player
local me = Players.LocalPlayer  -- Only works in LocalScripts!
```

### game.Workspace
**What it does:** The 3D world. Everything you can see and walk on is in Workspace.

```lua
-- Find a part in the world
local door = workspace:FindFirstChild("Door")
local door = workspace:WaitForChild("Door") -- Safer: waits until it exists

-- Move a part
door.Position = Vector3.new(10, 5, 0)

-- Make a new part
local part = Instance.new("Part")
part.Size = Vector3.new(4, 1, 4)
part.Position = Vector3.new(0, 10, 0)
part.Anchored = true
part.Parent = workspace  -- Must set Parent to make it appear!
```

### game.ReplicatedStorage
**What it does:** Shared storage that BOTH the server and client can see. Put RemoteEvents, shared models, and ModuleScripts here.

Think of it like a **shared locker** — both teachers (server) and students (clients) can open it.

```lua
local RS = game:GetService("ReplicatedStorage")

-- Store a RemoteEvent here for client-server communication
local event = RS:WaitForChild("MyRemoteEvent")
```

### game.ServerStorage
**What it does:** Storage that ONLY the server can see. Players can't access it. Put weapons, tools, and server-only models here.

Think of it like the **teacher's desk** — only the teacher (server) can open the drawer.

```lua
local SS = game:GetService("ServerStorage")

-- Clone a sword and give it to a player
local sword = SS:FindFirstChild("Sword"):Clone()
sword.Parent = player.Backpack
```

### game.ServerScriptService
**What it does:** Where server Scripts live. These run the game logic that players can't see or tamper with.

Think of it like the **referee's office** — the referee makes the rules.

### game.StarterGui
**What it does:** UI templates. Everything here gets cloned into each player's screen when they join.

Put ScreenGuis here to create menus, health bars, coin counters, etc.

### game.StarterPlayerScripts
**What it does:** LocalScripts that run on each player's device. Put client-side code here (UI updates, camera effects, local sounds).

### game.StarterPack
**What it does:** Tools that every player starts with. Put a Tool here and everyone gets a copy in their backpack.

---

## Other Useful Services

### TweenService
**What it does:** Smooth animations for properties (position, size, color, transparency).

```lua
local TweenService = game:GetService("TweenService")

-- Smoothly move a part over 2 seconds
local tween = TweenService:Create(
    part,
    TweenInfo.new(2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
    {Position = Vector3.new(0, 20, 0)}
)
tween:Play()
```

### DataStoreService
**What it does:** Saves data between game sessions (like a save file). Server-only!

See the **roblox-data-saving** skill for full details.

### RunService
**What it does:** Runs code every frame. Use sparingly — it's powerful but can cause lag.

```lua
local RunService = game:GetService("RunService")
RunService.Heartbeat:Connect(function(deltaTime)
    -- Runs ~60 times per second
end)
```

### SoundService
**What it does:** Plays sounds and music.

```lua
-- Play a sound
local sound = Instance.new("Sound")
sound.SoundId = "rbxassetid://SOUND_ID_HERE"
sound.Parent = workspace
sound:Play()
```

### UserInputService
**What it does:** Detects keyboard, mouse, and touch input. LocalScript only!

```lua
local UIS = game:GetService("UserInputService")

UIS.InputBegan:Connect(function(input, processed)
    if processed then return end -- Ignore if typing in chat
    if input.KeyCode == Enum.KeyCode.E then
        print("E key pressed!")
    end
end)
```

### Debris
**What it does:** Automatically deletes things after a set time. Great for cleanup!

```lua
local Debris = game:GetService("Debris")
Debris:AddItem(part, 5) -- Deletes the part after 5 seconds
```

---

## Client vs Server — Where Does Code Run?

| Script Type | Runs On | Can Access | Put In |
|-------------|---------|-----------|--------|
| **Script** | Server | ServerStorage, DataStore, all players | ServerScriptService, or inside parts |
| **LocalScript** | Client (player's device) | Players.LocalPlayer, UserInputService, Camera | StarterPlayerScripts, StarterGui |
| **ModuleScript** | Wherever it's required from | Depends on who requires it | ReplicatedStorage (shared) or ServerStorage (server-only) |

**Golden Rule:** Never trust the client! Always validate important actions on the server.
