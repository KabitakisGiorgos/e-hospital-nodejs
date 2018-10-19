const _ = require("lodash");
const {
  bkgentityModel
} = require("../../models");

const {
  mapper
} = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body) {
    res.send('create');
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    res.send('update');
  } else {
    next("Invalid Arguments");
  }
};

const _delete = (req, res, next) => {
  res.send('_delete');
};

const retrieve = (req, res, next) => {
  res.send('retrieve');
};

const retrieveAll = (req, res, next) => {
  res.send('retrieveAll');
};


module.exports = {
  create,
  update,
  delete: _delete,
  retrieve,
  retrieveAll
};