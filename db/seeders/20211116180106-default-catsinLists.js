'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('CatsInLists', [
     {catId: 1, catListId: 3, updatedAt: new Date(), createdAt: new Date()},
     {catId: 2, catListId: 3, updatedAt: new Date(), createdAt: new Date()},
     {catId: 3, catListId: 3, updatedAt: new Date(), createdAt: new Date()}
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
