const _ = require("lodash");
const { wardModel, patientModel } = require("../../models");

const { mapper } = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body && req.body.name && req.body.hospitalId) {
    let newWard = {
      name: req.body.name,
      hospitalId: req.body.hospitalId
    };

    if (req.body.doctors) newWard.doctors = req.body.doctors;
    if (req.body.patients) newWard.patients = req.body.patients;
    if (req.body.meta) newWard.meta = req.body.meta;

    wardModel.create(newWard, (error, ward) => {
      if (error) next(error);
      else {
        res.status(201);
        res.locals.data = mapper(ward, "ward");
        next();
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    wardModel.findById(req.params.wardId, (error, ward) => {
      if (error) next(error);
      else if (!ward) next("Not Found");
      else {
        let payload = {};

        if (req.body.name) payload.name = req.body.name;
        if (req.body.hospitalId) payload.hospitalId = req.body.hospitalId;

        if (req.body.patients) {
          payload.patients = _.concat(ward.patients, req.body.patients);
        }
        if (req.body.doctors) {
          payload.doctors = _.concat(ward.doctors, req.body.doctors);
        }
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, ward.meta, req.body.meta);
        }

        ward.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.locals.data = mapper(ward, "ward");
            next();
          } else {
            wardModel.findById(req.params.wardId, (error, ward) => {
              if (error) next(error);
              else if (!ward) next("Not Found");
              else {
                res.status(200);
                res.locals.data = mapper(ward, "ward");
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
  wardModel.findById(req.params.wardId, (error, ward) => {
    if (error) next(error);
    else if (!ward) next("Not Found");
    else {
      ward.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.locals.data = mapper(deleted, "ward");
          next();
        }
      });
    }
  });
};

const retrieve = (req, res, next) => {
  wardModel.findById(req.params.wardId, (error, ward) => {
    if (error) next(error);
    else if (!ward) next("Not Found");
    else {
      // ward = ward.toObject();
      res.status(200);
      res.locals.data = mapper(ward, "ward");
      next();
    }
  });
};

const retrieveAll = (req, res, next) => {
  wardModel
    .find()
    .lean()
    .exec((error, wards) => {
      if (error) next(error);
      else if (wards.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(wards, "ward");
        next();
      }
    });
};

const addWatitingPatient = (req, res, next) => {
  if (req.body && req.params.patientId) {
    wardModel.findById(req.params.wardId, (error, ward) => {
      if (error) next(error);
      else if (!ward) next("Not Found");
      else {
        patientModel.findById(req.params.patientId, (error, patient) => {
          if (error) next(error);
          else if (!patient) next("Not Found");
          else {
            if (_.find(ward.waitingList, o => o.patientId == req.params.patientId)) {
              next({ message: "Patient already in Waiting list" });
            } else {
              let waitingList = ward.waitingList;

              waitingList.push({
                patientId: req.params.patientId,
                name: patient.name,
                arrived: false,
                waiting: true,
                order: ward.waitingList.length
              });

              ward.update({ waitingList }, (error, raw) => {
                if (error) next(error);
                else if (!raw.nModified) {
                  // res.status(304);
                  res.locals.data = mapper(ward, "ward");
                  next();
                } else {
                  wardModel.findById(req.params.wardId, (error, ward) => {
                    if (error) next(error);
                    else if (!ward) next("Not Found");
                    else {
                      res.status(200);
                      res.locals.data = mapper(ward, "ward");
                      next();
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const retrieveWaitingPatient = (req, res, next) => {
  wardModel.findById(req.params.wardId, (error, ward) => {
    if (error) next(error);
    else if (!ward) next("Not Found");
    else {
      // ward = ward.toObject();
      patient = _.find(ward.waitingList, o => o.patientId == req.params.patientId);

      res.status(200);
      res.locals.data = patient;
      next();
    }
  });
};

const retrieveWaitingPatients = (req, res, next) => {
  wardModel.findById(req.params.wardId, (error, ward) => {
    if (error) next(error);
    else if (!ward) next("Not Found");
    else {
      // ward = ward.toObject();
      res.status(200);
      res.locals.data = ward.waitingList;
      next();
    }
  });
};

module.exports = {
  create,
  update,
  delete: _delete,
  retrieve,
  retrieveAll,
  addWatitingPatient,
  retrieveWaitingPatients,
  retrieveWaitingPatient
};
