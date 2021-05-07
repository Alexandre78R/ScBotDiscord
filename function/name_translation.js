//Import list monster fr to en
const monsterTranslation = require('../config/fr_en_name_monster.js')

var keyJson = require("./keyJson.js");
function translateMonsterNames(team) {
    var teamTranslated = [];
    var listMonster = monsterTranslation.monster;
    var blackList = [];
    team.forEach(function (monster, index) {
        var test = keyJson(listMonster,"NameMonster")
        let position = index+1;
        for (let i = 0; i < test.length; i++) {
            if(test[i].NameMonster.startsWith(monster)){
                var newMonsterName = `${monster} ${team[position]}`;
                if(test[i].NameMonster.startsWith(newMonsterName)){
                    if (monsterTranslation.monster.hasOwnProperty(newMonsterName)) {
                        teamTranslated.push(monsterTranslation.monster[newMonsterName]);
                        blackList.push(monster);
                        blackList.push(team[position]);
                        team.splice(0, 1);
                    } 
                }
            }
        }
        
        if (blackList.indexOf(monster) == -1){
            if (monsterTranslation.monster.hasOwnProperty(monster)) {
                teamTranslated.push(monsterTranslation.monster[monster]);
            } else {
                teamTranslated.push(monster);
            }
        }
    });
    console.log('black List avant splice', blackList);
    console.log('teamTranslated', teamTranslated);

    return teamTranslated;
}

module.exports.translateMonsterNames = translateMonsterNames;