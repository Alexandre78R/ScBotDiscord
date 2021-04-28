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
            consoleLog(`OK : alreadyTeamBdd`, ObjetTeamWhere, infoUser)
            return idList[0];
        } else {
            return knex.insert([{ monster_lead: monsterIdList[0], monster_2: monsterIdList[1], monster_3: monsterIdList[2] }], ['id']).into('team').then(function (id) {
                var ObjetTeamCreate = {
                    id : id[0],
                    monster_lead : monsterIdList[0],
                    monster_2 : monsterIdList[1],
                    monster_3 : monsterIdList[2],
                }
                consoleLog(`OK : SaveTeamBdd`, ObjetTeamCreate, infoUser)
                return id[0];
            });
        }
    });
}

function getAllMonsterId(teamId) {
    return knex.from('team').where({ id: teamId }).select('monster_lead', 'monster_2', 'monster_3').then(rows => {
        return rows[0]
    });
}

async function getNameTeam(teamId) {
    const ids = await getAllMonsterId(teamId);
    var nameTeam = ""
    nameTeam = await sqlMonster.getNameMonster(ids['monster_lead']);
    nameTeam += " " + await sqlMonster.getNameMonster(ids['monster_2']);
    nameTeam += " " + await sqlMonster.getNameMonster(ids['monster_3']);
    return nameTeam
}

module.exports.checkTeamId = checkTeamId;
module.exports.getNameTeam = getNameTeam;