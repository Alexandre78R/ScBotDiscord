//Import des paramètres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

const knex = require('knex')(configKnex.development);

//Requete ID team et/ou création
function checkTeamId(monsterIdList) {
    return knex.from('team').whereIn(['monster_lead', 'monster_2', 'monster_3'], [monsterIdList, [monsterIdList[0], monsterIdList[2], monsterIdList[1]]]).select('id').pluck('id').then(idList => {
        if (idList.length >= 1) {
            return idList[0];
        } else {
            return knex.insert([{ monster_lead: monsterIdList[0], monster_2: monsterIdList[1], monster_3: monsterIdList[2] }], ['id']).into('team').then(function (id) {
                return id[0];
            });
        }
    });
}

module.exports.checkTeamId = checkTeamId;