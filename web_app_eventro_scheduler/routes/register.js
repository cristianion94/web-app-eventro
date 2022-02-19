var express = require('express');
var router = express.Router();
var db = require('./../database/database');

router.post('/', function(req, res, next) {

  console.log(req.body);
  const conn = db.create_connection();
  console.log(req.body);
  console.log(req.body['reg-email']);
  const client = {
    email: req.body.email,
    parola: req.body.pass
  };
  var table = "clienti";
  if (req.body.opt === "2") table = "institutii";
  if (client.parola.length<6) {
  	console.log(client.parola);
  	res.send({error: "lungime"});
    return;
  }
  else {
  conn.query(`SELECT * FROM ${table} WHERE email=?;`, [client.email], (err, results) => {
    if (err) {
      res.send({error: err});
      return;
    }
    else {
	    if (results.length > 0) {
	    	res.send({error: "exista"});
	    	return;
	    }
	    else {
	    	db.insertItem(conn, client, table, (err, results) => {
			    if (err) {
			      res.send({error: err});
			      return;
			    }
			  	res.send({error: null});
		    });
		}
	}
  });
}
  	
});

module.exports = router;