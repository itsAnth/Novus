var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var logger = require('../../util/logger');

function coinNameValide(val) {
	if (validator.isLength(val, 3, 20)) {
		return true;
	} else {
		return false;
	}
};

function coinSymbolValidate(val) {
	if (validator.isLength(val, 2, 4) && validator.isAlpha(val)) {
		return true;
	} else {
		return false;
	}
};

var FundSchema = new Schema({
	coinName: {
		type:String,
		required: true,
		validate: [coinNameValide, 'Enter 3 to 20 in length only']
	},
	coinSymbol: {
		type: String,
		required: [true, 'coin symbol is required'],
		uppercase:true,
		validate: [coinSymbolValidate, 'Enter letters only between 2 to 4 in length']
	},
	fundType: {
		type: String,
		enum: ['balanced', 'reserves'],
		required: true
	},
	history: [
		{
			coinQuantity: {
					type: Number,
					required: true,
					min:0
			},				
			coinValue: {
					type: Number,
					required: true,
					min:0
			},
			Date: {
				type: Date,
				default: Date.now
			}
		}
	]
});

FundSchema.index({coinName:1, fundType:1}, {unique:true});

FundSchema.methods = {
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

module.exports = mongoose.model('fund', FundSchema);
