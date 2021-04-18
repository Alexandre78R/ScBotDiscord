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
const { url } = require('inspector');

//Module export
module.exports = {
    'offense': offense,
}

function offense(message) {

    //S�curit� pour pas que le bot r�agi avec lui-m�me
    if (message.author.bot) return;

    //Permet d'�viter de r�pondre aux messages priv�s
    if (message.channel.type === "dm") return;

    //Prise en compte du prefix
    if (message.length == 1) {
        if (message[0].charAt(0) == config.prefix)
            message[0] = message[0].slice(1);

    }

    //Lecture du corps du message
    let messageArray = message.content.split("-");
    let offenseMonsters = messageArray[0].split(" ").slice(1).filter(Boolean);
    let defenseMonsters = messageArray[1].split(" ").filter(Boolean);
    let outcome = messageArray[2];

    //Argument pour url juste apr�s la commande

    console.log("Monster in the offense", offenseMonsters)
    console.log("Monster in the defense", defenseMonsters)
    console.log("Outcome", outcome)

    //V�rifier la validit� des noms des monstres
    let nameValidityError = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Noms incorrects  :x:`)
        .setDescription(":x: Les noms suivants sont incorrects ou n'existent pas dans notre base de donn�es:")
        .setFooter("Erreur : urlJsonError - undefined")

    //V�rifier le nombre de monstre

    //V�rifier la validit� de l'outcome

    //Envoyer les donn�es au bot Google Sheet

    //Renvoyer un message de succ�s

    //if (urlJson == undefined) {

    //    let urlJsonError = new Discord.MessageEmbed()
    //        .setColor("#F00E0E")
    //        .setTitle(`:x: R�cup�ration du fichier  :x:`)
    //        .setDescription(":x: Merci d'indiquer un lien pour r�cup�rer le fichier.")
    //        .setFooter("Erreur : urlJsonError - undefined")
    //    message.channel.send(urlJsonError)

    //} else {

    //    if (urlJson.indexOf(('https://')) !== -1) {

    //        var request = https.get(urlJson, function (response) {

    //            if (response.statusCode === 200) {

    //                switch (variantSC) {

    //                    case config.variantSC1:
    //                        fs.unlink('./data/SC1/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC1/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC1/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC1/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC1Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC1}`)
    //                        message.channel.send(httpsVariantSC1Embed)
    //                        break;
    //                    case config.variantSC2:
    //                        fs.unlink('./data/SC2/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC2/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC2/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC2/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC2Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC2}`)
    //                        message.channel.send(httpsVariantSC2Embed)
    //                        break;
    //                    case config.variantSC3:
    //                        fs.unlink('./data/SC3/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC3/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC3/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC3/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC3Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC3}`)
    //                        message.channel.send(httpsVariantSC3Embed)
    //                        break;
    //                    case config.variantSC4:
    //                        fs.unlink('./data/SC4/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC4/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC4/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC4/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC4Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC4}`)
    //                        message.channel.send(httpsVariantSC4Embed)
    //                        break;
    //                    default:
    //                        let errorHttpsGuildVariant = new Discord.MessageEmbed()
    //                            .setColor("#F00E0E")
    //                            .setTitle(`:x: R�cup�ration du fichier  :x:`)
    //                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`)
    //                            .setFooter("Erreur : errorGuildVariant - SWITCH")
    //                        message.channel.send(errorHttpsGuildVariant)
    //                }

    //            } else {

    //                let httpsError = new Discord.MessageEmbed()
    //                    .setColor("#F00E0E")
    //                    .setTitle(`:x: R�cup�ration du fichier  :x:`)
    //                    .setDescription(":x: La r�cup�ration du fichier � eu un probl�me ! Merci de v�rifier votre liens.")
    //                    .setFooter("Erreur : httpsError - Reponse request")
    //                message.channel.send(httpsError)

    //            }

    //            request.setTimeout(12000, function () {
    //                request.abort();
    //            });

    //        });

    //    } else if (urlJson.indexOf(('http://')) !== -1) {

    //        var request = http.get(urlJson, function (response) {

    //            if (response.statusCode === 200) {

    //                switch (variantSC) {
    //                    case config.variantSC1:
    //                        fs.unlink('./data/SC1/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC1/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC1/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC1/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC1Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC1}`)
    //                        message.channel.send(httpVariantSC1Embed)
    //                        break;
    //                    case config.variantSC2:
    //                        fs.unlink('./data/SC2/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC2/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC2/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC2/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC2Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC2}`)
    //                        message.channel.send(httpVariantSC2Embed)
    //                        break;
    //                    case config.variantSC3:
    //                        fs.unlink('./data/SC3/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC3/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC3/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC3/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC3Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC3}`)
    //                        message.channel.send(httpVariantSC3Embed)
    //                        break;
    //                    case config.variantSC4:
    //                        fs.unlink('./data/SC4/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprim� : ./data/SC4/siege.json")
    //                            } else {
    //                                console.log('Fichier supprim� : ./data/SC4/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC4/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC4Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: R�cup�ration du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La r�cup�ration du fichier � bien �ffectuer sur ${config.variantSC4}`)
    //                        message.channel.send(httpVariantSC4Embed)
    //                        break;
    //                    default:
    //                        let errorHttpGuildVariant = new Discord.MessageEmbed()
    //                            .setColor("#F00E0E")
    //                            .setTitle(`:x: R�cup�ration du fichier  :x:`)
    //                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`)
    //                            .setFooter("Erreur : errorHttpGuildVariant - SWITCH")
    //                        message.channel.send(errorHttpGuildVariant)
    //                }

    //            } else {

    //                let httpError = new Discord.MessageEmbed()
    //                    .setColor("#F00E0E")
    //                    .setTitle(`:x: R�cup�ration du fichier  :x:`)
    //                    .setDescription(":x: La r�cup�ration du fichier est imposible ! Merci de v�rifier votre liens.")
    //                    .setFooter("Erreur : httpError - Reponse request")
    //                message.channel.send(httpError)

    //            }

    //            request.setTimeout(12000, function () {
    //                request.abort();
    //            });

    //        });

    //    } else {

    //        let httpsHttpError = new Discord.MessageEmbed()
    //            .setColor("#F00E0E")
    //            .setTitle(`:x: R�cup�ration du fichier  :x:`)
    //            .setDescription(":x: La r�cup�ration du fichier est imposible ! Merci d'indiquer un liens qui commence par HTTPS ou HTTP !")
    //            .setFooter("Erreur : httpsHttpError - Reponse request")
    //        message.channel.send(httpsHttpError)

    //    }
    //}
}