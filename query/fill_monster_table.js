//Import des paramètres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

//Import mapping des données de SW
const mapping = require('../mapping')

const knex = require('knex')(configKnex.development);

const monsterNames = JSON.stringify(mapping.monster.names).split(",");
const monsterList = [];
const monsterNewList = [];

//Création de la liste de monstre
monsterNames.forEach(function (name, index) {
    monsterList.push({
        idMonster: parseInt(name.split(':')[0].replace(/"/g, '').replace(/{/g, '')), nameMonster: name.split(':')[1].replace(/"/g, '').replace(/}/g, '')
    });
});

//Création de liste des monstres qui ne sont pas dans la base de données
function populateMonsterList() {
    return knex.from('monster').select('idMonster').pluck('idMonster').then(monster_list => {
        monsterList.forEach(function (monster, index) {
            if (monster_list.includes(monster.idMonster)) {
                return;
            }
            monsterNewList.push(monster);
            console.log(monsterNewList);
            return;
        })
    });
    
}

//Mise à jour de la base de données
async function populateMonsterTable() {
    const result = await populateMonsterList()
    if (monsterNewList.length > 0) {
        knex('monster').insert(monsterNewList).then(() => {
            console.log("La liste des monstres a ete mise a jour. " + monsterNewList.length + " monstres ont ete ajoutes.")
            monsterNewList.forEach(function (monster, index) {
                console.log("Ajout de "+monster.nameMonster)
            })
        })
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                knex.destroy();
            });
    } else {
        knex.from('monster').then(() => console.log("La base de données est deja a jour."))
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                knex.destroy();
            });
    }
}
populateMonsterTable()