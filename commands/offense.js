//Import de la config
const config = require('../config/config.js')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import mmonster query
const sqlMonster = require("../query/monster.js");

//Import user query
const sqlUser = require("../query/user.js");

//Import battle query
const sqlBattle = require("../query/battle.js");

const consoleLog = require('../function/consoleLog.js')

async function checkTeam(team, side, message, infoUser) {
    var result = await sqlMonster.checkNameValidity(team, infoUser);

    if (!result) {
        let nameValidityError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Noms incorrects  :x:`)
            .setDescription(":x: Un ou plusieurs monstres en " + side + " n'existent pas dans la base de donnees")
            .setFooter("Erreur : nameValidityError")
        message.channel.send(nameValidityError)
        consoleLog(`ERROR : nameValidityError`, NaN, infoUser)
        return "invalid";
    } else {
        return result;
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
            .setTitle(`:x: Resultat incorrect  :x:`)
            .setDescription(":x: Seul 'W' pour la victoire et 'L' pour la defaite est accepte.")
            .setFooter("Erreur : outcomeValidityError")
        message.channel.send(outcomeValidityError)
        consoleLog(`ERROR : outcomeValidityError`, NaN, infoUser)
        return "invalid";
    }
}

async function checkUserId(message, infoUser) {
    var result = await sqlUser.checkUserId(message, infoUser);
    if (!result) {
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
        const monsterDefenseId = await checkTeam(defense, "defense", message, infoUser);
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
                            .setDescription(":tada: Merci " + message.author.username+" pour ta contribution! :star_struck:")
                        message.channel.send(inaccessibilityError)
                        var newOffense = {
                            offense : offense,
                            defense : defense,
                            outcome : outcome,
                        }
                        consoleLog(`OK : NewOffense`, newOffense, infoUser)

                    } else {

                        //Unlikely outcome but just in case DB is inaccessible
                        let inaccessibilityError = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Impossible d'envoyer les donn�es  :x:`)
                            .setDescription(":x: Il semblerait que nous rencontrions des probl�mes, passe nous revoir un peu plus tard ;)")
                            .setFooter("Erreur : DB Inaccessible")
                        message.channel.send(inaccessibilityError)
                        consoleLog(`ERROR : inaccessibilityError`, NaN, infoUser)
                    }
                }
            }
        }
    }
}

function offense(message) {

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
    var infoUser = { location : "./commands/offense.js", id : message.author.id, username : message.author.username, avatar : message.author.avatar, isBot : message.author.bot };
    
    var tiret = 0;

    var checkMessageContent = message.content.split(" ");

    for (let i = 0; i < checkMessageContent.length; i++) {
        if (checkMessageContent[i] === "-"){
            tiret++
        }
    }

    let errorArgsTiretInferior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: Vous n'avez pas rentrer assez de tiret !`) 
    .setFooter("Erreur : errorArgsTiretInferior");

    if (tiret < 2) return message.channel.send(errorArgsTiretInferior) | consoleLog(`ERROR : errorArgsTiretInferior`, NaN, infoUser)

    let errorArgsTiretSuperior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: Vous avez rentrer trop de tiret !`) 
    .setFooter("Erreur : errorArgsTiretSuperior");

    if (tiret > 2) return message.channel.send(errorArgsTiretSuperior) | consoleLog(`ERROR : errorArgsTiretSuperior`, NaN, infoUser)

    let messageArray = message.content.split("-");

    let offenseMonsters = messageArray[0].split(" ").slice(1).filter(Boolean);

    let errorArgsOffenseMonsters = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: Vous n'avez pas rentrer de team pour l'offense.`) 
    .setFooter("Erreur : errorArgsOffenseMonsters");

    if (offenseMonsters.length == 0) return message.channel.send(errorArgsOffenseMonsters) | consoleLog(`ERROR : errorArgsOffenseMonsters`, NaN, infoUser)

    let checkDefenseMonsters = messageArray[1]

    let errorArgsDefenseMonstersUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: Vous n'avez pas rentrer de team défense.`) 
    .setFooter("Erreur : errorArgsDefenseMonstersUndefined");

    if (checkDefenseMonsters == undefined) return message.channel.send(errorArgsDefenseMonstersUndefined) | consoleLog(`ERROR : errorArgsDefenseMonstersUndefined`, NaN, infoUser)

    let defenseMonsters = messageArray[1].split(" ").filter(Boolean);

    let errorArgsDefenseEmptyBoard = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: Vous n'avez pas rentrer de team défense.`) 
    .setFooter("Erreur : errorArgsDefenseEmptyBoard");

    if (defenseMonsters.length == 0) return message.channel.send(errorArgsDefenseEmptyBoard) | consoleLog(`ERROR : errorArgsDefenseEmptyBoard`, NaN, infoUser)

    let checkArgsOutcome = messageArray[2];

    let errorArgsOutcome = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: Vous n'avez pas rentrer sois le W ou L.`) 
    .setFooter("Erreur : errorArgsOutcome");

    if (checkArgsOutcome == undefined) return message.channel.send(errorArgsOutcome) | consoleLog(`ERROR : errorArgsOutcome`, NaN, infoUser)

    let outcome = messageArray[2].trim();

    //V�rifier la validit� des noms des monstres
    processRequest(offenseMonsters, defenseMonsters, outcome, message, infoUser);
}

//Module export
module.exports = offense;