// @ts-check

const BOARD_DIMENSION = 8;

/**
 * @enum {string}
 */
const PieceType = {
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
 * @typedef {Object} Piece
 * @property {PieceType} type
 * @property {Color} color
 */

/**
 * @typedef {Object} BoardSquare
 * @property {Piece|null} piece
 * @property {Color} color
 */

/**
 * Gets the background color based on the square color provided
 * @param {Color} color - The square color
 * @returns {string} - The background color to use
 */
function getBackgroundColor(color) {
	switch (color) {
		case Color.WHITE: return "#f0d9b5";
		case Color.BLACK: return "#b58863";
		default: throw new Error(`Unknown Color value encountered: ${color}. This should not be possible`);
	}
}

/** @type {(BoardSquare)[][]} */
let board = Array.from({ length: BOARD_DIMENSION }, () => Array(BOARD_DIMENSION));
/** @type {number} */
let activeIdx = -1;

/**
 * Performs required updates when one of the board squares has been clicked
 * @param {EventTarget} target - The event where the 
 * @param {number} row - The row of the square that was clicked
 * @param {number} col - The col of the square that was clicked
 */
function handleSquareClicked(target, row, col) {
	if (activeIdx != -1) {
		let activeRow = Math.floor(activeIdx / BOARD_DIMENSION);
		let activeCol = activeIdx - (activeRow * BOARD_DIMENSION);
		let activeSquare = document.getElementById(`Square${activeRow}${activeCol}`);
		if (activeSquare != null) {
			activeSquare.style.backgroundColor = getBackgroundColor(board[activeRow][activeCol].color);
		}
	}
	if (target instanceof HTMLElement) {
		target.style.backgroundColor = 'red';
		activeIdx = row * BOARD_DIMENSION + col;
	}
}

/**
 * Adds the specified piece onto a board location
 * @param {Piece} piece - Which chess piece we are wanting to add
 * @returns {HTMLImageElement} - The created piece image
 */
function createPieceImg(piece) {
	const pieceImg = document.createElement("img");
	pieceImg.style.backgroundColor = 'transparent';
	pieceImg.style.pointerEvents = "none";
	pieceImg.src = `public/pieces/${piece.type}${piece.color}.svg`;
	return pieceImg;
}


/**
 * Creates the piece to go at a specified location on the back row
 * @param {number} col - The column index where we are adding the piece
 * @param {Color} color - Whether this is a black or white piece
 * @returns {Piece} - The created piece image
 */
function createBackRowElement(col, color) {
	let pieceType = PieceType.PAWN;
	switch (col) {
		case 0:
		case BOARD_DIMENSION - 1:
			pieceType = PieceType.ROOK;
			break;
		case 1:
		case BOARD_DIMENSION - 2:
			pieceType = PieceType.KNIGHT;
			break;
		case 2:
		case BOARD_DIMENSION - 3:
			pieceType = PieceType.BISHOP;
			break;
		case 3:
			pieceType = PieceType.QUEEN;
			break;
		case 4:
			pieceType = PieceType.KING;
			break;
		default:
			throw new Error(`Unexpected column number ${col} encounted. This should not be possible`);
	}
	return { type: pieceType, color };
}

/**
 * Creates the Piece for specific board square
 * @param {number} row - The row number of the current square
 * @param {number} col - The col number of the current square
 * @returns {Piece | null} - The created piece image, or null if none should be added
 */
function createPieceForSquare(row, col) {
	if (row == BOARD_DIMENSION - 2) {
		return { type: PieceType.PAWN, color: Color.WHITE };
	} else if (row == 1) {
		return { type: PieceType.PAWN, color: Color.BLACK };
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

	let piece = createPieceForSquare(row, col);
	board[row][col] = {
		piece,
		color
	};
	if (piece != null) {
		square.appendChild(createPieceImg(piece));
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
