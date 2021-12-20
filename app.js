const express = require("express");
const PORT = process.env.PORT || 3001;
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
const axios = require("axios");
const res = require("express/lib/response");
const FormData = require("form-data");

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

class Users extends Model {}
users.init(
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
// add a user   
app.post("/users", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await Users.create({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    userImage: req.body.userImage,
  });
  res.send('{"userRegistered": "true"}');
});
// get all users
app.get("/users", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const users = await Users.findAll();
  res.status(200).send(users);
});

// get one user
app.get("/users/:email", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let email = req.params.email;
  const users = await Users.findAll({
    where: {
      email: email,
    },
  });
  res.status(200).send(users);
});
// update a user   WORKING
app.put("/users/modify/:user_name", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let UserName = req.params["user_name"];
  await Users.update(
    {
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    {
      where: {
        userName: UserName,
      },
    }
  );
  res.send('{"userRegistered": "true"}');
});

// delete a user   WORKING
app.delete("/users/delete/:id", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let id = req.params["id"];
  await Users.destroy({
    where: {
      id: id,
    },
  });
  res.send('{"userDeleted": "true"}');
});