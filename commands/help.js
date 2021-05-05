//Import de la config
const config = require('../config/config')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import funciton console.log()
var consoleLog = require('../function/consoleLog.js');

//Function checkMaintenance
var checkMaintenance = require("../function/checkMaintenance.js")

var userInfo = require('../function/userInfo.js')

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
        { name: `${config.discord.prefix}mycontrib`, value: `${config.discord.prefix}help mycontrib`, inline: true }
    )
    .setFooter(`Tapez ${config.discord.prefix}help + le nom de la commandes pour avoir plus d'information !`);

    if (notCommand == undefined) return message.channel.send(notCommandEmbed) | consoleLog("OK : notCommandEmbed", NaN, infoUser);

    switch (notCommand) {

        case "offense":
            let helpCommandOffense = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'indiquer votre offense pour une defense et de l'enregistrer dans notre base de données.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand} [leadNameMobOffense] [2NameMobOffense] [3NameMobOffense] - [leadNameMobDefense] [2NameMobDefense] [3NameMobDefense] - [W/L]`);
            message.channel.send(helpCommandOffense);
            consoleLog("OK : helpCommandOffense", NaN, infoUser);
        break;

        case "sb":
            let helpCommandSb = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'afficher une liste de nos meillieurs offenses pour cette defense.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand} [leadNameMobDefense] [2NameMobDefense] [3NameMobDefense]`)
            message.channel.send(helpCommandSb);
            consoleLog("OK : helpCommandSb", NaN, infoUser);
        break;

         case "mystats":
            let helpCommandMystats = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande qui permet d'afficher la liste des offenses du dernier mois.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand}`);
            message.channel.send(helpCommandMystats);
            consoleLog("OK : helpCommandMystats", NaN, infoUser);
        break;

        case "mycontrib":
            let helpCommandMycontrib = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Les informations pour la commmande : ${config.discord.prefix}${notCommand}`)
            .setDescription(`${infoUser.username}, commande pour voir le top 3 d'offense que vous utilisé et le top 3 de participation sur une defense.`)
            .setFooter(`Aide : ${config.discord.prefix}${notCommand}`);
            message.channel.send(helpCommandMycontrib);
            consoleLog("OK : helpCommandMycontrib", NaN, infoUser);
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

    //je garde ça pour plus tard (Alex)...
    // //Message d'information sur la commande DL
    // let helpDLEmbed = new Discord.MessageEmbed()
    // .setColor("#FEAC09")
    // .setTitle(`Commande n°1 :`)
    // .addFields(
    //     { 
    //         name: `${config.discord.prefix}dl`,
    //         value: `Etape 1 : Importer le fichier JSON du siege sur le discord. Etape 2 : Puis clique droit sur le fichier et cliquer sur 'Copier le lien'. Etape 3 : Puis vous allez taper '${config.discord.prefix}dl' avec les arguments suivants : SC1 , SC2 , SC3 ou SC4 + [URl que vous venez de copier]`,
    //         inline: true 
    //     },
    // )
    // message.channel.send(helpDLEmbed)

    // //Message d'information sur la commande Processing
    // let helpProcessingEmbed = new Discord.MessageEmbed()
    // .setColor("#FEAC09")
    // .setTitle(`Commande n°2 :`)
    // .addFields(
    //     { 
    //         name: `${config.discord.prefix}processing`,
    //         value: `Etape 1 : Vous allez taper '${config.discord.prefix}processing' avec les arguments suivants : SC1 , SC2 , SC3 ou SC4 + l'id du fichier (Vous pouvez le trouver dans le nom du fichier JSON ex : 2021010501000007 pour le fichier SiegeMatch-2021010501000007.json)`,
    //         inline: true 
    //     },
    // )
    // message.channel.send(helpProcessingEmbed)

    // //Message d'information sur la commande stats
    // let helpStatsEmbed = new Discord.MessageEmbed()
    // .setColor("#FEAC09")
    // .setTitle(`Commande n°3 :`)
    // .addFields(
    //     { 
    //         name: `${config.discord.prefix}stats`,
    //         value: `Etape 1 : Vous allez taper '${config.discord.prefix}stats' avec l'un des arguments suivants : SC1 , SC2 , SC3 ou SC4 `,
    //         inline: true
    //     },
    // )
    // message.channel.send(helpStatsEmbed)

    // //Message d'information sur la commande list player
    // let helpListPlayerEmbed = new Discord.MessageEmbed()
    // .setColor("#FEAC09")
    // .setTitle(`Commande n°4 :`)
    // .addFields(
    //     { 
    //         name: `${config.discord.prefix}listplayer`,
    //         value: `Etape 1 : Vous allez taper '${config.discord.prefix}listplayer' avec l'un des arguments suivants : SC1 , SC2 , SC3 ou SC4 `,
    //         inline: true
    //     },
    // )
    // message.channel.send(helpListPlayerEmbed)

    // //Message d'information sur la commande player
    // let helpPlayerEmbed = new Discord.MessageEmbed()
    // .setColor("#FEAC09")
    // .setTitle(`Commande n°5 :`)
    // .addFields(
    //     { 
    //         name: `${config.discord.prefix}player`,
    //         value: `Etape 1 : Vous allez taper '${config.discord.prefix}player' avec les arguments suivants : SC1 , SC2 , SC3 ou SC4 + L'id du joueur ou le nom du joueur (A vérifier avec la commande ${config.discord.prefix}listplayer )`,
    //         inline: true 
    //     },
    // )
    // message.channel.send(helpPlayerEmbed)
}   

//Module export
module.exports = help;
