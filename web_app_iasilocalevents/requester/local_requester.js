const http = require('http');

exports.makeRequest = function(host, path, port, data, response) {
	var postheaders = {
      	'Content-Type' : 'application/json',
      	'Content-Length' : Buffer.byteLength(data, 'utf8')
  	};

  	var optionsPost = {
      	host : host,
      	port: port,
      	path : path,
      	headers: postheaders,
      	method : 'POST'
  	};
  	var request = http.request(optionsPost, function(res) {     
        res.on('data', function(d) {
      		console.log(String(d));
          response.status(200).send(String(d));
      	});
  	});
  
  	request.write(data);
  	request.end();
  	request.on('error', function(e) {
      	console.error(e);
  	});
}
