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
    bkgentityModel.findById(req.body.bkgEntityId, (error, bkgentity) => {
      if (error) next(error);
      else if (!bkgentity) next("Not Found");
      else {
        Object.getOwnPropertyNames(bkgentity.days).forEach((item) => {
          if (item === req.body.date) {
            found = true;
            let availability = bkgentity.days[item];
            //Here the date exists initialized
            var bookingslot = [];
            bookingslot = bookingslot.concat(utils.helper.findObjectByKey(availability, 'slot', utils.helper.toHHMMSS(moment.duration(req.body.timeslot).asSeconds())));
            if (bookingslot.length === 0) {
              next("Not available Slot");
              return;
            } else {
              //here we have the slot and we are going to see if the numbers fit
              for (var i = 0; i < availability.length; i++) {
                if (bookingslot[0].slot === availability[i].slot) {
                  if (availability[i].availability - 1 < 0) { //CAUTION Hard copy every booking has 1 "value" of availability
                    next("No availability");
                    return;
                  } else availability[i].availability = availability[i].availability - 1;
                }
              }
            }
            bkgentity.days[req.body.date] = availability;
            bkgentity.markModified('days');
            bkgentity.save((error) => { //here check that the controll ends at the no availability
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
          let opening = moment.duration(bkgentity.opening).asSeconds();
          let closing = moment.duration(bkgentity.closing).asSeconds();
          var slots = Math.round(Math.round((closing - opening) / 60) / bkgentity.frequency);
          let availability = [];
          for (var i = 0; i < slots; i++) {
            availability.push({
              slot: utils.helper.toHHMMSS(opening + i * bkgentity.frequency * 60),
              availability: bkgentity.availability
            })
          } // Up to here we ve got the availability

          var bookingslot = [];
          bookingslot = bookingslot.concat(utils.helper.findObjectByKey(availability, 'slot', utils.helper.toHHMMSS(moment.duration(req.body.timeslot).asSeconds())));
          if (bookingslot.length === 0) {
            next("Not available Slot");
            return;
          } else {
            //here we have the slot and we are going to see if the numbers fit
            for (var i = 0; i < availability.length; i++) {
              if (bookingslot[0].slot === availability[i].slot) {
                if (availability[i].availability - 1 < 0) { //CAUTION Hard copy every booking has 1 "value" of availability
                  next("No availability");
                  return;
                } else availability[i].availability = availability[i].availability - 1;
              }
            }
            bkgentity.days[req.body.date] = availability;
            bkgentity.markModified('days');
            bkgentity.save((error) => { //here check that the controll ends at the no availability
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

const _delete = (req, res, next) => {
  bookingModel.findById(req.params.bId, (error, booking) => {
    if (error) next(error);
    else if (!booking) next('Not Found');
    else {
      bkgentityModel.findById(booking.bkgEntityId, (error, bkgentity) => {
        if (error) next(error);
        else if (!bkgentity) next('Not Found');
        else {
          let availability = bkgentity.days[moment(booking.date).format('YYYY-MM-DD')];
          for (var i = 0; i < availability.length; i++) {
            if (booking.timeslot === availability[i].slot) {
              availability[i].availability = availability[i].availability + 1; //Hardcopied that each booking has a one "value" of availability
            }
          }
          bkgentity.days[moment(booking.date).format('YYYY-MM-DD')] = availability;
          bkgentity.markModified('days');
          bkgentity.save((error) => { //here check that the controll ends at the no availability
            if (error) next(error);
            else {
              booking.delete((error, deleted) => {
                if (error) next(error);
                else {
                  res.status(200);
                  res.locals.data = mapper(deleted, "booking");
                  next();
                }
              })
            }
          })
        }
      })
    }
  })
};

const retrieve = (req, res, next) => {
  bookingModel.findById(req.params.bId, (error, booking) => {
    if (error) next(error);
    else if (!booking) next('Not Found');
    else {
      res.status(200);
      res.locals.data = mapper(booking, 'booking');
      next();
    }
  })
};

const retrieveAll = (req, res, next) => {
  bookingModel
    .find()
    .lean()
    .exec((error, bookings) => {
      if (error) next(error);
      else if (bookings.length === 0) next("Not Found");
      else {
        res.status(200);
        res.locals.data = mapper(bookings, "booking");
        next();
      }
    });
};


module.exports = {
  create,
  delete: _delete,
  retrieve,
  retrieveAll
};