//Module pour stocker les infos privés dans un fichier .env
require('dotenv').config()

//Module export
module.exports = {
    "discord" : {
        "token" : process.env.TOKENBOTDISCORD,
        "port" : process.env.PORTBOTDISCORD,
        "prefix" : "?", 
        "variantSC1" : "SC1",
        "variantSC2" : "SC2",
        "variantSC3" : "SC3",
        "variantSC4" : "SC4",
        "channelWelcome" : "811292323895705682"
    },
    "bdd" : {
        "hostname" : process.env.HOSTNAMEBDD,
        "port" : process.env.PORTBDD,
        "username" : process.env.USERNAMEBDD,
        "password" : process.env.PASSWORDBDD
    }
}