var express = require('express');
var router = express.Router();
var db = require('./../database/database');

router.post('/', function(req, res, next) {
	console.log(req.body);
	var opt = req.body.opt;
    var table = "clienti";
    console.log(opt);
    if (parseInt(opt) === 2) table = "institutii";

  	const conn = db.create_connection();

  	conn.query(`SELECT * FROM ${table} WHERE email=? and parola=?;`, [req.body.email, req.body.pass], (err, results) => {
    
    console.log(err);
    if (err) {
      res.send({error: err});
      return;
    }

    if (results.length > 0) {
    	if (table === "clienti")
    		res.send({error: null, id: results[0].id_client, type: "1"});
    	else
    		res.send({error: null, id: results[0].id_institutie, type: "2"});
    	return;
    }
    else {
    	res.send({error: 'wrong'});
    	return;
    }
  });

});


module.exports = router;