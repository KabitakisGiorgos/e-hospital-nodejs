const _ = require("lodash");
const { patientModel } = require("../../models");

const create = (req, res, next) => {
  if (req.body && req.body.AMKA && req.body.userId && req.body.type) {
    let newPatient = {
      AMKA: req.body.AMKA,
      userId: req.body.userId
    };

    if (req.body.type) newPatient.type = req.body.type;
    if (req.body.exams) newPatient.exams = req.body.exams;
    if (req.body.meta) newPatient.meta = req.body.meta;

    patientModel.create(newPatient, (error, patient) => {
      if (error) next(error);
      else {
        res.status(201);
        res.send(patient);
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    patientModel.findById(req.params.patientId, (error, patient) => {
      if (error) next(error);
      else if (!patient) next("Not Found");
      else {
        let payload = {};

        if (req.body.AMKA) payload.AMKA = req.body.AMKA;
        if (req.body.userId) payload.userId = req.body.userId;
        if (req.body.type) payload.type = req.body.type;

        if (req.body.exams) {
          payload.exams = {};
          _.merge(payload.exams, patient.exams, req.body.exams);
        }
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, patient.meta, req.body.meta);
        }

        patient.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.send(patient);
          } else {
            patientModel.findById(req.params.patientId, (error, patient) => {
              if (error) next(error);
              else if (!patient) next("Not Found");
              else {
                res.status(200);
                res.send(patient);
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
  patientModel.findById(req.params.patientId, (error, patient) => {
    if (error) next(error);
    else if (!patient) next("Not Found");
    else {
      patient.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.send(deleted);
        }
      });
    }
  });
};

const retrieve = (req, res, next) => {
  patientModel.findById(req.params.patientId, (error, patient) => {
    if (error) next(error);
    else if (!patient) next("Not Found");
    else {
      // patient = patient.toObject();
      res.status(200);
      res.send(patient);
    }
  });
};

const retrieveAll = (req, res, next) => {
  patientModel
    .find()
    .lean()
    .exec((error, patients) => {
      if (error) next(error);
      else if (patients.length === 0) next("Not Found");
      else {
        res.status(200);
        res.send(patients);
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
