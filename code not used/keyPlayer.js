var tableauResultat = require('./data/tableauResultat.json')

var data = [];

for (var propriete in tableauResultat.Joueurs) {
  var resultat = tableauResultat.Joueurs[propriete];
  tab = []
  tab["Player"] = propriete
for(var proprieteResultat in resultat){
  tab[proprieteResultat] = resultat[proprieteResultat]
}
data.push(tab)
}

console.log("Data", data)

// console.log("Data", data)

var Player = "Alexandre78R";

var tabPlayer = []

for (let i = 0; i < data.length; i++) {
    // console.log('data Player', data[i].Player)
    if(data[i].Player == Player){
        console.log("Les infos du joueur ")
        var dataPlayer = {
          Player: data[i].Player,
          attack_win: data[i].attack_win,
          attack_lose: data[i].attack_lose,
          defense_win: data[i].defense_win,
          defense_lose: data[i].defense_lose,
          contribution: data[i].contribution
        }
        tabPlayer.push(dataPlayer)
    }else{
      // console.log("La conrespondance n'a pas trovuer")
    }
}

if (tabPlayer.length == 0){
  console.log("Le joueur n'a pas était trouver !")
}else if (tabPlayer.length >=2) {
  console.log('Tableau +1')
}else{
  console.log('DATA joueur', tabPlayer)
  console.log('data joueur cible', dataPlayer.Player)
  console.log('length tabplayer', tabPlayer.length)
}