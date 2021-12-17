'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
        name: 'Annie Easley',
        email: 'annieeasley@email.com',
        createdAt: new Date(),
        updatedAt: new Date()
    }], {});
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};