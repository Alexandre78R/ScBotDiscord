const fs = require('fs')

fs.access(`./data/SC1/siege.json`, fs.F_OK, (err) => {
    if(err){
        console.log("Imposible de trouver le fichier")
        return
    }else{
        console.log("Fichier trouver")
    }
})