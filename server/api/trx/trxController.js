var Trx = require('./trxModel');
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken; // setup
var logger = require('../../util/logger');
var Unit = require('../unit/unitModel');
var Refund = require('../refund/refundModel');

// *** Functions to support exports ***
// called in Post, which is when the Buy or Sell form is submitted. This function
// is called in Buy only. Sets unit status to 
var onBuy = function(unitQuantity, unitType, newOwner) {
	return new Promise(function(resolve, reject) {
		Unit.find({owner: null, active: true, unitType: unitType, ownershipStatus:'none'})
		.limit(unitQuantity)
		.sort({_id: -1})
		.exec()
		.then(function(units){
			if (units.length !== unitQuantity) {
				reject('Invalid quantity for request');
			} else {
				var aUnitIds = [];
				for(var i=0; i<units.length;i++) {
					units[i].owner = newOwner; // Buy process 1. i.
							units[i].ownershipStatus = 'reserved' // Buy process 1. ii.
							units[i].save(function(err) {
								if(err) {
									reject('Something went wrong with your request.');
								}
							});
							aUnitIds.push(units[i]._id);
						}
						resolve(aUnitIds);
					}
				}, function(err) {
					reject(err);
				});
	});
};

var onSell = function(unitQuantity, unitType, currentOwner) {
	return new Promise(function(resolve, reject) {
		Unit.find({owner: currentOwner, active: true, unitType: unitType, ownershipStatus:'owned'})
		.limit(unitQuantity)
		.sort({_id: -1})
		.exec()
		.then(function(units){
			if (units.length !== unitQuantity) {
				reject('Invalid quantity for request');
			} else {
				var aUnitIds = [];
				for(var i=0; i<units.length;i++) {
							units[i].ownershipStatus = 'reserved' // Buy process 1. ii.
							units[i].save(function(err) {
								if(err) {
									reject('Something went wrong with your request.');
								}
							});
						aUnitIds.push(units[i]._id);
						}
						resolve(aUnitIds);
					}
				}, function(err) {
					reject(err);
				});
	});
};

// called on delete
var onCancelBuy = function(unitQuantity, unitType, currentOwner) {
	return new Promise(function(resolve, reject) {
		Unit.find({owner: currentOwner, active: true, unitType: unitType, ownershipStatus:'reserved'})
		.limit(unitQuantity)
		.sort({_id: -1})
		.exec()
		.then(function(units){
			if (units.length !== unitQuantity) {
				reject('Invalid quantity for request');
			} else {
				var aUnitIds = [];
				for(var i=0; i<units.length;i++) {
					units[i].owner = null; // Buy process 2a. i & 2b. i.
					units[i].ownershipStatus = 'none'; // Buy process 2a. ii. & 2b. ii.
					units[i].save(function(err) {
						if(err) {
							reject('Something went wrong with your request.');
						}
					});
					aUnitIds.push(units[i]._id);
				}
				resolve(aUnitIds);
			}
		}, function(err) {
			reject(err);
		});
	});
};

var onCancelSell = function(unitQuantity, unitType, currentOwner) {
	return new Promise(function(resolve, reject) {
		Unit.find({owner: currentOwner, active: true, unitType: unitType, ownershipStatus:'reserved'})
		.limit(unitQuantity)
		.sort({_id: -1})
		.exec()
		.then(function(units){
			if (units.length !== unitQuantity) {
				reject('Invalid quantity for request');
			} else {
				var aUnitIds = [];
				for(var i=0; i<units.length;i++) {
					units[i].ownershipStatus = 'owned'; // Buy process 2a. ii. & 2b. ii.
					units[i].save(function(err) {
						if(err) {
							reject('Something went wrong with your request.');
						}
					});
					aUnitIds.push(units[i]._id);
				}
				resolve(aUnitIds);
			}
		}, function(err) {
			reject(err);
		});
	});
};

var createRefund = function(trxId) {
	return new Promise(function(resolve, reject) {
		var refund = {};
		refund.trxId = trxId;
		var newRefund = new Refund(refund);
		newRefund.save(function(err, savedRefund) {
			if (err) {
				logger.error(err);
				reject(new Error('Something went wrong with your request.'));
			} else {
				resolve();
			}
		});
	});
};

var onCompletedBuy = function(unitId) {
	return new Promise(function(resolve, reject) {
		Unit.findById(unitId, function(err, unit) {
			if(err) {
				reject('Could not find unit with id: ' + unitId);
			}
			unit.ownershipStatus = 'owned'; // Buy process 3. ii.
			unit.save(function(err) { // Buy process 3. i.
				if(err) {
					reject('Something went wrong with your request.');
				}
				resolve();
			});
		});
	});
};

