var router = require('express').Router();
var logger = require('../util/logger');

router.get('/', function(req, res, next) {
	logger.log('logging out from route');
	req.logOut();
	next();

} , function(req, res) {
	res.redirect('../signin');
});

module.exports = router;
 