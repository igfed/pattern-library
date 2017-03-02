// GLOBALS 
var modelUrl = 'https://search.investorsgroup.com/api/cwpsearch?';
var $location_field = $('#FindAnAdvisor_location');
var $name_field = $('#FindAnAdvisor_name');
var allConsultants = {};
var lang = 'en';
var is_name_query = false;
if(window.location.href.indexOf('-fr.') > -1) {
    lang = 'fr';
}

//Search dropdown

$(function() {

  $('.find-an-advisor-search-form-field .select-select').change(function() {
    if( $('.select-select option').val() == 'Location') {
      $('.find-an-advisor-search-form-field-location').show();
      $location_field.focus();
      $('.find-an-advisor-search-form-field-name').hide();
      is_name_query = false;

    }
    else if( $('.select-select option').val() == 'Name') {
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
	if (!navigator.geolocation){
		return;
	}
	function success(position) {
		var params = {};
		params.lang = lang;
		params.searchtype = 'con';
		params.geo = position.coords.latitude +','+ position.coords.longitude;

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
	$.getJSON(modelUrl, params)
	.always()
	.done(function( data ) {
		var result = JSON.parse(data);
		allConsultants = shuffle(result);
		displaySearchResults('result-amount-template', allConsultants, 'results-container');
		paginateResults();
		$('html, body').animate({scrollTop: $('#results-container').offset().top}, 750);
	})
	.fail(function( result ) {
		console.log('Data could not be retrieved, please try again', result.status + ' ' + result.statusText);
	});

	if (params.city || params.Pcode || params.geo) {
		params.searchtype = 'office';
		params.name = '';

		$.getJSON(modelUrl, params)
		.always()
		.done(function( data ) {
			var result = JSON.parse(data);
			if (result.length > 0) {
				displaySearchResults('office-template', result, 'office-search');
			}
		})
		.fail(function( result ) {
			console.log('Data could not be retrieved, please try again', result.status + ' ' + result.statusText);
		});
	}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

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
	allConsultants.splice(0,5);
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

	if(is_name_query){
		result.name = search_name;
	}
	else{
		result.city = search_location;
	}


	return result;
}

function displaySearchResults( templateID, json, destination ) {
	var template = document.getElementById(templateID).innerHTML;
	Mustache.parse(template);
	var rendered = Mustache.render(template, json);
	$('#'+destination).removeClass('hide').append(rendered);
	attachComponents();
	$('#results-placeholder').addClass('hide');
}

function attachComponents(){
	$(document).foundation();
	$('[data-fetch-results]').on('click',function(e){
		e.preventDefault();
		$(this).remove();
		paginateResults();
	});
}
function sendGoogleAnalytics(params) {
	if (params.name !== '') {
		ga('send','event','Convert','Search','ConnectToAdvisor_Name?' + params.name, 0);
	} else if (params.city !== '') {
		ga('send','event','Convert','Search','ConnectToAdvisor_Location?' + params.city, 0);
	} else if (params.Pcode !== '') {
		ga('send','event','Convert','Search','ConnectToAdvisor_Pcode?' + params.Pcode, 0);
	}
}

//Init everything
$(function() {

	// Try to predetermine what results should show
	getCoordinates();

	// Setup the typeahead
	$('.typeahead.itf_location').typeahead({
		highlight: true
	},
		{ name: 'locations', source: suggestions.locations, limit: 2 },
		{ name: 'postalCode', source: suggestions.postalCode, limit: 2 }
	)

	$('.typeahead.itf_name').typeahead({
		highlight: true
	},
		{ name: 'consultants', source: suggestions.consultants, limit: 3 }
	)

	// Setup the form submission
	$('#find-an-advisor-search').submit(function(e){
		e.preventDefault();
		$('#SearchSubmitButton').attr('disabled','disabled')
		// $('.section.search-results').show();
		$('#results-placeholder').removeClass('hide');
		var params = parseSearchString();
		getSearchResults(params);
		//ga('send','event','Convert','Search','ConnectToAdvisor_Location?Toronto, ON', 0);
		sendGoogleAnalytics(params);
		// Debounce the button
		setTimeout(function(){
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


