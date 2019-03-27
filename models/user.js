'use strict';
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
    interests: DataTypes.TEXT
  }, {});
  User.associate = function(models) {
    User.hasOne(models.Transaction)
  };
  return User;
};