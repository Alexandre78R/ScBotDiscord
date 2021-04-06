var infoSiege = require("./data/siege.json");

var siegeId = "2021020301000006";

const fs = require('fs');

var tableauResultat = {Guildes : [], Joueurs : {}}

var attack_log = infoSiege.attack_log.log_list;

for (const key in attack_log) {

    var attack_guild_info_list = attack_log[key].guild_info_list;

    for (let i = 0; i < attack_guild_info_list.length; i++) {

        if (attack_guild_info_list[i].match_id == siegeId) {

            var attack_not_use_Calcul = (attack_guild_info_list[i].play_member_count * 10) - attack_guild_info_list[i].attack_count
            
            var guildeInfo = {
                "guild_id": attack_guild_info_list[i].guild_id,
                "guild_name" : attack_guild_info_list[i].guild_name,
                "attack_use" : attack_guild_info_list[i].attack_count,
                "attack_not_use" : attack_not_use_Calcul,
                "number_players" : attack_guild_info_list[i].play_member_count,
                "winrate" : 0,
                "total_attack_win" : 0,
                "total_attack_lose" : 0,
                "total_defense_win" : 0,
                "total_defense_lose" : 0, 
            }
            
            tableauResultat.Guildes.push(guildeInfo)

        }
    }

    var attack_battle_log_list = attack_log[key].battle_log_list;

    var tabGuilde = tableauResultat.Guildes

    for (let i = 0; i < attack_battle_log_list.length; i++) {

        if (attack_battle_log_list[i].match_id == siegeId) {

            var attack_wizard_name = attack_battle_log_list[i].wizard_name;

            if (attack_battle_log_list[i].win_lose == 1) {
                if (!tableauResultat.Joueurs[attack_wizard_name]) {
                    tableauResultat.Joueurs[attack_wizard_name] = {
                        "attack_win" : 1,
                        "attack_lose" : 0,
                        "defense_win" : 0,
                        "defense_lose" : 0,
                        "contribution" : 15,
                    };
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                            tabGuilde[n].total_attack_win++
                        }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                            tabGuilde[n].total_defense_lose++
                        }
                    }  
                } else {
                    tableauResultat.Joueurs[attack_wizard_name].attack_win++;
                    tableauResultat.Joueurs[attack_wizard_name].contribution = tableauResultat.Joueurs[attack_wizard_name].contribution+15;
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                            tabGuilde[n].total_attack_win++
                        }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                            tabGuilde[n].total_defense_lose++
                        }
                    }
                }
            } else if (attack_battle_log_list[i].win_lose == 2) {
                if (!tableauResultat.Joueurs[attack_wizard_name]) {
                    tableauResultat.Joueurs[attack_wizard_name] = {
                        "attack_win" : 0,
                        "attack_lose" : 1,
                        "defense_win" : 0,
                        "defense_lose" : 0,
                        "contribution" : 0,
                    };
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                            tabGuilde[n].total_attack_lose++
                        }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                            tabGuilde[n].total_defense_win++
                        }
                    }
                } else {
                    tableauResultat.Joueurs[attack_wizard_name].attack_lose++;
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == attack_battle_log_list[i].guild_name){
                            tabGuilde[n].total_attack_lose++
                        }else if(tabGuilde[n].guild_name == attack_battle_log_list[i].opp_guild_name){
                            tabGuilde[n].total_defense_win++
                        }
                    }
                }
            }
        }
    }
}

var defense_log = infoSiege.defense_log.log_list;

for (let i = 0; i < defense_log.length; i++) {
    
    var defense_battle_log_list = defense_log[i].battle_log_list;

    for (const key in defense_battle_log_list) {
    
        if (defense_battle_log_list[key].match_id == siegeId) {

            var def_wizard_name = defense_battle_log_list[key].wizard_name;

            if (defense_battle_log_list[key].win_lose == 1) {
                if (!tableauResultat.Joueurs[def_wizard_name]) {
                    tableauResultat.Joueurs[def_wizard_name] = {
                        "attack_win" : 0,
                        "attack_lose" : 0,
                        "defense_win" : 1,
                        "defense_lose" : 0,
                        "contribution" : 5,
                    };
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                            tabGuilde[n].total_defense_win++
                        }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                            tabGuilde[n].total_attack_lose++
                        }
                    }
                } else {
                    tableauResultat.Joueurs[def_wizard_name].defense_win++;
                    tableauResultat.Joueurs[def_wizard_name].contribution =  tableauResultat.Joueurs[def_wizard_name].contribution+5;
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                            tabGuilde[n].total_defense_win++
                        }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                            tabGuilde[n].total_attack_lose++
                        }
                    }
                }
            } else if (defense_battle_log_list[key].win_lose == 2) {
                if (!tableauResultat.Joueurs[def_wizard_name]) {
                    tableauResultat.Joueurs[def_wizard_name] = {
                        "attack_win" : 0,
                        "attack_lose" : 0,
                        "defense_win" : 0,
                        "defense_lose" : 1,
                        "contribution" : 0,
                    };
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                            tabGuilde[n].total_defense_lose++
                        }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                            tabGuilde[n].total_attack_win++
                        }
                    }
                } else {
                    tableauResultat.Joueurs[def_wizard_name].defense_lose++;
                    for (let n = 0; n < tabGuilde.length; n++) {
                        if(tabGuilde[n].guild_name == defense_battle_log_list[key].guild_name){
                            tabGuilde[n].total_defense_lose++
                        }else if(tabGuilde[n].guild_name == defense_battle_log_list[key].opp_guild_name){
                            tabGuilde[n].total_attack_win++
                        }
                    }
                }
            }   
        }
    }
}

var winrate_calcul1 = null;
var winrate_calcul2 =  null;

for (let i = 0; i < tableauResultat.Guildes.length; i++) {

    winrate_calcul1 = tableauResultat.Guildes[i].total_attack_lose / (tableauResultat.Guildes[i].total_attack_win + tableauResultat.Guildes[i].total_attack_lose) * 100
    winrate_calcul2  = 100 - winrate_calcul1
    tableauResultat.Guildes[i].winrate = winrate_calcul2.toFixed(0)+"%";
    
}

fs.writeFile(`./data/tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {

    if(err){
        console.log('Erreur sur le fichier : (tableauResultat.json)',err);
    } else {
        console.log('Enregistrement éffectuée du fichier : (tableauResultat.json)');
    }

});

