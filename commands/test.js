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

    var statutcommand = checkMaintenance (message, "test", infoUser)
    if(statutcommand == false) return;

    // var checkRoleDev = false

    // for (const [key, value] of message.guild.members.cache) {
    //     if (key == infoUser.id) {
    //         // console.log("value", value._roles)
    //         if (value._roles.includes(config.discord.roles_id.DEV)) checkRoleDev = !checkRoleDev;
    //     };
    // }


    // let permissionNotAllowed = new Discord.MessageEmbed()
    // .setColor("#F00E0E")
    // .setTitle(`:x: Permission refusé :x:`)
    // .setDescription(`:x: Vous n'avez pas l'autorisation d'utiliser cette commande !`)
    // .setFooter("Erreur : permissionNotAllowed")

  
    // if(checkRoleDev == false) return message.channel.send(permissionNotAllowed) | consoleLog(`ERROR : permissionNotAllowed`, NaN, infoUser)

    var checkPerm = checkRolePerm(message, config.discord.roles_id.DEV, infoUser)
    if (checkPerm == false) return;

    message.channel.send("test");
}

//Module export
module.exports = test;