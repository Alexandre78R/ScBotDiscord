//Import des param�tres de connexion
const consoleLog = require('../function/consoleLog');
const configKnex = require('../knexfile')

const knex = require('knex')(configKnex.development);

//Import team query
const sqlTeam = require('./team.js')

//Import sqlUser query
const sqlUser = require('./user.js');

const sqlMonster = require('./monster.js');
const { translateMonsterNames } = require('../function/name_translation');

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

function offenseUsedList (defense) {
    return knex.from('battle').where({ defense_id: defense }).distinct().pluck('offense_id').then(offenses => {
        return offenses;
    });
}

function findOffenseUsedList (offense) {
    return knex.from('battle').where({ offense_id: offense }).then(offenses => {
        return offenses;
    });
}

function findDefenseUsedList (defense) {
    return knex.from('battle').where({ defense_id: defense }).then(defenses => {
        return defenses;
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

function listOffenseByUser(userId, currentDate, oneMonthBefore) {
    //select offense_id, count(offense_id) as offense_idFrequency from battle where created_at BETWEEN "2021-04-30 00:00:00" AND "2021-04-30 23-00-00" && user_id=1 group by offense_id order by offense_idFrequency desc;
    return knex.select('offense_id').count(`offense_id`, { as: "offense_idFrequency" }).from('battle').whereBetween('created_at', [oneMonthBefore, currentDate]).where({ user_id: userId }).groupBy('offense_id').orderBy('offense_idFrequency', 'desc').then(offense => {
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

function listBattleByUserMystats (userId, currentDate, OneMonthBefore){
    return knex.from('battle').where({ user_id: userId }).whereBetween('created_at', [OneMonthBefore, currentDate]).then(results => {
        let winCount = 0;
        let loseCount = 0;
        results.forEach(function (result, index) {
            (result.result == 0) ? loseCount += 1 : winCount += 1;
        });
        return [winCount, loseCount];
    });
}

function listOffenseAdmin (dateStart, dateEnd){
    return knex.select('user_id').count(`user_id`, { as: "nomber_offense" }).from('battle').whereBetween('created_at', [dateStart, dateEnd]).groupBy('user_id').orderBy('nomber_offense', 'desc').then(results => {
        console.log("Results", results);
        return results;
    });
}

function listOffensePlayerAdmin (userId, currentDate, OneDayBefore) {
    console.log('listLastBattles function --> ', userId, currentDate, OneDayBefore)
    // select * from battle where created_at between "2021-05-07 00:00:00" and "2021-05-08 00:00:00" && user_id="1" order by created_at;
    return knex.from('battle').whereBetween('created_at', [OneDayBefore, currentDate]).where({ user_id : userId}).orderBy('created_at').then(battles => {
        // console.log("battles", battles)
        return battles;
    })
}

function listLastBattles (userId, currentDate, OneDayBefore) {
    console.log('listLastBattles function --> ', userId, currentDate, OneDayBefore)
    // select * from battle where created_at between "2021-05-07 00:00:00" and "2021-05-08 00:00:00" && user_id="1" order by created_at desc;
    return knex.from('battle').whereBetween('created_at', [OneDayBefore, currentDate]).where({ user_id : userId}).orderBy('created_at', "desc").then(battles => {
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

    var listDeffenseFrequencyByUser = await listBattleDeffenseFrequencyByUser(userId, 3);

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

    console.log('currentDate', currentDate);
    console.log('OneMonthBefore', OneMonthBefore);
    
    //Number d'offense
    var listByUser = await listBattleByUserMystats(userId, currentDate, OneMonthBefore);
    // console.log('listByUser', listByUser);
    countBattle = listByUser[0]+listByUser[1];
    countWinBattle = listByUser[0];
    countLoseBattle = listByUser[1];

    var listOffenseFrequencyByUser = await listOffenseByUser(userId, currentDate, OneMonthBefore);
    // console.log('listOffenseFrequencyByUser', listOffenseFrequencyByUser);

    for (var o = 0; o < listOffenseFrequencyByUser.length; o++) {

        var teamName = await sqlTeam.getNameTeam(listOffenseFrequencyByUser[o].offense_id);
        var offenseWin = await getOutcomeByTeam(listOffenseFrequencyByUser[o].offense_id, 1, userId);
        var offenseLose = await getOutcomeByTeam(listOffenseFrequencyByUser[o].offense_id, 0, userId);
        tableResultOffense.push({ teamName: teamName, win: offenseWin, lose: offenseLose });

    }

    return [{"total" : countBattle, "win" : countWinBattle, "lose" : countLoseBattle}, tableResultOffense];
}

async function dataTableListOffenseAdmin (dateStart, dateEnd, filterGuild) {

    console.log("dataTableListOffenseAdmin FILTERGuild", filterGuild);
    var tableResultOffense = [];
    var countBattle = 0;
    var countBattleSC1 = 0;
    var countBattleSC2 = 0;
    var countBattleSC3 = 0;
    var countBattleSC4 = 0;

    console.log('dateStart',dateStart);
    console.log("dateEnd", dateEnd);
    var listOffenseFrequencyByUser = await listOffenseAdmin(dateStart, dateEnd);

    for (var o = 0; o < listOffenseFrequencyByUser.length; o++) {

        if (filterGuild == undefined) {
            var user_info = await sqlUser.searchUserNameByID(listOffenseFrequencyByUser[o].user_id);
            console.log('user_info', user_info);
    
            if (user_info[3] == "SC1"){
                countBattle = countBattle + listOffenseFrequencyByUser[o].nomber_offense;
                countBattleSC1 = countBattleSC1 + listOffenseFrequencyByUser[o].nomber_offense;
            } else if (user_info[3] == "SC2") {
                countBattle = countBattle + listOffenseFrequencyByUser[o].nomber_offense;
                countBattleSC2 = countBattleSC2 + listOffenseFrequencyByUser[o].nomber_offense;
            } else if (user_info[3] == "SC3") {
                countBattle = countBattle + listOffenseFrequencyByUser[o].nomber_offense;
                countBattleSC3 = countBattleSC3 + listOffenseFrequencyByUser[o].nomber_offense;
            } else if (user_info[3] == "SC4") {
                countBattle = countBattle + listOffenseFrequencyByUser[o].nomber_offense;
                countBattleSC4 = countBattleSC4 + listOffenseFrequencyByUser[o].nomber_offense;
            } else {
                console.log("Erreur interne");
            }
    
            tableResultOffense.push({ user_id: listOffenseFrequencyByUser[o].user_id, user_idDiscord : user_info[1], user_name : user_info[2],  user_nameGuild : user_info[3], nomber_offense: listOffenseFrequencyByUser[o].nomber_offense });
        } else {

            var user_info = await sqlUser.searchUserNameByID(listOffenseFrequencyByUser[o].user_id);
            console.log('user_info', user_info);
    
            if (user_info[3].toLowerCase() === filterGuild.toLowerCase().trim()){
                countBattle = countBattle + listOffenseFrequencyByUser[o].nomber_offense;
                if (filterGuild.toLowerCase() == 'sc1') {
                    countBattleSC1 = countBattleSC1 + listOffenseFrequencyByUser[o].nomber_offense;
                } else if (filterGuild.toLowerCase() == 'sc2') {
                    countBattleSC2 = countBattleSC2 + listOffenseFrequencyByUser[o].nomber_offense;
                } else if (filterGuild.toLowerCase() == 'sc3') {
                    countBattleSC3 = countBattleSC3 + listOffenseFrequencyByUser[o].nomber_offense;
                } else if (filterGuild.toLowerCase() == 'sc4') {
                    countBattleSC4 = countBattleSC4 + listOffenseFrequencyByUser[o].nomber_offense;
                } else {
                    console.log('Erreur interne');
                }
                tableResultOffense.push({ user_id: listOffenseFrequencyByUser[o].user_id, user_idDiscord : user_info[1], user_name : user_info[2],  user_nameGuild : user_info[3], nomber_offense: listOffenseFrequencyByUser[o].nomber_offense });
            } else {
                console.log("Erreur interne");
            }
        }
    }

    // console.log('tableResultOffense', {"total" : countBattle, "totalSC1" : countBattleSC1, "totalSC2" : countBattleSC2, "totalSC3" : countBattleSC3, "totalSC4" : countBattleSC4}, tableResultOffense);
    return [{"total" : countBattle, "totalSC1" : countBattleSC1, "totalSC2" : countBattleSC2, "totalSC3" : countBattleSC3, "totalSC4" : countBattleSC4}, tableResultOffense];
}

async function dataTableListOffensePlayerAdmin (userId, dateStart, dateEnd) {
    var tableResultOffense = [];
    var countBattle = 0;
    console.log('dateStart',dateStart);
    console.log("dateEnd", dateEnd);
    var listOffenselayer = await listOffensePlayerAdmin(userId, dateEnd, dateStart);

    // console.log("listOffenselayer", listOffenselayer);
    for (var o = 0; o < listOffenselayer.length; o++) {
        // console.log('listOffenselayer[0]', listOffenselayer[0]);
        var teamNameOffense = await sqlTeam.getNameTeam(listOffenselayer[o].offense_id);
        var teamNameDefense = await sqlTeam.getNameTeam(listOffenselayer[o].defense_id);
        var resultBattle = await listOffenselayer[o].result == '1' ? "W" : "L";
        tableResultOffense.push({id : listOffenselayer[o].id, result : resultBattle, offense : teamNameOffense, defense : teamNameDefense, created_at : listOffenselayer[o].created_at});
        countBattle++;
    }

    // console.log('tableResultOffense', {"total" : countBattle}, tableResultOffense);
    return [{"total" : countBattle}, tableResultOffense];
}

async function dataTableLastoffense(userId) {

    var currentDate = new Date();

    var OneDayBefore = new Date();
    OneDayBefore.setHours(OneDayBefore.getHours() - 36);

    var listBattle = await listLastBattles(userId, currentDate, OneDayBefore);

    var newTabBattle = [];

    for (let i = 0; i < listBattle.length; i++) {
        var teamNameOffense = await sqlTeam.getNameTeam(listBattle[i].offense_id);
        var teamNameDefense = await sqlTeam.getNameTeam(listBattle[i].defense_id);
        newTabBattle.push({"id" : listBattle[i].id, "result" : listBattle[i].result == 1 ? "W" : "L" , "offenseName" : teamNameOffense, "defenseName" : teamNameDefense});
    }

    return [newTabBattle];
}

async function datatableDefense (defense) {

    const offenses = await offenseUsedList(defense);
    var tableResult = [];
    for (let index = 0; index < offenses.length; index++) {
        var result = await populateOffenseWinRate(offenses[index], defense);
        var teamName = await sqlTeam.getNameTeam(offenses[index]);
        tableResult.push([teamName, result[1], result[0]]);
        
    }

    return tableResult;
}

async function datatableFindOffense (list) {
    
    var tableResult = [];

    // console.log('List dans datatableFindOffense', list);

    for (let i = 0; i < list.length; i++) {

        var listBattle = await findOffenseUsedList(list[i].id);
        var nameMonsterLead = await sqlMonster.getNameMonster(list[i].id_monster_lead);
        var nameMonster2 = await sqlMonster.getNameMonster(list[i].id_monster_2);
        var nameMonster3 = await sqlMonster.getNameMonster(list[i].id_monster_3);
        var allNameTeam =  `${nameMonsterLead} ${nameMonster2} ${nameMonster3}`;

        var newObjectList = {};
    
        for (let n = 0; n < listBattle.length; n++) {

            var nameOffense = await sqlTeam.getNameTeam(listBattle[n].offense_id);
            var nameDefense = await sqlTeam.getNameTeam(listBattle[n].defense_id);
            var infoUser = await sqlUser.searchUserNameByID(listBattle[n].user_id);

            if (!newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id]) {

                newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id] = {
                    id_offense:  listBattle[n].offense_id,
                    id_defense: listBattle[n].defense_id,
                    name_offense:  nameOffense,
                    name_defense: nameDefense,
                    listUser : {
                        [infoUser[0]] : {
                            info_user: infoUser,
                            win : listBattle[n].result == 1 ? 1 : 0,
                            lose : listBattle[n].result == 0 ? 1 : 0,
                            winrate : listBattle[n].result == 1 ? 100 : 0
                        }
                    }
                }

            } else {

                if (!newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]]) {

                    newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]] = {  
                            info_user: infoUser,
                            win : listBattle[n].result == 1 ? 1 : 0,
                            lose : listBattle[n].result == 0 ? 1 : 0,
                            winrate : listBattle[n].result == 1 ? 100 : 0
                    }

                } else {

                    var addWin = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].win++;
                    var addLose = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].lose++;
                    var viewWin = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].win;
                    var viewLose = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].lose;
                    listBattle[n].result == 1 ? addWin : addLose;
                    newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].winrate = Math.round( viewWin * 100 / (viewWin + viewLose) * 10 ) / 10;
                
                }
            }
        }

        tableResult.push({
            id_team : list[i].id,
            id_monster_lead_team : list[i].id_monster_lead,
            id_monster_2_team : list[i].id_monster_2,
            id_monster_3_team : list[i].id_monster_3,
            name_monster_team : allNameTeam,
            listBattle : newObjectList
        });
    }

    return tableResult;

}

