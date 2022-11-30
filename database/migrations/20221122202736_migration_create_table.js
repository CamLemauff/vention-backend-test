exports.up = async function(knex) {
    await knex.schema.createTable('weapons', function (t) {
        t.increments('id').unsigned().primary();
        t.string('name');
        t.integer('power_level');
        t.integer('qty');
        t.specificType('materials', 'integer ARRAY');
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('weapons');  
};
