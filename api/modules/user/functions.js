const _ = require("lodash");
const validator = require("validator");

const { mapper } = require("../../middleware").mapper;
const { passwordhash } = require("../../utils");
let { userModel } = require("../../models");

const create = (req, res, next) => {
  if (req.body && validator.isEmail(req.body.email) && req.body.password && req.body.username) {
    const hashedpassword = passwordhash.saltHashPassword(
      req.body.password,
      passwordhash.genRandomString(16)
    );
    const newuser = {
      username: req.body.username,
      password: hashedpassword.passwordHash,
      email: req.body.email,
      salt: hashedpassword.salt
    };

    userModel.create(newuser, (error, user) => {
      if (error) next(error);
      else {
        res.status(201);
        user = user.toObject();
        delete user.password;
        delete user.salt;
        res.locals.data = mapper(user, "user");
        next();
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    let payload = {};
    if (req.body.username) payload.username = req.body.username;
    if (req.body.email) {
      if (!validator.isEmail(req.body.email)) next("Invalid Arguments");
      payload.email = req.body.email;
    } //Here might more fields are going to be added
    if (req.body.oldpassword && req.body.newpassword) {
      payload.oldpassword = req.body.oldpassword;
      payload.newpassword = req.body.newpassword;
    }

    userModel.findById(req.params.userId, (error, user) => {
      if (error) next(error);
      else if (!user) next("Not Found");
      else {
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, user.meta, req.body.meta);
        }

        if (payload.newpassword && payload.oldpassword) {
          const hashedpassword = passwordhash.saltHashPassword(payload.oldpassword, user.salt);
          if (hashedpassword.passwordHash !== user.password) next("Invalid Password");
          else {
            //checking for the old password if its correctly provided
            delete payload.oldpassword;
            const newHashedpassword = passwordhash.saltHashPassword(payload.newpassword, user.salt)
              .passwordHash;
            payload.password = newHashedpassword;
            delete payload.newpassword;
          }
        }
        user.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.locals.data = mapper(user, "user");
            next();
          } else {
            userModel.findById(req.params.userId, (error, user) => {
              if (error) next(error);
              else if (!user) next("Not Found");
              else {
                res.status(200);
                res.locals.data = mapper(user, "user");
                next();
              }
            });
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const _delete = (req, res, next) => {
  if (req.params.userId) {
    userModel.findById(req.params.userId, (error, user) => {
      if (error) next(error);
      else if (!user) next("Not Found");
      else {
        user.delete((error, deletedUser) => {
          if (error) next(error);
          else {
            res.status(200);
            res.locals.data = mapper(deletedUser, "user");
            next();
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const retrieve = (req, res, next) => {
  if (req.params.userId) {
    userModel.findById(req.params.userId, (error, user) => {
      if (error) next(error);
      else if (!user) next("Not Found");
      else {
        user.toObject();
        delete user.salt;
        delete user.password;
        res.status(200);
        res.locals.data = mapper(user, "user");
        next();
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const retrieveAll = (req, res, next) => {
  userModel
    .find(req.query)
    .lean()
    .exec((error, users) => {
      if (error) next(error);
      else if (users.length === 0) next("Not Found");
      else {
        let usersV2 = [];
        for (let i = 0; i < users.length; i++) {
          //strip the salt and the password of the users
          delete users[i].salt;
          delete users[i].password;
          usersV2.push(mapper(users[i], "user"));
        }
        res.status(200);
        res.locals.data = usersV2;
        next();
      }
    });
};

module.exports = {
  create,
  update,
  delete: _delete,
  retrieve,
  retrieveAll
};
