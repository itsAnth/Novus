$(function () {

	$('#signupForm').submit(function(event) {
		$("#formDiv" ).children('.alert:first-child').remove();
		event.preventDefault();
		var $form = $(this);
		var body = {};
		body.firstName = $form.find('input[name="firstName"]').val();
		body.lastName = $form.find('input[name="lastName"]').val();
		body.email = $form.find('input[name="email"]').val();
		body.password = $form.find('input[name="password"]').val();
		body.password2 = $form.find('input[name="password2"]').val();
		if ($('#termsId').is(":checked"))
		{
			body.termsOfService = true;
		} else {
			body.termsOfService = false;
		}
		$.post('../api/users', body, function(res) {
			console.log(res.redirect);
			 window.location = res.redirect;
		}).error(function(err) {
				var errorText = JSON.parse(err.responseText);
				$("#formDiv" ).prepend('<div class="alert alert-danger" role="alert"><p>' + errorText.errors + '</p></div>');
			});
	});

	$('#signinForm').submit(function(event) {
		$("#formDiv" ).children('.alert:first-child').remove();
		event.preventDefault();
		var $form = $(this);
		var body = {};
		body.email = $form.find('input[name="email"]').val();
		body.password = $form.find('input[name="password"]').val();
		$.post('../auth/signin', body, function(res) {
			console.log(res);
			//window.location = res.redirect;
		}).error(function(err) {
				var errorText = JSON.parse(err.responseText);
				$("#formDiv" ).prepend('<div class="alert alert-danger" role="alert"><p>' + errorText.errors + '</p></div>');
			});
	});

	$('#profileForm').submit(function(event) {
		$("#formDiv" ).children('.alert:first-child').remove();
		event.preventDefault();
		var $form = $(this);
		var body = {};
		body.firstName = $form.find('input[name="firstName"]').val();
		body.lastName = $form.find('input[name="lastName"]').val();
		body.email = $form.find('input[name="email"]').val();
		$.put('../user', body, function(res) {
			//console.log(res);
			//window.location = res.redirect;
		}).error(function(err) {
				var errorText = JSON.parse(err.responseText);
				$("#formDiv" ).prepend('<div class="alert alert-danger" role="alert"><p>' + errorText.errors + '</p></div>');
			});
	});




});