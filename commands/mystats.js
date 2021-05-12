//Import de la config
const config = require('../config/config')

const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import user query
const sqlUser = require("../query/user.js");

//Import battle query
const sqlBattle = require("../query/battle.js");

var dateFormat = require("../function/dateFormat.js");

//Function checkMaintenance
var checkMaintenance = require("../function/checkMaintenance.js");

var userInfo = require("../function/userinfo.js");

async function checkUserId (message, infoUser) {
    var result = await sqlUser.checkUserId(message, infoUser);
    if (!result) {
        const noPermUserSC = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Permission refuser :x:`)
        .setDescription(`:x: ${infoUser.username}, vous n'avez pas les permissions pour utiliser cette commande. Cette commande est réservée aux membres de la guilde !`)
        .setFooter("Erreur : noPermUserSC");
        message.channel.send(noPermUserSC);
        return "invalid";
    } else {
        return result;
    }
}

async function listBattleMyUser (userId, infoUser) {
    var result = await sqlBattle.dataTableByUserMyStats(userId);
    if (result.length == 0) {
        return "invalid";
    } else {
        return result;
    }
}

function buildSuccessfulMessage(results, infoUser) {

    if (results.length == 0){
        const infouserNotFound = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: ${infoUser.username}, désolé on n'a aucune information sur vous...`)
        .setFooter("Erreur : infouserNotFound");
        return infouserNotFound;
    } else {
        var countTotal = results[0].total;
        var countWin = results[0].win;
        var countLose = results[0].lose;
        var tableResultOffense = results[1];
        var winrateTotal = Math.round( countWin * 100 / (countWin + countLose) * 10 ) / 10;
        
        var newTableOffense = [];

        for (let o = 0; o < tableResultOffense.length; o++) {
            var percentage = Math.round( tableResultOffense[o].win * 100 / (tableResultOffense[o].win + tableResultOffense[o].lose) * 10 ) / 10;
            var frequency = tableResultOffense[o].win + tableResultOffense[o].lose;
            newTableOffense.push({ name: tableResultOffense[o].teamName, value: percentage + '% (Win rate) \n' + frequency + ' combats', inline: true });
        }

        
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        const infoUserEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations - ${infoUser.username} \n\nNombre de combats depuis le ${dateFormat(startDate)} : ${countTotal} - ${winrateTotal}% (Win rate) \n\nListe des offenses utilisées :`)
            .addFields(newTableOffense);
        return infoUserEmbed;
    }
}

async function processRequest (message, infoUser){

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        //Check userId validity and return user_id
        const listBattle = await listBattleMyUser(userId, infoUser);
        
        if(listBattle != "invalid"){

            //Successful message
            const successfulMessage = buildSuccessfulMessage(listBattle, infoUser);
            message.channel.send(successfulMessage);
            
        }else{

            let inaccessibilityListBattleError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Impossible d'envoyer les données  :x:`)
            .setDescription(`:x: ${infoUser.username}, impossible de vous trouver dans la base de donnée merci d'abord d'ajouter des offenses avec la commande ${config.discord.prefix}offense.`)
            .setFooter("Erreur : inaccessibilityListBattleError");
            message.channel.send(inaccessibilityListBattleError);
            consoleLog(`ERROR : inaccessibilityListBattleError`, NaN, infoUser);

        }
    }
}

function mystats (message) {

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
    var infoUser = userInfo("./commands/mystats.js", message);

    var statutcommand = checkMaintenance (message, "mystats", infoUser);
    if(statutcommand == false) return;

    processRequest(message, infoUser);
}

//Module export
module.exports = mystats;