var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./refundController');
var auth = require('../../auth/auth');
var authController = require('../../auth/controller');

var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];

// check admin
var checkAdmin = authController.adminCheck();

// this middleware will run when a parameter is in the route
router.route('/')
	.get(checkUserSession, checkAdmin, controller.get);

module.exports = router;
