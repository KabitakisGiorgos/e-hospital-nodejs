const passport = require('passport');
var validator = require('validator');
var userModel = require("../models/user_model");
var utils = require('../utils');

module.exports.info = [
  passport.authenticate('bearer', {
    session: false
  }),
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

module.exports.create = function (req, res, next) {
  if (req.body && validator.isEmail(req.body.email) && req.body.password && req.body.username) {
    var hashedpassword=utils.helper.saltHashPassword(req.body.password,utils.helper.genRandomString(16));
    var newuser = {
      username: req.body.username,
      password: hashedpassword.passwordHash,
      name: req.body.name,
      email: req.body.email,
      salt:hashedpassword.salt
    }

    userModel.create(newuser, (error) => {
      if (error) return next(error);
      else {
        res.status(201);
        delete newuser.password;
        delete newuser.salt;
        res.send(newuser);
      }
    });
  } else {
    next('Invalid Arguments'); //This error needs handling
  }
}