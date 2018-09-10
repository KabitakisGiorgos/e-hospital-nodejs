const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const validator = require("validator");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var {
  passwordhash
} = require("../utils");
let {
  userModel
} = require("../models");

const login = passport.authenticate("local", {
  successReturnToOrRedirect: "/account",
  failureRedirect: "/"
});

const logout = [
  (request, response) => {
    request.logout();
    response.redirect("/");
  }
];

const getAccount = [
  ensureLogin.ensureLoggedIn(),
  (request, response) => response.render("account", {
    user: request.user
  })
];

const getUserInfo = [
  (request, response) => {
    // request.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`. It is typically used to indicate scope of the token,
    // and used in access control checks. For illustrative purposes, this
    // example simply returns the scope in the response.
    response.json({
      user_id: request.user.id,
      name: request.user.name
    });
  }
];

const createUser = [
  function (req, res, next) {
    if (
      req.body &&
      validator.isEmail(req.body.email) &&
      req.body.password &&
      req.body.username
    ) {
      var hashedpassword = passwordhash.saltHashPassword(
        req.body.password,
        passwordhash.genRandomString(16)
      );
      var newuser = {
        username: req.body.username,
        password: hashedpassword.passwordHash,
        name: req.body.name,
        email: req.body.email,
        salt: hashedpassword.salt
      };

      userModel.create(newuser, error => {
        if (error) return next('MongoError');
        else {
          res.status(201);
          delete newuser.password;
          delete newuser.salt;
          res.send(newuser);
        }
      });
    } else {
      next("Invalid Arguments"); //This error needs handling
    }
  }
];

const updateUser = [
  function (req, res, next) {
    if(req.body){
      var payload={}
      if(req.body.username) payload.username=req.body.username;
      if(req.body.email){
        if(!validator.isEmail(req.body.email)) return next('Invalid Arguments');
        payload.email=req.body.email;
      } //Here might more fields are going to be added
      if(req.body.name) payload.name=req.body.name;
      if(req.body.oldpassword&&req.body.newpassword){
        payload.oldpassword=req.body.oldpassword;
        payload.newpassword=req.body.newpassword;
      };
      userModel.findOne({_id:ObjectId(req.params.userId)},(error,user)=>{
        if(error) return next('MongoError');
        else if(!user) return next('Not Found');
        else{
          if(payload.newpassword&&payload.oldpassword){
            var hashedpassword = passwordhash.saltHashPassword(
              payload.oldpassword,
              user.salt
            );
            if (hashedpassword.passwordHash !== user.password) return next('Unauthorized');
            else{//checking for the old password if its correctly provided
              delete payload.oldpassword;
              var newHashedpassword=passwordhash.saltHashPassword(
                payload.newpassword,
                user.salt
              ).passwordHash;
              payload.password=newHashedpassword;
              delete payload.newpassword;
            }
          }
          userModel.updateOne({_id:ObjectId(req.params.userId)},payload,(error,result)=>{
            if(error) return next('MongoError');
            else{
              if(!result.nModified){
                res.status(304);
                res.send({});
              }else{
                res.status(200);
                res.send({});
              }
            }
          })
        }
      })
    }else{
      next("Invalid Arguments");
    }
  }
];

const deleteUser = [
  function (req, res, next) {
    if (req.params.userId) {
      userModel.findOne({
        _id: ObjectId(req.params.userId)
      }, (error, user) => {
        if (error) return next('MongoError');
        else if (!user) return next('Not Found');
        else {
          user.delete(() => {
            if (error) return next('MongoError');
            else {
              res.status(200);
              res.send({});
            }
          })
        }
      })
    } else {
      next("Invalid Arguments");
    }
  }
];

const getUser = [
  function (req, res, next) {
    next();
  }
];
const getAllUsers = [
  function (req, res, next) {
    next();
  }
];

module.exports = {
  login,
  logout,
  getAccount,
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers
};