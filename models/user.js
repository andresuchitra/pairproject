'use strict';
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    type: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    interests: DataTypes.TEXT,
    imagePath: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user , options) => {
        user.password = bcrypt.hashSync(user.password , salt)
        user.imagePath = '_img/oppo_f11.png'
      },
      beforeUpdate: (user, options) => {
        user.password = bcrypt.hashSync(user.password , salt)
      }
    }
  });  
  User.associate = function(models) {
    User.hasOne(models.Transaction)
  };
  
  
  return User;
};