'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cat = sequelize.define('Cat', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    breed: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    size: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    friendly: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    coat: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      },
    imgUrl: DataTypes.STRING
  }, {});
  Cat.associate = function(models) {
    // associations can be defined here
    Cat.belongsTo(models.User, { foreignKey: "userId" });
    const columnMapping = { 
      through: "CatsInList",
      foreignKey: "catId",
      otherKey: "catListId"
    }
    Cat.belongsToMany(models.CatList, columnMapping);
    Cat.hasMany(models.Review, { foreignKey: "catId" });
  };
  return Cat;
};