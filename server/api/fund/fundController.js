var Fund = require('./fundModel');
var Unit = require('../unit/unitModel');
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken; // setup
var logger = require('../../util/logger');

exports.params = function(req, res, next, symbol) {
	Fund.findOne({'coinSymbol': symbol})
	.then(function(coin) {
		if(!coin) {
			next(new Error('No coin with that symbol'));
		} else {
			req.coin = coin;
			next();
		}
	}, function(err) {
		next(err);
	});
};

// Empty search will return funds
exports.get = function(req, res, next) {
	Fund.find({})
	.then(function(coins) {
		res.json(coins);
	}, function(err) {
		next(err);
	});
}; 

// params already called
exports.getOne = function(req, res, next) {
	var fundCoin = req.coin.toJson();
	res.json(fundCoin);
};

exports.put = function(req, res, next) {
	logger.log("in the put fn");
	var fundCoin = req.coin;
	logger.log(fundCoin);
	var update = req.body;
	_.merge(fundCoin, update);
	fundCoin.save(function(err, saved) {
		if (err) {
			logger.error(err);
			next(new Error(err.message));
		} else {
			res.json(saved.toJson()); // send back saved obj
		}
	});
}

exports.post = function(req, res, next) {

	var newCoin = new Fund(req.body);
	newCoin.save(function(err, coin) {
		if (err) {
			logger.error(err);
			return next(new Error('Coin name and symbol are required'));
		}
		res.json(coin.toJson());
	});
};

exports.delete = function(req, res, next) {
	req.coin.remove(function(err, removed) {
		if(err) {
			next(err);
		} else {
			res.json(removed.toJson()); // send back deleted object
		}
	});
};

exports.getUnitValue = function(req, res, next) {
	var obj = {};
	obj.total = 0;
	obj.currencies = [];
	var noBalancedUnits;
	Unit.find({unitType:'balanced', active:true}, function(err, arr) {
		if(err) {
			next(err);
		}
		if(arr !== undefined) {
			console.log(arr.length);
			noBalancedUnits = arr.length;
		}
		if (noBalancedUnits === 0) {
			next(new Error('No funds braa'));
		}
		Fund.find({fundType:'balanced'}, function(err, type) {
			if(err) {
				next(err);
			}
			if(type ===undefined) {
				next(new Error('err'));
			} else {
				
				type.forEach(function(currency) {
					var currObj = {};
					var quantity = currency.history[currency.history.length -1].coinQuantity;
					var value = currency.history[currency.history.length -1].coinValue;
					var total = Math.round(100*quantity*value)/100;
					currObj.currencyName = currency.coinName;
					currObj.currencyValue = Math.round(100/noBalancedUnits*total)/100;
					obj.currencies.push(currObj);
					obj.total += total;
				});
				obj.total = obj.total/noBalancedUnits;
				console.log(obj.currencies);
				req.unit = obj;
				next();
			}
		});
	});
};

