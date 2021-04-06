//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import du module fs
const fs = require("fs")

//Module export
module.exports = {
    'player': player,
} 

function player (message){

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.prefix) 
            message[0] = message[0].slice(1);

    }

    var tableauResultat = null;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    var variantSC = args[0]

    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur Info joueur :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant  - errorVariant")

    if (variantSC == undefined) return message.channel.send(errorArgsVariant)

    switch (variantSC){
                        
        case config.variantSC1:
            if (fs.existsSync(`./data/SC1/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC1/tableauResultat.json")
                tableauResultat = require("../data/SC1/tableauResultat.json");
            }
        break;
        case config.variantSC2:
            if (fs.existsSync(`./data/SC2/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC2/tableauResultat.json")
                tableauResultat = require("../data/SC2/tableauResultat.json");
            }
        break;
        case config.variantSC3: 
            if (fs.existsSync(`./data/SC3/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC3/tableauResultat.json")
                tableauResultat = require("../data/SC3/tableauResultat.json");
            }
        break;
        case config.variantSC4:
            if (fs.existsSync(`./data/SC4/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC4/tableauResultat.json")
                tableauResultat = require("../data/SC4/tableauResultat.json");
            }
        break;
        default:
            let errorPlayerVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
            .setFooter("Erreur : errorPlayerVariant - SWITCH")
            return message.channel.send(errorPlayerVariant)
    }

    var infoSearch = args[1];

    let errorPlayerInfoSearch = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Récupération du fichier  :x:`)
    .setDescription(`:x: Merci d'indiquer un nom de joueur ou un ID.`) 
    .setFooter("Erreur : errorPlayerInfoSearch - INFOSEARCH UNDEFINED")

    if (infoSearch == undefined) return message.channel.send(errorPlayerInfoSearch) | console.log(`Impossiblede de trouver le joueuer ou l'id ${infoSearch} dans la variente ${variantSC}`)

    var data = [];
    
    if (tableauResultat == null){
        let errorStatsPlayer= new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Info joueur :x:`)
        .setDescription(`:x: Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.prefix}processing .`) 
        .setFooter("Erreur : errorStatsPlayer - PLAYER NOT FOUND")
        message.channel.send(errorStatsPlayer)
    } else {
        for (const propriete in tableauResultat.Joueurs) {
            var resultat = tableauResultat.Joueurs[propriete];
            tab = []
            tab["Player"] = propriete
            for (const proprieteResultat in resultat) {
                tab[proprieteResultat] = resultat[proprieteResultat]
            }
            data.push(tab)
        }

        var tabPlayer = []

        for (var i = 0; i < data.length; i++) {
            if (data[i].Player == infoSearch) {
                var dataPlayer = {
                    Player_id : data[i].player_id,
                    Player: data[i].Player,
                    attack_win: data[i].attack_win,
                    attack_lose: data[i].attack_lose,
                    defense_win: data[i].defense_win,
                    defense_lose: data[i].defense_lose,
                    contribution: data[i].contribution
                }
                tabPlayer.push(dataPlayer)
            } else if (data[i].player_id == infoSearch) {
                var dataPlayer = {
                    Player_id : data[i].player_id,
                    Player: data[i].Player,
                    attack_win: data[i].attack_win,
                    attack_lose: data[i].attack_lose,
                    defense_win: data[i].defense_win,
                    defense_lose: data[i].defense_lose,
                    contribution: data[i].contribution
                }
                tabPlayer.push(dataPlayer)
            }
        }

        if (tabPlayer.length == 0) {
            let errorInfoPlayerUndefined = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Erreur Info joueur :x:`)
            .setDescription(`:x: Imposible de trouver l'info du joueur avec ce id ou le nom du joueur. Merci de vérifier sur la commandes !listplayer .`) 
            .setFooter("Erreur : errorInfoPlayerUndefined - RESULT NOT FOUND")
            message.channel.send(errorInfoPlayerUndefined)
            tabPlayer = []
            data = []
        } else if (tabPlayer.length >=2) {
            let errorInfoPlayerMulti = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Erreur Info joueur :x:`)
            .setDescription(`:x: Erreur interne merci de refaire la commande avec les mêmes informtations.`) 
            .setFooter("Erreur : errorInfoPlayerMulti - RESULT COMMAND MULTI")
            message.channel.send(errorInfoPlayerMulti)
            tabPlayer = []
            data = []
        } else {

            let infoPlyerEmbed = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`${tabPlayer[0].Player} #${tabPlayer[0].Player_id}`)
            .setDescription("Information du Joueur :")
            .addFields(
                { name: 'Attaque réussie', value: tabPlayer[0].attack_win, inline: true },
                { name: 'Attaque perdu', value: tabPlayer[0].attack_lose, inline: true },
                { name: 'Défense réussie', value: tabPlayer[0].defense_win, inline: true },
                { name: "Défense perdu", value: tabPlayer[0].defense_lose, inline: true },
                { name: "Contribution", value: tabPlayer[0].contribution, inline: true },
            )
            message.channel.send(infoPlyerEmbed)
            tabPlayer = []
            data = []
            console.log('tabPlayer', tabPlayer)
            console.log("Data", data)
        }
    }
}   