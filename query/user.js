//Import des param�tres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

//Import config bot
const config = require('../config/config.js')

const knex = require('knex')(configKnex.development);

//Requete ID team et/ou cr�ation
function checkUserId(message, infoUser) {
    console.log('test');
    console.log(knex.fn.now());
    const userDiscordId = message.author.id;
    const userDiscordName = message.author.username;
    var userGuildTag = ""
    for (const [key, value] of message.guild.members.cache) {
        if (key == userDiscordId) {
            if (value._roles.includes(config.discord.roles_id.SC1)) userGuildTag = 'SC1';
            if (value._roles.includes(config.discord.roles_id.SC2)) userGuildTag = 'SC2';
            if (value._roles.includes(config.discord.roles_id.SC3)) userGuildTag = 'SC3';
            if (value._roles.includes(config.discord.roles_id.SC4)) userGuildTag = 'SC4';
        };
    }
    if (userDiscordId != "" && userDiscordName != "" && userGuildTag != "") {
        return knex.from('user').where({ idNameDiscord: userDiscordId }).select('id', 'nameGuild').then(rows => {
            if (rows.length >= 1) {
                var listDB = rows.map(row => [row.id, row.nameGuild])
                    var ObjetUserWhere = {
                        id : listDB[0][0],
                        idNameDiscord: userDiscordId,
                        nameTagDiscord: userDiscordName,
                        nameGuild: listDB[0][1] 
                    }
                    consoleLog(`OK : alreadyUserBdd`, ObjetUserWhere, infoUser)

                if (listDB[0][1] != userGuildTag) {
                    return knex('user').where({ id: listDB[0, 0] }).update({ nameGuild: listDB[0, 1] }).then(function () {
                        return listDB[0][0];
                    });
                }
                return listDB[0][0];
            } else {
                return knex.insert([{ idNameDiscord: userDiscordId, nameTagDiscord: userDiscordName, nameGuild: userGuildTag }], ['id']).into('user').then(function (id) {
                    var ObjetUserCreate = {
                        id : id[0],
                        idNameDiscord: userDiscordId,
                        nameTagDiscord: userDiscordName,
                        nameGuild: userGuildTag 
                    }
                    consoleLog(`OK : SaveUserBdd`, ObjetUserCreate, infoUser)
                    return id[0];
                });
            }
        });
    } else {
        return false;
    }
}

module.exports.checkUserId = checkUserId;