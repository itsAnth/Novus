$(function () {

	$("#buyOrderQuantity" ).change(function() {
		var unitPrice = parseFloat($("#buyUnitPrice").val());
		var quantity = parseInt($("#buyOrderQuantity").val());
		$("#buyOrderTotal").val((unitPrice*quantity).toFixed(0));
	});

	$("#sellOrderQuantity" ).change(function() {
		var unitPrice = parseFloat($("#sellUnitPrice").val());
		var quantity = parseInt($("#sellOrderQuantity").val());
		$("#sellOrderTotal").val((unitPrice*quantity).toFixed(0));
	});

	$('#buyForm').submit(function(event) {
		$("#buyForm" ).children('.alert:first-child').remove();
		event.preventDefault();
		var $form = $(this);
		var body = {};
		body.trxType = $form.find('input[name="trxType"]').val();
		body.unitType = $form.find('select[name="unitType"]').val();
		body.unitValue = $form.find('input[name="unitValue"]').val();
		body.unitQuantity = $form.find('input[name="unitQuantity"]').val();
		body.totalValue = $form.find('input[name="totalValue"]').val();
		$.ajax({
		    url: '../api/trxs', // your api url
		    // jQuery < 1.9.0 -> use type
		    // jQuery >= 1.9.0 -> use method
		    method: 'POST', // method is any HTTP method
		    data: body, // data as js object
		    success: function(res) {
		    	$("#buyForm" ).prepend('<div class="alert alert-success" role="alert"><p>' + res + '</p></div>');
		    	$('#buyForm').trigger("reset");
		    },
		    error: function(err) {
		    	$("#buyForm" ).prepend('<div class="alert alert-danger" role="alert"><p>' + err.responseText + '</p></div>');
		    }
		});
	});

$('#sellForm').submit(function(event) {
	$("#sellForm" ).children('.alert:first-child').remove();
	event.preventDefault();
	var $form = $(this);
	var body = {};
	body.trxType = $form.find('input[name="trxType"]').val();
	body.unitType = $form.find('select[name="unitType"]').val();
	body.unitValue = $form.find('input[name="unitValue"]').val();
	body.unitQuantity = $form.find('input[name="unitQuantity"]').val();
	body.totalValue = $form.find('input[name="totalValue"]').val();
	//body.withdrawMethod = $form.find('input[name="withdrawMethod"]').val();
	body.availableQuantity = $form.find('input[name="availableUnits"]').val();
	if(body.unitQuantity == 0) {
		$("#sellForm" ).prepend('<div class="alert alert-danger" role="alert"><p>You do not have any units to sell.</p></div>');
	} else if (body.unitQuantity > body.availableQuantity) {
		$("#sellForm" ).prepend('<div class="alert alert-danger" role="alert"><p>Sell quantity is more than your available funds.</p></div>');
	} else {
		$.ajax({
		    url: '../api/trxs', // your api url
		    // jQuery < 1.9.0 -> use type
		    // jQuery >= 1.9.0 -> use method
		    method: 'POST', // method is any HTTP method
		    data: body, // data as js object
		    success: function(res) {
		    	$("#sellForm" ).prepend('<div class="alert alert-success" role="alert"><p>' + res + '</p></div>');
		    	$('#sellForm').trigger("reset");
		    },
		    error: function(err) {
		    	$("#sellForm" ).prepend('<div class="alert alert-danger" role="alert"><p>' + err.responseText + '</p></div>');
		    }
		});
	}
});

});