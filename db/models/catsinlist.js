'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatsInList = sequelize.define('CatsInList', {
    catId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  CatsInList.associate = function(models) {
    // associations can be defined here
  };
  return CatsInList;
};