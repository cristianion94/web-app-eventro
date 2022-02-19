const express = require('express');
const router = express.Router();
var db = require('./../database/database');

const baseLoggedIn 			= '/:type(corporates|enterprise)/:type([0-9]+)';
const baseLoggedInEnterprise 	= '/enterprise/:type([0-9]+)';
const baseLoggedInCorporates 	= '/corporates/:type([0-9]+)';
const baseEvent    			= '/events/:type([0-9]+)';

router.post(baseLoggedIn, function(req, res, next) {
	var urlContent = req.url.split('/');
	var id = urlContent[2];
	var table = "clienti";
	var id_field = "id_client";
	if (urlContent[1] == "corporates") {
		table = "institutii";
		id_field = "id_institutie";
	}
	/**
		DB Query To display the Corporate / Enterprise Profile or Detail Page
	**/

	const conn = db.create_connection();

	db.getItemsCondition(conn, table, id_field, id, (err, results) => {
	    if (err) {
	      res.send({error: err});
	      return;
	    }
	    else {
	    	if (results.length > 0)
	  			res.send({success: results});
	  		else 
	  			res.send({error: "fara rezultat"});
	    }
    });
});

router.post(baseLoggedIn + '/events', function(req, res, next) {
	/**
		DB Query To display the Corporate / Enterprise Event list
		For Corporates : Display published events
		For Enterprise : Display local events published by all Corporates
	**/
	var urlContent = req.url.split('/');
	var id = urlContent[2];

	var table = "evenimente";

	const conn = db.create_connection();

	if (urlContent[1] == "corporates") {
		id_field = "id_institutie";
	    db.getItemsCondition(conn, table, id_field, id, (err, results) => {
		    if (err) {
		      res.send({error: err});
		      return;
		    }
		  	else {
		    	if (results.length > 0)
		  			res.send({success: results});
		  		else 
		  			res.send({error: "fara rezultat"});
	    	}
	    });
	}
	else {
		db.getItems(conn, table, (err, results) => {
		    if (err) {
		      res.send({error: err});
		      return;
		    }
		  	else {
		    	if (results.length > 0)
		  			res.send({success: results});
		  		else 
		  			res.send({error: "fara rezultat"});
		    }
	    });
	}
  	
});

router.post(baseLoggedIn + baseEvent, function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
		For both, coporates and enterprise, display the selected event details
	**/
	var urlContent = req.url.split('/');
	var id_field = "id_eveniment";
	var id_event = urlContent[urlContent.length - 1];

	var table = "evenimente";

	const conn = db.create_connection();

	db.getItemsCondition(conn, table, id_field, id_event, (err, results) => {
	    if (err) {
	      res.send({error: err});
	      return;
	    }
	  	else {
	    	if (results.length > 0)
	  			res.send({success: results});
	  		else 
	  			res.send({error: "fara rezultat"});
    	}
    });
});

/**
*** Enterprise Only Routes
**/
router.post(baseLoggedInEnterprise + '/events/favorites', function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
		Available only for Enterprise
		Display Favorite events
	**/
	const conn = db.create_connection();
	var table1 = "evenimente";
	var table2 = "favorite";
	var id_field = "id_client";
	
	var c1 = "id_institutie";
	var c2 = "id_institutie";
	
	var id = req.url.split('/')[2];

	console.log(id);

	db.getItemsConditionJoin(conn, table1, table2, c1, c2, id_field, id, (err, results) => {
	    if (err) {
	      res.send({error: err});
	      return;
	    }
	  	else {
	    	if (results.length > 0)
	  			res.send({success: results});
	  		else 
	  			res.send({error: "fara rezultat"});
    	}
    });
});

router.post(baseLoggedInEnterprise + baseEvent + '/buyTicket', function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
		Available only for Enterprise
		Buy ticket
	**/
	const conn = db.create_connection();

	var table_t = "bilete";
	var table = "tranzactie";

	var id_field = "id_client";
	var id_field_t = "id_eveniment";
	var content = req.url.split('/');

	var id_client = content[2];
	var id_event = content[4];

	db.getTicket(conn, table_t, id_field_t, id_event, (err, results) => {
	    if (err) {
	      res.send({error: err});
	      return;
	    }
	  	else {
	    	if (results.length == 0)
	  			res.send({error: "nu mai sunt bilete"});
	  		else {
	  			var id_bilet = results[0].id_bilet;
	  			var pret = results[0].pret;
	  			
	  			//tranzactie
				var tranzactie = {
					id_client : id_client,
					id_bilet : id_bilet,
					pret : pret
				}

				db.insertItem(conn, tranzactie, table, (err, results) => {
				    if (err) {
				      res.send({error: err});
				      return;
				    }
				    else {
				    	res.send({success : "tranzactie efectuata cu success!"});
				    	db.ticket_sold(conn, id_event, id_bilet, (err, results) => {
						    if (err) {
						      console.log(err);
						      return;
						    }
						});
					}
    			});
			}
		}
	});
});

/**
*** Crporates Only Routes
**/
router.post(baseLoggedInCorporates + baseEvent + '/delete', function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
		Available only for Corporates
		Deletes the selected event
	**/
  	res.send({success: 'success with parameters'});
});

router.post(baseLoggedInCorporates + baseEvent + '/update', function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
		Available only for Corporates
		Updates the selected event
	**/
  	res.send({success: 'success with parameters'});
});

router.post(baseLoggedInCorporates + '/events/create', function(req, res, next) {
	console.log(req.body);
	/**
		DB Query
		Available only for Corporates
		Creates new event
	**/
  	res.send({success: 'success with parameters'});
});

module.exports = router;