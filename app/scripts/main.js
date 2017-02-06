// Let's bootstrap our 'application'
const ig = (function () {
  var pathName = window.location.pathname,
    lang = _lang(),
    browserWidth = _width();

  function init() {
    // Initialize Foundation
    $(document).foundation();

    // Search

    // Forms
    if ($('.ig-form').length) {
      form.init();
    }

    // More
    if ($('.more-section').length) {
      more.init();
    }

    // Carousel
    if ($('.ig-carousel').length) {
      // carousel.init();
    }
    // Another module

  }

  // Set page language
  function _lang() {
    if (pathName.indexOf('/fr/') !== -1) {
      return 'fr';
    } else {
      return 'en';
    }
  }

  // Get initial browser width
  function _width() {
    return window.outerWidth;
  }

  // Only return public methods and variables
  return {
    init,
    pathName,
    lang,
    browserWidth
  };
}());

// ig Forms
const form = function () {
  var endpointURL,
    successURL,
    cancelURL,
    $form,
    $formWrapper;

  function init() {
    // Forms should always be wrapped in '.ig-form'
    $formWrapper = $('.ig-form');
    $form = $formWrapper.find('form');
    endpointURL = $formWrapper.find('form').data('endpoint');
    cancelURL = $formWrapper.find('form').data('cancel');

    // Very simple form toggler
    $('.toggler').on('click', function () {
      $('.toggle-content').hide();
      $('.' + $(this).data('content')).show();
    });

    _validation();
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
      return this.optional(element) ||
        postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
    }, 'Please specify a valid postal code.');

    $form.validate({
      submitHandler: function () {
        form._process();
      },
      errorPlacement: function (label, element) {
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
    var formDataRaw,
      formDataParsed;

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


    return data
  }

  function _submit(data) {
    $.ajax({
      method: 'POST',
      url: endpointURL,
      data: data
    }).success(function (msg) {
      $formWrapper.addClass('success');
      $formWrapper.removeClass('submitting');
    })
      .error(function (msg) {
        $form.addClass('server-error');
        $formWrapper.removeClass('submitting');
        ScrollMan.to($('#server-error'));
      });
  }

  return {
    init
  };
}();

// More Article and Category functionality
const more = (function () {
  function init() {
    $('.more-section-menuitem').on('click', function (e) {
      e.preventDefault();

      var $this = $(this),
        offset = $this.offset(),
        width = $this.width(),
        centerX = offset.left + width / 2 - 50,
        className = $this.attr('class').match(/[\w-]*category[\w-]*/g),
        title = $this.text();

      // Filter the catrgory dropdown on click
      $('.more-section-menu-dropdown-category-wrapper').fadeIn('slow').focus().filter(':not(.' + className + ')').hide();
      $('.more-section-menu-dropdown').addClass('active');

      // Filter the category title on click
      $('p.more-section-tagline-tag').fadeOut();
      $('h1.more-section-tagline-tag').removeClass('active');
      setTimeout(() => {
        $('h1.more-section-tagline-tag').addClass('active').text(title);
      }, 200);

      // Arrow position move on click
      $('.more-section-menu-dropdown-arrow-up').show().css({ left: centerX });

      //Underline animation
      $('.tertiary-cta-more').removeClass('animate');
      setTimeout(() => {
        $('.tertiary-cta-more').addClass('animate')
      }, 100);
    });

    //Toggle the Open/Close mobile categories menu
    $('.more-section-menu-mobile-title').on('click', function () {
      $('.more-section-menu').toggleClass('active');
      $(this).toggleClass('active');
    })

    // Close button
    $('.close-button').on('click', function () {
      $('.more-section-menu-dropdown-category-wrapper').hide();
      $('.more-section-menu-dropdown-arrow-up').hide();
      $('.tertiary-cta-more').removeClass('animate');
      $('h1.more-section-tagline-tag').removeClass('active');
      $('p.more-section-tagline-tag').fadeIn('slow');
      $('.more-section-menu-dropdown').removeClass('active');
    });
  }

  return {
    init
  };
}());


//Carousel
$(function () {
  $('[data-responsive-toggle] button').on('click', function () {
    $('body').toggleClass('site-header-is-active');
  });
  $('.text-carousel').slick({
    dots: true,
    speed: 300,
    infinite: true,
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
    nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>'
  });
  $('.carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
    nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });
  $('.homepage-carousel').slick({
    dots: true,
    infinite: true,
    speed: 500,
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
    nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
    responsive: [
      {
        breakpoint: 640,
        settings: {
          fade: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          fade: true,
        }
      }
    ]
  });

  $('.js-open-socialdrawer').click(function () {
    // this.next() selects next sibling element
    // any suggestions on a better way to do this?
    var jsSocialDrawer = $(this).next();

    if (jsSocialDrawer.hasClass('js-socialdrawer-opened')) {
      jsSocialDrawer.removeClass('js-socialdrawer-opened');
    } else {
      jsSocialDrawer.addClass('js-socialdrawer-opened');
    }
  });
});

// More Header Responsive

$(window).resize(function () {

  var width = $(document).width();

  if (width < 640) {
    $('.tertiary-cta-more').removeClass('animate');

    if ($('.more-section-menu').css('display') === 'flex') {
      $('.more-section-menu').css('display', 'block');
    }
  }
  if (width > 640) {

    if ($('.more-section-menu').css('display') === 'block') {
      $('.more-section-menu').css('display', 'flex');
    }

  }
});

//Accordion

$('.help-topics-accordion').on('up.zf.accordion', function (event) {
  setTimeout(function () {
    $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
  }, 10); //Adjust to match slideSpeed
});


//Find an Advisor

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

  $('.search-select').change(function () {
    if ($('.search-select').val() == 'Location') {
      $('.find-an-advisor-search-form-field-location').show();
      $location_field.focus();
      $('.find-an-advisor-search-form-field-name').hide();
      is_name_query = false;

    }
    else if ($('.search-select').val() == 'Name') {
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
  $.getJSON(modelUrl, params)
    .always()
    .done(function (data) {
      var result = JSON.parse(data);
      allConsultants = shuffle(result);
      displaySearchResults('result-amount-template', allConsultants, 'results-container');
      paginateResults();
      $('html, body').animate({ scrollTop: $('#office-search').offset().top }, 750);
    })
    .fail(function (result) {
      console.log('Data could not be retrieved, please try again', result.status + ' ' + result.statusText);
    });

  if (params.city || params.Pcode || params.geo) {
    params.searchtype = 'office';
    params.name = '';

    $.getJSON(modelUrl, params)
      .always()
      .done(function (data) {
        var result = JSON.parse(data);
        if (result.length > 0) {
          displaySearchResults('office-template', result, 'office-search');
        }
      })
      .fail(function (result) {
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
  }
  else {
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
  $('#find-an-advisor-search').submit(function (e) {
    e.preventDefault();
    $('#SearchSubmitButton').attr('disabled', 'disabled')
    $('#results-placeholder').removeClass('hide');
    var params = parseSearchString();
    getSearchResults(params);
    sendGoogleAnalytics(params);
    // Debounce the button
    setTimeout(function () {
      $('#SearchSubmitButton').removeAttr('disabled');
    }, 1500);
  });

  $location_field.focus();
});


// Kick things off
$(document).ready(function () {
  ig.init();
})
