const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const validator = require("validator");

var utils = require("../utils");
let userModel = require("../models/user");

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
  (request, response) => response.render("account", { user: request.user })
];

const getUserInfo = [
  (request, response) => {
    // request.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`. It is typically used to indicate scope of the token,
    // and used in access control checks. For illustrative purposes, this
    // example simply returns the scope in the response.
    response.json({ user_id: request.user.id, name: request.user.name });
  }
];

const createUser = [
  function(req, res, next) {
    if (
      req.body &&
      validator.isEmail(req.body.email) &&
      req.body.password &&
      req.body.username
    ) {
      var hashedpassword = utils.passwordhash.saltHashPassword(
        req.body.password,
        utils.passwordhash.genRandomString(16)
      );
      var newuser = {
        username: req.body.username,
        password: hashedpassword.passwordHash,
        name: req.body.name,
        email: req.body.email,
        salt: hashedpassword.salt
      };

      userModel.create(newuser, error => {
        if (error) return next(error);
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

module.exports = {
  login,
  logout,
  getAccount,
  getUserInfo,
  createUser
};
