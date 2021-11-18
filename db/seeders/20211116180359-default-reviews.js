'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Reviews', [
     {userId: 1, catId: 1, rating: 5, content: 'Big Cat. Fun to Pet.', updatedAt: new Date(), createdAt: new Date()},
     {userId: 1, catId: 2, rating: 1, content: 'This cat scratched me. STAY AWAY!', updatedAt: new Date(), createdAt: new Date()},
     {userId: 1, catId: 3, rating: 4, content: 'I lost this cat in the snow. Good luck finding her.', updatedAt: new Date(), createdAt: new Date()},
     {userId: 2, catId: 4, rating: 4, content: 'Beware. Cat has gun.', updatedAt: new Date(), createdAt: new Date()},
     {userId: 2, catId: 5, rating: 1, content: 'Fictional cat. Petting was difficult.', updatedAt: new Date(), createdAt: new Date()},
     {userId: 2, catId: 12, rating: 1, content: 'AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!!', updatedAt: new Date(), createdAt: new Date()},
     {userId: 3, catId: 12, rating: 1, content: 'AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!!', updatedAt: new Date(), createdAt: new Date()},
     {userId: 2, catId: 3, rating: 1, content: 'Beautiful cat. Enjoyed petting.', updatedAt: new Date(), createdAt: new Date()},
     {userId: 1, catId: 12, rating: 1, content: 'AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!!', updatedAt: new Date(), createdAt: new Date()},
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Reviews', null, {});
  }
};
