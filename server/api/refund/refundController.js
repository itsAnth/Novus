var Refund = require('./refundModel');
var _ = require('lodash');
var logger = require('../../util/logger');

// Empty search will return funds
exports.get = function(req, res, next) {
	Refund.find({})
	.then(function(refund) {
		res.json(refund);
	}, function(err) {
		next(err);
	});
}; 