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

    return { checkWinner, checkTie };
})();

const domManager = (function () {
    const cellNodes = [];
    const elements = document.querySelectorAll(".perfect-cell")
    const retrieveCellNodes = () => {

        elements.forEach(element => {
            cellNodes.push(element);
        });
    };

    // Add click event listeners for each cell
    const addEventListeners = () => {
        for (const element of cellNodes) {
            element.addEventListener("click", function () {
                clickEvent(element);
            })
        }
    }

    function clickEvent(e) {
        // e.textContent = e.textContent === "O" ? "X" : "O";
        const rowValue = e.getAttribute("data-row");
        const columnValue = e.getAttribute("data-column");
        console.log(`rowValue = ${rowValue} columnValue = ${columnValue}`);
        gameBoard.changePosition(rowValue, columnValue, e.textContent);

        // For testing, prints out the board state every time a cell is clicked
        gameBoard.getBoardState();
    }

    return { retrieveCellNodes, addEventListeners };
})();

console.log(`The board state is:`);
gameBoard.getBoardState();
domManager.retrieveCellNodes();
domManager.addEventListeners();