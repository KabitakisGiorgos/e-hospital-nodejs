const _ = require("lodash");
const {
  doctorModel,
  examModel,
  patientModel
} = require("../../models");

const {
  mapper
} = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body && req.body.userId && req.body.specialty && req.body.departments) {
    let newDoctor = {
      userId: req.body.userId,
      specialty: req.body.specialty,
      departments: req.body.departments
    };

    if (req.body.diplomas) newDoctor.diplomas = req.body.diplomas;
    if (req.body.meta) newDoctor.meta = req.body.meta;

    doctorModel.create(newDoctor, (error, doctor) => {
      if (error) next(error);
      else {
        res.status(201);
        res.send(mapper(doctor, 'doctor'));
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
        if (req.body.departments) {
          payload.departments = _.concat(doctor.departments, req.body.departments);
        }

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
            res.send(mapper(doctor, 'doctor'));
          } else {
            doctorModel.findById(req.params.doctorId, (error, doctor) => {
              if (error) next(error);
              else if (!doctor) next("Not Found");
              else {
                res.status(200);
                res.send(mapper(doctor, 'doctor'));
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
          res.send(mapper(deleted, 'doctor'));
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
      res.send(mapper(doctor, 'doctor'));
    }
  });
};

const retrieveAll = (req, res, next) => {
  doctorModel
    .find()
    .lean()
    .exec((error, doctors) => {
      if (error) next(error);
      else if (doctors.length === 0) next("Not Found");
      else {
        res.status(200);
        res.send(mapper(doctors, 'doctor'));
      }
    });
};
//Bazei ston patient mia eksetasi mesa sto pinaka tou alla to thema einai oti mporeis na baleis tin idia unique 
//eksetasi polles fores se enan patient einai sto sto ayto
//db model instance of a patient
/**
 *  {
    "id": "5b9a3df5e3d5df3320d8c8a9",
    "AMKA": "12314",
    "userId": "5b96c1ff824dd83914d19981",
    "type": "what?",
    "exams": [
        {
            "created": "2018-09-14T07:42:55.664Z",
            "state": "pending",
            "_id": "5b9b668a9453632b50318342",
            "type": "blood testss",
            "patientId": "5b9a3df5e3d5df3320d8c8a9",
            "doctorId": "5b96c1ff824dd83914d19981",
            "departmentId": "5b96c1ff824dd83914d19981",
            "description": "a very important exam",
            "__v": 0
        },
        {
            "created": "2018-09-14T07:42:55.664Z",
            "state": "pending",
            "_id": "5b9b668a9453632b50318342",
            "type": "blood testss",
            "patientId": "5b9a3df5e3d5df3320d8c8a9",
            "doctorId": "5b96c1ff824dd83914d19981",
            "departmentId": "5b96c1ff824dd83914d19981",
            "description": "a very important exam",
            "__v": 0
        }
    ],
    "created": "2018-09-13T10:35:21.437Z",
    "meta": {
        "giorgo": "parasiri"
    }
}
 */

const exam = (req, res, next) => {
  if (req.body && req.body.examsId) {
    examModel.findById(req.body.examsId, (error, exam) => {
      if (error) next(error);
      else if (!exam) {
        var error = new Error('Exam Not Found');
        error.status = 404;
        next(error);
      } else {
        patientModel.findById(exam.patientId, (error, patient) => {
          if (error) next(error);
          else if (!patient) next(new Error('Patient not Found'));
          else {
            patient.exams = _.concat(patient.exams, exam);
            patient.markModified('exams');
            patient.update(patient, (error, raw) => {
              if (error) next(error);
              else{
                res.status(200);
                res.send(mapper(patient, 'patient'));
              }
            });
          }
        });
      }
    })
  } else {
    next("Invalid Arguments");
  }
}

module.exports = {
  create,
  update,
  delete: _delete,
  retrieve,
  retrieveAll,
  exam
};