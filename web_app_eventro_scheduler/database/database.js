const mysql = require('mysql');

//config database
exports.create_connection = function() {
  var config = {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  };

  if (process.env.INSTANCE_CONNECTION_NAME) {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }

  // Connect to the database
  return mysql.createConnection(config);
}

//insert client
exports.insertItem = function(connection, item, table, callback) {
  connection.query(`INSERT INTO ${table} SET ?`, item, (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
}


exports.getItems = function (connection, table, callback) {
  connection.query(`SELECT * FROM ${table};`, (err, results) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, results);
  });
}

exports.getItemsCondition = function (connection, table, column, value, callback) {
  connection.query(`SELECT * FROM ${table} WHERE ${column}=?;`, [value], (err, results) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, results);
  });
}

exports.getItemsConditionJoin = function (connection, table1, table2, column1, column2, id_field, id, callback) {
  connection.query(`SELECT * FROM ${table1} INNER JOIN ${table2} ON ${table1}.${column1}=${table2}.${column2} where ${table2}.${id_field}=?;`, [id], (err, results) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, results);
  });
}

exports.getTicket = function (connection, table, column, value, callback) {
  connection.query(`SELECT id_bilet, pret FROM ${table} WHERE ${column}=? and disponibil="yes";`, [value], (err, results) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, results);
  });
}

exports.deleteItem = function (connection, table, id_item, id_name, callback) {
  connection.query(`DELETE FROM ${table} WHERE ${id_name} = ${id_item};`, (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
}

exports.updateItem = function (connection, table, id_item, id_name, field, field_value, callback) {
	console.log(field);
	console.log(field_value);
  connection.query(`UPDATE ${table} SET ${field}=? WHERE ${id_name} = ${id_item};`, [field_value], (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
}

exports.ticket_sold = function (connection, id_event, id_bilet, callback) {
  connection.query(`UPDATE bilete SET disponibil=? WHERE id_bilet = ${id_bilet};`, ["no"], (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
  connection.query(`UPDATE evenimente SET nr_disponibile=nr_disponibile-1 WHERE id_eveniment = ${id_event};`, (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
}

/*app.get('/insert', (req, res, next) => {
  // Create a visit record to be stored in the database
  const client = {
  	nume: "Vizitiu",
  	prenume: "Monica",
    email: "vizitiu.monica@gmail.com",
    parola: "monica",
    adresa: "iasi",
    telefon: "0751908763"
  };

  insertItem(client, "clienti", (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`Client:\n${client.nume}`);
  	});
});


app.get('/get', (req, res, next) => {
	var table = "clienti";
	getItems(table, (err, clienti) => {
	      if (err) {
	        next(err);
	        return;
	      }

	      res
	        .status(200)
	        .set('Content-Type', 'text/plain')
	        .send(`Clients:\n${clienti.join('\n')}`);
	});
});

app.get('/delete', (req, res, next) => {
	var table = "clienti";
	deleteItem(table, 8, "id_client", (err) => {
	      if (err) {
	        next(err);
	        return;
	      }

	      res
	        .status(200)
	        .set('Content-Type', 'text/plain')
	        .send('Deleted');
	});
});

app.get('/update', (req, res, next) => {
	var table = "clienti";
	updateItem(table, 10, "id_client", "nume", "andreea", (err) => {
	      if (err) {
	        next(err);
	        return;
	      }

	      res
	        .status(200)
	        .set('Content-Type', 'text/plain')
	        .send('Updated');
	});
});
*/
