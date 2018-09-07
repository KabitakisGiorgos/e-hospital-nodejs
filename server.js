const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const mongoose=require('mongoose');
const utils=require('./utils');

const myapp=express();
myapp.set('view engine','ejs');
myapp.use(cookieParser());
myapp.use(bodyParser.json({ extended: false }));
myapp.use(bodyParser.urlencoded({ extended: false }));
myapp.use(errorHandler());
myapp.use(session({ secret: 'shhhhhhhhhhhhhhh', resave: false, saveUninitialized: false }));
myapp.use(passport.initialize()); 
myapp.use(passport.session());

mongoose.connect("mongodb://localhost:27017/provider",()=>{
    console.log("connected to db");
});

//passport strategies implemented
require('./auth');//ok
myapp.get('/',routes.site.index);//Ok 
myapp.use(utils.security.testToken);

myapp.get('/login', routes.site.loginForm);//ok 
myapp.post('/login', routes.site.login);//ok    
myapp.get('/logout', routes.site.logout);//ok 
myapp.get('/account', routes.site.account);//ok

myapp.get('/dialog/authorize', routes.oauth2.authorization);//ok 
myapp.post('/dialog/authorize/decision', routes.oauth2.decision);//ok
myapp.post('/oauth/token',passport.authenticate('basic', { session: false }) ,routes.oauth2.token,function(req, res) {});//ok working

myapp.get('/api/userinfo', routes.user.info);

myapp.post('/newuser',(request,response)=>{
    
});

myapp.listen(process.env.PORT || 4200); 