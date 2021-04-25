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

function buildSuccessfulMessage(results, defense) {
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Resultat pour la defense: '+defense[0]+" "+defense[1]+" "+defense[2])
    results.forEach(result => {
        exampleEmbed.addField(result[0], "Team", true)
        exampleEmbed.addField(result[1], "Win", true)
        exampleEmbed.addField(result[2], "Lose", true)
    })
    /*let successfulMessage = new Discord.MessageEmbed()
        .setColor("#01E007")
        .setTitle(`Resultats pour la defense: ` + defense[0] + " " + defense[1] + " " + defense[2])
        .setDescription(description)*/
    return exampleEmbed;
}

async function processRequest(defense, message) {
    const monsterDefenseId = await checkTeam(defense, "defense", message);
    if (monsterDefenseId != "invalid") {
        //Fetch data from DB
        const result = await sqlBattle.datatableDefense(monsterDefenseId);
        if (!result) {
            //Unlikely outcome but just in case DB is inaccessible
            let inaccessibilityError = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                .setDescription(":x: Il semblerait que nous rencontrions des problèmes, passe nous revoir un peu plus tard ;)")
                .setFooter("Erreur : DB Inaccessible")
            message.channel.send(inaccessibilityError)
            
        } else {
            //Successful message
            const successfulMessage = buildSuccessfulMessage(result, defense)
            message.channel.send(successfulMessage)
            
        }
    }
};

function sb(message) {

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
    let defenseMonsters = message.content.split(" ").slice(1).filter(Boolean);

    //Argument pour url juste après la commande

    console.log("Monster in the defense", defenseMonsters);

    //Vérifier la validité des noms des monstres
    processRequest(defenseMonsters, message);
}

//Module export
module.exports = sb;