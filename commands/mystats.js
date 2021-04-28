//Import de la config
const config = require('../config/config')

const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import user query
const sqlUser = require("../query/user.js");

const sqlBattle = require("../query/battle.js");

//Function checkMaintenance
var checkMaintenance = require("../function/checkMaintenance.js")

async function checkUserId (message, infoUser) {
    var result = await sqlUser.checkUserId(message, infoUser);
    if (!result) {
        return "invalid";
    } else {
        return result;
    }
}

async function listBattleMyUser (userId, infoUser) {
    var result = await sqlBattle.dataTableByUserMyStats(userId)
    // console.log("result", result)
    if (!result) {
        return "invalid";
    } else {
        return result;
    }
}

function buildSuccessfulMessage(results, infoUser) {
    //  results = []
    if (results.length == 0){
        const infouserNotFound = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: Désolé on n'a aucune information sur vous...`)
        .setFooter("Erreur : infouserNotFound")
        //consoleLog(`ERROR : infouserNotFound`, NaN, infoUser)
        return infouserNotFound;
    } else {
        //console.log("Results dans buildSuccessFulMessage", results)
        var tableResultOffense = results[1];
        
        var newTableOffense = [];

        for (let o = 0; o < tableResultOffense.length; o++) {
            //console.log('tableResultOffense', tableResultOffense[o])
            var percentage = Math.round( tableResultOffense[o].win * 100 / (tableResultOffense[o].win + tableResultOffense[o].lose) * 10 ) / 10
            var frequency = tableResultOffense[o].win + tableResultOffense[o].lose
            newTableOffense.push({ name: tableResultOffense[o].teamName, value: percentage + '% (Win rate) \n' + frequency + ' combats', inline: true })
        }

        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        // {name: 'name 1', value: 'value1', inline : true}
        const infoUserEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations - ${infoUser.username} \n\nNombre de combats depuis le ${startDate.toISOString().split('T')[0]} : ${results[0]} \n\nListe des offenses utilisées:`)
            .addFields(newTableOffense)

        return infoUserEmbed;
    }
}

async function processRequest (message, infoUser){
    // message.channel.send('Test command Mycontrib processRequest')
    // consoleLog("Message")

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {
        // message.channel.send(`userId BDD ${userId}`)
            //Check userId validity and return user_id
        const listBattle = await listBattleMyUser(userId, infoUser);
        
        if(listBattle != "invalid"){
            // console.log( "ListBattle", listBattle)
   
            //Successful message
            const successfulMessage = buildSuccessfulMessage(listBattle, infoUser)
            message.channel.send(successfulMessage)
            
        }else{

            let inaccessibilityListBattleError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Impossible d'envoyer les données  :x:`)
            .setDescription(`:x: Il semblerait que nous rencontrions des problèmes, passe nous revoir un peu plus tard...`)
            .setFooter("Erreur : inaccessibilityListBattleError")
            message.channel.send(inaccessibilityListBattleError)
            consoleLog(`ERROR : inaccessibilityListBattleError`, NaN, infoUser)

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
    var infoUser = { location : "./commands/mystats.js", id : message.author.id, username : message.author.username, avatar : message.author.avatar, isBot : message.author.bot };

    var statutcommand = checkMaintenance (message, "mystats", infoUser)
    if(statutcommand == false) return;

    processRequest(message, infoUser);
}

//Module export
module.exports = mystats;