/* =====================================================================
   CC104 – Data Structures and Algorithms
   Project 5: Bubble Pop Challenge

   DATA STRUCTURE : an ARRAY OF OBJECTS called `bubbles`
                    each bubble = { id, size, x, y }
   ALGORITHMS     : traversal  (grow every bubble each tick)
                    searching  (find the clicked bubble by its id)
                    filtering  (remove popped / burst bubbles)
                    repeated updates (a timer runs the game loop)
   ===================================================================== */

/* ---------------------------- Settings ---------------------------- */
const AREA_W = 320;            // game area size in pixels
const AREA_H = 420;
const START_SIZE_MIN = 20;     // a new bubble starts between these sizes
const START_SIZE_MAX = 30;
const MAX_SIZE = 70;           // a bubble bigger than this bursts by itself
const GROW_PER_TICK = 1;       // how much every bubble grows each tick
const TICK_MS = 100;           // length of one tick
const SPAWN_EVERY_TICKS = 15;  // a new bubble every 15 ticks (1.5 seconds)
const POINTS_PER_POP = 10;
const START_LIVES = 3;

/* ---------------------------- Game state -------------------------- */
let bubbles = [];              // the array of bubble objects
let nextId = 1;                // gives every bubble a unique id
let score = 0;
let lives = START_LIVES;
let ticks = 0;
let gameOver = false;
let timerId = null;

/* ---------------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------------- */

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/* Shortcut for finding an element on the page by its id. */
function byId(id) {
  return document.getElementById(id);
}

/* ---------------------------------------------------------------------
   ARRAY OPERATIONS
   --------------------------------------------------------------------- */

/* ADD: create a bubble object at a random position and push it into the array.
   The centre is kept far enough from the edges that, even at MAX_SIZE,
   the bubble stays inside the game area. */
function spawnBubble() {
  const half = MAX_SIZE / 2 + 2;
  const bubble = {
    id: nextId,
    size: Math.round(randomBetween(START_SIZE_MIN, START_SIZE_MAX)),
    x: Math.round(randomBetween(half, AREA_W - half)),
    y: Math.round(randomBetween(half, AREA_H - half))
  };
  nextId++;
  bubbles.push(bubble);
}

/* TRAVERSAL: visit every active bubble and make it bigger. */
function growBubbles() {
  bubbles.forEach(function (b) {
    b.size += GROW_PER_TICK;
  });
}

/* SEARCH: find a bubble by its id (returns undefined if it is not there). */
function findBubble(id) {
  return bubbles.find(function (b) { return b.id === id; });
}

/* REMOVE (player pops it): search by id, filter it out, award points. */
function popBubble(id) {
  if (gameOver) return;                       // guard: no popping after game over
  const bubble = findBubble(id);              // searching
  if (bubble === undefined) return;           // guard: bubble is already gone

  bubbles = bubbles.filter(function (b) { return b.id !== id; });   // removal
  score += POINTS_PER_POP;
  showMessage("Pop! +" + POINTS_PER_POP + " points.", "success");
  render();
}

/* REMOVE (too big): any bubble larger than MAX_SIZE bursts, and the player loses a life each. */
function burstOversizeBubbles() {
  const burst = bubbles.filter(function (b) { return b.size > MAX_SIZE; });   // searching/filtering
  if (burst.length === 0) return;

  bubbles = bubbles.filter(function (b) { return b.size <= MAX_SIZE; });      // removal
  lives -= burst.length;
  if (lives < 0) lives = 0;

  flashArea();
  if (lives === 0) {
    endGame();
  } else {
    showMessage("A bubble burst! Lives left: " + lives, "warning");
  }
}

/* ---------------------------------------------------------------------
   GAME LOOP (repeated updates)
   --------------------------------------------------------------------- */

function tick() {
  if (gameOver) return;
  ticks++;

  growBubbles();                 // 1. grow every bubble
  burstOversizeBubbles();        // 2. burst the ones that are too big (may end the game)

  if (!gameOver && ticks % SPAWN_EVERY_TICKS === 0) {
    spawnBubble();               // 3. add a new bubble now and then
  }
  render();
}

function endGame() {
  gameOver = true;
  clearInterval(timerId);
  byId("area").classList.add("over");
  showMessage("Game over! Final score: " + score + ". Press Reset to play again.", "danger");
}

function resetGame() {
  clearInterval(timerId);
  bubbles = [];
  nextId = 1;
  score = 0;
  lives = START_LIVES;
  ticks = 0;
  gameOver = false;
  const area = byId("area");
  area.classList.remove("over", "hit");
  area.innerHTML = "";
  spawnBubble();                 // start with one bubble
  showMessage("Click the bubbles to pop them before they burst!", "info");
  render();
  timerId = setInterval(tick, TICK_MS);
}

/* ---------------------------------------------------------------------
   DISPLAY (updates the page from the array)
   --------------------------------------------------------------------- */

function render() {
  const area = byId("area");

  // Create or update one element for every bubble in the array.
  bubbles.forEach(function (b) {
    let el = byId("bubble-" + b.id);
    if (el === null) {
      el = document.createElement("button");
      el.type = "button";
      el.className = "bubble";
      el.id = "bubble-" + b.id;
      el.dataset.id = b.id;
      el.setAttribute("aria-label", "Bubble, click to pop");
      area.appendChild(el);
    }
    el.style.width = b.size + "px";
    el.style.height = b.size + "px";
    el.style.left = (b.x - b.size / 2) + "px";
    el.style.top = (b.y - b.size / 2) + "px";
    el.classList.toggle("danger", b.size > MAX_SIZE * 0.8);
  });

  // Remove elements whose bubble is no longer in the array.
  area.querySelectorAll(".bubble").forEach(function (el) {
    if (findBubble(Number(el.dataset.id)) === undefined) el.remove();
  });

  // Score and lives
  byId("score").textContent = score;
  byId("lives").textContent = lives > 0 ? "\u2665".repeat(lives) : "\u2013";
}

function showMessage(text, kind) {
  const box = byId("message");
  box.className = "message " + kind;     // info, success, warning or danger
  box.textContent = text;
}

function flashArea() {
  const area = byId("area");
  area.classList.add("hit");
  setTimeout(function () { area.classList.remove("hit"); }, 250);
}

/* ---------------------------------------------------------------------
   START-UP
   --------------------------------------------------------------------- */
const areaEl = byId("area");
areaEl.style.width = AREA_W + "px";
areaEl.style.height = AREA_H + "px";

// One click listener on the whole area; it finds which bubble was clicked.
areaEl.addEventListener("click", function (event) {
  const bubbleEl = event.target.closest(".bubble");
  if (bubbleEl === null) return;
  popBubble(Number(bubbleEl.dataset.id));
});

byId("reset-btn").addEventListener("click", resetGame);
resetGame();
