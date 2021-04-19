
exports.up = function(knex) {
    knex.schema.createTable('user', function (table) {
        table.increments();
        table.integer('idNameDiscord');
        table.unique('idNameDiscord');
        table.string('nameTagDiscord');
        table.string('nameGuild');
        table.timestamps();
    })
    knex.schema.createTable('monster', function (table) {
        table.increments();
        table.integer('idMonster');
        table.unique('idMonster');
        table.string('nameMonster');
        table.timestamps();
    })
    knex.schema.createTable('team', function (table) {
        table.increments();
        table.integer('monster_lead');
        table.integer('monster_2');
        table.integer('monster_3');
        table.foreign('monster_lead').references('monster.id');
        table.foreign('monster_2').references('monster.id');
        table.foreign('monster_3').references('monster.id');
        table.timestamps();
    })
    knex.schema.createTable('match', function (table) {
        table.increments();
        table.boolean('result');
        table.integer('offense_id').unsigned();
        table.foreign('offense_id').references('team.id');
        table.integer('defense_id').unsigned();
        table.foreign('defense_id').references('team.id');
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('user.id');
        table.timestamps();
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable("user")
        .dropTable("monster")
        .dropTable("team")
        .dropTable("match");
};