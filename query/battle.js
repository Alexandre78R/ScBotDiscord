//Import des param�tres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

const knex = require('knex')(configKnex.development);

//Import team query
const sqlTeam = require('./team.js')

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

function populateOffenseWinRate(offense, defense) {
    return knex.from('battle').where({ defense_id: defense, offense_id: offense }).pluck('result').then(results => {
        var winCount = 0;
        var loseCount = 0;
        results.forEach(function (result, index) {
            (result == 0) ? loseCount += 1 : winCount += 1;
        });
        return [loseCount, winCount]
    });
}

function offenseUsedList(defense) {
    return knex.from('battle').where({ defense_id: defense }).distinct().pluck('offense_id').then(offenses => {
        return offenses;
    })
}

async function datatableDefense(defense) {
    const offenses = await offenseUsedList(defense);
    var tableResult = [];
    for (let index = 0; index < offenses.length; index++) {
        var result = await populateOffenseWinRate(offenses[index], defense);
        var teamName = await sqlTeam.getNameTeam(offenses[index]);
        tableResult.push([teamName, result[1], result[0]]);
    }
    return tableResult;
}

module.exports.sendBattleData = sendBattleData;
module.exports.datatableDefense = datatableDefense;