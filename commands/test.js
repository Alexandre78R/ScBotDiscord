//Import de la config
const config = require('../config/config')

const consoleLog = require("../function/consoleLog.js")

function test (message) {

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
    var infoUser = { location : "./commands/test.js", id : message.author.id, username : message.author.username, avatar : message.author.avatar, isBot : message.author.bot };

    consoleLog("arg1")
    consoleLog("arg1", "arg2")
    consoleLog("arg1", "arg2", infoUser)

    // consoleLog("guild test", guild)

    // consoleLog('Message', message.guild.roles)

    var roles = message.guild.roles.cache
    console.log('Roles --->', roles)
    // roles.map(x => console.log("x", x.id, x.name))

    // roles.forEach(element => {
    // for (const key in roles) {
    //     console.log('Roles --->', roles[key])
    // }

    // console.log("member", member)
    // membre.roles.cache.some(role => role.name);


    message.channel.send("Command test")
}

//Module export
module.exports = test;