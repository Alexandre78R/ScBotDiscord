const mysql = require('mysql');

const db = mysql.createConnection({

    host: "localhost",
 
    user: "alex",
 
    password: "",

    database: "SCBOTDISCORD"
 
});


//Create DATABASE
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     db.query("CREATE DATABASE SCBOTDISCORD", function (err, result) {
//       if (err) throw err;
//       console.log("Database created");
//     });
// });

//Create table USER
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!"); 
//     // Pour idNameDiscord obliger BIGINT  vue c'est des id assez important en longeur
//     // je l'ai passer en VARCHAR qui me semblais plus logique vue c'est largement plus de longeur avoir encore pour la limite.
//     //POUR nameGuild --> Obliger de metre 3 pour SC1, SC2, SC3,SC4
//     var sql = `CREATE TABLE USER 
//     (
//         id INT unsigned NOT NULL AUTO_INCREMENT,
//         idNameDiscord BIGINT NOT NULL,
//         nameTagDiscord VARCHAR(100) NOT NULL,
//         nameGuild CHAR(3) NOT NULL,
//         date TIMESTAMP NOT NULL,
//         PRIMARY KEY (id)
//     )`;

//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table created");
//     });
// });

//Insert valeur dans table user
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = `INSERT INTO USER 
//     (
//         id,
//         idNameDiscord,
//         nameTagDiscord,
//         nameGuild,
//         date
//     ) VALUES (
//         1,
//         2727123352845025290,
//         "Alexandre78R2#7666",
//         "SC1",
//         0
//     )`;
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//       console.log(result)
//     });
// });

//Create Table Monster
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = `CREATE TABLE MONSTER
//     (
//         id INT unsigned NOT NULL AUTO_INCREMENT,
//         idMonster INT NOT NULL UNIQUE,
//         nameMonster VARCHAR(100) NOT NULL,
//         date TIMESTAMP NOT NULL,
//         PRIMARY KEY (id)    
//     )`;

//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table created");
//     });
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     //Changer nameMonster pour éviter tous problème de longeur j'ai pris large 100
//     var sql = `INSERT INTO MONSTER 
//     (
//         id,
//         idMonster,
//         nameMonster,
//         date
//     ) VALUES (
//         1,
//         1000112,
//         "Homunculus - Attack (Fire)",
//         0
//     )`;
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//       console.log(result)
//     });
// });


// Create Table Teams
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = `CREATE TABLE TEAM 
//     (
//         id INT unsigned NOT NULL AUTO_INCREMENT,
//         idMob1 INT NOT NULL,
//         idMob2 INT NOT NULL,
//         idMob3 INT NOT NULL,
//         date TIMESTAMP NOT NULL,
//         PRIMARY KEY (id)    
//     )`;

//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table created");
//     });
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = `INSERT INTO TEAM
//     (
//         id,
//         idMob1,
//         idMob2,
//         idMob3,
//         date
//     ) VALUES (
//         1,
//         21411,
//         21412,
//         21413,
//         0
//     )`;
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//       console.log(result)
//     });
// });

//Create Table  Match
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     //Erreur avec le nom match je ne sais pas pk????? ducoup j'ais mis un 2 ... -->
//     // Vous avez une erreur dans votre syntaxe SQL; vérifiez le manuel qui correspond à la version de votre serveur MySQL pour la bonne syntaxe à utiliser near 'match
//     //A voir pour peut-être changer lest INT en BIGINT sur idDefense idOffense, IdUser sir le format deviens énormes
//     var sql = `CREATE TABLE MATCH2
//     (
//         id INT unsigned NOT NULL AUTO_INCREMENT,
//         idDefense INT NOT NULL,
//         idOffense INT NOT NULL,
//         idUSER INT NOT NULL,
//         result BOOLEAN,
//         date TIMESTAMP NOT NULL,
//         PRIMARY KEY (id)    
//     )`;

//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table created");
//     });
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = `INSERT INTO MATCH2
//     (
//         id,
//         idDefense,
//         idOffense,
//         idUSER,
//         result,
//         date
//     ) VALUES (
//         1,
//         1,
//         1,
//         1,
//         TRUE,
//         0
//     )`;
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//       console.log(result)
//     });
// });