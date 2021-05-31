//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Function checkMaintenance 
const checkMaintenance = require('../function/checkMaintenance.js')

const userInfo = require('../function/userinfo.js')

//Import user query
const sqlUser = require("../query/user.js");

//Import battle query
const sqlBattle = require("../query/battle.js");

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

async function listBattleLastoffense (userId, infoUser, message) {
    var result = await sqlBattle.dataTableLastoffense(userId);
    if (result[0].length == 0) {
        const battleUndefined = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Résultat incorrect :x:`)
        .setDescription(`:x: ${infoUser.username}, impossible vous n'avez jamais utiliser la commandes ${config.discord.prefix}offense sous les dernières 24h !`)
        .setFooter("Erreur : battleUndefined");
        message.channel.send(battleUndefined);
        return "invalid";
    } else {
        return result;
    }
}

function buildSuccessfulMessage(results, message, infoUser) {

    if (results.length == 0){
        const battleUndefinedBuildMessage = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: ${infoUser.username}, impossible vous n'avez jamais utiliser la commande ${config.discord.prefix}offense !`)
        .setFooter("Erreur : battleUndefinedBuildMessage");
        return battleUndefinedBuildMessage;
    } else {

        var tableResult = results[0];
        var pages = [];
        var tabListTabResult = [];
        var lengthPage = 5;

        for (let i = 0; i < tableResult.length; i++) {
            if (tabListTabResult.length == 0) {
                tabListTabResult.push([]);
                tabListTabResult[tabListTabResult.length-1].push({ name: `ID : ${tableResult[i].id}` , value: `Offense : ${tableResult[i].offenseName} \nDéfense : ${tableResult[i].defenseName} \n${tableResult[i].result == "W" ? "Victoire" : "Perdu"}`});
            } else {
                if (tabListTabResult[tabListTabResult.length-1].length < lengthPage){
                    tabListTabResult[tabListTabResult.length-1].push({ name: `ID : ${tableResult[i].id}` , value: `Offense : ${tableResult[i].offenseName} \nDéfense : ${tableResult[i].defenseName} \n${tableResult[i].result == "W" ? "Victoire" : "Perdu"}`});
                } else {
                    tabListTabResult.push([]);
                    tabListTabResult[tabListTabResult.length-1].push({ name: `ID : ${tableResult[i].id}` , value: `Offense : ${tableResult[i].offenseName} \nDéfense : ${tableResult[i].defenseName} \n${tableResult[i].result == "W" ? "Victoire" : "Perdu"}`});
                }
            }
        }

        for (let i = 0; i < tabListTabResult.length; i++) {
            console.log("tabListTabResult[i].length", tabListTabResult[i].length);
            var exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations - ${infoUser.username} \n\n Liste des offenses entrer depuis les 24h (Max 10 par 10) :`)
            .addFields(tabListTabResult[i]);
            pages.push(exampleEmbed);
        }
    
        console.log("Longeur Tab tabObject", tableResult.length);

        var resultPage = paginationEmbed(message, pages);

        return resultPage;

    }
}

async function processRequest (message, infoUser){

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        const listBattle = await listBattleLastoffense(userId, infoUser, message);

        if(listBattle != "invalid"){

            const successfulMessage = await buildSuccessfulMessage(listBattle, message, infoUser);
            return successfulMessage;
        }
    }
}

function lastoffense (message) {

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
    var infoUser = userInfo("./commands/lastoffense.js", message);

    var statutcommand = checkMaintenance (message, "lastoffense", infoUser);
    if(statutcommand == false) return;

    processRequest(message, infoUser);
}

//Module export
module.exports = lastoffense;