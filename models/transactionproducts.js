'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionProducts = sequelize.define('TransactionProducts', {
    amount: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  TransactionProducts.associate = function(models) {
    
  };
  return TransactionProducts;
};