var onCompletedSell = function(aUnitIds) {
	return new Promise(function(resolve, reject) {
		Unit.find({'_id': {$in: aUnitIds}})
		.exec()
		.then(function(units){
			logger.log("found units", units);
			if (units.length !== aUnitIds.length) {
				reject('Invalid quantity for request');
			} else {
				for(var i=0; i<units.length;i++) {
					units[i].ownershipStatus = 'none' // Buy process 1. ii.
					units[i].save(function(err) {
						if(err) {
							reject('Something went wrong with your request.');
						}
					});
				}
				resolve(units);
			}
		}, function(err) {
			reject(err);
		});
	});
};

var refundTrx = function(trxId) {
	return new Promise(function(resolve, reject) {
		Refund.findOne({'trxId':trxId})
		.then(function(refund) {
			if (!refund) {
				reject(new Error('Could not find refund'));
			} else {
				refund.refunded = 'yes';
				refund.dateRefunded = Date.now();
				refund.save(function(err) {
					if(err) {
						reject(err);
					}
					resolve();
				});			
			}
		})
	});
};

// *** ***

// any request with an id input, find the transaction
// and then attach to req.transaction
exports.params = function(req, res, next, id) {
	Trx.findById(id)
	.then(function(trx) {
		if(!trx) {
			next(new Error('No transaction with that id'));
		} else {
			req.trx = trx;
			next();
		}
	}, function(err) {
		next(err);
	});
};

// Empty search will return all transactions.
// called for the orders page to view open orders
exports.get = function(req, res, next) {
	var resObj = {};
	// open orders
	Trx.find({'user': req.user._id, 'status': 'open'})
	.then(function(openTrx) {
		if(openTrx) {
			resObj.open = openTrx;
		} else {
			resObj.open = null;
		}
	}, function(err) {
		next(err);
	});
	Trx.find({'user': req.user._id, 'status': 'pending'})
	.then(function(pendingTrx) {
		if(pendingTrx) {
			resObj.pending = pendingTrx;
		} else {
			resObj.pending = null;
		}
	}, function(err) {
		next(err);
	});
	Trx.find({'user': req.user._id, 'status': 'canceled'})
	.then(function(canceledTrx) {
		if(canceledTrx) {
			resObj.canceled = canceledTrx;
		} else {
			resObj.canceled = null;
		}
	}, function(err) {
		next(err);
	});
	Trx.find({'user': req.user._id, 'status': 'completed'})
	.then(function(completedTrx) {
		if(completedTrx) {
			resObj.completed = completedTrx;
		} else {
			resObj.completed = null;
		}
		req.trxHistory = resObj;
		next();
	}, function(err) {
		next(err);
	});
};

// params already called
exports.getOne = function(req, res, next) {
	var trx = req.trx.toJson();
	res.json(trx);
};

// used in admin order review. Gets all orders
exports.getAll = function(req, res, next) {
	var resObj = {};
	var searchTrx = [
	{
		status:'pending'
	},
	{
		status:'canceled'
	},
	{
		status:'completed'
	},
	{
		status:'open'
	}
	];

	var searchDB = function() {
		var searchPromises = searchTrx
		.map(function(search) {
			logger.log('search is', search);
			if(search.status === "canceled") {
				return new Promise(function(resolve, reject) {
					Refund.find({'refunded':'no'})
					.exec()
					.then(function(arrayRefundObjs){
						var arrayIds = [];
						arrayRefundObjs.map(function(currentValue) {
							arrayIds.push(currentValue.trxId);
						});
						Trx.find({'_id': {$in: arrayIds} , 'status': 'canceled'})
						.exec()
						.then(function(refunds) {
							resolve(refunds);
						})
					}, function(err) {
						reject(err);
					});
				});
			} else {
				return Trx.find(search).exec();	
			}
		});
		return Promise.all(searchPromises);
	}
	try {
		searchDB()
		.then(function(data) {
			resObj.pending = data[0]; // pending buy or sell
			resObj.canceled = data[1]; // pending buy or sell cancel
			resObj.completed = data[2]; // completed buy or sell
			resObj.open = data[3]; // rejected buy or sell
			req.trxAll = resObj;
			next();
		});
	} catch(err) {
		next(err);
	}
};

