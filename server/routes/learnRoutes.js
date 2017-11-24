var router = require('express').Router();
var logger = require('../util/logger');

router.get('/', function(req, res) {
	res.render('learn', {
		pageTitle: 'Learn',
		pageId:'learn',
		pathHome:'../',
		pathLearn:'/',
		pathAbout:'../about',
		pathSignIn:'../signin',
		pathSignUp:'../signup',
		isPublic:true
	});
});

module.exports = router;
