const _ = require("lodash");
const {
  doctorModel,
  examModel,
  patientModel
} = require("../../models");

const { mapper } = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body && req.body.userId && req.body.specialty && req.body.clinicId) {
    let newDoctor = {
      userId: req.body.userId,
      clinicId: req.body.clinicId,
      specialty: req.body.specialty,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age
    };

    if (req.body.wardId) newDoctor.wardId = req.body.wardId;
    if (req.body.diplomas) newDoctor.diplomas = req.body.diplomas;
    if (req.body.meta) newDoctor.meta = req.body.meta;

    doctorModel.create(newDoctor, (error, doctor) => {
      if (error) next(error);
      else {
        res.status(201);
        res.locals.data = mapper(doctor, "doctor");
        next();
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    doctorModel.findById(req.params.doctorId, (error, doctor) => {
      if (error) next(error);
      else if (!doctor) next("Not Found");
      else {
        let payload = {};

        if (req.body.userId) payload.userId = req.body.userId;
        if (req.body.specialty) payload.specialty = req.body.specialty;
        if (req.body.wardId) payload.wardId = req.body.wardId;
        if (req.body.clinicId) payload.clinicId = req.body.clinicId;
        if (req.body.firstName) payload.firstName = req.body.firstName;
        if (req.body.lastName) payload.lastName = req.body.lastName;
        if (req.body.age) payload.age = req.body.age;

        if (req.body.diplomas) {
          payload.diplomas = _.concat(doctor.diplomas, req.body.diplomas);
        }
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, doctor.meta, req.body.meta);
        }
        doctor.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.locals.data = mapper(doctor, "doctor");
            next();
          } else {
            doctorModel.findById(req.params.doctorId, (error, doctor) => {
              if (error) next(error);
              else if (!doctor) next("Not Found");
              else {
                res.status(200);
                res.locals.data = mapper(doctor, "doctor");
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
  doctorModel.findById(req.params.doctorId, (error, doctor) => {
    if (error) next(error);
    else if (!doctor) next("Not Found");
    else {
      doctor.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.locals.data = mapper(deleted, "doctor");
          next();
        }
      });
    }
  });
};

const retrieve = (req, res, next) => {
  doctorModel.findById(req.params.doctorId, (error, doctor) => {
    if (error) next(error);
    else if (!doctor) next("Not Found");
    else {
      // doctor = doctor.toObject();
      res.status(200);
      res.locals.data = mapper(doctor, "doctor");
      next();
    }
  });
};

const retrieveAll = (req, res, next) => {
  doctorModel
    .find(req.query)
    .lean()
    .exec((error, doctors) => {
      if (error) next(error);
      else if (doctors.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(doctors, "doctor");
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