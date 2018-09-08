const passport=require('passport');
const login=require('connect-ensure-login');

exports.index = (request, response) => response.send('My Ouath2 Provider');

exports.loginForm = (request, response) => response.render('login');

exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/account', failureRedirect: '/login' });

exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};

exports.account = [
  login.ensureLoggedIn(),
  (request, response) => response.render('account', { user: request.user }),
];
