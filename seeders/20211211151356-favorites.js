'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('favorites', [{
      id: '1',
      commentSection: 'hello',
      category: 'chicken',
      recipe_id: 'chicken biscuits',
      recipe: JSON.stringify({1:1}),
      user_id: '2',
      createdAt: new Date(),
      updatedAt: new Date()
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('favorites', null, {});
  }
};
