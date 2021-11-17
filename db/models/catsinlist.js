'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatsInList = sequelize.define('CatsInList', {
    catId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    catListId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  CatsInList.associate = function(models) {
    // associations can be defined here
  };
  return CatsInList;
};