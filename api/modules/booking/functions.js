const _ = require("lodash");
const {
  bookingModel
} = require("../../models");
const {
  bkgentityModel
} = require("../../models")

const {
  mapper
} = require("../../middleware").mapper;

var moment = require('moment');
const utils = require("../../utils");

const create = (req, res, next) => { //FIXME: Not let past dates
  var found = false;
  if (req.body.bkgEntityId && req.body.patientId && req.body.timeslot && req.body.date) {
    bkgentityModel.findById(req.body.bkgEntityId, (error, bgkentity) => {
      if (error) next(error);
      else if (!bgkentity) next("Not Found");
      else {
        Object.getOwnPropertyNames(bgkentity.days).forEach((item) => {
          if (item === req.body.date) {
            found = true;
            let availability = bgkentity.days[item];
            console.log(availability);
            //Here the date exists initialized
            var bookingslot = [];
            bookingslot = bookingslot.concat(utils.helper.findObjectByKey(availability, 'slot', utils.helper.toHHMMSS(moment.duration(req.body.timeslot).asSeconds() + bgkentity.frequency * 60)));
            if (bookingslot.length === 0) {
              next("Not available Slot");
            } else {
              //here we have the slot and we are going to see if the numbers fit
              for (var i = 0; i < availability.length; i++) {
                if (bookingslot[0].slot === availability[i].slot) {
                  if (availability[i].availability - 1 < 0) { //CAUTION Hard copy every booking has 1 "value" of availability
                    next("No availability");
                  } else availability[i].availability = availability[i].availability - 1;
                }
              }
            }
            bgkentity.days[req.body.date] = availability;
            bgkentity.markModified('days');
            bgkentity.save((error) => { //here check that the controll ends at the no availability
              if (error) next(error);
              else {
                const booking = new bookingModel({
                  bkgEntityId: req.body.bkgEntityId,
                  patientId: req.body.patientId,
                  timeslot: req.body.timeslot,
                  date: req.body.date
                })
                booking.save((error, data) => {
                  if (error) next(error);
                  else {
                    res.status(201);
                    res.locals.data = mapper(data, "booking");
                    next();
                  }
                })
              }
            })
          }
        });
        if (found) return;
        else {
          let opening = moment.duration(bgkentity.opening).asSeconds();
          let closing = moment.duration(bgkentity.closing).asSeconds();
          var slots = Math.round(Math.round((closing - opening) / 60) / bgkentity.frequency);
          let availability = [];
          for (var i = 0; i < slots; i++) {
            availability.push({
              slot: utils.helper.toHHMMSS(opening + i * bgkentity.frequency * 60),
              availability: bgkentity.availability
            })
          } // Up to here we ve got the availability

          var bookingslot = [];
          bookingslot = bookingslot.concat(utils.helper.findObjectByKey(availability, 'slot', utils.helper.toHHMMSS(moment.duration(req.body.timeslot).asSeconds() + bgkentity.frequency * 60)));
          if (bookingslot.length === 0) {
            next("Not available Slot");
          } else {
            //here we have the slot and we are going to see if the numbers fit
            for (var i = 0; i < availability.length; i++) {
              if (bookingslot[0].slot === availability[i].slot) {
                if (availability[i].availability - 1 < 0) { //CAUTION Hard copy every booking has 1 "value" of availability
                  next("No availability");
                } else availability[i].availability = availability[i].availability - 1;
              }
            }
            bgkentity.days[req.body.date] = availability;
            bgkentity.markModified('days');
            bgkentity.save((error) => { //here check that the controll ends at the no availability
              if (error) next(error);
              else {
                const booking = new bookingModel({
                  bkgEntityId: req.body.bkgEntityId,
                  patientId: req.body.patientId,
                  timeslot: req.body.timeslot,
                  date: req.body.date
                })
                booking.save((error, data) => {
                  if (error) next(error);
                  else {
                    res.status(201);
                    res.locals.data = mapper(data, "booking");
                    next();
                  }
                })
              }
            })
          }
        }
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

const update = (req, res, next) => {
  if (req.body) {
    res.send('update');
  } else {
    next("Invalid Arguments");
  }
};

const _delete = (req, res, next) => {
  res.send('_delete');
};

const retrieve = (req, res, next) => {

};

const retrieveAll = (req, res, next) => {

};


module.exports = {
  create,
  update,
  delete: _delete,
  retrieve,
  retrieveAll
};