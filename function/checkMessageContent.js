function checkMessageContent (message) {
    
    var tiret = 0;

    var newTabMessage = [];

    var checkMessageContent = message;
    // console.log('checkMessageContent', checkMessageContent);

    for (let i = 0; i < checkMessageContent.length; i++) {
        if (checkMessageContent[i].includes("-")){
            if (checkMessageContent[i].length == 1){
                newTabMessage.push(checkMessageContent[i]);
                tiret++;
            }else{
                newTabMessage.push(checkMessageContent[i].replace('-', '|'));
            }
        } else {
            newTabMessage.push(checkMessageContent[i]);
        }
    }

    // console.log('newTabMessage', newTabMessage);

    var newMessageContent = "";
    for (let n = 0; n < newTabMessage.length; n++) {
        newMessageContent += newTabMessage[n] + " ";
    }

    // console.log("newMessageContent", newMessageContent);

    return { "tiret" : tiret, "message" : newMessageContent};
}

//Module export
module.exports = checkMessageContent;