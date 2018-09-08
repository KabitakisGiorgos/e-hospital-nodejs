const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

// const utils = require("./utils");
// const routes = require("./api/routes");

// Initializes the passport configuration for the oauth
require("./api/middleware/auth"); //ok

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
  { useNewUrlParser: true },
  () => console.log("connected to db")
);

// TODO: This perhaps needs to be done in another way
myapp.get("/", (request, response) => response.send("My Ouath2 Provider")); //here check api

//here another route login
myapp.use([passport.authenticate("bearer", { session: false })]);

myapp.use(require("./api/middleware/router"));

// KAMPITAKI TODO: Complete this?
myapp.use(function(err, req, res, next) {
  //here a function for error handling seperate folder
  // console.log('test');
  // if (err === "Unauthorized") {
  //   res.status(401);
  // } else if (err) {
  //   res.status(500);
  // }
  res.status(500);
  res.send({ error: err });
});

myapp.listen(process.env.PORT || 4200);
