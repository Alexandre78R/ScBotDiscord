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

async function checkTeam(team, side, message, infoUser) {
    var result = await sqlMonster.checkNameValidity(team);
    console.log("team", team)
    console.log("result object", result)
    if (!result.status) {
        //Pour l'instant je n'utilise pas le système code (Alex).
        let nameValidityError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Noms incorrects  :x:`)
            .setDescription(`:x: Un ou plusieurs monstres en ${side} n'existent pas dans la base de données.`)
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
        .setDescription(`:x: Désoler on n'a pas d'offense pour cette défense : ${defense[0]} ${defense[1]} ${defense[2]}...`)
        .setFooter("Erreur : defenseNotFound")
        consoleLog(`ERROR : defenseNotFound`, NaN, infoUser)
        return defenseNotFound;
    } else {
        //code d'origin avant modif 
        // const defenseEmbed = new Discord.MessageEmbed()
        // .setColor('#0099ff')
        // .setTitle(`Resultat pour la defense: ${defense[0]} ${defense[1]} ${defense[2]}`)
        // results.forEach(result => {
        //     defenseEmbed.addField(result[0], "Team", true)
        //     defenseEmbed.addField(result[1], "Win", true)
        //     defenseEmbed.addField(result[2], "Lose", true)
        // })
        // // let successfulMessage = new Discord.MessageEmbed()
        // //     .setColor("#01E007")
        // //     .setTitle(`Resultat pour la defense: ${defense[0]} ${defense[1]} ${defense[2]}`)
        // //     .setDescription(description)
        // consoleLog(`Ok : defenseEmbed`, results, infoUser)
        // return defenseEmbed;



         //Je garde ça pour l'insant je pense il y a des meillieurs solutions...
        // .setDescription("test format max....")
        // .addFields(
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
            // { name: 'Chandra Vigor Perna', value: '2/1 (win/lose) 100% (Winrate)', inline: true },
        // )
        // results.forEach(result => {
        //     // console.log('result', result[0])
        //     winrate =  result[1] /result[2] * 100
        //     // console.log('winrate', winrate)
        //     // console.log("results dans forEach", result)
        //     defenseEmbed.addField(result[0], "Team", true)
        //     defenseEmbed.addField(`${result[1]}/${result[2]}`, "Win/lose", true)
        //     //Rip cache misère pas toruver mieux pour l'instant.... (Alex)
        //     if(winrate == Infinity){
        //         defenseEmbed.addField(`100%`, "Winrate", true)
        //     } else if(winrate >= 100){
        //         defenseEmbed.addField(`100%`, "Winrate", true)
        //     }else {
        //         defenseEmbed.addField(`${winrate.toFixed(0)}%`, "Winrate", true)
        //     }      
        // })

        var winrate = null;
        
        var tabObject = []
        var newTabObject = []
        results.forEach(result => {
            // console.log('result', result)

            
            winrate = result[1] / (result[1] + result[2]) * 100
            if(winrate == Infinity){
                tabObject.push({team :result[0], win : result[1], lose : result[2], winrate : `100`})
                // tabObject.push({ name: `${result[0]}`, value: `${result[1]}/${result[2]} (win/lose) - 100% (Winrate)`, inline: true })
            } else if(winrate >= 100){
                tabObject.push({team :result[0], win : result[1], lose : result[2], winrate : `100`})
                // tabObject.push({ name: `${result[0]}`, value: `${result[1]}/${result[2]} (win/lose) - 100% (Winrate)`, inline: true })
            }else {
                // defenseEmbed.addField(`${winrate.toFixed(0)}%`, "Winrate", true)
                tabObject.push({team :result[0], win : result[1], lose : result[2], winrate : `${winrate.toFixed(0)}`})
                // tabObject.push({ name: `${result[0]}`, value: `${result[1]}/${result[2]} (win/lose) - ${winrate.toFixed(0)}% (Winrate)`, inline: true })
            } 
        })

        tabObject.sort(function(a, b) {
            return b.win - a.win;
        })
        tabObject.sort(function(a, b) {
            return b.winrate - a.winrate;
        })

        for (let n = 0; n < tabObject.length; n++) {

            // console.log('tabObject', tabObject[n])
            if (newTabObject.length <= 15){
                newTabObject.push({ name: `${tabObject[n].team}`, value: `${tabObject[n].win}/${tabObject[n].lose} (win/lose) - ${tabObject[n].winrate}% (Winrate)`, inline: true })
            }
        }
        const defenseEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Resultat pour la defense: ${defense[0]} ${defense[1]} ${defense[2]}`)
        .setDescription(`Voici la liste des ${newTabObject.length} meilleures offenses contre la défense : ${defense[0]} ${defense[1]} ${defense[2]}`)
        .addFields(newTabObject)

        console.log('liste Défense --->',`${defense[0]} ${defense[1]} ${defense[2]}`)
        consoleLog(`Ok : defenseEmbed`, results, infoUser)
        return defenseEmbed;
    } 
}

async function processRequest(defense, message, infoUser) {
    const monsterDefenseId = await checkTeam(defense, "defense", message, infoUser);
    if (monsterDefenseId != "invalid") {
        //Fetch data from DB
        const result = await sqlBattle.datatableDefense(monsterDefenseId);
        if (!result) {
            //Unlikely outcome but just in case DB is inaccessible
            let inaccessibilityError = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                .setDescription(`:x: Il semblerait que nous rencontrions des problèmes, passe nous revoir un peu plus tard...`)
                .setFooter("Erreur : DB Inaccessible")
            message.channel.send(inaccessibilityError)
            consoleLog(`ERROR : inaccessibilityError`, NaN, infoUser)

        } else {
              
            //Successful message
            const successfulMessage = buildSuccessfulMessage(result, defense, infoUser)
            message.channel.send(successfulMessage)

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
    var infoUser = { location : "./commands/sb.js", id : message.author.id, username : message.author.username, avatar : message.author.avatar, isBot : message.author.bot };

    var statutcommand = checkMaintenance (message, "sb", infoUser)
    if(statutcommand == false) return;

    //Lecture du corps du message
    let defenseMonsters = message.content.split(" ").slice(1).filter(Boolean);

    let nameMob1NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: Merci de rentrer les 3 nom de monstre pour voir la liste des offenses disponible.`)
    .setFooter("Erreur : nameMob1NoteFound")

    if (defenseMonsters.length == 0) return message.channel.send(nameMob1NoteFound) | consoleLog(`ERROR : nameMob1NoteFound`, NaN, infoUser)

    let nameMob2NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: Merci de rentrer 2 nom de monstre en plus, pour voir la liste des offenses disponible.`)
    .setFooter("Erreur : nameMob2NoteFound")

    if (defenseMonsters.length == 1) return message.channel.send(nameMob2NoteFound) | consoleLog(`ERROR : nameMob2NoteFound`, NaN, infoUser)

    let nameMob3NoteFound = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Impossible d'envoyer les données  :x:`)
    .setDescription(`:x: Merci de rentrer le dernier nom de monstre, pour voir la liste des offenses disponible.`)
    .setFooter("Erreur : nameMob3NoteFound")

    if (defenseMonsters.length == 2) return message.channel.send(nameMob3NoteFound) | consoleLog(`ERROR : nameMob3NoteFound`, NaN, infoUser)

    //Argument pour url juste apr�s la commande
    consoleLog("Monster in the defense", defenseMonsters);

    //V�rifier la validit� des noms des monstres
    processRequest(defenseMonsters, message, infoUser);
}

//Module export
module.exports = sb;