'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bio: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Cat, { foreignKey: "userId" });
    User.hasMany(models.CatList, { foreignKey: "userId" });
    User.hasMany(models.Review, { foreignKey: "userId" });
  };
  return User;
};
