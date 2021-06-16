//Import de la config
const config = require('../../config/config')

//Import function consoleLog
const consoleLog = require("../../function/consoleLog.js")

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import function checkRolePerm
const checkRoleDev = require('../../function/checkRoleDev.js');

// Import the discord.js-pagination package
const paginationEmbed = require('../../module/discord.js-pagination.js');

//Function checkMaintenance 
const checkMaintenance = require('../../function/checkMaintenance.js');

const userInfo = require('../../function/userinfo.js')

function test (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.discord.prefix) 
            message[0] = message[0].slice(1);

    }

    //Data de l'utilisateur qui a utiliser les commandes 
    var infoUser = userInfo("./commands/test.js", message);

    var statutcommand = checkMaintenance(message, "test", infoUser);
    if(statutcommand == false) return;


    var checkPerm = checkRoleDev(message, config.discord.roles_id.DEV, infoUser);
    if (checkPerm == false) return;
    
    // const exampleEmbed = new Discord.MessageEmbed()
	// .setColor('#0099ff')
	// .setTitle('Some title')
	// .setURL('https://discord.js.org/')
	// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/wSTFkRM.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    // const exampleEmbed2 = new Discord.MessageEmbed()
	// .setColor('#0099ff')
	// .setTitle('Some title2')
	// .setURL('https://discord.js.org/')
	// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/wSTFkRM.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    // const exampleEmbed3 = new Discord.MessageEmbed()
	// .setColor('#0099ff')
	// .setTitle('Some title3')
	// .setURL('https://discord.js.org/')
	// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/wSTFkRM.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    // const exampleEmbed4 = new Discord.MessageEmbed()
	// .setColor('#0099ff')
	// .setTitle('Some title4')
	// .setURL('https://discord.js.org/')
	// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/wSTFkRM.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    // const exampleEmbed5 = new Discord.MessageEmbed()
	// .setColor('#0099ff')
	// .setTitle('Some title5')
	// .setURL('https://discord.js.org/')
	// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/wSTFkRM.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

	// const exampleEmbed6 = new Discord.MessageEmbed()
	// .setColor('#0099ff')
	// .setTitle('Some title5')
	// .setURL('https://discord.js.org/')
	// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/wSTFkRM.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');


    // var pages = [
    //     exampleEmbed,
    //     exampleEmbed2,
    //     exampleEmbed3,
    //     exampleEmbed4,
    //     exampleEmbed5,
	// 	exampleEmbed6,
    // ];

	var data = [
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "zzOffense33454", "defense" : "reffegrDéfense", "result" : "perdu"},
		{"offense" : "rrtOffenseddfddf", "defense" : "rgerggDéfense", "result" : "Victoire"},
		{"offense" : "ttOffensedfsfddfdf", "defense" : "&éé&Défense", "result" : "perdu"},
		{"offense" : "Offensessddsdsvdsvv", "defense" : "xwwxxxDéfense", "result" : "Victoire"},
		{"offense" : "Offensdsfdsffe", "defense" : "xvcvcvDéfense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : " nghbgbfbDéfense", "result" : "Victoire"},
		{"offense" : "gcdsdvdvdv ", "defense" : "qsqsqqDéfense", "result" : "perdu"},
		{"offense" : "Offeezefefzvnse", "defense" : "aadzDéfense", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "n ,hhDéfense", "result" : "perdu"},
		{"offense" : "ghdsdsvdsdfdf", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "ééOfferazense", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "zzzdOffense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "bOffedvdvvsvddvvdnse", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offenddvvdse", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offefefense", "defense" : "eerggzaaeDéfense", "result" : "perdu"},
		{"offense" : "Offefzfezense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offsqcsdeeense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "vf bfvfdsDéfense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "bbvccvcvcvDéfense", "result" : "Victoire"},
		{"offense" : "Offezazegthyyjjynse", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offdsfdsfffdense", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offendeefrhgfdsse", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offengtbtbtrcdese", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "cvsdfssf", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défeqsqqnse", "result" : "perdu"},
		{"offense" : "frrffssfffs", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offenrredeefvrbrvsse", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "zeezeze", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défzezezzeense", "result" : "perdu"},
		{"offense" : "Offenvfvrfrffszase", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "aaaeefvddfef", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "zzdffzfzfz", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "cvsdfssf", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défeqsqqnse", "result" : "perdu"},
		{"offense" : "frrffssfffs", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offenrredeefvrbrvsse", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "zeezeze", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défzezezzeense", "result" : "perdu"},
		{"offense" : "Offenvfvrfrffszase", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "aaaeefvddfef", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "zzdffzfzfz", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "cvsdfssf", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défeqsqqnse", "result" : "perdu"},
		{"offense" : "frrffssfffs", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offenrredeefvrbrvsse", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "zeezeze", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défzezezzeense", "result" : "perdu"},
		{"offense" : "Offenvfvrfrffszase", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "aaaeefvddfef", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "zzdffzfzfz", "defense" : "Défense", "result" : "perdu"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "Victoire"},
		{"offense" : "Offense", "defense" : "Défense", "result" : "perdu"},
		
	];

	var pages = [];
	var tabListTabResult = [];

	var lengthPage = 15;

	for (let i = 0; i < data.length; i++) {
		if (tabListTabResult.length == 0) {
			tabListTabResult.push([]);
			tabListTabResult[tabListTabResult.length-1].push({ name: `Offense:${data[i].offense}\nDéfense:${data[i].defense}`, value: `${data[i].result}`, inline: true });
		} else {
			if (tabListTabResult[tabListTabResult.length-1].length < lengthPage){
				tabListTabResult[tabListTabResult.length-1].push({ name: `Offense:${data[i].offense}\nDéfense:${data[i].defense}`, value: `${data[i].result}`, inline: true });
			} else {
				tabListTabResult.push([]);
				tabListTabResult[tabListTabResult.length-1].push({ name: `Offense:${data[i].offense}\nDéfense:${data[i].defense}`, value: `${data[i].result}`, inline: true });
			}
		}
	}

	for (let i = 0; i < tabListTabResult.length; i++) {
		console.log("tabListTabResult[i].length", tabListTabResult[i].length);
		var exampleEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`title${[i]}`)
		.setDescription(`description${[i]}`)
		.addFields(tabListTabResult[i])
		pages.push(exampleEmbed);
	}

	console.log("Longeur Tab Data", data.length);

    paginationEmbed(message, pages);
}

//Module export
module.exports = test;