//Import de la config
const config = require('../config/config.json')

//Import du module FS
const fs = require('fs');

//Import discord
const Discord = require('discord.js');

var tableauResultat = {Guildes : [], Joueurs : {}}

//Module export
module.exports = {
    'processing': processing,
}

function processing (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.prefix) 
            message[0] = message[0].slice(1);

    }

    var infoSiege = null;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    var variantSC = args[0]

    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Traitement  du fichier  :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant  - errorVariant")

    if (variantSC == undefined) return message.channel.send(errorArgsVariant)

    switch (variantSC){
                        
        case config.variantSC1:
            if (fs.existsSync(`./data/SC1/siege.json`)) {
                console.log("Fichier trouver : ./data/SC1/siege.json")
                infoSiege = require("../data/SC1/siege.json");
            }
        break;
        case config.variantSC2:
            if (fs.existsSync(`./data/SC2/siege.json`)) {
                console.log("Fichier trouver : ./data/SC2/siege.json")
                infoSiege = require("../data/SC2/siege.json");
            }
        break;
        case config.variantSC3: 
            if (fs.existsSync(`./data/SC3/siege.json`)) {
                console.log("Fichier trouver : ./data/SC3/siege.json")
                infoSiege = require("../data/SC3/siege.json");
            }
        break;
        case config.variantSC4:
            if (fs.existsSync(`./data/SC4/siege.json`)) {
                console.log("Fichier trouver : ./data/SC4/siege.json")
                infoSiege = require("../data/SC4/siege.json");
            }
        break;
        default:
            let errorProcessingGuildVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
            .setFooter("Erreur : errorProcessingGuildVariant - SWITCH")
            return message.channel.send(errorProcessingGuildVariant)
    } 

    let errorProccessingDataUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Traitement du fichier  :x:`)
    .setDescription(`:x: Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.prefix}dl .`) 
    .setFooter("Erreur : errorProccessingDataUndefined - FILE DATA UNDEFINED")

    if (infoSiege == null) return message.channel.send(errorProccessingDataUndefined) | console.log(`Impossible de toruver le fichier : ../data/${variantSC}/siege.json`)

    //Lecture du première argument apr_s la commandes (pour récupérer l'id)
    var siegeId = args[1];

    let errorArgsId = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur :x:`)
    .setDescription(":x: Vous n'avez pas rentrer d'ID !")
    .setFooter("Erreur : id args = errorArgsId")

    if (siegeId == undefined) return message.channel.send(errorArgsId)

    //Vérification id en caractère
    let idVerife = Number.isNaN(Number(siegeId));

    let errorValueId = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur :x:`)
    .setDescription(":x: Vous n'avez pas rentrer un id correct !")
    .setFooter("Erreur : errorValueId = VALUE FORMAT INCORRECT")

    if(idVerife == true) return message.channel.send(errorValueId)

    let errorAtttackLogUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur :x:`)
    .setDescription(":x: :x: Impossible de récupérer les informations des attaques !")
    .setFooter("Erreur : errorAtttackLogUndefined = UNDEFINED ATTAQUE LOG")

    if(infoSiege.attack_log == undefined) return message.channel.send(errorAtttackLogUndefined) | console.log("attack_ log undefined ")

    var attack_log = infoSiege.attack_log.log_list;

    if (attack_log == 0) {

        let errorAttackLog = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur :x:`)
        .setDescription(":x: Impossible de récupérer les informations des attaques !")
        .setFooter("Erreur : attack_log = errorAttackLog")
        message.channel.send(errorAttackLog)

    }else {

        for (const key in attack_log) {

            var attack_guild_info_list = attack_log[key].guild_info_list;
        
            if(attack_guild_info_list.length == 0){

                let errorAttackGuildInfoList = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur :x:`)
                .setDescription(":x: Impossible de récupérer les informations du siège. ! ")
                .setFooter("Erreur : attack_guild_info_list.length = errorAttackGuildInfoList")
                message.channel.send(errorAttackGuildInfoList)

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
                .setFooter("Erreur : tabGuilde.length = errorTabGuildeLength")
                message.channel.send(errorTabGuildeLength)

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
    .setFooter("Erreur : errorDefenseLogUndefined = UNDEFINED ATTAQUE LOG")

    if(infoSiege.defense_log == undefined) return message.channel.send(errorDefenseLogUndefined) | console.log("deffense_ log undefined ")

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
        console;Log("error donnée rien trouver")
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
                        
        case config.variantSC1:
          
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC1/tableauResultat.json', function (err) {
                    if (err) {
                        console.log("Rien a supprimé : ./data/SC1/tableauResultat.json")
                    }else {
                        console.log('Fichier supprimé : ./data/SC1/tableauResultat.json');
                    }
                });
                fs.writeFile(`./data/SC1/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème tecnique sur le traitement ${config.variantSC1} :x:`)
                        .setFooter("Erreur : errorSaveFile = Filed save")
                        message.channel.send(errorSaveFile)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.variantSC1}!`)
                        message.channel.send(processingEmbed)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    }
                }); 
            }       
        break;
        case config.variantSC2:
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC2/tableauResultat.json', function (err) {
                    if (err) {
                        console.log("Rien a supprimé : ./data/SC2/tableauResultat.json")
                    }else {
                        console.log('Fichier supprimé : ./data/SC2/tableauResultat.json');
                    }
                });
                fs.writeFile(`./data/SC2/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème technique sur le traitement ${config.variantSC2} :x:`)
                        .setFooter("Erreur : errorSaveFile = Filed save")
                        message.channel.send(errorSaveFile)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.variantSC2}!`)
                        message.channel.send(processingEmbed)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    }
                });        
            }
        break;
        case config.variantSC3: 
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC3/tableauResultat.json', function (err) {
                    if (err) {
                        console.log("Rien a supprimé : ./data/SC3/tableauResultat.json")
                    }else {
                        console.log('Fichier supprimé : ./data/SC3/tableauResultat.json');
                    }
                });
                fs.writeFile(`./data/SC3/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème technique sur le traitement ${config.variantSC3} :x:`)
                        .setFooter("Erreur : errorSaveFile = Filed save")
                        message.channel.send(errorSaveFile)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.variantSC3}!`)
                        message.channel.send(processingEmbed)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    }
                });    
            }
        break;
        case config.variantSC4:
            if (tableauResultat.Guildes.length == 0){

            }else {
                fs.unlink('./data/SC4/tableauResultat.json', function (err) {
                    if (err) {
                        console.log("Rien a supprimé : ./data/SC4/tableauResultat.json")
                    }else {
                        console.log('Fichier supprimé : ./data/SC4/tableauResultat.json');
                    }
                });
                fs.writeFile(`./data/SC4/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {
                    if(err){
                        let errorSaveFile = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Erreur :x:`)
                        .setDescription(`:x: Problème technique sur le traitement ${config.variantSC4} :x:`)
                        .setFooter("Erreur : errorSaveFile = Filed save")
                        message.channel.send(errorSaveFile)
                        tableauResultat = {Guildes : [], Joueurs : {}}
                        infoSiege = null;
                    } else {
                        //On envois les information des guildes du siège
                        let processingEmbed = new Discord.MessageEmbed()
                        .setColor("#01E007")
                        .setTitle(':white_check_mark: Traitement fini :white_check_mark:')
                        .setDescription(`Les traitement des données on été effectuée sur ${config.variantSC4}!`)
                        message.channel.send(processingEmbed)
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
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
            .setFooter("Erreur : errorGuildVariant - SWITCH")
            message.channel.send(errorHttpsGuildVariant)
    } 
}