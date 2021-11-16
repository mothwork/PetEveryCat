'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatList = sequelize.define('CatList', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  CatList.associate = function(models) {
    // associations can be defined here
  };
  return CatList;
};