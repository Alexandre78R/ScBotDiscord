//Import de la config
const config = require('../config/config')

//Import function consoleLog
const consoleLog = require("../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Function checkMaintenance 
const checkMaintenance = require('../function/checkMaintenance.js');

//Import function userInfo
const userInfo = require('../function/userinfo.js');

//Import function checkNummer
const checkNumber = require('../function/checkNumber.js');

//Import mmonster query
const sqlMonster = require("../query/monster.js");

//Import user query
const sqlUser = require("../query/user.js");

//Import battle query
const sqlBattle = require("../query/battle.js");

//Immport function checkMessageContent 
var checkMessageContent = require('../function/checkMessageContent.js');

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

async function listBattleLastoffense (userId, infoUser, message) {
    var result = await sqlBattle.dataTableLastoffense(userId);
    // result = []
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

async function checkValueIdTable (valueId, listBattle, infoUser, message) {
    var newTabId = [];
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
        message.channel.send(valueIdNotFound);
        return "invalid";
        
    } else {
        return true;
    }
}

async function checkTeam (team, side, message, infoUser) {
    var result = await sqlMonster.checkNameValidity(team, infoUser);
    if (!result.status) {
        if (result.code == 1){
            let nameValidityResultCode1Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, un ou plusieurs monstres en ${side} n'existent pas dans la base de donnée !`)
                .setFooter("Erreur : nameValidityResultCode1Error");
            message.channel.send(nameValidityResultCode1Error);
            consoleLog(`ERROR : nameValidityResultCode1Error`, NaN, infoUser);
            return "invalid";
        } else if (result.code == 2){
            let nameValidityResultCode2Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, un ou plusieurs monstres en ${side} n'existent pas dans la base de donnée !`)
                .setFooter("Erreur : nameValidityResultCode2Error");
            message.channel.send(nameValidityResultCode2Error);
            consoleLog(`ERROR : nameValidityResultCode2Error`, NaN, infoUser);
            return "invalid";
        } else if (result.code == 3){
            let nameValidityResultCode3Error = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Noms incorrects :x:`)
                .setDescription(`:x: ${infoUser.username}, Merci de préciser 3 noms de monstre dans votre ${side} !`)
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

async function checkOutcome (outcome, message, infoUser) {
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

async function upBattleData (monsterOffenseId, monsterDefenseId, outComeId, valueId, infoUser) {
    return await sqlBattle.upBattleData(monsterOffenseId, monsterDefenseId, outComeId, valueId, infoUser);
}

async function processRequest (offense, defense, outcome, valueId, message, infoUser) {

    const userId = await checkUserId(message, infoUser);

    if (userId != "invalid") {

        const listBattle = await listBattleLastoffense(userId, infoUser, message);

        if(listBattle != "invalid"){

            const checkValue = await checkValueIdTable(valueId, listBattle, infoUser, message);

            if(checkValue != "invalid"){
                
                const monsterOffenseId = await checkTeam(offense, "offense", message, infoUser);

                if (monsterOffenseId != "invalid") {
                    
                    const monsterDefenseId = await checkTeam(defense, "défense", message, infoUser);

                    if (monsterDefenseId != "invalid") {

                        const outComeId = await checkOutcome(outcome, message, infoUser);
                
                        if (outComeId != "invalid") {

                            const success = await upBattleData(monsterOffenseId, monsterDefenseId, outComeId, valueId, infoUser);

                            if (success) {

                                let upOffenseDefense = new Discord.MessageEmbed()
                                    .setColor("#01E007")
                                    .setTitle(`:white_check_mark: Super :white_check_mark:`)
                                    .setDescription(`:tada: ${message.author.username}, La modification pour l'offense n°${valueId} à bien était effectué dans notre base de données.`);
                                message.channel.send(upOffenseDefense);
                                
                                var upOffense = {
                                    offense : offense,
                                    defense : defense,
                                    outcome : outcome
                                }
                                consoleLog(`OK : upOffenseDefense`, upOffense, infoUser);

                            } else {

                                let inaccessibilityError = new Discord.MessageEmbed()
                                    .setColor("#F00E0E")
                                    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                                    .setDescription(`:x:  ${infoUser.username}, il semblerait que nous rencontrions des problémes, passe nous revoir un peu plus tard ;)`)
                                    .setFooter("Erreur : DB Inaccessible");
                                message.channel.send(inaccessibilityError);
                                consoleLog(`ERROR : inaccessibilityError`, NaN, infoUser);
                            }
                        }
                    }
                }
            }
        }
    }
}

