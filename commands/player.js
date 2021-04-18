//Import de la config
const config = require('../config/config')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import du module fs
const fs = require("fs")

//Import des consoleLog pour un système de historique
const consoleLog = require("../function/consoleLog.js")

//Import function KeyJson
const keyJson = require('../function/keyJson')

function player (message){

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    //On définit une varaible NULL
    var tableauResultat = null;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = { location : "./commands/test.js", id : message.author.id, username : message.author.username, avatar : message.author.avatar, isBot : message.author.bot };

    //Premier argument
    var variantSC = args[0]

    //Message d'erreur si il n'y a pas d'argument 
    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur Info joueur :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant")

    //Condition si il n'ya pas d'argument
    if (variantSC == undefined) return message.channel.send(errorArgsVariant) | consoleLog(`ERROR : errorArgsVariant`, NaN, infoUser);

    //Switch Variant
    switch (variantSC){
        
        //Switch SC1
        case config.discord.variantSC1:
            //On Vérifie si le fichier existe
            if (fs.existsSync(`./data/SC1/tableauResultat.json`)) {
                tableauResultat = require("../data/SC1/tableauResultat.json");
                consoleLog(`OK : Fichier trouver : ./data/SC1/tableauResultat.json`);
            }
        break;
        
        //Switch SC2
        case config.discord.variantSC2:
            //On Vérifie si le fichier existe
            if (fs.existsSync(`./data/SC2/tableauResultat.json`)) {
                tableauResultat = require("../data/SC2/tableauResultat.json");
                consoleLog(`OK : Fichier trouver : ./data/SC2/tableauResultat.json`);
            }
        break;

        //Switch SC3
        case config.discord.variantSC3: 
            //On Vérifie si le fichier existe
            if (fs.existsSync(`./data/SC3/tableauResultat.json`)) {
                tableauResultat = require("../data/SC3/tableauResultat.json");
                consoleLog(`OK : Fichier trouver : ./data/SC3/tableauResultat.json`);
            }
        break;
        
        //Switch SC4
        case config.discord.variantSC4:
            //On Vérifie si le fichier existe
            if (fs.existsSync(`./data/SC4/tableauResultat.json`)) {
                tableauResultat = require("../data/SC4/tableauResultat.json");
                consoleLog(`OK : Fichier trouver : ./data/SC4/tableauResultat.json`);
            }
        break;
        
        //Si la variant n'est pas trouvable ou courrespondante
        default:

            //Message d'erreur si l'argument n'est pas correct pour le switch
            let errorPlayerVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
            .setFooter("Erreur : errorPlayerVariant")
            return message.channel.send(errorPlayerVariant) | consoleLog(`ERROR : errorPlayerVariant`, NaN, infoUser);
    }

    //Deuxième argument
    var infoSearch = args[1];

    //Message d'erreur si il n'y a pas de deuxième argument
    let errorPlayerInfoSearch = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Récupération du fichier  :x:`)
    .setDescription(`:x: Merci d'indiquer un nom de joueur ou un ID.`) 
    .setFooter("Erreur : errorPlayerInfoSearch")

    //Condition si il n'y a pas de deuxième argument
    if (infoSearch == undefined) return message.channel.send(errorPlayerInfoSearch) | consoleLog(`ERROR : errorPlayerInfoSearch - ${variantSC}`, NaN, infoUser);

    //Création tableau vide
    var data = [];
    
    //Conditon pour voir si la variable n'a aucune information
    if (tableauResultat == null){

        //Message d'erreur si on ne trouve pas les informations
        let errorStatsPlayer= new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Info joueur :x:`)
        .setDescription(`:x: Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.discord.prefix}processing .`) 
        .setFooter("Erreur : errorStatsPlayer")
        message.channel.send(errorStatsPlayer)
        consoleLog(`ERROR : errorStatsPlayer - ${variantSC}`, NaN, infoUser);

    } else {

        //On utilise la function KeyJson
        var newData = keyJson(tableauResultat.Joueurs, "Player")
        
        //On remplace tableau vide par les données de la function keyJson
        data = newData

        //On créer un tableau vide
        var tabPlayer = []

        //Condition si le tableau est vide
        if (data.length == 0) {

            //Messsage d'erreur si on n'arrive pas a trouver les informations
            let errorStatsListJoueurData = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Erreur Info listes des joueurs :x:`)
            .setDescription(`:x: Imposible de trouver les informations.`) 
            .setFooter("Erreur : errorStatsListJoueurData")
            message.channel.send(errorStatsListJoueurData)
            consoleLog(`ERROR : errorStatsJoueurData - ${variantSC}`, NaN, infoUser)

            //On vide les deux tableaux
            listePlayer = []
            data = []
        }else{
            //On boucle sur la data
            for (var i = 0; i < data.length; i++) {

                //On cherche un nom de joueur précis avec l'argument infoSearch
                if (data[i].Player == infoSearch) {

                    //On stock ses informations dans un objet puis on le pousse dans autre tableau
                    var dataPlayer = {
                        Player_id : data[i].player_id,
                        Player: data[i].Player,
                        attack_win: data[i].attack_win,
                        attack_lose: data[i].attack_lose,
                        defense_win: data[i].defense_win,
                        defense_lose: data[i].defense_lose,
                        contribution: data[i].contribution
                    }
                    tabPlayer.push(dataPlayer)
                    consoleLog(`Ok : infoSearch NAMEPLAYER - ${variantSC}`, dataPlayer, infoUser);

                //On cherche un id précis avec l'argument infoSearch
                } else if (data[i].player_id == infoSearch) {

                    //On stock ses informations dans un objet puis on le pousse dans autre tableau
                    var dataPlayer = {
                        Player_id : data[i].player_id,
                        Player: data[i].Player,
                        attack_win: data[i].attack_win,
                        attack_lose: data[i].attack_lose,
                        defense_win: data[i].defense_win,
                        defense_lose: data[i].defense_lose,
                        contribution: data[i].contribution
                    }
                    tabPlayer.push(dataPlayer)
                    consoleLog(`Ok : infoSearch IDPLAYER - ${variantSC}`, dataPlayer, infoUser);

                }
            }

            //Condition si le tableau ou il y a les informations du joueur précis est vide
            if (tabPlayer.length == 0) {
                
                //Message d'erreur si on ne trouve pas le joueur 
                let errorInfoPlayerUndefined = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Info joueur :x:`)
                .setDescription(`:x: Imposible de trouver l'info du joueur avec ce id ou le nom du joueur. Merci de vérifier sur la commandes !listplayer .`) 
                .setFooter("Erreur : errorInfoPlayerUndefined")
                message.channel.send(errorInfoPlayerUndefined)
                consoleLog(`ERROR : errorInfoPlayerUndefined - ${variantSC}`, NaN, infoUser);

                //On vide les deux tableaux
                tabPlayer = []
                data = []
            
            //Condtion en cas si il trouve 2 ou plus objet dans le tableau data du joueur précis 
            } else if (tabPlayer.length >=2) {

                //Message d'erreur en cas de scécurité d'objet
                let errorInfoPlayerMulti = new Discord.MessageEmbed()
                .setColor("#F00E0E")
                .setTitle(`:x: Erreur Info joueur :x:`)
                .setDescription(`:x: Erreur interne merci de refaire la commande avec les mêmes informtations.`) 
                .setFooter("Erreur : errorInfoPlayerMulti")
                message.channel.send(errorInfoPlayerMulti)
                consoleLog(`ERROR : errorInfoPlayerMulti - ${variantSC}`, NaN, infoUser);

                //On vide les deux tableaux
                tabPlayer = []
                data = []

            } else {

                //Message si les information sont trouver 
                let infoPlyerEmbed = new Discord.MessageEmbed()
                .setColor("#FEAC09")
                .setTitle(`${tabPlayer[0].Player} #${tabPlayer[0].Player_id}`)
                .setDescription("Information du Joueur :")
                .addFields(
                    { name: 'Attaque réussie', value: tabPlayer[0].attack_win, inline: true },
                    { name: 'Attaque perdu', value: tabPlayer[0].attack_lose, inline: true },
                    { name: 'Défense réussie', value: tabPlayer[0].defense_win, inline: true },
                    { name: "Défense perdu", value: tabPlayer[0].defense_lose, inline: true },
                    { name: "Contribution", value: tabPlayer[0].contribution, inline: true },
                )
                message.channel.send(infoPlyerEmbed)
                consoleLog(`OK : DATA - ${variantSC}`, tabPlayer[0], infoUser)

                //On vide les deux tableaux
                tabPlayer = []
                data = []
            }
        }
    }
}   

//Module export
module.exports = player;