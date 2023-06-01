'use strict';

const createPlayer = (marker) => {
  let _marker = marker;

  const setMarker = (marker) => {
    _marker = marker;
  };

  const getMarker = () => _marker;

  return {
    setMarker,
    getMarker,
  };
};

const createGameBoard = () => {
  const board = Array(9).fill(null);

  const at = (index) => board[index];

  const mark = (index, player) => {
    if (board[index]) {
      return false;
    }

    board[index] = player.getMarker();
    return true;
  };

  const getBoard = () => board.slice();

  const reset = () => {
    board.fill(null);
  };

  return {
    at,
    mark,
    reset,
    getBoard,
  };
};

const createGame = () => {
  const board = createGameBoard();
  const playerOne = createPlayer('X');
  const playerTwo = createPlayer('O');

  let gameOver = false;
  let winner = null;
  let currentPlayer = playerOne;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        board.at(a) &&
        board.at(a) === board.at(b) &&
        board.at(a) === board.at(c)
      ) {
        winner = currentPlayer;
        gameOver = true;

        console.log('Winner:', currentPlayer.getMarker());
        break;
      }
    }

    if (!board.getBoard().includes(null)) {
      gameOver = true;
      winner = null;

      console.log('Draw!');
    }
  };

  const makeMove = (index) => {
    if (gameOver) {
      console.log('Game Over.');
      return;
    }

    if (board.mark(index, currentPlayer)) {
      checkWinner();

      if (gameOver) {
        console.log('Game Over.');
        return;
      }
      switchPlayer();
    } else {
      console.log('Invalid move.');
    }
  };

  const reset = () => {
    board.reset();
    currentPlayer = playerOne;
    gameOver = false;
    winner = null;
  };

  const isOver = () => gameOver;
  const getWinner = () => winner;
  const getCurrentPlayer = () => currentPlayer;
  const getBoard = () => board.getBoard();

  return {
    makeMove,
    reset,
    isOver,
    getWinner,
    getCurrentPlayer,
    getBoard,
  };
};

const game = createGame();

const board = document.getElementById('js-board');
const marker = document.getElementById('js-marker');
const reset = document.getElementById('js-reset');
const dialog = document.getElementById('js-dialog');
const winner = document.getElementById('js-winner');

board.addEventListener('click', (event) => {
  if (!event.target.className.includes('square') || game.isOver()) return;

  const currentPlayer = game.getCurrentPlayer();
  const square = event.target;
  const index = Array.from(event.currentTarget.children).indexOf(square);

  game.makeMove(index);
  markSquare(square, currentPlayer);

  if (game.isOver()) {
    if (game.getWinner()) {
      winner.classList.remove('x', 'o');
      winner.classList.add(game.getWinner().getMarker().toLowerCase());
    }
    dialog.showModal();
  }

  updateMarker();
});

reset.addEventListener('click', () => {
  // clear the board
  for (const square of board.children) {
    square.innerText = '';
    square.classList.remove('marked');
  }

  winner.classList.remove('x', 'o');
  game.reset();
  updateMarker();
  dialog.close();
});

const markSquare = (square, player) => {
  square.innerText = player.getMarker();
  square.classList.add('marked');
};

const updateMarker = () => {
  marker.innerText = game.getCurrentPlayer().getMarker();
};

dialog.oncancel = (event) => event.preventDefault();
