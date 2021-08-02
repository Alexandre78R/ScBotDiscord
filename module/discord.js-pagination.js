
//Remastered by Alexandre78R, copy Original Pagination message embed discord js url : https://github.com/saanuregh/discord.js-pagination

//Import TabCacheReactionPagination
var cacheTabReactionPagination = require("../cache/cacheTabReactionPagination.js");

//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import function log
const consoleLog = require("../function/consoleLog.js");

//Import config
const config = require("../config/config.js")

const paginationEmbed = async (msg, pages) => {

	var emojiList = ['⏮', '⏪', '⏩', '⏭'];
	var timeout = 1800000;

	let page = 0;
	let helpCommandUpOffense = new Discord.MessageEmbed()
	.setColor("#FEAC09")
	.setTitle(`Information : Système de pagination`)
	.setDescription(`Le système de pagination s'utilise avec les réactions suivant : ⏮ ⏪ ⏩ ⏭. Information supplémentaire, le système dure environ 30 minutes après ce délai les réactions seront supprimer automatiquement sur ce message et fonctionne avec juste l'utilisateur qui a effectué la commande.`);

	const infoMessage = await msg.channel.send(helpCommandUpOffense); 
	const curPage = await msg.channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));

    cacheTabReactionPagination.push({
        "message" : {
            idMessage : curPage.channel.lastMessageID,
            userInfo : {
                "id" : msg.author.id, 
                "username" : msg.author.username,
                "tagNumber" : msg.author.discriminator,
                "isBot" : msg.author.bot
            }
        }
    });

	for (const emoji of emojiList) await curPage.react(emoji);

    const reactionCollector = curPage.createReactionCollector((reaction, user) => {
        return emojiList.includes(reaction.emoji.name) && !user.bot;
    },
		{ time: timeout}
	);

	reactionCollector.on('collect', reaction => {

		var tabUserId = [];
		var tabUserName = [];
		var tabUserTag = [];

		reaction.users.cache.forEach(userList => { 
			tabUserId.push(userList.id);
			tabUserName.push(userList.username);
			tabUserTag.push(userList.discriminator);
		});

		for (let i = 0; i < cacheTabReactionPagination.length; i++) {
			if (cacheTabReactionPagination[i].message.idMessage == reaction.message.id){
				if (tabUserId.indexOf(cacheTabReactionPagination[i].message.userInfo.id) == -1) {
					const noPermUserPagination = new Discord.MessageEmbed()
					.setColor("#F00E0E")
					.setTitle(`:x: Permission refuser :x:`)
					.setDescription(`:x: ${tabUserName[1]}, vous ne pouvez pas changer la page de ce message étant donné que c'est juste pour la personne concernée. Pour éviter les dérangements !`)
					.setFooter("Erreur : noPermUserPagination");

					var memberMP = -1;
					reaction.message.guild.members.cache.forEach(idUserReact => { 
						if (idUserReact.id == tabUserId[1]) {
							memberMP = idUserReact;
						}
					});
					if (memberMP == -1){
						msg.channel.send(noPermUserPagination);
					}else{
						memberMP.send(noPermUserPagination)
						.then(reponse => {console.log('Réponse mp : Système PaginatioK Ok', reponse)})
						.catch(err => {console.log('Réponse mp : Système Pagination ERR', err) && msg.channel.send(noPermUserPagination);});
					}
				} else {
					switch (reaction.emoji.name) {
						case emojiList[0]:
							page = page > 0 ? 0 : 0;
							break;
						case emojiList[1]:
							page = page > 0 ? --page : 0;
							break;
						case emojiList[2]:
							page = page + 1 < pages.length ? ++page : page;
							break;
						case emojiList[3]:
							page = page < pages.length-1 ? pages.length-1 : page;
							break;
						default:
							break;
					}
					curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
				}
			}
		}

		reaction.users.cache.forEach(listIdUser => {
			if (listIdUser.id == config.discord.id_bot) {
			} else {
				reaction.users.remove(listIdUser);
			}
		});

	});

	reactionCollector.on('end', () => {

		if (!curPage.deleted) {
			curPage.reactions.removeAll();
			var position = -1;
			for (let i = 0; i < cacheTabReactionPagination.length; i++) { 
				if (cacheTabReactionPagination[i].message.idMessage == curPage.id){
					position = i;
				}
			}
			if (position == -1) return console.log('Erreur impossiblde de supprimer le cacheTabReactionPagination.');
			cacheTabReactionPagination.splice(position, 1);
		}

	});

	return infoMessage && curPage;
};

module.exports = paginationEmbed;