var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./unitController');
var auth = require('../../auth/auth');
var authController = require('../../auth/controller');

// use this to lock down the routes
var checkUser = [auth.decodeToken(), auth.getFreshUser(), authController.adminCheck()];

// this middleware will run when a parameter is in the route
router.param('id', controller.params);
router.route('/')
	.get(checkUser, controller.get)
	.post(checkUser, controller.post);

router.route('/:id')
	.get(checkUser, controller.getOne);

module.exports = router;
