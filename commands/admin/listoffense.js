//Import de la config
const config = require('../../config/config');

//Import function consoleLog
const consoleLog = require('../../function/consoleLog.js');

//Import de la LIBS discord.js
const Discord = require('discord.js');

//Import function checkRolePerm
const checkRoleAdmin = require('../../function/checkRoleAdmin.js');

// Import the discord.js-pagination package
const paginationEmbed = require('../../module/discord.js-pagination.js');

//Function checkMaintenance 
const checkMaintenance = require('../../function/checkMaintenance.js');

const userInfo = require('../../function/userinfo.js');

//Import user query
const sqlUser = require('../../query/user.js');

//Import battle query
const sqlBattle = require('../../query/battle.js');

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

async function listBattleAdmin (dateStart, dateEnd, filterGuild, infoUser) {
    var result = await sqlBattle.dataTableListOffenseAdmin(dateStart, dateEnd, filterGuild);
    // console.log("result", result);
    if (result[1].length == 0) {
        return "invalid";
    } else {
        return result;
    }
}

function buildSuccessfulMessage(dateStart, dateEnd, results, message, infoUser) {

    if (results.length == 0){

        const infouserNotFound = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: ${infoUser.username}, désolé on n'a aucune information entre les dates  : ${dateStart} - ${dateEnd} !`)
        .setFooter("Erreur : infouserNotFound");

        var messageError = message.channel.send(infouserNotFound);
        return messageError;
        
    } else {
        var countTotal = results[0].total;
        var totalSC1 = results[0].totalSC1;
        var totalSC2 = results[0].totalSC2;
        var totalSC3 = results[0].totalSC3;
        var totalSC4 = results[0].totalSC4;
        var tableResultOffense = results[1];

        var pages = [];
        var tabListTabResult = [];
        var lengthPage = 10;
        
        for (let o = 0; o < tableResultOffense.length; o++) {
            if (tabListTabResult.length == 0) {
                tabListTabResult.push([]);
                tabListTabResult[tabListTabResult.length-1].push({ name: `${tableResultOffense[o].user_name} (#${tableResultOffense[o].user_idDiscord}) ${tableResultOffense[o].user_nameGuild}`, value: tableResultOffense[o].nomber_offense});
            } else {
                if (tabListTabResult[tabListTabResult.length-1].length < lengthPage){
                    tabListTabResult[tabListTabResult.length-1].push({ name: `${tableResultOffense[o].user_name} (#${tableResultOffense[o].user_idDiscord}) ${tableResultOffense[o].user_nameGuild}`, value: tableResultOffense[o].nomber_offense});
                } else {
                    tabListTabResult.push([]);
                    tabListTabResult[tabListTabResult.length-1].push({ name: `${tableResultOffense[o].user_name} (#${tableResultOffense[o].user_idDiscord}) ${tableResultOffense[o].user_nameGuild}`, value: tableResultOffense[o].nomber_offense});
                }
            }
        }

        for (let i = 0; i < tabListTabResult.length; i++) {
            console.log("tabListTabResult[i].length", tabListTabResult[i].length);
            const infoUserEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations  :  \nNombres offenses Total : ${countTotal} - Nombre Offense SC1 : ${totalSC1} - Nombre Offense SC2 : ${totalSC2} - Nombre Offense SC3 : ${totalSC3} - Nombre Offense SC4 : ${totalSC4}`)
            .addFields(tabListTabResult[i]);
            pages.push(infoUserEmbed);
        }

        var resultPage = paginationEmbed(message, pages);

        return resultPage;
    }
}

async function processRequest (dateStart, dateEnd, filterGuild, message, infoUser){

    console.log("filterGuild", filterGuild);

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {
        
        const listBattle = await listBattleAdmin(dateStart, dateEnd, filterGuild, infoUser);
        
        if(listBattle != "invalid"){

            //Successful message
            const successfulMessage = await buildSuccessfulMessage(dateStart, dateEnd, listBattle, message, infoUser);
            return successfulMessage;
            
        }else{

            let inaccessibilityListBattleError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Impossible d'envoyer les données  :x:`)
            .setDescription(`:x: ${infoUser.username}, impossible de trouvée des informations entre les dates  : ${dateStart} et ${dateEnd}, vérifier peut-être le format en yyyy-mm-dd.`)
            .setFooter("Erreur : inaccessibilityListBattleError");
            message.channel.send(inaccessibilityListBattleError);
            consoleLog(`ERROR : inaccessibilityListBattleError`, NaN, infoUser);

        }
    }
}

function listoffense (message) {

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
    var infoUser = userInfo("./commands/listoffense.js", message);

    var statutcommand = checkMaintenance(message, "listoffense", infoUser);
    if(statutcommand == false) return;


    var checkPerm = checkRoleAdmin(message, infoUser);
    if (checkPerm == false) return;

    var verifMessage = checkMessageContent(message.content.split(" "));

    let errorArgsTiretInferior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré assez de tiret !`) 
    .setFooter("Erreur : errorArgsTiretInferior");

    console.log("verifMessage", verifMessage);
    if (verifMessage.tiret < 1) return message.channel.send(errorArgsTiretInferior) && consoleLog(`ERROR : errorArgsTiretInferior`, NaN, infoUser);

    let messageArray = verifMessage.message.split("-");
    let dateStart = messageArray[0].split(" ").slice(1).filter(Boolean);

    let errorArgsDateStart = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de entré une date en format yyyy-mm-dd (Date de départ pour la recherche) vous pouvez mettre l'heure mais c'est facultatif en format hh:mm:ss !`) 
    .setFooter("Erreur : errorArgsDateStart");

    if (dateStart.length == 0) return message.channel.send(errorArgsDateStart) && consoleLog(`ERROR : errorArgsDateStart`, NaN, infoUser);

    let dateEnd = messageArray[1];

    let errorArgsDateEnd = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username},  merci de entré une date en format yyyy-mm-dd (Date de fin pour la recherche) vous pouvez mettre l'heure mais c'est facultatif en format hh:mm:ss !`) 
    .setFooter("Erreur : errorArgsDateEnd");

    if (dateEnd == undefined) return message.channel.send(errorArgsDateEnd) && consoleLog(`ERROR : errorArgsDateEnd`, NaN, infoUser);

    console.log('dateStart', dateStart);
    var newDateStart = '';

    for (let i = 0; i < dateStart.length; i++) {
        if(dateStart.length == i) {
            newDateStart += dateStart[i]; 
        } else{
            newDateStart += dateStart[i] + " "; 
        }
    }
    
    console.log('new date start', newDateStart);
    console.log('date End', dateEnd);

    var filterGuild = messageArray[2];

    processRequest(newDateStart, dateEnd, filterGuild, message, infoUser);
}

//Module export
module.exports = listoffense;