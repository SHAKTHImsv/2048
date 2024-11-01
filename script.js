const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset');
let score = 0;
let tiles = Array(16).fill(null); // Initialize a 4x4 grid

// Initialize the game
function initGame() {
    score = 0;
    scoreDisplay.textContent = score;
    tiles.fill(null); // Reset the tiles
    generateTile();
    generateTile();
    updateBoard();
}

// Generate a new tile (2 or 4) in a random empty position
function generateTile() {
    const emptyIndices = tiles.map((tile, index) => (tile === null ? index : null)).filter(index => index !== null);
    if (emptyIndices.length === 0) return; // No empty space
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    tiles[randomIndex] = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2
}

// Update the board display
function updateBoard() {
    board.innerHTML = '';
    tiles.forEach((value) => {
        const tileDiv = document.createElement('div');
        tileDiv.className = 'tile ' + (value ? 'x' + value : '');
        tileDiv.textContent = value !== null ? value : '';
        board.appendChild(tileDiv);
    });
    scoreDisplay.textContent = score;
}

// Reset the game
resetButton.addEventListener('click', initGame);

// Handle keyboard input
document.addEventListener('keydown', handleKeyDown);

// Handle swipe events for mobile
let touchStartX = 0;
let touchStartY = 0;

board.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

board.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    let moved = false;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        moved = deltaX > 0 ? moveRight() : moveLeft();
    } else {
        moved = deltaY > 0 ? moveDown() : moveUp();
    }

    if (moved) {
        generateTile(); // Generate a new tile only if a move occurred
        updateBoard(); // Update the display
    }
});

// Handle keyboard input for desktop
function handleKeyDown(event) {
    let moved = false;
    if (event.key === 'ArrowUp') {
        moved = moveUp();
    } else if (event.key === 'ArrowDown') {
        moved = moveDown();
    } else if (event.key === 'ArrowLeft') {
        moved = moveLeft();
    } else if (event.key === 'ArrowRight') {
        moved = moveRight();
    }

    if (moved) {
        generateTile(); // Generate a new tile only if a move occurred
        updateBoard(); // Update the display
    }
}

// Move tiles up
function moveUp() {
    return moveOrMerge(0, 4, 1); // Start from the top of each column
}

// Move tiles down
function moveDown() {
    return moveOrMerge(12, -4, -1); // Start from the bottom of each column
}

// Move tiles left
function moveLeft() {
    return moveOrMerge(0, 1, 4); // Start from the left of each row
}

// Move tiles right
function moveRight() {
    return moveOrMerge(3, 1, -4); // Start from the right of each row
}

// Move and merge tiles based on the direction
function moveOrMerge(startIndex, step, limit) {
    let moved = false;

    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            const index = startIndex + i * step + j * (step === 1 ? 1 : 0);
            if (tiles[index]) row.push(tiles[index]);
        }

        const newRow = mergeTiles(row);
        for (let j = 0; j < 4; j++) {
            const index = startIndex + i * step + j * (step === 1 ? 1 : 0);
            if (tiles[index] !== newRow[j]) moved = true;
            tiles[index] = newRow[j] || null;
        }
    }
    return moved;
}

// Merge tiles in a row/column
function mergeTiles(row) {
    const merged = [];
    let skip = false;

    for (let i = 0; i < row.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }

        if (row[i] === row[i + 1]) {
            merged.push(row[i] * 2);
            score += row[i] * 2; // Update score
            skip = true; // Skip the next tile
        } else {
            merged.push(row[i]);
        }
    }

    while (merged.length < 4) {
        merged.push(null); // Fill with nulls to maintain the row length
    }
    return merged;
}

// Start the game
initGame();
