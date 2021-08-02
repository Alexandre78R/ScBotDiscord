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
        return knex.from('monster').select('nameMonster', 'id', 'idMonster').then(rows => {
            var monsterIdList = [];
            var monsterNameList = [];
            var invalidResult = false;
            var invalidResultMobBlackListCollab = false;
            var invalidResultHomunculus = false;
            var listDB = rows.map(row => [row.id, row.nameMonster, row.idMonster]);
            monsterList.forEach(function (monster, index) {
                console.log('monster', monster);
                if (monster == "MobBlackListCollab") {
                    invalidResultMobBlackListCollab = true;
                } else if (monster == "Homunculus"){
                    invalidResultHomunculus = true;
                }
                let idMonster = -1;
                let nameMonster = -1;
                let idMappingMonster = -1;
                listDB.forEach(function (dbEntry, index) {
                    // console.log('dbEntry', dbEntry);
                    if (dbEntry[1] == monster) {
                        idMonster = dbEntry[0];
                        nameMonster = dbEntry[1];
                        idMappingMonster = dbEntry[2];
                    }
                });
                if (idMonster == -1) {
                    invalidResult = true;
                }else if (nameMonster == -1) {
                    invalidResult = true;
                }else if (idMappingMonster == -1) {
                    invalidResult = true;
                } else if (invalidResult != true) {
                    console.log('idMappingMonster.length', idMappingMonster.toString().length);
                    //Id 241 = Ken le seul mob avec un id à 3 cas spécial à cause de la collab...
                    if (idMappingMonster.toString().length == 3 && idMappingMonster != 241){
                    }else{
                        monsterIdList.push(idMonster);
                        monsterNameList.push(nameMonster);
                    }
                }
            });
            if (invalidResultMobBlackListCollab) {
                return {status : false, code : 4};
            } else if (invalidResultHomunculus) {
                return {status : false, code : 5};
            } else if (invalidResult) {
                return {status : false, code : 1};
            } else if (monsterIdList.length < 3) {
                return {status : false, code : 6};
            } else {
                console.log('Name Monster 3 nom de mob --> : ', monsterNameList);
                console.log('Id Monster 3 nom de mob --> : ', monsterIdList);
                return { status : sqlTeam.checkTeamId(monsterIdList), nameMonster : monsterNameList, code : 0};
            }
        });
    } else if (monsterList.length > 3) {
        return knex.from('monster').select('nameMonster', 'id', 'idMonster').then(rows => {
            var monsterIdList = [];
            var monsterNameList = [];
            var invalidResult = false;
            var invalidResultMobBlackListCollab = false;
            var invalidResultHomunculus = false;
            var invalidResultNameMobFamily = false;
            var listDB = rows.map(row => [row.id, row.nameMonster, row.idMonster]);
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
                let idMappingMonster = -1;
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
                        idMappingMonster = -1; 
                        invalidResult = true;
                    }else{
                        idMonster = idealCandidate[0];
                        nameMonster = idealCandidate[1];
                        idMappingMonster = idealCandidate[2];
                        pointerList += maxArg;
                    }
                } else {
                    idMonster = -2;
                    nameMonster = -2;
                    idMappingMonster = -2;
                };
                console.log('idMonster', idMonster);
                console.log('nameMonster', nameMonster);
                console.log('idMappingMonster', idMappingMonster);
                if (idMonster == -1 || nameMonster == -1 || idMappingMonster == -1 || monsterIdList.length > 3 || monsterIdList.includes(idMonster)) {
                    invalidResult = true;
                //Id 241 = Ken le seul mob avec un id à 3 cas spécial à cause de la collab...$
                } else if (idMappingMonster.toString().length == 3 && idMappingMonster != 241){
                    invalidResultNameMobFamily = true;
                } else if (invalidResult != true && idMonster >= 0) {
                    monsterIdList.push(idMonster);
                    monsterNameList.push(nameMonster);
                }
            });
            if (invalidResultMobBlackListCollab) {
                return {status : false, code : 4};
            } else if (invalidResultHomunculus) {
                return {status : false, code : 5};
            } else if (invalidResultNameMobFamily) {
                return {status : false, code : 6};
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

function checkNameValiditySearch (monsterListUntreated){

    //On s'assure que les monstres ont bien une lettre majuscule au début
    var monsterListUntranslated = [];
    var monsterList = [];
    for (var x = 0; x < monsterListUntreated.length; x++) {
        monsterListUntranslated.push(monsterListUntreated[x].charAt(0).toUpperCase() + monsterListUntreated[x].slice(1).toLowerCase());
    }
    monsterList = translator.translateMonsterNames(monsterListUntranslated);

    return knex.from('monster').select('nameMonster', 'id', 'idMonster').then(rows => {
        var monsterIdList = [];
        var monsterNameList = [];
        var invalidResult = false;
        var invalidResultMobBlackListCollab = false;
        var invalidResultHomunculus = false;
        var invalidResultNameMobFamily = false;
        var listDB = rows.map(row => [row.id, row.nameMonster, row.idMonster]);
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
            let idMappingMonster = -1;
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
                    idMappingMonster = -1; 
                    invalidResult = true;
                }else{
                    idMonster = idealCandidate[0];
                    nameMonster = idealCandidate[1];
                    idMappingMonster = idealCandidate[2];
                    pointerList += maxArg;
                }
            } else {
                idMonster = -2;
                nameMonster = -2;
                idMappingMonster = -2;
            };
            console.log('idMonster', idMonster);
            console.log('nameMonster', nameMonster);
            console.log('idMappingMonster', idMappingMonster);
            if (idMonster == -1 || nameMonster == -1 || idMappingMonster == -1 || monsterIdList.length > 3 || monsterIdList.includes(idMonster)) {
                invalidResult = true;
            //Id 241 = Ken le seul mob avec un id à 3 cas spécial à cause de la collab...$
            } else if (idMappingMonster.toString().length == 3 && idMappingMonster != 241){
                invalidResultNameMobFamily = true;
            } else if (invalidResult != true && idMonster >= 0) {
                monsterIdList.push(idMonster);
                monsterNameList.push(nameMonster);
            }
        });
        if (invalidResultMobBlackListCollab) {
            return {status : false, code : 4};
        } else if (invalidResultHomunculus) {
            return {status : false, code : 5};
        } else if (invalidResultNameMobFamily) {
            return {status : false, code : 6};
        } else if (invalidResult) {
            return {status : false, code : 2};
        } else {
            console.log('NameMonster 4 nom de mob --->', monsterNameList);
            console.log('NameMonster 4 nom de mob --->', monsterIdList);
            return { status : sqlTeam.listTeamIdSearch(monsterIdList), nameMonster : monsterNameList, code : 0};
        }
    });
}

module.exports.checkNameValidity = checkNameValidity;
module.exports.checkNameValiditySearch = checkNameValiditySearch;
module.exports.getNameMonster = getNameMonster;