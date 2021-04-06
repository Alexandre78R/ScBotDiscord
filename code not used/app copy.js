var infoSiege = require("./SiegeMatch-2020120103000012.json");

var siegeId = "2020120103000012";

var nameGuild = "Sacré Cœur";

const fs = require('fs');

var tableauResultat = {Guildes : [], Information_Siege : {}, Joueurs : []}

var attack_log = infoSiege.attack_log.log_list;

for (const key in attack_log) {

    var attack_guild_info_list = attack_log[key].guild_info_list;

    for (let i = 0; i < attack_guild_info_list.length; i++) {

        if (attack_guild_info_list[i].match_id == siegeId) {

            var attaque_non_utiliser_Calcul = (attack_guild_info_list[i].play_member_count * 10) - attack_guild_info_list[i].attack_count
            
            var guildeInfo = {
                "nom_Guilde" : attack_guild_info_list[i].guild_name,
                "attaque_utiliser" : attack_guild_info_list[i].attack_count,
                "attaque_non_utiliser" : attaque_non_utiliser_Calcul,
                "nombre_Joueur" : attack_guild_info_list[i].play_member_count,
            }

            tableauResultat["Guildes"].push(guildeInfo)
            
            if (attack_guild_info_list[i].guild_name == nameGuild) {
                tableauResultat["Information_Siege"] = {
                    "winrate" : 0,
                    "total_attack_win" : 0,
                    "total_attack_lose" : 0,
                    "total_attack_equality" : 0,
                    "total_defense_win" : 0,
                    "total_defense_lose" : 0,  
                    "total_defense_equality" : 0,
                }
            } 
        }
    }

    var attack_battle_log_list = attack_log[key].battle_log_list;

    // console.log("Joueur test ",  tableauResultat.Joueurs)

    console.log('attack_battle_log_list', attack_battle_log_list)
    for (let i = 0; i < attack_battle_log_list.length; i++) {

        if (attack_battle_log_list[i].match_id == siegeId) {

            var attack_wizard_name = attack_battle_log_list[i].wizard_name;

            var wizardName = {
                "Player" : attack_wizard_name,
            }

            tableauResultat["Joueurs"].push(wizardName)

            // console.log("Joueur test ",  tableauResultat.Joueurs)
            // for (let n = 0; n < tableauResultat.Joueurs.length; n++) {
                // console.log("test", tableauResultat.Joueurs[n].Player)
                // if (){

                // }
            // }
            // console.log('attack_wizard_name', attack_wizard_name)

            // if(attack_battle_log_list[i].wizard_name){

            // }

        //     if (attack_battle_log_list[i].win_lose == 1) {
        //         if (!tableauResultat.Joueurs[attack_wizard_name]) {
        //             tableauResultat.Joueurs[attack_wizard_name] = {
        //                 "attack_win" : 1,
        //                 "attack_equality": 0,
        //                 "attack_lose" : 0,
        //                 "defense_win" : 0,
        //                 "defense_equality" : 0,
        //                 "defense_lose" : 0,
        //             };
        //         } else {
        //             tableauResultat.Joueurs[attack_wizard_name].attack_win++;
        //             tableauResultat.Information_Siege.total_attack_win++;
        //         }
        //     } else if (attack_battle_log_list[i].win_lose == 2) {
        //         if (!tableauResultat.Joueurs[attack_wizard_name]) {
        //             tableauResultat.Joueurs[attack_wizard_name] = {
        //                 "attack_win" : 0,
        //                 "attack_equality": 0,
        //                 "attack_lose" : 1,
        //                 "defense_win" : 0,
        //                 "defense_equality" : 0,
        //                 "defense_lose" : 0,
        //             };
        //         } else {
        //             tableauResultat.Joueurs[attack_wizard_name].attack_lose++;
        //             tableauResultat.Information_Siege.total_attack_lose++;
        //         }
        //     } else if (attack_battle_log_list[i].win_lose == 3) {
        //         if(!tableauResultat.Joueurs[attack_wizard_name]) {
        //             tableauResultat.Joueurs[attack_wizard_name] = {
        //                 "attack_win" : 0,
        //                 "attack_equality": 1,
        //                 "attack_lose" : 0,
        //                 "defense_win" : 0,
        //                 "defense_equality" : 0,
        //                 "defense_lose" : 0,
        //             };
        //         } else {
        //             tableauResultat.Joueurs[attack_wizard_name].attack_equality++;
        //             tableauResultat.Information_Siege.total_attack_equality++;
        //         }
        //     } else if (attack_battle_log_list[i].win_lose == 0) {
        //         if(!tableauResultat.Joueurs[attack_wizard_name]) {
        //             tableauResultat.Joueurs[attack_wizard_name] = {
        //                 "attack_win" : 0,
        //                 "attack_equality": 1,
        //                 "attack_lose" : 0,
        //                 "defense_win" : 0,
        //                 "defense_equality" : 0,
        //                 "defense_lose" : 0,
        //             };
        //         } else {
        //             tableauResultat.Joueurs[attack_wizard_name].attack_equality++;
        //             tableauResultat.Information_Siege.total_attack_equality++;
        //         }
            // }   
        }
    }
}

