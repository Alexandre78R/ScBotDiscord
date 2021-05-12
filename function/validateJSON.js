//Vérification du format du fichier 
function validateJSON(body) {
    try {
      var data = JSON.parse(body);
      return data;
    } catch(e) {
      return null;
    }
}

//Module export
module.exports = validateJSON;