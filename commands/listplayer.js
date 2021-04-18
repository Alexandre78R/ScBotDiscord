//Import de la config
const config = require('../config/config')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import du module fs
const fs = require("fs");

//Import function KeyJson
var keyJson = require("../function/keyJson")

//Import des consoleLog pour un système de historique
const consoleLog = require("../function/consoleLog.js")

function listplayer (message){

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    //On définit une variable null
    var tableauResultat = null;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = { location : "./commands/listplayer.js", id : message.author.id, username : message.author.username, avatar : message.author.avatar, isBot : message.author.bot };

    //Premier argument
    var variantSC = args[0]

    //Message d'erreur si on ne trouve pas le premier argument 
    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur Info listes des joueurs :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant")

    //Condition si il n'ya pas d'argument
    if (variantSC == undefined) return message.channel.send(errorArgsVariant) | consoleLog(`ERROR : errorArgsVariant - ${variantSC}`, NaN, infoUser)

    //Switch variant 
    switch (variantSC){
        
        //Switch SC1
        case config.discord.variantSC1:
            //On vérifi que le fichier existe 
            if (fs.existsSync(`./data/SC1/tableauResultat.json`)) {
                //On remplace null par les datas
                tableauResultat = require("../data/SC1/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC1/tableauResultat.json - ${variantSC}`)
            }
        break;

        //Switch SC2
        case config.discord.variantSC2:
            //On vérifi que le fichier existe 
            if (fs.existsSync(`./data/SC2/tableauResultat.json`)) {
                //On remplace null par les datas
                tableauResultat = require("../data/SC2/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC2/tableauResultat.json  - ${variantSC}`)
            }
        break;

        //Switch SC3
        case config.discord.variantSC3: 
            //On vérifi que le fichier existe 
            if (fs.existsSync(`./data/SC3/tableauResultat.json`)) {
                //On remplace null par les datas
                tableauResultat = require("../data/SC3/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC3/tableauResultat.json  - ${variantSC}`)
            }
        break;

        //Switch SC4
        case config.discord.variantSC4:
            //On vérifi que le fichier existe 
            if (fs.existsSync(`./data/SC4/tableauResultat.json`)) {
                //On remplace null par les datas
                tableauResultat = require("../data/SC4/tableauResultat.json");
                consoleLog(`Ok : Fichier trouver : ./data/SC4/tableauResultat.json  - ${variantSC}`)
            }
        break;

        default:
            //Message d'erreur si l'argument ne correspond pas
            let errorListPlayerVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
            .setFooter("Erreur : errorListPlayerVariant")
            return message.channel.send(errorListPlayerVariant) | consoleLog(`ERROR : errorListPlayerVariant - ${variantSC}`, NaN, infoUser)
    }

    //On créer un tableau vide
    var data = [];
    
    //Condition si le tableau data est remplie
    if (tableauResultat == null){

        //Message d'erreur si le tableau est vide
        let errorStatsListPlayer = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Info listes des joueurs :x:`)
        .setDescription(`:x:Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.discord.prefix}processing .`) 
        .setFooter("Erreur : errorStatsListPlayer")
        message.channel.send(errorStatsListPlayer)
        consoleLog(`ERROR : errorStatsListPlayer - ${variantSC}`, NaN, infoUser)

    } else {

        //On utilise la function KeyJson
        var newData = keyJson(tableauResultat.Joueurs, "Player")
        
        //On remplace tableau vide par les données de la function keyJson
        data = newData

        //On créer un tableau vide
        var listePlayer = []

        //Condition si le tableau est vide
        if (data.length == 0) {

            //Messsage d'erreur si on n'arrive pas a trouver les informations
            let errorStatsListJoueurData = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Erreur Info listes des joueurs :x:`)
            .setDescription(`:x: Imposible de trouver les informations.`) 
            .setFooter("Erreur : errorStatsListJoueurData")
            message.channel.send(errorStatsListJoueurData)
            consoleLog(`ERROR : errorStatsListJoueurData - ${variantSC}`, NaN, infoUser)

            //On vide les deux tableaux
            listePlayer = []
            data = []

        }else{

            //On boucle sur le tableau data
            for (let i = 0; i < data.length; i++) {
                //On créer chaque fois un objet puis on l'envois dans le tablau pour chaque joueur 
                var objetListePlayerBoucle = {
                    name : data[i].Player,
                    value : data[i].player_id,
                    inline: true
                }
                listePlayer.push(objetListePlayerBoucle)
            }

            //Message avec la liste des joueurs dans les data avec leur nom + l'id
            let infoListPlayerEmbed = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Listes des Joueurs :`)
            .setDescription(`A noter si le joueur n'a pas attaqué ou n'a pas reçus une défense. Impossible de récupérer les informations. La liste ci-dessous c'est avec les joueurs que vous pouvez regarder les statistiques avec la commande ${config.discord.prefix}player ${variantSC} (nom du joueur ou son ID).`)
            .addFields(listePlayer)
            message.channel.send(infoListPlayerEmbed)
            consoleLog(`OK : infoListPlayerEmbed - ${variantSC}`, listePlayer, infoUser)

            //On vide les deux tableaux
            listePlayer = []
            data = []
        }
    }
}   

//Module export
module.exports = listplayer;