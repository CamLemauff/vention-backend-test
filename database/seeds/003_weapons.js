exports.seed = function (knex) {
    return knex('weapons')
      .del()
      .then(function () {
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
  