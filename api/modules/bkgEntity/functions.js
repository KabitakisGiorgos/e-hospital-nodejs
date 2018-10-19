const _ = require("lodash");
const {
  bkgentityModel
} = require("../../models");

const {
  mapper
} = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body.hospitalId && req.body.wardId && req.body.frequency) {
    let payload = {
      hospitalId: req.body.hospitalId,
      wardId: req.body.wardId,
      frequency: req.body.frequency,
    }
    bkgentityModel.create(payload, (error, bkgentity) => {
      if (error) next(error);
      else {
        res.status(201);
        res.locals.data = mapper(bkgentity, "bkgentity");
        next();
      }
    })
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    bkgentityModel.findById(req.params.bId, (error, bkgentity) => {
      if (error) next(error);
      else if (!bkgentity) next("Not Found");
      else {

        if (req.body.wardId) bkgentity.wardId = req.body.wardId;
        if (req.body.hospitalId) bkgentity.hospitalId = req.body.hospitalId;
        if (req.body.frequency) bkgentity.frequency = req.body.frequency;

        bkgentity.save((error, updatedbkgentity) => {
          if (error) next(error);
          else {
            res.locals.data = mapper(updatedbkgentity, "bkgentity");
            next();
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const _delete = (req, res, next) => {
  bkgentityModel.findById(req.params.bId, (error, bkgentity) => {
    if (error) next(error);
    else if (!bkgentity) next('Not Found');
    else {
      bkgentity.delete((error, deleted) => {
        if (error) next(error);
        res.status(200);
        res.locals.data = mapper(deleted, "bkgentity");
        next();
      })
    }
  })
};

const retrieve = (req, res, next) => {
  bkgentityModel.findById(req.params.bId, (error, bkgentity) => {
    if (error) next(error);
    else if (!bkgentity) next("Not Found");
    else {
      res.status(200);
      res.locals.data = mapper(bkgentity, "bkgentity");
      next();
    }
  });
};

const retrieveAll = (req, res, next) => {
  bkgentityModel
    .find()
    .lean()
    .exec((error, bkgentities) => {
      if (error) next(error);
      else if (bkgentities.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(bkgentities, "bkgentity");
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