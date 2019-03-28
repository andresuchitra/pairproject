'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    type: DataTypes.STRING,
    imagePath: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function (product, options){
        if(product.imagePath && product.imagePath.length > 0) {
          product.imagePath = '_img/oppo_f11.png'
        }
      }
    }
  });
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.Category)
    Product.belongsToMany(models.Tag, {through: 'ProductTags'})
    Product.belongsToMany(models.Transaction, {through: 'TransactionProducts'})
  };

  Product.prototype.getPriceFormat = function (currency) {
    let IDR = 'IDR', USD ='USD'
    if(currency === 'USD') {
      return `$ ${this.price.toFixed(2).toLocaleString('en')}`
    }

    return `Rp. ${this.price.toFixed(2).toLocaleString('en')}`
  }
  return Product;
};