//Import de la config
const config = require('../config/config.json')

//Module export
module.exports = {
    'test': test,
}

function test (message) {

    //Sécurité pour pas que le bot réagi avec lui-même
    if(message.author.bot) return;

    //Permet d'éviter de répondre aux messages privés
    if(message.channel.type === "dm") return;
   
    //Prise en compte du prefix
    if (message.length == 1){
        if (message[0].charAt(0) == config.prefix) 
            message[0] = message[0].slice(1);

    }

    // var channel = message.guild.channels.cache.get("828988202525130802")
    // var channel = message.guild.channels.cache.get("392029583945367568")
    // var channel = message.guild.channels.cache.get("828988202525130802")
    // console.log('channel --->', channel)
    // console.log("channel messages --->", channel.messages)
    // console.log("channel messages 2 --->", channel.guild.channels)
    // channel.messages.map( x => console.log("x --->", x))


    // async function userMessages(guildID, userID){
    //     client.guilds.cache.get(guildID).channels.cache.forEach(ch => {
    //         if (ch.type === 'text'){
    //             ch.messages.fetch({
    //                 limit: 100
    //             }).then(messages => {
    //                 const msgs = messages.filter(m => m.author.id === userID)
    //                 msgs.forEach(m => {
    //                     console.log(`${m.content} - ${m.channel.name}`)
    //                 })
    //             })
    //         } else {
    //             return;
    //         }
    //     })
    // }
    // console.log("test --->", message.guild.channels.cache.get("828988202525130802"))
    // message.guild.channels.cache.get("828988202525130802").messages.forEach(ch => {
    //     if (ch.type === 'text'){
    //         ch.messages.fetch({
    //             limit: 100
    //         }).then(messages => {
    //             // const msgs = messages.filter(m => m.author.id === userID)
    //             // msgs.forEach(m => {
    //             //     console.log(`${m.content} - ${m.channel.name}`)
    //             // })

    //             console.log('messages --->', messages)
    //         })
    //     } else {
    //         return;
    //     }
    // })

    // var idTableau = []

    // var channel = message.guild.channels.cache.get("828988202525130802")
    // channel.messages.fetch()
    // .then((results) => {
    //     console.log("Info channel", results)
    //     console.log("----------------------")
    //     // for (const test in results) {
    //     //     console.log("result --->", results[test])
    //     // }
    //     // results.fetch().then((resultsData) => {
    //     //     console.log("resultsData", resultsData)
    //     // })
    //     results.forEach ( ch => {
    //         console.log('ForEachCH id --->', ch.id)
    //         console.log("ForEachCH Content --->", ch.content)
    //         console.log("ForEachCH Name --->", ch.author.username)
    //         idTableau.push({id: ch.id, content : ch.content, username : "Alexandre78R"})
    //     })
        
    //     console.log("Tableau Info channel", idTableau.length)
    // })
    // .catch(err => {
    //     console.log("err -->", err)
    // })

    message.channel.messages.fetch()
    .then((results) => {
        console.log("Info channel", results)
        message.channel.bulkDelete("60", true).then(() => {
            message.channel.send(`À ton service! (60) `).then(msg => msg.delete(5000));
    
        })    
    })
    
    // console.log("Command test")
    // message.channel.send('Command test')
    // channel.send('test')
}