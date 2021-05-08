//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import function checkRolePerm
const checkRolePerm = require('../function/checkRolePerm.js');

//Function checkMaintenance 
const checkMaintenance = require('../function/checkMaintenance.js')

const userInfo = require('../function/userinfo.js')

//Import user query
const sqlUser = require("../query/user.js");

//Import battle query
const sqlBattle = require("../query/battle.js");

async function checkUserId (message, infoUser) {
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

async function listBattleLastoffense (userId, infoUser, message) {
    var result = await sqlBattle.dataTableLastoffense(userId)
    // result = []
    if (result.length == 0) {
        const battleUndefined = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Résultat incorrect :x:`)
        .setDescription(`:x: ${infoUser.username}, impossible vous n'avez jamais utiliser la commandes ${config.discord.prefix}offense !`)
        .setFooter("Erreur : battleUndefined");
        message.channel.send(battleUndefined)
        return "invalid";
    } else {
        return result;
    }
}

function buildSuccessfulMessage(results, infoUser) {

    // results = [];
    if (results.length == 0){
        const battleUndefinedBuildMessage = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: ${infoUser.username}, impossible vous n'avez jamais utiliser la commandes ${config.discord.prefix}offense !`)
        .setFooter("Erreur : battleUndefinedBuildMessage");
        return battleUndefinedBuildMessage;
    } else {

        // console.log('results', results)

        var tableResult = results[0];
        var newTable = [];

        for (let i = 0; i < tableResult.length; i++) {
            // newTable.push({ name: `Offense : ${tableResult[i].offenseName} Defense : ${tableResult[i].defenseName}`, value: tableResult[i].id, inline: true });
            newTable.push({ name: tableResult[i].id , value: `Offense : ${tableResult[i].offenseName} \n Deffense : ${tableResult[i].defenseName} \n ${tableResult[i].result == "W" ? "Victoire" : "Perdu"}`});
        }

        const infoUserEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Informations - ${infoUser.username} \n\n Liste des offenses entrer depuis les 24h (Max 10 par 10) :`)
            .addFields(newTable);
        return infoUserEmbed;
    }
}
async function processRequest (message, infoUser){

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        const listBattle = await listBattleLastoffense(userId, infoUser, message);

        if(listBattle != "invalid"){

            const successfulMessage = buildSuccessfulMessage(listBattle, infoUser)
            message.channel.send(successfulMessage)
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

    var statutcommand = checkMaintenance (message, "test", infoUser);
    if(statutcommand == false) return;


    var checkPerm = checkRolePerm(message, config.discord.roles_id.DEV, infoUser);
    if (checkPerm == false) return;

    processRequest(message, infoUser);
}

//Module export
module.exports = lastoffense;