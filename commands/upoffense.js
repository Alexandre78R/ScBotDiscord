//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import function checkRolePerm
const checkRolePerm = require('../function/checkRolePerm.js');

//Function checkMaintenance 
const checkMaintenance = require('../function/checkMaintenance.js')

const userInfo = require('../function/userinfo.js')

function upoffense (message) {

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
    var infoUser = userInfo("./commands/upoffense.js", message);

    var statutcommand = checkMaintenance (message, "upoffense", infoUser);
    if(statutcommand == false) return;


    var checkPerm = checkRolePerm(message, config.discord.roles_id.DEV, infoUser);
    if (checkPerm == false) return;

    message.channel.send("command upoffense");
}

//Module export
module.exports = upoffense;