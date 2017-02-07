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

    _validation();
    _toggler()
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

  function _toggler() {
    // Very simple form toggler
    $('.toggler').on('click', function () {
      $('.toggle-content').hide();
      $('.' + $(this).data('content')).show();
    });
  }

  return {
    init
  };
}();

// More Article and Category functionality
const more = (function () {
  function init() {
    _resize();

    $('.more-section-menuitem').on('click', function (e) {
      e.preventDefault();

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
      _repositionArrow(centerX)

      // Underline animation
      _animationUnderline();
    });

    // Register Click Handlers
    //

    // Mobile Category menu
    $('.more-section-menu-mobile-title').on('click', _mobileCategoryMenu);

    // Close button
    $('.close-button').on('click', _closeButton);
  }

  function _resize() {
    $(window).resize(function () {
      var width = window.outerWidth;
      if (width < 640) {
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

  function _filterDropdown(className) {
    $('.more-section-menu-dropdown-category-wrapper').fadeIn('slow').focus().filter(':not(.' + className + ')').hide();
    $('.more-section-menu-dropdown').addClass('active');
  }

  function _filterTitle(title) {
    $('p.more-section-tagline-tag').fadeOut();
    $('h1.more-section-tagline-tag').removeClass('active');
    setTimeout(() => {
      $('h1.more-section-tagline-tag').addClass('active').text(title);
    }, 200);
  }

  function _repositionArrow(centerX) {
    $('.more-section-menu-dropdown-arrow-up').show().css({ left: centerX });
  }

  function _animationUnderline() {
    $('.tertiary-cta-more').removeClass('animate');
    setTimeout(() => {
      $('.tertiary-cta-more').addClass('animate')
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

// Kick things off
$(document).ready(function () {
  ig.init();
})
