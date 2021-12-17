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
  res.send('{"faovritesUpdated": "true"}');
});

// Delete a User -> change it for favorites
router.delete("/favorite/:id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let id = req.params["id"];
  await favorites.destroy({
    where: {
      id: id,
    },
  });
  res.send('{"favoritesDeleted": "true"}');
});


module.exports = router;
