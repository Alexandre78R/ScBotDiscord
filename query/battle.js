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
            };
            consoleLog(`Ok : SaveBattle`, newBattle, infoUser);
            return true;
        } else {
            consoleLog(`ERROR : errorToSaveBattle`, NaN, infoUser);
            return false;
        }
    });
}

function upBattleData(monsterOffenseId, monsterDefenseId, outComeId, valueId, infoUser) {
    return knex('battle').where('id', '=', valueId).update({ result : outComeId, offense_id : monsterOffenseId, defense_id: monsterDefenseId}).then(results => {
        // console.log('results', results);
        if (results == 1) {
            return true;
        } else{
            return false;
        }
    });
}

function populateOffenseWinRate(offense, defense) {
    return knex.from('battle').where({ defense_id: defense, offense_id: offense }).pluck('result').then(results => {
        let winCount = 0;
        let loseCount = 0;
        results.forEach(function (result, index) {
            (result == 0) ? loseCount += 1 : winCount += 1;
        });
        return [loseCount, winCount];
    });
}

function offenseUsedList(defense) {
    return knex.from('battle').where({ defense_id: defense }).distinct().pluck('offense_id').then(offenses => {
        return offenses;
    });
}

function listBattleOffenseFrequencyByUser (userId, limit){
    return knex.select('offense_id').count(`offense_id`, {as : "offense_idFrequency"}).from('battle').where({ user_id : userId}).groupBy('offense_id').orderBy('offense_idFrequency', 'desc').limit(limit).then(offense => {
        return offense;
    });
}

function listBattleDeffenseFrequencyByUser (userId, limit){
    return knex.select('defense_id').count(`defense_id`, {as : "defense_idFrequency"}).from('battle').where({ user_id : userId}).groupBy('defense_id').orderBy('defense_idFrequency', 'desc').limit(limit).then(defense => {
        return defense;
    });
}

function listOffenseByUser(userId, currentDate, oneMonthBefore, limit) {
    //select offense_id, count(offense_id) as offense_idFrequency from battle where created_at BETWEEN "2021-04-30 00:00:00" AND "2021-04-30 23-00-00" && user_id=1 group by offense_id order by offense_idFrequency desc limit 15;
    return knex.select('offense_id').count(`offense_id`, { as: "offense_idFrequency" }).from('battle').whereBetween('created_at', [oneMonthBefore, currentDate]).where({ user_id: userId }).groupBy('offense_id').orderBy('offense_idFrequency', 'desc').limit(limit).then(offense => {
        return offense;
    });
}

function getOutcomeByTeam(teamId, outcome, userId) {
    return knex.from('battle').select('offense_id').count(`offense_id`, { as: "win" }).where({ user_id: userId, result: outcome, offense_id: teamId }).then(offenses => {
        return offenses[0].win;
    });
}

function listBattleByUser (userId){
    return knex.from('battle').where({ user_id: userId }).then(results => {
        let winCount = 0;
        let loseCount = 0;
        results.forEach(function (result, index) {
            (result.result == 0) ? loseCount += 1 : winCount += 1;
        });
        return [winCount, loseCount];
    });
}

function listLastBattles (userId, currentDate, OneDayBefore, limit) {
    // select * from battle where created_at between "2021-05-07 00:00:00" and "2021-05-08 00:00:00" && user_id="1" order by created_at desc limit 10;
    return knex.from('battle').whereBetween('created_at', [OneDayBefore, currentDate]).where({ user_id : userId}).orderBy('created_at', "desc").limit(limit).then(battles => {
        // console.log("battles", battles)
        return battles;
    })
}

function delBattles (valueId) {
    // delete from battle where id="100";   
    return knex('battle').del().where({ id : valueId }).then(delBattle => {
        if (delBattle == 0){
            console.log("if delbattle", delBattle);
            return "invalid";
        }else{
            console.log('else delbattle', delBattle);
            return "true";
        }
    })
}

async function dataTableByUser (userId){
    
    var tableResultOffense = [];
    var tableResultDefense = [];
    var countBattle = 0;

    //Number d'offense d'offense 
    var listByUser = await listBattleByUser(userId, 3);
    countBattle = listByUser[0]+listByUser[1];

    var listOffenseFrequencyByUser = await listBattleOffenseFrequencyByUser(userId, 3);

    for (let o = 0; o < listOffenseFrequencyByUser.length; o++) {

        var teamName = await sqlTeam.getNameTeam(listOffenseFrequencyByUser[o].offense_id);
        tableResultOffense.push({teamName : teamName, offense_idFrequency : listOffenseFrequencyByUser[o].offense_idFrequency });

    }

    var  listDeffenseFrequencyByUser = await listBattleDeffenseFrequencyByUser(userId, 3);

    for (var d = 0; d < listDeffenseFrequencyByUser.length; d++) {

        var teamName = await sqlTeam.getNameTeam(listDeffenseFrequencyByUser[d].defense_id);
        tableResultDefense.push({teamName : teamName, defense_idFrequency : listDeffenseFrequencyByUser[d].defense_idFrequency });
    }

    return [countBattle, tableResultOffense, tableResultDefense];
}

async function dataTableByUserMyStats(userId) {

    var tableResultOffense = [];
    var countBattle = 0;
    var countWinBattle = 0;
    var countLoseBattle = 0;

    var currentDate = new Date();

    var OneMonthBefore = new Date();
    OneMonthBefore.setMonth(OneMonthBefore.getMonth() - 1);

    //Number d'offense
    var listByUser = await listBattleByUser(userId);
    countBattle = listByUser[0]+listByUser[1];
    countWinBattle = listByUser[0];
    countLoseBattle = listByUser[1];

    var listOffenseFrequencyByUser = await listOffenseByUser(userId, currentDate, OneMonthBefore, 15);

    for (var o = 0; o < listOffenseFrequencyByUser.length; o++) {

        var teamName = await sqlTeam.getNameTeam(listOffenseFrequencyByUser[o].offense_id);
        var offenseWin = await getOutcomeByTeam(listOffenseFrequencyByUser[o].offense_id, 1, userId);
        var offenseLose = await getOutcomeByTeam(listOffenseFrequencyByUser[o].offense_id, 0, userId);
        tableResultOffense.push({ teamName: teamName, win: offenseWin, lose: offenseLose });

    }

    return [{"total" : countBattle, "win" : countWinBattle, "lose" : countLoseBattle}, tableResultOffense];
}

async function dataTableLastoffense(userId) {

    var currentDate = new Date();

    var OneDayBefore = new Date();
    OneDayBefore.setHours(OneDayBefore.getHours() - 24);

    var listBattle = await listLastBattles(userId, currentDate, OneDayBefore, 10);

    var newTabBattle = [];

    for (let i = 0; i < listBattle.length; i++) {
        var teamNameOffense = await sqlTeam.getNameTeam(listBattle[i].offense_id);
        var teamNameDefense = await sqlTeam.getNameTeam(listBattle[i].defense_id);
        newTabBattle.push({"id" : listBattle[i].id, "result" : listBattle[i].result == 1 ? "W" : "L" , "offenseName" : teamNameOffense, "defenseName" : teamNameDefense});
    }

    return [newTabBattle];
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

module.exports.delBattles = delBattles;
module.exports.dataTableLastoffense = dataTableLastoffense;
module.exports.dataTableByUserMyStats = dataTableByUserMyStats;
module.exports.dataTableByUser = dataTableByUser;
module.exports.sendBattleData = sendBattleData;
module.exports.upBattleData = upBattleData;
module.exports.datatableDefense = datatableDefense;