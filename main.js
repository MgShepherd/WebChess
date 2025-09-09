// @ts-check

const BOARD_DIMENSION = 8;

/**
 * @enum {string}
 */
const Piece = {
	PAWN: "pawn",
	ROOK: "rook",
	KNIGHT: "knight",
	BISHOP: "bishop",
	QUEEN: "queen",
	KING: "king"
};

/**
 * @typedef {Object} BoardSquare
 * @property {Piece|null} piece
 * @property {boolean} active
 * @property {string} color
 */

/**
 * Creates a new instance of the BoardSquare type
 * @param {string} color - The color of the current square
 * @returns {BoardSquare} - The new BoardSquare instance
 */
function createBoardSquare(color) {
	return {
		piece: null,
		active: false,
		color
	};
}

/** @type {(BoardSquare)[][]} */
let board = Array.from({ length: BOARD_DIMENSION }, () => Array(BOARD_DIMENSION));
/** @type {number[]} */
let activeIdxs = [];

/**
 * Clears all the previous active squares
 */
function clearPreviousActive() {
	activeIdxs.forEach((idx) => {
		let row = Math.floor(idx / BOARD_DIMENSION);
		let col = idx - (row * BOARD_DIMENSION);

		board[row][col].active = false;
		let boardSquare = document.getElementById(`Square${row}${col}`);
		if (boardSquare != null) {
			boardSquare.style.backgroundColor = board[row][col].color;
		}
	})
	activeIdxs = [];
}

/**
 * Performs required updates when one of the board squares has been clicked
 * @param {EventTarget} target - The event where the 
 * @param {number} row - The row of the square that was clicked
 * @param {number} col - The col of the square that was clicked
 */
function handleSquareClicked(target, row, col) {
	clearPreviousActive();
	board[row][col].active = true;
	activeIdxs.push(row * BOARD_DIMENSION + col);
	if (target instanceof HTMLElement) {
		target.style.backgroundColor = 'red';
	}
}

/**
 * Creates and renders the board
 */
function createBoard() {
	const boardElement = document.getElementById("board");

	if (boardElement != null) {
		for (let row = 0; row < BOARD_DIMENSION; row++) {
			for (let col = 0; col < BOARD_DIMENSION; col++) {
				const square = document.createElement("div");
				square.classList.add('boardSquare');
				square.id = `Square${row}${col}`;
				square.addEventListener("click", (event) => {
					if (event.target != null) {
						handleSquareClicked(event.target, row, col)
					}
				});
				const color = (row + col) % 2 == 0 ? 'white' : 'black';
				board[row][col] = createBoardSquare(color);
				square.style.backgroundColor = color;
				boardElement.appendChild(square);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	createBoard();
});
