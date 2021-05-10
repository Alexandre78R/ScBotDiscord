//Rajoute une key devant une donnée en JSON
function keyJson(tabName,keyNew) {
    try {
        var data = [];
        for (const propriete in tabName) {
            var resultat = tabName[propriete];
            tab = [];
            tab[keyNew] = propriete;
            for (const proprieteResultat in resultat) {
                tab[proprieteResultat] = resultat[proprieteResultat]
            }
            data.push(tab);
        }
        return data;
    } catch(e) {
      return [];
    }
}

//Module export
module.exports = keyJson;