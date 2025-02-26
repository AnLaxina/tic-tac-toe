// Gameboard Object via an IIFE module pattern
const gameBoard = (function () {

    const board =
        [[0, 0, 0],
        [0, 0, 0],
        [0, 1, 0]];

    const getBoardPosition = (row, column) => board[row][column];
    const getBoardState = () => {
        let boardState = "";
        for (let row = 0; row < board.length; row++) {
            boardState += getRow(row).join("|") + "\n";
        }
        console.log(boardState);
    };
    const getRow = (row) => board[row];
    const getColumn = (column) => {
        const verticalNums = [];
        for (let row = 0; row < board.length; row++) {
            verticalNums.push(board[row][column]);
        }
        return verticalNums;
    };
    const changePosition = (row, column, value) => {
        board[row][column] = value;
    };

    return { getBoardPosition, getBoardState, getRow, getColumn, changePosition };
})();

// This IIFE module pattern handles all the game logic itself. It is NOT concerned with player input right now
const game = (function () {

})();


console.log(`The value at [0][0] is: ${gameBoard.getBoardPosition(0, 0)}`);
console.log("Now it's changing...")
gameBoard.changePosition(2, 2, "X");
console.log(`Now the value at [0][0] is: ${gameBoard.getBoardPosition(0, 0)}`);
console.log(`Now the board state is:`);
gameBoard.getBoardState();