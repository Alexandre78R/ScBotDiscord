//Api discord
const Discord = require('discord.js');

//Nom du client pour discord 
const client = new Discord.Client();

//Import de la configuration
var config = require("../config/config");

//Import de la commande Info
const cmdStats = require('../commands/stats.js');

//Import de la commande DL
const cmdDL = require('../commands/dl.js')

//Import de la commande Processing
const cmdProcessing = require('../commands/processing.js')

//Import de la commande Player
const cmdPlayer = require("../commands/player.js")

//Import de la commande ListPlayer
const cmdListPlayer = require('../commands/listplayer.js')

const cmdHelp = require('../commands/help.js')

const cmdTest = require('../commands/test.js')

//Import de la commande Offense
const cmdOffense = require('../commands/offense.js')

//Import de la commande Sb
const cmdSb = require('../commands/sb.js')

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

// client.on('guildMemberAdd', member => {
    //     console.log('test', member)
    //     member.guild.channels.find("name", "recrutement").send(`Bienvenu chez Sacré Cœur, ${member.user}. Merci de préciser si tu es intéressé par une guilde ou déjà dans une.`)
    //     // member.guild.channels.cache.get('392029583945367568').send(`Bienvenu chez Sacré Cœur, ${member.user}. Merci de préciser si tu es intéressé par une guilde ou déjà dans une.`)
    //     const channel = member.guild.channels.cache.get(config.discord.channelWelcome)
    //     if (!channel) return console.log("Imposible de trouver le channel de bienvenue.")
    //     member.guild.channels.cache.get(config.discord.channelWelcome).send(`Bienvenu chez Sacré Cœur, ${member.user}. Merci de préciser si tu es intéressé par une guilde ou déjà dans une.`)
// });

//Préfix du bot 
var prefixDiscord = config.discord.prefix;

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
    'test' : cmdTest
    }
    return COMMANDS[cmd] ? COMMANDS[cmd] : () => {};
}

//Export du client Discord
module.exports = client;