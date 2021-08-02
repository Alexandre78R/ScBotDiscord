//Import de la config
const config = require('../../config/config');

//Import de la LIBS discord.js
const Discord = require('discord.js');

//Import du module fs
var fs = require('fs');

//Import du module http
var http = require('http');

//Import du module https
var https = require('https');

//Import de la function vérification du format en JSON
var validateJSON = require('../../function/validateJSON.js');

//Import des consoleLog pour un système de historique
const consoleLog = require('../../function/consoleLog.js');

//Function check maintenance
var checkMaintenance = require('../../function/checkMaintenance.js');

var userInfo = require('../../function/userinfo.js');

function dl (message){

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix)
            message[0] = message[0].slice(1);

    }

    // Récupération des arguments après la commandes
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = userInfo("./commands/dl.js", message);

    var statutcommand = checkMaintenance (message, "dl", infoUser);
    if(statutcommand == false) return;
    
    //Premier argument
    var variantSC = args[0];

    //Message d'error si il n'y a pas d'argument
    let errorArgsVariant = new Discord.MessageEmbed()
    .setColor("#F00E0E")
    .setTitle(`:x: Récupération du fichier  :x:`)
    .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
    .setFooter("Erreur : errorArgsVariantDl");

    //Vérification Si l'utilisateur n'a pas rentrer d'argument
    if (variantSC == undefined) return message.channel.send(errorArgsVariant) && consoleLog(`ERROR : errorArgsVariantDl`, NaN, infoUser);

    //Deuxième arguement 
    var urlJson = args[1];

    //Condition s'il n'y a pas le deuxième argument
    if (urlJson == undefined){

        //Message d'erreur
        let urlJsonError = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Récupération du fichier  :x:`)
        .setDescription(":x: Merci d'indiquer un lien pour récupérer le fichier.")
        .setFooter("Erreur : urlJsonError");
        message.channel.send(urlJsonError);
        consoleLog(`ERROR : urlJsonError - ${variantSC}`, NaN, infoUser);

    }else {

        //Condition de vérification si c'est en https l'url
        if (urlJson.indexOf(('https://')) !== -1){

            //On lance une requête vers l'url
            https.get(urlJson, function(response) { 

                //Condtion du status de la réponse de la requête vers l'url
                if (response.statusCode === 200) {
                    
                    //Chemain de switch pour savoir ou enregistrer les informations
                    switch (variantSC){
                        
                        //Switch SC1
                        case config.discord.variantSC1:

                            //Variable pour stock les datas
                            let httpsResultSC1 = '';

                            //On surrpime le fichier siege si il existe
                            fs.unlink('./data/SC1/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC1/siege.json - ${variantSC}`, err);
                                }else {
                                    consoleLog(`OK : Fichier supprimé : ./data/SC1/siege.json - ${variantSC}`);
                                }
                            });

                            //Récupération de la data et on l'envoie dans une variable
                            response.on("data", (data) => {
                                httpsResultSC1 += data;
                            });

                            //Traitement après avoir récupérer les information des datas
                            response.on('end', () => {

                                //On vérifie la data si il conrepond à un JSON
                                let dataVerif = validateJSON(httpsResultSC1);

                                //Message d'erreur si le format du fichier n'est pas en JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");

                                //Condition si la data n'est pas en format JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //Sauvegarde du fichier
                                fs.writeFile(`./data/SC1/siege.json`, httpsResultSC1, function(err) {

                                    //Condition en cas d'erreur pendant la sauvegarde
                                    if (err) {

                                        //Message en cas d'erreur de sauvegarde de fichier
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message de la récupération du fichier quand c'est fait
                                        let httpsVariantSC1Embed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC1}`);
                                        message.channel.send(httpsVariantSC1Embed);
                                        consoleLog(`OK : httpsVariantSC1Embed - ${variantSC}`, httpsResultSC1, infoUser);

                                    }

                                }); 
                            });
                        break;

                        //Switch SC2
                        case config.discord.variantSC2:

                            //Variable ou on stock les datas
                            let httpsResultSC2 = '';

                            //On surrpime le fichier siege si ll existe
                            fs.unlink('./data/SC2/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC2/siege.json - ${variantSC}`, err);
                                }else {
                                    consoleLog(`Ok : Fichier supprimé : ./data/SC2/siege.json - ${variantSC}`);
                                }
                            });
                            
                            //Récupération de la data et on l'envois dans une variable
                            response.on("data", (data) => {
                                httpsResultSC2 += data;
                            });

                            //Traitement après avoir récupérer les information data
                            response.on('end', () => {

                                //On vérifi la data si c'est en format JSON 
                                let dataVerif = validateJSON(httpsResultSC2);

                                //Message d'erreur si le fichier n'est pas en format en JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");

                                //Condtion si la data n'est pas en format en JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //Sauvegarde du fichier
                                fs.writeFile(`./data/SC2/siege.json`, httpsResultSC2, function(err) {

                                    //Conditon en cas d'erreur pendant la sauvegarde 
                                    if (err) {
                                        
                                        //Message d'erreur si il y a eu un problème de sauvegarde
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message de récupération du fichier quand c'est bon
                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC2}`);
                                        message.channel.send(httpsVariantEmbed);
                                        console.log(`OK : httpsVariantEmbed - ${variantSC}`, httpsResultSC2, infoUser);
                                        
                                    }
                                }); 
                            });
                        break;

                        //Swith SC3
                        case config.discord.variantSC3:

                            //Varible pour stocker les datas
                            let httpsResultSC3 = '';

                            //On supprime le fichier siege si il existe
                            fs.unlink('./data/SC3/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC3/siege.json - ${variantSC}`, err);
                                }else {
                                    consoleLog(`OK : Fichier supprimé : ./data/SC3/siege.json - ${variantSC}`);
                                }
                            });

                            //Récupération de la data et on l'envois dans une variable
                            response.on("data", (data) =>{
                                httpsResultSC3 += data;
                            });

                            //Traitement après avoir récupérer les information des datas
                            response.on('end', () => {

                                //On vérifie si la data est en format JSON
                                let dataVerif = validateJSON(httpsResultSC3)

                                //Message d'erreur en cas les datas ne sont pas en format JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");

                                //Condition les datas ne sont pas en format JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //On sauvegarde le fichier du siege
                                fs.writeFile(`./data/SC3/siege.json`, httpsResultSC3, function(err) {

                                    //Condition en cas de problème pendant la sauvegarde
                                    if (err) {
                                        
                                        //Message en cas d'erreur de sauvegarde du fichier
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message si la récupération du fichier est ok
                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC3}`);
                                        message.channel.send(httpsVariantEmbed);
                                        consoleLog(`OK  : httpsVariantEmbed - ${variantSC}`, httpsResultSC3, infoUser);
                                        
                                    }
                                }); 
                            });
                        break;

                        //Switch SC4
                        case config.discord.variantSC4:

                            //On stock les datas dans la variable
                            let httpsResultSC4 = '';

                            //On supprime le fichier siege si il existe
                            fs.unlink('./data/SC4/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC4/siege.json`, err)
                                }else {
                                    consoleLog(`OK : Fichier supprimé : ./data/SC4/siege.json - ${variantSC}`);
                                }
                            });

                            //Récupération de la data et on l'envois dans une variable
                            response.on("data", (data) =>{
                                httpsResultSC4 += data;
                            });

                            //Traitement après avoir récupérer les information des datas
                            response.on('end', () => {

                                //On vérifier si les datas sont en format JSON
                                let dataVerif = validateJSON(httpsResultSC4)

                                //Message en cas le fichier n'est pas en format JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");

                                //Condition en cas les datas ne sont pas en format JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //Sauvegarde du fichier siege
                                fs.writeFile(`./data/SC4/siege.json`, httpsResultSC4, function(err) {

                                    //Condition en as d'erreur de sauvegarde 
                                    if (err) {

                                        //Message d'erreur en cas de problème de sauvegarde
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message quand le fichier a bien sauvegarder
                                        let httpsVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC4}`);
                                        message.channel.send(httpsVariantEmbed);
                                        consoleLog(`OK : httpsVariantEmbed - ${variantSC}`, httpsResultSC4, infoUser);
                                        
                                    }

                                }); 
                            });
                        break;
            
                        default:

                            //Message d'erreur si pas d'argumment correspondant pour le switch
                            let errorHttpsGuildVariant = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Récupération du fichier  :x:`)
                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
                            .setFooter("Erreur : errorGuildVariant");
                            message.channel.send(errorHttpsGuildVariant);
                            consoleLog(`ERROR : errorHttpsGuildVariant - ${variantSC}`, NaN, infoUser);
                    } 
        
                }else {

                    //Message erreur impossible ce n'est pas un liens HTTP OU HTTPS
                    let httpsError = new Discord.MessageEmbed()
                    .setColor("#F00E0E")
                    .setTitle(`:x: Récupération du fichier  :x:`)
                    .setDescription(":x: La récupération du fichier à eu un problème ! Merci de vérifier votre liens.")
                    .setFooter("Erreur : httpsError");
                    message.channel.send(httpsError);
                    consoleLog(`ERROR : httpsError - ${variantSC}`, NaN, infoUser);

                }
            });
        
        //Condition si le lien est un http
        }else if (urlJson.indexOf(('http://')) !== -1) {

            //On envoie une requête sur le liens 
            http.get(urlJson, function(response) { 

                //Condition pour la réponse du lien
                if (response.statusCode === 200) {

                    //Chemin de switch pour savoir ou enregistrer les infrmations
                    switch (variantSC){

                        //Switch SC1
                        case config.discord.variantSC1:

                            //On stock les datas
                            let httpResultSC1 = '';

                            //On supprime le fichier si il existe
                            fs.unlink('./data/SC1/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC1/siege.json - ${variantSC}`, err);
                                }else {
                                    consoleLog(`OK : Fichier supprimé : ./data/SC1/siege.json- ${variantSC}`);
                                }
                            });

                            //Récupération de la data et on l'envois dans une variable
                            response.on("data", (data) =>{
                                httpResultSC1 += data;
                            });
                            
                            //Traitement après avoir récupérer les information des datas
                            response.on('end', () => {

                                //On vérifi si la data est format JSON
                                let dataVerif = validateJSON(httpResultSC1)

                                //Message si la data n'est pas en format JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");

                                //Condition si les infos ne sont pas en format JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //Sauvegade du fichier siege 
                                fs.writeFile(`./data/SC1/siege.json`, httpResultSC1, function(err) {

                                    //Condtion en cas d'erreur de la sauvegarde du fichier
                                    if (err) {
                                        
                                        //Message si la sauvegarde du fichier n'a pas réussi 
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message si le fichier a bien était sauvegarder
                                        let httpVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC1}`)
                                        message.channel.send(httpVariantEmbed);
                                        consoleLog(`OK : httpVariantEmbed - ${variantSC}`, httpResultSC1, infoUser);
                                    }
                                }); 
                            });
                        break;

                        //Switch SC2
                        case config.discord.variantSC2:
                            
                            //On stock les datas dans la variable
                            let httpResultSC2 = '';

                            //On supprime le fichier si il existe
                            fs.unlink('./data/SC2/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC2/siege.json - ${variantSC}`, err);
                                }else {
                                    consoleLog(`Fichier supprimé : ./data/SC2/siege.json' - ${variantSC}`);
                                }
                            });

                            //Récupération de la data et on l'envois dans une variable
                            response.on("data", (data) =>{
                                httpResultSC2 += data;
                            });

                            //Traitement après avoir récupérer les information data
                            response.on('end', () => {

                                //On vérifi si la data es format JSON
                                let dataVerif = validateJSON(httpResultSC2);

                                //Message d'erreur en cas les datas ne sont pas en format de JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");

                                //Condition si les datas ne sont pas en JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //On sauvegarde le fichier siege
                                fs.writeFile(`./data/SC2/siege.json`, httpResultSC2, function(err) {

                                    //Condtion en cas de problème pendant la sauvegarde
                                    if (err) {
                                        
                                        //Message d'erreur si on n'arrive pas à sauvegarder le fichier 
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message si le fichier a était sauvegarder
                                        let httpVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC2}`)
                                        message.channel.send(httpVariantEmbed);
                                        consoleLog(`ERROR : httpVariantEmbed - ${variantSC}`, httpResultSC2, infoUser);

                                    }
                                }); 
                            });
                        break;

                        //Switch SC3
                        case config.discord.variantSC3:

                            //Varible stock les datas
                            let httpResultSC3 = '';

                            //On suprime le fichier si il existe déjà
                            fs.unlink('./data/SC3/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC3/siege.json - ${variantSC}`, err);
                                }else {
                                    consoleLog(`OK : Fichier supprimé : ./data/SC3/siege.json - ${variantSC}`);
                                }
                            });

                            //Récupération de la data et on l'envois dans une variable
                            response.on("data", (data) =>{
                                httpResultSC3 += data;
                            });

                            //Traitement après avoir récupérer les information des datas
                            response.on('end', () => {

                                //On vérifie que la data est en format JSON
                                let dataVerif = validateJSON(httpResultSC3);

                                //Message d'erreur si la data n'est pas en format JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");

                                //Condition si la data n'est pas en JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //On sauvegarde le fichier siege
                                fs.writeFile(`./data/SC3/siege.json`, httpResultSC3, function(err) {

                                    //Condition en d'erreur pendant la sauvegarde
                                    if (err) {
                                        
                                        //Message d'erreur si il y eu un problème pendant la sauvegarde
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message si la sauvegarde à bien était éffectué
                                        let httpVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC3}`);
                                        message.channel.send(httpVariantEmbed);
                                        consoleLog(`OK : httpVariantEmbed - ${variantSC}`, httpResultSC3, infoUser);
                                        
                                    }
                                }); 
                            });
                        break;

                        //Switch SC4
                        case config.discord.variantSC4:

                            //On stock les datas
                            let httpResultSC4 = '';

                            //On supprime le fichier siege si il existe déjà
                            fs.unlink('./data/SC4/siege.json', function (err) {
                                if (err) {
                                    consoleLog(`ERROR : Rien a supprimé : ./data/SC4/siege.json - ${variantSC}`, err);
                                }else {
                                    consoleLog(`OK : Fichier supprimé : ./data/SC4/siege.json - ${variantSC}`);
                                }
                            });

                            //Récupération de la data et on l'envois dans une variable
                            response.on("data", (data) =>{
                                httpResultSC4 += data;
                            });

                            //Traitement après avoir récupérer les information data
                            response.on('end', () => {

                                //On stock les datas dans la variable
                                let dataVerif = validateJSON(httpResultSC4)

                                //Message d'erreur si la data n'est pas en format JSON
                                let reponseFileSaveDataNotJsonError = new Discord.MessageEmbed()
                                .setColor("#F00E0E")
                                .setTitle(`:x: Récupération du fichier  :x:`)
                                .setDescription(":x: L'url que vous venez de rentrer ne correspond pas a fichier JSON merci de vérifier votre liens.")
                                .setFooter("Erreur : reponseFileSaveDataNotJsonError");
                                
                                //Condition si la data n'est pas en forma JSON
                                if (dataVerif == null) return message.channel.send(reponseFileSaveDataNotJsonError) && consoleLog(`ERROR : reponseFileSaveDataNotJsonError - ${variantSC}`, NaN, infoUser);

                                //On sauvegarde le fichier 
                                fs.writeFile(`./data/SC4/siege.json`, httpResultSC4, function(err) {
                                    
                                    //Condition en cas problème pendant la sauvegarde
                                    if (err) {
                                        
                                        //Message d'erreur si il y a eu un problème pendant la sauvegarde
                                        let reponseFileSaveError = new Discord.MessageEmbed()
                                        .setColor("#F00E0E")
                                        .setTitle(`:x: Récupération du fichier  :x:`)
                                        .setDescription(":x: Merci de refaire la commandes , le fichier n'a pas été sauvegarder.")
                                        .setFooter("Erreur : reponseFileSaveError");
                                        message.channel.send(reponseFileSaveError);
                                        consoleLog(`ERROR : reponseFileSaveError - ${variantSC}`, err, infoUser);

                                    } else {

                                        //Message si le fichier à était sauvegaarder
                                        let httpVariantEmbed = new Discord.MessageEmbed()
                                        .setColor("#01E007")
                                        .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
                                        .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.discord.variantSC4}`);
                                        message.channel.send(httpVariantEmbed);
                                        consoleLog(`OK : httpVariantEmbed - ${variantSC}`, httpResultSC4, infoUser);
                                        
                                    }
                                }); 
                            });
                        break;
                        default:

                            //Message d'erreur si pas d'argumment correspondant pour le switch
                            let errorHttpGuildVariant = new Discord.MessageEmbed()
                            .setColor("#F00E0E")
                            .setTitle(`:x: Récupération du fichier  :x:`)
                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.discord.variantSC1} ${config.discord.variantSC2} ${config.discord.variantSC3} ${config.discord.variantSC4}`) 
                            .setFooter("Erreur : errorHttpGuildVariant");
                            message.channel.send(errorHttpGuildVariant);
                            consoleLog(`ERROR : errorHttpGuildVariant - ${variantSC}`, NaN, infoUser);
                    } 

                }else {

                    //Message erreur impossible de récupérer le fichier avec cette url
                    let httpError = new Discord.MessageEmbed()
                    .setColor("#F00E0E")
                    .setTitle(`:x: Récupération du fichier  :x:`)
                    .setDescription(":x: La récupération du fichier est imposible ! Merci de vérifier votre liens.")
                    .setFooter("Erreur : httpError");
                    message.channel.send(httpError);
                    consoleLog(`ERROR : httpError - ${variantSC}`, NaN, infoUser);

                }
            });

        }else{

            //Message erreur impossible ce n'est pas un liens HTTP OU HTTPS
            let httpsHttpError = new Discord.MessageEmbed()
            .setColor("#F00E0E")
            .setTitle(`:x: Récupération du fichier  :x:`)
            .setDescription(":x: La récupération du fichier est imposible ! Merci d'indiquer un liens qui commence par HTTPS ou HTTP !")
            .setFooter("Erreur : httpsHttpError");
            message.channel.send(httpsHttpError);
            consoleLog(`ERROR : httpsHttpError - ${variantSC}`, NaN, infoUser);

        }
    }
}

//Module export
module.exports = dl;
