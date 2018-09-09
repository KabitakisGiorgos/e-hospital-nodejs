const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');


const routes = require('./api/routes');
const middleware = require('./api/middleware');
require("./api/middleware/strategies"); //passport strategies implemented

const myapp = express();
myapp.set("view engine", "ejs");
myapp.use(cookieParser());
myapp.use(bodyParser.json({
    extended: false
}));
myapp.use(bodyParser.urlencoded({
    extended: false
}));

myapp.use(errorHandler());
myapp.use(
  session({
    secret: "o_p arasiris_einai_malakas",
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

myapp.post('/oauth/token', middleware.oauth.token);
myapp.post('/oauth/token/anonymous', middleware.oauth.anonymoustoken);
myapp.use(middleware.oauth.authorize); //here checking for existent and valid token

myapp.get("/", (request, response) => response.send("My Ouath2 Provider")); //here check api

myapp.use(require("./api/middleware/router"));
myapp.use(middleware.error);


myapp.listen(process.env.PORT || 4200);