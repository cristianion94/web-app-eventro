var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
	**/
  	res.send({success: 'success'});
});

router.post('/:type(corporates|enterprise)/:type([0-9]+)', function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
	**/
  	res.send({success: 'success with parameters'});
});


module.exports = router;