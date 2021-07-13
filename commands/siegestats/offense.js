//Import de la config
const config = require('../../config/config.js')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import mmonster query
const sqlMonster = require("../../query/monster.js");

//Import user query
const sqlUser = require("../../query/user.js");

//Import battle query
const sqlBattle = require("../../query/battle.js");

const consoleLog = require('../../function/consoleLog.js');

//Function checkMaintenance
var checkMaintenance = require("../../function/checkMaintenance.js");

//Import function userInfo
var userInfo = require("../../function/userinfo.js");

//Immport function checkMessageContent 
var checkMessageContent = require('../../function/checkMessageContent.js');

async function checkTeam (team, side, message, infoUser) {
    var result = await sqlMonster.checkNameValidity(team, infoUser);

    if (!result.status) {
        if (result.code == 1) {
            let nameValidityResultCode1Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, un ou plusieurs monstres en ${side} n'existent pas dans la base de donnée !`)
                .setFooter("Erreur : nameValidityResultCode1Error");
            message.channel.send(nameValidityResultCode1Error);
            consoleLog(`ERROR : nameValidityResultCode1Error`, NaN, infoUser);
            return "invalid";
        } else if (result.code == 2) {
            let nameValidityResultCode2Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, un ou plusieurs monstres en ${side} n'existent pas dans la base de donnée !`)
                .setFooter("Erreur : nameValidityResultCode2Error");
            message.channel.send(nameValidityResultCode2Error);
            consoleLog(`ERROR : nameValidityResultCode2Error`, NaN, infoUser);
            return "invalid";
        } else if (result.code == 3) {
            let nameValidityResultCode3Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, merci de préciser 3 noms de monstre dans votre ${side} !`)
                .setFooter("Erreur : nameValidityResultCode3Error");
            message.channel.send(nameValidityResultCode3Error);
            consoleLog(`ERROR : nameValidityResultCode3Error`, NaN, infoUser);
            return "invalid";
        } else if (result.code == 4) {
            let nameValidityResultCode4Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, dans votre ${side} merci de ne pas marquer le nom des monstres de la collaboration de Street Fighter mais avec leurs noms de monstres version Summoners War !`)
                .setFooter("Erreur : nameValidityResultCode4Error");
            message.channel.send(nameValidityResultCode4Error);
            consoleLog(`ERROR : nameValidityResultCode4Error`, NaN, infoUser);
            return "invalid";
        } else if (result.code == 5) {
            let nameValidityResultCode5Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, dans votre ${side} merci de préciser l’élément après avoir marqué Homunculus. Vous pouvez le marquer en version Anglais ou Français !`)
                .setFooter("Erreur : nameValidityResultCode5Error");
            message.channel.send(nameValidityResultCode5Error);
            consoleLog(`ERROR : nameValidityResultCode5Error`, NaN, infoUser);
            return "invalid";
        } else if (result.code == 6) {
            let nameValidityResultCode5Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, dans votre ${side} merci de préciser le nom des monstres. Interdiction d'utiliser les noms de familles des monstres !`)
                .setFooter("Erreur : nameValidityResultCode5Error");
            message.channel.send(nameValidityResultCode5Error);
            consoleLog(`ERROR : nameValidityResultCode5Error`, NaN, infoUser);
            return "invalid";
        } else {
            let nameValidityResultCode6Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, on rencontre un problème techniques, merci de refaire votre commande… `)
                .setFooter("Erreur : nameValidityResultCode6Error");
            message.channel.send(nameValidityResultCode6Error);
            consoleLog(`ERROR : nameValidityResultCode6Error`, NaN, infoUser);
            return "invalid";
        }
    } else {
        console.log('result status', result.status);
        return result.status;
    }
}

async function checkOutcome(outcome, message, infoUser) {
    if (outcome == "L") {
        return false;
    } else if (outcome == "W") {
        return true;
    } else {
        let outcomeValidityError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Résultat incorrect  :x:`)
            .setDescription(`:x: ${infoUser.username}, seul 'W' pour la victoire et 'L' pour la défaite est accepter.`)
            .setFooter("Erreur : outcomeValidityError");
        message.channel.send(outcomeValidityError);
        consoleLog(`ERROR : outcomeValidityError`, NaN, infoUser);
        return "invalid";
    }
}

async function checkUserId(message, infoUser) {
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

async function sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId, infoUser) {
    return await sqlBattle.sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId, infoUser);
}

