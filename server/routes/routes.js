var router = require('express').Router();
var logger = require('../util/logger');

// public
router.use('/', require('./indexRoutes'));
router.use('/learn', require('./learnRoutes'));
router.use('/about', require('./aboutRoutes'));
router.use('/signin', require('./signInRoutes'));
router.use('/signup', require('./signUpRoutes'));
router.use('/misc', require('./miscRoutes'));

// private
router.use('/investment', require('./investmentRoutes'));
router.use('/buysell', require('./buySellRoutes'));
router.use('/orders', require('./ordersRoutes'));
router.use('/profile', require('./profileRoutes'));
router.use('/signout', require('./signOutRoutes'));

// admin
router.use('/admin', require('./adminRoutes'));

module.exports = router;