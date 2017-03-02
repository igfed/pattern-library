(function () {
'use strict';

// GLOBALS 
var modelUrl = 'https://search.investorsgroup.com/api/cwpsearch?';
var $location_field = $('#FindAnAdvisor_location');
var $name_field = $('#FindAnAdvisor_name');
var allConsultants = {};
var lang = 'en';
var is_name_query = false;
if (window.location.href.indexOf('-fr.') > -1) {
	lang = 'fr';
}

//Search dropdown

$(function () {

	$('.find-an-advisor-search-form-field .select-select').change(function () {
		if ($('.select-select option').val() == 'Location') {
			$('.find-an-advisor-search-form-field-location').show();
			$location_field.focus();
			$('.find-an-advisor-search-form-field-name').hide();
			is_name_query = false;
		} else if ($('.select-select option').val() == 'Name') {
			alert();
			$('.find-an-advisor-search-form-field-name').show();
			$name_field.focus();
			$('.find-an-advisor-search-form-field-location').hide();
			is_name_query = true;
		}
	}).trigger('change');
});

// Process the local prefetched data
var suggestions = {};
suggestions.locations = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.whitespace,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	prefetch: 'data/cities.json'
});
suggestions.consultants = new Bloodhound({
	// datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
	datumTokenizer: Bloodhound.tokenizers.whitespace,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	prefetch: 'data/names.json'
});
suggestions.postalCode = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.whitespace,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	prefetch: 'data/postal-code.json'
});

// Get current location
function getCoordinates() {
	if (!navigator.geolocation) {
		return;
	}
	function success(position) {
		var params = {};
		params.lang = lang;
		params.searchtype = 'con';
		params.geo = position.coords.latitude + ',' + position.coords.longitude;

		getSearchResults(params);
	}
	function error() {
		console.log('Error with geolocation');
	}
	navigator.geolocation.getCurrentPosition(success, error);
}

// Get the results
function getSearchResults(params) {
	$('#results-container, #office-search').addClass('hide').html('');
	$.getJSON(modelUrl, params).always().done(function (data) {
		var result = JSON.parse(data);
		allConsultants = shuffle(result);
		displaySearchResults('result-amount-template', allConsultants, 'results-container');
		paginateResults();
		$('html, body').animate({ scrollTop: $('#results-container').offset().top }, 750);
	}).fail(function (result) {
		console.log('Data could not be retrieved, please try again', result.status + ' ' + result.statusText);
	});

	if (params.city || params.Pcode || params.geo) {
		params.searchtype = 'office';
		params.name = '';

		$.getJSON(modelUrl, params).always().done(function (data) {
			var result = JSON.parse(data);
			if (result.length > 0) {
				displaySearchResults('office-template', result, 'office-search');
			}
		}).fail(function (result) {
			console.log('Data could not be retrieved, please try again', result.status + ' ' + result.statusText);
		});
	}
}

