const bcrypt = require('bcryptjs');

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return await queryInterface.bulkInsert('Users', [
     { username: 'Demouser',hashedPassword: bcrypt.hashSync('P@ssw0rd', 10),firstName: "Demo",lastName: "User",bio: "This is a demo user so you may test out all functionality.",createdAt: new Date(),updatedAt: new Date()},
     { username: 'johndoe',hashedPassword: bcrypt.hashSync('P@ssw0rd', 10),firstName: "John",lastName: "Doe",bio: "I am a dummy account.",createdAt: new Date(),updatedAt: new Date()},
     { username: 'catlover2000',hashedPassword: bcrypt.hashSync('P@ssw0rd', 10),firstName: "Blake",lastName: "Kindly",bio: "I just love CATS!!!!!!!!.",createdAt: new Date(),updatedAt: new Date()},
  ], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
