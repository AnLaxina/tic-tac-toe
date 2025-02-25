// Gameboard Object via an IIFE module pattern
const gameBoard = (function () {

    const board =
        [[0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]];

    const sayHello = (greeting) => console.log(`${greeting}, nice to meet you!`);
    const getBoardPosition = (row, column) => board[row][column];

    return { sayHello, getBoardPosition };
})();


gameBoard.sayHello("Hi!");
console.log(gameBoard.getBoardPosition(0, 0));