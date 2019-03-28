'use strict'
const getObjects = require('../helpers/getObjectsFromCSV')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let list = getObjects('./csv/p.csv')
    return queryInterface.bulkInsert('Products', list, {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Products', null, {});
  }
};