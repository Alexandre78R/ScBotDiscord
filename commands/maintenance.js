//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import function checkRolePerm
const checkRolePerm = require('../function/checkRolePerm.js');

var userInfo = require("../function/userinfo.js")

function maintenance (message) {

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
    var infoUser = userInfo("./commands/maintenance.js", message);

    var checkPerm = checkRolePerm(message, config.discord.roles_id.DEV, infoUser)
    if (checkPerm == false) return;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    
    var nameCommand = args[0]

    if (nameCommand == undefined) {  

        let undefinedNameCommand = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`:information_source: Status des commandes :information_source:`)
        .setDescription(`Liste des status des commandes : `)
        .addFields(
            { name: 'help', value: config.discord.maintenance.help, inline: true },
            { name: 'listplayer', value: config.discord.maintenance.listplayer, inline: true },
            { name: 'mycontrib', value: config.discord.maintenance.mycontrib, inline: true },
            { name: 'mystats', value: config.discord.maintenance.mystats, inline: true },
            { name: 'offense', value: config.discord.maintenance.offense, inline: true },
            { name: 'player', value: config.discord.maintenance.player, inline: true },
            { name: 'processing', value: config.discord.maintenance.processing, inline: true },
            { name: 'sb', value: config.discord.maintenance.sb, inline: true },
            { name: 'stats', value: config.discord.maintenance.stats, inline: true },
            { name: 'test', value: config.discord.maintenance.test, inline: true },
            { name: 'playerstats', value: config.discord.maintenance.playerstats, inline: true },
            { name: 'lastoffense', value: config.discord.maintenance.lastoffense, inline: true },
            { name: 'deloffense', value: config.discord.maintenance.deloffense, inline: true },
            { name: 'upoffense', value: config.discord.maintenance.upoffense, inline: true }
        )
        .setFooter(`Pour désactiver ou activer une commandes merci de taper ${config.discord.prefix}maintenance + le nom de la commande.`);
        return message.channel.send(undefinedNameCommand) | consoleLog(`Ok : undefinedNameCommand`, NaN, infoUser)

    }else{

        switch (nameCommand) {

            case "help" :

                config.discord.maintenance.help = !config.discord.maintenance.help;

                let statusChangeHelp = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.help} !`);
                message.channel.send(statusChangeHelp) | consoleLog(`OK : statusChangeHelp`, NaN, infoUser);

            break;

            case "listplayer" :

                config.discord.maintenance.listplayer = !config.discord.maintenance.listplayer;

                let statusChangeListplayer = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.listplayer} !`);
                message.channel.send(statusChangeListplayer) | consoleLog(`OK : statusChangeListplayer`, NaN, infoUser);

            break;

            case "mycontrib" :

                config.discord.maintenance.mycontrib = !config.discord.maintenance.mycontrib;

                let statusChangeMycontrib = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.mycontrib} !`);
                message.channel.send(statusChangeMycontrib) | consoleLog(`OK : statusChangeMycontrib`, NaN, infoUser);

            break;

            case "mystats" :

                config.discord.maintenance.mystats = !config.discord.maintenance.mystats;

                let statusChangeMystats = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.mystats} !`);
                message.channel.send(statusChangeMystats) | consoleLog(`OK : statusChangeMystats`, NaN, infoUser);

            break;

            case "offense" :
                
                config.discord.maintenance.offense = !config.discord.maintenance.offense;

                let statusChangeOffense = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.offense} !`);
                message.channel.send(statusChangeOffense) | consoleLog(`OK : statusChangeOffense`, NaN, infoUser);

            break;

            case "player" :

                config.discord.maintenance.player = !config.discord.maintenance.player;

                let statusChangePlayer = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.player} !`);
                message.channel.send(statusChangePlayer) | consoleLog(`OK : statusChangePlayer`, NaN, infoUser);

            break;

            case "processing" :

                config.discord.maintenance.processing = !config.discord.maintenance.processing;

                let statusChangeProcessing = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.processing} !`);
                message.channel.send(statusChangeProcessing) | consoleLog(`OK : statusChangeProcessing`, NaN, infoUser);

            break;

            case "sb" :

                config.discord.maintenance.sb = !config.discord.maintenance.sb;

                let statusChangeSb = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.sb} !`);
                message.channel.send(statusChangeSb) | consoleLog(`OK : statusChangeSb`, NaN, infoUser);

            break;

            case "stats" :

                config.discord.maintenance.stats = !config.discord.maintenance.stats;

                let statusStats = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.stats} !`);
                message.channel.send(statusStats) | consoleLog(`OK : statusStats`, NaN, infoUser);

            break;

            case "test" :

                config.discord.maintenance.test = !config.discord.maintenance.test;

                let statusTest = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.test} !`);
                message.channel.send(statusTest) | consoleLog(`OK : statusTest`, NaN, infoUser);

            break;

            case "playerstats" :

                config.discord.maintenance.playerstats = !config.discord.maintenance.playerstats;

                let statusPlayerstats = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.playerstats} !`);
                message.channel.send(statusPlayerstats) | consoleLog(`OK : statusPlayerstats`, NaN, infoUser);

            break;

            case "lastoffense" :

                config.discord.maintenance.lastoffense = !config.discord.maintenance.lastoffense;

                let statusLastoffense = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.lastoffense} !`);
                message.channel.send(statusLastoffense) | consoleLog(`OK : statusLastoffense`, NaN, infoUser);

            break;

            case "deloffense" :

                config.discord.maintenance.deloffense = !config.discord.maintenance.deloffense;

                let statusDelOffense = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.deloffense} !`);
                message.channel.send(statusDelOffense) | consoleLog(`OK : statusDelOffense`, NaN, infoUser);

            break;

            case "upoffense" :

                config.discord.maintenance.upoffense = !config.discord.maintenance.upoffense;

                let statusUpoffense = new Discord.MessageEmbed()
                .setColor("#01E007")
                .setTitle(`:white_check_mark: Commande Status :white_check_mark:`)
                .setDescription(`:tada: ${infoUser.username}, le status de la commandes ${nameCommand} à était changer en ${config.discord.maintenance.upoffense} !`);
                message.channel.send(statusUpoffense) | consoleLog(`OK : statusUpoffense`, NaN, infoUser);

            break;

            default:

                let commandNotFound = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Impossible de trouver la commande :x:`)
                .setDescription(`:x: ${infoUser.username}, impossible de trouver la commande : ${args[0]} !`)
                .setFooter("Erreur : commandNotFound");
                message.channel.send(commandNotFound) - consoleLog(`ERROR : commandNotFound`, NaN, infoUser);

            break;
        }
    }
}

//Module export
module.exports = maintenance;