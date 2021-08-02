//Import de la config
const config = require('../../config/config')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import funciton console.log()
var consoleLog = require('../../function/consoleLog.js');

//Function checkMaintenance
var checkMaintenance = require("../../function/checkMaintenance.js")

var userInfo = require('../../function/userinfo.js')

function help (message){

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
    var infoUser = userInfo("./commands/help.js", message);

    var statutcommand = checkMaintenance (message, "help", infoUser);
    if(statutcommand == false) return;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    var notCommand = args[0];

    let notCommandEmbed = new Discord.MessageEmbed()
    .setColor("#FEAC09")
    .setTitle(`Liste des commandes :`)
    .addFields(
        { name: `${config.discord.prefix}offense`, value: `${config.discord.prefix}help offense`, inline: true },
        { name: `${config.discord.prefix}sb`, value: `${config.discord.prefix}help sb`, inline: true },
        { name: `${config.discord.prefix}mystats`, value: `${config.discord.prefix}help mystats`, inline: true },
        { name: `${config.discord.prefix}mycontrib`, value: `${config.discord.prefix}help mycontrib`, inline: true },
        { name: `${config.discord.prefix}playerstats`, value: `${config.discord.prefix}help playerstats`, inline: true },
        { name: `${config.discord.prefix}lastoffense`, value: `${config.discord.prefix}help lastoffense`, inline: true },
        { name: `${config.discord.prefix}deloffense`, value: `${config.discord.prefix}help deloffense`, inline: true },
        { name: `${config.discord.prefix}upoffense`, value: `${config.discord.prefix}help upoffense`, inline: true }
    )
    .setFooter(`Tapez ${config.discord.prefix}help + le nom de la commandes pour avoir plus d'information !`);

    if (notCommand == undefined) return message.channel.send(notCommandEmbed) && consoleLog("OK : notCommandEmbed", NaN, infoUser);
    
    notCommand = notCommand.toLowerCase();

    switch (notCommand) {

        case "offense":
            let helpCommandOffense = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'indiquer votre offense pour une défense et de l'enregistrer dans notre base de données.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand} [leadNameMobOffense] [2NameMobOffense] [3NameMobOffense] - [leadNameMobDefense] [2NameMobDefense] [3NameMobDefense] - [W/L] \n Ex : ${config.discord.prefix}${notCommand} galion tiana poseidon - khmun orion savannah - W`);
            message.channel.send(helpCommandOffense);
            consoleLog("OK : helpCommandOffense", NaN, infoUser);
        break;

        case "sb":
            let helpCommandSb = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'afficher une liste de nos meilleurs offenses pour cette défense.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand} [leadNameMobDefense] [2NameMobDefense] [3NameMobDefense] \n Ex : ${config.discord.prefix}${notCommand} khmun orion savannah`)
            message.channel.send(helpCommandSb);
            consoleLog("OK : helpCommandSb", NaN, infoUser);
        break;

         case "mystats":
            let helpCommandMystats = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'afficher ta liste des offenses du dernier mois.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand}`);
            message.channel.send(helpCommandMystats);
            consoleLog("OK : helpCommandMystats", NaN, infoUser);
        break;

        case "mycontrib":
            let helpCommandMycontrib = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande pour voir le top 3 d'offense que vous utilisé et le top 3 de participation sur une défense.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand}`);
            message.channel.send(helpCommandMycontrib);
            consoleLog("OK : helpCommandMycontrib", NaN, infoUser);
        break;

        case "playerstats":
            let helpCommandPlayerStats = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'afficher la liste des offenses du dernier mois d'une autre personne.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand} [idDiscord/TagDiscord] \n Ex : ${config.discord.prefix}${notCommand} Alexandre78R#7666 ou ${config.discord.prefix}${notCommand} 272712335284502529`);
            message.channel.send(helpCommandPlayerStats);
            consoleLog("OK : helpCommandPlayerStats", NaN, infoUser);
        break;

        case "lastoffense":
            let helpCommandLastOffense = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'afficher la liste des offenses des dernières 24h.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand}`);
            message.channel.send(helpCommandLastOffense);
            consoleLog("OK : helpCommandLastOffense", NaN, infoUser);
        break;

        case "deloffense":
            let helpCommandDelOffense = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet de supprimer une offense avec un id récupérable avec la commande : ${config.discord.prefix}lastoffense .`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand} [idOffense] \n Ex : ${config.discord.prefix}${notCommand} 1`);
            message.channel.send(helpCommandDelOffense);
            consoleLog("OK : helpCommandDelOffense", NaN, infoUser);
        break;

        case "upoffense":
            let helpCommandUpOffense = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet de modifier votre offense pour une défense dans notre base de données. L'id se récupère avec la commande ${config.discord.prefix}lastoffense !`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand} [leadNameMobOffense] [2NameMobOffense] [3NameMobOffense] - [leadNameMobDefense] [2NameMobDefense] [3NameMobDefense] - [W/L] - [idOffense]\n Ex : ${config.discord.prefix}${notCommand} galion tiana poseidon - khmun orion savannah - W - 1`);
            message.channel.send(helpCommandUpOffense);
            consoleLog("OK : helpCommandUpOffense", NaN, infoUser);
        break;

        default:
            let notFoundCommandHelp = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Erreur la commande est introuvable :x:`)
            .setDescription(`:x: ${infoUser.username}, la commande ${notCommand} est introuvable !`);
            message.channel.send(notFoundCommandHelp);
            consoleLog("ERROR : notFoundCommandHelp", NaN, infoUser);
        break;
    }
}   

//Module export
module.exports = help;
