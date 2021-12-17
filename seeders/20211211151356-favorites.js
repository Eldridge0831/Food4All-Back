'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('favorites', [{
      id: '1',
      commentSection: 'hello',
      category: '',
      recipe: JSON.stringify({1:1}),
      createdAt: new Date(),
      updatedAt: new Date()
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('favorites', null, {});
  }
};
