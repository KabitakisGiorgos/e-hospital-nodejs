const _ = require("lodash");
const { clinicModel } = require("../../models");

const { mapper } =require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body && req.body.hospitalId && req.body.name && req.body.wardId) {
    let newClinic = {
      name: req.body.name,
      hospitalId: req.body.hospitalId,
      wardId: req.body.wardId
    };

    if (req.body.meta) newClinic.meta = req.body.meta;

    clinicModel.create(newClinic, (error, clinic) => {
      if (error) next(error);
      else {
        res.status(201);
        res.send(mapper(clinic,'clinic'));
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    clinicModel.findById(req.params.cid, (error, clinic) => {
      if (error) next(error);
      else if (!clinic) next("Not Found");
      else {
        let payload = {};

        if (req.body.name) payload.name = req.body.name;
        if (req.body.hospitalId) payload.hospitalId = req.body.hospitalId;
        if (req.body.wardId) payload.wardId = req.body.wardId;

        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, clinic.meta, req.body.meta);
        }
        clinic.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.send(mapper(clinic,'clinic'));
          } else {
            clinicModel.findById(req.params.cid, (error, clinic) => {
              if (error) next(error);
              else if (!clinic) next("Not Found");
              else {
                res.status(200);
                res.send(mapper(clinic,'clinic'));
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
  clinicModel.findById(req.params.cid, (error, clinic) => {
    if (error) next(error);
    else if (!clinic) next("Not Found");
    else {
      clinic.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.send(mapper(deleted,'clinic'));
        }
      });
    }
  });
};

const retrieve = (req, res, next) => {
  clinicModel.findById(req.params.cid, (error, clinic) => {
    if (error) next(error);
    else if (!clinic) next("Not Found");
    else {
      // clinic = clinic.toObject();
      res.status(200);
      res.send(mapper(clinic,'clinic'));
    }
  });
};

const retrieveAll = (req, res, next) => {
  clinicModel
    .find()
    .lean()
    .exec((error, clinics) => {
      if (error) next(error);
      else if (clinics.length === 0) next("Not Found");
      else {
        res.status(200);
        res.send(mapper(clinics,'clinic'));
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
