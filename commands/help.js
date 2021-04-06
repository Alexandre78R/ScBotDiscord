//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Module export
module.exports = {
    'help': help,
} 

function help (message){

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.prefix) 
            message[0] = message[0].slice(1);

    }

    let helpDLEmbed = new Discord.MessageEmbed()
    .setColor("#FEAC09")
    .setTitle(`Commande n°1 :`)
    .addFields(
        { 
            name: `${config.prefix}dl`,
            value: `Etape 1 : Importer le fichier JSON du siege sur le discord. Etape 2 : Puis clique droit sur le fichier et cliquer sur 'Copier le lien'. Etape 3 : Puis vous allez taper '${config.prefix}dl' avec les arguments suivants : SC1 , SC2 , SC3 ou SC4 + [URl que vous venez de copier]`,
            inline: true 
        },
    )
    message.channel.send(helpDLEmbed)

    
    let helpProcessingEmbed = new Discord.MessageEmbed()
    .setColor("#FEAC09")
    .setTitle(`Commande n°2 :`)
    .addFields(
        { 
            name: `${config.prefix}processing`,
            value: `Etape 1 : Vous allez taper '${config.prefix}processing' avec les arguments suivants : SC1 , SC2 , SC3 ou SC4 + l'id du fichier (Vous pouvez le trouver dans le nom du fichier JSON ex : 2021010501000007 pour le fichier SiegeMatch-2021010501000007.json)`,
            inline: true 
        },
    )
    message.channel.send(helpProcessingEmbed)

    
    let helpStatsEmbed = new Discord.MessageEmbed()
    .setColor("#FEAC09")
    .setTitle(`Commande n°3 :`)
    .addFields(
        { 
            name: `${config.prefix}stats`,
            value: `Etape 1 : Vous allez taper '${config.prefix}stats' avec l'un des arguments suivants : SC1 , SC2 , SC3 ou SC4 `,
            inline: true
        },
    )
    message.channel.send(helpStatsEmbed)

    
    let helpListPlayerEmbed = new Discord.MessageEmbed()
    .setColor("#FEAC09")
    .setTitle(`Commande n°4 :`)
    .addFields(
        { 
            name: `${config.prefix}listplayer`,
            value: `Etape 1 : Vous allez taper '${config.prefix}listplayer' avec l'un des arguments suivants : SC1 , SC2 , SC3 ou SC4 `,
            inline: true
        },
    )
    message.channel.send(helpListPlayerEmbed)

    
    let helpPlayerEmbed = new Discord.MessageEmbed()
    .setColor("#FEAC09")
    .setTitle(`Commande n°5 :`)
    .addFields(
        { 
            name: `${config.prefix}player`,
            value: `Etape 1 : Vous allez taper '${config.prefix}player' avec les arguments suivants : SC1 , SC2 , SC3 ou SC4 + L'id du joueur ou le nom du joueur (A vérifier avec la commande ${config.prefix}listplayer )`,
            inline: true 
        },
    )
    message.channel.send(helpPlayerEmbed)
}   