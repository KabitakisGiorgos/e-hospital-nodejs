const handleResponse = function (req, res, next) {
  //here a function for error handling seperate folder
  //Here in our errors we can put and made messages
  if (!req.route) {
    res.status(404).send({
      error:'Path '+req.path+' not found',
      data:{}
    })
  } else {
    res.send({
      error: res.locals.error ? res.locals.error : {},
      data: res.locals.data ? res.locals.data : {}
    });
  }
};

module.exports = handleResponse;