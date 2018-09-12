const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BasicStrategy = require("passport-http").BasicStrategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const ClientPasswordStrategy = require("passport-oauth2-client-password")
  .Strategy;
// const mongoose = require("mongoose");
// let ObjectId = require("mongodb").ObjectID;
let { userModel, clientModel, tokenModel } = require("../models");
// let Client = require("../models/client");
// let Token = require("../models/token");

passport.use(
  new LocalStrategy((username, password, done) => {
    userModel.findOne(
      {
        username: username
      },
      (error, user) => {
        if (error) {
          return done(error);
        }

        if (!user) {
          return done(null, false);
        }
        const hashedpassword = utils.passwordhash.saltHashPassword(
          password,
          user.salt
        );

        if (user.password != hashedpassword.passwordHash) {
          return done(null, false);
        }
        return done(null, user);
      }
    );
  })
);

passport.use(new ClientPasswordStrategy(verifyClient));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  userModel.findOne(
    {
      _id: id
    },
    (error, user) => done(error, user)
  );
});

function verifyClient(clientId, clientSecret, done) {
  clientModel.findOne(
    {
      clientId: clientId
    },
    (error, client) => {
      if (error) return done(error);
      if (!client) return done(null, false);
      if (client.clientSecret !== clientSecret) return done(null, false);
      return done(null, client);
    }
  );
}

passport.use(new BasicStrategy(verifyClient));

passport.use(
  new BearerStrategy((accessToken, done) => {
    tokenModel.findOne(
      {
        token: accessToken
      },
      (error, token) => {
        if (error) return done(error);
        if (!token) return done(null, false);

        if (token.userId) {
          userModel.findOne(
            {
              _id: token.userId
            },
            (error, user) => {
              if (error) return done(error);
              if (!user) return done(null, false);
              done(
                null,
                {},
                {
                  scope: "*"
                }
              );
            }
          );
        } else {
          //Anonymous Token
          done(
            null,
            {},
            {
              scope: "*"
            }
          );
        }
      }
    );
  })
);
