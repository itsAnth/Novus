var router = require('express').Router();
var controller = require('./controller');
var User = require('../api/user/userModel');
var logger = require('../util/logger');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('./auth');

passport.use(new LocalStrategy({
	usernameField:'email'
},  function(username, password, done) {
	logger.log('In the local strategy');
	User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      if (!user.active) {
      	return done(null, false, { message: 'Please activate user by clicking on the emailed link.' });
      }
       if (user.locked) {
      	return done(null, false, { message: 'User is temporarily locked.' });
      }
      return done(null, user);
    });
	
}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, '-password -admin -active').exec(function(err, user) {
		done(err, user);
	}); 
});

router.post('/signin', auth.checkAlreadySignedIn(),
passport.authenticate('local', {failureRedirect:'/signin', failureFlash:true}),
controller.signin());

router.post('/admin/signin', auth.checkAlreadySignedIn(),
passport.authenticate('local', {failureRedirect:'../../signin', failureFlash:true}),
controller.adminCheck(),
controller.adminSignin());

module.exports = router;