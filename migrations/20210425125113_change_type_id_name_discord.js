
exports.up = function(knex) {
    return knex.schema.alterTable('user', function (t) {
        t.bigInteger('idNameDiscord').alter();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('user', function (t) {
        t.integer('idNameDiscord').alter();
    });
};
