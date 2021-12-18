var express = require('express');
var router = express.Router();

const { sequelize, Model, dataTypes } = require("sequelize");
const users = require("../models").User;
const favorites = require("../models").favorites;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// see favorites in DB
router.get("/favorite", async (req, res) => {
  const foundFavorite = await favorites.findAll();
  // console.log("favorties in DB: ", favorite);
  res.status(200).send(JSON.stringify(foundFavorite));
});

router.post("/favorite", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await favorites.create({
    commentSection: req.body.commentSection,
    category: req.body.category,
    recipe_id: req.body.recipe_id,
    recipe: req.body.recipe,
    user_id: req.body.user_id,
  });
  res.send('{"recipeFavorited": "true"}');
});

// To Update a User -> change it for favorites
router.put("/favorite/modify/:id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let favorites = req.params["id"];
  if (!err) {
    favorites.update(
      {
        id: req.body.id,
        commentSection: req.body.commentSection,
        category: req.body.category,
      },
      {
        where: {
          favorites: favorites,
        },
      }
    );
  }
  res.send('{"favoritesUpdated": "true"}');
});

// Delete a User -> change it for favorites
router.delete("/favorite/:recipe_id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let recipe_id = req.params["recipe_id"];
  await favorites.destroy({
    where: {
      recipe_id: recipe_id,
    },
  });
  res.send('{"favoritesDeleted": "true"}');
});


module.exports = router;
