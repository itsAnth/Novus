var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var validator = require('validator');
var email = require('../../email/email');
var logger = require('../../util/logger');

function validateNameString(val) {
	return validator.isLength(val, 2, 10);
};

function validatePassword(val) {
	if (validator.isLength(val, 6,14)) {
		return true;
	} else {
		return false;
	}
};

function validateEmail(val) {
	return validator.isEmail(val);
}

var nameValidator = [{validator:validator.isAlpha, msg:'Please use letters only'}, {validator:validateNameString, msg:'Please enter between 2 and 12 characters'}];

var UserSchema = new Schema({
	firstName: {
		type:String,
		required: true,
		validate: nameValidator
	},
	lastName: {
		type: String,
		required: true,
		validate:nameValidator
	},
	email: {
		type:String,
		required: true,
		unique: true,
		lowercase: true,
		validate: [validateEmail, 'Invalid Email']
	},
	password: {
		type: String,
		required: true,
		validate: [validatePassword, 'Password must be between 6-14 characters']
	},
	admin:{
		type: Boolean,
		required:true,
		default:false
	},
	active: {
		type: Boolean,
		required:true,
		default: true
	},
	locked: {
		type: Boolean,
		required:true,
		default: false
	}
});

UserSchema.pre('save', function(next) {
	if(this.isNew) {
		email.sendSignUpEmail(this.firstName, this._id);
	}
	if(this.isNew || this.isModified('admin')) {
		this.admin = false;
	}
	if (this.email === 'admin@mail.com') {
		this.admin = true;
	}
	if(this.isModified('password')) {
		this.password = this.encryptPassword(this.password);
	}
	if(this.isModified('email') && !this.isNew){
		email.sendToOrigEmailChange(this.firstName, this._id);
	}
	next();
});

UserSchema.methods = {
	// check the passwords on signin
	authenticate: function(plainTextPword) {
		return bcrypt.compareSync(plainTextPword, this.password);
	},
	encryptPassword: function(plainTextPword) {
		if(!plainTextPword) {
			return '';
		} else {
			var salt = bcrypt.genSaltSync(10);
			return bcrypt.hashSync(plainTextPword, salt);
		}
	},
	// delete password before sending back the user object and
	// convert the mongo document to an normal js obj
	toJson: function() {
		var obj = this.toObject();
		delete obj.password;
		delete obj.admin;
		delete obj.active;
		return obj;
	},

	isAdmin:function() {
		var obj = this.toObject();
		return obj.admin;
	},

	isActive: function() {
		return this.active;
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

module.exports = mongoose.model('user', UserSchema);