//Import des param�tres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

const knex = require('knex')(configKnex.development);

//Envoyer les donn�es du combat vers la BD
function sendBattleData(monsterOffenseId, monsterDefenseId, outComeId, userId, infoUser) {
    return knex.insert([{ offense_id: monsterOffenseId, defense_id: monsterDefenseId, result: outComeId, user_id: userId }], ['id']).into('battle').then(function (id) {
        if (id[0] >= 0) {
            var newBattle = {
                id : id[0],
                offense_id: monsterOffenseId,
                defense_id: monsterDefenseId,
                result: outComeId,
                user_id: userId
            }
            consoleLog(`Ok : SaveBattle`, newBattle, infoUser)
            return true;
        } else {
            consoleLog(`ERROR : unableToSaveBattle`, NaN, infoUser)
            return false;
        }
    });
}

module.exports.sendBattleData = sendBattleData;