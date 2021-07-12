function checkMessageContent (message) {
    
    console.log('Message Content --->', message);

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
                    newTabMessage.push(word.replaceAll('-', '|'));
                    newTabMessage.push('-');
                    tiret++;
                } else if (checkMessageContent[i].substr(0, 1) === "-") {
                    let word = "";
                    word = checkMessageContent[i].substr(1, checkMessageContent[i].length);
                    newTabMessage.push('-');
                    newTabMessage.push(word.replaceAll('-', '|'));
                    tiret++;
                } else {
                    newTabMessage.push(checkMessageContent[i].replaceAll('-', '|'));
                }
            }
        } else {
            newTabMessage.push(checkMessageContent[i].replaceAll('-', '|'));
        }
    }

    var newMessageContent = "";
    for (var n = 0; n < newTabMessage.length; n++) {
        newMessageContent += newTabMessage[n] + " ";
    }
    
    console.log('New Message', newMessageContent);
    console.log('Count tiret ', tiret);
    return { "tiret" : tiret, "message" : newMessageContent};
}

//Module export
module.exports = checkMessageContent;