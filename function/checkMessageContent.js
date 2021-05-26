function checkMessageContent (message) {
    
    var tiret = 0;

    var newTabMessage = [];

    var checkMessageContent = message;

    for (var i = 0; i < checkMessageContent.length; i++) {
        if (checkMessageContent[i].includes("-")){
            if (checkMessageContent[i].length == 1){
                newTabMessage.push(checkMessageContent[i]);
                tiret++;
            }else{
                if (checkMessageContent[i].substr(checkMessageContent[i].length-1) === "-") {
                    let word = "";
                    word = checkMessageContent[i].substr(0, checkMessageContent[i].length-1);
                    newTabMessage.push(word);
                    newTabMessage.push('-');
                    tiret++;
                } else if (checkMessageContent[i].substr(0, 1) === "-") {
                    let word = "";
                    word = checkMessageContent[i].substr(1, checkMessageContent[i].length);
                    newTabMessage.push('-');
                    newTabMessage.push(word);
                    tiret++;
                } else {
                    newTabMessage.push(checkMessageContent[i].replace('-', '|'));
                }
            }
        } else {
            newTabMessage.push(checkMessageContent[i]);
        }
    }

    var newMessageContent = "";
    for (var n = 0; n < newTabMessage.length; n++) {
        newMessageContent += newTabMessage[n] + " ";
    }
    
    return { "tiret" : tiret, "message" : newMessageContent};
}

//Module export
module.exports = checkMessageContent;