//Api discord
const Discord = require('discord.js');

//Nom du client pour discord 
const client = new Discord.Client();

//Import de la configuration
var config = require("../config/config");

//Import de la commande Info
const cmdStats = require('../commands/stats.js');

//Import de la commande DL
const cmdDL = require('../commands/dl.js');

//Import de la commande Processing
const cmdProcessing = require('../commands/processing.js');

//Import de la commande Player
const cmdPlayer = require("../commands/player.js");

//Import de la commande ListPlayer
const cmdListPlayer = require('../commands/listplayer.js');

const cmdHelp = require('../commands/help.js');

const cmdTest = require('../commands/test.js');

//Import de la commande Offense
const cmdOffense = require('../commands/offense.js');

//Import de la commande Sb
const cmdSb = require('../commands/sb.js');

//Import de la commande mycontrib
const cmdMyContrib = require('../commands/mycontrib.js');

//Import de la commande MyStats
const cmdMyStats = require('../commands/mystats.js');

//Import de la commande Maintenance
const cmdMaintenance = require('../commands/maintenance.js');

//Import de la commande playerstats
const cmdPlayerStats = require("../commands/playerstats.js");

//Import de la commande playerstats
const cmdLastOffense = require("../commands/lastoffense.js");

//Import de la commande playerstats
const cmdDelOffense = require("../commands/deloffense.js");

//Import de la commande playerstats
const cmdUpOffense = require("../commands/upoffense.js");

//En cas d'erreur pour le bot discord
client.on('warn', console.warn);
client.on('error', console.error);
client.on('disconnect', () => console.log('Je viens de me déconnecter, en m\'assurant que vous savez, je vais me reconnecter maintenant'));
client.on('reconnecting', () => console.log('Je reconnecte maintenant !'));

//Status du bot discord 
client.on('ready', () => {
	//Génération du profils du bot sur discord.
    client.user.setActivity('By Alexandre78R, Tzzat', { type: 'PLAYING' });
})

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get(config.discord.channelWelcome)
    if (!channel) return console.log("Imposible de trouver le channel de bienvenue.")
    member.guild.channels.cache.get(config.discord.channelWelcome).send(`Bienvenu chez Sacré Cœur, ${member.user}. Merci de préciser si tu es intéressé par une guilde ou déjà dans une.`)
});

//Préfix du bot 
var prefixDiscord = config.discord.prefix;

client.on("messageUpdate", msg => { 
    if (msg.reactions.message.author.bot || msg.reactions.message.channel.type != 'text')
        return;

    if (!msg.reactions.message.content.startsWith(prefixDiscord))
        return;

    let cmd = msg.reactions.message.content.split(/\s+/)[0].slice(prefixDiscord.length).toLowerCase();
    getCmdFunction(cmd)(msg.reactions.message);
});

//Les commandes pour discord
client.on('message', msg => {
    if (msg.author.bot || msg.channel.type != 'text')
        return;

    if (!msg.content.startsWith(prefixDiscord))
        return;

    let cmd = msg.content.split(/\s+/)[0].slice(prefixDiscord.length).toLowerCase();
    getCmdFunction(cmd)(msg);
});

//Gestion des fichiers pour les commandes discord.
function getCmdFunction(cmd) {
    const COMMANDS = {
    'stats': cmdStats,
    'dl': cmdDL,
    'processing' : cmdProcessing,
    'player' : cmdPlayer,
    'listplayer' : cmdListPlayer,
    'help': cmdHelp,
    'offense': cmdOffense,
    'sb': cmdSb,
    'mycontrib': cmdMyContrib,
    'mystats': cmdMyStats,
    'maintenance' : cmdMaintenance,
    'test' : cmdTest,
    "playerstats" : cmdPlayerStats,
    "lastoffense" : cmdLastOffense,
    "deloffense" : cmdDelOffense,
    "upoffense" : cmdUpOffense
    }
    return COMMANDS[cmd] ? COMMANDS[cmd] : () => {};
}

//Export du client Discord
module.exports = client;