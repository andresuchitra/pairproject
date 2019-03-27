'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'noelhutasoit',
        password: 1234,
        email: 'noelhutasoit@mail.com',
        type: 'admin',
        address: 'Jl. Budi Murni II No. 100',
        phone: '085773544171',
        firstName: 'Noel',
        lastName: 'Hutasoit',
        interests: 'reading,sports,coding',
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        username: 'monkeyluffy',
        password: 5678,
        email: 'd.luffy@mail.com',
        type: 'buyer',
        address: 'East Blue',
        phone: '08765474833',
        firstName: 'Monkey',
        lastName: 'Luffy',
        interests: 'sports,business,marvel',
        createdAt: new Date,
        updatedAt: new Date
      }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
