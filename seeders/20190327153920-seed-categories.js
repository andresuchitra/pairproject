'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [{
        name: 'phones',
        createdAt : new Date,
        updatedAt : new Date
      },
      {
        name: 'laptops',
        createdAt : new Date,
        updatedAt : new Date
      },
      {
        name: 'fashion',
        createdAt : new Date,
        updatedAt : new Date
      },
      {
        name: 'sports',
        createdAt : new Date,
        updatedAt : new Date
      },
      {
        name: 'gaming',
        createdAt : new Date,
        updatedAt : new Date
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};