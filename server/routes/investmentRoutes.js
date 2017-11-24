var router = require('express').Router();
var unitController = require('../api/unit/unitController');
var fundController = require('../api/fund/fundController');
var logger = require('../util/logger');
var auth = require('../auth/auth');



var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];

router.get('/', log, checkUserSession, fundController.getUnitValue,  unitController.getUserBalance ,function(req, res) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.render('investment', {
		pageTitle: 'Investment',
		pageId:'investment',
		pathHome:'../',
		pathInvestment: '/',
		pathBuysell: '../buysell',
		pathOrders: '../orders',
		pathProfile: '../profile',
		pathSignout: '../signout',
		firstName: req.user.firstName,
		lastName: req.user.lastName,
		email: req.user.email,
		unitPrice: req.unit,
		unitCount: req.unitCount,
		unitTotal: req.unitTotal,
		isPublic:false
	});
});

function log(req, res, next) {
	logger.log('in log');
	next();
}

/*function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('../signin');
	}
}*/

module.exports = router;
