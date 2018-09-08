'use strict'

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const mongoose = require('mongoose');
const utils = require('./utils');
require('./config/auth'); //passport strategies implemented

const myapp = express();
myapp.set('view engine', 'ejs');
myapp.use(cookieParser());
myapp.use(bodyParser.json({
    extended: false
}));
myapp.use(bodyParser.urlencoded({
    extended: false
}));
myapp.use(errorHandler());
myapp.use(session({
    secret: 'o_parasiris_einai_malakas',
    resave: false,
    saveUninitialized: false
}));
myapp.use(passport.initialize());
myapp.use(passport.session());

mongoose.connect("mongodb://localhost:27017/test2", () => {
    console.log("connected to db");
});

//here another route login
myapp.post('/oauth/token', utils.security.token);
myapp.post('/oauth/token/anonymous', utils.security.anonymoustoken);
myapp.use(utils.security.authorize); //here checking for existent and valid token
myapp.get('/', routes.site.index); //Check api Working

myapp.post('/user',routes.user.create);//here this route migth need change in the new architect but putting it in this file for the sake of testing

// myapp.get('/login', routes.site.loginForm); //ok 
// myapp.post('/login', routes.site.login); //ok    
// myapp.get('/logout', routes.site.logout); //ok 
// myapp.get('/account', routes.site.account); //ok

// myapp.get('/dialog/authorize', routes.oauth2.authorization); //ok 
// myapp.post('/dialog/authorize/decision', routes.oauth2.decision); //ok
// myapp.post('/oauth/token', passport.authenticate('basic', {
//     session: false
// }), routes.oauth2.token, function (req, res) {}); //ok working

// myapp.get('/api/userinfo', routes.user.info);

// myapp.post('/newuser', (request, response) => {

// });

myapp.use(utils.error)

myapp.listen(process.env.PORT || 4200);