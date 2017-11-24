$(function () {

	$('#profileForm').submit(function(event) {
		$("#formDiv" ).children('.alert:first-child').remove();
		//console.log('working');
		event.preventDefault();
		var $form = $(this);
		var body = {};
		body.firstName = $form.find('input[name="firstName"]').val();
		body.lastName = $form.find('input[name="lastName"]').val();
		body.email = $form.find('input[name="email"]').val();
		$.ajax({
		    url: '../api/users', // your api url
		    // jQuery < 1.9.0 -> use type
		    // jQuery >= 1.9.0 -> use method
		    method: 'PUT', // method is any HTTP method
		    data: body, // data as js object
		    success: function(res) {
		    	console.log(res);
		    	$("#formDiv" ).prepend('<div class="alert alert-success" role="alert"><p>' + res + '</p></div>');
		    },
		    error: function(err) {
		    	
		    	$("#formDiv" ).prepend('<div class="alert alert-danger" role="alert"><p>' + err.responseText + '</p></div>');
		    }
		});
	});

	$('#passwordReset').click(function(event) {
		$("#formDiv" ).children('.alert:first-child').remove();
		//console.log('working password reset');
		event.preventDefault();
		$.ajax({
		    url: '../api/users/requestresetpassword', // your api url
		    // jQuery < 1.9.0 -> use type
		    // jQuery >= 1.9.0 -> use method
		    method: 'GET', // method is any HTTP method// data as js object
		    success: function(res) {
		    	//console.log(res);
		    	$("#formDiv" ).prepend('<div class="alert alert-success" role="alert"><p>' + res + '</p></div>');
		    },
		    error: function(err) {
		    	$("#formDiv" ).prepend('<div class="alert alert-danger" role="alert"><p>' + err.responseText + '</p></div>');
		    }
		});
	});

});