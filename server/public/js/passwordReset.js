$(function () {
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

	$('#save').click(function(event) {
		$("#formDiv" ).children('.alert:first-child').remove();
		event.preventDefault();
		var accessToken = getUrlParameter('access_token');
		var $form = $('#formDiv');
		var body = {};
		body.password = $form.find('input[name="password"]').val();
		body.password2 = $form.find('input[name="password2"]').val();
		if((body.password !== body.password2) || body.password === undefined) {
			$("#formDiv" ).prepend('<div class="alert alert-danger" role="alert"><p>' +'Password do not match!' + '</p></div>');
		} else {
			$.ajax({
		    url: '../api/users/resetpassword', // your api url
		    // jQuery < 1.9.0 -> use type
		    // jQuery >= 1.9.0 -> use method
		    method: 'PUT', // method is any HTTP method
		    headers: {
		    	"Authorization": "Bearer " + accessToken
		    },
		    data: body, // data as js object
		    success: function(res) {
		    	$("#formDiv" ).prepend('<div class="alert alert-success" role="alert"><p>' + res + '</p></div>');
		    	$('#passwordResetForm').trigger("reset");
		    },
		    error: function(err) {
		    	$("#formDiv" ).prepend('<div class="alert alert-danger" role="alert"><p>' + err.responseText + '</p></div>');
		    }
		});
		}
	});

});