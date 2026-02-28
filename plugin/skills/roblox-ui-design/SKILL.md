---
name: Roblox UI Design
description: Use when creating user interfaces, ScreenGuis, BillboardGuis, shop menus, HUDs, health bars, or any on-screen elements.
---

# Roblox UI Design

## Overview
UI (User Interface) is everything the player sees on their screen that isn't the 3D world — health bars, coin counters, shop menus, buttons, and text. Good UI is clear, readable, and doesn't get in the way.

## UI Types in Roblox

| Type | Where It Shows | Use For |
|------|---------------|---------|
| **ScreenGui** | On the player's screen | HUD, menus, buttons, counters |
| **BillboardGui** | Floating above a 3D part | Name tags, health bars over heads, shop labels |
| **SurfaceGui** | On the surface of a part | Signs, displays, interactive screens |

---

## Basic HUD (Coins + Health)

Create a **ScreenGui in StarterGui**. Add frames and text labels inside it.

### Structure in StarterGui:
```
StarterGui/
└── GameHUD (ScreenGui)
    ├── CoinDisplay (Frame)
    │   ├── CoinIcon (ImageLabel)
    │   └── CoinText (TextLabel)
    └── HealthBar (Frame)
        └── HealthFill (Frame)
```

### Update Coin Display (LocalScript in StarterPlayerScripts)

```lua
-- Update Coin Display (LocalScript in StarterPlayerScripts)
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Wait for UI and leaderstats to load
local gui = player.PlayerGui:WaitForChild("GameHUD")
local coinText = gui:WaitForChild("CoinDisplay"):WaitForChild("CoinText")
local leaderstats = player:WaitForChild("leaderstats")
local coins = leaderstats:WaitForChild("Coins")

-- Update the display whenever coins change
local function updateDisplay()
    coinText.Text = "Coins: " .. coins.Value
end

coins.Changed:Connect(updateDisplay)
updateDisplay() -- Set initial value
```

### Custom Health Bar (LocalScript in StarterPlayerScripts)

```lua
-- Custom Health Bar (LocalScript in StarterPlayerScripts)
local Players = game:GetService("Players")
local player = Players.LocalPlayer

local gui = player.PlayerGui:WaitForChild("GameHUD")
local healthFill = gui:WaitForChild("HealthBar"):WaitForChild("HealthFill")

local function updateHealth()
    local character = player.Character
    if not character then return end

    local humanoid = character:FindFirstChild("Humanoid")
    if not humanoid then return end

    -- Scale the health bar width based on current health
    local healthPercent = humanoid.Health / humanoid.MaxHealth
    healthFill.Size = UDim2.new(healthPercent, 0, 1, 0)

    -- Change color based on health
    if healthPercent > 0.5 then
        healthFill.BackgroundColor3 = Color3.fromRGB(0, 200, 0) -- Green
    elseif healthPercent > 0.25 then
        healthFill.BackgroundColor3 = Color3.fromRGB(255, 200, 0) -- Yellow
    else
        healthFill.BackgroundColor3 = Color3.fromRGB(255, 0, 0) -- Red
    end
end

-- Connect to health changes
player.CharacterAdded:Connect(function(character)
    local humanoid = character:WaitForChild("Humanoid")
    humanoid.HealthChanged:Connect(updateHealth)
    updateHealth()
end)
```

---

## Shop Menu with Buttons

```lua
-- Shop Button Handler (LocalScript in StarterPlayerScripts)
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local player = Players.LocalPlayer

local gui = player.PlayerGui:WaitForChild("ShopGui")
local shopFrame = gui:WaitForChild("ShopFrame")
local openButton = gui:WaitForChild("OpenShopButton")
local closeButton = shopFrame:WaitForChild("CloseButton")
local buyEvent = ReplicatedStorage:WaitForChild("BuyItem")

-- Toggle shop visibility
local shopOpen = false

openButton.MouseButton1Click:Connect(function()
    shopOpen = not shopOpen
    shopFrame.Visible = shopOpen
end)

closeButton.MouseButton1Click:Connect(function()
    shopOpen = false
    shopFrame.Visible = false
end)

-- Buy buttons
for _, button in pairs(shopFrame:GetChildren()) do
    if button:IsA("TextButton") and button.Name:match("^Buy_") then
        button.MouseButton1Click:Connect(function()
            local itemName = button.Name:gsub("Buy_", "")
            buyEvent:FireServer(itemName)
        end)
    end
end
```

---

## BillboardGui (Floating Labels)

Put a **BillboardGui inside a Part** to show text floating above it.

```
Part/
└── BillboardGui
    ├── StudsOffset = (0, 3, 0)  -- Float 3 studs above the part
    ├── Size = {4, 0, 1, 0}     -- 4 studs wide, 1 stud tall
    └── TextLabel
        ├── Text = "Shop"
        ├── TextScaled = true
        └── BackgroundTransparency = 1
```

---

## UI Design Tips for Kids

1. **Big buttons** — At least 50x50 pixels, ideally bigger for iPad
2. **High contrast** — White text on dark backgrounds, or dark text on light
3. **Simple fonts** — Use SourceSansBold or GothamBold
4. **Don't cover the game** — Keep UI at edges/corners
5. **Use UDim2 for sizing** — `UDim2.new(0.3, 0, 0.1, 0)` scales with screen size
6. **Test on iPad** — What looks good on a big monitor might be tiny on iPad
7. **Minimal text** — Use icons when possible (a coin image instead of the word "Coins")

## Key Properties
- `AnchorPoint` — Where the element pivots from (0.5, 0.5 = center)
- `Position` — Where on screen (UDim2 — use Scale for responsive, Offset for pixels)
- `Size` — How big (UDim2)
- `BackgroundTransparency` — 0 = solid, 1 = invisible
- `TextScaled` — true = text auto-sizes to fit
- `ZIndex` — Higher number = appears on top
