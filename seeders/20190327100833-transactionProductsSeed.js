'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('TransactionProducts', [
      {
        TransactionId: 1,
        ProductId: 1,
        amount: null,
        quantity: 2,
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        TransactionId: 1,
        ProductId: 2,
        amount: null,
        quantity: 1,
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        TransactionId: 2,
        ProductId: 1,
        amount: null,
        quantity: 1,
        createdAt: new Date,
        updatedAt: new Date
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TransactionProducts', null, {});
  }
};
