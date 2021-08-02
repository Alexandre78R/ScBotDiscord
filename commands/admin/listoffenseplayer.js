//Import de la config
const config = require('../../config/config');

//Import function consoleLog
const consoleLog = require('../../function/consoleLog.js');

//Import de la LIBS discord.js
const Discord = require('discord.js');

// Import userInfo
const userInfo = require('../../function/userinfo.js');

//Function checkMaintenance 
const checkMaintenance = require('../../function/checkMaintenance.js');

//Import user query
const sqlUser = require('../../query/user.js');

//Import Battle query
const sqlBattle = require('../../query/battle.js');

//Import function dateFormat
var dateFormat = require('../../function/dateFormat.js');

// Import the discord.js-pagination package
const paginationEmbed = require('../../module/discord.js-pagination.js');

//Import function checkMessageContent 
const checkMessageContent = require('../../function/checkMessageContent.js');

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

async function checkUserBdd (searchUser, message, infoUser) {
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

async function listBattlePlayer (userId, dateStart, dateEnd, infoUser) {
    var result = await sqlBattle.dataTableListOffensePlayerAdmin(userId, dateStart, dateEnd);
    if (result[1].length == 0) {
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
        .setDescription(`:x: ${infoUser.username}, ${objectUserSearch.usernameDiscord} (#${objectUserSearch.idDiscord}) n'a pas jamais entré d'offense pendant cette période : ${dateStart} au ${dateEnd} ! `)
        .setFooter("Erreur : infouserNotFound");

        var messageError = message.channel.send(infouserNotFound);
        return messageError;

    } else {
        var countTotal = results[0].total;
        var tableResultOffense = results[1];

        var pages = [];
        var tabListTabResult = [];
        var lengthPage = 9;
        
        for (let o = 0; o < tableResultOffense.length; o++) {
            if (tabListTabResult.length == 0) {
                tabListTabResult.push([]);
                tabListTabResult[tabListTabResult.length-1].push({ name: `N°${o}`, value: `Offense : ${tableResultOffense[o].offense} \nDéfense : ${tableResultOffense[o].defense} \n${tableResultOffense[o].result == "W" ? "Victoire" : "Perdu"}\nDate : ${dateFormat(tableResultOffense[o].created_at)}`});
            } else {
                if (tabListTabResult[tabListTabResult.length-1].length < lengthPage){
                    tabListTabResult[tabListTabResult.length-1].push({ name: `N°${o}`, value: `Offense : ${tableResultOffense[o].offense} \nDéfense : ${tableResultOffense[o].defense} \n${tableResultOffense[o].result == "W" ? "Victoire" : "Perdu"}\nDate : ${dateFormat(tableResultOffense[o].created_at)}`});
                } else {
                    tabListTabResult.push([]);
                    tabListTabResult[tabListTabResult.length-1].push({ name: `N°${o}`, value: `Offense : ${tableResultOffense[o].offense} \nDéfense : ${tableResultOffense[o].defense} \n${tableResultOffense[o].result == "W" ? "Victoire" : "Perdu"}\nDate : ${dateFormat(tableResultOffense[o].created_at)}`});
                }
            }
        }

        for (let i = 0; i < tabListTabResult.length; i++) {
            console.log("tabListTabResult[i].length", tabListTabResult[i].length);
            const infoUserEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations - ${objectUserSearch.usernameDiscord}- ${objectUserSearch.idDiscord}\n\nNombre d'offense entré : ${countTotal} \n\nListe des offenses utilisées :`)
            .addFields(tabListTabResult[i]);
            pages.push(infoUserEmbed);
        }

        var resultPage = paginationEmbed(message, pages);

        return resultPage;
    }
}

async function processRequest (newSearchPlayer, dateStart, dateEnd, message, infoUser){

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        const searchUserBdd = await checkUserBdd(newSearchPlayer, message, infoUser);

        if (searchUserBdd != 'invalid') {

            var objectUser = {
                "id" : searchUserBdd[0],
                'idDiscord' : searchUserBdd[1],
                'usernameDiscord' : searchUserBdd[2]
            };

            //Check userId validity and return user_id
            const listBattle = await listBattlePlayer(objectUser.id, dateStart, dateEnd, infoUser);

            if(listBattle != "invalid"){

                //Successful message
                const successfulMessage = await buildSuccessfulMessage(listBattle, objectUser, message, infoUser);
                return successfulMessage;
                
            }else{

                let inaccessibilityListBattleError = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                .setDescription(`:x: ${infoUser.username}, ${objectUser.usernameDiscord} (#${objectUser.idDiscord}) n'a pas jamais entré d'offense pendant cette période : ${dateStart} au ${dateEnd} ! `)
                .setFooter("Erreur : inaccessibilityListBattleError");
                message.channel.send(inaccessibilityListBattleError);
                consoleLog(`ERROR : inaccessibilityListBattleError`, NaN, infoUser);

            }
        }
    }
}

function listoffenseplayer (message) {

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
    var infoUser = userInfo("./commands/listoffenseplayer.js", message);

    var statutcommand = checkMaintenance(message, "listoffenseplayer", infoUser);
    if (statutcommand == false) return;

    var verifMessage = checkMessageContent(message.content.split(" "));

    let errorArgsTiretInferior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré assez de tiret !`) 
    .setFooter("Erreur : errorArgsTiretInferior");

    if (verifMessage.tiret < 2) return message.channel.send(errorArgsTiretInferior) && consoleLog(`ERROR : errorArgsTiretInferior`, NaN, infoUser);

    let messageArray = verifMessage.message.split("-");
    let searchPlayer = messageArray[0].split(" ").slice(1).filter(Boolean);

    let usernameOrIdusernameNotFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas rentrer d'argument avec le tag d'username de discord ou sois son id discord. Pour voir ses stats.`) 
    .setFooter("Erreur : usernameOrIdusernameNotFound");

    if (searchPlayer.length == 0) return message.channel.send(usernameOrIdusernameNotFound) && consoleLog(`ERROR : usernameOrIdusernameNotFound`, NaN, infoUser);

    console.log("searchPlayer", searchPlayer);

    let dateStart = messageArray[1];

    let errorArgsDateStart = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username},  merci de entré une date en format yyyy-mm-dd (Date de fin pour la recherche) vous pouvez mettre l'heure mais c'est facultatif en format hh:mm:ss !`) 
    .setFooter("Erreur : errorArgsDateEnd");

    if (dateStart == undefined) return message.channel.send(errorArgsDateStart) && consoleLog(`ERROR : errorArgsDateStart`, NaN, infoUser);

    let dateEnd = messageArray[2];

    let errorArgsDateEnd = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username},  merci de entré une date en format yyyy-mm-dd (Date de fin pour la recherche) vous pouvez mettre l'heure mais c'est facultatif en format hh:mm:ss !`) 
    .setFooter("Erreur : errorArgsDateEnd");

    if (dateEnd == undefined) return message.channel.send(errorArgsDateEnd) && consoleLog(`ERROR : errorArgsDateEnd`, NaN, infoUser);

    var newSearchPlayer = '';
    for (let i = 0; i < searchPlayer.length; i++) {
        newSearchPlayer += searchPlayer[i]; 
    }

    console.log(newSearchPlayer, dateStart, dateEnd, message, infoUser)
    processRequest(newSearchPlayer, dateStart, dateEnd, message, infoUser)
}

//Module export
module.exports = listoffenseplayer;