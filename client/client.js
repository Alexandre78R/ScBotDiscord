//Api discord
const Discord = require('discord.js');

//Nom du client pour discord 
const client = new Discord.Client();

//Import de la configuration
var config = require("../config/config");

//Import de la commande Info
const cmdStats = require('../commands/siege1vs1/stats.js');

//Import de la commande DL
const cmdDL = require('../commands/siege1vs1/dl.js');

//Import de la commande Processing
const cmdProcessing = require('../commands/siege1vs1/processing.js');

//Import de la commande Player
const cmdPlayer = require("../commands/siege1vs1/player.js");

//Import de la commande ListPlayer
const cmdListPlayer = require('../commands/siege1vs1/listplayer.js');

//Import de la commande help
const cmdHelp = require('../commands/siegestats/help.js');

//Import de la commande test
const cmdTest = require('../commands/dev/test.js');

//Import de la commande Offense
const cmdOffense = require('../commands/siegestats/offense.js');

//Import de la commande Sb
const cmdSb = require('../commands/siegestats/sb.js');

//Import de la commande mycontrib
const cmdMyContrib = require('../commands/siegestats/mycontrib.js');

//Import de la commande MyStats
const cmdMyStats = require('../commands/siegestats/mystats.js');

//Import de la commande Maintenance
const cmdMaintenance = require('../commands/dev/maintenance.js');

//Import de la commande playerstats
const cmdPlayerStats = require("../commands/siegestats/playerstats.js");

//Import de la commande lastOffense
const cmdLastOffense = require("../commands/siegestats/lastoffense.js");

//Import de la commande Deloffense
const cmdDelOffense = require("../commands/siegestats/deloffense.js");

//Import de la commande Upoffense
const cmdUpOffense = require("../commands/siegestats/upoffense.js");

//Import de la commande listoffense 
const cmdListOffense = require('../commands/admin/listoffense.js');

//Import de la commande listoffenseplayer
const cmdListOffensePlayer = require("../commands/admin/listoffenseplayer.js");

//En cas d'erreur pour le bot discord
client.on('warn', console.warn);
client.on('error', console.error);
client.on('disconnect', () => console.log('Je viens de me déconnecter, en m\'assurant que vous savez, je vais me reconnecter maintenant'));
client.on('reconnecting', () => console.log('Je reconnecte maintenant !'));

