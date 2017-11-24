var nodemailer = require('nodemailer');
var logger = require('../util/logger');
var config = require('../config/config');
var signToken = require('../auth/auth').signToken;


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'presales.toronto@gmail.com',
    pass: 'Temp1234'
  }
});

var mailOptions = {
  from: 'Novus Capital Investments',
  to: 'mcleod333@gmail.com',
  subject: 'DO NOT REPLY - ',
  text: ''
};

exports.sendSignUpEmail = function(name, id) {
  if(!config.email) {
    logger.log('skipping sendSignUpEmail');
  } else {
    var token = signToken(id);
    var sActivationLink = 'localhost:3000/api/users/activate?access_token='+ token;
    mailOptions.text = 'Hi ' + name + ',\n\nWelcome to Novus.\n\nPlease click the following link to complete your registration.\n\n' + sActivationLink + '\n\nRegards,\nThe Novus Team'
    mailOptions.subject.concat('Sign Up Confirmation!');
    transporter.sendMail(mailOptions, function(err, info){
      if (err) {
        logger.error(err);
      } else {
        logger.log('Email sent: ' + info.response);
      }
    });
  }
}

exports.sendToOrigEmailChange = function(name, id) {
  if(!config.email) {
    logger.log('skipping sendToOrigEmailChange');
  } else {
    var token = signToken(id);
    var sActivationLink = 'localhost:3000/api/users/lock?access_token='+ token;
    mailOptions.text = 'Hi ' + name + ',\n\nYour account email has been changed to another address.\n\nIf you did not do this, please click the following link to temporarily lock your account and contact support.\n\n' + sActivationLink + '\n\nRegards,\nThe Novus Team'
    mailOptions.subject.concat('Changes to Your Account!');
    transporter.sendMail(mailOptions, function(err, info){
      if (err) {
        logger.error(err);
      } else {
        logger.log('Email sent: ' + info.response);
      }
    });
  }
}

exports.sendToNewEmailChange = function(name, id) {
  if(!config.email) {
    logger.log('skipping sendToNewEmailChange');
  } else {
    var token = signToken(id);
    var sActivationLink = 'localhost:3000/api/users/lock?access_token='+ token;
    mailOptions.text = 'Hi ' + name + ',\n\nYour account email has been changed to this address.\n\nIf you did not do this, please click the following link to temporarily lock your account and contact support.\n\n' + sActivationLink + '\n\nRegards,\nThe Novus Team'
    mailOptions.subject.concat('Changes to Your Account!');
    transporter.sendMail(mailOptions, function(err, info){
      if (err) {
        logger.error(err);
      } else {
        logger.log('Email sent: ' + info.response);
      }
    });
  }
}

exports.passwordReset = function(name, id) {
  if(!config.email) {
    logger.log('skipping passwordReset');
  } else {
    var token = signToken(id);
    var sActivationLink = 'localhost:3000/misc/passwordreset?access_token='+ token;
    mailOptions.text = 'Hi ' + name + ',.\n\nPlease click the following link reset your password. The link will expire in 1 hour.\n\n' + sActivationLink + '\n\nRegards,\nThe Novus Team'
    mailOptions.subject.concat('Changes to Your Account!');
    transporter.sendMail(mailOptions, function(err, info){
      if (err) {
        logger.error(err);
      } else {
        logger.log('Email sent: ' + info.response);
      }
    });
  }
}