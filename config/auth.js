const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose=require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var User=require("../models/user_model");
var Client=require("../models/client_model");
var Token=require("../models/token_model");

passport.use(new LocalStrategy(//Fix password salt and crypto
    (username, password, done) => {
      
        User.findOne({username:username}, (error, user) => {
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
    }
  ));


passport.serializeUser((user, done) =>  done(null, user.id));

passport.deserializeUser((id, done) => {//check it
    User.findOne({'_id':id}, (error, user) => done(error, user));
});
  
passport.use(new BasicStrategy( 
      function(clientId, clientSecret, done) {
        Client.findOne({'clientId':clientId,clientSecret:clientSecret}, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      return done(null, client);
    });
}));
  


  passport.use(new BearerStrategy(
    (accessToken, done) => {
        //working here
        Token.findOne({token:accessToken}, (error, token) => {
        if (error) return done(error);
        if (!token) return done(null, false);
        var date1=new Date(token.creationTime)
        var date2=new Date()
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        console.log(timeDiff);
        // if (token.userId&&timeDiff<50000) {
            // User.findOne({'_id':token.userId}, (error, user) => {
            // if (error) return done(error);
            // if (!user) return done(null, false);

            done(null,{}, { scope: '*' });
          // });
        // } else {
        //   done(null,false);
        // }
      });
    }
  ));