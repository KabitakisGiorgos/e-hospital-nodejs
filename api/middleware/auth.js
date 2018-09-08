const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BasicStrategy = require("passport-http").BasicStrategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
// const ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
// const mongoose = require("mongoose");
// let ObjectId = require("mongodb").ObjectID;
let User = require("../models/user_model");
let Client = require("../models/client_model");
let Token = require("../models/token_model");

passport.use(
  new LocalStrategy((username, password, done) => {
    //Fix password salt and crypto
    User.findOne({ username: username }, (error, user) => {
      if (error) {
        return done(error);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  //check it
  User.findOne({ _id: id }, (error, user) => done(error, user));
});

passport.use(
  new BasicStrategy(function(clientId, clientSecret, done) {
    Client.findOne({ clientId: clientId, clientSecret: clientSecret }, function(
      err,
      client
    ) {
      if (err) {
        return done(err);
      }
      if (!client) {
        return done(null, false);
      }
      return done(null, client);
    });
  })
);

passport.use(
  new BearerStrategy((accessToken, done) => {
    //working here
    Token.findOne({ token: accessToken }, (error, token) => {
      if (error) return done(error);
      if (!token) return done(null, false);
      let date1 = new Date(token.creationTime);
      let date2 = new Date();
      let timeDiff = Math.abs(date2.getTime() - date1.getTime());
      console.log(timeDiff);
      if (token.userId && timeDiff < 50000) {
        User.findOne({ _id: token.userId }, (error, user) => {
          if (error) return done(error);
          if (!user) return done(null, false);

          done(null, token, { scope: "*" });
        });
      } else {
        done(null, false);
      }
    });
  })
);
