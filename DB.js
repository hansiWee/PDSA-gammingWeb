
const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
   host: "localhost",            
    user: "root",                
    password: "T#9758@qlph",     
    database: "games",
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


app.post('/data', (req, res) => {
    let data = req.body;
    var sql = "SET @player = ?;SET @isCorrect = ? \
    CALL eightqueenspuzzle(@player,@isCorrect);";
    mysqlConnection.query(sql, [data.player, data.isCorrect], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].EmpID);
            });
        else
            console.log(err);
    })
});

app.post('/setdataforLongestcommonsequence', (req, res) => {
    let data = req.body;
    var sql = "INSERT INTO longestcommonsequence(player, userResponce, correctresponce, isCorrect) VALUES (?, ?, ?, ?)";
    mysqlConnection.query(sql, [data.player, data.userResponce, data.correctresponce, data.isCorrect], (err, results) => {
        if (!err) {
            res.send('Inserted data successfully: ' + JSON.stringify(data));
        } else {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    })
});


app.post('/setdataforidentifyShortestPath', (req, res) => {
    let data = req.body;
    
    var sql = `INSERT INTO identifyshortestpath(
        name, distancetoA, distancetoB, distancetoC, distancetoD, 
        distancetoE, distancetoF, distancetoG, distancetoH, 
        distancetoI, distancetoJ, isCorrect
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    mysqlConnection.query(sql, [
        data.name, data.distancetoA, data.distancetoB, data.distancetoC,
        data.distancetoD, data.distancetoE, data.distancetoF, data.distancetoG,
        data.distancetoH, data.distancetoI, data.distancetoJ, data.isCorrect
    ], (err, results) => {
        if (!err) {
            res.send('Inserted data successfully: ' + JSON.stringify(data));
        } else {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    })
});


app.post('/setdataforChessGame', (req, res) => {
    let data = req.body;

       var sql = "INSERT INTO chessgame(player, moves, score, gameOver) VALUES (?, ?, ?, ?)";

    mysqlConnection.query(sql, [data.player, data.moves, data.score, data.gameOver], (err, results) => {
        if (!err) {
            res.send('Inserted data successfully: ' + JSON.stringify(data));
        } else {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    });
});


app.post('/setdataforTicTacToe', (req, res) => {
    let data = req.body;
    var sql = "INSERT INTO tictactoe(player, isCorrect) VALUES (?, ?)";
    mysqlConnection.query(sql, [data.player, data.isCorrect], (err, results) => {
        if (!err) {
            res.send('Inserted data successfully: ' + JSON.stringify(data));
        } else {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    })
});
