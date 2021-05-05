function infoUser (location, message) {

    var user = {
        location : location,
        id : message.author.id,
        username : message.author.username,
        avatar : message.author.avatar,
        tagNumber : message.author.discriminator,
        isBot : message.author.bot
    };

    return user;
}

//Module export
module.exports = infoUser;