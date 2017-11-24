$(function () {
	var trxId;
	var route;
	$('.open-buySell-accept').click(function(event) {
		trxId = event.target.id;
		var trxType = $(this).parent().parent().children('.trxType').text();
		if (trxType === 'buy') {
			route = 'aaob';
			if(trxId) {
				$('#myModalTitle').text('Confirm Open Buy')
				$('#myModalBody').text('Ensure you got the money.');
				$('#myModal').modal('toggle');
			}
		} else if (trxType === 'sell') {
			route = 'aaos';
			if(trxId) {
				$('#myModalTitle').text('Confirm Open Sell')
				$('#myModalBody').text('Ensure you sent the money.');
				$('#myModal').modal('toggle');
			}
		}
		
	});
	$('.open-buySell-cancel').click(function(event) {
		trxId = event.target.id;
		var trxType = $(this).parent().parent().children('.trxType').text();
		if (trxType === 'buy') {
			route = 'acob';
			if(trxId) {
				$('#myModalTitle').text('Confirm Open Buy Cancel')
				$('#myModalBody').text('Next, refund the money for order.');
				$('#myModal').modal('toggle');
			}
		} else if (trxType === 'sell') {
			route = 'acos';
			if(trxId) {
				$('#myModalTitle').text('Confirm Open Sell Cancel')
				$('#myModalBody').text('Make sure to keep the money.');
				$('#myModal').modal('toggle');
			}
		}
	});

	$('.pending-buySell-complete').click(function(event) {
		trxId = event.target.id;
		var trxType = $(this).parent().parent().children('.trxType').text();
		if (trxType === 'buy') {
			route = 'aapb';
			if(trxId) {
				$('#myModalTitle').text('Complete Pending Buy')
				$('#myModalBody').text('Ensure you got the money.');
				$('#myModal').modal('toggle');
			}
		} else if (trxType === 'sell') {
			route = 'aaps';
			if(trxId) {
				$('#myModalTitle').text('Complete Pending Sell')
				$('#myModalBody').text('Ensure you sent the money.');
				$('#myModal').modal('toggle');
			}
		}
		
	});

	$('.refund').click(function(event) {
		trxId = event.target.id;
		route = 'arcb';
		if(trxId) {
			$('#myModalTitle').text('Confirm Refund')
			$('#myModalBody').text('Ensure you refunded the money.');
			$('#myModal').modal('toggle');
		}
	});

	/*$('.open-sell-accept').click(function(event) {
		trxId = event.target.id;
		route = 'aps';
		if(trxId) {
			$('#myModalTitle').text('Confirm Pending Sell')
			$('#myModalBody').text('Ensure you sent the money.');
			$('#myModal').modal('toggle');
		}
	});*/



	$('#myModal').on('shown.bs.modal', function () {
		$('#myInput').focus()
	});

	$('#cancelModal').click(function(event) {
		trxId = null
	});

	$('#confirmModal').click(function(event) {
		console.log("on confirm");
		if(route) {
			console.log("in if");
			$('#myModal').modal('hide');
			$.ajax({
				url: '../api/trxs/' + route + '/' + trxId,
			    // jQuery < 1.9.0 -> use type
			    // jQuery >= 1.9.0 -> use method
			    method: 'PUT', // method is any HTTP method,
			    body:{},
			    success: function(res) {
			    	route = undefined;
			    	trxId = undefined;
			    	location.reload();
			    	//$('#' + openId).parent().parent().replaceWith('<tr><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td></tr>')
			    },
			    error: function(err) {
			    	route = undefined;
			    	trxId = undefined;
			    	$("#panel-body" ).prepend('<div class="alert alert-danger" role="alert"><p>' + err.responseText + '</p></div>');
			    }
			});
		}
		
	});

});