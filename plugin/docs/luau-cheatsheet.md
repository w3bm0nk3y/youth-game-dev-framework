# Luau Cheatsheet

Quick reference for common Luau (Roblox scripting language) patterns.

## Variables

```lua
local name = "Alex"           -- Text (string)
local score = 0               -- Whole number (integer)
local speed = 16.5            -- Decimal number
local isAlive = true          -- True or false (boolean)
local items = {}              -- Empty table (like a list)
local player = nil            -- Nothing/empty
```

## Math

```lua
local sum = 10 + 5            -- 15
local diff = 10 - 5           -- 5
local product = 10 * 5        -- 50
local quotient = 10 / 5       -- 2
local remainder = 10 % 3      -- 1 (modulo)
local power = 2 ^ 3           -- 8
local rounded = math.floor(3.7)  -- 3
local bigger = math.max(5, 10)   -- 10
local random = math.random(1, 100) -- Random number 1-100
```

## Strings

```lua
local greeting = "Hello, " .. name .. "!"  -- Combine strings with ..
local length = #greeting                    -- Length of string
local upper = string.upper("hello")        -- "HELLO"
local lower = string.lower("HELLO")        -- "hello"
print(`Score: {score}`)                     -- String interpolation (Luau feature)
```

## If/Then

```lua
if score >= 100 then
    print("You win!")
elseif score >= 50 then
    print("Almost there!")
else
    print("Keep going!")
end
```

## Loops

```lua
-- Count from 1 to 10
for i = 1, 10 do
    print(i)
end

-- Count by 2s: 2, 4, 6, 8, 10
for i = 2, 10, 2 do
    print(i)
end

-- Loop through a table
local fruits = {"apple", "banana", "cherry"}
for index, fruit in pairs(fruits) do
    print(index, fruit)
end

-- Loop forever (use with task.wait!)
while true do
    print("Still running...")
    task.wait(1) -- ALWAYS wait in a while-true loop!
end

-- Loop until a condition
repeat
    score = score + 1
until score >= 10
```

## Functions

```lua
-- Define a function
local function greet(playerName)
    print("Welcome, " .. playerName .. "!")
end

-- Call it
greet("Alex") -- Prints: Welcome, Alex!

-- Function that returns something
local function add(a, b)
    return a + b
end

local result = add(5, 3) -- result = 8
```

## Tables (Lists and Dictionaries)

```lua
-- List (ordered, numbered starting at 1)
local colors = {"red", "blue", "green"}
print(colors[1])  -- "red" (Lua starts at 1, not 0!)
table.insert(colors, "yellow")  -- Add to end
table.remove(colors, 2)         -- Remove index 2

-- Dictionary (named keys)
local player = {
    name = "Alex",
    level = 5,
    coins = 100,
}
print(player.name)   -- "Alex"
player.coins = 200   -- Update a value
```

## Common Roblox Patterns

```lua
-- Find something in the game
local part = workspace:FindFirstChild("MyPart")
local part = workspace:WaitForChild("MyPart")  -- Waits until it exists

-- Get a service
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")

-- Touched event
part.Touched:Connect(function(hit)
    print(hit.Name .. " touched the part!")
end)

-- Player joined
Players.PlayerAdded:Connect(function(player)
    print(player.Name .. " joined!")
end)

-- Wait
task.wait(2)  -- Wait 2 seconds

-- Delay
task.delay(5, function()
    print("5 seconds later!")
end)

-- Get player from character
local player = Players:GetPlayerFromCharacter(hit.Parent)
```

## Type Annotations (Optional but Helpful)

```lua
local speed: number = 16
local name: string = "Alex"
local isReady: boolean = false

local function damage(target: Humanoid, amount: number): nil
    target:TakeDamage(amount)
end
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `array[0]` | Lua starts at 1: `array[1]` |
| `===` | Use `==` for equals |
| `!=` | Use `~=` for not-equals |
| `&&` | Use `and` |
| `\|\|` | Use `or` |
| `!value` | Use `not value` |
| Missing `end` | Every `if`, `for`, `while`, `function` needs an `end` |
| Forgot `local` | Always use `local` for variables |
