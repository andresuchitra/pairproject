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
      return `$ ${Product.addThousandsSeparator(this.price.toFixed(2)).toLocaleString('en')}`
    }

    return `Rp. ${Product.addThousandsSeparator(this.price.toFixed(2)).toLocaleString('en')}`
  }


  Product.getPriceFormat = function(amount, currency) {
    if(currency === 'USD') {
      return `$ ${Product.addThousandsSeparator(amount.toFixed(2)).toLocaleString('en')}`
    }
    return `Rp. ${Product.addThousandsSeparator(amount.toFixed(2)).toLocaleString('en')}`
  }

  Product.addThousandsSeparator = function(input) {
    var output = input
    if (parseFloat(input)) {
        input = new String(input); 
        var parts = input.split(".");
        parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
        output = parts.join(".");
    }
    return output;
}

  return Product;
};