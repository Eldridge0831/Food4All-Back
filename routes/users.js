var express = require('express');
var router = express.Router();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// database requirements
const { sequelize, Model, dataTypes } = require("sequelize");
const users = require("../models").User;
const favorites = require("../models").favorites;

const successUrl = "http://localhost:3000/login/success";
const errorUrl = "http://localhost:3000/login/error";

// path to start the OAuth
router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Oauth callback URL
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureMessage: "Cannot login to Google, please try again later!",
    failureRedirect: errorUrl,
    successRedirect: successUrl,
  }),
  (req, res) => {
    console.log("User: ", req.user);
    res.send("Thanks for signing in!");
  }
);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/user", async (req, res) => {
  const foundUsers = await users.findAll();
  res.status(200).send(JSON.stringify(foundUsers));
  // res.send(users);
});

// Add a User
router.post("/register", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await users.create({
    fullName: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  res.send('{"userRegistered": "true"}');
});

// Login a User
router.post("/login", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const email = req.body.username;
  console.log(email);
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