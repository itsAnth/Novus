var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./fundController');
var auth = require('../../auth/auth');
var authController = require('../../auth/controller');

var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];

// check admin
var checkAdmin = authController.adminCheck();

// this middleware will run when a parameter is in the route
router.param('symbol', controller.params);
router.route('/')
	.get(checkUserSession, checkAdmin, controller.get)
	.post(checkUserSession, checkAdmin, controller.post);

router.route('/:symbol')
	.get(checkUserSession, checkAdmin, controller.getOne)
	.put(checkUserSession, checkAdmin, controller.put)
	.delete(checkUserSession, checkAdmin, controller.delete);

router.route('/report')
	.get(checkUserSession, controller.getUnitValue);

module.exports = router;
