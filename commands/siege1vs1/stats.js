//Import de la config
const config = require('../../config/config')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import du module FS
const fs = require('fs')

//Import des consoleLog pour un système de historique
const consoleLog = require("../../function/consoleLog.js")

//Function checkMaintenance
var checkMaintenance = require("../../function/checkMaintenance.js")

var userInfo = require("../../function/userinfo.js");

function stats (message){

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
    var infoUser = userInfo("./commands/stats.js", message);
    
    var statutcommand = checkMaintenance (message, "stats", infoUser)
    if(statutcommand == false) return;
    
    //On définit une variable null
    var tableauResultat = null;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    //Premier argument 
    var variantSC = args[0]

    //Message d'erreur si il n'y apas d'argument
    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur Lecture du fichier :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant")

    //Condition si il n'y a pas d'argument 
    if (variantSC == undefined) return message.channel.send(errorArgsVariant) | consoleLog(`ERROR : errorArgsVariant - ${variantSC}`, NaN, infoUser)

    //Switch Variant
    switch (variantSC){
        
        //Switch SC1
        case config.discord.variantSC1:
            if (fs.existsSync(`./data/SC1/tableauResultat.json`)) {
                tableauResultat = require("../data/SC1/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC1/tableauResultat.json - ${variantSC}`)
            }
        break;

        //Switch SC2
        case config.discord.variantSC2:
            if (fs.existsSync(`./data/SC2/tableauResultat.json`)) {
                tableauResultat = require("../data/SC2/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC2/tableauResultat.json - ${variantSC}`)
            }
        break;

        //Switch SC3
        case config.discord.variantSC3:
            if (fs.existsSync(`./data/SC3/tableauResultat.json`)) {
                tableauResultat = require("../data/SC3/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC3/tableauResultat.json - ${variantSC}`)
            }
        break;

        //Switch SC4
        case config.discord.variantSC4:
            if (fs.existsSync(`./data/SC4/tableauResultat.json`)) {
                tableauResultat = require("../data/SC4/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC4/tableauResultat.json - ${variantSC}`)
            }
        break;

        default:
            //Message si l'argument ne correspond pas dans le Switch
            let errorStatsGuildVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
            .setFooter("Erreur : errorStatsGuildVariant")
            return message.channel.send(errorStatsGuildVariant) | consoleLog(`ERROR : errorStatsGuildVariant - ${variantSC}`, NaN, infoUser)
    } 

    //Message d'erreur si il n'y a pas de fichier des info du siege
    let errorStatsDataUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Traitement du fichier  :x:`)
    .setDescription(`:x: Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.discord.prefix}processing .`) 
    .setFooter("Erreur : errorStatsDataUndefined")

    //Condition si on ne trouve pas les informations
    if (tableauResultat == null) return message.channel.send(errorStatsDataUndefined) | consoleLog(`ERROR : Impossible de toruver le fichier : ../data/${variantSC}/tableauResultat.json - ${variantSC}`, NaN, infoUser)

    //Récupération des informations des Guildes
    var infoGuilde = tableauResultat.Guildes

    //Conditon en cas d'Erreur Undefined
    if (infoGuilde == undefined) {

        let errorUndefined = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : errorUndefined")
        message.channel.send(errorUndefined)
        consoleLog(`ERROR : errorUndefined - ${variantSC}`, NaN, infoUser)

    //Conditon en cas d'Erreur null
    }else if (infoGuilde == null) {

        //Message d'erreur impossible récupérer les informations du siege
        let errorNull = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : errorNull")
        message.channel.send(errorNull)
        consoleLog(`ERROR : errorNull - ${variantSC}`, NaN, infoUser)
    
    //Conditon en cas d'Erreur NaN
    }else if (infoGuilde == NaN) {

        //Message d'erreur impossible récupérer les informations du siege
        let errorNaN = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : errorNaN")
        message.channel.send(errorNaN)
        consoleLog(`ERROR : errorNaN - ${variantSC}`, NaN, infoUser)
    
    //Conditon en cas d'Erreur length
    }else if (infoGuilde.length == 0) {

        //Message d'erreur impossible récupérer les informations du siege
        let errorLength = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Lecture du fichier :x:`)
        .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
        .setFooter("Erreur : errorLength")
        message.channel.send(errorLength)
        consoleLog(`ERROR : errorLength - ${variantSC}`, NaN, infoUser)

    }else{

        for (var i = 0; i < infoGuilde.length; i++) {

            //Condition guild_name  en cas de Undefined 
            if (infoGuilde[i].guild_name == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorGuildName = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorGuildName")
                message.channel.send(errorGuildName)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorGuildName - ${variantSC}`, NaN, infoUser)

            //Condition attack_use en cas de Undefined 
            }else if (infoGuilde[i].attack_use == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorAttackUse = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorAttackUse")
                message.channel.send(errorAttackUse)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorAttackUse - ${variantSC}`, NaN, infoUser)

            //Condition attack_not_use en cas de Undefined 
            }else if (infoGuilde[i].attack_not_use == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorAttackNotUse = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorAttackNotUse")
                message.channel.send(errorAttackNotUse)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorAttackNotUse - ${variantSC}`, NaN, infoUser)

            //Condition winrates en cas de Undefined 
            }else if (infoGuilde[i].winrate == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorWinrate = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorWinrate")
                message.channel.send(errorWinrate)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorWinrate - ${variantSC}`, NaN, infoUser)
            
            //Condition total_attack_winen en cas de Undefined
            }else if (infoGuilde[i].total_attack_win == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorTotalAttackWin = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalAttackWin")
                message.channel.send(errorTotalAttackWin)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorTotalAttackWin - ${variantSC}`, NaN, infoUser)

            //Condition total_attack_lose en cas de Undefined
            }else if (infoGuilde[i].total_attack_lose == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorTotalAttackLose = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalAttackLose")
                message.channel.send(errorTotalAttackLose)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorTotalAttackLose - ${variantSC}`, NaN, infoUser)

            //Condition total_defense_win  en cas de  Undefined
            }else if (infoGuilde[i].total_defense_win == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorTotalDefenseWin = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalDefenseWin")
                message.channel.send(errorTotalDefenseWin)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorTotalDefenseWin - ${variantSC}`, NaN, infoUser)

            //Condition total_defense_lose en cas de  Undefined
            }else if (infoGuilde[i].total_defense_lose == undefined) {

                //Message d'erreur impossible récupérer les informations du siege
                let errorTotalDefenseLose = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorTotalDefenseLose")
                message.channel.send(errorTotalDefenseLose)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorTotalDefenseLose - ${variantSC}`, NaN, infoUser)

            //Condition number_players en cas de  Undefined
            }else if (infoGuilde[i].number_players == undefined){

                //Message d'erreur impossible récupérer les informations du siege
                let errorNumberPlayer = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Lecture du fichier :x:`)
                .setDescription(":x: Impossible de récupérer les informartion du siège ! ")
                .setFooter("Erreur : errorNumberPlayer")
                message.channel.send(errorNumberPlayer)
                //On remet les données en NULL
                tableauResultat = null;
                consoleLog(`ERROR : errorNumberPlayer - ${variantSC}`, NaN, infoUser)
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
                message.channel.send(infoEmbed)
                consoleLog(`OK : DATA - ${variantSC}`, infoGuilde[i], infoUser)
                
                //On remet les données en NULL
                tableauResultat = null;
            }
        }
    }
}


//Module export
module.exports = stats;