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

var video = (function () {

  var a;

  function init() {

    _parseVideoComponents();
  }

  function _parseVideoComponents() {
    var $video,
        data = {},
        id,
        account,
        player,
        html,
        preloadOptions = ['auto', 'metadata', 'none'];

    $('.ig-video-js').each(function (index) {
      $video = $(this);

      // Capture options (required)
      data.id = $video.data('id');
      data.account = $video.data('account');
      data.player = $video.data('player');

      // Capture options (optional)
      data.title = $video.data('title') ? $video.data('title') : '';
      data.description = $video.data('description') ? $video.data('description') : '';
      data.auto = $video.data('autoplay') ? 'autoplay' : '';
      data.ctrl = $video.data('controls') ? 'controls' : '';
      data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';

      // Let's replace the ig-video 'directive' with the necessary Brightcove code
      _injectTemplate($video, data, index);

      // _displayVideo(id);
    });
  }

  function _injectTemplate($video, data, index) {
    var html = '<div class="video-container"><div class="video-container-responsive"><video data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video><script src="//players.brightcove.net/' + data.account + '/' + data.player + '_default/index.min.js"></script></div></div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video.replaceWith(html);
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
    if ($('.ig-video').length) video.init();

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMS5qcyIsIm1vZHVsZXMvZXZlbnQtdGVzdC0yLmpzIiwibW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcclxudXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxyXG5cclxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcclxuICovXHJcblxyXG4vLyB1cmwgcGF0aFxyXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG59KSgpXHJcblxyXG4vLyBsYW5ndWFnZVxyXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xyXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgcmV0dXJuICdmcic7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnZW4nO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYnJvd3NlciB3aWR0aFxyXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG59KSgpXHJcblxyXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxyXG5leHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cclxuXHJcbiIsIi8vIFRoaXMgaXMgbGVzcyBvZiBhIG1vZHVsZSB0aGFuIGl0IGlzIGEgY29sbGVjdGlvbiBvZiBjb2RlIGZvciBhIGNvbXBsZXRlIHBhZ2UgKE1vcmUgcGFnZSBpbiB0aGlzIGNhc2UpLlxyXG4vLyBBdCBzb21lIHBvaW50LCB3ZSBzaG91bGQgY29uc2lkZXIgc3BsaXR0aW5nIGl0IHVwIGludG8gYml0ZS1zaXplZCBwaWVjZXMuIEV4OiBtb3JlLW5hdi5qcywgbW9yZS1zb2NpYWwuanNcclxuLy8gYW5kIHNvIG9uLlxyXG5cclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIHJlc2l6ZSBiZWhhdmlvdXJcclxuICAgIF9yZXNpemUoKTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnVpdGVtJykub24oJ2NsaWNrJywgZXZlbnQsIF9tb3JlU2VjdGlvbk1lbnVJdGVtKTtcclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xyXG5cclxuICAgIC8vIENsb3NlIGJ1dHRvblxyXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XHJcblxyXG4gICAgLy8gU29jaWFsIGRyYXdlclxyXG4gICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykub24oJ2NsaWNrJywgX29wZW5Tb2NpYWxEcmF3ZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRW5kIG9mIEluaXRcclxuXHJcbiAgZnVuY3Rpb24gX3Jlc2l6ZSgpIHtcclxuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoaWcuYnJvd3NlcldpZHRoIDwgNjQwKSB7XHJcbiAgICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb3JlU2VjdGlvbk1lbnVJdGVtKCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcclxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICBjZW50ZXJYID0gb2Zmc2V0LmxlZnQgKyB3aWR0aCAvIDIgLSA1MCxcclxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcclxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xyXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcclxuXHJcbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXHJcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxyXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5mYWRlSW4oJ3Nsb3cnKS5mb2N1cygpLmZpbHRlcignOm5vdCguJyArIGNsYXNzTmFtZSArICcpJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVPdXQoKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5hZGRDbGFzcygnYWN0aXZlJykudGV4dCh0aXRsZSk7XHJcbiAgICB9LCAyMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcclxuICAgIH0sIDEwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21vYmlsZUNhdGVnb3J5TWVudSgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XHJcbiAgICAvLyB0aGlzLm5leHQoKSBzZWxlY3RzIG5leHQgc2libGluZyBlbGVtZW50XHJcbiAgICAvLyBhbnkgc3VnZ2VzdGlvbnMgb24gYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/XHJcbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcclxuXHJcbiAgICBpZiAoanNTb2NpYWxEcmF3ZXIuaGFzQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKSkge1xyXG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIuYWRkQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciBlbmRwb2ludFVSTCxcclxuICAgIHN1Y2Nlc3NVUkwsXHJcbiAgICBjYW5jZWxVUkwsXHJcbiAgICAkZm9ybSxcclxuICAgICRmb3JtV3JhcHBlcjtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXHJcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xyXG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xyXG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XHJcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xyXG5cclxuICAgIF92YWxpZGF0aW9uKCk7XHJcbiAgICBfdG9nZ2xlcigpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxyXG4gICAgdmFyIGpJbnB1dCA9ICQoJzppbnB1dCwgdGV4dGFyZWEnKTtcclxuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlLFxyXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcclxuICAgICAgICBwb3N0YWwubWF0Y2goL1thLXpBLVpdWzAtOV1bYS16QS1aXSgtfCB8KVswLTldW2EtekEtWl1bMC05XS8pO1xyXG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XHJcblxyXG4gICAgJGZvcm0udmFsaWRhdGUoe1xyXG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3Byb2Nlc3MoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXHJcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG9uZTI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWwyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xyXG4gICAgdmFyIGZvcm1EYXRhUmF3LFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcclxuXHJcbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcclxuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcclxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xyXG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcclxuXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICB9KVxyXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcclxuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcclxuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXHJcblxyXG4gICAgLy8gTm90IHN1cmUgd2hhdCB0aGlzIGRvZXMgYXQgdGhpcyBwb2ludCBvciBob3cgaXQgcmVsYXRlcyB0byBDYXJvdXNlbHNcclxuICAgICQoJ1tkYXRhLXJlc3BvbnNpdmUtdG9nZ2xlXSBidXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2l0ZS1oZWFkZXItaXMtYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICBuZXh0QXJyb3csXHJcbiAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAkKCcuaWctY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcclxuICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcclxuICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIGE7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgX3BhcnNlVmlkZW9Db21wb25lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb0NvbXBvbmVudHMoKSB7XHJcbiAgICB2YXIgJHZpZGVvLFxyXG4gICAgICBkYXRhID0ge30sXHJcbiAgICAgIGlkLFxyXG4gICAgICBhY2NvdW50LFxyXG4gICAgICBwbGF5ZXIsXHJcbiAgICAgIGh0bWwsXHJcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXVxyXG5cclxuICAgICQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICR2aWRlbyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKHJlcXVpcmVkKVxyXG4gICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcbiAgICAgIGRhdGEuYWNjb3VudCA9ICR2aWRlby5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgIGRhdGEucGxheWVyID0gJHZpZGVvLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChvcHRpb25hbClcclxuICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJyk6ICcnO1xyXG4gICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKTogJyc7XHJcbiAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JzogJyc7XHJcbiAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJzogJyc7XHJcbiAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKTogJ2F1dG8nO1xyXG5cclxuICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8gJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleClcclxuXHJcblxyXG5cclxuICAgICAgLy8gX2Rpc3BsYXlWaWRlbyhpZCk7XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPjx2aWRlbyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LyR7ZGF0YS5hY2NvdW50fS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PjwvZGl2PjwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9kaXNwbGF5VmlkZW8oaWQpIHtcclxuICAgIHZpZGVvanMoaWQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnIycgKyBpZCkuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIC8vIERlZmluZSBjb21wb25lbnQtbGV2ZWwgdmFyaWFibGVzXHJcbiAgdmFyIG1lc3NhZ2VzID0gW10sXHJcbiAgICBjb3VudGVyID0gMDtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcclxuICAgIHZhciAkdGhpcyA9ICQoc2NvcGUpO1xyXG5cclxuICAgIC8vIExldCdzIGNyZWF0ZSBhIG1lc3NhZ2UgYXJyYXlcclxuICAgIG1lc3NhZ2VzID0gWydIZWxsbyEnLCAnSXMgaXQgbWUgeW91XFwncmUgbG9va2luZyBmb3I/JywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIGV5ZXMnLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgc21pbGUnLCAnWW91XFwncmUgYWxsIElcXCd2ZSBldmVyIHdhbnRlZCcsICdBbmQgbXkgYXJtcyBhcmUgb3BlbiB3aWRlJywgJ1xcJ2NhdXNlIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBzYXknLCAnQW5kIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBkbycsICdBbmQgSSB3YW50IHRvIHRlbGwgeW91IHNvIG11Y2gnXTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciBjbGljayBoYW5kbGVyXHJcbiAgICAkdGhpcy5maW5kKCdhLmJ1dHRvbi5tZXNzYWdlJykub24oJ2NsaWNrJywgZXZlbnQsIF9zYXlIZWxsbyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc2F5SGVsbG8oKSB7XHJcbiAgICAvLyBMZXQncyBlbWl0IGFuIGV2ZW50IHdpdGggYW4gaW5kZW50aWZpZXIgb2YgJ2hlbGxvJyBhbmQgc2VuZCBhbG9uZyBzb21ldGhpbmcgdG8gZGlzcGxheVxyXG4gICAgaWcuZW1pdHRlci5lbWl0KCdoZWxsbycsIG1lc3NhZ2VzW2NvdW50ZXJdKTtcclxuICAgIGNvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcbiAgdmFyICR0aGlzXHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcclxuICAgIC8vIE9mdGVuIGEgZ29vZCBpZGVhIHRvIGluaXQgd2l0aCBhbiBIVE1MIHNjb3BlIChpZSwgY2xhc3MpXHJcbiAgICAkdGhpcyA9ICQoc2NvcGUpO1xyXG4gICAgX2xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICAvLyBXZSBrbm93IG5vdGhpbmcgYWJvdXQgdGhlIGNvbXBvbmVudCB0aGF0IHdpbGwgc2VuZCB0aGUgbWVzc2FnZS4gT25seSB0aGF0IGl0IHdpbGwgaGF2ZVxyXG4gIC8vIGFuIGlkZW50aWZpZXIgb2YgJ2hlbGxvJyBhbmQgdGhhdCB3ZSB3aWxsIHJlY2VpdmUgYSAnbWVzc2FnZScgdG8gZGlzcGxheS5cclxuICBmdW5jdGlvbiBfbGlzdGVuZXIoKSB7XHJcbiAgICBpZy5lbWl0dGVyLm9uKCdoZWxsbycsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgICQoJzxwIGNsYXNzPVwiYWxlcnQtYm94IGFsZXJ0XCI+JyArIG1lc3NhZ2UgKyAnPC9wPicpLmhpZGUoKS5hcHBlbmRUbygkdGhpcykuZmFkZUluKCdmYXN0Jyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxyXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxyXG5cclxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cclxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcclxuIGZvciBpbnN0YW5jZSkuXHJcblxyXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXHJcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xyXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cclxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cclxuICovXHJcblxyXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL2FjY29yZGlvbi5qcyc7XHJcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcclxuaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xyXG5pbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlbycpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG5cclxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXHJcbiAgICBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcclxuICAgIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xyXG5cclxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XHJcbiAgICBfbGFuZ3VhZ2UoKTtcclxuICB9XHJcblxyXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxyXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xyXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgYXBwLmluaXQoKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJicm93c2VyV2lkdGgiLCJvdXRlcldpZHRoIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImluaXQiLCJvbiIsImV2ZW50IiwiX21vcmVTZWN0aW9uTWVudUl0ZW0iLCJfbW9iaWxlQ2F0ZWdvcnlNZW51IiwiX2Nsb3NlQnV0dG9uIiwiX29wZW5Tb2NpYWxEcmF3ZXIiLCJfcmVzaXplIiwicmVzaXplIiwiaWciLCJyZW1vdmVDbGFzcyIsIiQiLCJjc3MiLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0Iiwid2lkdGgiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZvY3VzIiwiZmlsdGVyIiwiaGlkZSIsImFkZENsYXNzIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiaGFzQ2xhc3MiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiYSIsIl9wYXJzZVZpZGVvQ29tcG9uZW50cyIsIiR2aWRlbyIsImlkIiwiYWNjb3VudCIsInBsYXllciIsImh0bWwiLCJwcmVsb2FkT3B0aW9ucyIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwiX2luamVjdFRlbXBsYXRlIiwicmVwbGFjZVdpdGgiLCJtZXNzYWdlcyIsImNvdW50ZXIiLCJzY29wZSIsIl9zYXlIZWxsbyIsImVtaXQiLCJfbGlzdGVuZXIiLCJtZXNzYWdlIiwiYXBwZW5kVG8iLCJhcHAiLCJkb2N1bWVudCIsImZvdW5kYXRpb24iLCJmb3JtcyIsIm1vcmUiLCJjYXJvdXNlbCIsInZpZGVvIiwiZXZ0MSIsImV2dDIiLCJfbGFuZ3VhZ2UiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNBLEFBQU87OztBQUtQLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01BQ25CQyxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUFsRCxFQUFxRDtXQUM1QyxJQUFQO0dBREYsTUFFTztXQUNFLElBQVA7O0NBSmMsRUFBWDs7O0FBU1AsQUFBTyxJQUFJQyxlQUFnQixZQUFNO1NBQ3hCSixPQUFPSyxVQUFkO0NBRHdCLEVBQW5COzs7QUFLUCxBQUFPLElBQUlDLFVBQVUsSUFBSUMsWUFBSixFQUFkOztBQzVCUDs7OztBQUlBLEFBRUEsV0FBZSxDQUFDLFlBQU07V0FDWEMsSUFBVCxHQUFnQjs7Ozs7Ozs7TUFRWix3QkFBRixFQUE0QkMsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0NDLEtBQXhDLEVBQStDQyxvQkFBL0M7OztNQUdFLGlDQUFGLEVBQXFDRixFQUFyQyxDQUF3QyxPQUF4QyxFQUFpREcsbUJBQWpEOzs7TUFHRSxlQUFGLEVBQW1CSCxFQUFuQixDQUFzQixPQUF0QixFQUErQkksWUFBL0I7OztNQUdFLHVCQUFGLEVBQTJCSixFQUEzQixDQUE4QixPQUE5QixFQUF1Q0ssaUJBQXZDOzs7OztXQUtPQyxPQUFULEdBQW1CO01BQ2ZmLE1BQUYsRUFBVWdCLE1BQVYsQ0FBaUIsWUFBWTtVQUN2QkMsWUFBQSxHQUFrQixHQUF0QixFQUEyQjtVQUN2QixvQkFBRixFQUF3QkMsV0FBeEIsQ0FBb0MsU0FBcEM7WUFDSUMsRUFBRSxvQkFBRixFQUF3QkMsR0FBeEIsQ0FBNEIsU0FBNUIsTUFBMkMsTUFBL0MsRUFBdUQ7WUFDbkQsb0JBQUYsRUFBd0JBLEdBQXhCLENBQTRCLFNBQTVCLEVBQXVDLE9BQXZDOztPQUhKLE1BS087WUFDREQsRUFBRSxvQkFBRixFQUF3QkMsR0FBeEIsQ0FBNEIsU0FBNUIsTUFBMkMsT0FBL0MsRUFBd0Q7WUFDcEQsb0JBQUYsRUFBd0JBLEdBQXhCLENBQTRCLFNBQTVCLEVBQXVDLE1BQXZDOzs7S0FSTjs7O1dBdUJPVCxvQkFBVCxHQUFnQztVQUN4QlUsY0FBTjs7UUFFSUMsUUFBUUgsRUFBRSxJQUFGLENBQVo7UUFDRUksU0FBU0QsTUFBTUMsTUFBTixFQURYO1FBRUVDLFFBQVFGLE1BQU1FLEtBQU4sRUFGVjtRQUdFQyxVQUFVRixPQUFPRyxJQUFQLEdBQWNGLFFBQVEsQ0FBdEIsR0FBMEIsRUFIdEM7UUFJRUcsWUFBWUwsTUFBTU0sSUFBTixDQUFXLE9BQVgsRUFBb0JDLEtBQXBCLENBQTBCLHVCQUExQixDQUpkO1FBS0VDLFFBQVFSLE1BQU1TLElBQU4sRUFMVjs7O29CQVFnQkosU0FBaEI7OztpQkFHYUcsS0FBYjs7O3FCQUdpQkwsT0FBakI7Ozs7OztXQU1PTyxlQUFULENBQXlCTCxTQUF6QixFQUFvQztNQUNoQyw4Q0FBRixFQUFrRE0sTUFBbEQsQ0FBeUQsTUFBekQsRUFBaUVDLEtBQWpFLEdBQXlFQyxNQUF6RSxDQUFnRixXQUFXUixTQUFYLEdBQXVCLEdBQXZHLEVBQTRHUyxJQUE1RztNQUNFLDZCQUFGLEVBQWlDQyxRQUFqQyxDQUEwQyxRQUExQzs7O1dBR09DLFlBQVQsQ0FBc0JSLEtBQXRCLEVBQTZCO01BQ3pCLDRCQUFGLEVBQWdDUyxPQUFoQztNQUNFLDZCQUFGLEVBQWlDckIsV0FBakMsQ0FBNkMsUUFBN0M7ZUFDVyxZQUFNO1FBQ2IsNkJBQUYsRUFBaUNtQixRQUFqQyxDQUEwQyxRQUExQyxFQUFvRE4sSUFBcEQsQ0FBeURELEtBQXpEO0tBREYsRUFFRyxHQUZIOzs7V0FLT1UsZ0JBQVQsQ0FBMEJmLE9BQTFCLEVBQW1DO01BQy9CLHNDQUFGLEVBQTBDZ0IsSUFBMUMsR0FBaURyQixHQUFqRCxDQUFxRCxFQUFFTSxNQUFNRCxPQUFSLEVBQXJEOzs7V0FHT2lCLG1CQUFULEdBQStCO01BQzNCLG9CQUFGLEVBQXdCeEIsV0FBeEIsQ0FBb0MsU0FBcEM7ZUFDVyxZQUFNO1FBQ2Isb0JBQUYsRUFBd0JtQixRQUF4QixDQUFpQyxTQUFqQztLQURGLEVBRUcsR0FGSDs7O1dBS094QixZQUFULEdBQXdCO01BQ3BCLDhDQUFGLEVBQWtEdUIsSUFBbEQ7TUFDRSxzQ0FBRixFQUEwQ0EsSUFBMUM7TUFDRSxvQkFBRixFQUF3QmxCLFdBQXhCLENBQW9DLFNBQXBDO01BQ0UsNkJBQUYsRUFBaUNBLFdBQWpDLENBQTZDLFFBQTdDO01BQ0UsNEJBQUYsRUFBZ0NlLE1BQWhDLENBQXVDLE1BQXZDO01BQ0UsNkJBQUYsRUFBaUNmLFdBQWpDLENBQTZDLFFBQTdDOzs7V0FHT04sbUJBQVQsR0FBK0I7TUFDM0Isb0JBQUYsRUFBd0IrQixXQUF4QixDQUFvQyxRQUFwQztNQUNFLElBQUYsRUFBUUEsV0FBUixDQUFvQixRQUFwQjs7O1dBR083QixpQkFBVCxHQUE2Qjs7O1FBR3ZCOEIsaUJBQWlCekIsRUFBRSxJQUFGLEVBQVEwQixJQUFSLEVBQXJCOztRQUVJRCxlQUFlRSxRQUFmLENBQXdCLHdCQUF4QixDQUFKLEVBQXVEO3FCQUN0QzVCLFdBQWYsQ0FBMkIsd0JBQTNCO0tBREYsTUFFTztxQkFDVW1CLFFBQWYsQ0FBd0Isd0JBQXhCOzs7O1NBSUc7O0dBQVA7Q0F4SGEsR0FBZjs7QUNKQSxZQUFlLENBQUMsWUFBTTs7TUFFaEJVLFdBQUosRUFDRUMsVUFERixFQUVFQyxTQUZGLEVBR0VDLEtBSEYsRUFJRUMsWUFKRjs7V0FNUzNDLElBQVQsR0FBZ0I7O21CQUVDVyxFQUFFLFVBQUYsQ0FBZjtZQUNRZ0MsYUFBYUMsSUFBYixDQUFrQixNQUFsQixDQUFSO2tCQUNjRCxhQUFhQyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixVQUEvQixDQUFkO2dCQUNZRixhQUFhQyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixRQUEvQixDQUFaOzs7Ozs7V0FNT0MsV0FBVCxHQUF1Qjs7UUFFakJDLFNBQVNwQyxFQUFFLGtCQUFGLENBQWI7V0FDT3FDLE1BQVAsQ0FBYyxVQUFVQyxRQUFWLEVBQW9CO1FBQzlCLElBQUYsRUFBUXBCLFFBQVIsQ0FBaUIsT0FBakI7S0FERjs7TUFJRXFCLFNBQUYsQ0FBWUMsV0FBWixDQUF3QjthQUNmLElBRGU7ZUFFYjtLQUZYOztNQUtFRCxTQUFGLENBQVlFLFNBQVosQ0FBc0IsV0FBdEIsRUFBbUMsVUFBVUMsTUFBVixFQUFrQkMsT0FBbEIsRUFBMkI7YUFDckQsS0FBS0MsUUFBTCxDQUFjRCxPQUFkLEtBQ0xELE9BQU9oQyxLQUFQLENBQWEsK0NBQWIsQ0FERjtLQURGLEVBR0cscUNBSEg7O1VBS01tQyxRQUFOLENBQWU7cUJBQ0UseUJBQVk7O09BRGQ7c0JBSUcsd0JBQVVDLEtBQVYsRUFBaUJILE9BQWpCLEVBQTBCOztZQUVwQyxDQUFDM0MsRUFBRTJDLE9BQUYsRUFBV0ksT0FBWCxDQUFtQixNQUFuQixFQUEyQmQsSUFBM0IsQ0FBZ0Msd0JBQWhDLEVBQTBEZSxNQUEvRCxFQUF1RTtZQUNuRUwsT0FBRixFQUFXTSxNQUFYLEdBQW9CQyxNQUFwQixDQUEyQkosS0FBM0I7U0FERixNQUVPO1lBQ0hILE9BQUYsRUFBV0ksT0FBWCxDQUFtQixNQUFuQixFQUEyQmQsSUFBM0IsQ0FBZ0Msd0JBQWhDLEVBQTBEaUIsTUFBMUQsQ0FBaUVKLEtBQWpFOztPQVRTO2FBWU47ZUFDRTtvQkFDSyxJQURMO21CQUVJO1NBSE47Z0JBS0c7b0JBQ0ksSUFESjttQkFFRztTQVBOO3FCQVNRO29CQUNELElBREM7cUJBRUE7U0FYUjttQkFhTTtvQkFDQyxJQUREO3FCQUVFO1NBZlI7a0JBaUJLO29CQUNFLElBREY7cUJBRUc7U0FuQlI7ZUFxQkU7b0JBQ0ssSUFETDtxQkFFTTtTQXZCUjtnQkF5Qkc7b0JBQ0ksSUFESjtxQkFFSzs7O0tBdkNqQjs7VUE0Q01iLElBQU4sQ0FBVyxlQUFYLEVBQTRCM0MsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsWUFBWTthQUMzQ1IsUUFBUCxDQUFnQnFFLE9BQWhCLENBQXdCckIsU0FBeEI7S0FERjs7O1dBTU9zQixRQUFULENBQWtCQyxJQUFsQixFQUF3QjtRQUNsQkMsV0FBSixFQUNFQyxjQURGOztRQUdJeEIsTUFBTXlCLEtBQU4sRUFBSixFQUFtQjtZQUNYekQsV0FBTixDQUFrQixjQUFsQjttQkFDYW1CLFFBQWIsQ0FBc0IsWUFBdEI7b0JBQ2NhLE1BQU0wQixjQUFOLEVBQWQ7O3VCQUVpQkMsT0FBT0osV0FBUCxDQUFqQjs7Y0FFUUMsY0FBUjs7V0FFSyxLQUFQOzs7V0FHT0csTUFBVCxDQUFnQnhCLElBQWhCLEVBQXNCOzs7O1dBSWJBLElBQVA7OztXQUdPeUIsT0FBVCxDQUFpQnpCLElBQWpCLEVBQXVCO01BQ25CMEIsSUFBRixDQUFPO2NBQ0csTUFESDtXQUVBaEMsV0FGQTtZQUdDTTtLQUhSLEVBSUcyQixPQUpILENBSVcsVUFBVUMsR0FBVixFQUFlO21CQUNYNUMsUUFBYixDQUFzQixTQUF0QjttQkFDYW5CLFdBQWIsQ0FBeUIsWUFBekI7S0FORixFQVFHZ0UsS0FSSCxDQVFTLFVBQVVELEdBQVYsRUFBZTtZQUNkNUMsUUFBTixDQUFlLGNBQWY7bUJBQ2FuQixXQUFiLENBQXlCLFlBQXpCO2dCQUNVaUUsRUFBVixDQUFhaEUsRUFBRSxlQUFGLENBQWI7S0FYSjs7O1dBZU9pRSxRQUFULEdBQW9COztNQUVoQixVQUFGLEVBQWMzRSxFQUFkLENBQWlCLE9BQWpCLEVBQTBCLFlBQVk7UUFDbEMsaUJBQUYsRUFBcUIyQixJQUFyQjtRQUNFLE1BQU1qQixFQUFFLElBQUYsRUFBUWtDLElBQVIsQ0FBYSxTQUFiLENBQVIsRUFBaUNaLElBQWpDO0tBRkY7OztTQU1LOztHQUFQO0NBcklhLEdBQWY7O0FDQUEsZUFBZSxDQUFDLFlBQU07O1dBRVhqQyxJQUFULEdBQWdCO1lBQ042RSxHQUFSLENBQVksdUJBQVo7OztNQUdFLGlDQUFGLEVBQXFDNUUsRUFBckMsQ0FBd0MsT0FBeEMsRUFBaUQsWUFBWTtRQUN6RCxNQUFGLEVBQVVrQyxXQUFWLENBQXNCLHVCQUF0QjtLQURGOzs7OztXQU9PMkMsY0FBVCxHQUEwQjtRQUNwQkMsU0FBSixFQUNFQyxTQURGLEVBRUVDLFNBRkY7O01BSUUsY0FBRixFQUFrQkMsSUFBbEIsQ0FBdUIsVUFBVUMsS0FBVixFQUFpQjtrQkFDMUJ4RSxFQUFFLElBQUYsQ0FBWjtrQkFDYXNFLFVBQVVwQyxJQUFWLENBQWUsZUFBZixDQUFELEdBQW9DLHdFQUF3RW9DLFVBQVVwQyxJQUFWLENBQWUsZUFBZixDQUF4RSxHQUEwRyxrQkFBOUksR0FBbUssNkZBQS9LO2tCQUNhb0MsVUFBVXBDLElBQVYsQ0FBZSxlQUFmLENBQUQsR0FBb0Msd0VBQXdFb0MsVUFBVXBDLElBQVYsQ0FBZSxlQUFmLENBQXhFLEdBQTBHLGtCQUE5SSxHQUFtSyx5RkFBL0s7O2dCQUVVdUMsS0FBVixDQUFnQjt3QkFDRUgsVUFBVXBDLElBQVYsQ0FBZSxnQkFBZixLQUFvQyxLQUR0QztnQkFFTm9DLFVBQVVwQyxJQUFWLENBQWUsUUFBZixLQUE0QixLQUZ0QjtrQkFHSm9DLFVBQVVwQyxJQUFWLENBQWUsVUFBZixLQUE4QixLQUgxQjtjQUlSb0MsVUFBVXBDLElBQVYsQ0FBZSxNQUFmLEtBQTBCLEtBSmxCO2NBS1JvQyxVQUFVcEMsSUFBVixDQUFlLE1BQWYsS0FBMEIsS0FMbEI7a0JBTUpvQyxVQUFVcEMsSUFBVixDQUFlLFVBQWYsS0FBOEIsS0FOMUI7cUJBT0QsSUFQQzttQkFRSG1DLFNBUkc7bUJBU0hELFNBVEc7b0JBVUZFLFVBQVVwQyxJQUFWLENBQWUsWUFBZixLQUFnQyxFQVY5QjtlQVdQb0MsVUFBVXBDLElBQVYsQ0FBZSxPQUFmLEtBQTJCLEVBWHBCO3dCQVlFb0MsVUFBVXBDLElBQVYsQ0FBZSxlQUFmLEtBQW1DLENBWnJDO3NCQWFBb0MsVUFBVXBDLElBQVYsQ0FBZSxjQUFmLEtBQWtDLENBYmxDO2VBY1BvQyxVQUFVcEMsSUFBVixDQUFlLE9BQWYsS0FBMkI7T0FkcEM7S0FMRjs7O1NBd0JLOztHQUFQO0NBMUNhLEdBQWY7O0FDQUEsWUFBZSxDQUFDLFlBQU07O01BRWhCd0MsQ0FBSjs7V0FFU3JGLElBQVQsR0FBZ0I7Ozs7O1dBS1BzRixxQkFBVCxHQUFpQztRQUMzQkMsTUFBSjtRQUNFMUMsT0FBTyxFQURUO1FBRUUyQyxFQUZGO1FBR0VDLE9BSEY7UUFJRUMsTUFKRjtRQUtFQyxJQUxGO1FBTUVDLGlCQUFpQixDQUFDLE1BQUQsRUFBUyxVQUFULEVBQXFCLE1BQXJCLENBTm5COztNQVFFLGNBQUYsRUFBa0JWLElBQWxCLENBQXVCLFVBQVVDLEtBQVYsRUFBaUI7ZUFDN0J4RSxFQUFFLElBQUYsQ0FBVDs7O1dBR0s2RSxFQUFMLEdBQVVELE9BQU8xQyxJQUFQLENBQVksSUFBWixDQUFWO1dBQ0s0QyxPQUFMLEdBQWVGLE9BQU8xQyxJQUFQLENBQVksU0FBWixDQUFmO1dBQ0s2QyxNQUFMLEdBQWNILE9BQU8xQyxJQUFQLENBQVksUUFBWixDQUFkOzs7V0FHS3ZCLEtBQUwsR0FBYWlFLE9BQU8xQyxJQUFQLENBQVksT0FBWixJQUF1QjBDLE9BQU8xQyxJQUFQLENBQVksT0FBWixDQUF2QixHQUE2QyxFQUExRDtXQUNLZ0QsV0FBTCxHQUFtQk4sT0FBTzFDLElBQVAsQ0FBWSxhQUFaLElBQTZCMEMsT0FBTzFDLElBQVAsQ0FBWSxhQUFaLENBQTdCLEdBQXlELEVBQTVFO1dBQ0tpRCxJQUFMLEdBQVlQLE9BQU8xQyxJQUFQLENBQVksVUFBWixJQUEwQixVQUExQixHQUFzQyxFQUFsRDtXQUNLa0QsSUFBTCxHQUFZUixPQUFPMUMsSUFBUCxDQUFZLFVBQVosSUFBMEIsVUFBMUIsR0FBc0MsRUFBbEQ7V0FDS21ELE9BQUwsR0FBZ0JKLGVBQWVqRyxPQUFmLENBQXVCNEYsT0FBTzFDLElBQVAsQ0FBWSxTQUFaLENBQXZCLElBQWlELENBQUMsQ0FBbkQsR0FBd0QwQyxPQUFPMUMsSUFBUCxDQUFZLFNBQVosQ0FBeEQsR0FBZ0YsTUFBL0Y7OztzQkFHZ0IwQyxNQUFoQixFQUF3QjFDLElBQXhCLEVBQThCc0MsS0FBOUI7OztLQWhCRjs7O1dBeUJPYyxlQUFULENBQXlCVixNQUF6QixFQUFpQzFDLElBQWpDLEVBQXVDc0MsS0FBdkMsRUFBOEM7UUFDeENRLHVHQUFxRzlDLEtBQUsyQyxFQUExRyxtQkFBMEgzQyxLQUFLbUQsT0FBL0gsd0JBQXlKbkQsS0FBSzRDLE9BQTlKLHVCQUF1TDVDLEtBQUs2QyxNQUE1TCxvREFBaVBQLEtBQWpQLCtCQUFnUnRDLEtBQUsyQyxFQUFyUixVQUE0UjNDLEtBQUtrRCxJQUFqUyxTQUF5U2xELEtBQUtpRCxJQUE5Uyx1REFBb1dqRCxLQUFLNEMsT0FBelcsU0FBb1g1QyxLQUFLNkMsTUFBelgsNEVBQXNjN0MsS0FBS3ZCLEtBQTNjLDBDQUFxZnVCLEtBQUtnRCxXQUExZixTQUFKO1dBQ09LLFdBQVAsQ0FBbUJQLElBQW5COzs7U0FZSzs7R0FBUDtDQXpEYSxHQUFmOztBQ0FBLFdBQWUsQ0FBQyxZQUFNOzs7TUFHaEJRLFdBQVcsRUFBZjtNQUNFQyxVQUFVLENBRFo7O1dBR1NwRyxJQUFULENBQWNxRyxLQUFkLEVBQXFCOztRQUVmdkYsUUFBUUgsRUFBRTBGLEtBQUYsQ0FBWjs7O2VBR1csQ0FBQyxRQUFELEVBQVcsK0JBQVgsRUFBNEMsMkJBQTVDLEVBQXlFLDRCQUF6RSxFQUF1RywrQkFBdkcsRUFBd0ksMkJBQXhJLEVBQXFLLG1DQUFySyxFQUEwTSw4QkFBMU0sRUFBME8sZ0NBQTFPLENBQVg7OztVQUdNekQsSUFBTixDQUFXLGtCQUFYLEVBQStCM0MsRUFBL0IsQ0FBa0MsT0FBbEMsRUFBMkNDLEtBQTNDLEVBQWtEb0csU0FBbEQ7OztXQUdPQSxTQUFULEdBQXFCOztXQUVuQixDQUFXQyxJQUFYLENBQWdCLE9BQWhCLEVBQXlCSixTQUFTQyxPQUFULENBQXpCO2VBQ1csQ0FBWDs7O1NBR0s7O0dBQVA7Q0F2QmEsR0FBZjs7QUNBQSxXQUFlLENBQUMsWUFBTTtNQUNoQnRGLEtBQUo7O1dBRVNkLElBQVQsQ0FBY3FHLEtBQWQsRUFBcUI7O1lBRVgxRixFQUFFMEYsS0FBRixDQUFSOzs7Ozs7V0FNT0csU0FBVCxHQUFxQjtXQUNuQixDQUFXdkcsRUFBWCxDQUFjLE9BQWQsRUFBdUIsVUFBVXdHLE9BQVYsRUFBbUI7UUFDdEMsZ0NBQWdDQSxPQUFoQyxHQUEwQyxNQUE1QyxFQUFvRDdFLElBQXBELEdBQTJEOEUsUUFBM0QsQ0FBb0U1RixLQUFwRSxFQUEyRVcsTUFBM0UsQ0FBa0YsTUFBbEY7S0FERjs7O1NBS0s7O0dBQVA7Q0FqQmEsR0FBZjs7QUNGQTs7Ozs7Ozs7Ozs7OztBQWFBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUVBO0FBQ0EsQUFDQSxBQUVBLElBQU1rRixNQUFPLFlBQU07V0FDUjNHLElBQVQsR0FBZ0I7OztNQUdaNEcsUUFBRixFQUFZQyxVQUFaOzs7UUFHSWxHLEVBQUUsVUFBRixFQUFjZ0QsTUFBbEIsRUFBMEJtRCxNQUFNOUcsSUFBTjtRQUN0QlcsRUFBRSxlQUFGLEVBQW1CZ0QsTUFBdkIsRUFBK0JvRCxLQUFLL0csSUFBTDtRQUMzQlcsRUFBRSxjQUFGLEVBQWtCZ0QsTUFBdEIsRUFBOEJxRCxTQUFTaEgsSUFBVDtRQUMxQlcsRUFBRSxXQUFGLEVBQWVnRCxNQUFuQixFQUEyQnNELE1BQU1qSCxJQUFOOzs7UUFHdkJXLEVBQUUsVUFBRixFQUFjZ0QsTUFBbEIsRUFBMEJ1RCxLQUFLbEgsSUFBTCxDQUFVLFVBQVY7UUFDdEJXLEVBQUUsVUFBRixFQUFjZ0QsTUFBbEIsRUFBMEJ3RCxLQUFLbkgsSUFBTCxDQUFVLFVBQVY7Ozs7Ozs7O1dBUW5Cb0gsU0FBVCxHQUFxQjtNQUNqQixNQUFGLEVBQVV2RixRQUFWLENBQW1CcEIsSUFBbkI7OztTQUdLOztHQUFQO0NBMUJVLEVBQVo7OztBQWdDQUUsRUFBRWlHLFFBQUYsRUFBWVMsS0FBWixDQUFrQixZQUFZO01BQ3hCckgsSUFBSjtDQURGOzsifQ==