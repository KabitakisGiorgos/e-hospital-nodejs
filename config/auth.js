const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var User = require('../models/user_model');
var Client = require('../models/client_model');
var Token = require('../models/token_model');
var utils = require('../utils');


passport.use(new LocalStrategy(
  (username, password, done) => {

    User.findOne({
      username: username
    }, (error, user) => {
      if (error) {
        return done(error);
      }

      if (!user) {
        return done(null, false);
      }
      var hashedpassword = utils.passwordhash.saltHashPassword(password, user.salt);

      if (user.password != hashedpassword.passwordHash) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.use(new ClientPasswordStrategy(verifyClient));


passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findOne({
    '_id': id
  }, (error, user) => done(error, user));
});

function verifyClient(clientId, clientSecret, done) {
  Client.findOne({
    clientId: clientId
  }, (error, client) => {
    if (error) return done(error);
    if (!client) return done(null, false);
    if (client.clientSecret !== clientSecret) return done(null, false);
    return done(null, client);
  });
}


passport.use(new BasicStrategy(verifyClient));

passport.use(new BearerStrategy(
  (accessToken, done) => {
    Token.findOne({
      token: accessToken
    }, (error, token) => {
      if (error) return done(error);
      if (!token) return done(null, false);

      if (token.userId) {
        User.findOne({
          '_id': token.userId
        }, (error, user) => {
          if (error) return done(error);
          if (!user) return done(null, false);
          done(null, {}, {
            scope: '*'
          });
        });
      } else {//Anonymous Token
        done(null, {}, {
          scope: '*'
        });
      }
    });
  }
));