// *** pending
// called when the buySell form is submitted
exports.post = function(req, res, next) {
	// get the body of the post and validate
	var trxType = req.body.trxType;
	var user = req.user._id;
	var unitQuantity = req.body.unitQuantity;
	var unitValue = req.body.unitValue;
	var unitType = req.body.unitType;
	var totalValue = req.body.totalValue;

	req.checkBody('trxType', 'Invalid Transaction Type').notEmpty().enumerate(['Buy', 'Sell']);
	req.checkBody('unitQuantity', 'Quantity must be between 1 and 10').notEmpty().isNumeric().gte(1).lte(10);
	req.checkBody('unitValue', 'Unit value is required.').notEmpty().isNumeric();
	req.checkBody('unitType', 'Invalid unit type').notEmpty().enumerate('balanced');
	req.checkBody('totalValue', 'Value is incorrect').notEmpty().multiplyCheck(unitQuantity, unitValue);

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
		// validated
		// build object for trx table
		var trx = {};
		trx.trxType = trxType.toLowerCase();
		trx.user = user;
		trx.unitQuantity = unitQuantity;
		trx.unitType = unitType;
		trx.unitValue = unitValue;
		trx.totalValue = totalValue;
		// change for either buy or sell
		if(trx.trxType === 'buy') {
			onBuy(parseInt(unitQuantity), unitType, req.user._id)
			.then(function(units) {
				trx.units = units; // Buy process 1. iii.
				var newTrx = new Trx(trx); // Buy process 1. iv. Default status is open.
				newTrx.save(function(err, savedTrx) {
					if (err) {
						logger.error(err);
						res.status(400).send('Something went wrong with your request.');
					} else {
						res.status(200).send('Successfully submitted order. Check the Orders tab to view order.');
					}
				});
			})
			.catch(function(err) {
				res.status(400).send(err);
			});
		} else { // it is sell. The units are cleared only when approved
			onSell(parseInt(unitQuantity), unitType, req.user._id)
			.then(function(units) {
				trx.units = units;
				var newTrx = new Trx(trx);
				newTrx.save(function(err, savedTrx) {
					if (err) {
						logger.error(err);
						res.status(400).send('Something went wrong with your request.');
					} else {
						res.status(200).send('Successfully submitted order. Check the Orders tab to view order.');
					}
				});
			});
			

			/*logger.log('sell order received');
			removeUnitAssignment(parseInt(unitQuantity), unitType, req.user._id)
			.then(function(units) {
				trx.units = units;
				logger.log(trx);
				var newTrx = new Trx(trx);
				newTrx.save(function(err, savedTrx) {
					if (err) {
						logger.error(err);
						res.status(400).send('Something went wrong with your request.');
					} else {
						res.status(200).send('Successfully submitted order. Check the Orders tab to view order.');
					}
				});
			})
			.catch(function(err) {
				res.status(400).send(err);
			});*/
}

}
};

// called in the user orders tab
exports.checkOpenOrder = function(req, res, next) {
	Trx.findOne({'user': req.user._id, 'status': 'open', 'unitType':req.body.unitType})
	.then(function(trx) {
		if(trx) {
			res.status(400).send('There is a open order with the same unit type. Please cancel the order before making a new one. bro');
		} else {
			next();
		}
	}, function(err) {
		next(err);
	});
};

// *** completed
// admin approves sell.
exports.approvePendingSell = function(req, res) {
	var trx = req.trx;
	var update = {};
	update.status = 'refunded';
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'approved pending sell.'});
	removeUnitAssignment(parseInt(trx.unitQuantity), trx.unitType, trx.user)
	.then(function(units) {
		trx.units = units;
		_.merge(trx, update);
		trx.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('The sell order has been completed and refunded.');
			}
		});
	})
	.catch(function(err) {
		res.status(400).send(err);
	});
};


// called when the user cancels their order. Both buy and sell
exports.userCancelsOrder = function(req, res) {
	var trx = req.trx;
	var update = {}
	update.status = 'canceled'; // Buy process 2a. iv.
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'canceled by ' + req.user._id}); // Buy process 2a. v.
	_.merge(trx, update); // 2a. iii. unit_id are kept.
	if( trx.trxType === 'buy') {
		onCancelBuy(parseInt(trx.unitQuantity), trx.unitType, trx.user)
		.then(createRefund(trx._id))
		.then(function() {
			trx.save(function(err, saved) {
				if (err) {
					logger.error(err);
					res.status(400).send('Something went wrong with your request.');
				} else {
					res.status(200).send('Your order has been canceled.');
				}
			});
		});
	} else {
		onCancelSell(parseInt(trx.unitQuantity), trx.unitType, trx.user)
		trx.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('Your order has been canceled.');
			}
		});
	}
	
};

