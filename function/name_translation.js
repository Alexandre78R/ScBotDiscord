//Import list monster fr to en
const monsterTranslation = require('../config/fr_en_name_monster.js')

var keyJson = require("./keyJson.js");
function translateMonsterNames(team) {
    var teamTranslated = [];
    var pointerList = 0;
    console.log('team translateMonsterNames', team);
    var listMonster = monsterTranslation.monster;
    var blackList = [];
    // console.log('listMonster', listMonster)
    team.forEach(function (monster, index) {
        console.log("monster", monster)
        console.log('index foreach team', index)
        var test = keyJson(listMonster,"NameMonster")
        var counterPosition = 0;
        let position = team.indexOf(monster)+1;
        for (let i = 0; i < test.length; i++) {
            // console.log('test[i]', test[i].NameMonster)
            if(test[i].NameMonster.startsWith(monster)){
                // console.log('team position dans if', team[position]);
                // console.log('monster', monster)
                // console.log('test[i].NameMonster', test[i].NameMonster)
                var newMonsterName = `${monster} ${team[position]}`;
                if(test[i].NameMonster.startsWith(newMonsterName)){
                    console.log("News mob", newMonsterName)
                    if (monsterTranslation.monster.hasOwnProperty(newMonsterName)) {
                        // console.log("monsterTranslation.monster.hasOwnProperty(monster)", monsterTranslation.monster.hasOwnProperty(newMonsterName));
                        teamTranslated.push(monsterTranslation.monster[newMonsterName]);
                        blackList.push(monster);
                        blackList.push(team[position]);
                        team.splice(0, 1)
                        // console.log('tableau team', team)
                        counterPosition++;
                    } 
                }
            }
        }
        
        if (blackList.indexOf(monster) == -1){
            // console.log('balckListe indexOF if', monster)
            // console.log('blackListe indexOf else', monster)
            if (monsterTranslation.monster.hasOwnProperty(monster)) {
                console.log("monsterTranslation.monster.hasOwnProperty(monster)", monsterTranslation.monster.hasOwnProperty(monster));
                teamTranslated.push(monsterTranslation.monster[monster]);
            } else {
                console.log("monsterTranslation.monster.hasOwnProperty(monster)", monsterTranslation.monster.hasOwnProperty(monster));
                teamTranslated.push(monster);
            }
        }
    });
    console.log('black List avant splice', blackList);
    console.log('teamTranslated', teamTranslated);

    return teamTranslated;
}

module.exports.translateMonsterNames = translateMonsterNames;