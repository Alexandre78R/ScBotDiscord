//Import de la config
const config = require('../../config/config')

const consoleLog = require("../../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import user query
const sqlUser = require("../../query/user.js");

const sqlBattle = require("../../query/battle.js");

var userInfo = require("../../function/userinfo.js");

//Function checkMaintenance
var checkMaintenance = require("../../function/checkMaintenance.js")

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
    var result = await sqlBattle.dataTableByUser(userId);
    // console.log("result", result);
    if (result[1].length == 0) {
        return "invalid";
    }else if (result[2].length == 0) {
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
        consoleLog(`ERROR : infouserNotFound`, NaN, infoUser);
        return infouserNotFound;
    } else {

        var tableResultOffense = results[1];
        var tableResultDeffense = results[2];
        
        var newTableOffense = [];
        var newTableDefense = [];

        for (let o = 0; o < tableResultOffense.length; o++) {
            console.log('tableResultOffense', tableResultOffense[o]);
            newTableOffense.push({name: tableResultOffense[o].teamName, value: tableResultOffense[o].offense_idFrequency, inline : true});
        }

        for (let d = 0; d < tableResultDeffense.length; d++) {
            console.log('tableResultDeffense', tableResultDeffense[d]);
            newTableDefense.push({name: tableResultDeffense[d].teamName, value: tableResultDeffense[d].defense_idFrequency, inline : true});
        }

        const infoUserEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Information de ${infoUser.username} (#${infoUser.id})`)
        .setDescription(`Nombre d’offense proposée : ${results[0]}`)
        .addField(`TOP 3 d'offense les plus utilisé :`, '\u200b')
        .addFields(newTableOffense);
        infoUserEmbed.addField(`TOP 3 des défenses participer :`,'\u200b');
        infoUserEmbed.addFields(newTableDefense);
        
        return infoUserEmbed;
    }
}

async function processRequest (message, infoUser){
 
    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        console.log("userId", userId)
        //Check userId validity and return user_id
        const listBattle = await listBattleMyUser(userId, infoUser);
        
        if(listBattle != "invalid"){

            //Successful message
            const successfulMessage = buildSuccessfulMessage(listBattle, infoUser)
            message.channel.send(successfulMessage)
            
        }else{

            let inaccessibilityListBattleError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Impossible d'envoyer les données  :x:`)
            .setDescription(`:x: ${infoUser.username}, impossible de vous trouver dans la base de donnée merci d'abord d'ajouter des offenses avec la commande ${config.discord.prefix}offense.`)
            .setFooter("Erreur : inaccessibilityListBattleError")
            message.channel.send(inaccessibilityListBattleError)
            consoleLog(`ERROR : inaccessibilityListBattleError`, NaN, infoUser)

        }
    }
}

function myContrib (message) {

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
    var infoUser = userInfo("./commands/mycontrib.js", message);

    var statutcommand = checkMaintenance (message, "mycontrib", infoUser)
    if(statutcommand == false) return;

    processRequest(message, infoUser);
}

//Module export
module.exports = myContrib;