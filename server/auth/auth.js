var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({secret: config.secrets.jwt});
var User = require('../api/user/userModel');
var logger = require('../util/logger');

// Token based security below
exports.decodeToken = function() {
	return function(req, res, next) {
		// token could be on query string
		if (req.query && req.query.hasOwnProperty('access_token')) {
			req.headers.authorization = 'Bearer ' + req.query.access_token;
		}
		// this will call next if token is valid
		// or send an error if it is not valid.
		// It will attach the decoded token to req.user
		checkToken(req, res, next);
	};
}
// delete
exports.getFreshUser = function() {
	return function(req, res, next) {
		/*User.findOne({ _id: req.user._id }, function (err, user) {
	      if (err) { res.status(401).send(err); }
	      if (!user) {
	        res.status(401).send('Unauthorized');
	      } else {
	      	next();
	      }
	  });*/
};
}
// Token based security above
exports.verifyUser = function() {
	return function(req, res, next) {
		var email = req.body.email;
		var password = req.body.password;

		// if no username or password then send response
		if (!email || !password) {
			req.flash('error', 'You need an email address and password.');
			res.redirect('../signin');
		}
		// look the user up in the db by email so we can compare
		// the saved password with the recieved password
		User.findOne({email: email})
		.exec()
		.then(function(user) {
			if(!user) {
				req.flash('error', 'No user with the given email.');
				res.redirect('../signin');
			} else if(!user.active) {
				req.flash('error', 'User is not active.');
				res.redirect('../signin');
			} else if(user.locked) {
				req.flash('error', 'User is locked.');
				res.redirect('../signin');
			}
			else if (!user.authenticate(password)) {
				req.flash('error', 'Wrong password.');
				res.redirect('../signin');
			} else {
				next();
			}
		});
	}
}
exports.signToken = function(id) {
	return jwt.sign(
		{_id:id},
		config.secrets.jwt,
		{expiresIn: config.expireTime}
		);
}

exports.checkAuthenticated = function() {
	return function(req, res, next) {
		if(req.isAuthenticated()){
			next();
		} else {
			req.flash('error_msg','You are not logged in.');
			res.redirect('../signin');
		}

	}
}
exports.lockCheck = function() {
	return function(req, res, next) {
		if(!req.user) {
			next(new Error('No user with that id'));
		} if(!req.user.locked) {
			next();
		} else {
			next(new Error('Something went wrong'));
		}
	}
}

exports.checkAlreadySignedIn = function() {
	return function(req, res, next) {
		if(req.user) {
			req.logout();
		}
		next();
	}
}