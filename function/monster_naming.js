//Import list monster fr to en
const monsterTranslation = require('../config/fr_en_name_monster.js')

function checkMonsterName(team) {
    team.forEach(function (monster, index) {
        if (monsterTranslation.monster.hasOwnProperty(monster)) {
            console.log("test");
        }
    })
}

module.export = checkMonsterName