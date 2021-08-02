//Import des param�tres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

const knex = require('knex')(configKnex.development);

//Import monster query
const sqlMonster = require('./monster.js')

//Requete ID team et/ou cr�ation
function checkTeamId(monsterIdList, infoUser) {
    return knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[0], monsterIdList[2], monsterIdList[1]]]).select('id').pluck('id').then(idList => {
        if (idList.length >= 1) {
            var ObjetTeamWhere = {
                id : idList[0],
                monster_lead : monsterIdList[0],
                monster_2 : monsterIdList[1],
                monster_3 : monsterIdList[2],
            }
            consoleLog(`OK : alreadyTeamBdd`, ObjetTeamWhere, infoUser);
            return idList[0];
        } else {
            return knex.insert([{ monster_lead: monsterIdList[0], monster_2: monsterIdList[1], monster_3: monsterIdList[2] }], ['id']).into('team').then(function (id) {
                var ObjetTeamCreate = {
                    id : id[0],
                    monster_lead : monsterIdList[0],
                    monster_2 : monsterIdList[1],
                    monster_3 : monsterIdList[2],
                }
                consoleLog(`OK : SaveTeamBdd`, ObjetTeamCreate, infoUser);
                return id[0];
            });
        }
    });
}

function getAllMonsterId(teamId) {
    return knex.from('team').where({ id: teamId }).select('monster_lead', 'monster_2', 'monster_3').then(rows => {
        return rows[0];
    });
}

async function getNameTeam (teamId) {
    const ids = await getAllMonsterId(teamId);
    var nameTeam = "";
    nameTeam = await sqlMonster.getNameMonster(ids['monster_lead']);
    nameTeam += " " + await sqlMonster.getNameMonster(ids['monster_2']);
    nameTeam += " " + await sqlMonster.getNameMonster(ids['monster_3']);
    return nameTeam;
}

async function listTeamIdSearch (monsterIdList) {

    var tabId = [];

    if (monsterIdList.length == 1) {
        console.log("1 nom");
        let tabListId1 = [];
        await knex.from('team').whereIn(['monster_lead'], [monsterIdList, [monsterIdList[0]]]).then(list => {
            // console.log("List 1", list);
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId1.indexOf(list[i].id) == -1) {
                        tabListId1.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_2'], [monsterIdList, [monsterIdList[0]]]).then(list => {
            // console.log("List 2", list);
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId1.indexOf(list[i].id) == -1) {
                        tabListId1.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_3'], [monsterIdList, [monsterIdList[0]]]).then(list => {
            // console.log("List 3", list);
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId1.indexOf(list[i].id) == -1) {
                        tabListId1.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        return tabId;
    } else if (monsterIdList.length == 2) {
        console.log("2 noms");
        let tabListId2 = [];
        await knex.from('team').whereIn(['monster_lead', 'monster_2'], [monsterIdList, [monsterIdList[0], monsterIdList[1]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId2.indexOf(list[i].id) == -1) {
                        tabListId2.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_2'], [monsterIdList, [monsterIdList[1], monsterIdList[0]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId2.indexOf(list[i].id) == -1) {
                        tabListId2.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_3'], [monsterIdList, [monsterIdList[0], monsterIdList[1]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId2.indexOf(list[i].id) == -1) {
                        tabListId2.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_3'], [monsterIdList, [monsterIdList[1], monsterIdList[0]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId2.indexOf(list[i].id) == -1) {
                        tabListId2.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        return tabId;
    }else if (monsterIdList.length == 3) {
        console.log("3  noms");
        let tabListId3 = [];
        // console.log("Tab id avant ", tabId);
        await knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[0], monsterIdList[1], monsterIdList[2]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId3.indexOf(list[i].id) == -1) {
                        tabListId3.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[0], monsterIdList[2], monsterIdList[1]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId3.indexOf(list[i].id) == -1) {
                        tabListId3.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[1], monsterIdList[0], monsterIdList[2]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId3.indexOf(list[i].id) == -1) {
                        tabListId3.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[1], monsterIdList[2], monsterIdList[0]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId3.indexOf(list[i].id) == -1) {
                        tabListId3.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[2], monsterIdList[0], monsterIdList[1]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId3.indexOf(list[i].id) == -1) {
                        tabListId3.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        await knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[2], monsterIdList[1], monsterIdList[0]]]).then(list => {
            if (list.length >= 1) {
                for (let i = 0; i < list.length; i++) {
                    // console.log("listObject[i]",list[i]);
                    if (tabListId3.indexOf(list[i].id) == -1) {
                        tabListId3.push(list[i].id);
                        tabId.push({ id: list[i].id, id_monster_lead: list[i].monster_lead, id_monster_2: list[i].monster_2, id_monster_3: list[i].monster_3});
                    }   
                }
            }
        });
        // console.log("Tab: Id Après", tabId);
        return tabId;
    } else {
        // console.log("0 nom");
        tabId = [];
        return tabId;
    }
}

module.exports.checkTeamId = checkTeamId;
module.exports.getNameTeam = getNameTeam;
module.exports.listTeamIdSearch = listTeamIdSearch;