//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js");

//Import de la LIBS discord.js
const Discord = require("discord.js");

// Import userInfo
const userInfo = require('../function/userinfo.js');

//Function checkMaintenance 
const checkMaintenance = require('../function/checkMaintenance.js');

//Import user query
const sqlUser = require("../query/user.js");

const sqlBattle = require("../query/battle.js");

var dateFormat = require("../function/dateFormat.js");

async function checkUserId (message, infoUser, ) {
    var result = await sqlUser.checkUserId(message, infoUser);
    if (!result) {
        const noPermUserSC = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Permission refuser :x:`)
        .setDescription(`:x: ${infoUser.username}, vous n'avez pas les permissions pour utiliser cette commande. Cette commande est réserver aux membres de la guilde !`)
        .setFooter("Erreur : noPermUserSC");
        message.channel.send(noPermUserSC)
        return "invalid";
    } else {
        return result;
    }
}

async function checkUserBdd (searchUser, message, infoUser, ) {
    var result = await sqlUser.searchUserBdd(searchUser, message, infoUser);
    if (!result) {
        const searchUserUndefined = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Permission refuser :x:`)
        .setDescription(`:x: ${infoUser.username}, impossible de trouver cette utilisateur avec ce id ou sois sont tag discord !`)
        .setFooter("Erreur : searchUserUndefined");
        message.channel.send(searchUserUndefined);
        return "invalid";
    } else {
        return result;
    }
}

async function listBattleMyUser (userId, infoUser) {
    var result = await sqlBattle.dataTableByUserMyStats(userId)
    if (result.length == 0) {
        return "invalid";
    } else {
        return result;
    }
}

function buildSuccessfulMessage(results, objectUserSearch, infoUser) {

    console.log("objectUserSearch dans buildSucces", objectUserSearch);
    if (results.length == 0){
        const infouserNotFound = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: ${infoUser.username}, désolé on n'a aucune information sur ${objectUserSearch.usernameDiscord}...`)
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
            var frequency = tableResultOffense[o].win + tableResultOffense[o].lose
            newTableOffense.push({ name: tableResultOffense[o].teamName, value: percentage + '% (Win rate) \n' + frequency + ' combats', inline: true })
        }

        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        const infoUserEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations - ${objectUserSearch.usernameDiscord} \n\nNombre de combats depuis le ${dateFormat(startDate)} : ${countTotal} - ${winrateTotal}% (Win rate) \n\nListe des offenses utilisées :`)
            .addFields(newTableOffense);
        return infoUserEmbed;
    }
}

async function processRequest (searchUser, message, infoUser){

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        const searchUserBdd = await checkUserBdd(searchUser, message, infoUser);

        if (searchUserBdd != 'invalid') {

            var objectUser = {
                "id" : searchUserBdd[0],
                'usernameDiscord' : searchUserBdd[1]
            };
            console.log('objectUser', objectUser)

            //Check userId validity and return user_id
            const listBattle = await listBattleMyUser(objectUser.id, infoUser);
            
            console.log("listBattle", listBattle)

            if(listBattle != "invalid"){

                //Successful message
                const successfulMessage = buildSuccessfulMessage(listBattle, objectUser, infoUser)
                message.channel.send(successfulMessage)
                
            }else{

                let inaccessibilityListBattleError = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                .setDescription(`:x: ${infoUser.username}, impossible de vous trouver dans la base de donnée merci d'essayer avec son id discord ou son tag discord.`)
                .setFooter("Erreur : inaccessibilityListBattleError")
                message.channel.send(inaccessibilityListBattleError)
                consoleLog(`ERROR : inaccessibilityListBattleError`, NaN, infoUser)

            }
        }
    }
}

function playerstats (message) {

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
    var infoUser = userInfo("./commands/playerstats.js", message);

    var statutcommand = checkMaintenance(message, "playerstats", infoUser);
    if (statutcommand == false) return;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    var searchUser = args[0];

    let usernameOrIdusernameNotFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible de trouver la commande :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas rentrer d'argument avec le tag d'username de discord ou sois son id discord. Pour voir ses stats.`)
    .setFooter("Erreur : usernameOrIdusernameNotFound");

    if (searchUser == undefined) return message.channel.send(usernameOrIdusernameNotFound) - consoleLog(`ERROR : usernameOrIdusernameNotFound`, NaN, infoUser);
    
    processRequest(searchUser, message, infoUser);
}

//Module export
module.exports = playerstats;