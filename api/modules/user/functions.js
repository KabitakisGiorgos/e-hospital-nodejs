const validator = require("validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

var { passwordhash } = require("../../utils");
let { userModel } = require("../../models");

const createUser = (req, res, next) => {
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

    userModel.create(newuser, (error, user) => {
      if (error) return next(error);
      else {
        res.status(201);
        delete newuser.password;
        delete newuser.salt;
        res.send(user);
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const updateUser = (req, res, next) => {
  if (req.body) {
    var payload = {};
    if (req.body.username) payload.username = req.body.username;
    if (req.body.email) {
      if (!validator.isEmail(req.body.email)) return next("Invalid Arguments");
      payload.email = req.body.email;
    } //Here might more fields are going to be added
    if (req.body.name) payload.name = req.body.name;
    if (req.body.oldpassword && req.body.newpassword) {
      payload.oldpassword = req.body.oldpassword;
      payload.newpassword = req.body.newpassword;
    }
    userModel.findById(req.params.userId, (error, user) => {
      if (error) return next("MongoError");
      else if (!user) return next("Not Found");
      else {
        if (payload.newpassword && payload.oldpassword) {
          var hashedpassword = passwordhash.saltHashPassword(
            payload.oldpassword,
            user.salt
          );
          if (hashedpassword.passwordHash !== user.password)
            return next("Invalid Password");
          else {
            //checking for the old password if its correctly provided
            delete payload.oldpassword;
            var newHashedpassword = passwordhash.saltHashPassword(
              payload.newpassword,
              user.salt
            ).passwordHash;
            payload.password = newHashedpassword;
            delete payload.newpassword;
          }
        }
        user.update(payload, (error, raw) => {
          if (error) return next("MongoError");
          else if (!raw.nModified) {
            // res.status(304);
            res.send(user);
          } else {
            // res.status(200);
            userModel.findById(req.params.userId, (error, user) => {
              if (error) return next("MongoError");
              else if (!user) return next("Not Found");
              res.send(user);
            });
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const deleteUser = (req, res, next) => {
  if (req.params.userId) {
    userModel.findById(req.params.userId, (error, user) => {
      if (error) return next("MongoError");
      else if (!user) return next("Not Found");
      else {
        user.delete((err, deletedUser) => {
          if (err) return next("MongoError");
          else {
            res.status(200);
            res.send(deletedUser);
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const getUser = (req, res, next) => {
  if (req.params.userId) {
    userModel.findOne(
      {
        _id: ObjectId(req.params.userId)
      },
      (error, user) => {
        if (error) return next("Mongo Error");
        else if (!user) return next("Not Found");
        else {
          var user = user.toObject();
          delete user.salt;
          delete user.password;
          res.status(200);
          res.send(user);
        }
      }
    );
  } else {
    next("Invalid Arguments");
  }
};

const getAllUsers = (req, res, next) => {
  userModel
    .find()
    .lean()
    .exec((error, users) => {
      if (error) return next("Mongo Error");
      else if (users.length === 0) return next("Not Found");
      else {
        var usersV2 = [];
        for (var i = 0; i < users.length; i++) {
          //strip the salt and the password of the users
          delete users[i].salt;
          delete users[i].password;
          usersV2.push(users[i]);
        }
        res.status(200);
        res.send(usersV2);
      }
    });
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers
};
