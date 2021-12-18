'use strict';

const { DataTypes } = require("sequelize/dist");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('favorites', [{
      id: '1',
      commentSection: 'hello',
      category: '',
      recipe: JSON.stringify({1:1}),
      recipe_id: '2',
      createdAt: new Date(),
      updatedAt: new Date()
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('favorites', null, {});
  }
};
