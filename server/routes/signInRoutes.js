var router = require('express').Router();
var logger = require('../util/logger');

router.get('/', function(req, res) {
	res.render('signin', {
		pageTitle: 'Sign In',
		pageId:'signin',
		pathHome:'../',
		pathLearn:'../learn',
		pathAbout:'../about',
		pathSignIn:'/',
		pathSignUp:'../signup',
		isPublic:true
	});
});

module.exports = router;
 