async function datatableFindDefense (list) {

    var tableResult = [];

    // console.log('List dans datatableFindOffense', list);

    for (let i = 0; i < list.length; i++) {

        var listBattle = await findDefenseUsedList(list[i].id);
        var nameMonsterLead = await sqlMonster.getNameMonster(list[i].id_monster_lead);
        var nameMonster2 = await sqlMonster.getNameMonster(list[i].id_monster_2);
        var nameMonster3 = await sqlMonster.getNameMonster(list[i].id_monster_3);
        var allNameTeam =  `${nameMonsterLead} ${nameMonster2} ${nameMonster3}`;

        var newObjectList = {};
    
        for (let n = 0; n < listBattle.length; n++) {

            var nameOffense = await sqlTeam.getNameTeam(listBattle[n].offense_id);
            var nameDefense = await sqlTeam.getNameTeam(listBattle[n].defense_id);
            var infoUser = await sqlUser.searchUserNameByID(listBattle[n].user_id);

            if (!newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id]) {

                newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id] = {
                    id_offense:  listBattle[n].offense_id,
                    id_defense: listBattle[n].defense_id,
                    name_offense:  nameOffense,
                    name_defense: nameDefense,
                    listUser : {
                        [infoUser[0]] : {
                            info_user: infoUser,
                            win : listBattle[n].result == 1 ? 1 : 0,
                            lose : listBattle[n].result == 0 ? 1 : 0,
                            winrate : listBattle[n].result == 1 ? 100 : 0
                        }
                    }
                }

            } else {
                if (!newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]]) {

                    newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]] = {  
                            info_user: infoUser,
                            win : listBattle[n].result == 1 ? 1 : 0,
                            lose : listBattle[n].result == 0 ? 1 : 0,
                            winrate : listBattle[n].result == 1 ? 100 : 0
                    }

                } else {

                    var addWin = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].win++;
                    var addLose = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].lose++;
                    var viewWin = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].win;
                    var viewLose = newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].lose;
                    listBattle[n].result == 1 ? addWin : addLose;
                    newObjectList[listBattle[n].offense_id+'_'+listBattle[n].defense_id].listUser[infoUser[0]].winrate = Math.round( viewWin * 100 / (viewWin + viewLose) * 10 ) / 10;
                
                }
            }
        }

        tableResult.push({
            id_team : list[i].id,
            id_monster_lead_team : list[i].id_monster_lead,
            id_monster_2_team : list[i].id_monster_2,
            id_monster_3_team : list[i].id_monster_3,
            name_monster_team : allNameTeam,
            listBattle : newObjectList
        });
    }

    return tableResult;
}


module.exports.delBattles = delBattles;
module.exports.dataTableLastoffense = dataTableLastoffense;
module.exports.dataTableByUserMyStats = dataTableByUserMyStats;
module.exports.dataTableListOffenseAdmin = dataTableListOffenseAdmin;
module.exports.dataTableListOffensePlayerAdmin = dataTableListOffensePlayerAdmin;
module.exports.dataTableByUser = dataTableByUser;
module.exports.sendBattleData = sendBattleData;
module.exports.upBattleData = upBattleData;
module.exports.datatableDefense = datatableDefense;
module.exports.datatableFindOffense = datatableFindOffense;
module.exports.datatableFindDefense = datatableFindDefense;