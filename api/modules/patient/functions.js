const _ = require("lodash");
const { patientModel } = require("../../models");
const { mapper } = require("../../middleware").mapper;

const create = (req, res, next) => {
  if (req.body && req.body.AMKA && req.body.userId && req.body.type) {
    let newPatient = {
      AMKA: req.body.AMKA,
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age
    };

    if (req.body.type) newPatient.type = req.body.type;
    if (req.body.exams) newPatient.exams = req.body.exams;
    if (req.body.meta) newPatient.meta = req.body.meta;

    patientModel.create(newPatient, (error, patient) => {
      if (error) next(error);
      else {
        res.status(201);
        res.locals.data = mapper(patient, "patient");
        next();
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
        if (req.body.firstName) payload.firstName = req.body.firstName;
        if (req.body.lastName) payload.lastName = req.body.lastName;
        if (req.body.age) payload.age = req.body.age;

        if (req.body.exams) {
          payload.exams = _.concat(patient.exams, req.body.exams);
        }
        if (req.body.meta) {
          payload.meta = {};
          _.merge(payload.meta, patient.meta, req.body.meta);
        }

        patient.update(payload, (error, raw) => {
          if (error) next(error);
          else if (!raw.nModified) {
            // res.status(304);
            res.locals.data = mapper(patient, "patient");
            next();
          } else {
            patientModel.findById(req.params.patientId, (error, patient) => {
              if (error) next(error);
              else if (!patient) next("Not Found");
              else {
                res.status(200);
                res.locals.data = mapper(patient, "patient");
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
  patientModel.findById(req.params.patientId, (error, patient) => {
    if (error) next(error);
    else if (!patient) next("Not Found");
    else {
      patient.delete((error, deleted) => {
        if (error) next(error);
        else {
          res.status(200);
          res.locals.data = mapper(deleted, "patient");
          next();
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
      res.locals.data = mapper(patient, "patient");
      next();
    }
  });
};

const retrieveAll = (req, res, next) => {
  patientModel
    .find(req.query)
    .lean()
    .exec((error, patients) => {
      if (error) next(error);
      else if (patients.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(patients, "patient");
        next();
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
            "description": "a very impor  tant exam",
            "__v": 0
        }
    ],
    "created": "2018-09-13T10:35:21.437Z",
    "meta": {
        "giorgo": "parasiri"
    }
}
 */

const addExam = (req, res, next) => {
  if (req.body && req.params.examId && req.body.quantity && req.body.title) {
    examModel.findById(req.params.examId, (error, exam) => {
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
            var added = false;
            var newexam = {
              title: req.body.title,
              id: exam._id,
              type: exam.type,
              doctorId: exam.doctorId,
              quantity: parseInt(req.body.quantity),
            };

            for (var i = 0; i < patient.exams.length; i++) {
              if (patient.exams[i].id.toString() === newexam.id.toString()) {
                patient.exams[i].quantity += newexam.quantity;
                added = true;
                break;
              }
            }
            if (!added) patient.exams = _.concat(patient.exams, newexam);

            patient.markModified('exams');
            patient.update(patient, (error, raw) => {
              if (error) next(error);
              else {
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

const removeExam = (req, res, next) => {
  if (req.params.examId) {
    examModel.findById(req.params.examId, (error, exam) => {
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

            for (var i = 0; i < patient.exams.length; i++) {
              if (patient.exams[i].id.toString() === req.params.examId) patient.exams.splice(i, 1);
            }

            patient.markModified('exams');
            patient.update(patient, (error, raw) => {
              if (error) next(error);
              else {
                res.status(200);
                res.send(mapper(patient, 'patient'));
              }
            });
          }
        });
      }
    })
  } else {
    next("Invalid Arguments")
  }
}


module.exports = {
  create,
  update,
  delete: _delete,
  retrieve,
  retrieveAll,
  addExam,
  removeExam
};