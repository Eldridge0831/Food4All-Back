const express = require("express");
const app = express ();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const https = require('https');

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// database requirements
const {sequelize, Model, dataTypes} = require('sequelize');
const users = require("./backend/models").users;
const favorites = require("./capstone-project/backend/models").favorites;
const { default: Favorite } = require("../src/components/Favorite");

const pgp = require("pg-promise")();
const db = pgp("postgres://@127.0.0.1:5432/capstone_development");


// object reset everytime login with provider. User object gets overridden
let user = {};

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});


/*------Google Passport-------*/

passport.use(new GoogleStrategy({
  clientID: keys.GOOGLE.clientID,
  clientSecret: keys.GOOGLE.clientSecret,
  callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, cb) => {
  console.log(chalk.blue(JSON.stringify(profile)));
  user.findorCreate = { ...profile };
  return cb(null, profile);
}));

// path to start the OAuth 
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// OAuth callback url
app.get("/auth/google/callback",
  passport.authenticate("google"),
      (req, res) => {
          res.redirect("/"); //redirect to home if successful
      });
      app.get("/user", (req, res) => {
        console.log("getting user data!");
        res.send(user);
    });
    


// Add a User 
app.post("/users", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await Users.create({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    
  });
  res.send('{"userRegistered": "true"}');
});

// To Update a User
app.put("/users/modify/:user_name", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let userName = req.params["user_name"];
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (!err) {
        Users.update(
          {
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            location: req.body.location,
            role: req.body.role,
          },
          {
            where: {
              userName: userName,
            },
          }
        );
      }
      res.send('{"userRegistered": "true"}');
    });
  });
});

// Delete a User   
app.delete("/users/delete/:user_name", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let userName = req.params["user_name"];
  await Users.destroy({
    where: {
      userName: userName,
    },
  });
  res.send('{"userDeleted": "true"}');
});

    // Login a User
    app.post("/loginAttempt", async (req, res) => {
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
        bcrypt.compare(password, users.password, function (err, isMatch) { //bcrypt
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
    app.get("/auth/logout", (req, res) => {
        console.log("logging out!");
        user = {}; 
        res.redirect("/");  //redirect to home page
    });

    // see favorites in DB
app.get("/components/favorite", async (req, res) => {
  const favorite = await favorites.findall();
  console.log('favorties in DB: ', favorite);
  res.status(200).send(JSON.stringify(favorite));
})

    app.listen(PORT);

    