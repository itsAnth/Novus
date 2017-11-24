var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./trxController');
var auth = require('../../auth/auth');
var authController = require('../../auth/controller');

// checks and locks
var checkUser = [auth.decodeToken(), auth.getFreshUser()];
var checkUserSession = [auth.checkAuthenticated(), auth.lockCheck()];
var checkAdmin = authController.adminCheck();

// used for all parameters sent
router.param('id', controller.params);

/**** Step 1 in Buy Sell process ****/
// submit on buysell form. Will create trx with open status
router.route('/')
	.post(controller.checkOpenOrder, controller.post); 

/**** Step 2a in Buy process ****/
// called when the user tries to cancel order. Trx status to canceled
router.route('/:id')
	.delete(checkUserSession, controller.userCancelsOrder);

/**** Step 2b in Buy process ****/
// called when the admin cancels the order
router.route('/acob/:id')
	.put(checkUserSession, checkAdmin, controller.adminCancelsBuy);

/**** Step 2c in Buy process ****/
router.route('/aaob/:id')
	.put(checkUserSession, checkAdmin, controller.adminApprovesOpenBuy);

/**** Step 3a in Buy process ****/
router.route('/aapb/:id')
	.put(checkUserSession, checkAdmin, controller.adminCompletesPendingBuy);

/**** Step 3b in Buy process ****/
// called when admin refunds the canceled order
router.route('/arcb/:id')
	.put(checkUserSession, checkAdmin, controller.adminRefundsCanceledOrder);

/**** Step 2a in Sell process ****/
// called when admin canceles open sell
router.route('/acos/:id')
	.put(checkUserSession, checkAdmin, controller.adminCancelsSell);

/**** Step 2c in Sell process ****/
router.route('/aaos/:id')
	.put(checkUserSession, checkAdmin, controller.adminApprovesOpenSell);

/**** Step 3 in Sell process ****/
router.route('/aaps/:id')
	.put(checkUserSession, checkAdmin, controller.adminCompletesPendingSell);

/*router.route('/rpc/:id')
	.put(checkUserSession, checkAdmin, controller.rejectPendingCancel);


router.route('/aps/:id')
	.put(checkUserSession, checkAdmin, controller.approvePendingSell);*/


module.exports = router;
