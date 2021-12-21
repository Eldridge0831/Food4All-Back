'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favorites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  favorites.init({
    commentSection: DataTypes.STRING,
    category: DataTypes.STRING,
    recipe_id: DataTypes.STRING,
    recipe: DataTypes.JSON,
    user_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'favorites',
  });
  return favorites;
};

// Add a User
router.post("/user", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await users.create({
    name: req.body.name,
    email: req.body.email,
  });
  res.send('{"userRegistered": "true"}');
});