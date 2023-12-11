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

		// Enable/Disable debugging
		var debug = false;
		var dbg = {};
		if ( debug == true ) {
			dbg = console;
		} else {
			dbg.clear = function() {};
			dbg.log = function() {};
		}

		// @TODO load settings/charsets from cookies

		// Load Default Settings
		var settings = {
			length: 32,
			lower: true,
			upper: true,
			numbers: true,
			base_symbols: false,
			more_symbols: false,
			require_all_charsets: true,
			ignore_repeat_characters: true,
			save: false
		};
		var charsets = {
			lower: "abcdefghijklmnopqrstuvwxyz",
			upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			numbers: "0123456789",
			base_symbols: "!@#$%^&*",
			more_symbols: "`~!@#$%^&*()_+-=[]\\{}|;':\",./<>?",
		};
		var first_load = true;
		if ($('#setting_length').val()) {
			first_load = false;
		}
		for (let setting in settings) {
			let setting_input = $('#setting_' + setting);
			let charset_input = $('#charset_' + setting);
			if (setting_input.is('input[type="checkbox"]')) {
				if (first_load) {
					// Set checkmark settings
					setting_input.prop('checked', settings[setting]);
				}
				if (charset_input.length && typeof charsets[setting] !== 'undefined') {
					// Set default charsets
					charset_input.val(charsets[setting]);
					$('label.charset[for="setting_' + setting + '"]').html(charset_input.val());
				}
			} else {
				if (first_load) {
					// Set non-checkmark settings
					setting_input.val(settings[setting]);
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
			dbg.clear();
			// Set settings/charset values from input boxes
			for (let setting in settings) {
				let setting_input = $('#setting_' + setting);
				let charset_input = $('#charset_' + setting);
				if (setting_input.is('input[type="checkbox"]')) {
					if (typeof charsets[setting] !== 'undefined') {
						if (setting_input.prop('checked')) {
							if (charset_input.length) {
								// Set charset values
								charsets[setting] = charset_input.val();
							}
						} else {
							// Skip unchecked charsets
							charsets[setting] = '';
						}
					} else {
						// Set non-charset checkmark settings
						settings[setting] = setting_input.prop('checked');
					}
				} else {
					// Set non-charset settings (password length, etc)
					settings[setting] = setting_input.val();
				}
			}

			// Allow repeating characters in charset
			let charset_basic =
				charsets.lower +
				charsets.upper +
				charsets.numbers +
				charsets.base_symbols +
				charsets.more_symbols;

			// Remove repeating characters from charset
			let charset_unique = [...new Set(charset_basic)];

			let charset = settings.ignore_repeat_characters ? charset_unique : charset_basic;
			let password = '';
			let pass_gen_tries = 0;
			let go_again = 1;
			if (charset.length) {
				while (go_again == 1 && pass_gen_tries <= 1024) {
					password = '';
					for (let i = 0; i < settings.length; i++) {
						password += charset[Math.floor(Math.random() * charset.length)];
					}
					go_again = 0;
					// Check for missing charsets in password
					if ( settings.require_all_charsets ) {
						for (let i in charsets) {
							let this_charset = charsets[i];
							let in_charset = new RegExp("[" + this_charset + "]").test(password);
							dbg.log("this_charset: ", this_charset);
							dbg.log("in_charset: ", in_charset);
							if ( ! in_charset && this_charset != '') {
								go_again = 1;
							}
						}
					}
					dbg.log("password: ", password);
					dbg.log("tries: ", pass_gen_tries);
					pass_gen_tries++;
				}
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
