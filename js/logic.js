// Since JavaScript doesn't have a native way to check array equality based on values, gotta implement it
// yourself :(
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Gameboard Object via an IIFE module pattern
const gameBoard = (function () {

    const board =
        [[0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]];

    // Methods for the gameBoard "class"

    // Gets the value of that particular cell given a row and column
    const getCellValue = (row, column) => board[row][column];

    // Prints out a String representation of the current game board
    // This helps visualize what the board looks like.
    const getBoardState = () => {
        let boardState = "";
        for (let row = 0; row < board.length; row++) {
            boardState += getRow(row).join("|") + "\n";
        }
        console.log(boardState);
    };

    // Returns an Array of values that corresponds with a given row
    const getRow = (row) => board[row];

    // Returns an Array of values that corresponds with a given column
    const getColumn = (column) => {
        const verticalNums = [];
        for (let row = 0; row < board.length; row++) {
            verticalNums.push(board[row][column]);
        }
        return verticalNums;
    };

    // Returns an Array of values diagonally
    // Has one parameter: startPosition that retrieves values based on:
    // "left" means to take values starting from the top left grid to the bottom right grid
    // "right" means to take values starting from the top right grid to the bottom left grid
    const getDiagonal = (startPosition) => {
        // Since we know that tic-tac-toe has a fixed sized grid, we don't really have to loop through it
        switch (startPosition) {
            case "left":
                return [getCellValue(0, 0), getCellValue(1, 1), getCellValue(2, 2)];
            case "right":
                return [getCellValue(0, 2), getCellValue(1, 1), getCellValue(2, 0)];
        }
    }

    // Changes the position of a cell based on a given row, column, and value
    const changePosition = (row, column, value) => {
        board[row][column] = value;
    };

    // Checks if the board has already been filled by X's and O's (like the song!)
    const isFilled = () => {
        for (let i = 0; i < board.length; i++) {
            if (getRow(i).includes(0))
                return false;
        }
        return true;

    }

    return { getCellValue, getBoardState, getRow, getColumn, getDiagonal, changePosition, isFilled };
})();

// This IIFE module pattern handles all the game logic itself. It is NOT concerned with player input right now
const game = (function () {
    const winningValues = {
        X: ["X", "X", "X"],
        O: ["O", "O", "O"]
    };
    let player1Turn = false;
    let player2Turn = false;

    // Obtain DOM things such as the player score's text, and a "You win!" dialog (that I'll implement shortly)
    let playerXScore = 0;
    let playerOScore = 0;
    // note for future me: WORK ON THIS FUNCTIONALITY where I take the score and update it accordingly
    const playerXScoreText = document.querySelector(".player-1-score");
    const playerOScoreText = document.querySelector(".player-2-score");

    // Checks if there's a winner at that particular spot. As in, it checks the surrounding row and column
    // It returns true if there's a winner and false if there isn't
    const checkWinner = (row, column) => {
        const xRowWin = arraysEqual(gameBoard.getRow(row), winningValues.X);
        const xColumnWin = arraysEqual(gameBoard.getColumn(column), winningValues.X);
        const xDiagonalWin = arraysEqual(gameBoard.getDiagonal("left"), winningValues.X) || arraysEqual(gameBoard.getDiagonal("right"), winningValues.X);

        const oRowWin = arraysEqual(gameBoard.getRow(row), winningValues.O);
        const oColumnWin = arraysEqual(gameBoard.getColumn(column), winningValues.O);
        const oDiagonalWin = arraysEqual(gameBoard.getDiagonal("left"), winningValues.O) || arraysEqual(gameBoard.getDiagonal("right"), winningValues.O);

        if (xRowWin || xDiagonalWin || xColumnWin) {
            console.log("Player X wins!");
            playerXScoreText.textContent = `Player X Score: ${++playerXScore}`;

            return true;
        }
        else if (oRowWin || oDiagonalWin || oColumnWin) {
            console.log("Player O wins!");
            return true;
        }
        return false;
    }

    // Checks if there's a tie or no winners
    // Returns true if there is a tie, false if there isn't
    const checkTie = (row, column) => {
        // If there is no winner at a given row and column AND the gameBoard is filled we can check if there's a tie
        if (!checkWinner(row, column) && gameBoard.isFilled()) {
            console.log("It's a tie tarnished!");
            return true;
        }
        return false;
    }

    // A method for checking who goes first.
    // param dataFirstPlayer: takes in the submitted form data from the dialog and specifically uses data["first"]
    const checkFirstPlayer = (dataFirstPlayer) => {
        if (dataFirstPlayer === "first-p1") {
            return "player-1";
        }
        else {
            return "player-2";
        }
    }

    const playTurn = (firstPlayer) => {
        if (firstPlayer === "player-1") {
            player1Turn = true;
        }
        else if (firstPlayer === "player-2") {
            player2Turn = true;
        }
        // I'm gonna forget my thought process so:
        // every time the player clicks a cell, we always check if that cell has been placed already
        // if not, we can place one at that location, otherwise, don't change jack Tarnished.
        // once a cell has been placed, we swap the player1Turn and the player2Turn like a pattern

        if (player1Turn) {
            player1Turn = false;
            player2Turn = true;
            return "player-1";
        }
        else {
            player2Turn = false;
            player1Turn = true;
            return "player-2";
        }
    }

    const alreadyPlaced = (row, column) => gameBoard.getCellValue(row, column) === 0 ? false : true;

    return { checkWinner, checkTie, checkFirstPlayer, playTurn, alreadyPlaced };
})();

