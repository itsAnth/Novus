var User = require('./userModel');
var _ = require('lodash');
var email = require('../../email/email');
var signToken = require('../../auth/auth').signToken; // setup
var logger = require('../../util/logger');

// any request with an id input, find the user
// and then attach to req.user
exports.params = function(req, res, next, id) {
	User.findById(id)
	.select('-password')
	.exec() // don't select password
	.then(function(user) {
		if(!user) {
			next(new Error('No user with that id'));
		} else {
			req.user = user;
			next();
		}
	}, function(err) {
		next(err);
	});
};

// Empty search will return all users
exports.get = function(req, res, next) {
	User.find({})
	.select('-password')
	.exec()
	.then(function(users) {
		res.json(users);
	}, function(err) {
		next(err);
	});
};

// params already called
exports.getOne = function(req, res, next) {
	var user = req.user.toJson();
	res.json(user);
};

exports.put = function(req, res, next) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var user = req.user;
	req.checkBody('firstName', 'First name is required.').notEmpty();
	req.checkBody('firstName', 'First name must be between 2 - 10 characters.').isLength(2,10);
	req.checkBody('lastName', 'Last name is required.').notEmpty();
	req.checkBody('lastName', 'Last name must be between 2 - 10 characters.').isLength(2,10);
	req.checkBody('email', 'Email is required.').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		var errorMsg = '';
		for(var j = 0; j< errors.length;j++){
			if(j !== (errors.length-1)) {
				errorMsg += errors[j].msg + ' ';
			} else {
				errorMsg += errors[j].msg;
			}
		}
		res.status(400).send(errorMsg);
	} else {
		var update = {};
		update.firstName = firstName;
		update.lastName = lastName;
		update.email = email;
		_.merge(user, update);
		user.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('Successfully updated profile!');
			}
		});
	}
}

exports.post = function(req, res, next) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('firstName', 'First name is required.').notEmpty();
	req.checkBody('firstName', 'First name must be between 2 - 10 characters.').isLength(2,10);
	req.checkBody('lastName', 'Last name is required.').notEmpty();
	req.checkBody('lastName', 'Last name must be between 2 - 10 characters.').isLength(2,10);
	req.checkBody('email', 'Email is required.').notEmpty();
	req.checkBody('email', 'Email is not valid.').isEmail();
	req.checkBody('password', 'Password is required.').notEmpty();
	req.checkBody('password', 'Password must be between 6 - 14 characters.').isLength(6,12);
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		var errorMsg = '';
		for(var j = 0; j< errors.length;j++){
			if(j !== (errors.length-1)) {
				errorMsg += errors[j].msg + ' ';
			} else {
				errorMsg += errors[j].msg;
			}
		}
		req.flash('error', errorMsg);
		res.redirect('../signup');
	} else {
		var newUser = new User({
			firstName: firstName,
			lastName: lastName,
			email:email,
			password: password,
			admin:false,
			active:false
		});
		newUser.save(function(err, user) {
			if (err) {
				logger.error(err);
				req.flash('error', 'Something went wrong with your request.');
				res.redirect('../signup');
			}

			//var token = signToken(user._id);
			//res.json({token: token});
			res.redirect('../signup/confirmation');
		});
	}
	/*end new*/	
};

exports.delete = function(req, res, next) {
	// delets theuser than sent the request since decode
	// token attaches the token id to req.user.
	// Therefore, user cannot delete someone else
	req.user.remove(function(err, removed) {
		if(err) {
			next(err);
		} else {
			res.json(removed.toJson()); // send back deleted object
		}
	});
};

exports.getUser = function(req, res, next) {
	User.findById(req.user._id)
	.select('-password')
	.exec()
	.then(function(user) {
		logger.log('it trig');
		if(!user) {
			next(new Error('No user with that id'));
		} else {
			req.user = user;
			next();
		}
	}, function(err) {
		next(err);
	});
};

exports.activate = function(req, res, next) {
	var user = req.user;
	if(user.active) {
		next(new Error('User already activated.'));
	} else {
		user.active = true;
		user.save(function(err, saved) {
			if (err) {
				logger.error(err);
				(new Error('Something went wrong with your request.'));
			} else {
			req.flash('success_msg', 'You are activated and can login.');
			res.redirect('../../../signin');
		}
	});
	}
}

exports.lock = function(req, res, next) {
	var user = req.user;
	if(user.locked) {
		next(new Error('User already locked.'));
	} else {
		user.locked = true;
		user.save(function(err, saved) {
			if (err) {
				logger.error(err);
				next(new Error('Something went wrong with your request.'));
			} else {
			req.flash('success_msg', 'You account has been temporarily locked.');
			res.redirect('../../../signin');
		}
	});
	}
}

exports.requestPasswordReset = function(req, res, next) {
	if(!req.user._id || !req.user.firstName) {
		next(new Error('something went wrong'));
	} else {
		email.passwordReset(req.user.firstName, req.user._id);
		res.status(200).send('Email link has been sent to complete the password reset.');
	}
}

exports.passwordReset = function(req, res, next) {
	var user = req.user
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('password', 'Password is required.').notEmpty();
	req.checkBody('password', 'Password must be between 6 - 14 characters.').isLength(6,12);
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		var errorMsg = '';
		for(var j = 0; j< errors.length;j++){
			if(j !== (errors.length-1)) {
				errorMsg += errors[j].msg + ' ';
			} else {
				errorMsg += errors[j].msg;
			}
		}
		res.status(401).send(errorMsg);
	} else {
		var update = {};
		update.password = password;
		_.merge(user, update);
		user.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('Success! Password has been updated. You can now login.');
			}
		});
	}
}