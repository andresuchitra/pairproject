'use strict'
const getObjects = require('../helpers/getObjectsFromCSV')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let list = getObjects('p.csv')
    return queryInterface.bulkInsert('Products', list, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Products', null, {});
  }
};