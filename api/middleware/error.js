const knownerrors = [
  {
    error: "Unauthorized",
    status: 401
  },
  {
    error: "Invalid Password",
    status: 402
  },
  {
    error: "Invalid Arguments",
    status: 400
  },
  {
    error: "MongoError",
    status: 500
  },
  {
    error: "Not Found",
    status: 404
  }
];

const error = function(err, req, res, next) {
  //here a function for error handling seperate folder
  //Here in our errors we can put and made messages
  const result = knownerrors.find(error => error.error === err || error.error === err.name);

  res.status(result ? result.status : 500);
  res.locals.error = {
    error: result ? result.error : "Unkown Error",
    message: err && err.message ? err.message : null,
    // stack is for development
    stack: err && err.stack ? err.stack : null
  };
  next();
};

module.exports = error;
