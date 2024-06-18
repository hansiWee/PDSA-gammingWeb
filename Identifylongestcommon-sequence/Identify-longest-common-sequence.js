let s1, s2, lcsString;

function randomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function LCS(X, Y) {
    let m = X.length;
    let n = Y.length;
    let L = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0 || j === 0) {
                L[i][j] = 0;
            } else if (X[i - 1] === Y[j - 1]) {
                L[i][j] = L[i - 1][j - 1] + 1;
            } else {
                L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
            }
        }
    }

    let index = L[m][n];
    let lcs = Array(index + 1).fill('');
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (X[i - 1] === Y[j - 1]) {
            lcs[index - 1] = X[i - 1];
            i--; j--; index--;
        } else if (L[i - 1][j] > L[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return lcs.join('');
}

function newGame() {
    s1 = randomString(10);
    s2 = randomString(10);
    lcsString = LCS(s1, s2);

    document.getElementById('string1').innerHTML = splitToBoxes(s1);
    document.getElementById('string2').innerHTML = splitToBoxes(s2);
    document.getElementById('answer').value = '';
    document.getElementById('message').textContent = '';
    console.log(lcsString);
}

function splitToBoxes(str) {
    return str.split('').map(letter => `<span class="letter-box">${letter}</span>`).join('');
}


function checkAnswer() {
    let answer = document.getElementById('answer').value;
    let playerName = document.getElementById('playerName').value;

    if (!playerName) {
        alert('Please enter your name!');
        return;
    }

    if (answer === lcsString) {
        document.getElementById('message').textContent = 'Correct!';
    } else {
        document.getElementById('message').textContent = 'Wrong. Try Again!';
    }

    saveResultToDatabase(playerName, answer);
}


function saveResultToDatabase(playerName, userAnswer) {
    const isCorrect = userAnswer === lcsString;
    fetch('/setdataforLongestcommonsequence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player: playerName,
            userResponce: userAnswer,
            correctresponce: lcsString,
            isCorrect: isCorrect ? 1 : 0
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


newGame();
