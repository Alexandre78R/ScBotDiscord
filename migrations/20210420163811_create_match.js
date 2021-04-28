
exports.up = async (knex) => {
    return knex.schema.createTable('match', (t) => {
        t.increments();
        t.boolean('result');
        t.integer('offense_id').unsigned();
        t.foreign('offense_id').references('id').inTable('team');
        t.integer('defense_id').unsigned();
        t.foreign('defense_id').references('id').inTable('team');
        t.integer('user_id').unsigned();
        t.foreign('user_id').references('id').inTable('user');
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async (knex) => {
    return knex.schema.dropTable("match");
};
