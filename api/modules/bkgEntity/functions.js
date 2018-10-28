const _ = require("lodash");
const {
  bkgentityModel
} = require("../../models");

const {
  mapper
} = require("../../middleware").mapper;
var moment = require('moment');
const utils = require("../../utils");

const create = (req, res, next) => {
  if (req.body.hospitalId && req.body.clinicId && req.body.frequency && req.body.closing && req.body.opening) {
    if (moment.duration(req.body.closing).asSeconds() >= moment.duration(req.body.opening).asSeconds()) {
      let payload = {
        hospitalId: req.body.hospitalId,
        clinicId: req.body.clinicId,
        frequency: req.body.frequency,
        closing: req.body.closing,
        opening: req.body.opening,
        availability: req.body.availability
      }

      bkgentityModel.create(payload, (error, bkgentity) => {
        if (error) next(error);
        else {
          res.status(201);
          res.locals.data = mapper(bkgentity, "bkgentity");
          next();
        }
      })
    } else {
      next("Invalid BkgEntity Hours");
    }
  } else {
    next("Invalid Arguments"); //This error needs handling
  }

};

const update = (req, res, next) => { //TODO: kanonika den prp na yparxei update edo giati ta bookings poy einai sindedemena
  //se ayto tha ginontai fucked up 
  if (req.body) {
    bkgentityModel.findById(req.params.bId, (error, bkgentity) => {
      if (error) next(error);
      else if (!bkgentity) next("Not Found");
      else {

        if (req.body.clinicId) bkgentity.clinicId = req.body.clinicId;
        if (req.body.hospitalId) bkgentity.hospitalId = req.body.hospitalId;
        if (req.body.frequency) bkgentity.frequency = req.body.frequency;
        if (req.body.availability) bkgentity.availability = req.body.availability;
        if (req.body.opening) bkgentity.opening = req.body.opening;
        if (req.body.closing) bkgentity.closing = req.body.closing;

        bkgentity.save((error, updatedbkgentity) => {
          if (error) next(error);
          else {
            res.locals.data = mapper(updatedbkgentity, "bkgentity");
            next();
          }
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const _delete = (req, res, next) => {
  bkgentityModel.findById(req.params.bId, (error, bkgentity) => {
    if (error) next(error);
    else if (!bkgentity) next('Not Found');
    else {
      bkgentity.delete((error, deleted) => {
        if (error) next(error);
        res.status(200);
        res.locals.data = mapper(deleted, "bkgentity");
        next();
      })
    }
  })
};

const retrieve = (req, res, next) => {
  bkgentityModel.findById(req.params.bId, (error, bkgentity) => {
    if (error) next(error);
    else if (!bkgentity) next("Not Found");
    else {
      res.status(200);
      res.locals.data = mapper(bkgentity, "bkgentity");
      next();
    }
  });
};

const retrieveAll = (req, res, next) => {
  bkgentityModel
    .find()
    .lean()
    .exec((error, bkgentities) => {
      if (error) next(error);
      else if (bkgentities.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(bkgentities, "bkgentity");
        next();
      }
    });
};

const availability = (req, res, next) => {
  if (req.body.bkgentityId && req.body.date) {
    var found = false;
    bkgentityModel.findById(req.body.bkgentityId, (err, bkgentity) => {
      if (err) next(err);
      else if (!bkgentity) {
        next("Not Found");
      } else {
        Object.getOwnPropertyNames(bkgentity.days).forEach((item) => {
          if (item === req.body.date) {
            found = true;
            res.status(200);
            res.locals.data = bkgentity.days[item];
            next();
          }
        });
        if (found) return;
        else {
          let opening = moment.duration(bkgentity.opening).asSeconds();
          let closing = moment.duration(bkgentity.closing).asSeconds();
          var slots = Math.round(Math.round((closing - opening) / 60) / bkgentity.frequency);
          let availability = [];
          for (var i = 0; i < slots; i++) {
            availability.push({
              slot: utils.helper.toHHMMSS(opening + i * bkgentity.frequency * 60),
              availability: bkgentity.availability
            })
          }
          bkgentity.days[req.body.date] = availability;
          bkgentity.markModified('days');
          bkgentity.save((error) => { //here check that the controll ends at the no availability
            if (error) next(error);
            else {
              res.status(200);
              res.locals.data = availability;
              next();
            }
          });
        }
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
  availability
};