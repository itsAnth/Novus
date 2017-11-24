var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./userController');
var auth = require('../../auth/auth');
var User = require('./userModel');
var authController = require('../../auth/controller');

// check token
var checkUserToken = [auth.decodeToken(), controller.getUser];

// check session
var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];

// check admin
var checkAdmin = authController.adminCheck();

//routes use session
router.route('/')
	.get(checkUserSession, checkAdmin, controller.get)
	.post(controller.post)
	.put(checkUserSession, controller.put);

router.get('/requestresetpassword', checkUserSession, controller.requestPasswordReset);

// routes require tokens
router.get('/activate', checkUserToken, controller.activate);

router.get('/lock', checkUserToken, controller.lock);

router.put('/resetpassword', checkUserToken, controller.passwordReset);

module.exports = router;