// admin cancels buy
exports.adminCancelsBuy = function(req, res, next) {
	var trx = req.trx;
	var update = {};
	update.status = 'canceled'; // Buy process 2b. iv.
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'admin canceled buy. admin: ' + req.user._id}); // Buy process 2b. v.
	onCancelBuy(parseInt(trx.unitQuantity), trx.unitType, trx.user)
	.then(createRefund(trx._id))
	.then(function() {
		trx.units = [];
		_.merge(trx, update); // Buy process 2b. iii. 
		trx.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('The order has been canceled.');
			}
		});
	})
	.catch(function(err) {
		res.status(400).send(err);
	});
};

// admin approves buy.
exports.adminApprovesOpenBuy = function(req, res, next) {
	var trx = req.trx;
	var update = {};
	update.status = 'pending'; // Buy process 2c. iv.
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'approved the open buy. set to pending'}); // Buy process 2c. v.
	_.merge(trx, update); // Buy process 2c. i., ii. iii. 
	// update transaction and the unit status
	trx.save(function(err, saved) {
		if (err) {
			logger.error(err);
			res.status(400).send('Something went wrong with your request.');
		} else {
			res.status(200).send('The order has been approved.');
		}
	});
	/*var updateUnitStatus = function(id) { // we need a function to be able to pass in a variable to the promise and to use the promise multiple times
		return new Promise(function(resolve, reject) {
			Unit.findById(id)
			.then(function(unit) {
				if(!unit) {
					reject(Error('No unit with that id'));
				} else {
					unit.ownershipStatus = "confirmed";
					unit.save(function(err) {
						if(err) {
							reject(err);
						} else {
							resolve();
						}
					});
					
				}
			}, function(err) {
				reject(err);
			});
		});
	}
	var arrayOfPromises = [];
	arrayOfPromises.push(updateTrx);
	for(var i=0; i<trx.units.length; i++) {
		logger.log(trx.units[i]);
		arrayOfPromises.push(updateUnitStatus(trx.units[i]));
	}
	Promise.all(arrayOfPromises)
	.then(function() {
		logger.log('units should be updated');
		res.status(200).send('The order has been approved.');
	})
	.catch(function(err) {
		logger.error(err);
		res.status(400).send('Something went wrong with your request.');
	});*/
};

// admin completes
exports.adminCompletesPendingBuy = function(req, res) {
	var trx = req.trx;
	var update = {};
	update.status = 'completed';
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'completed pending buy. admin: ' + req.user._id});
	var arrayOfPromises = [];
	for(var i=0; i<trx.units.length; i++) {
		arrayOfPromises.push(onCompletedBuy(trx.units[i]));
	}
	Promise.all(arrayOfPromises)
	.then(function() {
		_.merge(trx, update);
		trx.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('The order has been completed.');
			}
		});
	})
	.catch(function(err) {
		logger.error(err);
		res.status(400).send('Something went wrong with your request.');
	});
};

exports.adminRefundsCanceledOrder = function(req, res) {
	var trx = req.trx;
	var update = {}
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'refunded by ' + req.user._id}); // Buy process 2a. v.
	_.merge(trx, update); // 2a. iii. unit_id are kept.
	refundTrx(trx._id)
	.then(function() {
		trx.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('The order has been refunded.');
			}
		});
	});
}

exports.adminCancelsSell = function(req, res) {
	var trx = req.trx;
	var update = {};
	update.status = 'canceled'; // Sell process 2a. i.
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'admin canceled sell. admin: ' + req.user._id});
	_.merge(trx, update); // update changes
	trx.save(function(err, saved) {
		if (err) {
			logger.error(err);
			res.status(400).send('Something went wrong with your request.');
		} else {
			res.status(200).send('The order has been canceled.');
		}
	});
};

exports.adminApprovesOpenSell = function(req, res) {
	var trx = req.trx;
	var update = {};
	update.status = 'pending';
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'approved the open sell. set to pending'});
	_.merge(trx, update);
	trx.save(function(err, saved) {
		if (err) {
			logger.error(err);
			res.status(400).send('Something went wrong with your request.');
		} else {
			res.status(200).send('The order has been approved.');
		}
	});
}

exports.adminCompletesPendingSell = function(req, res) {
	var trx = req.trx;
	var update = {};
	update.status = 'completed';
	update.editHistory = req.trx.editHistory;
	update.editHistory.push({editor:req.user._id, editDate: Date.now() , editDescription:'completed pending sell. set to complete'}); 
	// update transaction and the unit status
	onCompletedSell(trx.units) // set ownership status to none
	.then(function() {
		_.merge(trx, update);
		trx.save(function(err, saved) {
			if (err) {
				logger.error(err);
				res.status(400).send('Something went wrong with your request.');
			} else {
				res.status(200).send('The order has been completed.');
			}
		});
	})
	.catch(function(err) {
		logger.error(err);
		res.status(400).send('Something went wrong with your request.');
	});
}