
exports.up = async (knex) => {
    return knex.schema.createTable('monster', (t) => {
        t.increments();
        t.integer('idMonster');
        t.unique('idMonster');
        t.string('nameMonster');
        t.timestamps();
    });
};

exports.down = async (knex) => {
    return knex.schema.dropTable("monster");
};
