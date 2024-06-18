const cities = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let graph = Array(10).fill().map(() => Array(10).fill(0));
let openCity;

function assignRandomDistances() {
    for (let i = 0; i < 10; i++) {
        for (let j = i + 1; j < 10; j++) {
            const distance = Math.floor(Math.random() * 46) + 5; 
            graph[i][j] = distance;
            graph[j][i] = distance;
        }
    }
}

function createTabel() {
    const distanceTableDiv = document.getElementById('distanceTable');
    let tableHTML = "<table border='1'>";
    tableHTML += "<thead><tr><th>City</th>";
    for (let city of cities) {
        tableHTML += `<th><img src="img/${city}.PNG" alt="${city}" width="150" height="150"><div>${city}</div></th>`;
    }
    tableHTML += "</tr></thead>";
    tableHTML += "<tbody>";
    for (let i = 0; i < cities.length; i++) {
        tableHTML += `<tr><td><img src="img/${cities[i]}.PNG" alt="${cities[i]}" width="150" height="150"><div>${cities[i]}</div></td>`;
        for (let j = 0; j < cities.length; j++) {
            if (i === j) {
                tableHTML += '<td>-</td>';
            } else if (j > i) {
                tableHTML += `<td>${graph[i][j]} km</td>`;
            } else {
                tableHTML += '<td></td>';  // Empty cell
            }
        }
        tableHTML += "</tr>";
    }
    tableHTML += "</tbody></table>";
    distanceTableDiv.innerHTML = tableHTML;
}

function createAnswerInputs() {
    const answerSectionDiv = document.getElementById('answerSection');
    let inputHTML = '<div class="answer-inputs">';
    for (let i = 0; i < cities.length; i++) {
        if (i !== openCity) {
            inputHTML += `<div class="city-input"><img src="IdentifyShortestPathSource/${cities[i]}.jpg" alt="${cities[i]}" width="100" height="100"><input type="text" id="distanceTo${i}" placeholder="Distance to ${cities[i]}"></div>`;
        }
    }
    inputHTML += '</div>';
    answerSectionDiv.innerHTML = inputHTML;
}

function startGame() {
    assignRandomDistances();
    openCity = Math.floor(Math.random() * 10);
    const startCityImageElem = document.getElementById("startCityImg");
    startCityImageElem.src = `IdentifyShortestPathSource/${cities[openCity]}.jpg`;
    startCityImageElem.alt = cities[openCity];
    createTabel();
    createAnswerInputs();
    document.getElementById("gameArea").style.display = "block";
}

function dijkstra(source) {
    const n = graph.length;
    const visited = Array(n).fill(false);
    const dist = Array(n).fill(Number.POSITIVE_INFINITY);
    dist[source] = 0;
    for (let count = 0; count < n - 1; count++) {
        let u = -1;
        for (let i = 0; i < n; i++) {
            if (!visited[i] && (u === -1 || dist[i] < dist[u])) {
                u = i;
            }
        }
        visited[u] = true;
        for (let v = 0; v < n; v++) {
            if (!visited[v] && graph[u][v] && dist[u] !== Number.POSITIVE_INFINITY && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
    return dist;
}

function bellmanFord(source) {
    const n = graph.length;
    const dist = Array(n).fill(Number.POSITIVE_INFINITY);
    dist[source] = 0;
    for (let i = 1; i < n; i++) {
        for (let u = 0; u < n; u++) {
            for (let v = 0; v < n; v++) {
                if (graph[u][v] && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                }
            }
        }
    }
    for (let u = 0; u < n; u++) {
        for (let v = 0; v < n; v++) {
            if (graph[u][v] && dist[u] + graph[u][v] < dist[v]) {
                console.error("Graph contains a negative-weight cycle");
                return;
            }
        }
    }
    return dist;
}

function submitAnswers() {
    console.log("Submit button clicked");  // Log here

    const correctDistances = dijkstra(openCity);
    let userDistances = [];
    let correctCount = 0;

    for (let i = 0; i < cities.length; i++) {
        if (i !== openCity) {
            const inputValue = document.getElementById(`distanceTo${i}`).value;
            
            if (isNaN(inputValue) || inputValue === '') {
                alert("Please enter valid numbers for all distances.");
                return;
            }

            const userAnswer = parseInt(inputValue, 10);
            userDistances.push(userAnswer);

            if (userAnswer === correctDistances[i]) {
                correctCount++;
            }
        }
    }

    const resultDiv = document.getElementById("result");
    if (correctCount === cities.length - 1) {
        resultDiv.textContent = "All answers are correct!";
    } else {
        let incorrectCount = cities.length - 1 - correctCount;
        resultDiv.textContent = `${correctCount} cities are correct. ${incorrectCount} cities left to answer correctly.`;
    }

      console.log("About to save to database");  
    saveResultToDatabase(playerName, userDistances, correctDistances);

}

function saveResultToDatabase(playerName, userDistances, correctDistances) {
    const isCorrect = JSON.stringify(userDistances) === JSON.stringify(correctDistances);

    fetch('/setdataforidentifyShortestPath', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
             name: playerName,
            distancetoA: userDistances[0],
            distancetoB: userDistances[1],
            distancetoC: userDistances[2],
            distancetoD: userDistances[3],
            distancetoE: userDistances[4],
            distancetoF: userDistances[5],
            distancetoG: userDistances[6],
            distancetoH: userDistances[7],
            distancetoI: userDistances[8],
            distancetoJ: userDistances[9],
            isCorrect: isCorrect ? 1 : 0
        })
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
        alert("Error saving data. Please try again.");
    });
}

window.onload = startGame;
