var Unit = require('./unitModel');
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken; // setup
var logger = require('../../util/logger');

// any request with an id input, find the user
// and then attach to req.user
exports.params = function(req, res, next, id) {
	Unit.findById(id)
	.then(function(unit) {
		if(!unit) {
			next(new Error('No unit with that id'));
		} else {
			req.unit = unit;
			next();
		}
	}, function(err) {
		next(err);
	});
};

// Empty search will return units
exports.get = function(req, res, next) {
	Unit.find({})
	.then(function(units) {
		res.json(units);
	}, function(err) {
		next(err);
	});
}; 

// params already called
exports.getOne = function(req, res, next) {
	var unit = req.unit.toJson();
	res.json(unit);
};

exports.getUserBalance = function(req, res, next) {
	Unit.find({owner:req.user._id, ownershipStatus:'owned'}, function(err, units) {
		if(err) {
			next(new Error('Something went wrong with your request'));
		}
		if(!units) {
			next(new Error('No units'));
		} else {
			req.unitCount = units.length;
			req.unitTotal = req.unitCount * req.unit.total;
			next();
		}
	});
}

exports.post = function(req, res, next) {

	var newUnit = new Unit(req.body);
	newUnit.save(function(err, unit) {
		if (err) {
			logger.error(err);
			return next(new Error(err.message));
		}
		res.json(unit.toJson());
	});
};