const domManager = (function () {
    const cellNodes = [];
    let data = undefined;
    const elements = document.querySelectorAll(".perfect-cell")
    const dialog = document.querySelector("dialog");
    const form = document.querySelector("form");
    const submitDialog = document.querySelector(".submit-dialog");

    // Show dialog immediately when the page loads for player selection
    dialog.showModal();

    const retrieveCellNodes = () => {

        elements.forEach(element => {
            cellNodes.push(element);
        });
    };

    // Add click event listeners for each cell & any other node
    const addEventListeners = () => {
        for (const element of cellNodes) {
            element.addEventListener("click", function () {
                changeGameBoardState(element);
            })
        }

        // Add event listener for the submit buttton
        submitDialog.addEventListener("click", function () {
            returnDialogChoices();
        })

        // Prevents user from closing the dialog with the escape key
        window.addEventListener("keydown", (key) => {
            if (key.code === "Escape") {
                key.preventDefault();
            }
        })

    }

    function changeGameBoardState(e) {
        const rowValue = e.getAttribute("data-row");
        const columnValue = e.getAttribute("data-column");
        let playerStartChoice = game.checkFirstPlayer(data["first"]);


        // Only changes the position of the board if there HAS NOT BEEN a filled cell based on the row and column
        if (!game.alreadyPlaced(rowValue, columnValue)) {

            let currentPlayerTurn = game.playTurn(playerStartChoice);
            e.textContent = data[currentPlayerTurn];
            gameBoard.changePosition(rowValue, columnValue, e.textContent);
            gameBoard.getBoardState();
            // Always checks the current cell if a winner has been found
            game.checkTie(rowValue, columnValue);

        }
    }

    function checkFormRequiredFields() {
        // Using JavaScript to check if all fields have been filled in before submitting
        for (const element of form.querySelectorAll("[required]")) {
            if (!element.reportValidity()) {
                return false;
            }
        }
        return true;
    }

    function returnDialogChoices() {
        if (checkFormRequiredFields()) {
            const formData = new FormData(form);
            data = Object.fromEntries(formData.entries());
            if (bothOptionsValid()) {
                data = Object.fromEntries(formData.entries());
                console.log(data);
                dialog.close();
            } else {
                alert("Sorry! Both players have selected the same choice! Try again!");
                data = Object.fromEntries(formData.entries());

            }

        }


    }

    // This method checks if a player has selected both options for Player 1 and 2.
    // ex. Player 1 chooses to play X & Player 2 also chooses to play X,
    // it will generate an alert that they need to select again
    function bothOptionsValid() {
        if (data["player-1"] === data["player-2"]) {
            return false;
        }
        return true;
    }

    return { retrieveCellNodes, addEventListeners, data };
})();

console.log(`The board state is:`);
gameBoard.getBoardState();
domManager.retrieveCellNodes();
domManager.addEventListeners();