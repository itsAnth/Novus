var router = require('express').Router();

// api router will mount other routers
// for all our resources

router.use('/users', require('./user/userRoutes'));
router.use('/funds', require('./fund/fundRoutes'));
router.use('/units', require('./unit/unitRoutes'));
router.use('/trxs', require('./trx/trxRoutes'));
router.use('/refunds', require('./refund/refundRoutes'));

module.exports = router;