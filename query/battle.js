//Import des param�tres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

const knex = require('knex')(configKnex.development);

//Import team query
const sqlTeam = require('./team.js')

//Import format date dateFormatBDD
var dateFormat = require("../function/dateFormat.js")

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
    // console.log('offense', offense, "defense", defense)
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
    console.log('defense', defense)
    return knex.from('battle').where({ defense_id: defense }).distinct().pluck('offense_id').then(offenses => {
        console.log('offenseUserList', offenses)
        return offenses;
    })
}

function listBattleOffenseFrequencyByUser (userId, limit){
    // select offense_id, count(offense_id) as offense_idFrequency from battle where user_id=4 group by offense_id order by offense_idFrequency desc limit 3;
    return knex.select('offense_id').count(`offense_id`, {as : "offense_idFrequency"}).from('battle').where({ user_id : userId}).groupBy('offense_id').orderBy('offense_idFrequency', 'desc').limit(limit).then(offense => {
        return offense;
    })
}

function listBattleDeffenseFrequencyByUser (userId, limit){
    // select defense_id, count(defense_id) as defense_idFrequency from battle where user_id=4 group by defense_id order by defense_idFrequency desc limit 3;
    return knex.select('defense_id').count(`defense_id`, {as : "defense_idFrequency"}).from('battle').where({ user_id : userId}).groupBy('defense_id').orderBy('defense_idFrequency', 'desc').limit(limit).then(defense => {
        return defense;
    })
}

function listOffenseByUser(userId, currentDate, oneMonthBefore, limit) {
    // select offense_id, count(offense_id) as offense_idFrequency from battle where created_at BETWEEN "2021-04-30 00:00:00" AND "2021-04-30 23:00:00" && user_id=1 group by offense_id order by offense_idFrequency desc limit 15;
    //SELECT * FROM battle WHERE created_at BETWEEN "2021-04-30 00:00:00" AND "2021-04-30 23-00-00";
    // return knex.select('offense_id').count(`offense_id`, { as: "offense_idFrequency" }).from('battle').where({ user_id: userId }).groupBy('offense_id').orderBy('offense_idFrequency', 'desc').limit(15).then(offense => {
    //     return offense;
    // })
    // console.log("currentDate listOffenseByUser", currentDate)
    // console.log("oneMonthBefore listOffenseByUser", oneMonthBefore)
    return knex.select('offense_id').count(`offense_id`, { as: "offense_idFrequency" }).from('battle').whereBetween('created_at', [oneMonthBefore, currentDate]).where({ user_id: userId }).groupBy('offense_id').orderBy('offense_idFrequency', 'desc').limit(limit).then(offense => {
        // console.log("offense  knex reponse", offense)
        return offense;
    })
}

function getOutcomeByTeam(teamId, outcome, userId) {
    return knex.from('battle').select('offense_id').count(`offense_id`, { as: "win" }).where({ user_id: userId, result: outcome, offense_id: teamId }).then(offenses => {
        return offenses[0].win;
    });
}

function listBattleByUser (userId){
    return knex.from('battle').where({ user_id: userId }).then(results => {
        // results.forEach(result => {
        //     console.log("result",result.id, result.result, result.offense_id, result.defense_id)
        // })
        return results;
    })
}

async function dataTableByUser (userId){
    var tableResultOffense = []
    var tableResultDefense = []
    var countBattle = 0;

    //Number d'offense d'offense 
    const listByUser = await listBattleByUser(userId, 3)
    countBattle = listByUser.length
    // console.log("countBattle -->", countBattle)

    const listOffenseFrequencyByUser = await listBattleOffenseFrequencyByUser(userId, 3);
    // console.log('listOffenseFrequencyByUser', listOffenseFrequencyByUser)

    for (let o = 0; o < listOffenseFrequencyByUser.length; o++) {
        // console.log('id offense', listOffenseFrequencyByUser[o].offense_id)
        var teamName = await sqlTeam.getNameTeam(listOffenseFrequencyByUser[o].offense_id);
        tableResultOffense.push({teamName : teamName, offense_idFrequency : listOffenseFrequencyByUser[o].offense_idFrequency })
        // console.log('id offense Frequency', listOffenseFrequencyByUser[o].offense_idFrequency)
    }
    // console.log("TableResult", tableResult)
    const listDeffenseFrequencyByUser = await listBattleDeffenseFrequencyByUser(userId);
    // console.log("listDeffenseFrequencyByUser", listDeffenseFrequencyByUser)

    for (let d = 0; d < listDeffenseFrequencyByUser.length; d++) {
        // console.log('id defense', listDeffenseFrequencyByUser[d].defnese_id)
        var teamName = await sqlTeam.getNameTeam(listDeffenseFrequencyByUser[d].defense_id);
        tableResultDefense.push({teamName : teamName, defense_idFrequency : listDeffenseFrequencyByUser[d].defense_idFrequency })
        // console.log('id defense Frequency', listDeffenseFrequencyByUser[d].defense_idFrequency)
    }
    // console.log("Tabbleau global -->", [countBattle, tableResultOffense, tableResultDefense])

    return [countBattle, tableResultOffense, tableResultDefense]
}

async function dataTableByUserMyStats(userId) {

    var tableResultOffense = []
    var countBattle = 0;

    var currentDate = new Date();
    console.log('currentDate', currentDate)

    var OneMonthBefore = new Date();
    OneMonthBefore.setMonth(OneMonthBefore.getMonth() - 1);
    console.log("OneMonthBefore", OneMonthBefore);

    //Number d'offense
    var listByUser = await listBattleByUser(userId);
    countBattle = listByUser.length;
    // console.log("countBattle -->", countBattle)

    var listOffenseFrequencyByUser = await listOffenseByUser(userId, currentDate, OneMonthBefore, 15);
    //console.log('listOffenseFrequencyByUserByOutcome', listOffenseFrequencyByUserByOutcome);

    for (var o = 0; o < listOffenseFrequencyByUser.length; o++) {
        // console.log('id offense', listOffenseFrequencyByUser[o].offense_id)
        var teamName = await sqlTeam.getNameTeam(listOffenseFrequencyByUser[o].offense_id);
        var offenseWin = await getOutcomeByTeam(listOffenseFrequencyByUser[o].offense_id, 1, userId);
        var offenseLose = await getOutcomeByTeam(listOffenseFrequencyByUser[o].offense_id, 0, userId);
        tableResultOffense.push({ teamName: teamName, win: offenseWin, lose: offenseLose })
        // console.log('id offense Frequency', listOffenseFrequencyByUser[o].offense_idFrequency)
    }
    console.log(tableResultOffense)
    return [countBattle, tableResultOffense]
}

async function datatableDefense(defense) {
    const offenses = await offenseUsedList(defense);
    var tableResult = [];
    for (let index = 0; index < offenses.length; index++) {
        var result = await populateOffenseWinRate(offenses[index], defense);
        var teamName = await sqlTeam.getNameTeam(offenses[index]);
        console.log("offenses[index]", offenses[index])
        console.log("Team Name,", teamName)
        tableResult.push([teamName, result[1], result[0]]);
    }

    return tableResult;
}

module.exports.dataTableByUserMyStats = dataTableByUserMyStats;
module.exports.dataTableByUser = dataTableByUser;
module.exports.sendBattleData = sendBattleData;
module.exports.datatableDefense = datatableDefense;