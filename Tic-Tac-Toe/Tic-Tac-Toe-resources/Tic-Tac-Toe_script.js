let currentPlayer = 'X';
const cells = document.querySelectorAll('.cell');

function makeMove(cell) {
    if (cell.textContent === '') {
        cell.textContent = currentPlayer;
       let board = [...cells].map(cell => cell.textContent);
setTimeout(() => {
        let board = [...cells].map(cell => cell.textContent);
        if (checkWin(board)) {
            showMessage('O wins!');
            saveResultToDatabase('O', 1);
            resetGame();
            return;
        }
        if (checkDraw()) {
            showMessage('It\'s a draw!');
            saveResultToDatabase('O', 0);
            resetGame();
            return;
        }
        currentPlayer = 'X';
    }, 500); 
        computerPlay();
    }
}

function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
}

function resetGame() {
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
}

function computerPlay() {
    let bestScore = -Infinity;
    let move;

    cells.forEach((cell, index) => {
        if (cell.textContent === '') {
            cell.textContent = 'O';
            let boardCopy = [...cells].map(c => c.textContent);
            let score = minimax(boardCopy, 0, false);
            cell.textContent = '';
            if(score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    cells[move].textContent = 'O';
   setTimeout(() => {
        let board = [...cells].map(cell => cell.textContent);
        if (checkWin(board)) {
            showMessage('O wins!');
            saveResultToDatabase('O', 1);
            resetGame();
            return;
        }
        if (checkDraw()) {
            showMessage('It\'s a draw!');
            saveResultToDatabase('O', 0);
            resetGame();
            return;
        }
        currentPlayer = 'X';
    }, 500); 
}

function checkWin(board) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for(let combo of winCombos) {
        if (board[combo[0]] !== '' &&
            board[combo[0]] === board[combo[1]] &&
            board[combo[0]] === board[combo[2]]) {
            return true;
        }
    }
    return false;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(board)) {
        return isMaximizing ? -10 + depth : 10 - depth;
    }
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'O';
                let score = minimax(board, depth + 1, false);
                board[index] = '';
                if(score > bestScore) {
                    bestScore = score;
                }
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'X';
                let score = minimax(board, depth + 1, true);
                board[index] = '';
                if(score < bestScore) {
                    bestScore = score;
                }
            }
        });
        return bestScore;
    }
}

function showMessage(msg) {
    document.getElementById('message-text').textContent = msg;
    document.getElementById('message-box').classList.remove('hidden');
}

function closeMessage() {
    document.getElementById('message-box').classList.add('hidden');
    resetGame();
}

function saveResultToDatabase(player, isCorrect) {
    if (!player) {
        alert("Please set your player name to save results.");
        return;
    }

    const data = {
        player: player,
        isCorrect: isCorrect
    };

  
    fetch('/setdataforTicTacToe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
