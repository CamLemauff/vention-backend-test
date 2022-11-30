exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('weapons')
      .del()
      .then(function () {
        // Inserts seed entries
        return knex('weapons').insert([
          {
            id: 1,
            name: 'Excalibur',
            power_level: null,
            qty: null,
            materials: [1, 6, 9, 12]
          },
          {
            id: 2,
            name: 'Magic Staff',
            power_level: null,
            qty: null,
            materials: [6]
          }
        ]);
      });
  };
  