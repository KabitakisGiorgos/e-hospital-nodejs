const nodemailer = require("nodemailer");
const validator = require("validator");
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseCreds.json"); //Here i have added the firebase of omnixell to just test tha push notifications are working
//i ve created also an ehospital firebase but didnt have front end app to test it when @parasiris has one ill change it here

//Source https://firebase.google.com/docs/cloud-messaging/admin/send-messages for firebase
//Source https://nodemailer.com/about/ for email
const sendemail = (from, to, subject, body, html, next) => {
  nodemailer.createTestAccount(err => {
    if (err) next(err);

    let transporter = nodemailer.createTransport({
      host: "mailhost.csd.uoc.gr",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        //Here csd account
        user: "csd****",
        pass: "*******"
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
      next(error);
    });
  });
};

const sendEmailnotification = (req, res, next) => {
  if (validator.isEmail(req.body.to) && req.body.subject && req.body.body && req.body.from) {
    sendemail(
      req.body.from + "@ehospital.gr",
      req.body.to,
      req.body.subject,
      req.body.body,
      req.body.html,
      err => {
        if (err) next(err);
        else {
          res.status(200);
          res.locals.data = {
            status: "Success"
          };
          next();
        }
      }
    );
  } else {
    next("Invalid Arguments");
  }
};

const sendpush = (payload, next) => {
  if (admin.apps.length === 0) {
    admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://seismic-glow-212911.firebaseio.com/" //this one also needs changine to ehospital firebase
      },
      "com.omnixell.client.pospush"
    );
  }

  if (!payload.message) {
    payload.message = {
      android: {
        ttl: 3600 * 1000, // 1 hour in milliseconds
        priority: "high",
        notification: {
          title: payload.title,
          body: payload.body,
          sound: "default",
          color: "#f45342"
        }
      },
      data: payload.data,
      topic: payload.topic
    };
  }
  admin
    .messaging(admin.apps[0])
    .send(payload.message)
    .then(response => {
      next(null, {
        Notification: "Success"
      });
    })
    .catch(error => {
      next(error);
    });
};

const sendPushnotification = (req, res, next) => {
  //JSON parse
  var payload = req.body.payload;
  if (typeof req.body.payload !== "object") {
    payload = JSON.parse(req.body.payload);
  }
  if (payload) {
    sendpush(payload, err => {
      if (err) next(err);
      else {
        res.status(200);
        res.locals.data = {
          status: "Success"
        };
        next();
      }
    });
  } else {
    next("Invalid Arguments");
  }
};

module.exports = {
  sendemail,
  sendpush,
  sendEmailnotification,
  sendPushnotification //this function should prolly be called by other functions too
};
