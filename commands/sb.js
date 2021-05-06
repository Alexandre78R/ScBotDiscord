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

//Function checkMaintenance 
var checkMaintenance = require("../function/checkMaintenance.js")

var userInfo = require("../function/userinfo.js");

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

async function checkTeam(team, side, message, infoUser) {
    var result = await sqlMonster.checkNameValidity(team);
    if (!result.status) {
        let nameValidityError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Noms incorrects  :x:`)
            .setDescription(`:x: ${infoUser.username}, un ou plusieurs monstres en ${side} n'existent pas dans la base de données.`)
            .setFooter("Erreur : nameValidityError")
        message.channel.send(nameValidityError)
        consoleLog(`ERROR : nameValidityError`, NaN, infoUser)
        return "invalid";
    } else {
        return result.status;
    }
}

function buildSuccessfulMessage(results, defense, infoUser) {
    if (results.length == 0){
        const defenseNotFound = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Defense introuvable  :x:`)
        .setDescription(`:x: ${infoUser.username}, désoler on n'a pas d'offense pour cette défense : ${defense[0]} ${defense[1]} ${defense[2]}...`)
        .setFooter("Erreur : defenseNotFound")
        consoleLog(`ERROR : defenseNotFound`, NaN, infoUser)
        return defenseNotFound;
    } else {

        var winrate = null;
        
        var tabObject = []
        var newTabObject = []
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
        })
        tabObject.sort(function(a, b) {
            return b.winrate - a.winrate;
        })

        for (let n = 0; n < tabObject.length; n++) {
            if (newTabObject.length <= 15){
                newTabObject.push({ name: `${tabObject[n].team}`, value: `${tabObject[n].win}/${tabObject[n].lose} (win/lose) - ${tabObject[n].winrate}% (Winrate)`, inline: true })
            }
        }

        var nameDefense = "";

        for (let i = 0; i < defense.length; i++) {
            nameDefense += `${defense[i]}` + " ";
        }

        const defenseEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Resultat pour la defense: ${nameDefense}`)
        .setDescription(`${infoUser.username}, voici la liste des ${newTabObject.length} meilleures offenses contre la défense : ${nameDefense}`)
        .addFields(newTabObject);
        consoleLog(`Ok : defenseEmbed`, results, infoUser)
        return defenseEmbed;
    } 
}

async function processRequest(defense, message, infoUser) {
    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);
    // console.log('userId', userId)
    if (userId != "invalid") {

        const monsterDefenseId = await checkTeam(defense, "defense", message, infoUser);

        if (monsterDefenseId != "invalid") {

            //Fetch data from DB
            const result = await sqlBattle.datatableDefense(monsterDefenseId);
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
                const successfulMessage = buildSuccessfulMessage(result, defense, infoUser);
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

    var statutcommand = checkMaintenance (message, "sb", infoUser)
    if(statutcommand == false) return;

    //Lecture du corps du message
    let defenseMonsters = message.content.split(" ").slice(1).filter(Boolean);

    let nameMob1NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de rentrer les 3 nom de monstre pour voir la liste des offenses disponible.`)
    .setFooter("Erreur : nameMob1NoteFound");

    if (defenseMonsters.length == 0) return message.channel.send(nameMob1NoteFound) | consoleLog(`ERROR : nameMob1NoteFound`, NaN, infoUser);

    let nameMob2NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: ${infoUser.username}, merci de rentrer 2 nom de monstre en plus, pour voir la liste des offenses disponible.`)
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