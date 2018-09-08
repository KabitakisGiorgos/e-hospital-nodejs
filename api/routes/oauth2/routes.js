const oauth2orize = require("oauth2orize");
const login = require("connect-ensure-login");
const passport = require("passport");

const utils = require("../../utils");
const router = require("../../middleware/router");

let ObjectId = require("mongodb").ObjectID;
let User = require("../../models/user_model");
let Client = require("../../models/client_model");
let Token = require("../../models/token_model");
let AuthCode = require("../../models/authorization_codes");

const server = oauth2orize.createServer();

server.serializeClient((client, done) => done(null, client.clientId));

server.deserializeClient((id, done) => {
  //ok
  Client.findOne({ clientId: id }, (error, client) => {
    if (error) return done(error);
    return done(null, client);
  });
});

server.grant(
  oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
    //this is working fine :)
    const code = utils.getUid(16);
    let myob = {
      code: code,
      clientId: client.clientId,
      redirectUri: redirectUri,
      userId: user._id
    };
    AuthCode.findOne(
      { clientId: client.clientId, redirectUri: redirectUri, userId: user._id },
      (error, res) => {
        if (error) return done(error);
        if (!res) {
          AuthCode.create(myob, error => {
            if (error) return done(error);
            return done(null, code);
          });
        } else return done(res);
      }
    );
  })
);

server.exchange(
  oauth2orize.exchange.code((client, code, redirectUri, done) => {
    //this is working and the update of the token
    AuthCode.findOne(
      { code: code, clientId: client.clientId, redirectUri: redirectUri },
      (error, authCode) => {
        if (error) return done(error);
        if (!authCode) return done(null, false);

        Token.findOne(
          { clientId: client.clientId, userId: authCode.userId },
          (error, token) => {
            if (error) return done(error);
            if (!token) {
              const newtoken = utils.getUid(256);
              Token.create(
                {
                  token: newtoken,
                  userId: authCode.userId,
                  clientId: authCode.clientId,
                  creationTime: new Date()
                },
                error => {
                  if (error) return done(error);
                  return done(null, newtoken);
                }
              );
            } else {
              let date1 = new Date(token.creationTime);
              let date2 = new Date();
              let timeDiff = Math.abs(date2.getTime() - date1.getTime());

              console.log(timeDiff);
              if (timeDiff > 50000) {
                const newtoken = utils.getUid(256);
                Token.update(
                  { token: newtoken, creationTime: new Date() },
                  error => {
                    if (error) return done(error);
                    return done(null, newtoken);
                  }
                );
              } else {
                done(null, token); //already a token exists
              }
            }
          }
        );
      }
    );
  })
);

server.exchange(
  oauth2orize.exchange.password((client, username, password, scope, done) => {
    //this is working
    // Validate the client
    Client.findOne({ clientId: client.clientId }, (error, localClient) => {
      if (error) return done(error);
      if (!localClient) return done(null, false);
      if (localClient.clientSecret !== client.clientSecret)
        return done(null, false);
      // Validate the user
      User.findOne({ username: username }, (error, user) => {
        if (error) return done(error);
        if (!user) return done(null, false);
        if (password !== user.password) return done(null, false);
        // Everything validated, return the token
        Token.findOne(
          { clientId: client.clientId, userId: user._id },
          (error, token) => {
            if (error) return done(error);
            if (!token) {
              const newtoken = utils.getUid(256);
              Token.create(
                {
                  token: newtoken,
                  userId: user._id,
                  clientId: localClient.clientId,
                  creationTime: new Date()
                },
                error => {
                  if (error) return done(error);
                  return done(null, newtoken);
                }
              );
            } else {
              let date1 = new Date(token.creationTime);
              let date2 = new Date();
              let timeDiff = Math.abs(date2.getTime() - date1.getTime());

              console.log(timeDiff);
              if (timeDiff > 50000) {
                const newtoken = utils.getUid(256);
                Token.update(
                  { token: newtoken, creationTime: new Date() },
                  error => {
                    if (error) return done(error);
                    return done(null, newtoken);
                  }
                );
              } else {
                done(null, token); //already a token exists
              }
            }
          }
        );
      });
    });
  })
);

const authorization = [
  login.ensureLoggedIn(),
  server.authorization(
    (clientId, redirectUri, done) => {
      Client.findOne({ clientId: clientId }, (error, client) => {
        if (error) return done(error);
        return done(null, client, redirectUri);
      });
    },
    (client, user, done) => {
      // Check if grant request qualifies for immediate approval
      // Auto-approve
      if (client.isTrusted) return done(null, true);
      Token.findOne(
        { userId: ObjectId(user._id), clientId: client.clientId },
        (error, token) => {
          // Auto-approve
          if (token) {
            let date1 = new Date(token.creationTime);
            let date2 = new Date();
            let timeDiff = Math.abs(date2.getTime() - date1.getTime());
            if (timeDiff < 50000) return done(null, true);
          } else return done(null, false);
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

const token = [server.token(), server.errorHandler()];

router.get("/dialog/authorize", authorization); //ok
router.post("/dialog/authorize/decision", decision); //ok

router.post(
  "/oauth/token",
  passport.authenticate("basic", { session: false }),
  token
); //ok working

