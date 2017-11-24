var router = require('express').Router();
var logger = require('../util/logger');
var auth = require('../auth/auth');
var moment = require('moment');
var trxController = require('../api/trx/trxController');

var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];

router.get('/', checkUserSession, trxController.get , function(req, res) {
	logger.log(req.trxHistory);
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.render('orders', {
		pageTitle: 'Orders',
		pageId:'orders',
		pathHome:'../',
		pathInvestment: '../investment',
		pathBuysell: '../buysell',
		pathOrders: '/',
		pathProfile: '../profile',
		pathSignout: '../signout',
		isPublic:false,
		trxHistory: req.trxHistory,
		moment:moment
	});
});



module.exports = router;
