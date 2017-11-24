var router = require('express').Router();
var logger = require('../util/logger');
var auth = require('../auth/auth');
var authController = require('../auth/controller');
var moment = require('moment');
var trxController = require('../api/trx/trxController');

var admin = [auth.checkAuthenticated(), authController.adminCheck()];

router.get('/signin', function(req, res) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.render('admin', {
		pageTitle: 'Admin',
		pageId:'adminsignin',
		pathHome:'../../',
		isPublic:true
	});
});

router.get('/orderreview', admin, trxController.getAll , function(req, res) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.render('admin', {
		pageTitle: 'Admin',
		pageId:'adminorderreview',
		pathHome:'../../',
		pathReviewOrders:'/',
		pathSignout: '../../signout',
		isPublic:false,
		trxAll: req.trxAll,
		moment:moment
	});
});

module.exports = router;
