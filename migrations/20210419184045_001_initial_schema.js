
exports.up = async (knex) => {
    return knex.schema.createTable('user', (t) => {
        t.increments();
        t.integer('idNameDiscord');
        t.unique('idNameDiscord');
        t.string('nameTagDiscord');
        t.string('nameGuild');
        t.timestamps();
    });
};

exports.down = async (knex) => {
    return knex.schema.dropTable("user");
};