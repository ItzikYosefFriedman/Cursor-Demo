(() => {
  function createRenderer({ boardEl, titleEl, scoreEl, bestEl }, config) {
    const cells = [];
    const totalCells = config.cols * config.rows;

    document.documentElement.style.setProperty("--board-size", `${config.boardSize}px`);
    boardEl.style.setProperty("--cols", String(config.cols));
    boardEl.style.setProperty("--rows", String(config.rows));
    boardEl.style.setProperty("--board-size", `${config.boardSize}px`);
    titleEl.textContent = `Snake ${config.boardSize}×${config.boardSize}`;

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      boardEl.appendChild(cell);
      cells.push(cell);
    }

    const gameOver = document.createElement("div");
    gameOver.className = "game-over";
    gameOver.innerHTML = `
      <div class="game-over-title">GAME OVER</div>
      <div class="game-over-hint">Press Space to restart</div>
    `;
    boardEl.appendChild(gameOver);

    function cellAt(pos) {
      return cells[pos.y * config.cols + pos.x];
    }

    function clearBoard() {
      for (const cell of cells) {
        cell.className = "cell";
        cell.style.removeProperty("--food-color");
      }
    }

    function render(state) {
      clearBoard();

      for (const seg of state.snake) {
        cellAt(seg).classList.add("snake");
      }

      if (state.food) {
        const foodCell = cellAt(state.food);
        foodCell.classList.add("food");
        foodCell.style.setProperty("--food-color", state.food.color);
      }

      scoreEl.textContent = String(state.score);
      bestEl.textContent = String(state.best);
      boardEl.classList.toggle("is-dead", !state.alive);
    }

    return { render };
  }

  window.SnakeRenderer = { createRenderer };
})();
