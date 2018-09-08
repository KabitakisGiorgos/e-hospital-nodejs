var passport = require('passport');
var userModel = require('../models/user_model');
var clientModel = require('../models/client_model');
var accesstokenModel = require('../models/token_model');;
const oauth2orize = require('oauth2orize');
var server = oauth2orize.createServer();
var randtoken = require('rand-token');

//code Source:https://github.com/gerges-beshay/oauth2orize-examples

var authorize = [
    passport.authenticate('bearer', {
        session: false
    }),
    (req, res, next) => {
        next();
    }
];

server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    clientModel.findOne({
        clientId: client.clientId
    }, (error, localClient) => {
        if (error) return done(error);
        if (!localClient) return done(null, false);
        if (localClient.clientSecret !== client.clientSecret) return done(null, false);
        // Validate the user
        userModel.findOne({
            username: username
        }, (error, user) => {
            if (error) return done(error);
            if (!user) return done(null, false);
            var hashedpassword = utils.passwordhash.saltHashPassword(password, user.salt);
            if (hashedpassword.passwordHash !== user.password) return done(null, false);

            var object = {
                userId: user._id,
                clientId: localClient.clientId,
            }

            generetaToken(object, (error, newtoken) => {
                if (error) return done(error);
                else { //here we can put a check if the accesstoken already exists to invalidate it
                    accesstokenModel.create(newtoken, (error) => {
                        if (error) return done(error);
                        return done(null, newtoken.token, {
                            'userId': newtoken.userId,
                            'clientId': newtoken.clientid,
                            'creationTime': newtoken.creationTime,
                        });
                    });
                }
            });
        });
    });
}));

function anonymoustoken(req, res, next) {
    generetaToken({
        clientId: req.body.client_id
    }, (err, newtoken) => {
        if (err) next(err);
        else {
            accesstokenModel.create(newtoken, (error) => {
                if (error) return done(error);
                res.status(200);
                newtoken.token_type = 'Bearer';
                res.send(newtoken);
            });
        }
    });
};

function generetaToken(object, next) {
    var token = randtoken.generate(128);
    object.token = token;
    object.creationTime = new Date();
    next(null, object);
}

var token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {
        session: false
    }),
    server.token(),
    server.errorHandler(),
];

var anonymoustoken = [
    passport.authenticate('oauth2-client-password', {
        session: false
    }),
    anonymoustoken,
    server.errorHandler(),
];

module.exports = {
    authorize,
    token,
    anonymoustoken
}