function upoffense (message) {

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
    var infoUser = userInfo("./commands/upoffense.js", message);

    var statutcommand = checkMaintenance (message, "upoffense", infoUser);
    if(statutcommand == false) return;

    var verifMessage = checkMessageContent(message.content.split(" "));

    let errorArgsTiretInferior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré assez de tiret !`) 
    .setFooter("Erreur : errorArgsTiretInferior");

    if (verifMessage.tiret < 3) return message.channel.send(errorArgsTiretInferior) | consoleLog(`ERROR : errorArgsTiretInferior`, NaN, infoUser);
   
    let errorArgsTiretSuperior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous avez entré trop de tiret !`) 
    .setFooter("Erreur : errorArgsTiretSuperior");

    if (verifMessage.tiret > 3) return message.channel.send(errorArgsTiretSuperior) | consoleLog(`ERROR : errorArgsTiretSuperior`, NaN, infoUser);

    let messageArray = verifMessage.message.split("-");
    let offenseMonsters = messageArray[0].split(" ").slice(1).filter(Boolean);

    let errorArgsOffenseMonsters = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas rentrer de team pour l'offense.`) 
    .setFooter("Erreur : errorArgsOffenseMonsters");

    if (offenseMonsters.length == 0) return message.channel.send(errorArgsOffenseMonsters) | consoleLog(`ERROR : errorArgsOffenseMonsters`, NaN, infoUser);

    let checkDefenseMonsters = messageArray[1]

    let errorArgsDefenseMonstersUndefined = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré de team défense.`) 
    .setFooter("Erreur : errorArgsDefenseMonstersUndefined");

    if (checkDefenseMonsters == undefined) return message.channel.send(errorArgsDefenseMonstersUndefined) | consoleLog(`ERROR : errorArgsDefenseMonstersUndefined`, NaN, infoUser);

    let defenseMonsters = messageArray[1].split(" ").filter(Boolean);

    let errorArgsDefenseEmptyBoard = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré de team défense.`) 
    .setFooter("Erreur : errorArgsDefenseEmptyBoard");

    if (defenseMonsters.length == 0) return message.channel.send(errorArgsDefenseEmptyBoard) | consoleLog(`ERROR : errorArgsDefenseEmptyBoard`, NaN, infoUser);

    let outcome = messageArray[2].trim().toUpperCase();

    let errorArgsOutcome = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré sois le W ou L.`) 
    .setFooter("Erreur : errorArgsOutcome");

    if (outcome == "") return message.channel.send(errorArgsOutcome) | consoleLog(`ERROR : errorArgsOutcome`, NaN, infoUser);

    let idBattle = messageArray[3].trim();

    let errorIdBattle = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré sois le W ou L.`) 
    .setFooter("Erreur : errorIdBattle");

    if (idBattle == "") return message.channel.send(errorIdBattle) | consoleLog(`ERROR : errorIdBattle`, NaN, infoUser);

    var checkNumperIdBattle = checkNumber(idBattle);

    let errorIdBattleNotFormat = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous avez entré une farmat d'id incorrect.`) 
    .setFooter("Erreur : errorIdBattle");

    if (checkNumperIdBattle == "Not a Number!") return message.channel.send(errorIdBattleNotFormat) | consoleLog(`ERROR : errorIdBattleNotFormat`, NaN, infoUser);

    //V�rifier la validit� des noms des monstres
    processRequest(offenseMonsters, defenseMonsters, outcome, idBattle, message, infoUser);
    
}

//Module export
module.exports = upoffense;