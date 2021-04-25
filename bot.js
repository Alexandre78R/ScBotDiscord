//"channelWelcome" : "811292323895705682"

// Express pour gestion port de la partie discord
const express = require("express");

//Utilisation app pour express
const app = express();

//Appelle du client Discord
const client = require('./client/client.js')

//Récupérer la config du bot 
const config = require('./config/config')

//Function log 
const consoleLog = require("./function/consoleLog")

//Génération du port
app.set('port', (config.discord.port))
app.listen(app.get('port'), function(){
    consoleLog(`Le bot fonctionne sur le port : ${app.get('port')} `);
})
//Connexion bot Discord
client.login(config.discord.token)