'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('CatLists', [
     {name: "Currently Petting", userId: 1, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Want to Pet", userId: 1, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Pet", userId: 1, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Currently Petting", userId: 2, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Want to Pet", userId: 2, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Pet", userId: 2, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Currently Petting", userId: 3, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Want to Pet", userId: 3, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
     {name: "Pet", userId: 3, canDelete: false, updatedAt: new Date(), createdAt: new Date()},
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('CatLists', null, {});
  }
};
