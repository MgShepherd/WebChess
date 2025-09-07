// @ts-check

const BOARD_DIMENSION = 8;
const BOARD_SIZE = BOARD_DIMENSION * BOARD_DIMENSION;

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

/** @type {(Piece|null)[]} */
const board = Array(BOARD_SIZE).fill(null);

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
				const isWhiteSquare = (row + col) % 2 == 0;
				square.style.backgroundColor = isWhiteSquare ? 'white' : 'black';
				boardElement.appendChild(square);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	createBoard();
});
