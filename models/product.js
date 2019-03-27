'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    imagePath: DataTypes.STRING
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.Category)
    Product.belongsToMany(models.Tag, {through: 'ProductTags'})
    Product.belongsToMany(models.Transaction, {through: 'TransactionProducts'})
  };
  return Product;
};