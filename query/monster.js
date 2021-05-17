//Import des paramètres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile');

//Import team query
const sqlTeam = require("./team.js");

//Import monster name translation
const translator = require("../function/name_translation.js");

const knex = require('knex')(configKnex.development);

//Création de liste des monstres qui ne sont pas dans la base de données
function checkNameValidity(monsterListUntreated) {
    
    //On s'assure que les monstres ont bien une lettre majuscule au début
    var monsterListUntranslated = [];
    var monsterList = [];
    for (var x = 0; x < monsterListUntreated.length; x++) {
        monsterListUntranslated.push(monsterListUntreated[x].charAt(0).toUpperCase() + monsterListUntreated[x].slice(1).toLowerCase());
    }
    monsterList = translator.translateMonsterNames(monsterListUntranslated);
    if (monsterList.length == 3) {
        return knex.from('monster').select('nameMonster', 'id').then(rows => {
            var monsterIdList = [];
            var monsterNameList = [];
            var invalidResult = false;
            var invalidResultMobBlackListCollab = false;
            var invalidResultHomunculus = false;
            var listDB = rows.map(row => [row.id, row.nameMonster]);
            monsterList.forEach(function (monster, index) {
                console.log('monster', monster);
                if (monster == "MobBlackListCollab") {
                    invalidResultMobBlackListCollab = true;
                } else if (monster == "Homunculus"){
                    invalidResultHomunculus = true;
                }
                let idMonster = -1;
                let nameMonster = -1;
                listDB.forEach(function (dbEntry, index) {
                    if (dbEntry[1] == monster) {
                        idMonster = dbEntry[0];
                        nameMonster = dbEntry[1];
                    }
                });
                if (idMonster == -1) {
                    invalidResult = true;
                }else if (nameMonster == -1) {
                    invalidResult = true;
                } else if (invalidResult != true) {
                    monsterIdList.push(idMonster);
                    monsterNameList.push(nameMonster);
                }
            });
            if (invalidResultMobBlackListCollab) {
                return {status : false, code : 4};
            } else if (invalidResultHomunculus) {
                return {status : false, code : 5};
            } else if (invalidResult) {
                return {status : false, code : 1};
            } else {
                console.log('Name Monster 3 nom de mob --> : ', monsterNameList);
                return { status : sqlTeam.checkTeamId(monsterIdList), nameMonster : monsterNameList, code : 0};
            }
        });
    } else if (monsterList.length > 3) {
        return knex.from('monster').select('nameMonster', 'id').then(rows => {
            var monsterIdList = [];
            var monsterNameList = [];
            var invalidResult = false;
            var invalidResultMobBlackListCollab = false;
            var invalidResultHomunculus = false;
            var listDB = rows.map(row => [row.id, row.nameMonster]);
            let pointerList = 0;
            monsterList.forEach(function (monster, index) {
                console.log("monsterlist debut", monster);
                if (monster == "MobBlackListCollab") {
                    invalidResultMobBlackListCollab = true;
                } else if (monster == "Homunculus"){
                    invalidResultHomunculus = true;
                }
                let idMonster = -1;
                let nameMonster = -1; 
                if (pointerList <= index) {
                    var listPotentialCandidate = [];
                    listDB.forEach(function (dbEntry, index) {
                        if (dbEntry[1].startsWith(monster)) {
                            listPotentialCandidate.push(dbEntry);
                        }
                    });
                    var maxArg = 0;
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
                    if(idealCandidate == null){
                        idMonster = -1;
                        nameMonster = -1;
                        invalidResult = true;
                    }else{
                        idMonster = idealCandidate[0];
                        nameMonster = idealCandidate[1];
                        pointerList += maxArg;
                    }
                } else {
                    idMonster = -2;
                    nameMonster = -2;
                };
                if (idMonster == -1 || nameMonster == -1 || monsterIdList.length > 3 || monsterIdList.includes(idMonster)) {
                    invalidResult = true;
                } else if (invalidResult != true && idMonster >= 0) {
                    monsterIdList.push(idMonster);
                    monsterNameList.push(nameMonster);
                }
            })
            if (invalidResultMobBlackListCollab) {
                return {status : false, code : 4};
            } else if (invalidResultHomunculus) {
                return {status : false, code : 5};
            } else if (invalidResult) {
                return {status : false, code : 2};
            } else {
                console.log('NameMonster 4 nom de mob --->', monsterNameList);
                return { status : sqlTeam.checkTeamId(monsterIdList), nameMonster : monsterNameList, code : 0};
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