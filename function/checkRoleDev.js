//Import de la LIBS discord.js
const Discord = require("discord.js");

//Import de la config
const consoleLog = require('./consoleLog')

//Function check rôle discord
function checkRoleDev (message, roleId, infoUser) {

    var checkRoleDev = false;

    for (const [key, value] of message.guild.members.cache) {
        if (key == infoUser.id) {
            if (value._roles.includes(roleId)) checkRoleDev = !checkRoleDev;
        }
    }

    if (checkRoleDev == false){

        let permissionNotAllowed = new Discord.MessageEmbed()
        .setColor("#F00E0E")
        .setTitle(`:x: Permission refusé :x:`)
        .setDescription(`:x: Vous n'avez pas l'autorisation d'utiliser cette commande !`)
        .setFooter("Erreur : permissionNotAllowed");
        message.channel.send(permissionNotAllowed);
        consoleLog(`ERROR : permissionNotAllowed`, NaN, infoUser);

        return false;
    }else{
        return true;
    }
}

//Module export
module.exports = checkRoleDev;
