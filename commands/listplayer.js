//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import du module fs
const fs = require("fs");

//Module export
module.exports = {
    'listplayer': listplayer,
} 

function listplayer (message){

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.prefix) 
            message[0] = message[0].slice(1);

    }

    var tableauResultat = null;

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    var variantSC = args[0]

    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Erreur Info listes des joueurs :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant  - errorVariant")

    if (variantSC == undefined) return message.channel.send(errorArgsVariant)

    switch (variantSC){
                        
        case config.variantSC1:
            if (fs.existsSync(`./data/SC1/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC1/tableauResultat.json")
                tableauResultat = require("../data/SC1/tableauResultat.json");
            }
        break;
        case config.variantSC2:
            if (fs.existsSync(`./data/SC2/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC2/tableauResultat.json")
                tableauResultat = require("../data/SC2/tableauResultat.json");
            }
        break;
        case config.variantSC3: 
            if (fs.existsSync(`./data/SC3/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC3/tableauResultat.json")
                tableauResultat = require("../data/SC3/tableauResultat.json");
            }
        break;
        case config.variantSC4:
            if (fs.existsSync(`./data/SC4/tableauResultat.json`)) {
                console.log("Fichier trouver : ./data/SC4/tableauResultat.json")
                tableauResultat = require("../data/SC4/tableauResultat.json");
            }
        break;
        default:
            let errorListPlayerVariant = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
            .setFooter("Erreur : errorListPlayerVariant - SWITCH")
            return message.channel.send(errorListPlayerVariant)
    }

    var data = [];
    
    if (tableauResultat == null){
        let errorStatsListPlayer = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Erreur Info listes des joueurs :x:`)
        .setDescription(`:x:Imposible de trouver le fichier des informations du siège, merci de refaire la commandes ${config.prefix}processing .`) 
        .setFooter("Erreur : errorStatsListPlayer - LISTPLAYER NOT FOUND")
        message.channel.send(errorStatsListPlayer)
    } else {
        for (const propriete in tableauResultat.Joueurs) {
            var resultat = tableauResultat.Joueurs[propriete];
            tab = []
            tab["Player"] = propriete
            for (const proprieteResultat in resultat) {
                tab[proprieteResultat] = resultat[proprieteResultat]
            }
            data.push(tab)
        }

        var listePlayer = []

        if (data.length == 0) {
            let errorStatsListJoueurData = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Erreur Info listes des joueurs :x:`)
            .setDescription(`:x: Imposible de trouver les informations.`) 
            .setFooter("Erreur : errorStatsListJoueurData - DATA NOT FOUND")
            listePlayer = []
            data = []
            message.channel.send(errorStatsListJoueurData)
        }else{
            for (let i = 0; i < data.length; i++) {
                var objetListePlayerBoucle = {
                    name : data[i].Player,
                    value : data[i].player_id,
                    inline: true
                }
                listePlayer.push(objetListePlayerBoucle)
            }
    
            let infoListPlayerEmbed = new Discord.MessageEmbed()
            .setColor("#FEAC09")
            .setTitle(`Listes des Joueurs :`)
            .setDescription(`A noter si le joueur n'a pas attaqué ou n'a pas reçus une défense. Impossible de récupérer les informations. La liste ci-dessous c'est avec les joueurs que vous pouvez regarder les statistiques avec la commande ${config.prefix}player ${variantSC} (nom du joueur ou son ID).`)
            .addFields(listePlayer)
            message.channel.send(infoListPlayerEmbed)
            listePlayer = []
            data = []
            console.log("ListePlayer", listePlayer)
            console.log('data', data)
        }
    }
}   