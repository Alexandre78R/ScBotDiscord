//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import function checkRolePerm
const checkRolePerm = require('../function/checkRolePerm.js');

//Function checkMaintenance 
const checkMaintenance = require('../function/checkMaintenance.js');

const userInfo = require('../function/userinfo.js');

const checkNumber = require("../function/checkNumber.js");

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

async function checkValueIdTable (valueId, listBattle, infoUser, message) {
    console.log("ValueID", valueId)
    var newTabId = []
    for (let i = 0; i < listBattle[0].length; i++) {
        newTabId.push(`${listBattle[0][i].id}`);
    }
    console.log("newTabId", newTabId)
    if (newTabId.indexOf(valueId) == -1){
        const valueIdNotFound = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Résultat incorrect :x:`)
        .setDescription(`:x: ${infoUser.username}, impossible on n'a pas trouver cette id ou sois vous n'avez pas accès à la battle de cette id !`)
        .setFooter("Erreur : valueIdNotFound");
        message.channel.send(valueIdNotFound)
        return "invalid";
        
    } else {
        return true;
    }
}

async function processRequest (valueId, message, infoUser){

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        const listBattle = await listBattleLastoffense(userId, infoUser, message);

        if(listBattle != "invalid"){

            const checkValue = await checkValueIdTable(valueId, listBattle, infoUser, message);
            
            console.log("checkValue --->", checkValue);

            if(checkValue != "invalid"){

                const delValue = await sqlBattle.delBattles(valueId);

                if(delValue != "invalid") {

                    let inaccessibilityError = new Discord.MessageEmbed()
                    .setColor("#01E007")
                    .setTitle(`:white_check_mark: Super :white_check_mark:`)
                    .setDescription(`:tada:${message.author.username}, l'offense à bien était supprimer de notre base de donnée !`);
                    message.channel.send(inaccessibilityError);
                    
                } else {

                    const errorBattleNodelete = new Discord.MessageEmbed()
                    .setColor("#F00E0E")
                    .setTitle(`:x: Résultat incorrect :x:`)
                    .setDescription(`:x: ${infoUser.username}, impossible de supprimer cette offense !`)
                    .setFooter("Erreur : errorBattleNodelete");
                    message.channel.send(errorBattleNodelete);

                }
            }
        }
    }
}

function deloffense (message) {

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
    var infoUser = userInfo("./commands/deloffense.js", message);

    var statutcommand = checkMaintenance (message, "deloffense", infoUser);
    if(statutcommand == false) return;


    var checkPerm = checkRolePerm(message, config.discord.roles_id.DEV, infoUser);
    if (checkPerm == false) return;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    const argumentUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Argument introuvable  :x:`)
    .setDescription(`:x: ${infoUser.username}, impossible vous n'avez pas renter d'argument à coter de la commande !`)
    .setFooter("Erreur : argumentUndefined");

    if (args[0] == undefined) return message.channel.send(argumentUndefined) | consoleLog(`ERROR : argumentUndefined`, NaN, infoUser);

    var checkArgsNum = checkNumber(args[0])

    const noNumberValue = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Argument introuvable  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de rentrer un vrais id !`)
    .setFooter("Erreur : noNumberValue");

    if (checkArgsNum == "Not a Number!") return message.channel.send(noNumberValue) | consoleLog(`ERROR : noNumberValue`, NaN, infoUser);
    
    processRequest(args[0], message, infoUser);
}

//Module export
module.exports = deloffense;