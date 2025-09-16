// @ts-check

const BOARD_DIMENSION = 8;
const POTENTIAL_MOVE_COLOR = "green";
const ACTIVE_COLOR = "red";

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
};

/**
 * @typedef {Object} Position
 * @property {number} row
 * @property {number} col
 */

/**
 * @typedef {Object} Piece
 * @property {PieceType} type
 * @property {Color} color
 */

/**
 * @typedef {Object} BoardSquare
 * @property {Piece|null} piece
 * @property {boolean} active
 * @property {boolean} moveable
 * @property {string} backgroundColor
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
/** @type {Position | null} */
let activePos = null;
/** @type {(Position)[]} */
let moveablePositions = [];

/**
 * Checks that a given location would be a valid move and if so will highlight the square
 * @param {number} row - The row number of the potential move
 * @param {number} col - The col number of the potential move
 * @param {Color} pieceColor - The color of the selected piece
 * @returns {boolean} - Whether to continue checking for available moves in this direction
 */
function checkAndSetPotentialMove(row, col, pieceColor) {
	if (row >= 0 && row < BOARD_DIMENSION && col >= 0 && col < BOARD_DIMENSION) {
		let element = document.getElementById(`Square${row}${col}`);
		if (element != null && (board[row][col].piece == null || pieceColor != board[row][col].piece.color)) {
			element.style.backgroundColor = POTENTIAL_MOVE_COLOR;
			board[row][col].moveable = true;
			moveablePositions.push({ row, col });
			return board[row][col].piece == null;
		}
	}
	return false;
}

/**
 * Displays the possible set of moves from a pawn at the current position
 * @param {Color} color - The color of the piece
 * @param {number} row - The row number the piece is at
 * @param {number} col - The col number the piece is at
 */
function displayPawnMoves(color, row, col) {
	if (color == Color.WHITE) {
		checkAndSetPotentialMove(row - 1, col, color);
	} else {
		checkAndSetPotentialMove(row + 1, col, color);
	}
}

/**
 * Displays all the moves in a specified direction
 * @param {number} row - The starting row number
 * @param {number} col - The starting col number
 * @param {number} rowDir - The row movement direction (1, 0 or -1)
 * @param {number} colDir - The col movement direction (1, 0 or -1)
 * @param {Color} color - The color of the piece
 */
function displayMovesInDirection(row, col, rowDir, colDir, color) {
	for (let i = 1; i < BOARD_DIMENSION; i++) {
		if (!checkAndSetPotentialMove(row - i * rowDir, col - i * colDir, color)) {
			return;
		}
	}
}

/**
 * Displays the possible set of moves from a rook at the current position
 * @param {number} row - The row number the piece is at
 * @param {number} col - The col number the piece is at
 * @param {Color} color - The color of the piece
 */
function displayRookMoves(row, col, color) {
	displayMovesInDirection(row, col, -1, 0, color);
	displayMovesInDirection(row, col, 1, 0, color);
	displayMovesInDirection(row, col, 0, -1, color);
	displayMovesInDirection(row, col, 0, 1, color);
}

/**
 * Displays the possible set of moves from a knight at the current position
 * @param {number} row - The row number the piece is at
 * @param {number} col - The col number the piece is at
 * @param {Color} color - The color of the piece
 */
function displayKnightMoves(row, col, color) {
	for (let i = 1; i <= 2; i++) {
		let colAmount = i == 1 ? 2 : 1;
		checkAndSetPotentialMove(row - i, col - colAmount, color);
		checkAndSetPotentialMove(row - i, col + colAmount, color);
		checkAndSetPotentialMove(row + i, col - colAmount, color);
		checkAndSetPotentialMove(row + i, col + colAmount, color);
	}
}

/**
 * Displays the possible set of moves from a bishop at the current position
 * @param {number} row - The row number the piece is at
 * @param {number} col - The col number the piece is at
 * @param {Color} color - The color of the piece
 */
function displayBishopMoves(row, col, color) {
	displayMovesInDirection(row, col, 1, 1, color);
	displayMovesInDirection(row, col, -1, 1, color);
	displayMovesInDirection(row, col, -1, -1, color);
	displayMovesInDirection(row, col, 1, -1, color);
}

/**
 * Displays the possible set of moves from a queen at the current position
 * @param {number} row - The row number the piece is at
 * @param {number} col - The col number the piece is at
 * @param {Color} color - The color of the piece
 */
function displayQueenMoves(row, col, color) {
	displayBishopMoves(row, col, color);
	displayRookMoves(row, col, color);
}

