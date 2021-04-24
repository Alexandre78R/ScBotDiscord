
exports.up = function(knex) {
    return knex.schema.renameTable('match','battle')
};

exports.down = function(knex) {
    return knex.schema.renameTable('battle', 'match')
};
