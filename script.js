function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

(function( $ ) {

	$(document).ready(function() {

		// @TODO load settings/charsets from cookies

		// Load Default Settings
		var settings = {
			length: 32,
			lower: true,
			upper: true,
			numbers: true,
			base_symbols: false,
			more_symbols: false,
			save: false
		};
		var first_load = true;
		if ($('#setting_length').val()) {
			first_load = false;
		}
		for (let setting in settings) {
			let setting_input = $('#setting_'+setting);
			if (setting_input.is('input[type="checkbox"]')) {
				if (first_load) {
					// Set checkmark settings
					$(setting_input).prop('checked', settings[setting]);
				}
				// Set the charset label text to match the input box text
				if ($('#charset_'+setting).length) {
					let charset = $('#charset_'+setting).val();
					$('label.charset[for="setting_' + setting + '"]').html(charset);
				}
			} else {
				if (first_load) {
					// Set non-checkmark settings
					$(setting_input).val(settings[setting]);
				}
			}
		}

		// Edit Charsets Button
		var edit_charsets_showing = false;
		$('.edit-charsets-btn').click(function() {
			if (edit_charsets_showing) {
				$('input.charset').hide();
				$('label.charset').show();
				$('input.charset').each(function() {
					$(this).parents('.setting-item').find('label.charset').html($(this).val());
				});
				$('.edit-charsets-btn').html('Edit Charsets');
				edit_charsets_showing = false;
			} else {
				$('input.charset').show();
				$('label.charset').hide();
				$('.edit-charsets-btn').html('Save Charsets');
				edit_charsets_showing = true;
			}
		});

		// Generate Password Button
		$('.generate-btn').click(function() {
			for (let setting in settings) {
				let setting_input = $('#setting_'+setting);
				if (setting_input.is('input[type="checkbox"]')) {
					if ($(setting_input).prop('checked')) {
						if ($('#charset_'+setting).length) {
							// Set charset settings values
							settings[setting] = $('#charset_'+setting).val();
						}
					} else {
						// Skip unchecked charsets
						settings[setting] = '';
					}
				} else {
					// Set non-charset settings values
					settings[setting] = $(setting_input).val();
				}
			}
			let charset = settings.lower + settings.upper + settings.numbers + settings.base_symbols + settings.more_symbols;
			let password = '';
			for (let i=0; i < settings.length; i++) {
				password += charset[Math.floor(Math.random() * charset.length)];
			}
			$('#output').val(password);
		});

		// Copy Button
		$('.copy-btn').click(function() {
			$('#output').select();
			navigator.clipboard.writeText($('#output').val());
		});

		// Load the page with a randomly generated password to begin with
		$('.generate-btn').trigger('click');

	});

})( jQuery );
