//Import environment variable
const environment = require("../environment.js")

//Module export
module.exports = {
    "discord" : {
        "token": environment.TOKENBOTDISCORD,
        "port": environment.PORTBOTDISCORD,
        "prefix": environment.PREFIXBOTDISCORD, 
        "variantSC1" : "SC1",
        "variantSC2" : "SC2",
        "variantSC3" : "SC3",
        "variantSC4": "SC4",
        "maintenance" : {
            "dl": false,
            "help": true,
            "listplayer": false,
            "mycontrib": true,
            "mystats" : true,
            "offense": true,
            "player": false,
            "processing": false,
            "sb": true,
            "stats": false,
            "test": true,
            "playerstats": true
        },
        "roles_id": {
            "DEV": environment.roles_id.DEV,
            "SC1": environment.roles_id.SC1,
            "SC2": environment.roles_id.SC2,
            "SC3": environment.roles_id.SC3,
            "SC4": environment.roles_id.SC4,
        },
        "channelWelcome": environment.channelWelcome
    },
    "bdd" : {
        "hostname": environment.HOSTNAMEBDD,
        "port": environment.PORTBDD,
        "username": environment.USERNAMEBDD,
        "password": environment.PASSWORDBDD,
        "database": environment.DATABASENAME
    }
}