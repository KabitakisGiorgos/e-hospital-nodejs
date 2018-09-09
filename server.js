const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const routes = require("./api/routes");
const { oauth, error } = require("./api/middleware");
require("./api/middleware/strategies"); //passport strategies implemented

mongoose.connect(
  "mongodb://localhost:27017/test2",
  { useNewUrlParser: true },
  () => console.log("connected to db")
);

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(
  bodyParser.json({
    extended: false
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(errorHandler());
app.use(
  session({
    secret: "o_p arasiris_einai_malakas",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
// this is for oauth2 only
app.use(passport.session());

app.post("/oauth/token", oauth.token);
app.post("/oauth/token/anonymous", oauth.anonymoustoken);
app.use(oauth.authorize); //here checking for existent and valid token

app.get("/", (request, response) => response.send("My Ouath2 Provider")); //here check api

app.use(require("./api/utils").router);
app.use(error);

app.listen(process.env.PORT || 4200);
