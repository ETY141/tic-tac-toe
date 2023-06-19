document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const currentPlayerDisplay = document.querySelector('.current-player');
  const restartButton = document.querySelector('.restart-button');
  let currentPlayer = 'X';
  let gameOver = false;
  const aiPlayer = 'O';

  cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
  });

  restartButton.addEventListener('click', restartGame);

  function handleClick() {
    if (gameOver || this.textContent !== '') return;

    this.textContent = currentPlayer;
    this.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
      endGame(`Player ${currentPlayer} wins!`);
    } else if (checkDraw()) {
      endGame('It\'s a draw!');
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;

      if (currentPlayer === aiPlayer) {
        makeAIMove();
      }
    }
  }

  function makeAIMove() {
    let bestScore = -Infinity;
    let move;

    cells.forEach((cell, index) => {
      if (cell.textContent === '') {
        cell.textContent = aiPlayer;
        let score = minimax(cells, 0, false);
        cell.textContent = '';
        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
      }
    });

    cells[move].textContent = aiPlayer;
    cells[move].classList.add(aiPlayer);

    if (checkWin(aiPlayer)) {
      endGame(`Player ${aiPlayer} wins!`);
    } else if (checkDraw()) {
      endGame('It\'s a draw!');
    } else {
      currentPlayer = 'X';
      currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    }
  }

  function minimax(cells, depth, isMaximizing) {
    if (checkWin(aiPlayer)) return isMaximizing ? -1 : 1;
    if (checkWin('X')) return isMaximizing ? 1 : -1;
    if (checkDraw()) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;
    const player = isMaximizing ? aiPlayer : 'X';

    cells.forEach((cell, index) => {
      if (cell.textContent === '') {
        cell.textContent = player;
        let score = minimax(cells, depth + 1, !isMaximizing);
        cell.textContent = '';
        bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
      }
    });

    return bestScore;
  }

  function checkWin(player) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return cells[a].textContent === player &&
        cells[b].textContent === player &&
        cells[c].textContent === player;
    });
  }

  function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
  }

  function endGame(message) {
    alert(message);
    gameOver = true;
    restartButton.style.display = 'block';
  }

  function restartGame() {
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('X', 'O');
    });

    currentPlayer = 'X';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;

    gameOver = false;
    restartButton.style.display = 'none';
  }

  currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
});
