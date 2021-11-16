'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      breed: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      size: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      friendly: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      coat: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
        }
      },
      imgUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cats');
  }
};