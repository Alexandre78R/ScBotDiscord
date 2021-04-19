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

function offense(message) {

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
    let messageArray = message.content.split("-");
    let offenseMonsters = messageArray[0].split(" ").slice(1).filter(Boolean);
    let defenseMonsters = messageArray[1].split(" ").filter(Boolean);
    let outcome = messageArray[2];

    //Argument pour url juste après la commande

    console.log("Monster in the offense", offenseMonsters)
    console.log("Monster in the defense", defenseMonsters)
    console.log("Outcome", outcome)

    //Vérifier la validité des noms des monstres
    let nameValidityError = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Noms incorrects  :x:`)
        .setDescription(":x: Les noms suivants sont incorrects ou n'existent pas dans notre base de données:")
        .setFooter("Erreur : urlJsonError - undefined")

    //Vérifier le nombre de monstre

    //Vérifier la validité de l'outcome

    //Envoyer les données au bot Google Sheet

    //Renvoyer un message de succès

    //if (urlJson == undefined) {

    //    let urlJsonError = new Discord.MessageEmbed()
    //        .setColor("#F00E0E")
    //        .setTitle(`:x: Récupération du fichier  :x:`)
    //        .setDescription(":x: Merci d'indiquer un lien pour récupérer le fichier.")
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
    //                                console.log("Rien a supprimé : ./data/SC1/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC1/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC1/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC1Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC1}`)
    //                        message.channel.send(httpsVariantSC1Embed)
    //                        break;
    //                    case config.variantSC2:
    //                        fs.unlink('./data/SC2/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprimé : ./data/SC2/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC2/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC2/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC2Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC2}`)
    //                        message.channel.send(httpsVariantSC2Embed)
    //                        break;
    //                    case config.variantSC3:
    //                        fs.unlink('./data/SC3/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprimé : ./data/SC3/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC3/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC3/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC3Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC3}`)
    //                        message.channel.send(httpsVariantSC3Embed)
    //                        break;
    //                    case config.variantSC4:
    //                        fs.unlink('./data/SC4/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprimé : ./data/SC4/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC4/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC4/siege.json");
    //                        response.pipe(file);
    //                        let httpsVariantSC4Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC4}`)
    //                        message.channel.send(httpsVariantSC4Embed)
    //                        break;
    //                    default:
    //                        let errorHttpsGuildVariant = new Discord.MessageEmbed()
    //                            .setColor("#F00E0E")
    //                            .setTitle(`:x: Récupération du fichier  :x:`)
    //                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`)
    //                            .setFooter("Erreur : errorGuildVariant - SWITCH")
    //                        message.channel.send(errorHttpsGuildVariant)
    //                }

    //            } else {

    //                let httpsError = new Discord.MessageEmbed()
    //                    .setColor("#F00E0E")
    //                    .setTitle(`:x: Récupération du fichier  :x:`)
    //                    .setDescription(":x: La récupération du fichier à eu un problème ! Merci de vérifier votre liens.")
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
    //                                console.log("Rien a supprimé : ./data/SC1/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC1/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC1/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC1Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC1}`)
    //                        message.channel.send(httpVariantSC1Embed)
    //                        break;
    //                    case config.variantSC2:
    //                        fs.unlink('./data/SC2/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprimé : ./data/SC2/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC2/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC2/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC2Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC2}`)
    //                        message.channel.send(httpVariantSC2Embed)
    //                        break;
    //                    case config.variantSC3:
    //                        fs.unlink('./data/SC3/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprimé : ./data/SC3/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC3/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC3/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC3Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC3}`)
    //                        message.channel.send(httpVariantSC3Embed)
    //                        break;
    //                    case config.variantSC4:
    //                        fs.unlink('./data/SC4/siege.json', function (err) {
    //                            if (err) {
    //                                console.log("Rien a supprimé : ./data/SC4/siege.json")
    //                            } else {
    //                                console.log('Fichier supprimé : ./data/SC4/siege.json');
    //                            }
    //                        });
    //                        var file = fs.createWriteStream("./data/SC4/siege.json");
    //                        response.pipe(file);
    //                        let httpVariantSC4Embed = new Discord.MessageEmbed()
    //                            .setColor("#01E007")
    //                            .setTitle(`:white_check_mark: Récupération du fichier  :white_check_mark:`)
    //                            .setDescription(`:white_check_mark: La récupération du fichier à bien éffectuer sur ${config.variantSC4}`)
    //                        message.channel.send(httpVariantSC4Embed)
    //                        break;
    //                    default:
    //                        let errorHttpGuildVariant = new Discord.MessageEmbed()
    //                            .setColor("#F00E0E")
    //                            .setTitle(`:x: Récupération du fichier  :x:`)
    //                            .setDescription(`:x: Merci d'indiquer votre guilde. Avec les choix suivant : ${config.variantSC1} ${config.variantSC2} ${config.variantSC3} ${config.variantSC4}`)
    //                            .setFooter("Erreur : errorHttpGuildVariant - SWITCH")
    //                        message.channel.send(errorHttpGuildVariant)
    //                }

    //            } else {

    //                let httpError = new Discord.MessageEmbed()
    //                    .setColor("#F00E0E")
    //                    .setTitle(`:x: Récupération du fichier  :x:`)
    //                    .setDescription(":x: La récupération du fichier est imposible ! Merci de vérifier votre liens.")
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
    //            .setTitle(`:x: Récupération du fichier  :x:`)
    //            .setDescription(":x: La récupération du fichier est imposible ! Merci d'indiquer un liens qui commence par HTTPS ou HTTP !")
    //            .setFooter("Erreur : httpsHttpError - Reponse request")
    //        message.channel.send(httpsHttpError)

    //    }
    //}
}

//Module export
module.exports = offense;