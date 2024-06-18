

var emptyTable = true;
var theKnight = "url('knight_chess_resources/knight_chess.png')";
var piece = "";
var thevalidation = [];
var score = 0;
var gameOver = 2;
let gameUsername = localStorage.getItem('gameUsername') || null;

const KNIGHT_MOVES = [
    [-2, 1], [-1, 2], [1, 2], [2, 1],
    [2, -1], [1, -2], [-1, -2], [-2, -1]
];

function validateElementId(elemId) {
    return document.getElementById(elemId) !== null;
}

function countMoves(x, y) {
    return getMovesFromPosition(x, y).length;
}

function getMovesFromPosition(x, y) {
    return KNIGHT_MOVES.filter(move => {
        let nx = x + move[0];
        let ny = y + move[1];
        return nx >= 0 && nx < 8 && ny >= 0 && ny < 8 &&
               document.getElementById(`elem${nx}${ny}`).style.backgroundColor !== "yellow" &&
               document.getElementById(`elem${nx}${ny}`).style.backgroundColor !== "blue";
    }).map(move => [x + move[0], y + move[1]]);
}

function getNextMoveByWarnsdorff(x, y) {
    let moves = getMovesFromPosition(x, y);
    if (moves.length === 0) return null;
    moves.sort((a, b) => countMoves(a[0], a[1]) - countMoves(b[0], b[1]));
    return moves[0];
}

function SearchOption() {
    var tdRow = parseInt(piece[0]);
    var tdCol = parseInt(piece[1]);
    let possibleMoves = getMovesFromPosition(tdRow, tdCol);

    for (let move of possibleMoves) {
        let elem = `elem${move[0]}${move[1]}`;
        thevalidation.push(elem);
        if(document.getElementById(elem).style.backgroundColor === "white") {
            document.getElementById(elem).style.backgroundColor = "pink";
        } else if(document.getElementById(elem).style.backgroundColor === "black") {
            document.getElementById(elem).style.backgroundColor = "red";
        }
    }
}

function selectedPlace(x) {
    if (typeof x !== 'string' || x.length !== 6) {
        console.error('Invalid input provided');
        return;
    }

    var square = document.getElementById(x);
    if (!validateElementId(x) || !square) {
        console.error('Element not found');
        return;
    }
	var square = document.getElementById(x);
	if(emptyTable)
	{
		emptyTable = false;
		square.style.backgroundImage = theKnight;
		piece = x[4] + x[5];
	}
	else if(x[4] + x[5] == piece)
	{
		SearchOption();
		if(thevalidation.length == 0)
		{
			getGameOverStatus();
		}
	}
	else 
	{
		for(var i=0;i<thevalidation.length;i++)
		{
			if(x==thevalidation[i])
			{
				square = document.getElementById(x);
				square.style.backgroundImage = theKnight;
				score++;
				document.getElementById("score").innerHTML = "Score: " + score + " out of 64.";
				if(square.style.backgroundColor == "red") 
				{
					square.style.backgroundColor = "black";
				}
				else
				{
					square.style.backgroundColor = "white";
				}
				document.getElementById("elem"+piece).style.backgroundImage="";
				if(document.getElementById("elem"+piece).style.backgroundColor == "white")
				{
					document.getElementById("elem"+piece).style.backgroundColor="yellow";
				}
				else if(document.getElementById("elem"+piece).style.backgroundColor == "black")
				{
					document.getElementById("elem"+piece).style.backgroundColor="blue";
				}
				piece = x[4] + x[5];

			}
			else
			{
				if(document.getElementById(thevalidation[i]).style.backgroundColor == "pink")
				{
					document.getElementById(thevalidation[i]).style.backgroundColor="white";
				}
				else if(document.getElementById(thevalidation[i]).style.backgroundColor == "red")
				{
					document.getElementById(thevalidation[i]).style.backgroundColor="black";
				}
			}
		}
		thevalidation = [];
	}
}

function getGameOverStatus()
{
	for(var i =0; i<8; i++)
	{
		for(var j=0;j<8;j++)
		{
			if(document.getElementById("elem"+i+j).style.backgroundColor == "white" ||
				document.getElementById("elem"+i+j).style.backgroundColor == "black")
			{
				document.getElementById("result").innerHTML = "Game Over. You failed to conquer the checkerboard.";
				document.getElementById("result").color = "red";
				gameOver=0;
				break;
			}
		}
	}
	if(gameOver!=0)
	{
		document.getElementById("result").innerHTML = "Congratulations you won!";
		document.getElementById("result").color = "green";

		saveResultToDatabase();
	}
}


function gameRestart()
{
	emptyTable=true;
	piece=""
	thevalidation = [];
	score = 0;
	gameOver=2;
	document.getElementById("score").innerHTML = "Score: ";
	document.getElementById("result").color = "black";
	document.getElementById("result").innerHTML = "";
	for(var i =0; i<8; i++)
	{
		for(var j=0;j<8;j++)
		{
			if (!validateElementId(elemId)) {
                console.error('Element not found');
                continue;
            }
			if(document.getElementById("elem"+i+j).style.backgroundColor == "yellow" ||
				document.getElementById("elem"+i+j).style.backgroundColor == "pink")
			{
				document.getElementById("elem"+i+j).style.backgroundColor = "white";
			}
			else if(document.getElementById("elem"+i+j).style.backgroundColor == "blue" ||
				document.getElementById("elem"+i+j).style.backgroundColor == "red")
			{
				document.getElementById("elem"+i+j).style.backgroundColor = "black";
			}
			document.getElementById("elem"+i+j).style.backgroundImage = "";		
		}
	}
	
}


function saveResultToDatabase() {
    if (!gameUsername) {
        alert("Please log in or set your username to save results.");
        return;
    }

    const data = {
        player: gameUsername,
        moves: piece,
        score: score,
        gameOver: gameOver
    };

    fetch('/setdataforChessGame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function autoPlayWithWarnsdorff(x, y) {
    for (let i = 0; i < 64; i++) {
        if (!getNextMoveByWarnsdorff(x, y)) break;
        let [nx, ny] = getNextMoveByWarnsdorff(x, y);
        document.getElementById(`elem${nx}${ny}`).style.backgroundImage = theKnight;
        document.getElementById(`elem${nx}${ny}`).style.backgroundColor = "yellow";
        [x, y] = [nx, ny];
    }
}

// To start an auto-play based on Warnsdorff's rule, call:
// autoPlayWithWarnsdorff(0, 0);

