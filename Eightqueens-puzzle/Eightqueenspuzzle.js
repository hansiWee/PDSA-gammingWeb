let solutions = [];
let chessBoard = new Array(8).fill(0).map(() => new Array(8).fill(0));
const chessIcon = document.querySelector('.board');
let gameStatus;
let gameUsername = localStorage.getItem('gameUsername') || null;

function initializeBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
            cell.addEventListener('click', function() {
                cell.classList.toggle('queen');
                chessBoard[i][j] = chessBoard[i][j] === 0 ? 1 : 0;
            });
            chessIcon.appendChild(cell);
        }
    }
}


function backTracAlgo(board, col) {
    if (col >= 8) {
        solutions.push(board.map(row => row.slice()));  
        return;
    }

    for (let i = 0; i < 8; i++) {
        if (validationFun(board, i, col)) {
            board[i][col] = 1;
            backTracAlgo(board, col + 1);
            board[i][col] = 0;  
        }
    }
}


function validationFun(board, row, col) {
    for (let i = 0; i < col; i++) {
        if (board[row][i]) return false;
        if (row - (col - i) >= 0 && board[row - (col - i)][i]) return false;
        if (row + (col - i) < 8 && board[row + (col - i)][i]) return false;
    }
    return true;
}


function checkUsersAnswer() {

    if(!gameUsername) {
    alert("Please log in to play the game.");
    return;
}

    const TOTQueens = chessBoard.flat().filter(cell => cell === 1).length;
    const messageBox = document.querySelector('.message-box');

    if (TOTQueens !== 8) {
        messageBox.textContent = `You have placed ${TOTQueens} queens. Please place all 8 queens.`;
        gameStatus = "false"
        return;
    }

    const userSolutionString = chessBoard.flat().join('');
    for (let sol of solutions) {
        if (sol.flat().join('') === userSolutionString) {
            messageBox.textContent = 'Congratulations!';
            gameStatus = "true"
            return;
        }
    }
    
    messageBox.textContent = 'Some queens are placed incorrectly. Try again.';

    if (sol.flat().join('') === userSolutionString) {
        messageBox.textContent = 'Congratulations!';

        saveToDatabase(gameUsername, true);

        return;
    }
    
    messageBox.textContent = 'Some queens are placed incorrectly. Try again.';
    
    (gameUsername, gameStatus === "true");

}

function saveToDatabase(gameUsername, gameStatus) {
    fetch('/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player: gameUsername,
            isCorrect: gameStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



const tempBoard = new Array(8).fill(0).map(() => new Array(8).fill(0));
backTracAlgo(tempBoard, 0);
initializeBoard();

