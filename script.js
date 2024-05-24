// script.js
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    
    // Delay hiding the preloader by 4 seconds
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 4000);

    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const scoreXText = document.getElementById('score-x');
    const scoreOText = document.getElementById('score-o');
    const playUserButton = document.getElementById('play-user');
    const playComputerButton = document.getElementById('play-computer');
    let isXTurn = true;
    let board = Array(9).fill(null);
    let scoreX = 0;
    let scoreO = 0;
    let isComputer = false;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    playUserButton.addEventListener('click', () => startGame(false));
    playComputerButton.addEventListener('click', () => startGame(true));

    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    restartButton.addEventListener('click', restartGame);

    function startGame(computer) {
        isComputer = computer;
        restartGame();
    }

    function handleCellClick(cell) {
        const index = cell.dataset.index;
        if (board[index] || checkWinner()) return;

        board[index] = isXTurn ? 'X' : 'O';
        cell.textContent = board[index];
        cell.classList.add('clicked');

        if (checkWinner()) {
            statusText.textContent = `${board[index]} wins!`;
            updateScore(board[index]);
        } else if (board.every(cell => cell)) {
            statusText.textContent = 'Draw!';
        } else {
            isXTurn = !isXTurn;
            statusText.textContent = `${isXTurn ? 'X' : 'O'}'s turn`;
            if (isComputer && !isXTurn) {
                setTimeout(computerMove, 1000); // Delay computer move by 1 second
            }
        }
    }

    function checkWinner() {
        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    function updateScore(winner) {
        if (winner === 'X') {
            scoreX++;
            scoreXText.textContent = `Player X: ${scoreX}`;
        } else {
            scoreO++;
            scoreOText.textContent = `Player O: ${scoreO}`;
        }
    }

    function restartGame() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('clicked');
            cell.classList.remove('computer-move');
        });
        isXTurn = true;
        statusText.textContent = "X's turn";
    }

    function computerMove() {
        const bestMove = getBestMove();
        board[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
        cells[bestMove].classList.add('computer-move');

        if (checkWinner()) {
            statusText.textContent = `O wins!`;
            updateScore('O');
        } else if (board.every(cell => cell)) {
            statusText.textContent = 'Draw!';
        } else {
            isXTurn = true;
            statusText.textContent = "X's turn";
        }
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(board, depth, isMaximizing) {
        const scores = {
            'O': 1,
            'X': -1,
            'draw': 0
        };

        let result = checkWinnerMinimax();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinnerMinimax() {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (board.every(cell => cell !== null)) {
            return 'draw';
        }
        return null;
    }
});
