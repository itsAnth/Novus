var router = require('express').Router();
var unitController = require('../api/unit/unitController');
var fundController = require('../api/fund/fundController');
var logger = require('../util/logger');
var auth = require('../auth/auth');

var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];

router.get('/', checkUserSession, fundController.getUnitValue, unitController.getUserBalance, function(req, res) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.render('buysell', {
		pageTitle: 'Buy/Sell',
		pageId:'buysell',
		pathHome:'../',
		pathInvestment: '../investment',
		pathBuysell: '/',
		pathOrders: '../orders',
		pathProfile: '../profile',
		pathSignout: '../signout',
		unitPrice: req.unit.total,
		unitCount: req.unitCount,
		isPublic:false
	});
});

module.exports = router;
 