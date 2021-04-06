//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import du module FS
const fs = require('fs')

//Module export
module.exports = {
    'stats': stats,
} 

function stats (message){

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
    .setTitle(`:x: Erreur Lecture du fichier :x:`)
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
            let errorStatsGuildVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
            .setFooter("Erreur : errorStatsGuildVariant - SWITCH")
            return message.channel.send(errorStatsGuildVariant)
    } 

    let errorStatsDataUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Traitement du fichier  :x:`)
    .setDescription(`:x: Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.prefix}processing .`) 
    .setFooter("Erreur : errorStatsDataUndefined - FILE DATA UNDEFINED")

    if (tableauResultat == null) return message.channel.send(errorStatsDataUndefined) | console.log(`Impossible de toruver le fichier : ../data/${variantSC}/tableauResultat.json`)

    //Récupération des informations des Guildes
    var infoGuilde = tableauResultat.Guildes

    //Conditon en cas d'Erreur Undefined
    if (infoGuilde == undefined) {

        let errorUndefined = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : Guildes Tableau = errorUndefined")
        message.channel.send(errorUndefined)

    //Conditon en cas d'Erreur null
    }else if (infoGuilde == null) {

        let errorNull = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : Guildes Tableau = errorNull")
        message.channel.send(errorNull)
    
    //Conditon en cas d'Erreur NaN
    }else if (infoGuilde == NaN) {

        let errorNaN = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : Guildes Tableau = errorNaN")
        message.channel.send(errorNaN)
    
    //Conditon en cas d'Erreur length
    }else if (infoGuilde.length == 0) {

        let errorLength = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : Guildes Tableau = errorLength")
        message.channel.send(errorLength)

    }else{

        for (var i = 0; i < infoGuilde.length; i++) {

            //Condition guild_name  en cas de Undefined 
            if (infoGuilde[i].guild_name == undefined) {

                let errorGuildName = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorGuildName = undefined")
                tableauResultat = null;
                message.channel.send(errorGuildName)

            //Condition attack_use en cas de Undefined 
            }else if (infoGuilde[i].attack_use == undefined) {

                let errorAttackUse = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorAttackUse = undefined")
                tableauResultat = null;
                message.channel.send(errorAttackUse)

            //Condition attack_not_use en cas de Undefined 
            }else if (infoGuilde[i].attack_not_use == undefined) {

                let errorAttackNotUse = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorAttackNotUse = undefined")
                tableauResultat = null;
                message.channel.send(errorAttackNotUse)

            //Condition winrates en cas de Undefined 
            }else if (infoGuilde[i].winrate == undefined) {

                let errorWinrate = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorWinrate = undefined")
                tableauResultat = null;
                message.channel.send(errorWinrate)
            
            //Condition total_attack_winen en cas de Undefined
            }else if (infoGuilde[i].total_attack_win == undefined) {

                let errorTotalAttackWin = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalAttackWin = undefined")
                tableauResultat = null;
                message.channel.send(errorTotalAttackWin)

            //Condition total_attack_lose en cas de Undefined
            }else if (infoGuilde[i].total_attack_lose == undefined) {

                let errorTotalAttackLose = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalAttackLose = undefined")
                tableauResultat = null;
                message.channel.send(errorTotalAttackLose)

            //Condition total_defense_win  en cas de  Undefined
            }else if (infoGuilde[i].total_defense_win == undefined) {

                let errorTotalDefenseWin = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalDefenseWin = undefined")
                tableauResultat = null;
                message.channel.send(errorTotalDefenseWin)

            //Condition total_defense_lose en cas de  Undefined
            }else if (infoGuilde[i].total_defense_lose == undefined) {

                let errorTotalDefenseLose = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalDefenseLose = undefined")
                tableauResultat = null;
                message.channel.send(errorTotalDefenseLose)

            //Condition number_players en cas de  Undefined
            }else if (infoGuilde[i].number_players == undefined){

                let errorNumberPlayer = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorNumberPlayer = undefined")
                tableauResultat = null;
                message.channel.send(errorNumberPlayer)

            }else {

                //On envois les information des guildes du siège
                let infoEmbed = new Discord.MessageEmbed()
                .setColor("#FEAC09")
                .setTitle(`${infoGuilde[i].guild_name}`)
                .setDescription("Information du siège :")
                .addFields(
                    { name: 'Attaque utiliser', value: infoGuilde[i].attack_use , inline: true },
                    { name: 'Attaque non utiliser', value: infoGuilde[i].attack_not_use, inline: true },
                    { name: 'Winrate', value: infoGuilde[i].winrate, inline: true },
                    { name: "Nombre d'attaque réussie", value: infoGuilde[i].total_attack_win, inline: true },
                    { name: "Nombre d'attaque perdu", value: infoGuilde[i].total_attack_lose, inline: true },
                    { name: "Nombre défense réussie", value: infoGuilde[i].total_defense_win, inline: true },
                    { name: "Nombre défense perdu", value: infoGuilde[i].total_defense_lose, inline: true },
                    { name : "Nombre de joueur", value : infoGuilde[i].number_players, inline: true}
                )
                tableauResultat = null;
                message.channel.send(infoEmbed)
            }
        }
    }
}