//Status du bot discord 
client.on('ready', async () => {
	//Génération du profils du bot sur discord.
    client.user.setActivity('By Alexandre78R, Tzzat', { type: 'PLAYING' });

    // Début test commande slash 
    // client.api.applications(client.user.id).guilds("831580265741680670").commands.post({
    //     data: {
    //         name: "hello",
    //         description: "hello world command"
    //         // possible options here e.g. options: [{...}]
    //     }
    // });
    // client.api.applications(client.user.id).commands.post({
    //     data: {
    //         name: 'dac',
    //         description: 'dac command',
    //         choices: [
    //             {
    //             name: "choice1",
    //             value: "choice1",
    //             required : true, 
    //             type : 3,
    //             },
    //         ]
    //     },
        
    // })

    // client.api.applications(client.user.id).commands.post({
    //     data: {
    //         name: "endcommand",
    //         description: "endcommand",
    //         // "choices": [
    //         //     {
    //         //       "type": 4,
    //         //       "name": "test3",
    //         //       "description": "test3",
    //         //       "required": true,
    //         //       "choices": [
    //         //         {
    //         //           "name": "choice1",
    //         //           "value": "choice1"
    //         //         },
    //         //         {
    //         //           "name": "choice3",
    //         //           "value": "choice3"
    //         //         },
    //         //         {
    //         //           "name": "choice2",
    //         //           "value": "choice2"
    //         //         }
    //         //       ]
    //         //     }
    //         //   ]            
    //     },
    // })
    // client.api.applications(client.user.id).guilds('831580265741680670').commands.post({
    //     data: {
    //         "name": "off",
    //         "description": "Commande offense en test",
    //         "options": [
    //             {
    //                 "name": "leadmoboffense",
    //                 "description": "Lead mob offense",
    //                 "type": 3,
    //                 "required": true,
    //                 "choices": [
    //                     {
    //                         "name": "Mob 1",
    //                         "value": "Mob 1"
    //                     },
    //                     {
    //                         "name": "Mob 2",
    //                         "value": "Mob 2"
    //                     },
    //                     {
    //                         "name": "Mob 3",
    //                         "value": "Mob 3"
    //                     },
    //                     {
    //                         "name": "Mob 4",
    //                         "value": "Mob 4"
    //                     },
    //                     {
    //                         "name": "Mob 5",
    //                         "value": "Mob 5"
    //                     },
    //                     {
    //                         "name": "Mob 6",
    //                         "value": "Mob 6"
    //                     },
    //                     {
    //                         "name": "Mob 6",
    //                         "value": "Mob 6"
    //                     },
    //                     {
    //                         "name": "Mob 7",
    //                         "value": "Mob 7"
    //                     },
    //                     {
    //                         "name": "Mob 8",
    //                         "value": "Mob 8"
    //                     },
    //                     {
    //                         "name": "Mob 9",
    //                         "value": "Mob 9"
    //                     },
    //                     {
    //                         "name": "Mob 20",
    //                         "value": "Mob 20"
    //                     },
    //                     {
    //                         "name": "Mob 30",
    //                         "value": "Mob 30"
    //                     },
    //                     {
    //                         "name": "Mob 10",
    //                         "value": "Mob 10"
    //                     },
    //                     {
    //                         "name": "Mob 2DFFDF",
    //                         "value": "Mob 2DFDF"
    //                     },
    //                     {
    //                         "name": "Mob 3SQSDVBFBFFD",
    //                         "value": "Mob 3QSQVDVDVDSG"
    //                     },
    //                     {
    //                         "name": "Mob 1SQZQFSQFEEFEZF",
    //                         "value": "Mob 1GBGFGNGN"
    //                     },
    //                     {
    //                         "name": "Mob 2DSDDBGFHGRHTNY",
    //                         "value": "Mob 2SSQFSSFGGEBFBFSBF"
    //                     },
    //                     {
    //                         "name": "Mob 3SQ<QDSFDS",
    //                         "value": "Mob 3BFBFBBFDFB"
    //                     },
    //                     {
    //                         "name": "Mob 1",
    //                         "value": "Mob 1"
    //                     },
    //                     {
    //                         "name": "Mob 2",
    //                         "value": "Mob 2"
    //                     },
    //                     {
    //                         "name": "Mob 3",
    //                         "value": "Mob 3"
    //                     },
    //                     {
    //                         "name": "Mob 4",
    //                         "value": "Mob 4"
    //                     },
    //                     {
    //                         "name": "Mob 5",
    //                         "value": "Mob 5"
    //                     },
    //                     {
    //                         "name": "Mob 6",
    //                         "value": "Mob 6"
    //                     },
    //                     {
    //                         "name": "Mob 6",
    //                         "value": "Mob 6"
    //                     },
    //                 ]
    //             },
    //             {
    //                 "name": "twomoboffense",
    //                 "description": "Two mob offense",
    //                 "type": 3,
    //                 "required": true,
    //                 "choices": [
    //                     {
    //                         "name": "Mob 1",
    //                         "value": "Mob 1"
    //                     },
    //                     {
    //                         "name": "Mob 2",
    //                         "value": "Mob 2"
    //                     },
    //                     {
    //                         "name": "Mob 3",
    //                         "value": "Mob 3"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "threemoboffense",
    //                 "description": "three mob offense",
    //                 "type": 3,
    //                 "required": true,
    //                 "choices": [
    //                     {
    //                         "name": "Mob 1",
    //                         "value": "Mob 1"
    //                     },
    //                     {
    //                         "name": "Mob 2",
    //                         "value": "Mob 2"
    //                     },
    //                     {
    //                         "name": "Mob 3",
    //                         "value": "Mob 3"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "leadmobdefense",
    //                 "description": "Lead mob defense",
    //                 "type": 3,
    //                 "required": true,
    //                 "choices": [
    //                     {
    //                         "name": "Mob 1",
    //                         "value": "Mob 1"
    //                     },
    //                     {
    //                         "name": "Mob 2",
    //                         "value": "Mob 2"
    //                     },
    //                     {
    //                         "name": "Mob 3",
    //                         "value": "Mob 3"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "twomobdefense",
    //                 "description": "Two mob defense",
    //                 "type": 3,
    //                 "required": true,
    //                 "choices": [
    //                     {
    //                         "name": "Mob 1",
    //                         "value": "Mob 1"
    //                     },
    //                     {
    //                         "name": "Mob 2",
    //                         "value": "Mob 2"
    //                     },
    //                     {
    //                         "name": "Mob 3",
    //                         "value": "Mob 3"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "threemobdefense",
    //                 "description": "three mob defense",
    //                 "type": 3,
    //                 "required": true,
    //                 "choices": [
    //                     {
    //                         "name": "Mob 1",
    //                         "value": "Mob 1"
    //                     },
    //                     {
    //                         "name": "Mob 2",
    //                         "value": "Mob 2"
    //                     },
    //                     {
    //                         "name": "Mob 3",
    //                         "value": "Mob 3"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "name": "result",
    //                 "description": "Win = true ou Lose = false",
    //                 "type": 5,
    //                 "required": true
    //             },
    //             // {
    //             //     "name": "animal2",
    //             //     "description": "The type of animal",
    //             //     "type": 3,
    //             //     "required": true,
    //             //     "choices": [
    //             //         {
    //             //             "name": "alex",
    //             //             "value": "animal_dog"
    //             //         },
    //             //         {
    //             //             "name": "alex2",
    //             //             "value": "animal_cat"
    //             //         },
    //             //         {
    //             //             "name": "alex3",
    //             //             "value": "animal_penguin"
    //             //         }
    //             //     ]
    //             // },
    //         ]      
    //     },
    // })
    // client.ws.on('INTERACTION_CREATE', async interaction => {
    //     console.log('interaction',  interaction);
    //     const command = interaction.data.name.toLowerCase();
    //     const args = interaction.data.options;
    //     console.log('command', command);
    //     console.log("args", args);
    //     if (command === 'off'){ 
    //         client.api.interactions(interaction.id, interaction.token).callback.post({
    //             data: {
    //                 type: 4,
    //                 data: {
    //                     content: `réponse command off ok. Détail : ${args[0].name} ${args[0].value} - ${args[1].name} ${args[1].value} - ${args[2].name} ${args[2].value} - ${args[3].name} ${args[3].value} - ${args[4].name} ${args[4].value} - ${args[5].name} ${args[5].value} - ${args[6].name} ${args[6].value} - !`
    //                 }
    //             }
    //         })   
            
    //     }
    // });
    // client.api.applications(client.user.id).guilds('831580265741680670').commands("857391382461153301").delete();
    // client.api.applications(client.user.id).guilds('831580265741680670').commands("857411029420212229").delete();
    // client.api.applications(client.user.id).guilds('831580265741680670').commands("857557305248055296").delete();
    // client.api.applications(client.user.id).guilds('831580265741680670').commands("857557601860190218").delete();
    // client.api.applications(client.user.id).guilds('831580265741680670').commands("857592335189803008").delete();
    // var commandConsole = await client.api.applications(client.user.id).commands.get();

    // console.log('Liste commande', commandConsole);
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
    "upoffense" : cmdUpOffense,
    "listoffense"  : cmdListOffense,
    "listoffenseplayer" : cmdListOffensePlayer,
    }
    return COMMANDS[cmd] ? COMMANDS[cmd] : () => {};
}

//Export du client Discord
module.exports = client;