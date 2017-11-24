var router = require('express').Router();
var logger = require('../util/logger');

router.get('/', function(req, res) {
	res.render('index', {
		pageTitle: 'Home',
		pageId:'home',
		pathHome:'/',
		pathLearn:'./learn',
		pathAbout:'./about',
		pathSignIn:'./signin',
		pathSignUp:'./signup',
		isPublic:true
	});
});

module.exports = router;
