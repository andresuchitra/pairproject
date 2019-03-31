'use strict';
const getObjects =require('../helpers/getObjectsFromCSV')
module.exports = {
  up: (queryInterface, Sequelize) => {
   let list = getObjects('./csv/productTags.csv')
    return queryInterface.bulkInsert('ProductTags', list, {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('ProductTags', null, {});
  }
