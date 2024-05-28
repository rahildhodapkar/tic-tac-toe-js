function createPlayer(name, marker) {
  let _score = 0;
  const getScore = () => _score;
  const increaseScore = () => _score++;
  return {
    name,
    marker,
    getScore,
    increaseScore,
  };
}

const game = (function () {
  function _getCells() {
    let cells = [];
    const numbers = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    for (let i = 0; i < 9; i++) {
      cells.push(document.querySelector(`#${numbers[i]}`));
    }
    return cells;
  }

  function _addBorders() {
    document.querySelectorAll(".main").forEach((cell) => {
      cell.style.borderLeft = "solid 2px black";
      cell.style.borderRight = "solid 2px black";
    });

    document.querySelectorAll(".cross").forEach((cell) => {
      cell.style.borderTop = "solid 2px black";
      cell.style.borderBottom = "solid 2px black";
    });
  }

  const _cells = _getCells();

  function _checkBoard() {
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

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        _cells[a].textContent &&
        _cells[a].textContent === _cells[b].textContent &&
        _cells[a].textContent === _cells[c].textContent
      ) {
        return _cells[a].textContent;
      }
    }

    return null;
  }

  function _updateScore(playerOne, playerTwo) {
    document.querySelector(".player-one-score").innerHTML = `${
      playerOne.name
    }: ${playerOne.getScore()}`;
    document.querySelector(".player-two-score").innerHTML = `${
      playerTwo.name
    }: ${playerTwo.getScore()}`;
  }

  function initGame(playerOneName, playerTwoName) {
    _addBorders();

    const playerOne = createPlayer(playerOneName, "o");
    const playerTwo = createPlayer(playerTwoName, "x");
    _updateScore(playerOne, playerTwo);

    let _currentMarker = "o";
    let _moves = 0;
    let _endPlay = false;

    const handleCellClick = (event) => {
      const cell = event.target;
      if (cell.textContent || _endPlay) return;

      cell.textContent = _currentMarker;
      cell.classList.add("unclickable");
      _moves++;

      const winner = _checkBoard();
      if (winner) {
        if (winner === "o") playerOne.increaseScore();
        if (winner === "x") playerTwo.increaseScore();
        _endPlay = true;
        _updateScore(playerOne, playerTwo);
        alert(`${winner} wins!`);
        return;
      }

      if (_moves === 9) {
        alert("It's a draw!");
        return;
      }

      _currentMarker = _currentMarker === "o" ? "x" : "o";
    };

    _cells.forEach((cell) => {
      cell.textContent = ""; // Reset cell content
      cell.classList.remove("unclickable"); // Reset cell class
      cell.addEventListener("click", handleCellClick);
    });

    document.querySelector("#end-game").addEventListener("click", () => {
      _endPlay = true;
    });
  }

  return {
    initGame,
  };
})();

function init() {
  const dialog = document.querySelector("dialog");

  document.querySelector("#new-game").addEventListener("click", () => {
    dialog.showModal();
  });

  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const playerOneInput = document.querySelector("#player-one");
    const playerTwoInput = document.querySelector("#player-two");

    dialog.close();
    game.initGame(playerOneInput.value, playerTwoInput.value);
  });
}

init();
