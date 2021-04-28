
//!IMPORTANT --> Ce fichier n'est pas commenté entièrement risque de grosse modification par la suite.

//Import de la config
const config = require('../config/config')

//Import du module FS
const fs = require('fs');

//Import discord
const Discord = require('discord.js');

var tableauResultat = {Guildes : [], Joueurs : {}}

//Import des consoleLog pour un système de historique
const consoleLog = require("../function/consoleLog.js")

//Function checkMaintence 
var checkMaintenance = require("../function/checkMaintenance")

function processing (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    var infoSiege = null;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = { location : "./commands/processing.js", id : message.author.id, username : message.author.username, avatar : message.author.avatar, isBot : message.author.bot };
    
    var statutcommand = checkMaintenance (message, "processing", infoUser)
    if(statutcommand == false) return;

    var variantSC = args[0]

    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Traitement  du fichier  :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant")

    if (variantSC == undefined) return message.channel.send(errorArgsVariant) | consoleLog(`ERROR : errorArgsVariant`, NaN, infoUser);

    switch (variantSC){
                        
        case config.discord.variantSC1:
            if (fs.existsSync(`./data/SC1/siege.json`)) {
                infoSiege = require("../data/SC1/siege.json");
                consoleLog(`OK : Fichier trouver : ./data/SC1/siege.json - ${variantSC}`);
            }
        break;
        case config.discord.variantSC2:
            if (fs.existsSync(`./data/SC2/siege.json`)) {
                infoSiege = require("../data/SC2/siege.json");
                consoleLog(`OK : Fichier trouver : ./data/SC2/siege.json - ${variantSC}`);
            }
        break;
        case config.discord.variantSC3: 
            if (fs.existsSync(`./data/SC3/siege.json`)) {
                infoSiege = require("../data/SC3/siege.json");
                consoleLog(`OK : Fichier trouver : ./data/SC3/siege.json - ${variantSC}`);
            }
        break;
        case config.discord.variantSC4:
            if (fs.existsSync(`./data/SC4/siege.json`)) {
                infoSiege = require("../data/SC4/siege.json");
                consoleLog(`OK : Fichier trouver : ./data/SC4/siege.json - ${variantSC}`);
            }
        break;
        default:
            let errorProcessingGuildVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
            .setFooter("Erreur : errorProcessingGuildVariant")
            return message.channel.send(errorProcessingGuildVariant) | consoleLog(`ERROR : errorProcessingGuildVariant - ${variantSC}`, NaN, infoUser)
    } 

    let errorProccessingDataUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Traitement du fichier  :x:`)
    .setDescription(`:x: Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.discord.prefix}dl .`) 
    .setFooter("Erreur : errorProccessingDataUndefined")

    if (infoSiege == null) return message.channel.send(errorProccessingDataUndefined) | consoleLog(`ERROR : errorProccessingDataUndefined - ${variantSC}`, NaN, infoUser)

    //Lecture du première argument apr_s la commandes (pour récupérer l'id)
    var siegeId = args[1];

    let errorArgsId = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur :x:`)
    .setDescription(":x: Vous n'avez pas rentrer d'ID !")
    .setFooter("Erreur : errorArgsId")

    if (siegeId == undefined) return message.channel.send(errorArgsId) | consoleLog(`ERROR : errorArgsId - ${variantSC}`, NaN, infoUser)

    //Vérification id en caractère
    let idVerife = Number.isNaN(Number(siegeId));

    let errorValueId = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur :x:`)
    .setDescription(":x: Vous n'avez pas rentrer un id correct !")
    .setFooter("Erreur : errorValueId")

    if(idVerife == true) return message.channel.send(errorValueId) | consoleLog(`ERROR : errorValueId - ${variantSC}`, NaN, infoUser)

    let errorAtttackLogUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur :x:`)
    .setDescription(":x: :x: Impossible de récupérer les informations des attaques !")
    .setFooter("Erreur : errorAtttackLogUndefined")

    if(infoSiege.attack_log == undefined) return message.channel.send(errorAtttackLogUndefined) | consoleLog(`ERROR : errorAtttackLogUndefined - ${variantSC}`, NaN, infoUser)

    var attack_log = infoSiege.attack_log.log_list;

    if (attack_log == 0) {

        let errorAttackLog = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur :x:`)
        .setDescription(":x: Impossible de récupérer les informations des attaques !")
        .setFooter("Erreur : errorAttackLog")
        message.channel.send(errorAttackLog)
        consoleLog(`ERROR : errorAttackLog - ${variantSC}`, NaN, infoUser)

    }else {

        for (const key in attack_log) {

            var attack_guild_info_list = attack_log[key].guild_info_list;
        
            if(attack_guild_info_list.length == 0){

                let errorAttackGuildInfoList = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur :x:`)
                .setDescription(":x: Impossible de récupérer les informations du siège. ! ")
                .setFooter("Erreur : errorAttackGuildInfoList")
                message.channel.send(errorAttackGuildInfoList)
                consoleLog(`ERROR : errorAttackGuildInfoList - ${variantSC}`, NaN, infoUser)

            }else{

                for (let i = 0; i < attack_guild_info_list.length; i++) {

                    if (attack_guild_info_list[i].match_id == siegeId) {
                        var attack_not_use_Calcul = (attack_guild_info_list[i].play_member_count * 10) - attack_guild_info_list[i].attack_count
                        var guildeInfo = {
                            "guild_id": attack_guild_info_list[i].guild_id,
                            "guild_name" : attack_guild_info_list[i].guild_name,
                            "attack_use" : attack_guild_info_list[i].attack_count,
                            "attack_not_use" : attack_not_use_Calcul,
                            "number_players" : attack_guild_info_list[i].play_member_count,
                            "winrate" : 0,
                            "total_attack_win" : 0,
                            "total_attack_lose" : 0,
                            "total_defense_win" : 0,
                            "total_defense_lose" : 0, 
                        }                   
                        tableauResultat.Guildes.push(guildeInfo)
                        consoleLog(`OK : DATA - ${variantSC}`, guildeInfo, infoUser)
                    }
                }
            }
    
            var attack_battle_log_list = attack_log[key].battle_log_list;
    
            var tabGuilde = tableauResultat.Guildes
    
            if (tabGuilde.length == 0) {

                let errorTabGuildeLength = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur :x:`)
                .setDescription(":x: Impossible de récupérer les informations des guildes. Merci de vérifier l'id ! ")
                .setFooter("Erreur : errorTabGuildeLength")
                message.channel.send(errorTabGuildeLength)
                consoleLog(`ERROR : errorTabGuildeLength - ${variantSC}`, NaN, infoUser)

            }else {

                for (let i = 0; i < attack_battle_log_list.length; i++) {
    
                    if (attack_battle_log_list[i].match_id == siegeId) {
        
                        var attack_wizard_name = attack_battle_log_list[i].wizard_name;
        
                        if (attack_battle_log_list[i].win_lose == 1) {
                            if (!tableauResultat.Joueurs[attack_wizard_name]) {
                                tableauResultat.Joueurs[attack_wizard_name] = {
                                    "player_id" : attack_battle_log_list[i].wizard_id, 
                                    "attack_win" : 1,
                                    "attack_lose" : 0,
                                    "defense_win" : 0,
                                    "defense_lose" : 0,
                                    "contribution" : 15,
                                };
                                for (let n = 0; n < tabGuilde.length; n++) {
                                    if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                                        tabGuilde[n].total_attack_win++
                                    }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                                        tabGuilde[n].total_defense_lose++
                                    }
                                }  
                            } else {
                                tableauResultat.Joueurs[attack_wizard_name].attack_win++;
                                tableauResultat.Joueurs[attack_wizard_name].contribution = tableauResultat.Joueurs[attack_wizard_name].contribution+15;
                                for (let n = 0; n < tabGuilde.length; n++) {
                                    if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                                        tabGuilde[n].total_attack_win++
                                    }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                                        tabGuilde[n].total_defense_lose++
                                    }
                                }
                            }
                        } else if (attack_battle_log_list[i].win_lose == 2) {
                            if (!tableauResultat.Joueurs[attack_wizard_name]) {
                                tableauResultat.Joueurs[attack_wizard_name] = {
                                    "player_id" : attack_battle_log_list[i].wizard_id,
                                    "attack_win" : 0,
                                    "attack_lose" : 1,
                                    "defense_win" : 0,
                                    "defense_lose" : 0,
                                    "contribution" : 0,
                                };
                                for (let n = 0; n < tabGuilde.length; n++) {
                                    if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                                        tabGuilde[n].total_attack_lose++
                                    }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                                        tabGuilde[n].total_defense_win++
                                    }
                                }
                            } else {
                                tableauResultat.Joueurs[attack_wizard_name].attack_lose++;
                                for (let n = 0; n < tabGuilde.length; n++) {
                                    if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                                        tabGuilde[n].total_attack_lose++
                                    }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                                        tabGuilde[n].total_defense_win++
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    let errorDefenseLogUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur :x:`)
    .setDescription(":x: :x: Impossible de récupérer les informations des attaques !")
    .setFooter("Erreur : errorDefenseLogUndefined")

    if(infoSiege.defense_log == undefined) return message.channel.send(errorDefenseLogUndefined) | consoleLog(`ERROR : errorDefenseLogUndefined - ${variantSC}`, NaN, infoUser)

    var defense_log = infoSiege.defense_log.log_list;

    for (let i = 0; i < defense_log.length; i++) {
        
        var defense_battle_log_list = defense_log[i].battle_log_list;

        for (const key in defense_battle_log_list) {
        
            if (defense_battle_log_list[key].match_id == siegeId) {

                var def_wizard_name = defense_battle_log_list[key].wizard_name;

                if (defense_battle_log_list[key].win_lose == 1) {
                    if (!tableauResultat.Joueurs[def_wizard_name]) {
                        tableauResultat.Joueurs[def_wizard_name] = {
                            "player_id" : defense_battle_log_list[key].wizard_id,
                            "attack_win" : 0,
                            "attack_lose" : 0,
                            "defense_win" : 1,
                            "defense_lose" : 0,
                            "contribution" : 5,
                        };
                        for (let n = 0; n < tabGuilde.length; n++) {
                            if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                                tabGuilde[n].total_defense_win++
                            }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                                tabGuilde[n].total_attack_lose++
                            }
                        }
                    } else {
                        tableauResultat.Joueurs[def_wizard_name].defense_win++;
                        tableauResultat.Joueurs[def_wizard_name].contribution =  tableauResultat.Joueurs[def_wizard_name].contribution+5;
                        for (let n = 0; n < tabGuilde.length; n++) {
                            if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                                tabGuilde[n].total_defense_win++
                            }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                                tabGuilde[n].total_attack_lose++
                            }
                        }
                    }
                } else if (defense_battle_log_list[key].win_lose == 2) {
                    if (!tableauResultat.Joueurs[def_wizard_name]) {
                        tableauResultat.Joueurs[def_wizard_name] = {
                            "player_id" : defense_battle_log_list[key].wizard_id,
                            "attack_win" : 0,
                            "attack_lose" : 0,
                            "defense_win" : 0,
                            "defense_lose" : 1,
                            "contribution" : 0,
                        };
                        for (let n = 0; n < tabGuilde.length; n++) {
                            if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                                tabGuilde[n].total_defense_lose++
                            }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                                tabGuilde[n].total_attack_win++
                            }
                        }
                    } else {
                        tableauResultat.Joueurs[def_wizard_name].defense_lose++;
                        for (let n = 0; n < tabGuilde.length; n++) {
                            if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                                tabGuilde[n].total_defense_lose++
                            }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                                tabGuilde[n].total_attack_win++
                            }
                        }
                    }
                }   
            } 
        }
    }

    if (tableauResultat.Guildes.length == 0){
        consoleLog(`ERROR : INTERNE="tableauResultat.Guildes.length == 0" - ${variantSC}`, NaN, infoUser)
    } else {
        var winrate_calcul1 = null;
        var winrate_calcul2 =  null;
    
        for (let i = 0; i < tableauResultat.Guildes.length; i++) {
    
            winrate_calcul1 = tableauResultat.Guildes[i].total_attack_lose / (tableauResultat.Guildes[i].total_attack_win + tableauResultat.Guildes[i].total_attack_lose) * 100
            winrate_calcul2  = 100 - winrate_calcul1
            tableauResultat.Guildes[i].winrate = winrate_calcul2.toFixed(0)+"%";
            
        }
    }

    switch (variantSC){
                        
        case config.discord.variantSC1:
          
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC1/tableauResultat.json', function (err) {
                    if (err) {
                        consoleLog(`ERROR : Rien a supprimé : ./data/SC1/tableauResultat.json - ${variantSC}`)
                    }else {
                        consoleLog(`OK : Fichier supprimé : ./data/SC1/tableauResultat.json - ${variantSC}`)
                    }
                });
                fs.writeFile(`./data/SC1/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème tecnique sur le traitement ${config.discord.variantSC1} :x:`)
                        .setFooter("Erreur : errorSaveFile")
                        message.channel.send(errorSaveFile)
                        consoleLog(`ERROR : errorSaveFile - ${variantSC}`, err, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.discord.variantSC1}!`)
                        message.channel.send(processingEmbed)
                        consoleLog(`Ok : processingEmbed - ${variantSC}`, NaN, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    }
                }); 
            }       
        break;
        case config.discord.variantSC2:
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC2/tableauResultat.json', function (err) {
                    if (err) {
                        consoleLog(`ERROR : Rien a supprimé : ./data/SC2/tableauResultat.json - ${variantSC}`)
                    }else {
                        consoleLog(`OK : Fichier supprimé : ./data/SC2/tableauResultat.json - ${variantSC}`)
                    }
                });
                fs.writeFile(`./data/SC2/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème technique sur le traitement ${config.discord.variantSC2} :x:`)
                        .setFooter("Erreur : errorSaveFile")
                        message.channel.send(errorSaveFile)
                        consoleLog(`ERROR : errorSaveFile - ${variantSC}`, err, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.discord.variantSC2}!`)
                        message.channel.send(processingEmbed)
                        consoleLog(`Ok : processingEmbed - ${variantSC}`, NaN, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    }
                });        
            }
        break;
        case config.discord.variantSC3: 
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC3/tableauResultat.json', function (err) {
                    if (err) {
                        consoleLog(`ERROR : Rien a supprimé : ./data/SC3/tableauResultat.json - ${variantSC}`)
                    }else {
                        consoleLog(`OK : Fichier supprimé : ./data/SC3/tableauResultat.json - ${variantSC}`)
                    }
                });
                fs.writeFile(`./data/SC3/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème technique sur le traitement ${config.discord.variantSC3} :x:`)
                        .setFooter("Erreur : errorSaveFile")
                        message.channel.send(errorSaveFile)
                        consoleLog(`ERROR : errorSaveFile - ${variantSC}`, err, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.discord.variantSC3}!`)
                        message.channel.send(processingEmbed)
                        consoleLog(`Ok : processingEmbed - ${variantSC}`, NaN, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    }
                });    
            }
        break;
        case config.discord.variantSC4:
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC4/tableauResultat.json', function (err) {
                    if (err) {
                        consoleLog(`ERROR : Rien a supprimé : ./data/SC4/tableauResultat.json - ${variantSC}`)
                    }else {
                        consoleLog(`OK : Fichier supprimé : ./data/SC4/tableauResultat.json - ${variantSC}`)
                    }
                });
                fs.writeFile(`./data/SC4/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème technique sur le traitement ${config.discord.variantSC4} :x:`)
                        .setFooter("Erreur : errorSaveFile")
                        message.channel.send(errorSaveFile)
                        consoleLog(`ERROR : errorSaveFile - ${variantSC}`, err, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.discord.variantSC4}!`)
                        message.channel.send(processingEmbed)
                        consoleLog(`Ok : processingEmbed - ${variantSC}`, NaN, infoUser)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    }
                });  
            }      
        break;
        default:
            let errorHttpsGuildVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Traitement du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
            .setFooter("Erreur : errorGuildVariant")
            message.channel.send(errorHttpsGuildVariant)
            consoleLog(`ERROR : errorGuildVariant - ${variantSC}`, NaN, infoUser)
    } 
}

//Module export
module.exports = processing;