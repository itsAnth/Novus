var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UnitSchema = new Schema({
	active: {
		type:Boolean,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	ownershipStatus: {
		type: String,
		enum: ['none', 'reserved', 'owned'],
		required: true,
		default:'none'
	},
	unitType: {
		type: String,
		enum: ['balanced'],
		required: true
	}
});

UnitSchema.pre('save', function(next) {
	if(this.isNew || this.isModified('admin')) {
		this.admin = false;
	}
	return next();
});


UnitSchema.methods = {
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

module.exports = mongoose.model('unit', UnitSchema);