var defense_log = infoSiege.defense_log.log_list;

// for (let i = 0; i < defense_log.length; i++) {
    
//     var defense_battle_log_list = defense_log[i].battle_log_list;

    // for (const key in defense_battle_log_list) {
    
    //     if (defense_battle_log_list[key].match_id == siegeId) {

    //         var  def_wizard_name = defense_battle_log_list[key].wizard_name;

    //         if (defense_battle_log_list[key].win_lose == 1) {
    //             if (!tableauResultat.Joueurs[def_wizard_name]) {
    //                 tableauResultat.Joueurs[def_wizard_name] = {
    //                     "attack_win" : 0,
    //                     "attack_equality": 0,
    //                     "attack_lose" : 0,
    //                     "defense_win" : 1,
    //                     "defense_equality" : 0,
    //                     "defense_lose" : 0,
    //                 };
    //             } else {
    //                 tableauResultat.Joueurs[def_wizard_name].defense_win++;
    //                 tableauResultat.Information_Siege.total_defense_win++;
    //             }
    //         } else if (defense_battle_log_list[key].win_lose == 2) {
    //             if (!tableauResultat.Joueurs[def_wizard_name]) {
    //                 tableauResultat.Joueurs[def_wizard_name] = {
    //                     "attack_win" : 0,
    //                     "attack_equality": 0,
    //                     "attack_lose" : 0,
    //                     "defense_win" : 0,
    //                     "defense_equality" : 0,
    //                     "defense_lose" : 1,
    //                 };
    //             } else {
    //                 tableauResultat.Joueurs[def_wizard_name].defense_lose++;
    //                 tableauResultat.Information_Siege.total_defense_lose++;
    //             }
    //         } else if (defense_battle_log_list[key].win_lose == 3) {
    //             if (!tableauResultat.Joueurs[def_wizard_name]) {
    //                 tableauResultat.Joueurs[def_wizard_name] = {
    //                     "attack_win" : 0,
    //                     "attack_equality": 0,
    //                     "attack_lose" : 0,
    //                     "defense_win" : 0,
    //                     "defense_equality" : 1,
    //                     "defense_lose" : 0,
    //                 };
    //             } else {
    //                 tableauResultat.Joueurs[def_wizard_name].defense_equality++;
    //                 tableauResultat.Information_Siege.total_defense_equality++;
    //             }
    //         }else if (defense_battle_log_list[key].win_lose == 0) {
    //             if (!tableauResultat.Joueurs[def_wizard_name]) {

    //                 tableauResultat.Joueurs[def_wizard_name] = {
    //                     "attack_win" : 0,
    //                     "attack_equality": 0,
    //                     "attack_lose" : 0,
    //                     "defense_win" : 0,
    //                     "defense_equality" : 1,
    //                     "defense_lose" : 0,
    //                 };
    //             } else {
    //                 tableauResultat.Joueurs[def_wizard_name].defense_equality++;
    //                 tableauResultat.Information_Siege.total_defense_equality++;
    //             }
    //         }   
    //     }
    // }
// }

var infoSiegeTable = tableauResultat.Information_Siege

var winrate_calcul1 = infoSiegeTable.total_attack_lose / (infoSiegeTable.total_attack_win + infoSiegeTable.total_attack_lose + infoSiegeTable.total_attack_equality) * 100

var winrate_calcul2  = 100 - winrate_calcul1

tableauResultat.Information_Siege.winrate = winrate_calcul2.toFixed(2)+"%";

// console.log("Liste des Joueur :", tableauResultat.Joueurs)

fs.writeFile(`tableauResultat.json`, JSON.stringify(tableauResultat, null, 4) , function(err) {

    if(err){
      console.log('Erreur sur le fichier : (tableauResultat.json)',err);
    } else {
      console.log('Enregistrement éffectuée du fichier : (tableauResultat.json)');
    }

});

