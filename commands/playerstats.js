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

//Import Battle query
const sqlBattle = require("../query/battle.js");

//Import function dateFormat
var dateFormat = require("../function/dateFormat.js");

// Import the discord.js-pagination package
const paginationEmbed = require('../module/discord.js-pagination.js');

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
    var result = await sqlBattle.dataTableByUserMyStats(userId);
    if (result.length == 0) {
        return "invalid";
    } else {
        return result;
    }
}

function buildSuccessfulMessage(results, objectUserSearch, message, infoUser) {

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
        
        var startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        var pages = [];
        var tabListTabResult = [];
        var lengthPage = 9;
        
        for (let o = 0; o < tableResultOffense.length; o++) {
            var percentage = Math.round( tableResultOffense[o].win * 100 / (tableResultOffense[o].win + tableResultOffense[o].lose) * 10 ) / 10;
            var frequency = tableResultOffense[o].win + tableResultOffense[o].lose;
            if (tabListTabResult.length == 0) {
                tabListTabResult.push([]);
                tabListTabResult[tabListTabResult.length-1].push({ name: tableResultOffense[o].teamName, value: percentage + '% (Win rate) \n' + frequency + ' combats', inline: true });
            } else {
                if (tabListTabResult[tabListTabResult.length-1].length < lengthPage){
                    tabListTabResult[tabListTabResult.length-1].push({ name: tableResultOffense[o].teamName, value: percentage + '% (Win rate) \n' + frequency + ' combats', inline: true });
                } else {
                    tabListTabResult.push([]);
                    tabListTabResult[tabListTabResult.length-1].push({ name: tableResultOffense[o].teamName, value: percentage + '% (Win rate) \n' + frequency + ' combats', inline: true });
                }
            }
        }

        for (let i = 0; i < tabListTabResult.length; i++) {
            console.log("tabListTabResult[i].length", tabListTabResult[i].length);
            const infoUserEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations - ${objectUserSearch.usernameDiscord}- ${objectUserSearch.idDiscord}\n\nNombre de combats depuis le ${dateFormat(startDate)} : ${countTotal} - ${winrateTotal}% (Win rate) \n\nListe des offenses utilisées :`)
            .addFields(tabListTabResult[i]);
            pages.push(infoUserEmbed);
        }

        var resultPage = paginationEmbed(message, pages);

        return resultPage;
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
                'idDiscord' : searchUserBdd[1],
                'usernameDiscord' : searchUserBdd[2]
            };

            //Check userId validity and return user_id
            const listBattle = await listBattleMyUser(objectUser.id, infoUser);

            if(listBattle != "invalid"){

                //Successful message
                const successfulMessage = await buildSuccessfulMessage(listBattle, objectUser, message, infoUser);
                return successfulMessage;
                
            }else{

                let inaccessibilityListBattleError = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                .setDescription(`:x: ${infoUser.username}, impossible de vous trouver dans la base de donnée merci d'essayer avec son id discord ou son tag discord.`)
                .setFooter("Erreur : inaccessibilityListBattleError");
                message.channel.send(inaccessibilityListBattleError);
                consoleLog(`ERROR : inaccessibilityListBattleError`, NaN, infoUser);

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