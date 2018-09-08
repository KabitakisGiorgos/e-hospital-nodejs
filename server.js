const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes");
const mongoose = require("mongoose");
// const utils = require("./utils");

// Initializes the passport configuration for the oauth
require("./middleware/auth"); //ok

const myapp = express();
myapp.set("view engine", "ejs");
myapp.use(cookieParser());
myapp.use(bodyParser.json({ extended: false }));
myapp.use(bodyParser.urlencoded({ extended: false }));
myapp.use(errorHandler());
myapp.use(
  session({
    secret: "o_parasiris_einai_malakas",
    resave: false,
    saveUninitialized: false
  })
);
myapp.use(passport.initialize());
myapp.use(passport.session());

mongoose.connect(
  "mongodb://localhost:27017/test2",
  () => console.log("connected to db")
);

//passport strategies implemented
myapp.get("/", routes.site.index); //here check api

//here another route login
// myapp.use(utils.security.authrorize); //here checking for existent and valid token
myapp.use(passport.authenticate("bearer", { session: false }));

// myapp.use(utils.security.router);

myapp.get("/login", routes.site.loginForm); //ok
myapp.post("/login", routes.site.login); //ok
myapp.get("/logout", routes.site.logout); //ok
myapp.get("/account", routes.site.account); //ok

myapp.get("/dialog/authorize", routes.oauth2.authorization); //ok
myapp.post("/dialog/authorize/decision", routes.oauth2.decision); //ok

// KAMPITAKI: to function einai keno de kanei prama
myapp.post(
  "/oauth/token",
  passport.authenticate("basic", { session: false }),
  routes.oauth2.token,
  function(req, res) {}
); //ok working

myapp.get("/api/userinfo", routes.user.info);

// KAMPITAKI TODO: Complete this?
myapp.post("/newuser", (request, response) => {});

myapp.use(function(err, req, res, next) {
  //here a function for error handling seperate folder
  // console.log('test');
  if (err === "Unauthorized") {
    res.status(401);
  } else if (err) {
    res.status(500);
  }
  res.send({ error: err });
});

myapp.listen(process.env.PORT || 4200);
