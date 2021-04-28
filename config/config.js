//Module pour stocker les infos privés dans un fichier .env
require('dotenv').config()

//Module export
module.exports = {
    "discord" : {
        "token" : process.env.TOKENBOTDISCORD,
        "port" : process.env.PORTBOTDISCORD,
        "prefix" : process.env.PREFIXBOTDISCORD, 
        "variantSC1" : "SC1",
        "variantSC2" : "SC2",
        "variantSC3" : "SC3",
        "variantSC4": "SC4",
        "roles_id": {
            "DEV": "837032418841329724",
            "SC1": "835838255139651614",
            "SC2": "835838256859578400",
            "SC3": "835849090466185247",
            "SC4": "835849148309176350",
        },
        "maintenance" : {
            "dl": true,
            "help": true,
            "listplayer": true,
            "mycontrib": true,
            "mystats" : true,
            "offense": true,
            "player": true,
            "processing": true,
            "sb": true,
            "stats": true,
            "test": true,
        },
        "channelWelcome" : "811292323895705682"
    },
    "bdd" : {
        "hostname" : process.env.HOSTNAMEBDD,
        "port" : process.env.PORTBDD,
        "username" : process.env.USERNAMEBDD,
        "password": process.env.PASSWORDBDD,
        "database": process.env.DATABASENAME
    }
}