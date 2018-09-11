const nodemailer = require('nodemailer');
const validator = require("validator");

const sendemail = (from, to, subject, body, html, next) => {
  nodemailer.createTestAccount((err) => {
    if (err) return next(err);

    let transporter = nodemailer.createTransport({
      host: 'mailhost.csd.uoc.gr',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: { //Here csd account
        user: 'csd****',
        pass: '*******'
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
      html: html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return next(error);
      next();
    });
  });
};

const sendEmailnotification = (req, res, next) => { //testing function not completed
  if (validator.isEmail(req.body.to) && req.body.subject && req.body.body && req.body.from) {
    sendemail(req.body.from + '@ehospital.gr', req.body.to, req.body.subject, req.body.body, req.body.html, (err) => {
      if (err) next(err);
      else {
        res.status(200);
        res.send({
          status: "Success"
        });
      }
    });
  } else {
    next("Invalid Arguments");
  }
}

module.exports = {
  sendEmailnotification, //for testing the function
  sendemail //this function should prolly be called by other functions too
};