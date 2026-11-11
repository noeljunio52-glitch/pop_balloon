# Bubble Pop Challenge

**Course:** CC104 – Data Structures and Algorithms (Course Term Project, Project 5)
**Section:** BSIT WMT 2-2
**Group:** _Group XX_

## Group Members

| Name | Contribution |
|------|--------------|
| Noel D. Junio | _fill in_ |
| Joemari Matt Ogama | _fill in_ |
| Andrei Soriano | _fill in_ |
| Siantil Noelyn Lobo | _fill in_ |

## Game Objective

Bubbles appear at random places and keep growing. Click a bubble to **pop** it and earn points before it gets too big. A bubble that grows past the maximum size **bursts by itself** and you lose a life. The game ends after **three** automatic bursts.

## Screenshots

| Gameplay | Game over | Mobile |
|---|---|---|
| ![Gameplay](assets/screenshots/gameplay.png) | ![Game over](assets/screenshots/game-over.png) | ![Mobile](assets/screenshots/mobile.png) |

## Gameplay Instructions

1. Bubbles appear in the blue game area and slowly grow. A new one appears about every 1.5 seconds.
2. Click (or tap) a bubble to pop it. It disappears and you get **10 points**.
3. Bubbles close to the maximum size turn **red** as a warning.
4. A bubble that grows larger than the maximum size bursts by itself: you lose one life (hearts show your lives).
5. When all **3 lives** are gone, the game is over and the bubbles can no longer be popped.
6. Press **Reset** at any time to start a new game.

## Launch Instructions

No installation, server, database or internet connection is needed.

1. Download or clone the repository (on a phone, extract the zip first or use a single-file build).
2. Open **`index.html`** in a web browser.

The game uses only plain HTML, CSS and JavaScript (no libraries), so it works offline.

## Project Structure

```
CC104-Bubble-Pop-Project/
├── index.html            page structure
├── css/
│   └── style.css         layout and game visuals
├── js/
│   └── game.js           data structure + algorithms + game logic
├── assets/screenshots/   screenshots used in this README
└── README.md
```

## Data Structure

An **array of objects** named `bubbles` in `js/game.js`. Every active bubble is one object with an `id`, a `size` and a position (`x`, `y`):

```js
let bubbles = [
  { id: 1, size: 24, x: 120, y: 200 },
  { id: 2, size: 51, x: 240, y: 90 }
];
```

## Algorithms / Operations

| Operation | What it does | Code | Function |
|---|---|---|---|
| Add (spawn) | Creates an object with a unique `id`, random start size and random position, and pushes it into the array. The position keeps the bubble inside the game area even at maximum size | `bubbles.push(bubble)` | `spawnBubble()` |
| Traversal | Visits every active bubble and increases its size | `bubbles.forEach(b => b.size += 1)` | `growBubbles()` |
| Searching | Finds the clicked bubble by its `id` | `bubbles.find(b => b.id === id)` | `findBubble()` |
| Removal (pop) | Removes the clicked bubble from the array and the screen, then adds points | `bubbles.filter(b => b.id !== id)` | `popBubble()` |
| Filtering (auto-burst) | Finds every bubble bigger than the maximum, removes them, and takes one life per burst | `bubbles.filter(b => b.size > MAX_SIZE)` | `burstOversizeBubbles()` |
| Repeated updates | A timer runs `tick()` every 0.1 seconds: grow, burst check, spawn, redraw | `setInterval(tick, 100)` | `tick()` |
| Game over | Stops the timer when lives reach 0 | `clearInterval(timerId)` | `endGame()` |

## Key Functions

- `spawnBubble()`, `growBubbles()`, `findBubble(id)`, `popBubble(id)`, `burstOversizeBubbles()` – the array operations above
- `tick()` – one step of the game loop
- `resetGame()` – clears the array, score, lives and restarts the timer
- `render()` – syncs the screen with the array (creates, resizes or removes bubble elements; updates score and hearts)

## Error Handling (invalid actions)

- Popping a bubble that is already gone is ignored.
- After the game is over, bubbles cannot be popped and the loop is stopped.
- Bubbles are spawned only where they will fit inside the bounded game area.

## Settings you can change (top of `js/game.js`)

`MAX_SIZE`, `GROW_PER_TICK`, `SPAWN_EVERY_TICKS`, `POINTS_PER_POP`, `START_LIVES`

## Technologies

HTML5 · CSS3 · JavaScript (no frameworks or libraries)
