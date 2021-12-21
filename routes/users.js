var express = require('express');
const router = express.Router();
const Users = require("../models").User;
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Sequelize, Model, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "production";
const config = require("../config/config.json")[env];
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
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
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

// class Users extends Model {}

// Users.init(
//   {
//     userName: DataTypes.STRING,
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     email: DataTypes.STRING,
//   },
//   {
//     sequelize,
//     modelName: "Users",
//   });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//  get users
router.get("/user", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const users = await Users.findAll();
  res.status(200).send(JSON.stringify(users));
  // res.send(users);
});

// Add a User
router.post("/user", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await Users.create({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });
  res.send('{"userRegistered": "true"}');
});

// Update a user
router.put("/user/modify/:user_name", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let Username = req.params["user_name"];
  if (res===200){
    Users.update({        
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      },{
        where: {
          userName: Username,
        },
    });
} 
  res.send('{"favoritesUpdated": "true"}');
});

router.delete("/user/delete/:id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let id = req.params["id"];
  await Users.destroy({
    where: {
      id: id,
    },
  });
  res.send('{"favoritesDeleted": "true"}');
});

// Login a User
router.post("/loginAttempt", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const username = req.body.username;
  console.log(username);
  const password = req.body.password;
  console.log(password);
  Users.findOne({
    where: {
      userName: username,
    },
  }).then((users) => {
    console.log(users);
    bcrypt.compare(password, users.password, function (err, isMatch) {
      //bcrypt
      if (err) {
        throw err;
      } else if (!isMatch) {
        console.log("isMatch is False");
        return res.send('{"isMatch": "false"}');
      } else {
        console.log("isMatch is True");
        res.send('{"isMatch": "true"}');
      }
    });
  });
});

//Logout the User
router.get("/auth/logout", (req, res) => {
  console.log("logging out!");
  user = {};
  res.redirect("/"); //redirect to home page
});

module.exports = router;
