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

var shuffledCarousel = (function () {

    var availableItems, seenItems, igls, dataKey, articleLimit;

    function init() {

        igls = getLocalStorage();
        dataKey = $('.ig-shuffled-carousel').data('articles');
        availableItems = shuffledCarouselData[dataKey];
        articleLimit = $('.ig-shuffled-carousel').data('limit');

        if (!igls[dataKey]) {
            //object does not exist yet
            seenItems = {};
        } else {
            seenItems = igls[dataKey];
        }

        generateTemplate(getRandArticles());
    }

    function getLocalStorage() {
        if (typeof Storage !== "undefined") {
            return localStorage.getItem("ig") ? JSON.parse(localStorage.getItem("ig")) : createIGLS();
        } else {
            console.warn('localstorage is not available!');
            return;
        }
    }

    function createIGLS() {
        localStorage.setItem("ig", JSON.stringify({}));
        return JSON.parse(localStorage.getItem("ig"));
    }

    function updateLocalStorage(articles) {
        var updatedObj = Object.assign({}, seenItems);
        articles.forEach(function (item, i) {
            if (i <= 1) {
                Object.keys(item).map(function (k) {
                    updatedObj[k] = item[k];
                });
            }
        });

        igls[dataKey] = updatedObj;
        localStorage.setItem("ig", JSON.stringify(igls));
    }

    function resetLocalStorage() {
        delete igls[dataKey];
        localStorage.setItem("ig", JSON.stringify(igls));
    }

    function getRandArticles() {
        var unseen = [],
            randArticles;

        Object.keys(availableItems).forEach(function (key, i) {
            var newObj = {};
            newObj[key] = availableItems[key];

            if (!seenItems[key]) {
                unseen.push(newObj);
            }
        });

        randArticles = unseen.splice(0, articleLimit);

        if (randArticles.length < articleLimit) {
            //There's less unseen articles that the limit
            //clear seenItems, reset ls, and reinit
            seenItems = {};
            resetLocalStorage();
            init();
        }

        return shuffle(randArticles);
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

    function generateTemplate(randomArticles) {

        var html,
            templateData = [];

        randomArticles.forEach(function (article) {
            Object.keys(article).map(function (key) {
                templateData.push(article[key]);
            });
        });

        html = Mustache.to_html($('#' + dataKey).html(), { "articles": templateData });

        $('.ig-shuffled-carousel').html(html);

        updateLocalStorage(randomArticles);

        buildCarousel();
    }

    function buildCarousel() {
        var prevArrow, nextArrow, $carousel;

        $('.ig-carousel').not('.slick-initialized').each(function (index) {

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

  var vids = [],
      brightCove;

  function init() {
    _parseVideos();

    // Not using this functionality at the moment (essentially an onLoadComplete) - might be required down the road
    //
    // Make sure the VideoJS method is available and fire ready event handlers if so
    // brightCove = setInterval(function () {
    //   if ($('.vjs-plugins-ready').length) {
    //     _brightCoveReady();
    //     clearInterval(brightCove);
    //   }
    // }, 500)
  }

  function _parseVideos() {
    var $group,
        $video,
        data = {},
        preloadOptions = ['auto', 'metadata', 'none'];

    // Each group can effectively use a different player which will only be loaded once
    $('.ig-video-group').each(function () {
      $group = $(this);
      data.account = $group.data('account');
      data.player = $group.data('player');

      // Load required JS for a player
      _injectBrightCoveJS(data);

      // Loop through video's
      $group.find('.ig-video-js').each(function (index) {
        $video = $(this);

        // Capture options (required)
        data.id = $video.data('id');

        // Capture options (optional)
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data('description') : '';
        data.auto = $video.data('autoplay') ? 'autoplay' : '';
        data.ctrl = $video.data('controls') ? 'controls' : '';
        data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';

        // Store ID's for all video's on the page - in case we want to run a post-load process on each
        vids.push(data.id);

        // Let's replace the ig-video-js 'directive' with the necessary Brightcove code
        _injectTemplate($video, data, index);
      });
    });
  }

  function _injectBrightCoveJS(data) {
    var indexjs = '<script src="//players.brightcove.net/' + data.account + '/' + data.player + '_default/index.min.js"></script>';
    $('body').append(indexjs);
  }

  function _injectTemplate($video, data, index) {
    var html = '<div class="video-container"><span class="video-overlay ' + data.id + '"></span><div class="video-container-responsive"><video data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video></div></div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
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
    if ($('.ig-shuffled-carousel').length) shuffledCarousel.init();
    if ($('.ig-video-group').length) video.init();

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XG5cbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcbiAqL1xuXG4vLyB1cmwgcGF0aFxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG59KSgpXG5cbi8vIGxhbmd1YWdlXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gJ2ZyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufSkoKVxuXG4vLyBicm93c2VyIHdpZHRoXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcbn0pKClcblxuLy8gYmFzZSBldmVudEVtaXR0ZXJcbmV4cG9ydCB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXG5cbiIsIi8vIFRoaXMgaXMgbGVzcyBvZiBhIG1vZHVsZSB0aGFuIGl0IGlzIGEgY29sbGVjdGlvbiBvZiBjb2RlIGZvciBhIGNvbXBsZXRlIHBhZ2UgKE1vcmUgcGFnZSBpbiB0aGlzIGNhc2UpLlxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXG4vLyBhbmQgc28gb24uXG5cbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIFJlZ2lzdGVyIHJlc2l6ZSBiZWhhdmlvdXJcbiAgICBfcmVzaXplKCk7XG5cbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xuXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnVpdGVtJykub24oJ2NsaWNrJywgZXZlbnQsIF9tb3JlU2VjdGlvbk1lbnVJdGVtKTtcblxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xuXG4gICAgLy8gQ2xvc2UgYnV0dG9uXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XG5cbiAgICAvLyBTb2NpYWwgZHJhd2VyXG4gICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykub24oJ2NsaWNrJywgX29wZW5Tb2NpYWxEcmF3ZXIpO1xuICB9XG5cbiAgLy8gRW5kIG9mIEluaXRcblxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlnLmJyb3dzZXJXaWR0aCA8IDY0MCkge1xuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX21vcmVTZWN0aW9uTWVudUl0ZW0oKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcbiAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XG5cbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxuXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmZhZGVJbignc2xvdycpLmZvY3VzKCkuZmlsdGVyKCc6bm90KC4nICsgY2xhc3NOYW1lICsgJyknKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcblxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICB2YXIgZW5kcG9pbnRVUkwsXG4gICAgc3VjY2Vzc1VSTCxcbiAgICBjYW5jZWxVUkwsXG4gICAgJGZvcm0sXG4gICAgJGZvcm1XcmFwcGVyO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xuXG4gICAgX3ZhbGlkYXRpb24oKTtcbiAgICBfdG9nZ2xlcigpXG4gIH1cblxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xuICAgIH0pO1xuXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xuICAgICAgZGVidWc6IHRydWUsXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXG4gICAgfSk7XG5cbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XG5cbiAgICAkZm9ybS52YWxpZGF0ZSh7XG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9wcm9jZXNzKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBydWxlczoge1xuICAgICAgICBwaG9uZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHBob25lVVM6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcGhvbmUyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwb3N0YWxfY29kZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmaXJzdG5hbWU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBsYXN0bmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWwyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcbiAgICB2YXIgZm9ybURhdGFSYXcsXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcblxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcblxuXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xuICAgICQuYWpheCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcblxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXG4gICAgJCgnW2RhdGEtcmVzcG9uc2l2ZS10b2dnbGVdIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2l0ZS1oZWFkZXItaXMtYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgdmFyIHByZXZBcnJvdyxcbiAgICAgIG5leHRBcnJvdyxcbiAgICAgICRjYXJvdXNlbDtcblxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgICB2YXIgYXZhaWxhYmxlSXRlbXMsIHNlZW5JdGVtcywgaWdscywgZGF0YUtleSwgYXJ0aWNsZUxpbWl0O1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgICAgICBpZ2xzID0gZ2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIGRhdGFLZXkgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdhcnRpY2xlcycpO1xuICAgICAgICBhdmFpbGFibGVJdGVtcyA9IHNodWZmbGVkQ2Fyb3VzZWxEYXRhW2RhdGFLZXldO1xuICAgICAgICBhcnRpY2xlTGltaXQgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdsaW1pdCcpO1xuXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xuICAgICAgICAgICAgLy9vYmplY3QgZG9lcyBub3QgZXhpc3QgeWV0XG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IGlnbHNbZGF0YUtleV07XG4gICAgICAgIH1cblxuICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlKGdldFJhbmRBcnRpY2xlcygpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIGlmICh0eXBlb2YoU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbG9jYWxzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUhJylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUlHTFMoKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XG4gICAgICAgIHZhciB1cGRhdGVkT2JqID0gT2JqZWN0LmFzc2lnbih7fSwgc2Vlbkl0ZW1zKTtcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkT2JqW2tdID0gaXRlbVtrXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWdsc1tkYXRhS2V5XSA9IHVwZGF0ZWRPYmo7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0TG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBkZWxldGUgaWdsc1tkYXRhS2V5XTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZEFydGljbGVzKCkge1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIHVuc2VlbiA9IFtdLFxuICAgICAgICAgICAgcmFuZEFydGljbGVzO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGF2YWlsYWJsZUl0ZW1zKS5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB7fTtcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gYXZhaWxhYmxlSXRlbXNba2V5XTtcblxuICAgICAgICAgICAgaWYgKCFzZWVuSXRlbXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHVuc2Vlbi5wdXNoKG5ld09iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJhbmRBcnRpY2xlcyA9IHVuc2Vlbi5zcGxpY2UoMCwgYXJ0aWNsZUxpbWl0KTtcblxuICAgICAgICBpZiAocmFuZEFydGljbGVzLmxlbmd0aCA8IGFydGljbGVMaW1pdCkge1xuICAgICAgICAgICAgLy9UaGVyZSdzIGxlc3MgdW5zZWVuIGFydGljbGVzIHRoYXQgdGhlIGxpbWl0XG4gICAgICAgICAgICAvL2NsZWFyIHNlZW5JdGVtcywgcmVzZXQgbHMsIGFuZCByZWluaXRcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xuICAgICAgICAgICAgcmVzZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgIGluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaHVmZmxlKHJhbmRBcnRpY2xlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcblxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG5cbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVRlbXBsYXRlKHJhbmRvbUFydGljbGVzKSB7XG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICBodG1sLFxuICAgICAgICAgICAgdGVtcGxhdGVEYXRhID0gW107XG5cbiAgICAgICAgcmFuZG9tQXJ0aWNsZXMuZm9yRWFjaCgoYXJ0aWNsZSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJ0aWNsZSkubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURhdGEucHVzaChhcnRpY2xlW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKCQoYCMke2RhdGFLZXl9YCkuaHRtbCgpLCB7IFwiYXJ0aWNsZXNcIjogdGVtcGxhdGVEYXRhIH0pO1xuXG4gICAgICAgICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmh0bWwoaHRtbCk7XG5cbiAgICAgICAgdXBkYXRlTG9jYWxTdG9yYWdlKHJhbmRvbUFydGljbGVzKTtcblxuICAgICAgICBidWlsZENhcm91c2VsKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRDYXJvdXNlbCgpIHtcbiAgICAgICAgdmFyIHByZXZBcnJvdyxcbiAgICAgICAgICAgIG5leHRBcnJvdyxcbiAgICAgICAgICAgICRjYXJvdXNlbDtcblxuICAgICAgICAkKCcuaWctY2Fyb3VzZWwnKS5ub3QoJy5zbGljay1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XG4gICAgICAgICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XG5cbiAgICAgICAgICAgICRjYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgICAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdFxuICAgIH07XG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIHZhciB2aWRzID0gW10sIGJyaWdodENvdmU7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBfcGFyc2VWaWRlb3MoKTtcblxuICAgIC8vIE5vdCB1c2luZyB0aGlzIGZ1bmN0aW9uYWxpdHkgYXQgdGhlIG1vbWVudCAoZXNzZW50aWFsbHkgYW4gb25Mb2FkQ29tcGxldGUpIC0gbWlnaHQgYmUgcmVxdWlyZWQgZG93biB0aGUgcm9hZFxuICAgIC8vXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnMgaWYgc29cbiAgICAvLyBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIC8vICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xuICAgIC8vICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XG4gICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XG4gICAgLy8gICB9XG4gICAgLy8gfSwgNTAwKVxuICB9XG5cbiAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xuICAgIHZhciAkZ3JvdXAsXG4gICAgICAkdmlkZW8sXG4gICAgICBkYXRhID0ge30sXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ11cblxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xuICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xuXG4gICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXG4gICAgICAgIGRhdGEuaWQgPSAkdmlkZW8uZGF0YSgnaWQnKTtcblxuICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcbiAgICAgICAgZGF0YS5jdHJsID0gJHZpZGVvLmRhdGEoJ2NvbnRyb2xzJykgPyAnY29udHJvbHMnIDogJyc7XG4gICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcblxuICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXG4gICAgICAgIHZpZHMucHVzaChkYXRhLmlkKTtcblxuICAgICAgICAvLyBMZXQncyByZXBsYWNlIHRoZSBpZy12aWRlby1qcyAnZGlyZWN0aXZlJyB3aXRoIHRoZSBuZWNlc3NhcnkgQnJpZ2h0Y292ZSBjb2RlXG4gICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KVxuICAgICAgfSk7XG5cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX2luamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcbiAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4anMpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcbiAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+PHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5ICR7ZGF0YS5pZH1cIj48L3NwYW4+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+PHZpZGVvIGRhdGEtdmlkZW8taWQ9XCIke2RhdGEuaWR9XCIgcHJlbG9hZD1cIiR7ZGF0YS5wcmVsb2FkfVwiIGRhdGEtYWNjb3VudD1cIiR7ZGF0YS5hY2NvdW50fVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiAke2RhdGEuY3RybH0gJHtkYXRhLmF1dG99PjwvdmlkZW8+PC9kaXY+PC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xuICAgICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XG4gICAgdmlkcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmlkZW9qcygnIycgKyBlbCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAkKCcudmlkZW8tb3ZlcmxheS4nKyBlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICAvLyBEZWZpbmUgY29tcG9uZW50LWxldmVsIHZhcmlhYmxlc1xuICB2YXIgbWVzc2FnZXMgPSBbXSxcbiAgICBjb3VudGVyID0gMDtcblxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcbiAgICB2YXIgJHRoaXMgPSAkKHNjb3BlKTtcblxuICAgIC8vIExldCdzIGNyZWF0ZSBhIG1lc3NhZ2UgYXJyYXlcbiAgICBtZXNzYWdlcyA9IFsnSGVsbG8hJywgJ0lzIGl0IG1lIHlvdVxcJ3JlIGxvb2tpbmcgZm9yPycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBleWVzJywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIHNtaWxlJywgJ1lvdVxcJ3JlIGFsbCBJXFwndmUgZXZlciB3YW50ZWQnLCAnQW5kIG15IGFybXMgYXJlIG9wZW4gd2lkZScsICdcXCdjYXVzZSB5b3Uga25vdyBqdXN0IHdoYXQgdG8gc2F5JywgJ0FuZCB5b3Uga25vdyBqdXN0IHdoYXQgdG8gZG8nLCAnQW5kIEkgd2FudCB0byB0ZWxsIHlvdSBzbyBtdWNoJ107XG5cbiAgICAvLyBSZWdpc3RlciBjbGljayBoYW5kbGVyXG4gICAgJHRoaXMuZmluZCgnYS5idXR0b24ubWVzc2FnZScpLm9uKCdjbGljaycsIGV2ZW50LCBfc2F5SGVsbG8pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NheUhlbGxvKCkge1xuICAgIC8vIExldCdzIGVtaXQgYW4gZXZlbnQgd2l0aCBhbiBpbmRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCBzZW5kIGFsb25nIHNvbWV0aGluZyB0byBkaXNwbGF5XG4gICAgaWcuZW1pdHRlci5lbWl0KCdoZWxsbycsIG1lc3NhZ2VzW2NvdW50ZXJdKTtcbiAgICBjb3VudGVyICs9IDE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG4gIHZhciAkdGhpc1xuXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxuICAgICR0aGlzID0gJChzY29wZSk7XG4gICAgX2xpc3RlbmVyKCk7XG4gIH1cblxuICAvLyBXZSBrbm93IG5vdGhpbmcgYWJvdXQgdGhlIGNvbXBvbmVudCB0aGF0IHdpbGwgc2VuZCB0aGUgbWVzc2FnZS4gT25seSB0aGF0IGl0IHdpbGwgaGF2ZVxuICAvLyBhbiBpZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHRoYXQgd2Ugd2lsbCByZWNlaXZlIGEgJ21lc3NhZ2UnIHRvIGRpc3BsYXkuXG4gIGZ1bmN0aW9uIF9saXN0ZW5lcigpIHtcbiAgICBpZy5lbWl0dGVyLm9uKCdoZWxsbycsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAkKCc8cCBjbGFzcz1cImFsZXJ0LWJveCBhbGVydFwiPicgKyBtZXNzYWdlICsgJzwvcD4nKS5oaWRlKCkuYXBwZW5kVG8oJHRoaXMpLmZhZGVJbignZmFzdCcpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxuXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcbiBmb3IgaW5zdGFuY2UpLlxuXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cbiAqL1xuXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xuaW1wb3J0IHNodWZmbGVkQ2Fyb3VzZWwgZnJvbSAnLi9zaHVmZmxlZC1jYXJvdXNlbC5qcyc7XG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcbmltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcbmltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcblxuY29uc3QgYXBwID0gKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcblxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykubGVuZ3RoKSBzaHVmZmxlZENhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XG5cbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxuICAgIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xuICAgIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xuXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcbiAgICBfbGFuZ3VhZ2UoKTtcbiAgfVxuXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9XG59KSgpO1xuXG4vLyBCb290c3RyYXAgYXBwXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIGFwcC5pbml0KCk7XG59KTtcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJicm93c2VyV2lkdGgiLCJvdXRlcldpZHRoIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImluaXQiLCJvbiIsImV2ZW50IiwiX21vcmVTZWN0aW9uTWVudUl0ZW0iLCJfbW9iaWxlQ2F0ZWdvcnlNZW51IiwiX2Nsb3NlQnV0dG9uIiwiX29wZW5Tb2NpYWxEcmF3ZXIiLCJfcmVzaXplIiwicmVzaXplIiwiaWciLCJyZW1vdmVDbGFzcyIsIiQiLCJjc3MiLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0Iiwid2lkdGgiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZvY3VzIiwiZmlsdGVyIiwiaGlkZSIsImFkZENsYXNzIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiaGFzQ2xhc3MiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiYXZhaWxhYmxlSXRlbXMiLCJzZWVuSXRlbXMiLCJpZ2xzIiwiZGF0YUtleSIsImFydGljbGVMaW1pdCIsImdldExvY2FsU3RvcmFnZSIsInNodWZmbGVkQ2Fyb3VzZWxEYXRhIiwiZ2V0UmFuZEFydGljbGVzIiwiU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJjcmVhdGVJR0xTIiwid2FybiIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ1cGRhdGVMb2NhbFN0b3JhZ2UiLCJhcnRpY2xlcyIsInVwZGF0ZWRPYmoiLCJPYmplY3QiLCJhc3NpZ24iLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJrZXlzIiwibWFwIiwiayIsInJlc2V0TG9jYWxTdG9yYWdlIiwidW5zZWVuIiwicmFuZEFydGljbGVzIiwia2V5IiwibmV3T2JqIiwicHVzaCIsInNwbGljZSIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZW5lcmF0ZVRlbXBsYXRlIiwicmFuZG9tQXJ0aWNsZXMiLCJodG1sIiwidGVtcGxhdGVEYXRhIiwiYXJ0aWNsZSIsIk11c3RhY2hlIiwidG9faHRtbCIsImJ1aWxkQ2Fyb3VzZWwiLCJub3QiLCJ2aWRzIiwiYnJpZ2h0Q292ZSIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJfaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9pbmplY3RUZW1wbGF0ZSIsInJlcGxhY2VXaXRoIiwibWVzc2FnZXMiLCJjb3VudGVyIiwic2NvcGUiLCJfc2F5SGVsbG8iLCJlbWl0IiwiX2xpc3RlbmVyIiwibWVzc2FnZSIsImFwcGVuZFRvIiwiYXBwIiwiZG9jdW1lbnQiLCJmb3VuZGF0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJzaHVmZmxlZENhcm91c2VsIiwidmlkZW8iLCJldnQxIiwiZXZ0MiIsIl9sYW5ndWFnZSIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07TUFDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQWxELEVBQXFEO1dBQzVDLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPLElBQUlDLGVBQWdCLFlBQU07U0FDeEJKLE9BQU9LLFVBQWQ7Q0FEd0IsRUFBbkI7OztBQUtQLEFBQU8sSUFBSUMsVUFBVSxJQUFJQyxZQUFKLEVBQWQ7O0FDNUJQOzs7O0FBSUEsQUFFQSxXQUFlLENB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