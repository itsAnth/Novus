var router = require('express').Router();
var logger = require('../util/logger');
var fundController = require('../api/fund/fundController');

router.get('/', function(req, res) {
	res.render('about', {
		pageTitle: 'Sign In',
		pageId:'about',
		pathHome:'../',
		pathLearn:'../learn',
		pathAbout:'/',
		pathSignIn:'../signin',
		pathSignUp:'../signup',
		isPublic:true
	});
});

module.exports = router;
 