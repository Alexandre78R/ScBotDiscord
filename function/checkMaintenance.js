//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import de la config
const consoleLog = require('../function/consoleLog')

var config = require('../config/config.js')

//Function check rôle discord
function checkMaintenance (message, command, infoUser) {

    console.log('commande --->', command);

    var checkRoleDev = false

    for (const [key, value] of message.guild.members.cache) {
        if (key == infoUser.id) {
            if (value._roles.includes(config.discord.roles_id.DEV)) checkRoleDev = !checkRoleDev;
        }
    }

    if (checkRoleDev == true){

        checkRoleDev = false;
        return true;

    }else {

        var checkMaintenanceStatus = true;

        switch (command) {
    
            case "help" :
    
                checkMaintenanceStatus = config.discord.maintenance.help;

            break;
    
            case "listplayer" :
    
                checkMaintenanceStatus = config.discord.maintenance.listplayer;
    
            break;
    
            case "dl" :
    
                checkMaintenanceStatus = config.discord.maintenance.dl;
    
            break;

            case "mycontrib" :
    
                checkMaintenanceStatus = config.discord.maintenance.mycontrib;
    
            break;
    
            case "mystats" :
    
                checkMaintenanceStatus = config.discord.maintenance.mystats;
    
            break;
    
            case "offense" :
                
                checkMaintenanceStatus = config.discord.maintenance.offense;
    
            break;
    
            case "player" :
    
                checkMaintenanceStatus = config.discord.maintenance.player;
    
            break;
    
            case "processing" :
    
                checkMaintenanceStatus = config.discord.maintenance.processing;
    
            break;
    
            case "sb" :
    
                checkMaintenanceStatus = config.discord.maintenance.sb;
    
            break;
    
            case "stats" :
    
                checkMaintenanceStatus = config.discord.maintenance.stats;
    
            break;
    
            case "test" :
    
                checkMaintenanceStatus = config.discord.maintenance.test;
    
            break;

            case "playerstats" :

                checkMaintenanceStatus = config.discord.maintenance.playerstats;

            break;

            case "lastoffense" :

                checkMaintenanceStatus = config.discord.maintenance.lastoffense;

            break;

            case "deloffense" :

                checkMaintenanceStatus = config.discord.maintenance.deloffense;

            break;

            case "upoffense" :

                checkMaintenanceStatus = config.discord.maintenance.upoffense;

            break;

            case "listoffense" :

                checkMaintenanceStatus = config.discord.maintenance.listoffense;

            break;

            case "listoffenseplayer" :

                checkMaintenanceStatus = config.discord.maintenance.listoffenseplayer;

            break;

            case "findteam" :

                checkMaintenanceStatus = config.discord.maintenance.findteam;

            break;

            default:
    
                let commandNotFound = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Impossible de trouver la commande :x:`)
                .setDescription(`:x: Impossible de trouver la commande : ${command} !`)
                .setFooter("Erreur : commandNotFound");
                message.channel.send(commandNotFound) && consoleLog(`ERROR : commandNotFound`, NaN, infoUser);
    
                return false;
        }
    
        console.log('status command check', checkMaintenanceStatus);
        if (checkMaintenanceStatus == true){
    
            return true;
    
        }else{
    
            let commandMaintenance = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Permission refusé :x:`)
            .setDescription(`:x: ${infoUser.username} cette commande est en cours de maintenance, merci de réessayer ultérement !`)
            .setFooter("Erreur : commandMaintenance");
            message.channel.send(commandMaintenance);
            consoleLog(`ERROR : commandMaintenance`, NaN, infoUser);
    
            return false;
        }
    }
}

//Module export
module.exports = checkMaintenance;
