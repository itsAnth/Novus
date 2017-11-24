$(function () {
	var openId;
	$('.open-delete').click(function(event) {
		console.log('working click');
		$("#panel-body" ).children('.alert:first-child').remove();
		openId = event.target.id;
		console.log(event.target.id);
		if(openId) {
			$('#myModal').modal('toggle');
		}
	});

	$('#myModal').on('shown.bs.modal', function () {
		$('#myInput').focus();
	});

	$('#cancelOpenDelete').click(function(event) {
		openId = null;
	});

	$('#confirmOpenDelete').click(function(event) {
		$('#myModal').modal('hide');
		console.log('confirm');
		console.log('the id is', openId);
		$.ajax({
		    url: '../api/trxs/' + openId,
		    // jQuery < 1.9.0 -> use type
		    // jQuery >= 1.9.0 -> use method
		    method: 'DELETE', // method is any HTTP method
		    success: function(res) {
		    	location.reload();
		    	//$('#' + openId).parent().parent().replaceWith('<tr><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td><td>--</td></tr>')
		    },
		    error: function(err) {
		    	$("#panel-body" ).prepend('<div class="alert alert-danger" role="alert"><p>' + err.responseText + '</p></div>');
		    }
		});
	});

});