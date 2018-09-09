const oauth2orize = require('oauth2orize');
const passport = require('passport');
const login = require('connect-ensure-login');
const utils = require('../utils');

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var User = require('../models/user_model');
var Client = require('../models/client_model');
var Token = require('../models/token_model');
var AuthCode = require('../models/authorization_codes');

const server = oauth2orize.createServer();

server.serializeClient((client, done) => done(null, client.clientId));

server.deserializeClient((id, done) => {
  Client.findOne({
    'clientId': id
  }, (error, client) => {
    if (error) return done(error);
    return done(null, client);
  });
});

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
  const code = utils.helper.getUid(16);
  var myob = {
    code: code,
    clientId: client.clientId,
    redirectUri: redirectUri,
    userId: user._id,
    creationTime: new Date()
  };
  AuthCode.findOne({
    clientId: client.clientId,
    redirectUri: redirectUri,
    userId: user._id
  }, (error, res) => {
    if (error) return done(error);
    if (!res) {
      AuthCode.create(myob, (error) => {
        if (error) return done(error);
        return done(null, code);
      });
    } else return done(null, res.code);
  });
}));



server.exchange(oauth2orize.exchange.code((client, code, redirectUri, done) => {
  AuthCode.findOne({
    code: code,
    clientId: client.clientId,
    redirectUri: redirectUri
  }, (error, authCode) => {
    if (error) return done(error);
    if (!authCode) return done(null, false);

    Token.findOne({
      clientId: client.clientId,
      userId: authCode.userId
    }, (error, token) => {
      if (error) return done(error);
      if (!token) {
        var object = {
          userId: user._id,
          clientId: localClient.clientId,
        }

        utils.security.generetaToken(object, (error, newtoken) => {
          if (error) return done(error);
          else { //here we can put a check if the accesstoken already exists to invalidate it but then we cant have multiple devices connected
            accesstokenModel.create(newtoken, (error) => {
              if (error) return done(error);
              return done(null, newtoken.token, {
                'userId': newtoken.userId,
                'clientId': newtoken.clientid,
                'creationTime': newtoken.creationTime,
                'clientId': newtoken.clientId
              });
            });
          }
        });
      } else {
        done(null, token);
      }
    });
  });
}));

module.exports.authorization = [

  login.ensureLoggedIn(),
  server.authorization((clientId, redirectUri, done) => {
    Client.findOne({
      clientId: clientId
    }, (error, client) => {
      if (error) return done(error);
      return done(null, client, redirectUri);
    });
  }, (client, user, done) => {
    AuthCode.findOne({
      clientId: client.clientId,
      userId: ObjectId(user._id)
    }, (error, code) => {
      if (error) return done(error);
      if (code) return done(null, true);
      else {
        Token.findOne({
          userId: ObjectId(user._id),
          clientId: client.clientId
        }, (error, token) => {
          // Auto-approve
          if (token) return done(null, true);
        });
      }
    });
  }),
  (request, response) => {
    response.render('dialog', {
      transactionId: request.oauth2.transactionID,
      user: request.user,
      client: request.oauth2.client
    });
  },
];

exports.decision = [
  login.ensureLoggedIn(),
  server.decision(),
];

module.exports.token = [
  server.token(),
  server.errorHandler(),
];