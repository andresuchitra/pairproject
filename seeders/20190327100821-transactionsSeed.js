'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Transactions', [
      {
        UserId: 1,
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        UserId: 2,
        createdAt: new Date,
        updatedAt: new Date
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transactions', null, {});
  }
};
