const _ = require("lodash");
const { examModel } = require("../../models");

const { mapper } = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body && req.body.type && req.body.patientId && req.body.doctorId) {
    let newexam = {
      type: req.body.type,
      patientId: req.body.patientId,
      doctorId: req.body.doctorId,
      created: req.body.created
    };

    if (req.body.clinicId) newexam.clinicId = req.body.clinicId;
    if (req.body.description) newexam.description = req.body.description;
    if (req.body.meta) newexam.meta = req.body.meta;

    examModel.create(newexam, (error, exam) => {
      if (error) next(error);
      else {
        res.status(201);
        res.locals.data = mapper(exam, "exam");
        next();
      }
    });
  } else {
    next("Invalid Arguments"); //This error needs handling
  }
};

const update = (req, res, next) => {
  if (req.body) {
    examModel.findById(req.params.examId, (error, exam) => {
      if (error) next(error);
      else if (!exam) next("Not Found");
      else {
        let payload = {};

        if (req.body.type) payload.type = req.body.type;
        if (req.body.patientId) payload.patientId = req.body.patientId;
        if (req.body.doctorId) payload.doctorId = req.body.doctorId;
        if (req.body.clinicId) payload.clinicId = req.body.clinicId;

        if (req.body.description) payload.description = req.body.description;
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, exam.meta, req.body.meta);
        }

        exam.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.locals.data = mapper(exam, "exam");
            next();
          } else {
            examModel.findById(req.params.examId, (error, exam) => {
              if (error) next(error);
              else if (!exam) next("Not Found");
              else {
                res.status(200);
                res.locals.data = mapper(exam, "exam");
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
  examModel.findById(req.params.examId, (error, exam) => {
    if (error) next(error);
    else if (!exam) next("Not Found");
    else {
      exam.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.locals.data = mapper(deleted, "exam");
          next();
        }
      });
    }
  });
};

const retrieve = (req, res, next) => {
  examModel.findById(req.params.examId, (error, exam) => {
    if (error) next(error);
    else if (!exam) next("Not Found");
    else {
      // exam = exam.toObject();
      res.status(200);
      res.locals.data = mapper(exam, "exam");
      next();
    }
  });
};

const retrieveAll = (req, res, next) => {
  examModel
    .find(req.query)
    .lean()
    .exec((error, exams) => {
      if (error) next(error);
      else if (exams.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(exams, "exam");
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
