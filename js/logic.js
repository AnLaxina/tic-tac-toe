// Gameboard Object via an IIFE module pattern
const gameBoard = (function () {

    const board =
        [[0, 0, 0],
        [0, 0, 0],
        [0, 1, 0]];

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

    // Gets an Array of values that corresponds with a given row
    const getRow = (row) => board[row];

    // Gets an Array of values that corresponds with a given column
    const getColumn = (column) => {
        const verticalNums = [];
        for (let row = 0; row < board.length; row++) {
            verticalNums.push(board[row][column]);
        }
        return verticalNums;
    };

    // Changes the position of a cell based on a given row, column, and value
    const changePosition = (row, column, value) => {
        board[row][column] = value;
    };

    return { getCellValue, getBoardState, getRow, getColumn, changePosition };
})();

// This IIFE module pattern handles all the game logic itself. It is NOT concerned with player input right now
const game = (function () {

})();


console.log(`The board state is:`);
gameBoard.getBoardState();