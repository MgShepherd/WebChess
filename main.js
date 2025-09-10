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
 * @enum {string}
 */
const Color = {
	BLACK: "black",
	WHITE: "white"
}

/**
 * Gets the background color based on the piece color provided
 * @param {Color} color - The piece color
 * @returns {string} - The background color to use
 */
function getBackgroundColor(color) {
	switch (color) {
		case Color.WHITE: return "#f0d9b5";
		case Color.BLACK: return "#b58863";
		default: throw new Error(`Unknown Color value encountered: ${color}. This should not be possible`);
	}
}

/**
 * @typedef {Object} BoardSquare
 * @property {Piece|null} piece
 * @property {boolean} active
 * @property {Color} color
 */

/** @type {(BoardSquare)[][]} */
let board = Array.from({ length: BOARD_DIMENSION }, () => Array(BOARD_DIMENSION));
/** @type {number[]} */
let activeIdxs = [];

/**
 * Performs required updates when one of the board squares has been clicked
 * @param {EventTarget} target - The event where the 
 * @param {number} row - The row of the square that was clicked
 * @param {number} col - The col of the square that was clicked
 */
function handleSquareClicked(target, row, col) {
	activeIdxs.push(row * BOARD_DIMENSION + col);
	if (target instanceof HTMLElement) {
		target.style.backgroundColor = 'red';
	}
}

/**
 * Adds the specified piece onto a board location
 * @param {Piece} piece - Which chess piece we are wanting to add
 * @param {Color} color - Whether this is a black or white piece
 * @returns {HTMLImageElement} - The created piece image
 */
function createPieceImg(piece, color) {
	const pieceImg = document.createElement("img");
	pieceImg.src = `public/pieces/${piece}${color}.svg`;
	return pieceImg;
}


/**
 * Creates the piece to go at a specified location on the back row
 * @param {number} col - The column index where we are adding the piece
 * @param {Color} color - Whether this is a black or white piece
 * @returns {HTMLImageElement} - The created piece image
 */
function createBackRowElement(col, color) {
	switch (col) {
		case 0:
		case BOARD_DIMENSION - 1:
			return createPieceImg(Piece.ROOK, color);
		case 1:
		case BOARD_DIMENSION - 2:
			return createPieceImg(Piece.KNIGHT, color);
		case 2:
		case BOARD_DIMENSION - 3:
			return createPieceImg(Piece.BISHOP, color);
		case 3:
			return createPieceImg(Piece.QUEEN, color);
		case 4:
			return createPieceImg(Piece.KING, color);
		default:
			throw new Error(`Unexpected column number ${col} encounted. This should not be possible`);
	}
}

/**
 * Creates the Piece for specific board square
 * @param {number} row - The row number of the current square
 * @param {number} col - The col number of the current square
 * @returns {HTMLImageElement | null} - The created piece image, or null if none should be added
 */
function getPieceForSquare(row, col) {
	if (row == BOARD_DIMENSION - 2) {
		return createPieceImg(Piece.PAWN, Color.WHITE);
	} else if (row == 1) {
		return createPieceImg(Piece.PAWN, Color.BLACK);
	} else if (row == BOARD_DIMENSION - 1) {
		return createBackRowElement(col, Color.WHITE);
	} else if (row == 0) {
		return createBackRowElement(col, Color.BLACK);
	}
	return null;
}

/**
 * Creates specific square on the board
 * @param {number} row - The row number of the square to create
 * @param {number} col - The col number of the square to create
 * @returns {HTMLDivElement} - The created board square
 */
function createBoardSquare(row, col) {
	const square = document.createElement("div");
	square.classList.add('boardSquare');
	square.id = `Square${row}${col}`;
	square.addEventListener("click", (event) => {
		if (event.target != null) {
			handleSquareClicked(event.target, row, col)
		}
	});
	const color = (row + col) % 2 == 0 ? Color.WHITE : Color.BLACK;
	square.style.backgroundColor = getBackgroundColor(color);

	let piece = getPieceForSquare(row, col);
	if (piece != null) {
		square.appendChild(piece);
	}
	return square;
}

/**
 * Creates and renders the board
 */
function createBoard() {
	const boardElement = document.getElementById("board");

	if (boardElement != null) {
		for (let row = 0; row < BOARD_DIMENSION; row++) {
			for (let col = 0; col < BOARD_DIMENSION; col++) {
				boardElement.appendChild(createBoardSquare(row, col));
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	createBoard();
});
