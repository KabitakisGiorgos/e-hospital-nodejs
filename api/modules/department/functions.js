const _ = require("lodash");
const { departmentModel } = require("../../models");

const create = (req, res, next) => {
  if (req.body && req.body.name && req.body.hospitalId) {
    let newDepartment = {
      name: req.body.name,
      hospitalId: req.body.hospitalId
    };

    if (req.body.doctors) newDepartment.doctors = req.body.doctors;
    if (req.body.patients) newDepartment.patients = req.body.patients;
    if (req.body.meta) newDepartment.meta = req.body.meta;

    departmentModel.create(newDepartment, (error, department) => {
      if (error) next(error);
      else {
        res.status(201);
        res.send(department);
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    departmentModel.findById(req.params.departmentId, (error, department) => {
      if (error) next(error);
      else if (!department) next("Not Found");
      else {
        let payload = {};

        if (req.body.name) payload.name = req.body.name;
        if (req.body.hospitalId) payload.hospitalId = req.body.hospitalId;

        if (req.body.patients) {
          payload.patients = _.concat(department.patients, req.body.patients);
        }
        if (req.body.doctors) {
          payload.doctors = _.concat(department.doctors, req.body.doctors);
        }
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, department.meta, req.body.meta);
        }

        department.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.send(department);
          } else {
            departmentModel.findById(
              req.params.departmentId,
              (error, department) => {
                if (error) next(error);
                else if (!department) next("Not Found");
                else {
                  res.status(200);
                  res.send(department);
                }
              }
            );
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const _delete = (req, res, next) => {
  departmentModel.findById(req.params.departmentId, (error, department) => {
    if (error) next(error);
    else if (!department) next("Not Found");
    else {
      department.delete((error, deleted) => {
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
  departmentModel.findById(req.params.departmentId, (error, department) => {
    if (error) next(error);
    else if (!department) next("Not Found");
    else {
      // department = department.toObject();
      res.status(200);
      res.send(department);
    }
  });
};

const retrieveAll = (req, res, next) => {
  departmentModel
    .find()
    .lean()
    .exec((error, departments) => {
      if (error) next(error);
      else if (departments.length === 0) next("Not Found");
      else {
        res.status(200);
        res.send(departments);
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
