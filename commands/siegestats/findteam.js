//Import de la config
const config = require('../../config/config.js')

//Import de la LIBS discord.js
const Discord = require('discord.js');

const consoleLog = require('../../function/consoleLog.js');

//Import mmonster query
const sqlMonster = require('../../query/monster.js');

//Import user query
const sqlUser = require('../../query/user.js');

//Import battle query
const sqlBattle = require('../../query/battle.js');

//Import function checkMaintenance 
var checkMaintenance = require('../../function/checkMaintenance.js');

//Import function userInfo
var userInfo = require('../../function/userinfo.js');

//Immport function checkMessageContent 
var checkMessageContent = require('../../function/checkMessageContent.js');

// Import the discord.js-pagination package
const paginationEmbed = require('../../module/discord.js-pagination.js');

//Import function KeyJson 
const keyJson = require('../../function/keyJson.js');

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
    var result = await sqlMonster.checkNameValiditySearch(team);
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
        return result;
    }
}

function buildSuccessfulMessage(result, newParam, teamMob, message, infoUser) {

    var tabObject = [];

    for (let i = 0; i < result.length; i++) {
       
        var newResult = result[i].listBattle;
        var newData = keyJson(newResult, "listbattle");
        
        for (let n = 0; n < newData.length; n++) {

            var listuser = newData[n].listUser;
            var newData2 = keyJson(listuser, "idUser");
            
            var newListUserFinnish = [];
            for (let j = 0; j < newData2.length; j++) {
                
                newListUserFinnish.push({
                    idUser: newData2[j].idUser,
                    info_user: newData2[j].info_user,
                    win: newData2[j].win,
                    lose: newData2[j].lose,
                    winrate: newData2[j].winrate
                });
            }
            tabObject.push({
                listbattle : newData[n].listbattle,
                name_offense: newData[n].name_offense,
                name_defense: newData[n].name_defense,
                listUser : newListUserFinnish
            });
        }
    }

    var pages = [];
    var tabListTabResult = [];
    var lengthPage = 5;

    for (let n = 0; n < tabObject.length; n++) {

        var listUserTabObject = tabObject[n].listUser;

        listUserTabObject.sort(function(a, b) {
            if ((b.win+b.lose) == (a.win+a.lose)) {
                return (b.win+b.lose) - (a.win+a.lose) && b.winrate - a.winrate;
            } else {
                return (b.win+b.lose) - (a.win+a.lose);
            }
        });

        var rankingListUser = "";
        var countLimite3 = 0;

        for (let j = 0; j < listUserTabObject.length; j++) {
            if (countLimite3 <= 2) {
                rankingListUser += `${listUserTabObject[j].info_user[2]} ${listUserTabObject[j].win} Victoire/${listUserTabObject[j].lose} Perdu - Winrate : ${listUserTabObject[j].winrate}`  + '\n';
                countLimite3++;
            }
        }

        if (tabListTabResult.length == 0) {
            tabListTabResult.push([]);
            tabListTabResult[tabListTabResult.length-1].push({
                name : `Offense : ${tabObject[n].name_offense}`,
                value : rankingListUser
            });
        } else {
            if (tabListTabResult[tabListTabResult.length-1].length < lengthPage){
                tabListTabResult[tabListTabResult.length-1].push({
                    name : `Offense : ${tabObject[n].name_offense}`,
                    value : rankingListUser
                });
            } else {
                tabListTabResult.push([]);
                tabListTabResult[tabListTabResult.length-1].push({
                    name : `Offense : ${tabObject[n].name_offense}`,
                    value : rankingListUser
                });
            }
        }
    }

    for (let i = 0; i < tabListTabResult.length; i++) {
        console.log("tabListTabResult[i].length", tabListTabResult[i].length);
        var exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Resultat pour ${newParam === "off"? "l'offense" : "la défense"}:`)
        .setDescription(`${infoUser.username}, liste de team sur ${newParam === "off" ? "l'offense" : "la défense"} avec : ${teamMob}`)
        .addFields(tabListTabResult[i])
        pages.push(exampleEmbed);
    }

    var resultPage = paginationEmbed(message, pages);
    return resultPage;

}

async function processRequest (newParam, listMobs, message, infoUser) {

    //Check userId validity and return user_id
    const userId = await checkUserId(message, infoUser);
    // console.log('userId', userId)
    if (userId != "invalid") {

        const monsterList = await checkTeam(listMobs, "défense", message, infoUser);
        
        if (monsterList != "invalid") {

            var listId = await monsterList.status;

            var nameMonster = monsterList.nameMonster;
            var newNameMonster = "";
            for (var n = 0; n < nameMonster.length; n++) {
                if (nameMonster.length == n) {
                    newNameMonster += nameMonster[n];
                } else {
                    newNameMonster += nameMonster[n] + " ";
                }
            }

            let undefiniedTeamListMob = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Resultat incorrect  :x:`)
            .setDescription(`:x: ${infoUser.username}, on n'a pas ${newParam === "off" ? "d'offense" : "de défense"} avec ${newNameMonster} !`) 
            .setFooter("Erreur : undefiniedTeamListMob");

            if (listId.length == 0) return message.channel.send(undefiniedTeamListMob) && consoleLog(`ERROR : undefiniedTeamListMob`, NaN, infoUser);

            console.log("Count listId", listId.length);

            if (newParam === "off") {
                const result = await sqlBattle.datatableFindOffense(listId);
                if (result.length == 0) {
                    let inaccessibilityError = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                        .setDescription(`:x: ${infoUser.username}, il semblerait qu'on n'a aucune team en offense avec les monstres : ${newNameMonster} !`)
                        .setFooter("Erreur : DB Inaccessible");
                    message.channel.send(inaccessibilityError);
                    consoleLog(`ERROR : inaccessibilityError`, NaN, infoUser);
                } else {
                    var succesMessage = buildSuccessfulMessage(result, newParam, newNameMonster, message, infoUser);
                    return succesMessage;
                }
            } else {
                const result = await sqlBattle.datatableFindDefense(listId);
                if (result.length == 0) {
                    let inaccessibilityError = new Discord.MessageEmbed()
                        .setColor("#F00E0E")
                        .setTitle(`:x: Impossible d'envoyer les données  :x:`)
                        .setDescription(`:x: ${infoUser.username}, il semblerait qu'on n'a aucune team en défense avec les monstres : ${newNameMonster} !`)
                        .setFooter("Erreur : DB Inaccessible");
                    message.channel.send(inaccessibilityError);
                    consoleLog(`ERROR : inaccessibilityError`, NaN, infoUser);
                } else {
                    var succesMessage = buildSuccessfulMessage(result, newParam, newNameMonster, message, infoUser);
                    return succesMessage;
                }
            }
        }
    }
};

