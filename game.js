(() => {
  const COLS = 20;
  const ROWS = 20;
  const BOARD_SIZE = 800;
  const TICK_MS = 120;

  const DIRS = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  function createGame(best = 0) {
    const state = {
      snake: [],
      dir: DIRS.ArrowRight,
      pendingDir: DIRS.ArrowRight,
      food: null,
      score: 0,
      best,
      alive: true,
    };

    resetGame(state);
    return state;
  }

  function resetGame(state) {
    const midX = Math.floor(COLS / 2);
    const midY = Math.floor(ROWS / 2);

    state.snake = [
      { x: midX, y: midY },
      { x: midX - 1, y: midY },
      { x: midX - 2, y: midY },
    ];
    state.dir = DIRS.ArrowRight;
    state.pendingDir = state.dir;
    state.food = null;
    state.score = 0;
    state.alive = true;

    placeFood(state);
  }

  function queueDirection(state, next) {
    if (!next) return false;
    if (opposite(next, state.dir) || opposite(next, state.pendingDir)) return false;

    state.pendingDir = next;
    return true;
  }

  function stepGame(state) {
    state.dir = state.pendingDir;
    const head = {
      x: state.snake[0].x + state.dir.x,
      y: state.snake[0].y + state.dir.y,
    };

    const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    const hitSelf = occupied(state, head);
    if (hitWall || hitSelf) {
      state.alive = false;
      return { ateFood: false, bestChanged: false };
    }

    state.snake.unshift(head);
    if (state.food && same(head, state.food)) {
      state.score += 1;
      const bestChanged = state.score > state.best;
      if (bestChanged) state.best = state.score;
      placeFood(state);
      return { ateFood: true, bestChanged };
    }

    state.snake.pop();
    return { ateFood: false, bestChanged: false };
  }

  function occupied(state, pos) {
    return state.snake.some((seg) => same(seg, pos));
  }

  function same(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function opposite(a, b) {
    return a.x + b.x === 0 && a.y + b.y === 0;
  }

  function placeFood(state) {
    const empty = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!occupied(state, { x, y })) empty.push({ x, y });
      }
    }

    const spot = empty[Math.floor(Math.random() * empty.length)];
    state.food = spot ? { x: spot.x, y: spot.y, color: randomFoodColor() } : null;
  }

  function randomFoodColor() {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.floor(Math.random() * 30);
    const l = 45 + Math.floor(Math.random() * 25);
    return `hsl(${h} ${s}% ${l}%)`;
  }

  window.SnakeGame = {
    BOARD_SIZE,
    COLS,
    DIRS,
    ROWS,
    TICK_MS,
    createGame,
    queueDirection,
    resetGame,
    stepGame,
  };
})();
