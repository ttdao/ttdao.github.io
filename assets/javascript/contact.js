function showRecaptcha(element) {
  Recaptcha.create('6LdTCK4UAAAAANRK4amTiMQ0rneWA54ivUTs4A7I', element, {
    theme: 'custom', // you can pick another at https://developers.google.com/recaptcha/docs/customization
    custom_theme_widget: 'recaptcha_widget'
  });
}

function setupRecaptcha() {
  var contactFormHost = 'https://arcane-peak-40055.herokuapp.com/',
      form = $('#contact-form'),
      notice = form.find('#notice');

  if (form.length) {
    showRecaptcha('recaptcha_widget');

    form.submit(function(ev){
      ev.preventDefault();

      $.ajax({
        type: 'POST',
        url: contactFormHost + 'send_email',
        data: form.serialize(),
        dataType: 'json',
        success: function(response) {
          switch (response.message) {
            case 'success':
              form.fadeOut(function() {
                form.html('<h4>' + form.data('success') + '</h4>').fadeIn();
              });
              break;

            case 'failure_captcha':
              showRecaptcha('recaptcha_widget');
              notice.text(notice.data('captcha-failed')).fadeIn();
              break;

            case 'failure_email':
              notice.text(notice.data('error')).fadeIn();
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          notice.text(notice.data('error')).fadeIn();
        }
      });
    });
  }
}