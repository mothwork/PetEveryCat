'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cat = sequelize.define('Cat', {
    name: DataTypes.STRING,
    breed: DataTypes.STRING,
    size: DataTypes.STRING,
    friendly: DataTypes.BOOLEAN,
    coat: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    imgUrl: DataTypes.STRING
  }, {});
  Cat.associate = function(models) {
    // associations can be defined here
  };
  return Cat;
};