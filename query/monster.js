//Import des paramètres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

//Import team query
const sqlTeam = require("./team.js");

const knex = require('knex')(configKnex.development);

//Création de liste des monstres qui ne sont pas dans la base de données
function checkNameValidity(monsterListUntreated) {

    //On s'assure que les monstres ont bien une lettre majuscule au début
    var monsterList = [];
    for (var x = 0; x < monsterListUntreated.length; x++) {
        monsterList.push(monsterListUntreated[x].charAt(0).toUpperCase() + monsterListUntreated[x].slice(1));
    }
    if (monsterList.length == 3) {
        return knex.from('monster').select('nameMonster', 'id').then(rows => {
            var monsterIdList = [];
            var invalidResult = false;
            var listDB = rows.map(row => [row.id, row.nameMonster]);
            monsterList.forEach(function (monster, index) {
                let idMonster = -1;
                listDB.forEach(function (dbEntry, index) {
                    if (dbEntry[1] == monster) {
                        idMonster = dbEntry[0];
                    };
                });
                if (idMonster == -1) {
                    invalidResult = true;
                } else if (invalidResult != true) {
                    monsterIdList.push(idMonster);
                }
            })
            if (invalidResult) {
                return false;
            } else {
                return sqlTeam.checkTeamId(monsterIdList);
            }
        });
    } else if (monsterList.length > 3) {
        return knex.from('monster').select('nameMonster', 'id').then(rows => {
            var monsterIdList = [];
            var invalidResult = false;
            var listDB = rows.map(row => [row.id, row.nameMonster]);
            let pointerList = 0;
            monsterList.forEach(function (monster, index) {
                let idMonster = -1;
                if (pointerList <= index) {
                    var listPotentialCandidate = []
                    listDB.forEach(function (dbEntry, index) {
                        if (dbEntry[1].startsWith(monster)) {
                            listPotentialCandidate.push(dbEntry);
                        }
                    });
                    var maxArg = 0;
                    var idealCandidate;
                    listPotentialCandidate.forEach(function (candidate, index) {
                        if (candidate[1] == monster) {
                            if (maxArg <= 1) {
                                maxArg = 1;
                                idealCandidate = candidate;
                            }
                        } else {
                            var offset = pointerList + 1;
                            for (; offset < monsterList.length+1; offset++) {
                                if (candidate[1] == monsterList.slice(pointerList, offset).join(' ')) {
                                    if (maxArg <= (offset - pointerList)) {
                                        maxArg = offset - pointerList;
                                        idealCandidate = candidate;
                                    }
                                    break;
                                }
                            }
                        };
                    });
                    idMonster = idealCandidate[0];
                    pointerList += maxArg;
                } else {
                    idMonster = -2;
                };
                if (idMonster == -1 || monsterIdList.length > 3 || monsterIdList.includes(idMonster)) {
                    invalidResult = true;
                } else if (invalidResult != true && idMonster >= 0) {
                    monsterIdList.push(idMonster);
                }
            })
            if (invalidResult) {
                return false;
            } else {
                return sqlTeam.checkTeamId(monsterIdList);
            }
        });
    } else {
        return false;
    }
}


module.exports.checkNameValidity = checkNameValidity;