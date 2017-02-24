(function () {
'use strict';

/* This file is for methods and variables that are going to be
useful across all modules. In order to use them anywhere, import with:

 import * as ig from './global.js';

 and then call with the ig namespace (i.e., ig.pathname, ig.lang, etc)
 */

// url path


// language
var lang = function () {
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
    $('body').addClass(lang);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvZXZlbnQtdGVzdC0xLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTIuanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxudXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxuXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXG4gKi9cblxuLy8gdXJsIHBhdGhcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xufSkoKVxuXG4vLyBsYW5ndWFnZVxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XG4gICAgcmV0dXJuICdmcic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdlbic7XG4gIH1cbn0pKClcblxuLy8gYnJvd3NlciB3aWR0aFxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XG59KSgpXG5cbi8vIGJhc2UgZXZlbnRFbWl0dGVyXG5leHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblxuXG4iLCIvLyBUaGlzIGlzIGxlc3Mgb2YgYSBtb2R1bGUgdGhhbiBpdCBpcyBhIGNvbGxlY3Rpb24gb2YgY29kZSBmb3IgYSBjb21wbGV0ZSBwYWdlIChNb3JlIHBhZ2UgaW4gdGhpcyBjYXNlKS5cbi8vIEF0IHNvbWUgcG9pbnQsIHdlIHNob3VsZCBjb25zaWRlciBzcGxpdHRpbmcgaXQgdXAgaW50byBiaXRlLXNpemVkIHBpZWNlcy4gRXg6IG1vcmUtbmF2LmpzLCBtb3JlLXNvY2lhbC5qc1xuLy8gYW5kIHNvIG9uLlxuXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXG4gICAgX3Jlc2l6ZSgpO1xuXG4gICAgLy8gUmVnaXN0ZXIgQ2xpY2sgSGFuZGxlcnNcblxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGV2ZW50LCBfbW9yZVNlY3Rpb25NZW51SXRlbSk7XG5cbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcblxuICAgIC8vIENsb3NlIGJ1dHRvblxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xuXG4gICAgLy8gU29jaWFsIGRyYXdlclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcbiAgfVxuXG4gIC8vIEVuZCBvZiBJbml0XG5cbiAgZnVuY3Rpb24gX3Jlc2l6ZSgpIHtcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpZy5icm93c2VyV2lkdGggPCA2NDApIHtcbiAgICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb3JlU2VjdGlvbk1lbnVJdGVtKCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXG4gICAgICB3aWR0aCA9ICR0aGlzLndpZHRoKCksXG4gICAgICBjZW50ZXJYID0gb2Zmc2V0LmxlZnQgKyB3aWR0aCAvIDIgLSA1MCxcbiAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXG4gICAgICB0aXRsZSA9ICR0aGlzLnRleHQoKTtcblxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgZHJvcGRvd24gb24gY2xpY2tcbiAgICBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKTtcblxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgdGl0bGUgb24gY2xpY2tcbiAgICBfZmlsdGVyVGl0bGUodGl0bGUpO1xuXG4gICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xuICAgIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWClcblxuICAgIC8vIFVuZGVybGluZSBhbmltYXRpb25cbiAgICBfYW5pbWF0aW9uVW5kZXJsaW5lKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5mYWRlSW4oJ3Nsb3cnKS5mb2N1cygpLmZpbHRlcignOm5vdCguJyArIGNsYXNzTmFtZSArICcpJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZU91dCgpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmFkZENsYXNzKCdhY3RpdmUnKS50ZXh0KHRpdGxlKTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfbW9iaWxlQ2F0ZWdvcnlNZW51KCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xuICAgIC8vIHRoaXMubmV4dCgpIHNlbGVjdHMgbmV4dCBzaWJsaW5nIGVsZW1lbnRcbiAgICAvLyBhbnkgc3VnZ2VzdGlvbnMgb24gYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/XG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XG5cbiAgICBpZiAoanNTb2NpYWxEcmF3ZXIuaGFzQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKSkge1xuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAganNTb2NpYWxEcmF3ZXIuYWRkQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgdmFyIGVuZHBvaW50VVJMLFxuICAgIHN1Y2Nlc3NVUkwsXG4gICAgY2FuY2VsVVJMLFxuICAgICRmb3JtLFxuICAgICRmb3JtV3JhcHBlcjtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcblxuICAgIF92YWxpZGF0aW9uKCk7XG4gICAgX3RvZ2dsZXIoKVxuICB9XG5cbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XG4gICAgdmFyIGpJbnB1dCA9ICQoJzppbnB1dCwgdGV4dGFyZWEnKTtcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcbiAgICB9KTtcblxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcbiAgICAgIGRlYnVnOiB0cnVlLFxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xuICAgIH0pO1xuXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxuICAgICAgICBwb3N0YWwubWF0Y2goL1thLXpBLVpdWzAtOV1bYS16QS1aXSgtfCB8KVswLTldW2EtekEtWl1bMC05XS8pO1xuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xuXG4gICAgJGZvcm0udmFsaWRhdGUoe1xuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBfcHJvY2VzcygpO1xuICAgICAgfSxcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcbiAgICAgICAgLy8gVXNlIHRoZSBjdXN0b20tZXJyb3ItbG9jYXRpb24gbWFya2VyIGNsYXNzIHRvIGNoYW5nZSB3aGVyZSB0aGUgZXJyb3IgbGFiZWwgc2hvd3MgdXBcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcnVsZXM6IHtcbiAgICAgICAgcGhvbmU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHBob25lMjoge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHBob25lVVM6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBjZG5Qb3N0YWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3RuYW1lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgbGFzdG5hbWU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBlbWFpbDoge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsMjoge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgICRmb3JtLmZpbmQoJ2J1dHRvbi5jYW5jZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiBfcHJvY2Vzcyhmb3JtKSB7XG4gICAgdmFyIGZvcm1EYXRhUmF3LFxuICAgICAgZm9ybURhdGFQYXJzZWQ7XG5cbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWJtaXR0aW5nJyk7XG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxuICAgICAgZm9ybURhdGFQYXJzZWQgPSBfcGFyc2UoZm9ybURhdGFSYXcpO1xuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXG5cblxuICAgIHJldHVybiBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XG4gICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF90b2dnbGVyKCkge1xuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgJCgnLnRvZ2dsZS1jb250ZW50JykuaGlkZSgpO1xuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXG5cbiAgICAvLyBOb3Qgc3VyZSB3aGF0IHRoaXMgZG9lcyBhdCB0aGlzIHBvaW50IG9yIGhvdyBpdCByZWxhdGVzIHRvIENhcm91c2Vsc1xuICAgICQoJ1tkYXRhLXJlc3BvbnNpdmUtdG9nZ2xlXSBidXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xuICAgIHZhciBwcmV2QXJyb3csXG4gICAgICBuZXh0QXJyb3csXG4gICAgICAkY2Fyb3VzZWw7XG5cbiAgICAkKCcuaWctY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcbiAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XG4gICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XG5cbiAgICAgICRjYXJvdXNlbC5zbGljayh7XG4gICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXG4gICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcbiAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcbiAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXG4gICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxuICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXG4gICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIC8vIERlZmluZSBjb21wb25lbnQtbGV2ZWwgdmFyaWFibGVzXG4gIHZhciBtZXNzYWdlcyA9IFtdLFxuICAgIGNvdW50ZXIgPSAwO1xuXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxuICAgIHZhciAkdGhpcyA9ICQoc2NvcGUpO1xuXG4gICAgLy8gTGV0J3MgY3JlYXRlIGEgbWVzc2FnZSBhcnJheVxuICAgIG1lc3NhZ2VzID0gWydIZWxsbyEnLCAnSXMgaXQgbWUgeW91XFwncmUgbG9va2luZyBmb3I/JywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIGV5ZXMnLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgc21pbGUnLCAnWW91XFwncmUgYWxsIElcXCd2ZSBldmVyIHdhbnRlZCcsICdBbmQgbXkgYXJtcyBhcmUgb3BlbiB3aWRlJywgJ1xcJ2NhdXNlIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBzYXknLCAnQW5kIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBkbycsICdBbmQgSSB3YW50IHRvIHRlbGwgeW91IHNvIG11Y2gnXTtcblxuICAgIC8vIFJlZ2lzdGVyIGNsaWNrIGhhbmRsZXJcbiAgICAkdGhpcy5maW5kKCdhLmJ1dHRvbi5tZXNzYWdlJykub24oJ2NsaWNrJywgZXZlbnQsIF9zYXlIZWxsbyk7XG4gIH1cblxuICBmdW5jdGlvbiBfc2F5SGVsbG8oKSB7XG4gICAgLy8gTGV0J3MgZW1pdCBhbiBldmVudCB3aXRoIGFuIGluZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHNlbmQgYWxvbmcgc29tZXRoaW5nIHRvIGRpc3BsYXlcbiAgICBpZy5lbWl0dGVyLmVtaXQoJ2hlbGxvJywgbWVzc2FnZXNbY291bnRlcl0pO1xuICAgIGNvdW50ZXIgKz0gMTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcbiAgdmFyICR0aGlzXG5cbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xuICAgIC8vIE9mdGVuIGEgZ29vZCBpZGVhIHRvIGluaXQgd2l0aCBhbiBIVE1MIHNjb3BlIChpZSwgY2xhc3MpXG4gICAgJHRoaXMgPSAkKHNjb3BlKTtcbiAgICBfbGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8vIFdlIGtub3cgbm90aGluZyBhYm91dCB0aGUgY29tcG9uZW50IHRoYXQgd2lsbCBzZW5kIHRoZSBtZXNzYWdlLiBPbmx5IHRoYXQgaXQgd2lsbCBoYXZlXG4gIC8vIGFuIGlkZW50aWZpZXIgb2YgJ2hlbGxvJyBhbmQgdGhhdCB3ZSB3aWxsIHJlY2VpdmUgYSAnbWVzc2FnZScgdG8gZGlzcGxheS5cbiAgZnVuY3Rpb24gX2xpc3RlbmVyKCkge1xuICAgIGlnLmVtaXR0ZXIub24oJ2hlbGxvJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICQoJzxwIGNsYXNzPVwiYWxlcnQtYm94IGFsZXJ0XCI+JyArIG1lc3NhZ2UgKyAnPC9wPicpLmhpZGUoKS5hcHBlbmRUbygkdGhpcykuZmFkZUluKCdmYXN0Jyk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXG5cbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxuIGZvciBpbnN0YW5jZSkuXG5cbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxuICovXG5cbmltcG9ydCBtb3JlIGZyb20gJy4vbW9yZS5qcyc7XG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcbmltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcbmltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcblxuY29uc3QgYXBwID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcblxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcblxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXG4gICAgaWYgKCQoJy5pZy1ldnQxJykubGVuZ3RoKSBldnQxLmluaXQoJy5pZy1ldnQxJyk7XG4gICAgaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XG5cbiAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxuICAgIF9sYW5ndWFnZSgpO1xuICB9XG5cbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xuICBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH1cblxufSkoKVxuXG4vLyBCb290c3RyYXAgYXBwXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIGFwcC5pbml0KCk7XG59KTtcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJicm93c2VyV2lkdGgiLCJvdXRlcldpZHRoIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImluaXQiLCJvbiIsImV2ZW50IiwiX21vcmVTZWN0aW9uTWVudUl0ZW0iLCJfbW9iaWxlQ2F0ZWdvcnlNZW51IiwiX2Nsb3NlQnV0dG9uIiwiX29wZW5Tb2NpYWxEcmF3ZXIiLCJfcmVzaXplIiwicmVzaXplIiwiaWciLCJyZW1vdmVDbGFzcyIsIiQiLCJjc3MiLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0Iiwid2lkdGgiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZvY3VzIiwiZmlsdGVyIiwiaGlkZSIsImFkZENsYXNzIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiaGFzQ2xhc3MiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwibWVzc2FnZXMiLCJjb3VudGVyIiwic2NvcGUiLCJfc2F5SGVsbG8iLCJlbWl0IiwiX2xpc3RlbmVyIiwibWVzc2FnZSIsImFwcGVuZFRvIiwiYXBwIiwiZG9jdW1lbnQiLCJmb3VuZGF0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJldnQxIiwiZXZ0MiIsIl9sYW5ndWFnZSIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07TUFDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQWxELEVBQXFEO1dBQzVDLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPLElBQUlDLGVBQWdCLFlBQU07U0FDeEJKLE9BQU9LLFVBQWQ7Q0FEd0IsRUFBbkI7OztBQUtQLEFBQU8sSUFBSUMsVUFBVSxJQUFJQyxZQUFKLEVBQWQ7O0FDNUJQOzs7O0FBSUEsQUFFQSxXQUFlLENBQUMsWUFBTTtXQUNYQyxJQUFULEdBQWdCOzs7Ozs7OztNQVFaLHdCQUFGLEVBQTRCQyxFQUE1QixDQUErQixPQUEvQixFQUF3Q0MsS0FBeEMsRUFBK0NDLG9CQUEvQzs7O01BR0UsaUNBQUYsRUFBcUNGLEVBQXJDLENBQXdDLE9BQXhDLEVBQWlERyxtQkFBakQ7OztNQUdFLGVBQUYsRUFBbUJILEVBQW5CLENBQXNCLE9BQXRCLEVBQStCSSxZQUEvQjs7O01BR0UsdUJBQUYsRUFBMkJKLEVBQTNCLENBQThCLE9BQTlCLEVBQXVDSyxpQkFBdkM7Ozs7O1dBS09DLE9BQVQsR0FBbUI7TUFDZmYsTUFBRixFQUFVZ0IsTUFBVixDQUFpQixZQUFZO1VBQ3ZCQyxZQUFBLEdBQWtCLEdBQXRCLEVBQTJCO1VBQ3ZCLG9CQUFGLEVBQXdCQyxXQUF4QixDQUFvQyxTQUFwQztZQUNJQyxFQUFFLG9CQUFGLEVBQXdCQyxHQUF4QixDQUE0QixTQUE1QixNQUEyQyxNQUEvQyxFQUF1RDtZQUNuRCxvQkFBRixFQUF3QkEsR0FBeEIsQ0FBNEIsU0FBNUIsRUFBdUMsT0FBdkM7O09BSEosTUFLTztZQUNERCxFQUFFLG9CQUFGLEVBQXdCQyxHQUF4QixDQUE0QixTQUE1QixNQUEyQyxPQUEvQyxFQUF3RDtZQUNwRCxvQkFBRixFQUF3QkEsR0FBeEIsQ0FBNEIsU0FBNUIsRUFBdUMsTUFBdkM7OztLQVJOOzs7V0F1Qk9ULG9CQUFULEdBQWdDO1VBQ3hCVSxjQUFOOztRQUVJQyxRQUFRSCxFQUFFLElBQUYsQ0FBWjtRQUNFSSxTQUFTRCxNQUFNQyxNQUFOLEVBRFg7UUFFRUMsUUFBUUYsTUFBTUUsS0FBTixFQUZWO1FBR0VDLFVBQVVGLE9BQU9HLElBQVAsR0FBY0YsUUFBUSxDQUF0QixHQUEwQixFQUh0QztRQUlFRyxZQUFZTCxNQUFNTSxJQUFOLENBQVcsT0FBWCxFQUFvQkMsS0FBcEIsQ0FBMEIsdUJBQTFCLENBSmQ7UUFLRUMsUUFBUVIsTUFBTVMsSUFBTixFQUxWOzs7b0JBUWdCSixTQUFoQjs7O2lCQUdhRyxLQUFiOzs7cUJBR2lCTCxPQUFqQjs7Ozs7O1dBTU9PLGVBQVQsQ0FBeUJMLFNBQXpCLEVBQW9DO01BQ2hDLDhDQUFGLEVBQWtETSxNQUFsRCxDQUF5RCxNQUF6RCxFQUFpRUMsS0FBakUsR0FBeUVDLE1BQXpFLENBQWdGLFdBQVdSLFNBQVgsR0FBdUIsR0FBdkcsRUFBNEdTLElBQTVHO01BQ0UsNkJBQUYsRUFBaUNDLFFBQWpDLENBQTBDLFFBQTFDOzs7V0FHT0MsWUFBVCxDQUFzQlIsS0FBdEIsRUFBNkI7TUFDekIsNEJBQUYsRUFBZ0NTLE9BQWhDO01BQ0UsNkJBQUYsRUFBaUNyQixXQUFqQyxDQUE2QyxRQUE3QztlQUNXLFlBQU07UUFDYiw2QkFBRixFQUFpQ21CLFFBQWpDLENBQTBDLFFBQTFDLEVBQW9ETixJQUFwRCxDQUF5REQsS0FBekQ7S0FERixFQUVHLEdBRkg7OztXQUtPVSxnQkFBVCxDQUEwQmYsT0FBMUIsRUFBbUM7TUFDL0Isc0NBQUYsRUFBMENnQixJQUExQyxHQUFpRHJCLEdBQWpELENBQXFELEVBQUVNLE1BQU1ELE9BQVIsRUFBckQ7OztXQUdPaUIsbUJBQVQsR0FBK0I7TUFDM0Isb0JBQUYsRUFBd0J4QixXQUF4QixDQUFvQyxTQUFwQztlQUNXLFlBQU07UUFDYixvQkFBRixFQUF3Qm1CLFFBQXhCLENBQWlDLFNBQWpDO0tBREYsRUFFRyxHQUZIOzs7V0FLT3hCLFlBQVQsR0FBd0I7TUFDcEIsOENBQUYsRUFBa0R1QixJQUFsRDtNQUNFLHNDQUFGLEVBQTBDQSxJQUExQztNQUNFLG9CQUFGLEVBQXdCbEIsV0FBeEIsQ0FBb0MsU0FBcEM7TUFDRSw2QkFBRixFQUFpQ0EsV0FBakMsQ0FBNkMsUUFBN0M7TUFDRSw0QkFBRixFQUFnQ2UsTUFBaEMsQ0FBdUMsTUFBdkM7TUFDRSw2QkFBRixFQUFpQ2YsV0FBakMsQ0FBNkMsUUFBN0M7OztXQUdPTixtQkFBVCxHQUErQjtNQUMzQixvQkFBRixFQUF3QitCLFdBQXhCLENBQW9DLFFBQXBDO01BQ0UsSUFBRixFQUFRQSxXQUFSLENBQW9CLFFBQXBCOzs7V0FHTzdCLGlCQUFULEdBQTZCOzs7UUFHdkI4QixpQkFBaUJ6QixFQUFFLElBQUYsRUFBUTBCLElBQVIsRUFBckI7O1FBRUlELGVBQWVFLFFBQWYsQ0FBd0Isd0JBQXhCLENBQUosRUFBdUQ7cUJBQ3RDNUIsV0FBZixDQUEyQix3QkFBM0I7S0FERixNQUVPO3FCQUNVbUIsUUFBZixDQUF3Qix3QkFBeEI7Ozs7U0FJRzs7R0FBUDtDQXhIYSxHQUFmOztBQ0pBLFlBQWUsQ0FBQyxZQUFNOztNQUVoQlUsV0FBSixFQUNFQyxVQURGLEVBRUVDLFNBRkYsRUFHRUMsS0FIRixFQUlFQyxZQUpGOztXQU1TM0MsSUFBVCxHQUFnQjs7bUJBRUNXLEVBQUUsVUFBRixDQUFmO1lBQ1FnQyxhQUFhQyxJQUFiLENBQWtCLE1BQWxCLENBQVI7a0JBQ2NELGFBQWFDLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFVBQS9CLENBQWQ7Z0JBQ1lGLGFBQWFDLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFFBQS9CLENBQVo7Ozs7OztXQU1PQyxXQUFULEdBQXVCOztRQUVqQkMsU0FBU3BDLEVBQUUsa0JBQUYsQ0FBYjtXQUNPcUMsTUFBUCxDQUFjLFVBQVVDLFFBQVYsRUFBb0I7UUFDOUIsSUFBRixFQUFRcEIsUUFBUixDQUFpQixPQUFqQjtLQURGOztNQUlFcUIsU0FBRixDQUFZQyxXQUFaLENBQXdCO2FBQ2YsSUFEZTtlQUViO0tBRlg7O01BS0VELFNBQUYsQ0FBWUUsU0FBWixDQUFzQixXQUF0QixFQUFtQyxVQUFVQyxNQUFWLEVBQWtCQyxPQUFsQixFQUEyQjthQUNyRCxLQUFLQyxRQUFMLENBQWNELE9BQWQsS0FDTEQsT0FBT2hDLEtBQVAsQ0FBYSwrQ0FBYixDQURGO0tBREYsRUFHRyxxQ0FISDs7VUFLTW1DLFFBQU4sQ0FBZTtxQkFDRSx5QkFBWTs7T0FEZDtzQkFJRyx3QkFBVUMsS0FBVixFQUFpQkgsT0FBakIsRUFBMEI7O1lBRXBDLENBQUMzQyxFQUFFMkMsT0FBRixFQUFXSSxPQUFYLENBQW1CLE1BQW5CLEVBQTJCZCxJQUEzQixDQUFnQyx3QkFBaEMsRUFBMERlLE1BQS9ELEVBQXVFO1lBQ25FTCxPQUFGLEVBQVdNLE1BQVgsR0FBb0JDLE1BQXBCLENBQTJCSixLQUEzQjtTQURGLE1BRU87WUFDSEgsT0FBRixFQUFXSSxPQUFYLENBQW1CLE1BQW5CLEVBQTJCZCxJQUEzQixDQUFnQyx3QkFBaEMsRUFBMERpQixNQUExRCxDQUFpRUosS0FBakU7O09BVFM7YUFZTjtlQUNFO29CQUNLLElBREw7bUJBRUk7U0FITjtnQkFLRztvQkFDSSxJQURKO21CQUVHO1NBUE47cUJBU1E7b0JBQ0QsSUFEQztxQkFFQTtTQVhSO21CQWFNO29CQUNDLElBREQ7cUJBRUU7U0FmUjtrQkFpQks7b0JBQ0UsSUFERjtxQkFFRztTQW5CUjtlQXFCRTtvQkFDSyxJQURMO3FCQUVNO1NBdkJSO2dCQXlCRztvQkFDSSxJQURKO3FCQUVLOzs7S0F2Q2pCOztVQTRDTWIsSUFBTixDQUFXLGVBQVgsRUFBNEIzQyxFQUE1QixDQUErQixPQUEvQixFQUF3QyxZQUFZO2FBQzNDUixRQUFQLENBQWdCcUUsT0FBaEIsQ0FBd0JyQixTQUF4QjtLQURGOzs7V0FNT3NCLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCO1FBQ2xCQyxXQUFKLEVBQ0VDLGNBREY7O1FBR0l4QixNQUFNeUIsS0FBTixFQUFKLEVBQW1CO1lBQ1h6RCxXQUFOLENBQWtCLGNBQWxCO21CQUNhbUIsUUFBYixDQUFzQixZQUF0QjtvQkFDY2EsTUFBTTBCLGNBQU4sRUFBZDs7dUJBRWlCQyxPQUFPSixXQUFQLENBQWpCOztjQUVRQyxjQUFSOztXQUVLLEtBQVA7OztXQUdPRyxNQUFULENBQWdCeEIsSUFBaEIsRUFBc0I7Ozs7V0FJYkEsSUFBUDs7O1dBR095QixPQUFULENBQWlCekIsSUFBakIsRUFBdUI7TUFDbkIwQixJQUFGLENBQU87Y0FDRyxNQURIO1dBRUFoQyxXQUZBO1lBR0NNO0tBSFIsRUFJRzJCLE9BSkgsQ0FJVyxVQUFVQyxHQUFWLEVBQWU7bUJBQ1g1QyxRQUFiLENBQXNCLFNBQXRCO21CQUNhbkIsV0FBYixDQUF5QixZQUF6QjtLQU5GLEVBUUdnRSxLQVJILENBUVMsVUFBVUQsR0FBVixFQUFlO1lBQ2Q1QyxRQUFOLENBQWUsY0FBZjttQkFDYW5CLFdBQWIsQ0FBeUIsWUFBekI7Z0JBQ1VpRSxFQUFWLENBQWFoRSxFQUFFLGVBQUYsQ0FBYjtLQVhKOzs7V0FlT2lFLFFBQVQsR0FBb0I7O01BRWhCLFVBQUYsRUFBYzNFLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsWUFBWTtRQUNsQyxpQkFBRixFQUFxQjJCLElBQXJCO1FBQ0UsTUFBTWpCLEVBQUUsSUFBRixFQUFRa0MsSUFBUixDQUFhLFNBQWIsQ0FBUixFQUFpQ1osSUFBakM7S0FGRjs7O1NBTUs7O0dBQVA7Q0FySWEsR0FBZjs7QUNBQSxlQUFlLENBQUMsWUFBTTs7V0FFWGpDLElBQVQsR0FBZ0I7WUFDTjZFLEdBQVIsQ0FBWSx1QkFBWjs7O01BR0UsaUNBQUYsRUFBcUM1RSxFQUFyQyxDQUF3QyxPQUF4QyxFQUFpRCxZQUFZO1FBQ3pELE1BQUYsRUFBVWtDLFdBQVYsQ0FBc0IsdUJBQXRCO0tBREY7Ozs7O1dBT08yQyxjQUFULEdBQTBCO1FBQ3BCQyxTQUFKLEVBQ0VDLFNBREYsRUFFRUMsU0FGRjs7TUFJRSxjQUFGLEVBQWtCQyxJQUFsQixDQUF1QixVQUFVQyxLQUFWLEVBQWlCO2tCQUMxQnhFLEVBQUUsSUFBRixDQUFaO2tCQUNhc0UsVUFBVXBDLElBQVYsQ0FBZSxlQUFmLENBQUQsR0FBb0Msd0VBQXdFb0MsVUFBVXBDLElBQVYsQ0FBZSxlQUFmLENBQXhFLEdBQTBHLGtCQUE5SSxHQUFtSyw2RkFBL0s7a0JBQ2FvQyxVQUFVcEMsSUFBVixDQUFlLGVBQWYsQ0FBRCxHQUFvQyx3RUFBd0VvQyxVQUFVcEMsSUFBVixDQUFlLGVBQWYsQ0FBeEUsR0FBMEcsa0JBQTlJLEdBQW1LLHlGQUEvSzs7Z0JBRVV1QyxLQUFWLENBQWdCO3dCQUNFSCxVQUFVcEMsSUFBVixDQUFlLGdCQUFmLEtBQW9DLEtBRHRDO2dCQUVOb0MsVUFBVXBDLElBQVYsQ0FBZSxRQUFmLEtBQTRCLEtBRnRCO2tCQUdKb0MsVUFBVXBDLElBQVYsQ0FBZSxVQUFmLEtBQThCLEtBSDFCO2NBSVJvQyxVQUFVcEMsSUFBVixDQUFlLE1BQWYsS0FBMEIsS0FKbEI7Y0FLUm9DLFVBQVVwQyxJQUFWLENBQWUsTUFBZixLQUEwQixLQUxsQjtrQkFNSm9DLFVBQVVwQyxJQUFWLENBQWUsVUFBZixLQUE4QixLQU4xQjtxQkFPRCxJQVBDO21CQVFIbUMsU0FSRzttQkFTSEQsU0FURztvQkFVRkUsVUFBVXBDLElBQVYsQ0FBZSxZQUFmLEtBQWdDLEVBVjlCO2VBV1BvQyxVQUFVcEMsSUFBVixDQUFlLE9BQWYsS0FBMkIsRUFYcEI7d0JBWUVvQyxVQUFVcEMsSUFBVixDQUFlLGVBQWYsS0FBbUMsQ0FackM7c0JBYUFvQyxVQUFVcEMsSUFBVixDQUFlLGNBQWYsS0FBa0MsQ0FibEM7ZUFjUG9DLFVBQVVwQyxJQUFWLENBQWUsT0FBZixLQUEyQjtPQWRwQztLQUxGOzs7U0F3Qks7O0dBQVA7Q0ExQ2EsR0FBZjs7QUNBQSxXQUFlLENBQUMsWUFBTTs7O01BR2hCd0MsV0FBVyxFQUFmO01BQ0VDLFVBQVUsQ0FEWjs7V0FHU3RGLElBQVQsQ0FBY3VGLEtBQWQsRUFBcUI7O1FBRWZ6RSxRQUFRSCxFQUFFNEUsS0FBRixDQUFaOzs7ZUFHVyxDQUFDLFFBQUQsRUFBVywrQkFBWCxFQUE0QywyQkFBNUMsRUFBeUUsNEJBQXpFLEVBQXVHLCtCQUF2RyxFQUF3SSwyQkFBeEksRUFBcUssbUNBQXJLLEVBQTBNLDhCQUExTSxFQUEwTyxnQ0FBMU8sQ0FBWDs7O1VBR00zQyxJQUFOLENBQVcsa0JBQVgsRUFBK0IzQyxFQUEvQixDQUFrQyxPQUFsQyxFQUEyQ0MsS0FBM0MsRUFBa0RzRixTQUFsRDs7O1dBR09BLFNBQVQsR0FBcUI7O1dBRW5CLENBQVdDLElBQVgsQ0FBZ0IsT0FBaEIsRUFBeUJKLFNBQVNDLE9BQVQsQ0FBekI7ZUFDVyxDQUFYOzs7U0FHSzs7R0FBUDtDQXZCYSxHQUFmOztBQ0FBLFdBQWUsQ0FBQyxZQUFNO01BQ2hCeEUsS0FBSjs7V0FFU2QsSUFBVCxDQUFjdUYsS0FBZCxFQUFxQjs7WUFFWDVFLEVBQUU0RSxLQUFGLENBQVI7Ozs7OztXQU1PRyxTQUFULEdBQXFCO1dBQ25CLENBQVd6RixFQUFYLENBQWMsT0FBZCxFQUF1QixVQUFVMEYsT0FBVixFQUFtQjtRQUN0QyxnQ0FBZ0NBLE9BQWhDLEdBQTBDLE1BQTVDLEVBQW9EL0QsSUFBcEQsR0FBMkRnRSxRQUEzRCxDQUFvRTlFLEtBQXBFLEVBQTJFVyxNQUEzRSxDQUFrRixNQUFsRjtLQURGOzs7U0FLSzs7R0FBUDtDQWpCYSxHQUFmOztBQ0ZBOzs7Ozs7Ozs7Ozs7O0FBYUEsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUVBO0FBQ0EsQUFDQSxBQUVBLElBQU1vRSxNQUFPLFlBQVk7V0FDZDdGLElBQVQsR0FBZ0I7OztNQUdaOEYsUUFBRixFQUFZQyxVQUFaOzs7UUFHSXBGLEVBQUUsVUFBRixFQUFjZ0QsTUFBbEIsRUFBMEJxQyxNQUFNaEcsSUFBTjtRQUN0QlcsRUFBRSxlQUFGLEVBQW1CZ0QsTUFBdkIsRUFBK0JzQyxLQUFLakcsSUFBTDtRQUMzQlcsRUFBRSxjQUFGLEVBQWtCZ0QsTUFBdEIsRUFBOEJ1QyxTQUFTbEcsSUFBVDs7O1FBRzFCVyxFQUFFLFVBQUYsRUFBY2dELE1BQWxCLEVBQTBCd0MsS0FBS25HLElBQUwsQ0FBVSxVQUFWO1FBQ3RCVyxFQUFFLFVBQUYsRUFBY2dELE1BQWxCLEVBQTBCeUMsS0FBS3BHLElBQUwsQ0FBVSxVQUFWOzs7Ozs7OztXQVFuQnFHLFNBQVQsR0FBcUI7TUFDakIsTUFBRixFQUFVeEUsUUFBVixDQUFtQnBCLElBQW5COzs7U0FHSzs7R0FBUDtDQXpCVSxFQUFaOzs7QUFnQ0FFLEVBQUVtRixRQUFGLEVBQVlRLEtBQVosQ0FBa0IsWUFBWTtNQUN4QnRHLElBQUo7Q0FERjs7In0=