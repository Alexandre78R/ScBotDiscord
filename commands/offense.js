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

//Import du module fs
var fs = require("fs")

//Import du module http
var http = require('http')

//Import du module https
var https = require('https');
const { url } = require('inspector');

async function checkTeam(team, side, message) {
    var result = await sqlMonster.checkNameValidity(team);
    if (!result) {
        let nameValidityError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Noms incorrects  :x:`)
            .setDescription(":x: Un ou plusieurs monstres en " + side + " n'existent pas dans la base de donnees")
            .setFooter("Erreur : nameValidityError")
        message.channel.send(nameValidityError)
        return "invalid";
    } else {
        return result;
    }
}

async function checkOutcome(outcome, message) {
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
        return "invalid";
    }
}

async function checkUserId(message) {
    var result = await sqlUser.checkUserId(message);
    if (!result) {
        return "invalid";
    } else {
        return result;
    }
}

async function sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId) {
    return await sqlBattle.sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId);
}

async function processRequest(offense, defense, outcome, message) {

    //Check offense monster validity and return ids
    const monsterOffenseId = await checkTeam(offense, "offense", message);
    if (monsterOffenseId != "invalid") {

        //Check defense monster validity and return ids
        const monsterDefenseId = await checkTeam(defense, "defense", message);
        if (monsterDefenseId != "invalid") {

            //Check outcome validity and return boolean
            const outComeId = await checkOutcome(outcome, message);
            if (outComeId != "invalid") {

                //Check userId validity and return user_id
                const userId = await checkUserId(message);
                if (userId != "invalid") {

                    //Create battle entry in DB
                    const success = await sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId);
                    if (success) {

                        //Successful message
                        let inaccessibilityError = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:white_check_mark: Super \\o/  :white_check_mark:`)
                            .setDescription(":tada: Merci " + message.author.username+" pour ta contribution! :star_struck:")
                        message.channel.send(inaccessibilityError)

                    } else {

                        //Unlikely outcome but just in case DB is inaccessible
                        let inaccessibilityError = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                            .setDescription(":x: Il semblerait que nous rencontrions des problèmes, passe nous revoir un peu plus tard ;)")
                            .setFooter("Erreur : DB Inaccessible")
                        message.channel.send(inaccessibilityError)
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

    //Lecture du corps du message
    let messageArray = message.content.split("-");
    let offenseMonsters = messageArray[0].split(" ").slice(1).filter(Boolean);
    let defenseMonsters = messageArray[1].split(" ").filter(Boolean);
    let outcome = messageArray[2].trim();

    //Argument pour url juste après la commande

    console.log("Monster in the offense", offenseMonsters);
    console.log("Monster in the defense", defenseMonsters);
    console.log("Outcome", "|"+outcome+"|");

    //Vérifier la validité des noms des monstres
    processRequest(offenseMonsters, defenseMonsters, outcome, message);
}

//Module export
module.exports = offense;