var error = function (err, req, res, next) { //here a function for error handling seperate folder
    // console.log('test');    
    if (err === 'Unauthorized') {
        res.status(401);
        res.send({
            'msg': err
        });
    } else if (err) {
        res.status(401);
        res.send({
            'msg': 'error'
        });
    }
    next();
};

module.exports=[
    error
]