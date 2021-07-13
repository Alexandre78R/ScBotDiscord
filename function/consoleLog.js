//Console Log pour relier tous les informations log puis les redigers ailleurs ..
function consoleLog(desc,data,dataUser) {

    if (data == undefined) {

        return console.log(desc);

    } else if (dataUser == undefined){

        return console.log(desc, data);

    } else {

        return console.log(desc, data, dataUser);

    }

}

//Module export
module.exports = consoleLog;
