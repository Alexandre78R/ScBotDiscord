//Import de la config
const config = require('../../config/config')

//Import function consoleLog
const consoleLog = require("../../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import function checkRolePerm
const checkRoleAdmin = require('../../function/checkRoleAdmin.js');

// Import the discord.js-pagination package
const paginationEmbed = require('../../module/discord.js-pagination.js');

//Function checkMaintenance 
const checkMaintenance = require('../../function/checkMaintenance.js');

const userInfo = require('../../function/userinfo.js')

//Import user query
const sqlUser = require("../../query/user.js");

//Import battle query
const sqlBattle = require("../../query/battle.js");

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

async function listBattleAdmin (dateStart, dateEnd, infoUser) {
    var result = await sqlBattle.dataTableListOffenseAdmin(dateStart, dateEnd);
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
        .setDescription(`:x: ${infoUser.username}, désolé on n'a aucune information sur vous...`)
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

        console.log("tableResultOffense", tableResultOffense)
        var pages = [];
        var tabListTabResult = [];
        var lengthPage = 5;
        
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
        // return console.log('Info :', dateStart, dateEnd, results);
    }
}

async function processRequest (dateStart, dateEnd, message, infoUser){

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        //Check userId validity and return user_id
        const listBattle = await listBattleAdmin(dateStart, dateEnd, infoUser);
        
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
    var infoUser = userInfo("./commands/test.js", message);

    var statutcommand = checkMaintenance(message, "listoffense", infoUser);
    if(statutcommand == false) return;


    var checkPerm = checkRoleAdmin(message, infoUser);
    if (checkPerm == false) return;
    // message.channel.send('Command listoffense : ');

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    const argumentOneUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Argument introuvable  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de entré une date en format yyyy-mm-dd (Date de départ pour la recherche) !`)
    .setFooter("Erreur : argumentOneUndefined");

    if (args[0] == undefined) return message.channel.send(argumentOneUndefined) | consoleLog(`ERROR : argumentOneUndefined`, NaN, infoUser);
    console.log('args', args);

    const argumentTwoUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Argument introuvable  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de entré une date en format yyyy-mm-dd (Date de fin pour la recherche) !`)
    .setFooter("Erreur : argumentTwoUndefined");

    if (args[1] == undefined) return message.channel.send(argumentTwoUndefined) | consoleLog(`ERROR : argumentTwoUndefined`, NaN, infoUser);
    console.log('args', args);

    var dateStart = args[0];
    var dateEnd = args[1];
    processRequest(dateStart, dateEnd, message, infoUser);
}

//Module export
module.exports = listoffense;