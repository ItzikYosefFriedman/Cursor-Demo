const {
  BOARD_SIZE,
  COLS,
  DIRS,
  ROWS,
  TICK_MS,
  createGame,
  queueDirection,
  resetGame,
  stepGame,
} = window.SnakeGame;
const { createRenderer } = window.SnakeRenderer;

const BEST_KEY = "snake-best";

const state = createGame(Number(localStorage.getItem(BEST_KEY) || 0));
const renderer = createRenderer(
  {
    boardEl: document.getElementById("game"),
    titleEl: document.getElementById("title"),
    scoreEl: document.getElementById("score"),
    bestEl: document.getElementById("best"),
  },
  {
    cols: COLS,
    rows: ROWS,
    boardSize: BOARD_SIZE,
  },
);

let lastTick = 0;

function loop(t) {
  if (state.alive && t - lastTick >= TICK_MS) {
    lastTick = t;
    const result = stepGame(state);
    if (result.bestChanged) {
      localStorage.setItem(BEST_KEY, String(state.best));
    }
  }

  renderer.render(state);
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  if (e.key === " " && !state.alive) {
    e.preventDefault();
    resetGame(state);
    lastTick = 0;
    renderer.render(state);
    return;
  }

  const next = DIRS[e.key];
  if (!next) return;

  e.preventDefault();
  queueDirection(state, next);
});

renderer.render(state);
requestAnimationFrame(loop);
