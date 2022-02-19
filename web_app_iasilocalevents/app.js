'use strict';

const requester = require('./requester/local_requester.js');
const express = require('express');
const path = require('path');
const app = express();

const HOST = 'event-scheduler-dot-iasilocalevents.appspot.com';
const EV_PORT = 80;
//const HOST = 'localhost';
//const EV_PORT = 3000;

var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
})); 

app.get('/', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/index.html'));
});

app.get('/event-scheduler/enterprise/:type([0-9]+)/events', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/events.html'));
});

app.get('/event-scheduler/corporates/:type([0-9]+)/events', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/events-hosts.html'));
});

app.get('/event-scheduler/enterprise/:type([0-9]+)/events/favorites', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/edit-favorites.html'));
});

app.get('/event-scheduler/:type(enterprise|corporates)/:type([0-9]+)/events/:type([0-9]+)', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/event-details.html'));
});

app.get('/event-scheduler/corporates/:type([0-9]+)/events/create', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/create-event.html'));
});

app.get('/event-scheduler/:type(enterprise|corporates)/:type([0-9]+)/profile', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/profile.html'));
});

app.get('/event-scheduler/enterprise/:type([0-9]+)/events/:type([0-9]+)/buyTicket', function(req, res) {
  res.status(200).sendFile(path.resolve('./view/overview-buy-tickets.html'));
});

app.post('/event-scheduler/*', function(req, res) {
  console.log(req.url);
  console.log(req.body);
  var loginCredentials = JSON.stringify({
    "email": req.body["email"],
    "pass": req.body["pass"],
    "opt": req.body["opt"]
  });
  requester.makeRequest(HOST, req.url, EV_PORT, loginCredentials, res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});