'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
        fullName: 'Annie Easley',
        email: 'annieeasley@email.com',
        password: '1',
        googleId: '2',
        picture: '3',
        createdAt: new Date(),
        updatedAt: new Date()
    }], {});
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};