
exports.up = async (knex) => {
    return knex.schema.createTable('user', (t) => {
        t.increments();
        t.integer('idNameDiscord');
        t.unique('idNameDiscord');
        t.string('nameTagDiscord');
        t.string('nameGuild');
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async (knex) => {
    return knex.schema.dropTable("user");
};