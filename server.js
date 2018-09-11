const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const winston = require("winston");
const expressWinston = require("express-winston");

require("dotenv").load();

// Initialize the modules
const modules = require("./api/modules");

const { oauth, error, strategies } = require("./api/middleware");

mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${
    process.env.DB_COLLECTION
  }`,
  { useNewUrlParser: true },
  () => console.log("connected to db")
);

const app = express();

// Winston logger. Here we can log to files. SEE also errorLogging.
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          // winston.format.prettyPrint(),
          winston.format.simple()
        )
      })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    // msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    // ignoreRoute: function(req, res) {
    //   return false;
    // } // optional: allows to skip some log messages based on request and/or response
  })
);

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

// Winston error logger -- Must be after the router
// app.use(
//   expressWinston.errorLogger({
//     transports: [
//       new winston.transports.Console({
//         format: winston.format.combine(
//           winston.format.colorize({ all: true }),
//           // winston.format.prettyPrint(),
//           winston.format.simple()
//         )
//       })
//     ],

//     dumpExceptions: true,
//     showStack: true
//   })
// );

// Error Handler
app.use(error);

// listening to port from env
var port = process.env.PORT || 4200;
app.listen(port, "0.0.0.0");

console.log(`server running in port ${port}, 0.0.0.0 `);
