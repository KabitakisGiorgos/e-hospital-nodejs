const oauth2orize = require("oauth2orize");
const utils = require("../utils");
const middleware = require("../middleware");
const login = require("connect-ensure-login");
const passport = require("passport");

let ObjectId = require("mongodb").ObjectID;
let { userModel, clientModel, tokenModel, authCodeModel } = require("../models");

// let userModel = require("../models/user");
// let clientModel = require("../models/client");
// let tokenModel = require("../models/token");
// let authCodeModel = require("../models/authorization_codes");

const server = oauth2orize.createServer();

server.serializeClient((client, done) => done(null, client.clientId));

server.deserializeClient((id, done) => {
  clientModel.findOne(
    {
      clientId: id
    },
    (error, client) => {
      if (error) return done(error);
      return done(null, client);
    }
  );
});

server.grant(
  oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
    const code = utils.helper.getUid(16);
    const myob = {
      code: code,
      clientId: client.clientId,
      redirectUri: redirectUri,
      userId: user._id
    };
    authCodeModel.findOne(
      {
        clientId: client.clientId,
        redirectUri: redirectUri,
        userId: user._id
      },
      (error, res) => {
        if (error) return done(error);
        if (!res) {
          authCodeModel.create(myob, error => {
            if (error) return done(error);
            return done(null, code);
          });
        } else return done(null, res.code);
      }
    );
  })
);

server.exchange(
  oauth2orize.exchange.code((client, code, redirectUri, done) => {
    authCodeModel.findOne(
      {
        code: code,
        clientId: client.clientId,
        redirectUri: redirectUri
      },
      (error, authCode) => {
        if (error) return done(error);
        if (!authCode) return done(null, false);

        tokenModel.findOne(
          {
            clientId: client.clientId,
            userId: authCode.userId
          },
          (error, token) => {
            if (error) return done(error);
            if (!token) {
              const object = {
                userId: user._id,
                clientId: localClient.clientId
              };

              middleware.oauth.generateToken(object, (error, newtoken) => {
                if (error) return done(error);
                else {
                  //here we can put a check if the accesstoken already exists to invalidate it but then we cant have multiple devices connected
                  accesstokenModel.create(newtoken, error => {
                    if (error) return done(error);
                    return done(null, newtoken.token, {
                      userId: newtoken.userId,
                      clientId: newtoken.clientid,
                      created: newtoken.created,
                      clientId: newtoken.clientId
                    });
                  });
                }
              });
            } else {
              done(null, token);
            }
          }
        );
      }
    );
  })
);

const authorize = [
  login.ensureLoggedIn(),
  server.authorization(
    (clientId, redirectUri, done) => {
      clientModel.findOne(
        {
          clientId: clientId
        },
        (error, client) => {
          if (error) return done(error);
          return done(null, client, redirectUri);
        }
      );
    },
    (client, user, done) => {
      authCodeModel.findOne(
        {
          clientId: client.clientId,
          userId: ObjectId(user._id)
        },
        (error, code) => {
          if (error) return done(error);
          if (code) return done(null, true);
          else {
            tokenModel.findOne(
              {
                userId: ObjectId(user._id),
                clientId: client.clientId
              },
              (error, token) => {
                // Auto-approve
                if (token) return done(null, true);
              }
            );
          }
        }
      );
    }
  ),
  (request, response) => {
    response.render("dialog", {
      transactionId: request.oauth2.transactionID,
      user: request.user,
      client: request.oauth2.client
    });
  }
];

const decision = [login.ensureLoggedIn(), server.decision()];

const token = [
  passport.authenticate("basic", { session: false }),
  server.token(),
  server.errorHandler()
];

module.exports = {
  authorize,
  decision,
  token
};
