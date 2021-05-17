//Import de la config
const config = require('../config/config.js')

//Import de la LIBS discord.js
const Discord = require("discord.js");

const consoleLog = require("../function/consoleLog.js")

//Import mmonster query
const sqlMonster = require("../query/monster.js");

//Import user query
const sqlUser = require("../query/user.js");

//Import battle query
const sqlBattle = require("../query/battle.js");

//Import function checkMaintenance 
var checkMaintenance = require("../function/checkMaintenance.js")

//Import function userInfo
var userInfo = require("../function/userinfo.js");

//Immport function checkMessageContent 
var checkMessageContent = require('../function/checkMessageContent.js');

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

async function checkTeam (team, side, message, infoUser) {
    var result = await sqlMonster.checkNameValidity(team);
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
        return result;
    }
}

function buildSuccessfulMessage(results, defense, infoUser) {

    console.log('BUILD MESSAGE defense ---->', defense);
    if (results.length == 0){
        const defenseNotFound = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: ${infoUser.username}, désolé on n'a pas d'offense pour cette défense : ${defense[0]} ${defense[1]} ${defense[2]}...`)
        .setFooter("Erreur : defenseNotFound");
        consoleLog(`ERROR : defenseNotFound`, NaN, infoUser);
        return defenseNotFound;
    } else {

        var winrate = null;
        
        var tabObject = [];
        var newTabObject = [];
        results.forEach(result => {
            winrate = Math.round( result[1] * 100 / (result[1] + result[2]) * 10 ) / 10;
            if(winrate == Infinity){
                tabObject.push({team :result[0], win : result[1], lose : result[2], winrate : `100`});
            } else if(winrate >= 100){
                tabObject.push({team :result[0], win : result[1], lose : result[2], winrate : `100`});
            }else {
                tabObject.push({team :result[0], win : result[1], lose : result[2], winrate : `${winrate.toFixed(0)}`});
            } 
        })

        tabObject.sort(function(a, b) {
            return b.win - a.win;
        });
        
        tabObject.sort(function(a, b) {
            return b.winrate - a.winrate;
        });

        for (let n = 0; n < tabObject.length; n++) {
            if (newTabObject.length <= 15){
                newTabObject.push({ name: `${tabObject[n].team}`, value: `${tabObject[n].win}/${tabObject[n].lose} (win/lose) - ${tabObject[n].winrate}% (Winrate)`, inline: true });
            }
        }

        const defenseEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Resultat pour la défense:\n${defense[0]} - ${defense[1]} - ${defense[2]}`)
        .setDescription(`${infoUser.username}, voici la liste des ${newTabObject.length} meilleures offenses contre la défense :\n${defense[0]} ${defense[1]} ${defense[2]}`)
        .addFields(newTabObject);
        consoleLog(`Ok : defenseEmbed`, results, infoUser);
        return defenseEmbed;
    } 
}

async function processRequest(defense, message, infoUser) {
    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);
    // console.log('userId', userId)
    if (userId != "invalid") {

        const monsterDefenseId = await checkTeam(defense, "défense", message, infoUser);

        if (monsterDefenseId != "invalid") {

            var idMobDefense = await monsterDefenseId.status;

            //Fetch data from DB
            const result = await sqlBattle.datatableDefense(idMobDefense);
            if (!result) {
                //Unlikely outcome but just in case DB is inaccessible
                let inaccessibilityError = new Discord.MessageEmbed()
                    .setColor("#F00E0E")
                    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                    .setDescription(`:x: ${infoUser.username}, il semblerait que nous rencontrions des problèmes, passe nous revoir un peu plus tard...`)
                    .setFooter("Erreur : DB Inaccessible");
                message.channel.send(inaccessibilityError);
                consoleLog(`ERROR : inaccessibilityError`, NaN, infoUser);

            } else {
                
                //Successful message
                const successfulMessage = buildSuccessfulMessage(result, monsterDefenseId.nameMonster, infoUser);
                message.channel.send(successfulMessage);

            }
        }
    }
};

function sb (message) {

    //S�curit� pour pas que le bot r�agi avec lui-m�me
    if (message.author.bot) return;

    //Permet d'�viter de r�pondre aux messages priv�s
    if (message.channel.type === "dm") return;

    //Prise en compte du prefix
    if (message.length == 1) {
        if (message[0].charAt(0) == config.prefix)
            message[0] = message[0].slice(1);
    }

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = userInfo("./commands/sb.js", message);

    var statutcommand = checkMaintenance (message, "sb", infoUser);
    if(statutcommand == false) return;

    var verifMessage = checkMessageContent(message.content.split(" "));

    //Lecture du corps du message
    let defenseMonsters = verifMessage.message.split(" ").slice(1).filter(Boolean);

    let nameMob1NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de rentrer les 3 noms de monstre pour voir la liste des offenses disponible.`)
    .setFooter("Erreur : nameMob1NoteFound");

    if (defenseMonsters.length == 0) return message.channel.send(nameMob1NoteFound) | consoleLog(`ERROR : nameMob1NoteFound`, NaN, infoUser);

    let nameMob2NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de rentrer 2 noms de monstre en plus, pour voir la liste des offenses disponible.`)
    .setFooter("Erreur : nameMob2NoteFound");

    if (defenseMonsters.length == 1) return message.channel.send(nameMob2NoteFound) | consoleLog(`ERROR : nameMob2NoteFound`, NaN, infoUser);

    let nameMob3NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de rentrer le dernier nom de monstre, pour voir la liste des offenses disponible.`)
    .setFooter("Erreur : nameMob3NoteFound");

    if (defenseMonsters.length == 2) return message.channel.send(nameMob3NoteFound) | consoleLog(`ERROR : nameMob3NoteFound`, NaN, infoUser);

    //Argument pour url juste apr�s la commande
    consoleLog("Monster in the defense", defenseMonsters);

    //V�rifier la validit� des noms des monstres
    processRequest(defenseMonsters, message, infoUser);
}

//Module export
module.exports = sb;