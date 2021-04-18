//"channelWelcome" : "811292323895705682"

// Express pour gestion port de la partie discord
const express = require("express");

//Utilisation app pour express
const app = express();

//Api discord
const Discord = require('discord.js');

//Nom du client pour discord 
const client = new Discord.Client();

//Import de la configuration
var config = require("./config/config.json");

//Import de la commande Info
const cmdOffense = require('./commands/offense.js')

//Import de la commande test
const cmdTest = require('./commands/test.js')

//Import TOKEN du bot
const TOKEN = process.env.TOKEN;

//Génération du port random
app.set('port', (process.env.PORT || 50000))
app.listen(app.get('port'), function(){
    console.log(`[Discord] : Le bot fonctionne sur le port : ${app.get('port')} `);
})

//En cas d'erreur pour le bot discord
client.on('warn', console.warn);
client.on('error', console.error);
client.on('disconnect', () => console.log('Je viens de me déconnecter, en m\'assurant que vous savez, je vais me reconnecter maintenant'));
client.on('reconnecting', () => console.log('Je reconnecte maintenant !'));

//Status du bot discord 
client.on('ready', () => {
	//Génération du profils du bot sur discord.
	// clientDiscord.user.setPresence({ activity : { name: '!aide By Alexandre78R' }});
    client.user.setActivity('By Alexandre78R', { type: 'PLAYING' });
})

//Préfix du bot 
var prefixDiscord = config.prefix;

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
    'offense': cmdOffense.offense,
    'test' : cmdTest.test
    }
    return COMMANDS[cmd] ? COMMANDS[cmd] : () => {};
}

//Connexion bot Discord

//Token bot SC siege sur la machine
client.login(TOKEN)
