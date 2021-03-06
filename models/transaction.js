'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User)
    Transaction.belongsToMany(models.Product, {through: 'TransactionProducts'})
  };
  return Transaction;
};