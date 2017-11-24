var router = require('express').Router();
var logger = require('../util/logger');

router.get('/passwordreset', function(req, res) {
	res.render('misc', {
		pageTitle: 'Password Reset',
		pageId:'passwordreset',
		pathHome:'../../',
		pathLearn:'../../learn',
		pathAbout:'../../about',
		pathSignIn:'../../signin',
		pathSignUp:'../../signup',
		isPublic:true
	});
});

module.exports = router;
 