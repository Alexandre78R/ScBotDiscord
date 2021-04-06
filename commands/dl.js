//Import de la config
const config = require('../config/config.json')

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import du module fs
var fs = require("fs")

//Import du module http
var http = require('http')

//Import du module https
var https = require('https');

var listFunction = require('../function/function.js')

//Module export
module.exports = {
    'dl': dl,
} 

function dl (message){

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.prefix) 
            message[0] = message[0].slice(1);

    }

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    var variantSC = args[0]

    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Récupération du fichier  :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariant  - errorVariant")

    if (variantSC == undefined) return message.channel.send(errorArgsVariant)

    //Argument pour url juste après la commande
    var urlJson = args[1]

    console.log("Url Json", urlJson)

    if (urlJson == undefined){

        let urlJsonError = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Récupération du fichier  :x:`)
        .setDescription(":x: Merci d'indiquer un lien pour récupérer le fichier.")
        .setFooter("Erreur : urlJsonError - undefined")
        message.channel.send(urlJsonError)   

    }else {

        if (urlJson.indexOf(('https://')) !== -1){

            https.get(urlJson, function(response) { 

                if (response.statusCode === 200) {
                    
                    switch (variantSC){
                        
                        case config.variantSC1:
                            let httpsResultSC1 = '';
                            fs.unlink('./data/SC1/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC1/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC1/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpsResultSC1 += data;
                            });
                            // console.log("httpsResultSC1", httpsResultSC1)
                            response.on('end', () => {

                                let dataVerif = listFunction.validateJSON(httpsResultSC1)

                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                                fs.writeFile(`./data/SC1/siege.json`, httpsResultSC1, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantSC1Embed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC1}`)
                                        message.channel.send(httpsVariantSC1Embed)
                                        
                                    }
                                }); 
                            });
                        break;
                        case config.variantSC2:
                            let httpsResultSC2 = '';
                            fs.unlink('./data/SC2/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC2/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC2/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpsResultSC2 += data;
                            });
                            response.on('end', () => {

                                let dataVerif = listFunction.validateJSON(httpsResultSC2)

                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                                fs.writeFile(`./data/SC2/siege.json`, httpsResultSC2, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC2}`)
                                        message.channel.send(httpsVariantEmbed)
                                        
                                    }
                                }); 
                            });
                        break;
                        case config.variantSC3:
                            let httpsResultSC3 = '';
                            fs.unlink('./data/SC3/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC3/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC3/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpsResultSC3 += data;
                            });
                            response.on('end', () => {

                                let dataVerif = listFunction.validateJSON(httpsResultSC3)

                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                                fs.writeFile(`./data/SC3/siege.json`, httpsResultSC3, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC3}`)
                                        message.channel.send(httpsVariantEmbed)
                                        
                                    }
                                }); 
                            });
                        break;
                        case config.variantSC4:
                            let httpsResultSC4 = '';
                            fs.unlink('./data/SC4/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC4/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC4/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpsResultSC4 += data;
                            });
                            response.on('end', () => {

                                let dataVerif = listFunction.validateJSON(httpsResultSC4)

                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                                fs.writeFile(`./data/SC4/siege.json`, httpsResultSC4, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC4}`)
                                        message.channel.send(httpsVariantEmbed)
                                        
                                    }
                                }); 
                            });
                        break;
                        default:
                            let errorHttpsGuildVariant = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Récupération du fichier  :x:`)
                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
                            .setFooter("Erreur : errorGuildVariant - SWITCH")
                            message.channel.send(errorHttpsGuildVariant)
                    } 
        
                }else {

                    let httpsError = new Discord.MessageEmbed()
                    .setColor("#F00E0E")
                    .setTitle(`:x: Récupération du fichier  :x:`)
                    .setDescription(":x: La récupération du fichier à eu un problème ! Merci de vérifier votre liens.")
                    .setFooter("Erreur : httpsError - Reponse request")
                    message.channel.send(httpsError)

                }
            });
        
        }else if (urlJson.indexOf(('http://')) !== -1) {

            http.get(urlJson, function(response) { 

                if (response.statusCode === 200) {

                    switch (variantSC){
                        case config.variantSC1:
                            let httpResultSC1 = '';
                            fs.unlink('./data/SC1/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC1/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC1/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpResultSC1 += data;
                            });
                            response.on('end', () => {

                                let dataVerif = listFunction.validateJSON(httpResultSC1)

                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                                fs.writeFile(`./data/SC1/siege.json`, httpResultSC1, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC1}`)
                                        message.channel.send(httpsVariantEmbed)
                                        
                                    }
                                }); 
                            });
                        break;
                        case config.variantSC2:
                            let httpResultSC2 = '';
                            fs.unlink('./data/SC2/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC2/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC2/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpResultSC2 += data;
                            });
                            response.on('end', () => {

                                let dataVerif = listFunction.validateJSON(httpResultSC2)

                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                                fs.writeFile(`./data/SC2/siege.json`, httpResultSC2, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC2}`)
                                        message.channel.send(httpsVariantEmbed)
                                        
                                    }
                                }); 
                            });
                        break;
                        case config.variantSC3:
                            let httpResultSC3 = '';
                            fs.unlink('./data/SC3/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC3/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC3/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpResultSC3 += data;
                            });
                            response.on('end', () => {

                                let dataVerif = listFunction.validateJSON(httpResultSC3)

                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                                fs.writeFile(`./data/SC3/siege.json`, httpResultSC3, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC3}`)
                                        message.channel.send(httpsVariantEmbed)
                                        
                                    }
                                }); 
                            });
                        break;
                        case config.variantSC4:
                            let httpResultSC4 = '';
                            fs.unlink('./data/SC4/siege.json', function (err) {
                                if (err) {
                                    console.log("Rien a supprimé : ./data/SC4/siege.json")
                                }else {
                                    console.log('Fichier supprimé : ./data/SC4/siege.json');
                                }
                            });
                            response.on("data", (data) =>{
                                httpResultSC4 += data;
                            });

                            let dataVerif = listFunction.validateJSON(httpResultSC4)

                            let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Récupération du fichier  :x:`)
                            .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                            .setFooter("Erreur : reponseFileSaveDataNotJsonError - FORMAT NOT JSON")

                            if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) | console.log("Le fichier n'est pas sur le format d'un JSON.")

                            response.on('end', () => {
                                fs.writeFile(`./data/SC4/siege.json`, httpResultSC4, function(err) {
                                    if (err) {
                                    
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError - NO SAVE")
                                        message.channel.send(reponseFileSaveError)

                                    } else {

                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC4}`)
                                        message.channel.send(httpsVariantEmbed)
                                        
                                    }
                                }); 
                            });
                        break;
                        default:
                            let errorHttpGuildVariant = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Récupération du fichier  :x:`)
                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`) 
                            .setFooter("Erreur : errorHttpGuildVariant - SWITCH")
                            message.channel.send(errorHttpGuildVariant)
                    } 

                }else {

                    let httpError = new Discord.MessageEmbed()
                    .setColor("#F00E0E")
                    .setTitle(`:x: Récupération du fichier  :x:`)
                    .setDescription(":x: La récupération du fichier est imposible ! Merci de vérifier votre liens.")
                    .setFooter("Erreur : httpError - Reponse request")
                    message.channel.send(httpError)

                }
            });

        }else{

            let httpsHttpError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(":x: La récupération du fichier est imposible ! Merci d'indiquer un liens qui commence par HTTPS ou HTTP !")
            .setFooter("Erreur : httpsHttpError - Reponse request")
            message.channel.send(httpsHttpError)

        }
    }
}