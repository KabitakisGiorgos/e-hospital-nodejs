const passport = require("passport");
const oauth2orize = require("oauth2orize");
const server = oauth2orize.createServer();
const randtoken = require("rand-token");

const userModel = require("../models/user");
const clientModel = require("../models/client");
const accesstokenModel = require("../models/token");
const utils = require("../utils");
//code Source:https://github.com/gerges-beshay/oauth2orize-examples

server.exchange(
  oauth2orize.exchange.password((client, username, password, scope, done) => {
    clientModel.findOne(
      {
        clientId: client.clientId
      },
      (error, localClient) => {
        if (error) return done(error);
        if (!localClient) return done(null, false);
        if (localClient.clientSecret !== client.clientSecret)
          return done(null, false);
        // Validate the user
        userModel.findOne(
          {
            username: username
          },
          (error, user) => {
            if (error) return done(error);
            if (!user) return done(null, false);
            var hashedpassword = utils.passwordhash.saltHashPassword(
              password,
              user.salt
            );
            if (hashedpassword.passwordHash !== user.password)
              return done(null, false);

            var object = {
              userId: user._id,
              clientId: localClient.clientId
            };

            generateToken(object, (error, newtoken) => {
              if (error) return done(error);
              else {
                //here we can put a check if the accesstoken already exists to invalidate it but then we cant have multiple devices connected
                accesstokenModel.create(newtoken, error => {
                  if (error) return done(error);
                  return done(null, newtoken.token, {
                    userId: newtoken.userId,
                    clientId: newtoken.clientid,
                    creationTime: newtoken.creationTime
                  });
                });
              }
            });
          }
        );
      }
    );
  })
);

const authorize = [
  passport.authenticate("bearer", {
    session: false
  }),
  (req, res, next) => {
    next();
  }
];

const token = [
  passport.authenticate(["basic", "oauth2-client-password"], {
    session: false
  }),
  server.token(),
  server.errorHandler()
];

const anonymoustoken = [
  passport.authenticate("oauth2-client-password", {
    session: false
  }),
  (req, res, next) => {
    generateToken(
      {
        clientId: req.body.client_id
      },
      (err, newtoken) => {
        if (err) next(err);
        else {
          accesstokenModel.create(newtoken, error => {
            if (error) return done(error);
            res.status(200);
            newtoken.token_type = "Bearer";
            res.send(newtoken);
          });
        }
      }
    );
  },
  server.errorHandler()
];

const generateToken = (object, next) => {
  let token = randtoken.generate(128);
  object.token = token;
  object.creationTime = new Date();
  next(null, object);
};

module.exports = {
  authorize,
  token,
  anonymoustoken,
  generateToken
};
