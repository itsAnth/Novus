// intro point for the server.

// setup the config file before anything
var config = require('./server/config/config');
var app = require('./server/server');
var logger = require('./server/util/logger');

app.listen(config.port);
logger.log('Express is running and listening on http://localhost:' + config.port);