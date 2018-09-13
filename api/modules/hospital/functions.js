const _ = require("lodash");
const { hospitalModel } = require("../../models");

const { mapper } =require("../../middleware");
const { config }=require('./mapper');

const create = (req, res, next) => {
  if (req.body && req.body.name && req.body.address && req.body.type) {
    let newHospital = {
      name: req.body.name,
      address: req.body.address,
      type: req.body.type
    };

    if (req.body.departments) newHospital.departments = req.body.departments;
    if (req.body.meta) newHospital.meta = req.body.meta;

    hospitalModel.create(newHospital, (error, hospital) => {
      if (error) next(error);
      else {
        res.status(201);
        res.send(mapper(hospital,config.map));
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
      if (error) next(error);
      else if (!hospital) next("Not Found");
      else {
        let payload = {};

        if (req.body.name) payload.name = req.body.name;
        if (req.body.address) payload.address = req.body.address;
        if (req.body.type) payload.type = req.body.type;

        if (req.body.departments) {
          payload.departments = _.concat(hospital.departments, req.body.departments);
        }
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, hospital.meta, req.body.meta);
        }

        hospital.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.send(mapper(hospital,config.map));
          } else {
            hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
              if (error) next(error);
              else if (!hospital) next("Not Found");
              else {
                res.status(200);
                res.send(mapper(hospital,config.map));
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
  hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
    if (error) next(error);
    else if (!hospital) next("Not Found");
    else {
      hospital.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.send(mapper(deleted,config.map));
        }
      });
    }
  });
};

const retrieve = (req, res, next) => {
  hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
    if (error) next(error);
    else if (!hospital) next("Not Found");
    else {
      // hospital = hospital.toObject();
      res.status(200);
      res.send(mapper(hospital,config.map));
    }
  });
};

const retrieveAll = (req, res, next) => {
  hospitalModel
    .find()
    .lean()
    .exec((error, hospitals) => {
      if (error) next(error);
      else if (hospitals.length === 0) next("Not Found");
      else {
        res.status(200);
        res.send(mapper(hospitals,config.map));
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
