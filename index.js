const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Sequelize, Model, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "production";
const config = require("./config/config.json")[env];
const db = {};
const bodyParser = require("body-parser");
// const axios = require("axios");
// const res = require("express/lib/response");
// const FormData = require("form-data");

app.use(cors({ origin: (orig, cb) => cb(null, true), credentials: true }));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "templates")));

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize,Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

class User extends Model {}
class favorites extends Model {}

User.init(
  {
    userName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Users",
  }
);

favorites.init(
  {
    commentSection: DataTypes.STRING,
    category: DataTypes.STRING,
    recipe_id: DataTypes.STRING,
    recipe: DataTypes.JSON,
    user_id: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "favorites",
  }
);

// Add a User
app.post("/user", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await User.create({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });
  res.send('{"userRegistered": "true"}');
});

//   get all users
app.get("/user", async (req, res) => {
  const foundUsers = await User.findAll();
  res.status(200).send(JSON.stringify(foundUsers));
});

// update a user  
app.put("/users/modify/:user_name", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let UserName = req.params["user_name"];
  await User.update(
    {
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    },
    {
      where: {
        userName: UserName,
      },
    }
  );
  res.send('{"userRegistered": "true"}');
});

// delete a user  
app.delete("/users/delete/:id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let id = req.params["id"];
  await User.destroy({
    where: {
      id: id,
    },
  });
  res.send('{"userDeleted": "true"}');
});

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
  // see favorites in DB
  app.get("/favorite/:user_id", async (req, res) => {
    const user_id = req.params["user_id"];
    const foundFavorite = await favorites.findAll({
      where: {
        user_id: user_id,
      }
    });
    res.status(200).send(JSON.stringify(foundFavorite));
  });
  
  // see favorites by category
  app.get("/favorite/:user_id/:category", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const user_id = req.params["user_id"];
    const category = req.params["category"];
    const categoryData = await favorites.findAll({
      where: {
        user_id: user_id,
        category: category,
      }
    });
  
    res.status(200).send(categoryData);
  });
  
  app.post("/favorite", async (req, res) => {
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
  app.put("/favorite/modify/:recipe_id", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let recipe_id = req.params["recipe_id"];
    // if (res===200){
      favorites.update({        
          commentSection: req.body.commentSection,
          category: req.body.category,
          recipe_id: req.body.recipe_id,
          recipe: req.body.recipe,
          user_id: req.body.user_id
        },{
          where: {
            recipe_id: recipe_id,
          },
      });
  // } 
    res.send('{"favoritesUpdated": "true"}');
  });
  
  // Delete a User -> change it for favorites
  app.delete("/favorite/:recipe_id", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let recipe_id = req.params["recipe_id"];
    await favorites.destroy({
      where: {
        recipe_id: recipe_id,
      },
    });
    res.send('{"favoritesDeleted": "true"}');
  });
  
  
  module.exports = app;