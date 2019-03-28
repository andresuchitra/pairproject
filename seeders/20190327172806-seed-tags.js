'use strict';
const getObjects =require('../helpers/getObjectsFromCSV')
module.exports = {
  up: (queryInterface, Sequelize) => {
   let list = getObjects('./csv/tags.csv')
    return queryInterface.bulkInsert('Tags', list, {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Tags', null, {});
  }
};
