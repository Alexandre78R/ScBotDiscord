
exports.up = async (knex) => {
    return knex.schema.createTable('monster', (t) => {
        t.increments();
        t.integer('idMonster');
        t.unique('idMonster');
        t.string('nameMonster');
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async (knex) => {
    return knex.schema.dropTable("monster");
};
