var fs = require("fs")
var http = require('http')
var https = require('https')

var urlJson = "https://cdn.discordapp.com/attachments/807284846346108949/809788264465563658/tableauResultat.json"

// console.log("urlJson.indexOf(('https://'))", urlJson.indexOf(('https://')))

if (urlJson.indexOf(('https://')) !== -1){

    var request = https.get(urlJson, function(response) { 

        if (response.statusCode === 200) {

            var file = fs.createWriteStream("file.json");
            response.pipe(file); 
            console.log("Récupération du fichier éffectué !.")

        }else{

            console.log("Récupération imposible du fichier.")

        }

        request.setTimeout(12000, function () {
            request.abort();
        });

    });

}else{

    var request = http.get(urlJson, function(response) { 

        if (response.statusCode === 200) {

            var file = fs.createWriteStream("file.json");
            response.pipe(file); 
            console.log("Récupération du fichier éffectué !")

        }else{

            console.log("Recupération imposible du fichier.")

        }

        request.setTimeout(12000, function () {
            request.abort();
        });

    });
    
}