function shuffle(array) {
	var currentIndex = array.length,
	    temporaryValue,
	    randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function paginateResults() {
	var result = allConsultants.slice(0, 5);
	allConsultants.splice(0, 5);
	displaySearchResults('consultant-template', result, 'results-container');
	if (allConsultants.length > 0) {
		displaySearchResults('view-more-template', [], 'results-container');
	}
}
function parseSearchString() {
	var result = {};
	var search_location = $location_field.val();
	var search_name = $name_field.val();
	var postalCodeFormat = new RegExp(/[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]/);

	result.city = '';
	// result.location = '';
	result.name = '';
	result.Pcode = '';
	result.geo = '';

	// Search in the language of the page
	result.lang = lang;
	// We only search consultants from this method
	result.searchtype = 'con';
	// Check if there is a postal code
	if (postalCodeFormat.test(search_location)) {
		var postalCode = search_location.match(postalCodeFormat)[0];
		if (postalCode.indexOf(' ') === -1) {
			postalCode = postalCode.match(/.{1,3}/g).join().replace(',', ' ');
		}
		result.Pcode = postalCode;
		search_location = search_location.replace(postalCodeFormat, ' ');
	}

	if (is_name_query) {
		result.name = search_name;
	} else {
		result.city = search_location;
	}

	return result;
}

function displaySearchResults(templateID, json, destination) {
	var template = document.getElementById(templateID).innerHTML;
	Mustache.parse(template);
	var rendered = Mustache.render(template, json);
	$('#' + destination).removeClass('hide').append(rendered);
	attachComponents();
	$('#results-placeholder').addClass('hide');
}

function attachComponents() {
	$(document).foundation();
	$('[data-fetch-results]').on('click', function (e) {
		e.preventDefault();
		$(this).remove();
		paginateResults();
	});
}
function sendGoogleAnalytics(params) {
	if (params.name !== '') {
		ga('send', 'event', 'Convert', 'Search', 'ConnectToAdvisor_Name?' + params.name, 0);
	} else if (params.city !== '') {
		ga('send', 'event', 'Convert', 'Search', 'ConnectToAdvisor_Location?' + params.city, 0);
	} else if (params.Pcode !== '') {
		ga('send', 'event', 'Convert', 'Search', 'ConnectToAdvisor_Pcode?' + params.Pcode, 0);
	}
}

//Init everything
$(function () {

	// Try to predetermine what results should show
	getCoordinates();

	// Setup the typeahead
	$('.typeahead.itf_location').typeahead({
		highlight: true
	}, { name: 'locations', source: suggestions.locations, limit: 2 }, { name: 'postalCode', source: suggestions.postalCode, limit: 2 });

	$('.typeahead.itf_name').typeahead({
		highlight: true
	}, { name: 'consultants', source: suggestions.consultants, limit: 3 });

	// Setup the form submission
	$('#find-an-advisor-search').submit(function (e) {
		e.preventDefault();
		$('#SearchSubmitButton').attr('disabled', 'disabled');
		// $('.section.search-results').show();
		$('#results-placeholder').removeClass('hide');
		var params = parseSearchString();
		getSearchResults(params);
		//ga('send','event','Convert','Search','ConnectToAdvisor_Location?Toronto, ON', 0);
		sendGoogleAnalytics(params);
		// Debounce the button
		setTimeout(function () {
			$('#SearchSubmitButton').removeAttr('disabled');
		}, 10);
	});

	$(".twitter-typeahead input").on('keyup', function (e) {
		if (e.keyCode == 13) {
			// $('#find-an-advisor-search').submit();
			$('.tt-menu').hide();
		}
	});

	$location_field.focus();
});

/* This file is for methods and variables that are going to be
useful across all modules. In order to use them anywhere, import with:

 import * as ig from './global.js';

 and then call with the ig namespace (i.e., ig.pathname, ig.lang, etc)
 */

// url path


// language
var lang$1 = function () {
  if (window.location.pathname.indexOf('/fr/') !== -1) {
    return 'fr';
  } else {
    return 'en';
  }
}();

// browser width
var browserWidth = function () {
  return window.outerWidth;
}();

// base eventEmitter
var emitter = new EventEmitter();

// This is less of a module than it is a collection of code for a complete page (More page in this case).
// At some point, we should consider splitting it up into bite-sized pieces. Ex: more-nav.js, more-social.js
// and so on.

var more = (function () {
  function init() {

    // Register resize behaviour
    _resize();

    // Register Click Handlers

    // Mobile Category menu
    $('.more-section-menuitem').on('click', event, _moreSectionMenuItem);

    // Mobile Category menu
    $('.more-section-menu-mobile-title').on('click', _mobileCategoryMenu);

    // Close button
    $('.close-button').on('click', _closeButton);

    // Social drawer
    $('.js-open-socialdrawer').on('click', _openSocialDrawer);
  }

  // End of Init

  function _resize() {
    $(window).resize(function () {
      if (browserWidth < 640) {
        $('.tertiary-cta-more').removeClass('animate');
        if ($('.more-section-menu').css('display') === 'flex') {
          $('.more-section-menu').css('display', 'block');
        }
      } else {
        if ($('.more-section-menu').css('display') === 'block') {
          $('.more-section-menu').css('display', 'flex');
        }
      }
    });
  }

  function _moreSectionMenuItem() {
    event.preventDefault();

    var $this = $(this),
        offset = $this.offset(),
        width = $this.width(),
        centerX = offset.left + width / 2 - 50,
        className = $this.attr('class').match(/[\w-]*category[\w-]*/g),
        title = $this.text();

    // Filter the category dropdown on click
    _filterDropdown(className);

    // Filter the category title on click
    _filterTitle(title);

    // Arrow position move on click
    _repositionArrow(centerX);

    // Underline animation
    _animationUnderline();
  }

  function _filterDropdown(className) {
    $('.more-section-menu-dropdown-category-wrapper').fadeIn('slow').focus().filter(':not(.' + className + ')').hide();
    $('.more-section-menu-dropdown').addClass('active');
  }

  function _filterTitle(title) {
    $('p.more-section-tagline-tag').fadeOut();
    $('h1.more-section-tagline-tag').removeClass('active');
    setTimeout(function () {
      $('h1.more-section-tagline-tag').addClass('active').text(title);
    }, 200);
  }

  function _repositionArrow(centerX) {
    $('.more-section-menu-dropdown-arrow-up').show().css({ left: centerX });
  }

  function _animationUnderline() {
    $('.tertiary-cta-more').removeClass('animate');
    setTimeout(function () {
      $('.tertiary-cta-more').addClass('animate');
    }, 100);
  }

  function _closeButton() {
    $('.more-section-menu-dropdown-category-wrapper').hide();
    $('.more-section-menu-dropdown-arrow-up').hide();
    $('.tertiary-cta-more').removeClass('animate');
    $('h1.more-section-tagline-tag').removeClass('active');
    $('p.more-section-tagline-tag').fadeIn('slow');
    $('.more-section-menu-dropdown').removeClass('active');
  }

  function _mobileCategoryMenu() {
    $('.more-section-menu').toggleClass('active');
    $(this).toggleClass('active');
  }

  function _openSocialDrawer() {
    // this.next() selects next sibling element
    // any suggestions on a better way to do this?
    var jsSocialDrawer = $(this).next();

    if (jsSocialDrawer.hasClass('js-socialdrawer-opened')) {
      jsSocialDrawer.removeClass('js-socialdrawer-opened');
    } else {
      jsSocialDrawer.addClass('js-socialdrawer-opened');
    }
  }

  return {
    init: init
  };
})();

var forms = (function () {

  var endpointURL, successURL, cancelURL, $form, $formWrapper;

  function init() {
    // Forms should always be wrapped in '.ig-form'
    $formWrapper = $('.ig-form');
    $form = $formWrapper.find('form');
    endpointURL = $formWrapper.find('form').data('endpoint');
    cancelURL = $formWrapper.find('form').data('cancel');

    _validation();
    _toggler();
  }

  function _validation() {
    // We need to check whether an input is 'dirty' or not (similar to how Angular 1 works) in order for labels to behave properly
    var jInput = $(':input, textarea');
    jInput.change(function (objEvent) {
      $(this).addClass('dirty');
    });

    $.validator.setDefaults({
      debug: true,
      success: 'valid'
    });

    $.validator.addMethod('cdnPostal', function (postal, element) {
      return this.optional(element) || postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
    }, 'Please specify a valid postal code.');

    $form.validate({
      submitHandler: function submitHandler() {
        _process();
      },
      errorPlacement: function errorPlacement(label, element) {
        // Use the custom-error-location marker class to change where the error label shows up
        if (!$(element).closest('.row').find('.custom-error-location').length) {
          $(element).parent().append(label);
        } else {
          $(element).closest('.row').find('.custom-error-location').append(label);
        }
      },
      rules: {
        phone: {
          required: true,
          phoneUS: true
        },
        phone2: {
          required: true,
          phoneUS: true
        },
        postal_code: {
          required: true,
          cdnPostal: true
        },
        firstname: {
          required: true,
          maxlength: 100
        },
        lastname: {
          required: true,
          maxlength: 100
        },
        email: {
          required: true,
          maxlength: 100
        },
        email2: {
          required: true,
          maxlength: 100
        }
      }
    });

    $form.find('button.cancel').on('click', function () {
      window.location.replace(cancelURL);
    });
  }

  function _process(form) {
    var formDataRaw, formDataParsed;

    if ($form.valid()) {
      $form.removeClass('server-error');
      $formWrapper.addClass('submitting');
      formDataRaw = $form.serializeArray();
      // If we need to modify the data, use parse method
      formDataParsed = _parse(formDataRaw);
      // Submit final data
      _submit(formDataParsed);
    }
    return false;
  }

  function _parse(data) {
    // Execute any custom logic here


    return data;
  }

  function _submit(data) {
    $.ajax({
      method: 'POST',
      url: endpointURL,
      data: data
    }).success(function (msg) {
      $formWrapper.addClass('success');
      $formWrapper.removeClass('submitting');
    }).error(function (msg) {
      $form.addClass('server-error');
      $formWrapper.removeClass('submitting');
      ScrollMan.to($('#server-error'));
    });
  }

  function _toggler() {
    // Very simple form toggler
    $('.toggler').on('click', function () {
      $('.toggle-content').hide();
      $('.' + $(this).data('content')).show();
    });
  }

  return {
    init: init
  };
})();

var carousel = (function () {

  function init() {
    console.log('Carousel Initialized!');

    // Not sure what this does at this point or how it relates to Carousels
    $('[data-responsive-toggle] button').on('click', function () {
      $('body').toggleClass('site-header-is-active');
    });

    _buildCarousel();
  }

  function _buildCarousel() {
    var prevArrow, nextArrow, $carousel;

    $('.ig-carousel').each(function (index) {
      $carousel = $(this);
      prevArrow = $carousel.data('prevArrowText') ? '<button type="button" class="slick-prev"><span class="show-for-sr">' + $carousel.data('prevArrowText') + '</span></button>' : '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>';
      nextArrow = $carousel.data('nextArrowText') ? '<button type="button" class="slick-next"><span class="show-for-sr">' + $carousel.data('nextArrowText') + '</span></button>' : '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>';

      $carousel.slick({
        adaptiveHeight: $carousel.data('adaptiveHeight') || false,
        arrows: $carousel.data('arrows') || false,
        autoPlay: $carousel.data('autoPlay') || false,
        dots: $carousel.data('dots') || false,
        fade: $carousel.data('fade') || false,
        infinite: $carousel.data('infinite') || false,
        mobileFirst: true,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        responsive: $carousel.data('responsive') || '',
        slide: $carousel.data('slide') || '',
        slidesToScroll: $carousel.data('slideToScroll') || 1,
        slidesToShow: $carousel.data('slidesToShow') || 1,
        speed: $carousel.data('speed') || 300
      });
    });
  }

  return {
    init: init
  };
})();

var evt1 = (function () {

  // Define component-level variables
  var messages = [],
      counter = 0;

  function init(scope) {
    // Often a good idea to init with an HTML scope (ie, class)
    var $this = $(scope);

    // Let's create a message array
    messages = ['Hello!', 'Is it me you\'re looking for?', 'I can see it in your eyes', 'I can see it in your smile', 'You\'re all I\'ve ever wanted', 'And my arms are open wide', '\'cause you know just what to say', 'And you know just what to do', 'And I want to tell you so much'];

    // Register click handler
    $this.find('a.button.message').on('click', event, _sayHello);
  }

  function _sayHello() {
    // Let's emit an event with an indentifier of 'hello' and send along something to display
    emitter.emit('hello', messages[counter]);
    counter += 1;
  }

  return {
    init: init
  };
})();

var evt2 = (function () {
  var $this;

  function init(scope) {
    // Often a good idea to init with an HTML scope (ie, class)
    $this = $(scope);
    _listener();
  }

  // We know nothing about the component that will send the message. Only that it will have
  // an identifier of 'hello' and that we will receive a 'message' to display.
  function _listener() {
    emitter.on('hello', function (message) {
      $('<p class="alert-box alert">' + message + '</p>').hide().appendTo($this).fadeIn('fast');
    });
  }

  return {
    init: init
  };
})();

/* This file is the entry point for rollup (http://rollupjs.org/) and
 essentionally 'bootstraps' our ig.com 'application'.

 All modules should be imported here so that they can be initialized on
 a case-by-case basis (not all pages require the initialization of a carousel
 for instance).

 Any tasks or processes that need to be initiated on page load should live in this
 file as well. An included example is a method that adds an 'en' or 'fr' class to
 the body based on the global language variable that we can then use to write custom
 styles for each language.
 */

// Event Emitter test modules
var app = function () {
  function init() {

    // Initialize Foundation
    $(document).foundation();

    // Check for components
    if ($('.ig-form').length) forms.init();
    if ($('.more-section').length) more.init();
    if ($('.ig-carousel').length) carousel.init();

    // Components can also be setup to receive an HTML 'scope' (.ig-evt1... .ig-evt2.... etc)
    if ($('.ig-evt1').length) evt1.init('.ig-evt1');
    if ($('.ig-evt2').length) evt2.init('.ig-evt2');

    // Add language class to body
    _language();
  }

  // Let's use a global variable (global as in available to all our components - not the window object!)
  // to add a class to the body tag
  function _language() {
    $('body').addClass(lang$1);
  }

  return {
    init: init
  };
}();

// Bootstrap app
$(document).ready(function () {
  app.init();
});

}());

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9maW5kLWFuLWFkdmlzb3Itc2VhcmNoLmpzIiwibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvZXZlbnQtdGVzdC0xLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTIuanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBHTE9CQUxTIFxudmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XG52YXIgJGxvY2F0aW9uX2ZpZWxkID0gJCgnI0ZpbmRBbkFkdmlzb3JfbG9jYXRpb24nKTtcbnZhciAkbmFtZV9maWVsZCA9ICQoJyNGaW5kQW5BZHZpc29yX25hbWUnKTtcbnZhciBhbGxDb25zdWx0YW50cyA9IHt9O1xudmFyIGxhbmcgPSAnZW4nO1xudmFyIGlzX25hbWVfcXVlcnkgPSBmYWxzZTtcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy1mci4nKSA+IC0xKSB7XG4gICAgbGFuZyA9ICdmcic7XG59XG5cbi8vU2VhcmNoIGRyb3Bkb3duXG5cbiQoZnVuY3Rpb24oKSB7XG5cbiAgJCgnLmZpbmQtYW4tYWR2aXNvci1zZWFyY2gtZm9ybS1maWVsZCAuc2VsZWN0LXNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICBpZiggJCgnLnNlbGVjdC1zZWxlY3Qgb3B0aW9uJykudmFsKCkgPT0gJ0xvY2F0aW9uJykge1xuICAgICAgJCgnLmZpbmQtYW4tYWR2aXNvci1zZWFyY2gtZm9ybS1maWVsZC1sb2NhdGlvbicpLnNob3coKTtcbiAgICAgICRsb2NhdGlvbl9maWVsZC5mb2N1cygpO1xuICAgICAgJCgnLmZpbmQtYW4tYWR2aXNvci1zZWFyY2gtZm9ybS1maWVsZC1uYW1lJykuaGlkZSgpO1xuICAgICAgaXNfbmFtZV9xdWVyeSA9IGZhbHNlO1xuXG4gICAgfVxuICAgIGVsc2UgaWYoICQoJy5zZWxlY3Qtc2VsZWN0IG9wdGlvbicpLnZhbCgpID09ICdOYW1lJykge1xuICAgIFx0YWxlcnQoKTtcbiAgICAgICQoJy5maW5kLWFuLWFkdmlzb3Itc2VhcmNoLWZvcm0tZmllbGQtbmFtZScpLnNob3coKTtcbiAgICAgICAkbmFtZV9maWVsZC5mb2N1cygpO1xuICAgICAgJCgnLmZpbmQtYW4tYWR2aXNvci1zZWFyY2gtZm9ybS1maWVsZC1sb2NhdGlvbicpLmhpZGUoKTtcbiAgICAgIGlzX25hbWVfcXVlcnkgPSB0cnVlO1xuICAgIH0gICAgICBcblxuICB9KS50cmlnZ2VyKCdjaGFuZ2UnKTtcbn0pO1xuXG5cbi8vIFByb2Nlc3MgdGhlIGxvY2FsIHByZWZldGNoZWQgZGF0YVxudmFyIHN1Z2dlc3Rpb25zID0ge307XG5cdHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcblx0XHRkYXR1bVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXG5cdFx0cXVlcnlUb2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxuXHRcdHByZWZldGNoOiAnZGF0YS9jaXRpZXMuanNvbidcblx0fSk7XG5cdHN1Z2dlc3Rpb25zLmNvbnN1bHRhbnRzID0gbmV3IEJsb29kaG91bmQoe1xuXHRcdC8vIGRhdHVtVG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMub2JqLndoaXRlc3BhY2UoXCJuYW1lXCIpLFxuXHRcdGRhdHVtVG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcblx0XHRxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXG5cdFx0cHJlZmV0Y2g6ICdkYXRhL25hbWVzLmpzb24nXG5cdH0pO1xuXHRzdWdnZXN0aW9ucy5wb3N0YWxDb2RlID0gbmV3IEJsb29kaG91bmQoe1xuXHRcdGRhdHVtVG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcblx0XHRxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXG5cdFx0cHJlZmV0Y2g6ICdkYXRhL3Bvc3RhbC1jb2RlLmpzb24nXG5cdH0pO1xuXG4vLyBHZXQgY3VycmVudCBsb2NhdGlvblxuZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXMoKSB7XG5cdGlmICghbmF2aWdhdG9yLmdlb2xvY2F0aW9uKXtcblx0XHRyZXR1cm47XG5cdH1cblx0ZnVuY3Rpb24gc3VjY2Vzcyhwb3NpdGlvbikge1xuXHRcdHZhciBwYXJhbXMgPSB7fTtcblx0XHRwYXJhbXMubGFuZyA9IGxhbmc7XG5cdFx0cGFyYW1zLnNlYXJjaHR5cGUgPSAnY29uJztcblx0XHRwYXJhbXMuZ2VvID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICsnLCcrIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XG5cblx0XHRnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcyk7XG5cdH1cblx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdFx0Y29uc29sZS5sb2coJ0Vycm9yIHdpdGggZ2VvbG9jYXRpb24nKTtcblx0fVxuXHRuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKHN1Y2Nlc3MsIGVycm9yKTtcbn1cblxuLy8gR2V0IHRoZSByZXN1bHRzXG5mdW5jdGlvbiBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcykge1xuXHQkKCcjcmVzdWx0cy1jb250YWluZXIsICNvZmZpY2Utc2VhcmNoJykuYWRkQ2xhc3MoJ2hpZGUnKS5odG1sKCcnKTtcblx0JC5nZXRKU09OKG1vZGVsVXJsLCBwYXJhbXMpXG5cdC5hbHdheXMoKVxuXHQuZG9uZShmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZShkYXRhKTtcblx0XHRhbGxDb25zdWx0YW50cyA9IHNodWZmbGUocmVzdWx0KTtcblx0XHRkaXNwbGF5U2VhcmNoUmVzdWx0cygncmVzdWx0LWFtb3VudC10ZW1wbGF0ZScsIGFsbENvbnN1bHRhbnRzLCAncmVzdWx0cy1jb250YWluZXInKTtcblx0XHRwYWdpbmF0ZVJlc3VsdHMoKTtcblx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAkKCcjcmVzdWx0cy1jb250YWluZXInKS5vZmZzZXQoKS50b3B9LCA3NTApO1xuXHR9KVxuXHQuZmFpbChmdW5jdGlvbiggcmVzdWx0ICkge1xuXHRcdGNvbnNvbGUubG9nKCdEYXRhIGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQsIHBsZWFzZSB0cnkgYWdhaW4nLCByZXN1bHQuc3RhdHVzICsgJyAnICsgcmVzdWx0LnN0YXR1c1RleHQpO1xuXHR9KTtcblxuXHRpZiAocGFyYW1zLmNpdHkgfHwgcGFyYW1zLlBjb2RlIHx8IHBhcmFtcy5nZW8pIHtcblx0XHRwYXJhbXMuc2VhcmNodHlwZSA9ICdvZmZpY2UnO1xuXHRcdHBhcmFtcy5uYW1lID0gJyc7XG5cblx0XHQkLmdldEpTT04obW9kZWxVcmwsIHBhcmFtcylcblx0XHQuYWx3YXlzKClcblx0XHQuZG9uZShmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdHZhciByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xuXHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGRpc3BsYXlTZWFyY2hSZXN1bHRzKCdvZmZpY2UtdGVtcGxhdGUnLCByZXN1bHQsICdvZmZpY2Utc2VhcmNoJyk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuZmFpbChmdW5jdGlvbiggcmVzdWx0ICkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0RhdGEgY291bGQgbm90IGJlIHJldHJpZXZlZCwgcGxlYXNlIHRyeSBhZ2FpbicsIHJlc3VsdC5zdGF0dXMgKyAnICcgKyByZXN1bHQuc3RhdHVzVGV4dCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XG5cbiAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xuXG4gICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuXG4gICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5mdW5jdGlvbiBwYWdpbmF0ZVJlc3VsdHMoKSB7XG5cdHZhciByZXN1bHQgPSBhbGxDb25zdWx0YW50cy5zbGljZSgwLCA1KTtcblx0YWxsQ29uc3VsdGFudHMuc3BsaWNlKDAsNSk7XG5cdGRpc3BsYXlTZWFyY2hSZXN1bHRzKCdjb25zdWx0YW50LXRlbXBsYXRlJywgcmVzdWx0LCAncmVzdWx0cy1jb250YWluZXInKTtcblx0aWYgKGFsbENvbnN1bHRhbnRzLmxlbmd0aCA+IDApIHtcblx0XHRkaXNwbGF5U2VhcmNoUmVzdWx0cygndmlldy1tb3JlLXRlbXBsYXRlJywgW10sICdyZXN1bHRzLWNvbnRhaW5lcicpO1xuXHR9XG59XG5mdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcblx0dmFyIHJlc3VsdCA9IHt9O1xuXHR2YXIgc2VhcmNoX2xvY2F0aW9uID0gJGxvY2F0aW9uX2ZpZWxkLnZhbCgpO1xuXHR2YXIgc2VhcmNoX25hbWUgPSAkbmFtZV9maWVsZC52YWwoKTtcblx0dmFyIHBvc3RhbENvZGVGb3JtYXQgPSBuZXcgUmVnRXhwKC9bQS1aYS16XVswLTldW0EtWmEtel0gP1swLTldW0EtWmEtel1bMC05XS8pO1xuXG5cdHJlc3VsdC5jaXR5ID0gJyc7XG5cdC8vIHJlc3VsdC5sb2NhdGlvbiA9ICcnO1xuXHRyZXN1bHQubmFtZSA9ICcnO1xuXHRyZXN1bHQuUGNvZGUgPSAnJztcblx0cmVzdWx0LmdlbyA9ICcnO1xuXG5cdC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2Vcblx0cmVzdWx0LmxhbmcgPSBsYW5nO1xuXHQvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXG5cdHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XG5cdC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgcG9zdGFsIGNvZGVcblx0aWYgKHBvc3RhbENvZGVGb3JtYXQudGVzdChzZWFyY2hfbG9jYXRpb24pKSB7XG5cdFx0dmFyIHBvc3RhbENvZGUgPSBzZWFyY2hfbG9jYXRpb24ubWF0Y2gocG9zdGFsQ29kZUZvcm1hdClbMF07XG5cdFx0aWYgKHBvc3RhbENvZGUuaW5kZXhPZignICcpID09PSAtMSkge1xuXHRcdFx0cG9zdGFsQ29kZSA9IHBvc3RhbENvZGUubWF0Y2goLy57MSwzfS9nKS5qb2luKCkucmVwbGFjZSgnLCcsICcgJyk7XG5cdFx0fVxuXHRcdHJlc3VsdC5QY29kZSA9IHBvc3RhbENvZGU7XG5cdFx0c2VhcmNoX2xvY2F0aW9uID0gc2VhcmNoX2xvY2F0aW9uLnJlcGxhY2UocG9zdGFsQ29kZUZvcm1hdCwgJyAnKTtcblx0fVxuXG5cdGlmKGlzX25hbWVfcXVlcnkpe1xuXHRcdHJlc3VsdC5uYW1lID0gc2VhcmNoX25hbWU7XG5cdH1cblx0ZWxzZXtcblx0XHRyZXN1bHQuY2l0eSA9IHNlYXJjaF9sb2NhdGlvbjtcblx0fVxuXG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVNlYXJjaFJlc3VsdHMoIHRlbXBsYXRlSUQsIGpzb24sIGRlc3RpbmF0aW9uICkge1xuXHR2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlEKS5pbm5lckhUTUw7XG5cdE11c3RhY2hlLnBhcnNlKHRlbXBsYXRlKTtcblx0dmFyIHJlbmRlcmVkID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBqc29uKTtcblx0JCgnIycrZGVzdGluYXRpb24pLnJlbW92ZUNsYXNzKCdoaWRlJykuYXBwZW5kKHJlbmRlcmVkKTtcblx0YXR0YWNoQ29tcG9uZW50cygpO1xuXHQkKCcjcmVzdWx0cy1wbGFjZWhvbGRlcicpLmFkZENsYXNzKCdoaWRlJyk7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaENvbXBvbmVudHMoKXtcblx0JChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXHQkKCdbZGF0YS1mZXRjaC1yZXN1bHRzXScpLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQodGhpcykucmVtb3ZlKCk7XG5cdFx0cGFnaW5hdGVSZXN1bHRzKCk7XG5cdH0pO1xufVxuZnVuY3Rpb24gc2VuZEdvb2dsZUFuYWx5dGljcyhwYXJhbXMpIHtcblx0aWYgKHBhcmFtcy5uYW1lICE9PSAnJykge1xuXHRcdGdhKCdzZW5kJywnZXZlbnQnLCdDb252ZXJ0JywnU2VhcmNoJywnQ29ubmVjdFRvQWR2aXNvcl9OYW1lPycgKyBwYXJhbXMubmFtZSwgMCk7XG5cdH0gZWxzZSBpZiAocGFyYW1zLmNpdHkgIT09ICcnKSB7XG5cdFx0Z2EoJ3NlbmQnLCdldmVudCcsJ0NvbnZlcnQnLCdTZWFyY2gnLCdDb25uZWN0VG9BZHZpc29yX0xvY2F0aW9uPycgKyBwYXJhbXMuY2l0eSwgMCk7XG5cdH0gZWxzZSBpZiAocGFyYW1zLlBjb2RlICE9PSAnJykge1xuXHRcdGdhKCdzZW5kJywnZXZlbnQnLCdDb252ZXJ0JywnU2VhcmNoJywnQ29ubmVjdFRvQWR2aXNvcl9QY29kZT8nICsgcGFyYW1zLlBjb2RlLCAwKTtcblx0fVxufVxuXG4vL0luaXQgZXZlcnl0aGluZ1xuJChmdW5jdGlvbigpIHtcblxuXHQvLyBUcnkgdG8gcHJlZGV0ZXJtaW5lIHdoYXQgcmVzdWx0cyBzaG91bGQgc2hvd1xuXHRnZXRDb29yZGluYXRlcygpO1xuXG5cdC8vIFNldHVwIHRoZSB0eXBlYWhlYWRcblx0JCgnLnR5cGVhaGVhZC5pdGZfbG9jYXRpb24nKS50eXBlYWhlYWQoe1xuXHRcdGhpZ2hsaWdodDogdHJ1ZVxuXHR9LFxuXHRcdHsgbmFtZTogJ2xvY2F0aW9ucycsIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLCBsaW1pdDogMiB9LFxuXHRcdHsgbmFtZTogJ3Bvc3RhbENvZGUnLCBzb3VyY2U6IHN1Z2dlc3Rpb25zLnBvc3RhbENvZGUsIGxpbWl0OiAyIH1cblx0KVxuXG5cdCQoJy50eXBlYWhlYWQuaXRmX25hbWUnKS50eXBlYWhlYWQoe1xuXHRcdGhpZ2hsaWdodDogdHJ1ZVxuXHR9LFxuXHRcdHsgbmFtZTogJ2NvbnN1bHRhbnRzJywgc291cmNlOiBzdWdnZXN0aW9ucy5jb25zdWx0YW50cywgbGltaXQ6IDMgfVxuXHQpXG5cblx0Ly8gU2V0dXAgdGhlIGZvcm0gc3VibWlzc2lvblxuXHQkKCcjZmluZC1hbi1hZHZpc29yLXNlYXJjaCcpLnN1Ym1pdChmdW5jdGlvbihlKXtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCgnI1NlYXJjaFN1Ym1pdEJ1dHRvbicpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKVxuXHRcdC8vICQoJy5zZWN0aW9uLnNlYXJjaC1yZXN1bHRzJykuc2hvdygpO1xuXHRcdCQoJyNyZXN1bHRzLXBsYWNlaG9sZGVyJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0XHR2YXIgcGFyYW1zID0gcGFyc2VTZWFyY2hTdHJpbmcoKTtcblx0XHRnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcyk7XG5cdFx0Ly9nYSgnc2VuZCcsJ2V2ZW50JywnQ29udmVydCcsJ1NlYXJjaCcsJ0Nvbm5lY3RUb0Fkdmlzb3JfTG9jYXRpb24/VG9yb250bywgT04nLCAwKTtcblx0XHRzZW5kR29vZ2xlQW5hbHl0aWNzKHBhcmFtcyk7XG5cdFx0Ly8gRGVib3VuY2UgdGhlIGJ1dHRvblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCQoJyNTZWFyY2hTdWJtaXRCdXR0b24nKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xuXHRcdH0sIDEwKTtcblx0fSk7XG5cblx0JChcIi50d2l0dGVyLXR5cGVhaGVhZCBpbnB1dFwiKS5vbigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuXHQgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuXHQgICAgXHQvLyAkKCcjZmluZC1hbi1hZHZpc29yLXNlYXJjaCcpLnN1Ym1pdCgpO1xuXHQgICAgICAgICQoJy50dC1tZW51JykuaGlkZSgpO1xuICAgIFx0fVxuXHR9KTtcblxuXHQkbG9jYXRpb25fZmllbGQuZm9jdXMoKTtcblxufSk7XG5cblxuIiwiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcblxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxuICovXG5cbi8vIHVybCBwYXRoXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbn0pKClcblxuLy8gbGFuZ3VhZ2VcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xuICAgIHJldHVybiAnZnInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnZW4nO1xuICB9XG59KSgpXG5cbi8vIGJyb3dzZXIgd2lkdGhcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xufSkoKVxuXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cblxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXG4vLyBBdCBzb21lIHBvaW50LCB3ZSBzaG91bGQgY29uc2lkZXIgc3BsaXR0aW5nIGl0IHVwIGludG8gYml0ZS1zaXplZCBwaWVjZXMuIEV4OiBtb3JlLW5hdi5qcywgbW9yZS1zb2NpYWwuanNcbi8vIGFuZCBzbyBvbi5cblxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxuICAgIF9yZXNpemUoKTtcblxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXG5cbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBldmVudCwgX21vcmVTZWN0aW9uTWVudUl0ZW0pO1xuXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtbW9iaWxlLXRpdGxlJykub24oJ2NsaWNrJywgX21vYmlsZUNhdGVnb3J5TWVudSk7XG5cbiAgICAvLyBDbG9zZSBidXR0b25cbiAgICAkKCcuY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgX2Nsb3NlQnV0dG9uKTtcblxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcbiAgICAkKCcuanMtb3Blbi1zb2NpYWxkcmF3ZXInKS5vbignY2xpY2snLCBfb3BlblNvY2lhbERyYXdlcik7XG4gIH1cblxuICAvLyBFbmQgb2YgSW5pdFxuXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XG4gICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaWcuYnJvd3NlcldpZHRoIDwgNjQwKSB7XG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2ZsZXgnKSB7XG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfbW9yZVNlY3Rpb25NZW51SXRlbSgpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpLFxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXG4gICAgICBjbGFzc05hbWUgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC9bXFx3LV0qY2F0ZWdvcnlbXFx3LV0qL2cpLFxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XG5cbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XG5cbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IHRpdGxlIG9uIGNsaWNrXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcblxuICAgIC8vIEFycm93IHBvc2l0aW9uIG1vdmUgb24gY2xpY2tcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXG5cbiAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuZmFkZUluKCdzbG93JykuZm9jdXMoKS5maWx0ZXIoJzpub3QoLicgKyBjbGFzc05hbWUgKyAnKScpLmhpZGUoKTtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfZmlsdGVyVGl0bGUodGl0bGUpIHtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVPdXQoKTtcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5hZGRDbGFzcygnYWN0aXZlJykudGV4dCh0aXRsZSk7XG4gICAgfSwgMjAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLnNob3coKS5jc3MoeyBsZWZ0OiBjZW50ZXJYIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2FuaW1hdGlvblVuZGVybGluZSgpIHtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykuYWRkQ2xhc3MoJ2FuaW1hdGUnKVxuICAgIH0sIDEwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX21vYmlsZUNhdGVnb3J5TWVudSgpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfb3BlblNvY2lhbERyYXdlcigpIHtcbiAgICAvLyB0aGlzLm5leHQoKSBzZWxlY3RzIG5leHQgc2libGluZyBlbGVtZW50XG4gICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xuICAgIHZhciBqc1NvY2lhbERyYXdlciA9ICQodGhpcykubmV4dCgpO1xuXG4gICAgaWYgKGpzU29jaWFsRHJhd2VyLmhhc0NsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJykpIHtcbiAgICAgIGpzU29jaWFsRHJhd2VyLnJlbW92ZUNsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGpzU29jaWFsRHJhd2VyLmFkZENsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIHZhciBlbmRwb2ludFVSTCxcbiAgICBzdWNjZXNzVVJMLFxuICAgIGNhbmNlbFVSTCxcbiAgICAkZm9ybSxcbiAgICAkZm9ybVdyYXBwZXI7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XG5cbiAgICBfdmFsaWRhdGlvbigpO1xuICAgIF90b2dnbGVyKClcbiAgfVxuXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XG4gICAgfSk7XG5cbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XG4gICAgICBkZWJ1ZzogdHJ1ZSxcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcbiAgICB9KTtcblxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcblxuICAgICRmb3JtLnZhbGlkYXRlKHtcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3Byb2Nlc3MoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBlbGVtZW50KSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xuICAgICAgICAgICQoZWxlbWVudCkucGFyZW50KCkuYXBwZW5kKGxhYmVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJ1bGVzOiB7XG4gICAgICAgIHBob25lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwaG9uZTI6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGZpcnN0bmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGxhc3RuYW1lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBlbWFpbDI6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcbiAgICB9KTtcblxuICB9XG5cbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xuICAgIHZhciBmb3JtRGF0YVJhdyxcbiAgICAgIGZvcm1EYXRhUGFyc2VkO1xuXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdzZXJ2ZXItZXJyb3InKTtcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgICAgLy8gSWYgd2UgbmVlZCB0byBtb2RpZnkgdGhlIGRhdGEsIHVzZSBwYXJzZSBtZXRob2RcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXG4gICAgICBfc3VibWl0KGZvcm1EYXRhUGFyc2VkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcbiAgICAvLyBFeGVjdXRlIGFueSBjdXN0b20gbG9naWMgaGVyZVxuXG5cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gX3N1Ym1pdChkYXRhKSB7XG4gICAgJC5hamF4KHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiBlbmRwb2ludFVSTCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VjY2VzcycpO1xuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XG4gICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XG4gICAgICAgIFNjcm9sbE1hbi50bygkKCcjc2VydmVyLWVycm9yJykpO1xuICAgICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcbiAgICAkKCcudG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxuXG4gICAgLy8gTm90IHN1cmUgd2hhdCB0aGlzIGRvZXMgYXQgdGhpcyBwb2ludCBvciBob3cgaXQgcmVsYXRlcyB0byBDYXJvdXNlbHNcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdzaXRlLWhlYWRlci1pcy1hY3RpdmUnKTtcbiAgICB9KTtcblxuICAgIF9idWlsZENhcm91c2VsKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfYnVpbGRDYXJvdXNlbCgpIHtcbiAgICB2YXIgcHJldkFycm93LFxuICAgICAgbmV4dEFycm93LFxuICAgICAgJGNhcm91c2VsO1xuXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XG4gICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xuXG4gICAgICAkY2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXG4gICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxuICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXG4gICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXG4gICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxuICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxuICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxuICAgICAgfSlcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICAvLyBEZWZpbmUgY29tcG9uZW50LWxldmVsIHZhcmlhYmxlc1xuICB2YXIgbWVzc2FnZXMgPSBbXSxcbiAgICBjb3VudGVyID0gMDtcblxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcbiAgICB2YXIgJHRoaXMgPSAkKHNjb3BlKTtcblxuICAgIC8vIExldCdzIGNyZWF0ZSBhIG1lc3NhZ2UgYXJyYXlcbiAgICBtZXNzYWdlcyA9IFsnSGVsbG8hJywgJ0lzIGl0IG1lIHlvdVxcJ3JlIGxvb2tpbmcgZm9yPycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBleWVzJywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIHNtaWxlJywgJ1lvdVxcJ3JlIGFsbCBJXFwndmUgZXZlciB3YW50ZWQnLCAnQW5kIG15IGFybXMgYXJlIG9wZW4gd2lkZScsICdcXCdjYXVzZSB5b3Uga25vdyBqdXN0IHdoYXQgdG8gc2F5JywgJ0FuZCB5b3Uga25vdyBqdXN0IHdoYXQgdG8gZG8nLCAnQW5kIEkgd2FudCB0byB0ZWxsIHlvdSBzbyBtdWNoJ107XG5cbiAgICAvLyBSZWdpc3RlciBjbGljayBoYW5kbGVyXG4gICAgJHRoaXMuZmluZCgnYS5idXR0b24ubWVzc2FnZScpLm9uKCdjbGljaycsIGV2ZW50LCBfc2F5SGVsbG8pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NheUhlbGxvKCkge1xuICAgIC8vIExldCdzIGVtaXQgYW4gZXZlbnQgd2l0aCBhbiBpbmRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCBzZW5kIGFsb25nIHNvbWV0aGluZyB0byBkaXNwbGF5XG4gICAgaWcuZW1pdHRlci5lbWl0KCdoZWxsbycsIG1lc3NhZ2VzW2NvdW50ZXJdKTtcbiAgICBjb3VudGVyICs9IDE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG4gIHZhciAkdGhpc1xuXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxuICAgICR0aGlzID0gJChzY29wZSk7XG4gICAgX2xpc3RlbmVyKCk7XG4gIH1cblxuICAvLyBXZSBrbm93IG5vdGhpbmcgYWJvdXQgdGhlIGNvbXBvbmVudCB0aGF0IHdpbGwgc2VuZCB0aGUgbWVzc2FnZS4gT25seSB0aGF0IGl0IHdpbGwgaGF2ZVxuICAvLyBhbiBpZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHRoYXQgd2Ugd2lsbCByZWNlaXZlIGEgJ21lc3NhZ2UnIHRvIGRpc3BsYXkuXG4gIGZ1bmN0aW9uIF9saXN0ZW5lcigpIHtcbiAgICBpZy5lbWl0dGVyLm9uKCdoZWxsbycsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAkKCc8cCBjbGFzcz1cImFsZXJ0LWJveCBhbGVydFwiPicgKyBtZXNzYWdlICsgJzwvcD4nKS5oaWRlKCkuYXBwZW5kVG8oJHRoaXMpLmZhZGVJbignZmFzdCcpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxuXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcbiBmb3IgaW5zdGFuY2UpLlxuXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cbiAqL1xuXG5pbXBvcnQgZmluZEFuQWR2aXNvciBmcm9tICcuL2ZpbmQtYW4tYWR2aXNvci1zZWFyY2guanMnO1xuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xuaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xuaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xuXG5jb25zdCBhcHAgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcbiAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbicpLmxlbmd0aCkgbW9yZS5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xuXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcbiAgICBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcbiAgICBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcblxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XG4gICAgX2xhbmd1YWdlKCk7XG4gIH1cblxuICAvLyBMZXQncyB1c2UgYSBnbG9iYWwgdmFyaWFibGUgKGdsb2JhbCBhcyBpbiBhdmFpbGFibGUgdG8gYWxsIG91ciBjb21wb25lbnRzIC0gbm90IHRoZSB3aW5kb3cgb2JqZWN0ISlcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoaWcubGFuZyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfVxuXG59KSgpXG5cbi8vIEJvb3RzdHJhcCBhcHBcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgYXBwLmluaXQoKTtcbn0pO1xuIl0sIm5hbWVzIjpbIm1vZGVsVXJsIiwiJGxvY2F0aW9uX2ZpZWxkIiwiJCIsIiRuYW1lX2ZpZWxkIiwiYWxsQ29uc3VsdGFudHMiLCJsYW5nIiwiaXNfbmFtZV9xdWVyeSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImluZGV4T2YiLCJjaGFuZ2UiLCJ2YWwiLCJzaG93IiwiZm9jdXMiLCJoaWRlIiwidHJpZ2dlciIsInN1Z2dlc3Rpb25zIiwibG9jYXRpb25zIiwiQmxvb2Rob3VuZCIsInRva2VuaXplcnMiLCJ3aGl0ZXNwYWNlIiwiY29uc3VsdGFudHMiLCJwb3N0YWxDb2RlIiwiZ2V0Q29vcmRpbmF0ZXMiLCJuYXZpZ2F0b3IiLCJnZW9sb2NhdGlvbiIsInN1Y2Nlc3MiLCJwb3NpdGlvbiIsInBhcmFtcyIsInNlYXJjaHR5cGUiLCJnZW8iLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImVycm9yIiwibG9nIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwiZ2V0U2VhcmNoUmVzdWx0cyIsImFkZENsYXNzIiwiaHRtbCIsImdldEpTT04iLCJhbHdheXMiLCJkb25lIiwiZGF0YSIsInJlc3VsdCIsIkpTT04iLCJwYXJzZSIsInNodWZmbGUiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwib2Zmc2V0IiwidG9wIiwiZmFpbCIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJjaXR5IiwiUGNvZGUiLCJuYW1lIiwibGVuZ3RoIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicGFnaW5hdGVSZXN1bHRzIiwic2xpY2UiLCJzcGxpY2UiLCJwYXJzZVNlYXJjaFN0cmluZyIsInNlYXJjaF9sb2NhdGlvbiIsInNlYXJjaF9uYW1lIiwicG9zdGFsQ29kZUZvcm1hdCIsIlJlZ0V4cCIsInRlc3QiLCJtYXRjaCIsImpvaW4iLCJyZXBsYWNlIiwiZGlzcGxheVNlYXJjaFJlc3VsdHMiLCJ0ZW1wbGF0ZUlEIiwianNvbiIsImRlc3RpbmF0aW9uIiwidGVtcGxhdGUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicmVuZGVyZWQiLCJNdXN0YWNoZSIsInJlbmRlciIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiYXR0YWNoQ29tcG9uZW50cyIsImZvdW5kYXRpb24iLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInJlbW92ZSIsInNlbmRHb29nbGVBbmFseXRpY3MiLCJ0eXBlYWhlYWQiLCJzb3VyY2UiLCJsaW1pdCIsInN1Ym1pdCIsImF0dHIiLCJyZW1vdmVBdHRyIiwia2V5Q29kZSIsInBhdGhuYW1lIiwiYnJvd3NlcldpZHRoIiwib3V0ZXJXaWR0aCIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJpbml0IiwiZXZlbnQiLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJpZyIsImNzcyIsIiR0aGlzIiwid2lkdGgiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZpbHRlciIsIl9maWx0ZXJUaXRsZSIsImZhZGVPdXQiLCJfcmVwb3NpdGlvbkFycm93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiaGFzQ2xhc3MiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsInBhcmVudCIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJtc2ciLCJ0byIsIl90b2dnbGVyIiwiX2J1aWxkQ2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkY2Fyb3VzZWwiLCJlYWNoIiwiaW5kZXgiLCJzbGljayIsIm1lc3NhZ2VzIiwiY291bnRlciIsInNjb3BlIiwiX3NheUhlbGxvIiwiZW1pdCIsIl9saXN0ZW5lciIsIm1lc3NhZ2UiLCJhcHBlbmRUbyIsImFwcCIsImZvcm1zIiwibW9yZSIsImNhcm91c2VsIiwiZXZ0MSIsImV2dDIiLCJfbGFuZ3VhZ2UiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQSxJQUFJQSxXQUFXLGtEQUFmO0FBQ0EsSUFBSUMsa0JBQWtCQyxFQUFFLHlCQUFGLENBQXRCO0FBQ0EsSUFBSUMsY0FBY0QsRUFBRSxxQkFBRixDQUFsQjtBQUNBLElBQUlFLGlCQUFpQixFQUFyQjtBQUNBLElBQUlDLE9BQU8sSUFBWDtBQUNBLElBQUlDLGdCQUFnQixLQUFwQjtBQUNBLElBQUdDLE9BQU9DLFFBQVAsQ0FB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