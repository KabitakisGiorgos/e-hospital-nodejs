const knownerrors = [
  {
    error: 'Unauthorized',
    status: 401
  },
  {
    error: 'Invalid Arguments',
    status: 400
  },
  {
    error: 'MongoError',
    status: 500
  },
  {
    error: 'Not Found',
    status: 404
  }
];

const error = function(err, req, res, next) {
  //here a function for error handling seperate folder

  const result = knownerrors.find(
    error => error.error === err || error.error === err.name
  );
  if (result) {
    res.status(result.status);
    res.send({
      error: result.error,
      message: err.message ? err.message : null,
      // stack is for development
      stack: err.stack ? err.stack : null
    });
  } else if (err) {
    //unknown error
    res.status(500);
    res.send({
      error: 'Unknown Error',
      message: err.message ? err.message : null,
      // stack is for development
      stack: err.stack ? err.stack : null
    });
  }
  next();
};

module.exports = error;
