//Import des paramètres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

const knex = require('knex')(configKnex.development);

//Envoyer les données du combat vers la BD
function sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId) {
    return knex.insert([{ offense_id: monsterOffenseId, defense_id: monsterDefenseId, result: outComeId, user_id: userId }], ['id']).into('battle').then(function (id) {
        if (id[0] >= 0) {
            return true;
        } else {
            return false;
        }
    });
}

module.exports.sendBattleData = sendBattleData;