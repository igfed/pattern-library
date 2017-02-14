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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvZXZlbnQtdGVzdC0xLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTIuanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxyXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XHJcblxyXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxyXG4gKi9cclxuXHJcbi8vIHVybCBwYXRoXHJcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbn0pKClcclxuXHJcbi8vIGxhbmd1YWdlXHJcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gJ2ZyJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdlbic7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBicm93c2VyIHdpZHRoXHJcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XHJcbn0pKClcclxuXHJcbi8vIGJhc2UgZXZlbnRFbWl0dGVyXHJcbmV4cG9ydCB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblxyXG5cclxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXHJcbi8vIEF0IHNvbWUgcG9pbnQsIHdlIHNob3VsZCBjb25zaWRlciBzcGxpdHRpbmcgaXQgdXAgaW50byBiaXRlLXNpemVkIHBpZWNlcy4gRXg6IG1vcmUtbmF2LmpzLCBtb3JlLXNvY2lhbC5qc1xyXG4vLyBhbmQgc28gb24uXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxyXG4gICAgX3Jlc2l6ZSgpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBldmVudCwgX21vcmVTZWN0aW9uTWVudUl0ZW0pO1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtbW9iaWxlLXRpdGxlJykub24oJ2NsaWNrJywgX21vYmlsZUNhdGVnb3J5TWVudSk7XHJcblxyXG4gICAgLy8gQ2xvc2UgYnV0dG9uXHJcbiAgICAkKCcuY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgX2Nsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAvLyBTb2NpYWwgZHJhd2VyXHJcbiAgICAkKCcuanMtb3Blbi1zb2NpYWxkcmF3ZXInKS5vbignY2xpY2snLCBfb3BlblNvY2lhbERyYXdlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFbmQgb2YgSW5pdFxyXG5cclxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChpZy5icm93c2VyV2lkdGggPCA2NDApIHtcclxuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2ZsZXgnKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21vcmVTZWN0aW9uTWVudUl0ZW0oKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpLFxyXG4gICAgICB3aWR0aCA9ICR0aGlzLndpZHRoKCksXHJcbiAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxyXG4gICAgICBjbGFzc05hbWUgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC9bXFx3LV0qY2F0ZWdvcnlbXFx3LV0qL2cpLFxyXG4gICAgICB0aXRsZSA9ICR0aGlzLnRleHQoKTtcclxuXHJcbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXHJcbiAgICBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKTtcclxuXHJcbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IHRpdGxlIG9uIGNsaWNrXHJcbiAgICBfZmlsdGVyVGl0bGUodGl0bGUpO1xyXG5cclxuICAgIC8vIEFycm93IHBvc2l0aW9uIG1vdmUgb24gY2xpY2tcclxuICAgIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWClcclxuXHJcbiAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXHJcbiAgICBfYW5pbWF0aW9uVW5kZXJsaW5lKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmZhZGVJbignc2xvdycpLmZvY3VzKCkuZmlsdGVyKCc6bm90KC4nICsgY2xhc3NOYW1lICsgJyknKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyVGl0bGUodGl0bGUpIHtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZU91dCgpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmFkZENsYXNzKCdhY3RpdmUnKS50ZXh0KHRpdGxlKTtcclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLnNob3coKS5jc3MoeyBsZWZ0OiBjZW50ZXJYIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FuaW1hdGlvblVuZGVybGluZSgpIHtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykuYWRkQ2xhc3MoJ2FuaW1hdGUnKVxyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9iaWxlQ2F0ZWdvcnlNZW51KCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfb3BlblNvY2lhbERyYXdlcigpIHtcclxuICAgIC8vIHRoaXMubmV4dCgpIHNlbGVjdHMgbmV4dCBzaWJsaW5nIGVsZW1lbnRcclxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cclxuICAgIHZhciBqc1NvY2lhbERyYXdlciA9ICQodGhpcykubmV4dCgpO1xyXG5cclxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLnJlbW92ZUNsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIGVuZHBvaW50VVJMLFxyXG4gICAgc3VjY2Vzc1VSTCxcclxuICAgIGNhbmNlbFVSTCxcclxuICAgICRmb3JtLFxyXG4gICAgJGZvcm1XcmFwcGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcclxuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XHJcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XHJcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcclxuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XHJcblxyXG4gICAgX3ZhbGlkYXRpb24oKTtcclxuICAgIF90b2dnbGVyKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XHJcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xyXG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgZGVidWc6IHRydWUsXHJcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxyXG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XHJcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcclxuXHJcbiAgICAkZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfcHJvY2VzcygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gVXNlIHRoZSBjdXN0b20tZXJyb3ItbG9jYXRpb24gbWFya2VyIGNsYXNzIHRvIGNoYW5nZSB3aGVyZSB0aGUgZXJyb3IgbGFiZWwgc2hvd3MgdXBcclxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcclxuICAgICAgICAgICQoZWxlbWVudCkucGFyZW50KCkuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBob25lMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0YWxfY29kZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBjZG5Qb3N0YWw6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRmb3JtLmZpbmQoJ2J1dHRvbi5jYW5jZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcHJvY2Vzcyhmb3JtKSB7XHJcbiAgICB2YXIgZm9ybURhdGFSYXcsXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkO1xyXG5cclxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgICAgLy8gSWYgd2UgbmVlZCB0byBtb2RpZnkgdGhlIGRhdGEsIHVzZSBwYXJzZSBtZXRob2RcclxuICAgICAgZm9ybURhdGFQYXJzZWQgPSBfcGFyc2UoZm9ybURhdGFSYXcpO1xyXG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxyXG4gICAgICBfc3VibWl0KGZvcm1EYXRhUGFyc2VkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XHJcbiAgICAvLyBFeGVjdXRlIGFueSBjdXN0b20gbG9naWMgaGVyZVxyXG5cclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N1Ym1pdChkYXRhKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgdXJsOiBlbmRwb2ludFVSTCxcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgIH0pXHJcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICAgIFNjcm9sbE1hbi50bygkKCcjc2VydmVyLWVycm9yJykpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF90b2dnbGVyKCkge1xyXG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXHJcbiAgICAkKCcudG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnRvZ2dsZS1jb250ZW50JykuaGlkZSgpO1xyXG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcclxuXHJcbiAgICAvLyBOb3Qgc3VyZSB3aGF0IHRoaXMgZG9lcyBhdCB0aGlzIHBvaW50IG9yIGhvdyBpdCByZWxhdGVzIHRvIENhcm91c2Vsc1xyXG4gICAgJCgnW2RhdGEtcmVzcG9uc2l2ZS10b2dnbGVdIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdzaXRlLWhlYWRlci1pcy1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9idWlsZENhcm91c2VsKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgIHZhciBwcmV2QXJyb3csXHJcbiAgICAgIG5leHRBcnJvdyxcclxuICAgICAgJGNhcm91c2VsO1xyXG5cclxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XHJcbiAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcclxuXHJcbiAgICAgICRjYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcclxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxyXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAvLyBEZWZpbmUgY29tcG9uZW50LWxldmVsIHZhcmlhYmxlc1xyXG4gIHZhciBtZXNzYWdlcyA9IFtdLFxyXG4gICAgY291bnRlciA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcclxuICAgIC8vIE9mdGVuIGEgZ29vZCBpZGVhIHRvIGluaXQgd2l0aCBhbiBIVE1MIHNjb3BlIChpZSwgY2xhc3MpXHJcbiAgICB2YXIgJHRoaXMgPSAkKHNjb3BlKTtcclxuXHJcbiAgICAvLyBMZXQncyBjcmVhdGUgYSBtZXNzYWdlIGFycmF5XHJcbiAgICBtZXNzYWdlcyA9IFsnSGVsbG8hJywgJ0lzIGl0IG1lIHlvdVxcJ3JlIGxvb2tpbmcgZm9yPycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBleWVzJywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIHNtaWxlJywgJ1lvdVxcJ3JlIGFsbCBJXFwndmUgZXZlciB3YW50ZWQnLCAnQW5kIG15IGFybXMgYXJlIG9wZW4gd2lkZScsICdcXCdjYXVzZSB5b3Uga25vdyBqdXN0IHdoYXQgdG8gc2F5JywgJ0FuZCB5b3Uga25vdyBqdXN0IHdoYXQgdG8gZG8nLCAnQW5kIEkgd2FudCB0byB0ZWxsIHlvdSBzbyBtdWNoJ107XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgY2xpY2sgaGFuZGxlclxyXG4gICAgJHRoaXMuZmluZCgnYS5idXR0b24ubWVzc2FnZScpLm9uKCdjbGljaycsIGV2ZW50LCBfc2F5SGVsbG8pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3NheUhlbGxvKCkge1xyXG4gICAgLy8gTGV0J3MgZW1pdCBhbiBldmVudCB3aXRoIGFuIGluZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHNlbmQgYWxvbmcgc29tZXRoaW5nIHRvIGRpc3BsYXlcclxuICAgIGlnLmVtaXR0ZXIuZW1pdCgnaGVsbG8nLCBtZXNzYWdlc1tjb3VudGVyXSk7XHJcbiAgICBjb3VudGVyICs9IDE7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIHZhciAkdGhpc1xyXG5cclxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XHJcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxyXG4gICAgJHRoaXMgPSAkKHNjb3BlKTtcclxuICAgIF9saXN0ZW5lcigpO1xyXG4gIH1cclxuXHJcbiAgLy8gV2Uga25vdyBub3RoaW5nIGFib3V0IHRoZSBjb21wb25lbnQgdGhhdCB3aWxsIHNlbmQgdGhlIG1lc3NhZ2UuIE9ubHkgdGhhdCBpdCB3aWxsIGhhdmVcclxuICAvLyBhbiBpZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHRoYXQgd2Ugd2lsbCByZWNlaXZlIGEgJ21lc3NhZ2UnIHRvIGRpc3BsYXkuXHJcbiAgZnVuY3Rpb24gX2xpc3RlbmVyKCkge1xyXG4gICAgaWcuZW1pdHRlci5vbignaGVsbG8nLCBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgICAkKCc8cCBjbGFzcz1cImFsZXJ0LWJveCBhbGVydFwiPicgKyBtZXNzYWdlICsgJzwvcD4nKS5oaWRlKCkuYXBwZW5kVG8oJHRoaXMpLmZhZGVJbignZmFzdCcpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcclxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cclxuXHJcbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXHJcbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXHJcbiBmb3IgaW5zdGFuY2UpLlxyXG5cclxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xyXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cclxuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXHJcbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcclxuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xyXG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xyXG5pbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XHJcbmltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XHJcbiAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbicpLmxlbmd0aCkgbW9yZS5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWNhcm91c2VsJykubGVuZ3RoKSBjYXJvdXNlbC5pbml0KCk7XHJcblxyXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XHJcblxyXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgIF9sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcblxyXG59KSgpXHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImJyb3dzZXJXaWR0aCIsIm91dGVyV2lkdGgiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiaW5pdCIsIm9uIiwiZXZlbnQiLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJpZyIsInJlbW92ZUNsYXNzIiwiJCIsImNzcyIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCJvZmZzZXQiLCJ3aWR0aCIsImNlbnRlclgiLCJsZWZ0IiwiY2xhc3NOYW1lIiwiYXR0ciIsIm1hdGNoIiwidGl0bGUiLCJ0ZXh0IiwiX2ZpbHRlckRyb3Bkb3duIiwiZmFkZUluIiwiZm9jdXMiLCJmaWx0ZXIiLCJoaWRlIiwiYWRkQ2xhc3MiLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJoYXNDbGFzcyIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJtZXNzYWdlcyIsImNvdW50ZXIiLCJzY29wZSIsIl9zYXlIZWxsbyIsImVtaXQiLCJfbGlzdGVuZXIiLCJtZXNzYWdlIiwiYXBwZW5kVG8iLCJhcHAiLCJkb2N1bWVudCIsImZvdW5kYXRpb24iLCJmb3JtcyIsIm1vcmUiLCJjYXJvdXNlbCIsImV2dDEiLCJldnQyIiwiX2xhbmd1YWdlIiwicmVhZHkiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7V0FDNUMsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQLEFBQU8sSUFBSUMsZUFBZ0IsWUFBTTtTQUN4QkosT0FBT0ssVUFBZDtDQUR3QixFQUFuQjs7O0FBS1AsQUFBTyxJQUFJQyxVQUFVLElBQUlDLFlBQUosRUFBZDs7QUM1QlA7Ozs7QUFJQSxBQUVBLFdBQWUsQ0FBQyxZQUFNO1dBQ1hDLElBQVQsR0FBZ0I7Ozs7Ozs7O01BUVosd0JBQUYsRUFBNEJDLEVBQTVCLENBQStCLE9BQS9CLEVBQXdDQyxLQUF4QyxFQUErQ0Msb0JBQS9DOzs7TUFHRSxpQ0FBRixFQUFxQ0YsRUFBckMsQ0FBd0MsT0FBeEMsRUFBaURHLG1CQUFqRDs7O01BR0UsZUFBRixFQUFtQkgsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0JJLFlBQS9COzs7TUFHRSx1QkFBRixFQUEyQkosRUFBM0IsQ0FBOEIsT0FBOUIsRUFBdUNLLGlCQUF2Qzs7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