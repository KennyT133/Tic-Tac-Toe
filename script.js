// Create player object
const createPlayer = (name, marker) => {
  let score = 0;
  const givePoints = () => score++;
  const checkPoints = () => score;
  const resetPoints = () => score = 0;
  return { name, marker, givePoints, checkPoints, resetPoints };
};

// Creates the game board object
const createGameBoard = (function () {
  let arrayGame = ["", "", "", "", "", "", "", "", ""];
  const getGameBoard = () => arrayGame;
  const setMarker = (index, marker) => {
    if (arrayGame[index] === "") {
      arrayGame[index] = marker;
      return true;
    }
    return false;
  };
  const resetBoard = () => {
    arrayGame = ["", "", "", "", "", "", "", "", ""];
  };
  return { getGameBoard, setMarker, resetBoard };
})();

// Creates game logic object
const gameLogic = (function () {
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");
  let currentPlayer = player1;
  
  const checkWinner = () => {
    const board = createGameBoard.getGameBoard();
    const winCombo = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winCombo) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const isBoardFull = () => {
    return createGameBoard.getGameBoard().every(cell => cell !== "");
  };

  const playTurn = (index) => {
    if (createGameBoard.setMarker(index, currentPlayer.marker)) {
      const winner = checkWinner();
      if (winner) {
        document.getElementById("status").textContent = `${currentPlayer.name} wins!`;
        currentPlayer.givePoints();
        createGameBoard.resetBoard();
        updateBoard();
      } else if (isBoardFull()) {
        document.getElementById("status").textContent = "It's a tie!";
        createGameBoard.resetBoard();
        updateBoard();
      } else {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        document.getElementById("status").textContent = `${currentPlayer.name}'s turn`;
      }
      return true;
    }
    return false;
  };

  const getCurrentPlayer = () => currentPlayer;

  return { playTurn, getCurrentPlayer };
})();

// Function to update the board display
function updateBoard() {
  const board = createGameBoard.getGameBoard();
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
  });
}

// Function to handle cell click
function cellClick(event) {
  const index = event.target.getAttribute("data-index");
  gameLogic.playTurn(index);
  updateBoard();
}

// Set up event listeners for cells
document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", cellClick);
});

// Set up event listener for reset button
document.getElementById("reset").addEventListener("click", () => {
  createGameBoard.resetBoard();
  updateBoard();
  document.getElementById("status").textContent = `${gameLogic.getCurrentPlayer().name}'s turn`;
});

// Initialize the game
updateBoard();
document.getElementById("status").textContent = `${gameLogic.getCurrentPlayer().name}'s turn`;
