//Fichier vide pour l'instant
var mysql = require('mysql');

//R�cup�rer la config du bot 
const config = require('../config/config')

var con = mysql.createConnection({
    host: config.bdd.hostname,
    user: config.bdd.username,
    password: config.bdd.password
    database: config.bdd.database
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
});