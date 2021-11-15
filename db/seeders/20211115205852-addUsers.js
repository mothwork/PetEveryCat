const bcrypt = require('bcryptjs');

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return await queryInterface.bulkInsert('Users', [{
      username: 'Demouser',
      hashedPassword: bcrypt.hashSync('P@ssw0rd', 10),
      firstName: "Demo",
      lastName: "User",
      bio: "This is a demo user so you may test out all functionality.",
      createdAt: new Date(),
      updatedAt: new Date()
   }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
