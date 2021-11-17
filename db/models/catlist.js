'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatList = sequelize.define('CatList', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  CatList.associate = function(models) {
    // associations can be defined here
    CatList.belongsTo(models.User, { foreignKey: "userId" });
    const columnMapping = {
      through: "CatsInList",
      foreignKey: "catListId",
      otherKey: "catId"
    };
    CatList.belongsToMany(models.Cat, columnMapping);
  };
  return CatList;
};