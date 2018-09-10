// const passport = require("passport");
const validator = require("validator");
const _ = require("lodash");

var { passwordhash } = require("../../utils");
let { userModel } = require("../../models");

// const login = passport.authenticate("local", {
//   successReturnToOrRedirect: "/account",
//   failureRedirect: "/"
// });

// const logout = (request, response) => {
//   request.logout();
//   response.redirect("/");
// };

// const getAccount = (request, response) =>
//   response.render("account", { user: request.user });

// const getUserInfo = (request, response) => {
//   // request.authInfo is set using the `info` argument supplied by
//   // `BearerStrategy`. It is typically used to indicate scope of the token,
//   // and used in access control checks. For illustrative purposes, this
//   // example simply returns the scope in the response.
//   response.json({ user_id: request.user.id, name: request.user.name });
// };

const create = (req, res, next) => {
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
      if (error) next(error);
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
};

const update = (req, res, next) => {
  if (
    req.body
  ) {
    var updatedUser = {
      // username: req.body.username,
      // email: req.body.email,
      name: req.body.name,
    };

    userModel.update(updatedUser, error => {
      if (error) next(error);
      else {
        delete updatedUser.password;
        delete updatedUser.salt;
        res.send(updatedUser);
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const retrieve = (req, res, next) => {
  userModel.findById(req.params.userId, (error, user) => {
    if (error) next(error);
    else if (_.isEmpty(user)) next("Not Found");
    else res.send(user);
  });
};

const _delete = (req, res, next) => {
  userModel.findById(req.params.userId, (error, user) => {
    if (error) next(error);
    else if (_.isEmpty(user)) next("Not Found");
    else {
      user.remove((err, removedUser) => {
        if (err) next(err);
        else res.send(removedUser);
      })
    }
  });
};

/**
 * TODO: for update, retrieve, delete we should check
 * from the access_token if the user is the same as the requested one
 */
module.exports = {
  // login,
  // logout,
  // getAccount,
  // getUserInfo,
  create,
  retrieve,
  update,
  _delete
};
