'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductTags = sequelize.define('ProductTags', {
    ProductId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {});
  ProductTags.associate = function(models) {
    // associations can be defined here
  };
  return ProductTags;
};