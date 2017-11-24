var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();
var config = require('./config/config');
var logger = require('./util/logger');
var api = require('./api/api');
var auth = require('./auth/routes');
var routes = require('./routes/routes');
var stripe = require('stripe')(config.keySecret);
var nocache = require('nocache')
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(config.db.url);

if(config.seed) {
	require('./util/seed');
}

// require all of the app middleware
require('./middleware/appMiddleware')(app);

// setup the static folder
app.use(express.static('server/public'));

// set the view engine
app.set('view engine', 'ejs');
app.set('views', 'server/views');
//app.use(nocache());

// setup the api routes
app.use('/api', api);
app.use('/auth', auth);

// setup the view routes
app.use('/', routes);

// setup global error handling
app.use(function(err, req, res, next) {
	if (err.name  === 'UnauthorizedError') {
		res.status(401).send('Invalid Token');
		return;
	}
	logger.log(err.stack);
	if(err.message === ''){
		res.status(500).send('Oops');
	} else{
		res.status(500).send(err.message);
	}
});

// export the app
module.exports = app;