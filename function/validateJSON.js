//Vérification du format du fichier 
function validateJSON(body) {
    try {
      var data = JSON.parse(body);
      console.log("Data ok")
      return data;
    } catch(e) {
      console.log("Impossible d'importer se fichier")
      return null;
    }
}

//Module export
module.exports = validateJSON