function findteam (message) {

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
    var infoUser = userInfo("./commands/findteam.js", message);

    var statutcommand = checkMaintenance(message, "findteam", infoUser);
    // console.log('status commande', statutcommand);
    if(statutcommand == false) return;

    // message.channel.send("Commande activé")
    var verifMessage = checkMessageContent(message.content.split(" "));

    console.log("Verif message", verifMessage);

    let errorArgsTiretInferior = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas entré assez de tiret !`) 
    .setFooter("Erreur : errorArgsTiretInferior");

    if (verifMessage.tiret < 1) return message.channel.send(errorArgsTiretInferior) && consoleLog(`ERROR : errorArgsTiretInferior`, NaN, infoUser);

    let messageArray = verifMessage.message.split("-");
    let param = messageArray[0].split(" ").slice(1).filter(Boolean);

    let errorArgsParam = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Resultat incorrect  :x:`)
    .setDescription(`:x: ${infoUser.username}, vous n'avez pas choisis le type de team que vous recherchez pour l'offense ou la défense. Merci d'entré off pour une team offense ou sois def pour une team défense !`) 
    .setFooter("Erreur : errorArgsParam");

    if (param.length == 0) return message.channel.send(errorArgsParam) && consoleLog(`ERROR : errorArgsParam`, NaN, infoUser);

    var newParam = param[0].toLocaleLowerCase();

    if (newParam === "off" || newParam === "def") {
        consoleLog(`OK : Param --> ${newParam}`, NaN, infoUser);
    }else{
        let errorArgsParamFailed = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Resultat incorrect  :x:`)
        .setDescription(`:x: ${infoUser.username},  Merci d'entré off pour une team offense ou sois def pour une team défense !`) 
        .setFooter("Erreur : errorArgsParamFailed");
        return message.channel.send(errorArgsParamFailed) && consoleLog(`ERROR : errorArgsParamFailed`, NaN, infoUser);
    }

    var listMobs = messageArray[1].split(" ").slice(1).filter(value => { return value !== ''});

    console.log('ListMobs', listMobs);

    processRequest(newParam, listMobs, message, infoUser);
}

//Module export
module.exports = findteam;