async function processRequest(offense, defense, outcome, message, infoUser) {

    //Check offense monster validity and return ids
    const monsterOffenseId = await checkTeam(offense, "offense", message, infoUser);

    if (monsterOffenseId != "invalid") {

        //Check defense monster validity and return ids
        const monsterDefenseId = await checkTeam(defense, "défense", message, infoUser);
     
        if (monsterDefenseId != "invalid") {

            //Check outcome validity and return boolean
            const outComeId = await checkOutcome(outcome, message, infoUser);
    
            if (outComeId != "invalid") {

                //Check userId validity and return user_id
                const userId = await checkUserId(message, infoUser);
                
                if (userId != "invalid") {

                    //Create battle entry in DB
                    const success = await sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId, infoUser);

                    if (success) {

                        //Successful message
                        let inaccessibilityError = new Discord.MessageEmbed()
                            .setColor("#01E007")
                            .setTitle(`:white_check_mark: Super :white_check_mark:`)
                            .setDescription(`:tada: Merci ${message.author.username} pour ta contribution! :star_struck:`);
                        message.channel.send(inaccessibilityError);
                        
                        var newOffense = {
                            offense : offense,
                            defense : defense,
                            outcome : outcome,
                        };
                        consoleLog(`OK : NewOffense`, newOffense, infoUser);

                    } else {

                        //Unlikely outcome but just in case DB is inaccessible
                        let inaccessibilityError = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                            .setDescription(`:x:  ${infoUser.username}, il  semblerait que nous rencontrions des problèmes, passe nous revoir un peu plus tard ;)`)
                            .setFooter("Erreur : DB Inaccessible");
                        message.channel.send(inaccessibilityError);
                        consoleLog(`ERROR : inaccessibilityError`, NaN, infoUser);
                    }
                }
            }
        }
    }
}

function offense (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if (message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if (message.channel.type === "dm") return;

    //Prise en compte du prefix
    if (message.length == 1) {
        if (message[0].charAt(0) == config.prefix)
            message[0] = message[0].slice(1);
    }

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = userInfo("./commands/offense.js", message);
    
    var statutcommand = checkMaintenance (message, "offense", infoUser);
    if(statutcommand == false) return;

    var verifMessage = checkMessageContent(message.content.split(" "));

    let errorArgsTiretInferior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré assez de tiret !`) 
    .setFooter("Erreur : errorArgsTiretInferior");

    if (verifMessage.tiret < 2) return message.channel.send(errorArgsTiretInferior) && consoleLog(`ERROR : errorArgsTiretInferior`, NaN, infoUser);
   
    let errorArgsTiretSuperior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous avez entré trop de tiret !`) 
    .setFooter("Erreur : errorArgsTiretSuperior");

    if (verifMessage.tiret > 2) return message.channel.send(errorArgsTiretSuperior) && consoleLog(`ERROR : errorArgsTiretSuperior`, NaN, infoUser);

    let messageArray = verifMessage.message.split("-");
    let offenseMonsters = messageArray[0].split(" ").slice(1).filter(Boolean);

    let errorArgsOffenseMonsters = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré de team pour l'offense.`) 
    .setFooter("Erreur : errorArgsOffenseMonsters");

    if (offenseMonsters.length == 0) return message.channel.send(errorArgsOffenseMonsters) && consoleLog(`ERROR : errorArgsOffenseMonsters`, NaN, infoUser);

    let checkDefenseMonsters = messageArray[1]

    let errorArgsDefenseMonstersUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré de team défense.`) 
    .setFooter("Erreur : errorArgsDefenseMonstersUndefined");

    if (checkDefenseMonsters == undefined) return message.channel.send(errorArgsDefenseMonstersUndefined) && consoleLog(`ERROR : errorArgsDefenseMonstersUndefined`, NaN, infoUser);

    let defenseMonsters = messageArray[1].split(" ").filter(Boolean);

    let errorArgsDefenseEmptyBoard = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré de team défense.`) 
    .setFooter("Erreur : errorArgsDefenseEmptyBoard");

    if (defenseMonsters.length == 0) return message.channel.send(errorArgsDefenseEmptyBoard) && consoleLog(`ERROR : errorArgsDefenseEmptyBoard`, NaN, infoUser);

    let checkArgsOutcome = messageArray[2];

    let errorArgsOutcome = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré sois le W ou L.`) 
    .setFooter("Erreur : errorArgsOutcome");

    if (checkArgsOutcome == undefined) return message.channel.send(errorArgsOutcome) && consoleLog(`ERROR : errorArgsOutcome`, NaN, infoUser);

    let outcome = messageArray[2].trim().toUpperCase();

    //V�rifier la validit� des noms des monstres
    processRequest(offenseMonsters, defenseMonsters, outcome, message, infoUser);

}

//Module export
module.exports = offense;