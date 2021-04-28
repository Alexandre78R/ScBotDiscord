//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import de la config
const consoleLog = require('../function/consoleLog')

var config = require('../config/config.js')

//Function check rôle discord
function checkMaintenance (message, command, infoUser) {

    console.log('commande --->', command)
    
    var checkMaintenanceStatus = true;

    switch (command) {

        case "help" :

            checkMaintenanceStatus = config.discord.maintenance.help

        break;

        case "listplayer" :

            checkMaintenanceStatus = config.discord.maintenance.listplayer

        break;

        case "mycontrib" :

            checkMaintenanceStatus = config.discord.maintenance.mycontrib

        break;

        case "mystats" :

            checkMaintenanceStatus = config.discord.maintenance.mystats

        break;

        case "offense" :
            
            checkMaintenanceStatus = config.discord.maintenance.offense

        break;

        case "player" :

            checkMaintenanceStatus = config.discord.maintenance.player

        break;

        case "processing" :

            checkMaintenanceStatus = config.discord.maintenance.processing

        break;

        case "sb" :

            checkMaintenanceStatus = config.discord.maintenance.sb

        break;

        case "stats" :

            checkMaintenanceStatus = config.discord.maintenance.stats

        break;

        case "test" :

            checkMaintenanceStatus = config.discord.maintenance.test

        break;

        default:

            let commandNotFound = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Impossible de trouver la commande :x:`)
            .setDescription(`:x: Impossible de trouver la commande : ${command} !`)
            .setFooter("Erreur : commandNotFound")
            message.channel.send(commandNotFound) - consoleLog(`ERROR : commandNotFound`, NaN, infoUser)

            return false;
    }

    if (checkMaintenanceStatus == true){

        return true;

    }else{

        let commandMaintenance = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Permission refusé :x:`)
        .setDescription(`:x: ${infoUser.username} cette commande est en cours de maintenance, merci de réessayer ultérement !`)
        .setFooter("Erreur : commandMaintenance")
        message.channel.send(commandMaintenance)
        consoleLog(`ERROR : commandMaintenance`, NaN, infoUser)

        return false;
    }
}

//Module export
module.exports = checkMaintenance;
