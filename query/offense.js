//Import des paramètres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

//Import mapping des données de SW

const knex = require('knex')(configKnex.development);

//Création de liste des monstres qui ne sont pas dans la base de données
function checkNameValidity(offenseMonsters) {
    if (offenseMonsters.length == 3) {
        return knex.from('monster').select('nameMonster', 'id').then(rows => {
            console.log(rows)
            var monsterIdList = [];
            var invalidResult = false;
            var listDBName = rows.pluck('nameMonster');
            var listDBId = rows.pluck('id');
            offenseMonsters.forEach(function (monster, index) {
                if (!listDBName.includes(monster)) {
                    invalidResult = true;
                } else if (invalidResult != true) {
                    console.log(monster);
                    monsterIdList.push(listDBId[listDBName.indexOf(monster)]);
                    console.log(monsterIdList);
                }
            })
            if (invalidResult) {
                return "invalid";
            } else {
                return monsterIdList;
            }
        });
    } else {
        return knex.from('monster').select('idMonster').pluck('idMonster').then(monster_list => {
            monsterList.forEach(function (monster, index) {
                if (monster_list.includes(monster.idMonster)) {
                    return;
                }
                monsterNewList.push(monster);
                return;
            })
        });
    }
}



module.exports.checkNameValidity = checkNameValidity;