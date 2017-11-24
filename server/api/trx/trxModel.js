var mongoose = require('mongoose');
var Unit = require('../unit/unitModel');
var Schema = mongoose.Schema;
var validator = require('validator');
var logger = require('../../util/logger');


function validateInt(val) {
	var sVal = val.toString();
	return validator.isInt(sVal);
}

var intValidator = [validateInt, 'Unit Quantity type double is not supported'];

var TrxSchema = new Schema({
	trxType: {
		type:String,
		required: [true, '"buy" and "sell" only.'],
		enum: ['buy', 'sell']
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	unitQuantity: {
		type: Number,
		required: true,
		validate: intValidator,
		min:[1, 'Enter value between 1 and 10, included'],
		max:10
	},
	unitValue: {
		type: Number,
		required:true,
		min:0
	},
	unitType: {
		type: String,
		enum:['balanced'],
		required: true
	},
	units: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'units'
	}
	],
	trxDate: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default:'open',
		enum:['pending', 'completed', 'canceled', 'open', 'refunded']
	},
	totalValue: {
		type: Number,
		min: 0,
		required: true,
	},
	editHistory: [
	{
		editor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'units'
		},
		editDate: Date,
		editDescription: String
	}
	]
});


TrxSchema.pre('save', function(next) {
	var self = this;
	if(this.isNew) {
		this.trxDate = new Date();
		this.status = 'open';
	}
	next();
});

TrxSchema.pre('validate', function(next) {
	// set date on initial save
	if (this.isModified('trxDate')) {
		this.invalidate('trxDate', 'Date cannot be modified');
	}
	next();
});

TrxSchema.methods = {
	// convert the mongo document to an normal js obj
	toJson: function() {
		var obj = this.toObject();
		return obj;
	}
};

// From mongoose documentation: The first argument is
// the singular name of the collection your model is for.
// Mongoose automatically looks for the plural version of
// your model name. Thus, for the example above, the model
// Tank is for the tanks collection in the database.
// The .model() function makes a copy of schema. Make sure
// that you've added everything you want to schema before
// calling .model()!

module.exports = mongoose.model('trx', TrxSchema);
