const _ = require("lodash");
const { hospitalModel, clinicModel } = require("../../models");
const { mapper } = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body && req.body.name && req.body.address && req.body.type) {
    let newHospital = {
      name: req.body.name,
      address: req.body.address,
      type: req.body.type
    };

    if (req.body.wards) newHospital.wards = req.body.wards;
    if (req.body.clinics) newHospital.clinics = req.body.clinics;
    if (req.body.meta) newHospital.meta = req.body.meta;

    hospitalModel.create(newHospital, (error, hospital) => {
      if (error) next(error);
      else {
        res.status(201);
        res.locals.data = mapper(hospital, "hospital");
        next();
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

        if (req.body.wards) {
          payload.wards = _.concat(hospital.wards, req.body.wards);
        }
        if (req.body.clinics) {
          payload.clinics = _.concat(hospital.clinics, req.body.clinics);
        }
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, hospital.meta, req.body.meta);
        }

        hospital.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.locals.data = mapper(hospital, "hospital");
            next();
          } else {
            hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
              if (error) next(error);
              else if (!hospital) next("Not Found");
              else {
                res.status(200);
                res.locals.data = mapper(hospital, "hospital");
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
  hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
    if (error) next(error);
    else if (!hospital) next("Not Found");
    else {
      hospital.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.locals.data = mapper(deleted, "hospital");
          next();
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
      res.locals.data = mapper(hospital, "hospital");
      next();
    }
  });
};

const retrieveAll = (req, res, next) => {
  hospitalModel
    .find(req.query)
    .lean()
    .exec((error, hospitals) => {
      if (error) next(error);
      else if (hospitals.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(hospitals, "hospital");
        next();
      }
    });
};

const addClinic = (req, res, next) => {
  // if (req.body && req.params.clinicId) {
  hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
    if (error) next(error);
    else if (!hospital) next("Not Found");
    else {
      clinicModel.findById(req.params.clinicId, (error, clinic) => {
        if (error) next(error);
        else if (!clinic) next("Not Found");
        else {
          if (_.find(hospital.clinics, o => o.clinicId == req.params.clinicId)) {
            next({ message: "Clinic already registered in hospital" });
          } else {
            let clinics = hospital.clinics;

            // Put the new clinic in the array as we would get it from a GET request.
            clinics.push(mapper(clinic, "clinic"));

            hospital.update({ clinics }, (error, raw) => {
              if (error) next(error);
              else if (!raw.nModified) {
                // res.status(304);
                res.locals.data = mapper(hospital, "hospital");
                next();
              } else {
                hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
                  if (error) next(error);
                  else if (!hospital) next("Not Found");
                  else {
                    res.status(200);
                    res.locals.data = mapper(hospital, "hospital");
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
  // } else {
  //   next("Invalid Arguments");
  // }
};

const getAllClinics = (req, res, next) => {
  hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
    if (error) next(error);
    else if (!hospital) next("Not Found");
    else {
      res.status(200);
      res.locals.data = hospital.clinics;
      next();
    }
  });
};

const removeClinic = (req, res, next) => {
  hospitalModel.findById(req.params.hospitalId, (error, hospital) => {
    if (error) next(error);
    else if (!hospital) next("Not Found");
    else {
      // hospital = hospital.toObject();
      clinic = _.find(hospital.clinics, o => o.id == req.params.clinicId);
      if (!clinic) {
        next(`Clinic ${req.params.clinicId} not found in hospital ${req.params.hospitalId}`);
      } else {

        _.remove(hospital.clinics, o => o.id == req.params.clinicId);

        res.status(200);
        res.locals.data = clinic;
        next();
      }
    }
  });
};

module.exports = {
  create,
  update,
  delete: _delete,
  retrieve,
  retrieveAll,
  // addClinic,
  // getAllClinics,
  // removeClinic
};
