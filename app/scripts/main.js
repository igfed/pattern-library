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
                    item[k]['timestamp'] = Date.now();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XG5cbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcbiAqL1xuXG4vLyB1cmwgcGF0aFxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG59KSgpXG5cbi8vIGxhbmd1YWdlXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gJ2ZyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufSkoKVxuXG4vLyBicm93c2VyIHdpZHRoXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcbn0pKClcblxuLy8gYmFzZSBldmVudEVtaXR0ZXJcbmV4cG9ydCB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXG5cbiIsIi8vIFRoaXMgaXMgbGVzcyBvZiBhIG1vZHVsZSB0aGFuIGl0IGlzIGEgY29sbGVjdGlvbiBvZiBjb2RlIGZvciBhIGNvbXBsZXRlIHBhZ2UgKE1vcmUgcGFnZSBpbiB0aGlzIGNhc2UpLlxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXG4vLyBhbmQgc28gb24uXG5cbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIFJlZ2lzdGVyIHJlc2l6ZSBiZWhhdmlvdXJcbiAgICBfcmVzaXplKCk7XG5cbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xuXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnVpdGVtJykub24oJ2NsaWNrJywgZXZlbnQsIF9tb3JlU2VjdGlvbk1lbnVJdGVtKTtcblxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xuXG4gICAgLy8gQ2xvc2UgYnV0dG9uXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XG5cbiAgICAvLyBTb2NpYWwgZHJhd2VyXG4gICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykub24oJ2NsaWNrJywgX29wZW5Tb2NpYWxEcmF3ZXIpO1xuICB9XG5cbiAgLy8gRW5kIG9mIEluaXRcblxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlnLmJyb3dzZXJXaWR0aCA8IDY0MCkge1xuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX21vcmVTZWN0aW9uTWVudUl0ZW0oKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcbiAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XG5cbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxuXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmZhZGVJbignc2xvdycpLmZvY3VzKCkuZmlsdGVyKCc6bm90KC4nICsgY2xhc3NOYW1lICsgJyknKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcblxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICB2YXIgZW5kcG9pbnRVUkwsXG4gICAgc3VjY2Vzc1VSTCxcbiAgICBjYW5jZWxVUkwsXG4gICAgJGZvcm0sXG4gICAgJGZvcm1XcmFwcGVyO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xuXG4gICAgX3ZhbGlkYXRpb24oKTtcbiAgICBfdG9nZ2xlcigpXG4gIH1cblxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xuICAgIH0pO1xuXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xuICAgICAgZGVidWc6IHRydWUsXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXG4gICAgfSk7XG5cbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XG5cbiAgICAkZm9ybS52YWxpZGF0ZSh7XG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9wcm9jZXNzKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBydWxlczoge1xuICAgICAgICBwaG9uZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHBob25lVVM6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcGhvbmUyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwb3N0YWxfY29kZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmaXJzdG5hbWU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBsYXN0bmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWwyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcbiAgICB2YXIgZm9ybURhdGFSYXcsXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcblxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcblxuXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xuICAgICQuYWpheCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcblxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXG4gICAgJCgnW2RhdGEtcmVzcG9uc2l2ZS10b2dnbGVdIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2l0ZS1oZWFkZXItaXMtYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgdmFyIHByZXZBcnJvdyxcbiAgICAgIG5leHRBcnJvdyxcbiAgICAgICRjYXJvdXNlbDtcblxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgICB2YXIgYXZhaWxhYmxlSXRlbXMsIHNlZW5JdGVtcywgaWdscywgZGF0YUtleSwgYXJ0aWNsZUxpbWl0O1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgICAgICBpZ2xzID0gZ2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIGRhdGFLZXkgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdhcnRpY2xlcycpO1xuICAgICAgICBhdmFpbGFibGVJdGVtcyA9IHNodWZmbGVkQ2Fyb3VzZWxEYXRhW2RhdGFLZXldO1xuICAgICAgICBhcnRpY2xlTGltaXQgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdsaW1pdCcpO1xuXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xuICAgICAgICAgICAgLy9vYmplY3QgZG9lcyBub3QgZXhpc3QgeWV0XG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IGlnbHNbZGF0YUtleV07XG4gICAgICAgIH1cblxuICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlKGdldFJhbmRBcnRpY2xlcygpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIGlmICh0eXBlb2YoU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbG9jYWxzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUhJylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUlHTFMoKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XG4gICAgICAgIHZhciB1cGRhdGVkT2JqID0gT2JqZWN0LmFzc2lnbih7fSwgc2Vlbkl0ZW1zKTtcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpdGVtW2tdWyd0aW1lc3RhbXAnXSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRPYmpba10gPSBpdGVtW2tdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIGRlbGV0ZSBpZ2xzW2RhdGFLZXldO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgdW5zZWVuID0gW10sXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoYXZhaWxhYmxlSXRlbXMpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBhdmFpbGFibGVJdGVtc1trZXldO1xuXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XG4gICAgICAgICAgICAgICAgdW5zZWVuLnB1c2gobmV3T2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmFuZEFydGljbGVzID0gdW5zZWVuLnNwbGljZSgwLCBhcnRpY2xlTGltaXQpO1xuXG4gICAgICAgIGlmIChyYW5kQXJ0aWNsZXMubGVuZ3RoIDwgYXJ0aWNsZUxpbWl0KSB7XG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcbiAgICAgICAgICAgIC8vY2xlYXIgc2Vlbkl0ZW1zLCByZXNldCBscywgYW5kIHJlaW5pdFxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICAgICAgaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNodWZmbGUocmFuZEFydGljbGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUocmFuZG9tQXJ0aWNsZXMpIHtcblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICB0ZW1wbGF0ZURhdGEgPSBbXTtcblxuICAgICAgICByYW5kb21BcnRpY2xlcy5mb3JFYWNoKChhcnRpY2xlKSA9PiB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcnRpY2xlKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS5wdXNoKGFydGljbGVba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwoJChgIyR7ZGF0YUtleX1gKS5odG1sKCksIHsgXCJhcnRpY2xlc1wiOiB0ZW1wbGF0ZURhdGEgfSk7XG5cbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcblxuICAgICAgICB1cGRhdGVMb2NhbFN0b3JhZ2UocmFuZG9tQXJ0aWNsZXMpO1xuXG4gICAgICAgIGJ1aWxkQ2Fyb3VzZWwoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWlsZENhcm91c2VsKCkge1xuICAgICAgICB2YXIgcHJldkFycm93LFxuICAgICAgICAgICAgbmV4dEFycm93LFxuICAgICAgICAgICAgJGNhcm91c2VsO1xuXG4gICAgICAgICQoJy5pZy1jYXJvdXNlbCcpLm5vdCgnLnNsaWNrLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuXG4gICAgICAgICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgICAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcbiAgICAgICAgICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgdmFyIHZpZHMgPSBbXSwgYnJpZ2h0Q292ZTtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIF9wYXJzZVZpZGVvcygpO1xuXG4gICAgLy8gTm90IHVzaW5nIHRoaXMgZnVuY3Rpb25hbGl0eSBhdCB0aGUgbW9tZW50IChlc3NlbnRpYWxseSBhbiBvbkxvYWRDb21wbGV0ZSkgLSBtaWdodCBiZSByZXF1aXJlZCBkb3duIHRoZSByb2FkXG4gICAgLy9cbiAgICAvLyBNYWtlIHN1cmUgdGhlIFZpZGVvSlMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhbmQgZmlyZSByZWFkeSBldmVudCBoYW5kbGVycyBpZiBzb1xuICAgIC8vIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgLy8gICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XG4gICAgLy8gICAgIF9icmlnaHRDb3ZlUmVhZHkoKTtcbiAgICAvLyAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9LCA1MDApXG4gIH1cblxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XG4gICAgdmFyICRncm91cCxcbiAgICAgICR2aWRlbyxcbiAgICAgIGRhdGEgPSB7fSxcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXVxuXG4gICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcbiAgICAkKCcuaWctdmlkZW8tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICRncm91cCA9ICQodGhpcyk7XG4gICAgICBkYXRhLmFjY291bnQgPSAkZ3JvdXAuZGF0YSgnYWNjb3VudCcpO1xuICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XG5cbiAgICAgIC8vIExvYWQgcmVxdWlyZWQgSlMgZm9yIGEgcGxheWVyXG4gICAgICBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggdmlkZW8nc1xuICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICR2aWRlbyA9ICQodGhpcyk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChyZXF1aXJlZClcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xuXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAob3B0aW9uYWwpXG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XG4gICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpIDogJyc7XG4gICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xuICAgICAgICBkYXRhLmN0cmwgPSAkdmlkZW8uZGF0YSgnY29udHJvbHMnKSA/ICdjb250cm9scycgOiAnJztcbiAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xuXG4gICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcbiAgICAgICAgdmlkcy5wdXNoKGRhdGEuaWQpO1xuXG4gICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcbiAgICAgICAgX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpXG4gICAgICB9KTtcblxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xuICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj48c3BhbiBjbGFzcz1cInZpZGVvLW92ZXJsYXkgJHtkYXRhLmlkfVwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj48dmlkZW8gZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiJHtkYXRhLmFjY291bnR9XCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiICR7ZGF0YS5jdHJsfSAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj48L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XG4gICAgJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcbiAgICB2aWRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICQoJy52aWRlby1vdmVybGF5LicrIGVsKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICB9KTtcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIC8vIERlZmluZSBjb21wb25lbnQtbGV2ZWwgdmFyaWFibGVzXG4gIHZhciBtZXNzYWdlcyA9IFtdLFxuICAgIGNvdW50ZXIgPSAwO1xuXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxuICAgIHZhciAkdGhpcyA9ICQoc2NvcGUpO1xuXG4gICAgLy8gTGV0J3MgY3JlYXRlIGEgbWVzc2FnZSBhcnJheVxuICAgIG1lc3NhZ2VzID0gWydIZWxsbyEnLCAnSXMgaXQgbWUgeW91XFwncmUgbG9va2luZyBmb3I/JywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIGV5ZXMnLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgc21pbGUnLCAnWW91XFwncmUgYWxsIElcXCd2ZSBldmVyIHdhbnRlZCcsICdBbmQgbXkgYXJtcyBhcmUgb3BlbiB3aWRlJywgJ1xcJ2NhdXNlIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBzYXknLCAnQW5kIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBkbycsICdBbmQgSSB3YW50IHRvIHRlbGwgeW91IHNvIG11Y2gnXTtcblxuICAgIC8vIFJlZ2lzdGVyIGNsaWNrIGhhbmRsZXJcbiAgICAkdGhpcy5maW5kKCdhLmJ1dHRvbi5tZXNzYWdlJykub24oJ2NsaWNrJywgZXZlbnQsIF9zYXlIZWxsbyk7XG4gIH1cblxuICBmdW5jdGlvbiBfc2F5SGVsbG8oKSB7XG4gICAgLy8gTGV0J3MgZW1pdCBhbiBldmVudCB3aXRoIGFuIGluZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHNlbmQgYWxvbmcgc29tZXRoaW5nIHRvIGRpc3BsYXlcbiAgICBpZy5lbWl0dGVyLmVtaXQoJ2hlbGxvJywgbWVzc2FnZXNbY291bnRlcl0pO1xuICAgIGNvdW50ZXIgKz0gMTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcbiAgdmFyICR0aGlzXG5cbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xuICAgIC8vIE9mdGVuIGEgZ29vZCBpZGVhIHRvIGluaXQgd2l0aCBhbiBIVE1MIHNjb3BlIChpZSwgY2xhc3MpXG4gICAgJHRoaXMgPSAkKHNjb3BlKTtcbiAgICBfbGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8vIFdlIGtub3cgbm90aGluZyBhYm91dCB0aGUgY29tcG9uZW50IHRoYXQgd2lsbCBzZW5kIHRoZSBtZXNzYWdlLiBPbmx5IHRoYXQgaXQgd2lsbCBoYXZlXG4gIC8vIGFuIGlkZW50aWZpZXIgb2YgJ2hlbGxvJyBhbmQgdGhhdCB3ZSB3aWxsIHJlY2VpdmUgYSAnbWVzc2FnZScgdG8gZGlzcGxheS5cbiAgZnVuY3Rpb24gX2xpc3RlbmVyKCkge1xuICAgIGlnLmVtaXR0ZXIub24oJ2hlbGxvJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICQoJzxwIGNsYXNzPVwiYWxlcnQtYm94IGFsZXJ0XCI+JyArIG1lc3NhZ2UgKyAnPC9wPicpLmhpZGUoKS5hcHBlbmRUbygkdGhpcykuZmFkZUluKCdmYXN0Jyk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXG5cbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxuIGZvciBpbnN0YW5jZSkuXG5cbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxuICovXG5cbmltcG9ydCBtb3JlIGZyb20gJy4vbW9yZS5qcyc7XG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XG5pbXBvcnQgc2h1ZmZsZWRDYXJvdXNlbCBmcm9tICcuL3NodWZmbGVkLWNhcm91c2VsLmpzJztcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xuaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xuaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xuXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcbiAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbicpLmxlbmd0aCkgbW9yZS5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5sZW5ndGgpIHNodWZmbGVkQ2Fyb3VzZWwuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctdmlkZW8tZ3JvdXAnKS5sZW5ndGgpIHZpZGVvLmluaXQoKTtcblxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXG4gICAgaWYgKCQoJy5pZy1ldnQxJykubGVuZ3RoKSBldnQxLmluaXQoJy5pZy1ldnQxJyk7XG4gICAgaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XG5cbiAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxuICAgIF9sYW5ndWFnZSgpO1xuICB9XG5cbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xuICBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH1cbn0pKCk7XG5cbi8vIEJvb3RzdHJhcCBhcHBcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgYXBwLmluaXQoKTtcbn0pO1xuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImJyb3dzZXJXaWR0aCIsIm91dGVyV2lkdGgiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiaW5pdCIsIm9uIiwiZXZlbnQiLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJpZyIsInJlbW92ZUNsYXNzIiwiJCIsImNzcyIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCJvZmZzZXQiLCJ3aWR0aCIsImNlbnRlclgiLCJsZWZ0IiwiY2xhc3NOYW1lIiwiYXR0ciIsIm1hdGNoIiwidGl0bGUiLCJ0ZXh0IiwiX2ZpbHRlckRyb3Bkb3duIiwiZmFkZUluIiwiZm9jdXMiLCJmaWx0ZXIiLCJoaWRlIiwiYWRkQ2xhc3MiLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJoYXNDbGFzcyIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwic2h1ZmZsZWRDYXJvdXNlbERhdGEiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJ3YXJuIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVwZGF0ZUxvY2FsU3RvcmFnZSIsImFydGljbGVzIiwidXBkYXRlZE9iaiIsIk9iamVjdCIsImFzc2lnbiIsImZvckVhY2giLCJpdGVtIiwiaSIsImtleXMiLCJtYXAiLCJrIiwiRGF0ZSIsIm5vdyIsInJlc2V0TG9jYWxTdG9yYWdlIiwidW5zZWVuIiwicmFuZEFydGljbGVzIiwia2V5IiwibmV3T2JqIiwicHVzaCIsInNwbGljZSIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZW5lcmF0ZVRlbXBsYXRlIiwicmFuZG9tQXJ0aWNsZXMiLCJodG1sIiwidGVtcGxhdGVEYXRhIiwiYXJ0aWNsZSIsIk11c3RhY2hlIiwidG9faHRtbCIsImJ1aWxkQ2Fyb3VzZWwiLCJub3QiLCJ2aWRzIiwiYnJpZ2h0Q292ZSIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJfaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9pbmplY3RUZW1wbGF0ZSIsInJlcGxhY2VXaXRoIiwibWVzc2FnZXMiLCJjb3VudGVyIiwic2NvcGUiLCJfc2F5SGVsbG8iLCJlbWl0IiwiX2xpc3RlbmVyIiwibWVzc2FnZSIsImFwcGVuZFRvIiwiYXBwIiwiZG9jdW1lbnQiLCJmb3VuZGF0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJzaHVmZmxlZENhcm91c2VsIiwidmlkZW8iLCJldnQxIiwiZXZ0MiIsIl9sYW5ndWFnZSIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07TUFDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQWxELEVBQXFEO1dBQzVDLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPLElBQUlDLGVBQWdCLFlBQU07U0FDeEJKLE9BQU9LLFVBQWQ7Q0FEd0IsRUFB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