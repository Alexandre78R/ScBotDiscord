//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js");

//Import de la LIBS discord.js
const Discord = require("discord.js");

// Import userInfo
const userInfo = require('../function/userInfo.js');

//Function checkMaintenance 
const checkMaintenance = require('../function/checkMaintenance.js');

function playerstats (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = userInfo("./commands/playerstats.js", message);

    var statutcommand = checkMaintenance(message, "playerstats", infoUser);
    if (statutcommand == false) return;

    message.channel.send('command playerstats');

}

//Module export
module.exports = playerstats;