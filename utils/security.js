var passport = require('passport');
var userModel = require("../models/user_model");
var clientModel = require("../models/client_model");
var accesstokenModel = require("../models/token_model");;
const oauth2orize = require('oauth2orize');
var server = oauth2orize.createServer();
var randtoken = require('rand-token');

//code Source:https://github.com/gerges-beshay/oauth2orize-examples

var authrorize = [
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
            if (password !== user.password) return done(null, false); //here we ll need the crypto and the salt

            var object = {
                userId: user._id,
                clientId: localClient.clientId,
            }

            generetaToken(object, (error, newtoken) => {
                if (error) return done(error);
                else {
                    accesstokenModel.create(newtoken, (error) => {
                        if (error) return done(error);
                        return done(null, newtoken);
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
                res.send(newtoken);
            });
        }
    });
};

function generetaToken(object, next) {
    accesstokenModel.findOne(object, (err, token) => {
        if (err) next(err);
        else {
            var token = randtoken.generate(128);
            object.token = token;
            object.creationTime = new Date();
            next(null, object);
        } //here we can invalidate theold and produce a new one but only one could be connected 
        // else if(!token){
        //     //generate it
        // }else{
        //     next(null,token)
        // }
    })
}

var token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {
        session: false
    }), //fix here the basic beeds fix about crypto and salt
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
    authrorize,
    token,
    anonymoustoken
}