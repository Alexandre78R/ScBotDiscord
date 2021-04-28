
exports.up = async (knex) => {
    return knex.schema.createTable('team', (t) => {
        t.increments();
        t.integer('monster_lead').unsigned();
        t.integer('monster_2').unsigned();
        t.integer('monster_3').unsigned();
        t.foreign('monster_lead').references('id').inTable('monster');
        t.foreign('monster_2').references('id').inTable('monster');
        t.foreign('monster_3').references('id').inTable('monster');
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async (knex) => {
    return knex.schema.dropTable("team");
};
