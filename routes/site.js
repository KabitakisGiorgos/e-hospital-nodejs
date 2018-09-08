const passport=require('passport');
const login=require('connect-ensure-login');

module.exports.index = (request, response) => response.send('Hospital Helper 1.0.0');

module.exports.loginForm = (request, response) => response.render('login');

module.exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/account', failureRedirect: '/login' });

module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};

module.exports.account = [
  login.ensureLoggedIn(),
  (request, response) => response.render('account', { user: request.user }),
];
