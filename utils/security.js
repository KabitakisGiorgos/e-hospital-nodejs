var parse = require('parse-bearer-token');
var passport = require('passport');

// function authrorize(req, res, next) {
//     var token = parse(req);
//     if (!token) {
//         // res.error='Unauthorized';
//         next('Unauthorized');
//     }
//     else {

       
//         ]
//         test();

//     }
// }
var authrorize = [
    passport.authenticate('bearer', { session: false }),
    (req, res, next) => {
        // res.status(200);
        // res.send('test');// console.log(token);
        next('error');
    }
];

module.exports = {
    authrorize
}

