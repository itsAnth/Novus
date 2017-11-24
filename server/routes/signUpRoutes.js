var router = require('express').Router();
var logger = require('../util/logger');

router.get('/', function(req, res) {
	res.render('signup', {
		pageTitle: 'Sign Up',
		pageId:'signup',
		pathHome:'../',
		pathLearn:'../learn',
		pathAbout:'../about',
		pathSignIn:'../signin',
		pathSignUp:'/',
		isPublic:true
	});
});

router.get('/confirmation', function(req, res) {
	req.flash('success_msg', "Success! Please check your email for a verification link.");
	res.render('message', {
		pageTitle: 'Confirmation',
		pageId:'confirmation',
		pathHome:'../../',
		pathLearn:'../../learn',
		pathAbout:'../../about',
		pathSignIn:'../../signin',
		pathSignUp:'../',
		messageBody:'Success! Please check your email for a confirmation link. The link will expire in 1 hour.\nThe Novus Team.',
		isPublic:true
	});
});


module.exports = router;
 