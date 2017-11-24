var User = require('../api/user/userModel');
var logger = require('../util/logger');

exports.signin = function() {
	return function(req, res, next) {
		logger.log('in the signin');
		res.redirect('../investment'); 
	}
};

exports.adminSignin = function() {
	return function(req, res, next) {
		res.redirect('../../admin/orderreview'); 
	}
};

exports.adminCheck = function() {
	return function(req, res, next) {
		var user = User.findById(req.user._id)
		.select('-password')
		.exec() // don't select password
		.then(function(user) {
			if(!user) {
				req.flash('error_msg','No user with that ID.');
				res.redirect('../../signin');
			} else if(user.isAdmin()) {
				next();
			}
			else {
				req.flash('error_msg','You are not logged in.');
				res.redirect('../../signin');
			}
		}, function(err) {
			next(err);
		});
	}
};