/**
 * Displays the possible set of moves from a king at the current position
 * @param {number} row - The row number the piece is at
 * @param {number} col - The col number the piece is at
 * @param {Color} color - The color of the piece
 */
function displayKingMoves(row, col, color) {
	for (let r = row - 1; r <= row + 1; r++) {
		for (let c = col - 1; c <= col + 1; c++) {
			if (r != row || c != col) {
				checkAndSetPotentialMove(r, c, color);
			}
		}
	}
}

/**
 * Displays the potential moves for a give Piece Type based on its position
 * @param {Piece} piece - The piece we are displaying the moves for
 * @param {number} row - The row number the piece is at
 * @param {number} col - The col number the piece is at
 */
function displayPotentialMoves(piece, row, col) {
	switch (piece.type) {
		case PieceType.PAWN:
			displayPawnMoves(piece.color, row, col);
			break;
		case PieceType.ROOK:
			displayRookMoves(row, col, piece.color);
			break;
		case PieceType.KNIGHT:
			displayKnightMoves(row, col, piece.color);
			break;
		case PieceType.BISHOP:
			displayBishopMoves(row, col, piece.color);
			break;
		case PieceType.QUEEN:
			displayQueenMoves(row, col, piece.color);
			break;
		case PieceType.KING:
			displayKingMoves(row, col, piece.color);
			break;
		default:
			throw new Error("Unexpected Piece type encountered. This should not be possible");
	}
}

/**
 * Clears the previous active square
 */
function clearPreviousActive() {
	if (activePos != null) {
		let activeSquare = document.getElementById(`Square${activePos.row}${activePos.col}`);
		if (activeSquare != null) {
			activeSquare.style.backgroundColor = board[activePos.row][activePos.col].backgroundColor;
			board[activePos.row][activePos.col].active = false;
		}
		moveablePositions.forEach((pos) => {
			let element = document.getElementById(`Square${pos.row}${pos.col}`);
			if (element != null) {
				element.style.backgroundColor = board[pos.row][pos.col].backgroundColor;
			}
			board[pos.row][pos.col].moveable = false;
		});
		moveablePositions = [];
	}
}

/**
 * Performs required updates when one of the board squares has been clicked
 * @param {HTMLElement} target - The element that was clicked
 * @param {number} row - The row of the square that was clicked
 * @param {number} col - The col of the square that was clicked
 */
function updateActiveState(target, row, col) {
	board[row][col].active = !board[row][col].active;
	clearPreviousActive();

	if (board[row][col].active) {
		target.style.backgroundColor = ACTIVE_COLOR;
		if (board[row][col].piece != null) {
			displayPotentialMoves(board[row][col].piece, row, col);
		}
		activePos = { row, col };
	} else {
		target.style.backgroundColor = board[row][col].backgroundColor;
		activePos = null;
	}
}

/**
 * Performs required updates when one of the board squares has been clicked
 * @param {HTMLElement} target - The element that was clicked
 * @param {number} row - The row of the square that was clicked
 * @param {number} col - The col of the square that was clicked
 */
function moveToSelectedPosition(target, row, col) {
	if (activePos != null) {
		let activeElement = document.getElementById(`Square${activePos.row}${activePos.col}`);
		if (activeElement == null) return;
		let pieceImg = activeElement.children[0];
		activeElement.removeChild(pieceImg);
		board[row][col].piece = board[activePos.row][activePos.col].piece;
		board[activePos.row][activePos.col].piece = null;
		if (target.children.length > 0 && target.firstChild != null) {
			target.removeChild(target.firstChild);
		}
		target.appendChild(pieceImg);
		clearPreviousActive();
		activePos = null;
	}
}

/**
 * Performs required updates when one of the board squares has been clicked
 * @param {EventTarget} target - The element that was clicked
 * @param {number} row - The row of the square that was clicked
 * @param {number} col - The col of the square that was clicked
 */
function handleSquareClicked(target, row, col) {
	if (target instanceof HTMLElement) {
		if (board[row][col].moveable) {
			moveToSelectedPosition(target, row, col);
		} else {
			updateActiveState(target, row, col);
		}
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
	const backgroundColor = getBackgroundColor(color);
	square.style.backgroundColor = backgroundColor;

	let piece = createPieceForSquare(row, col);
	board[row][col] = {
		piece,
		backgroundColor,
		active: false,
		moveable: false
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
		if (screen.availWidth > screen.availHeight) {
			boardElement.style.height = "80%";
		} else {
			boardElement.style.width = "80%";
		}

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
