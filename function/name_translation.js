//Import list monster fr to en
const monsterTranslation = require('../config/fr_en_name_monster.js')

function translateMonsterNames(team) {
    var teamTranslated = []
    team.forEach(function (monster, index) {
        if (monsterTranslation.monster.hasOwnProperty(monster)) {
            teamTranslated.push(monsterTranslation.monster[monster]);
        } else {
            teamTranslated.push(monster);
        }
    })
    return teamTranslated;
}

module.exports.translateMonsterNames = translateMonsterNames;