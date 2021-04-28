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
                return {status : false, code : 1};
            } else {
                return { status : sqlTeam.checkTeamId(monsterIdList), code : 0};
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
                    //Modif d'alex par default null pour la condition 
                    var idealCandidate = null;
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
                    //Correction du bug syntax à +3 argument de nom (A check Tzzat)
                    if(idealCandidate == null){
                        idMonster = -1;
                        invalidResult = true;
                    }else{
                        idMonster = idealCandidate[0];
                        pointerList += maxArg;
                    }
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
                return {status : false, code : 2};
            } else {
                return { status : sqlTeam.checkTeamId(monsterIdList), code : 0};
            }
        });
    } else {
        return {status : false, code : 3};
    }
}

function getNameMonster(monsterId) {
    return knex.from('monster').where({ id: monsterId }).pluck('nameMonster').then(names => {
        return names[0];
    });
}

module.exports.checkNameValidity = checkNameValidity;
module.exports.getNameMonster = getNameMonster;