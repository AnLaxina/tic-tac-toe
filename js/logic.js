// Gameboard Object via an IIFE module pattern
const gameBoard = (function () {

    const board =
        [[0, 0, 0],
        [0, 0, 0],
        [0, 1, 0]];

    const getBoardPosition = (row, column) => board[row][column];
    const getBoardState = () => board;

    const getRow = (row) => board[row];
    const getColumn = (column) => {
        const verticalNums = [];
        for (let row = 0; row < board.length; row++) {
            verticalNums.push(board[row][column]);
        }
        return verticalNums;
    };

    return { getBoardPosition, getBoardState, getRow, getColumn };
})();



console.log(gameBoard.getBoardPosition(0, 0));
console.log(gameBoard.getBoardState());
console.log(gameBoard.getRow(2));
console.log(gameBoard.getColumn(1));