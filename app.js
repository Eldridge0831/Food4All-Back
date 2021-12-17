var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// database requirements
const { sequelize, Model, dataTypes } = require("sequelize");
const users = require("./models").users;
const favorites = require("./models").favorites;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let user = {};

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

/*------Google Passport-------*/

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys.GOOGLE.clientID,
//       clientSecret: keys.GOOGLE.clientSecret,
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       console.log(chalk.blue(JSON.stringify(profile)));
//       user.findorCreate = { ...profile };
//       return cb(null, profile);
//     }
//   )
// );

// path to start the OAuth
// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// // OAuth callback url
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google"),
//   (req, res) => {
//     res.redirect("/"); //redirect to home if successful
//   }
// );
// app.get("/user", (req, res) => {
//   console.log("getting user data!");
//   res.send(user);
// });

// // Add a User
// app.post("/user", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");
//   await Users.create({
//     name: req.body.name,
//     email: req.body.email,
//   });
//   res.send('{"userRegistered": "true"}');
// });

// // Login a User
// app.post("/loginAttempt", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");
//   const username = req.body.username;
//   console.log(username);
//   const password = req.body.password;
//   console.log(password);
//   Users.findOne({
//     where: {
//       userName: username,
//     },
//   }).then((users) => {
//     console.log(users);
//     bcrypt.compare(password, users.password, function (err, isMatch) {
//       //bcrypt
//       if (err) {
//         throw err;
//       } else if (!isMatch) {
//         console.log("isMatch is False");
//         return res.send('{"isMatch": "false"}');
//       } else {
//         console.log("isMatch is True");
//         res.send('{"isMatch": "true"}');
//       }
//     });
//   });
// });

// //Logout the User
// app.get("/auth/logout", (req, res) => {
//   console.log("logging out!");
//   user = {};
//   res.redirect("/"); //redirect to home page
// });

// // see favorites in DB
// app.get("/favorite", async (req, res) => {
//   const favorite = await favorites.findall();
//   console.log("favorties in DB: ", favorite);
//   res.status(200).send(JSON.stringify(favorite));
// });

// // To Update a User -> change it for favorites
// app.put("/favorite/modify/:id", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");
//   let favorites = req.params["id"];
//   if (!err) {
//     favorites.update(
//       {
//         id: req.body.id,
//         commentSection: req.body.commentSection,
//         category: req.body.category,
//       },
//       {
//         where: {
//           favorites: favorites,
//         },
//       }
//     );
//   }
//   res.send('{"faovritesUpdated": "true"}');
// });

// // Delete a User -> change it for favorites
// app.delete("/favorite/:id", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");
//   let id = req.params["id"];
//   await favorites.destroy({
//     where: {
//       id: id,
//     },
//   });
//   res.send('{"favoritesDeleted": "true"}');
// });


module.exports = app;
