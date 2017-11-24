var Fund = require('../api/fund/fundModel');
var Trx = require('../api/trx/trxModel');
var Unit = require('../api/unit/unitModel');
var User = require('../api/user/userModel');
var Refund = require('../api/refund/refundModel');
var _ = require('lodash');
var logger = require('./logger');

var funds = [
	{
		coinName:'Bitcoin',
		coinSymbol:'BTC',
		fundType: 'balanced',
		history:[{
			coinQuantity:1.5,
			coinValue:200,
			Date: Date.now()
		}]
	},
	{
		coinName:'Ether',
		coinSymbol:'ETH',
		fundType: 'balanced',
		history:[{
			coinQuantity:100,
			coinValue:2,
			Date: Date.now()
		}]
	},
	{
		coinName:'Canadian Dollar',
		coinSymbol:'CAD',
		fundType: 'balanced',
		history:[{
			coinQuantity:100,
			coinValue:1,
			Date: Date.now()
		}]
	},
	{
		coinName:'Canadian Dollar',
		coinSymbol:'CAD',
		fundType: 'reserves',
		history:[{
			coinQuantity:1000.35,
			coinValue:1,
			Date: Date.now()
		}]
	}
];

var users = [
	{
		firstName:'Anthony',
		lastName:'McLeod',
		email:'admin@mail.com',
		password:'welcome'
	},
	{
		firstName:'Michael',
		lastName:'Jordan',
		email:'email1@mail.com',
		password:'welcome'
	},
	{
		firstName:'Harry',
		lastName:'Potter',
		email:'email2@mail.com',
		password:'welcome'
	}
];

var units = [
	{	
		unitObj : {
			unitType: 'balanced',
			active: true
		},
		quantity: 6
		
	},
	{
		unitObj: {
			unitType: 'balanced',
			active: false
		},
		quantity: 10
	}	
];

var createDoc = function(model, doc) {
	return new Promise(function(resolve, reject) {
		new model(doc).save(function(err, saved) {
			return err ? reject(err) : resolve(saved);
		});
	});
}

var cleanDB = function() {
	logger.log('...cleaning the DB');
	var cleanPromises = [Fund, Trx, Unit, User, Refund]
		.map(function(model) {
			return model.remove().exec();
		});
	return Promise.all(cleanPromises);
}

var createUsers = function(data) {
	var promises = users.map(function(user) {
		return createDoc(User, user);
	});

	return Promise.all(promises)
		.then(function(users) {
			return _.merge({users: users}, data || {});
		});
}

createFunds = function(data) {
	var promises = funds.map(function(currency) {
		return createDoc(Fund, currency);
	});

	return Promise.all(promises)
		.then(function(funds) {
			return _.merge({funds: funds}, data || {});
		});
}

createUnits = function(data) {
	var promisesArray = [];
	units.forEach(function(unit, index) {
		for(var i=0; i<unit.quantity; i++) {
			promisesArray.push(createDoc(Unit, unit.unitObj));
		}
	});
	return Promise.all(promisesArray)
		.then(function(units) {
			return _.merge({units: units}, data || {});
		});
}


cleanDB()
	.then(createUsers)
	.then(createFunds)
	.then(createUnits)
	.catch(function(err) {
		logger.error(err);
	});