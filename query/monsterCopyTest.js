//Import des param�tres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

//Import team query
const sqlTeam = require("./team.js");

const knex = require('knex')(configKnex.development);

//Cr�ation de liste des monstres qui ne sont pas dans la base de donn�es
function checkNameValidity(monsterListUntreated, infoUser) {

    //On s'assure que les monstres ont bien une lettre majuscule au d�but
    var monsterList = [];
    for (var x = 0; x < monsterListUntreated.length; x++) {
        monsterList.push(monsterListUntreated[x].charAt(0).toUpperCase() + monsterListUntreated[x].slice(1));
    }
    // console.log('MonsterList', monsterList)
    if (monsterList.length == 3) {
        return knex.from('monster').select('nameMonster', 'id').then(rows => {
            let monsterIdList = [];
            let invalidResult = false;
            let listDB = rows.map(row => [row.id, row.nameMonster]);
            monsterList.forEach(function (monster, index) {
                // console.log('monsterListForeach', monster, index)
                let idMonster = -1;
                listDB.forEach(function (dbEntry, index) {
                    if (dbEntry[1] == monster) {
                        // console.log('dbEntry', dbEntry)
                        idMonster = dbEntry[0];
                    };
                });
                if (idMonster == -1) {
                    // console.log('if (idMonster == -1)', idMonster)
                    invalidResult = true;
                } else if (invalidResult != true) {
                    // console.log('else if (invalidResult != true)',invalidResult)
                    monsterIdList.push(idMonster);
                }
            })
            if (invalidResult) {
                // console.log('invalidResult 1 --> ', invalidResult)
                return {status : false, code : 1};
            } else {
                return {status : sqlTeam.checkTeamId(monsterIdList, infoUser), code : 0};
            }
        });
    } else if (monsterList.length > 3) {
        return knex.from('monster').select('nameMonster', 'id').then(rows => {
            let monsterIdList = [];
            let invalidResult = false;
            let listDB = rows.map(row => [row.id, row.nameMonster]);
            let pointerList = 0;
            monsterList.forEach(function (monster, index) {
                // console.log('monsterList.forEach', monster, index)
                let idMonster = -1;
                // console.log("PointerList", pointerList)
                // console.log('index de monsterList', index)
                if (pointerList <= index) {
                    console.log("if (pointerList <= index)")
                    var listPotentialCandidate = []
                    listDB.forEach(function (dbEntry, index) {
                        if (dbEntry[1].startsWith(monster)) {
                            console.log('if (dbEntry[1].startsWith(monster))')
                            listPotentialCandidate.push(dbEntry);
                        }
                    });
                    var maxArg = 0;
                    //Modif d'alex par default null pour la condition 
                    var idealCandidate = null;
                    listPotentialCandidate.forEach(function (candidate, index) {
                        console.log("listPotentialCandidate.forEach")
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
                    //On stop la requête.
                    // if (idealCandidate == null) return {status : false, code :2}
                    //Correction du bug syntax à +3 argument de nom (A check Tzzat)
                    if (idealCandidate == null) {
                        // console.log('if (idMonster == -1)', idMonster)
                        invalidResult = true;
                        idMonster = -1;
                        
                        console.log("idMonster idealCandidate", idMonster)
                        console.log('pointerList idealCandidate', pointerList)
            
                    }else{
                        // console.log('invalidResult', invalidResult)
                        // console.log('idMonster', idMonster)
                        idMonster = idealCandidate[0];
                        pointerList += maxArg;
                    }
                } else {
                    console.log('idealCandidate else ', idealCandidate)
                    console.log("IdMonster ----> ", idMonster)
                    idMonster = -2;
                }
                console.log('Avant IF idealCandidate ', idealCandidate)
                console.log('Avant IF invalidResult ', invalidResult)
                console.log('Avant IF monsterIdList.length ', monsterIdList.length)
                console.log('Avant IF monsterIdList.includes(idMonster)', monsterIdList.includes(idMonster))
                console.log("Avant IF idMonster idealCandidate", idMonster)
                console.log('Avant IF pointerList idealCandidate', pointerList)
                    if (idMonster == -1 || monsterIdList.length > 3 || monsterIdList.includes(idMonster)) {
                        console.log("invalidResult Dans if", invalidResult)
                        invalidResult = true;
                    } else if (invalidResult != true && idMonster >= 0) {
                        console.log("invalidResult Dans else if", invalidResult)
                        monsterIdList.push(idMonster);
                    }
                // if (idMonster == -1) {
                //     console.log("invalidResult Dans if (idMonster == -1) ", idMonster)
                //     invalidResult = true;
                // } else if (monsterIdList.length > 3 ) {
                //     console.log("invalidResult Dans else if (monsterIdList.length > 3 )", monsterIdList.lengt)
                //     invalidResult = true;
                // // } else if (monsterIdList.includes(idMonster)) {
                // //     console.log("invalidResult Dans else if (monsterIdList.includes(idMonster))", monsterIdList.includes(idMonster))
                // //     invalidResult = true;
                // } else if (invalidResult != true && idMonster >= 0) {
                //     console.log("invalidResult Dans else if", invalidResult)
                //     monsterIdList.push(idMonster);
                // }
            })
            // console.log("idealCandidate juste avant le dernier if ", idealCandidate)
            if (invalidResult) {
                // console.log('invalidResult 2 -->', invalidResult)
                return {status : false, code : 2};
            } else {
                return {status : sqlTeam.checkTeamId(monsterIdList, infoUser), code : 0};
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