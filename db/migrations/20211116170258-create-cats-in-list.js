'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CatsInLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      catId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Cats'
        }
      },
      catListId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'CatLists'
        }
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
    return queryInterface.dropTable('CatsInLists');
  }
};