var router = require('express').Router();
var logger = require('../util/logger');
var auth = require('../auth/auth');

var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];

router.get('/', checkUserSession, function(req, res) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.render('profile', {
		pageTitle: 'Profile',
		pageId:'profile',
		pathHome:'../',
		pathInvestment: '../investment',
		pathBuysell: '../buysell',
		pathOrders: '../orders',
		pathProfile: '/',
		pathSignout: '../signout',
		isPublic:false
	});
});

module.exports = router;
