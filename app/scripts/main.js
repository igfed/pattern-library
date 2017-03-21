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

/**
 * Shuffled Carousel
 * Takes eight items from an object of 20, and renders them in a carousel in random order.
 *
 * Upon refresh of the browser, the first two items are added to the seenItems object
 * and written to local storage, when the amount of unseen items drops below 8, seenItems 
 * is cleared and the carousel reset.
 *
 * There are two configurable data attributes that need to be added to the markup:
 * @param data-articles = The key of the data in the json object
 * @return data-limit = The amount of items to be rendered in the carousel
 * Ex. <div class="ig-shuffled-carousel" data-articles="advice-stories" data-limit="8"></div>
 */
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
            //console.log('Less than ' + articleLimit + ' items left to view, emptying seenItems and restarting.');
            //There's less unseen articles that the limit
            //clear seenItems, reset ls, and reinit
            seenItems = {};
            resetLocalStorage();
            return init();
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

        if (!randomArticles) {
            return;
        }

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
                data.transcript = $video.data('transcript') ? $video.data('transcript') : '';

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
        var html = '<div class="video-container"><span class="video-overlay ' + data.id + '"></span><div class="video-container-responsive"><video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video></div>';
        if (data.transcript.length > 0) {
            html += '<div class="video-transcript"><a target="_blank" href="' + data.transcript + '">Transcript</a></div>';
        }
        html += '</div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XG5cbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcbiAqL1xuXG4vLyB1cmwgcGF0aFxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG59KSgpXG5cbi8vIGxhbmd1YWdlXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gJ2ZyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufSkoKVxuXG4vLyBicm93c2VyIHdpZHRoXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcbn0pKClcblxuLy8gYmFzZSBldmVudEVtaXR0ZXJcbmV4cG9ydCB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXG5cbiIsIi8vIFRoaXMgaXMgbGVzcyBvZiBhIG1vZHVsZSB0aGFuIGl0IGlzIGEgY29sbGVjdGlvbiBvZiBjb2RlIGZvciBhIGNvbXBsZXRlIHBhZ2UgKE1vcmUgcGFnZSBpbiB0aGlzIGNhc2UpLlxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXG4vLyBhbmQgc28gb24uXG5cbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIFJlZ2lzdGVyIHJlc2l6ZSBiZWhhdmlvdXJcbiAgICBfcmVzaXplKCk7XG5cbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xuXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnVpdGVtJykub24oJ2NsaWNrJywgZXZlbnQsIF9tb3JlU2VjdGlvbk1lbnVJdGVtKTtcblxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xuXG4gICAgLy8gQ2xvc2UgYnV0dG9uXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XG5cbiAgICAvLyBTb2NpYWwgZHJhd2VyXG4gICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykub24oJ2NsaWNrJywgX29wZW5Tb2NpYWxEcmF3ZXIpO1xuICB9XG5cbiAgLy8gRW5kIG9mIEluaXRcblxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlnLmJyb3dzZXJXaWR0aCA8IDY0MCkge1xuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX21vcmVTZWN0aW9uTWVudUl0ZW0oKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcbiAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XG5cbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxuXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmZhZGVJbignc2xvdycpLmZvY3VzKCkuZmlsdGVyKCc6bm90KC4nICsgY2xhc3NOYW1lICsgJyknKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcblxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICB2YXIgZW5kcG9pbnRVUkwsXG4gICAgc3VjY2Vzc1VSTCxcbiAgICBjYW5jZWxVUkwsXG4gICAgJGZvcm0sXG4gICAgJGZvcm1XcmFwcGVyO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xuXG4gICAgX3ZhbGlkYXRpb24oKTtcbiAgICBfdG9nZ2xlcigpXG4gIH1cblxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xuICAgIH0pO1xuXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xuICAgICAgZGVidWc6IHRydWUsXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXG4gICAgfSk7XG5cbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XG5cbiAgICAkZm9ybS52YWxpZGF0ZSh7XG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9wcm9jZXNzKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBydWxlczoge1xuICAgICAgICBwaG9uZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHBob25lVVM6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcGhvbmUyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwb3N0YWxfY29kZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmaXJzdG5hbWU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBsYXN0bmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWwyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcbiAgICB2YXIgZm9ybURhdGFSYXcsXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcblxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcblxuXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xuICAgICQuYWpheCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcblxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXG4gICAgJCgnW2RhdGEtcmVzcG9uc2l2ZS10b2dnbGVdIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2l0ZS1oZWFkZXItaXMtYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgdmFyIHByZXZBcnJvdyxcbiAgICAgIG5leHRBcnJvdyxcbiAgICAgICRjYXJvdXNlbDtcblxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCIvKipcbiAqIFNodWZmbGVkIENhcm91c2VsXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cbiAqXG4gKiBVcG9uIHJlZnJlc2ggb2YgdGhlIGJyb3dzZXIsIHRoZSBmaXJzdCB0d28gaXRlbXMgYXJlIGFkZGVkIHRvIHRoZSBzZWVuSXRlbXMgb2JqZWN0XG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcbiAqIGlzIGNsZWFyZWQgYW5kIHRoZSBjYXJvdXNlbCByZXNldC5cbiAqXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XG4gKiBAcGFyYW0gZGF0YS1hcnRpY2xlcyA9IFRoZSBrZXkgb2YgdGhlIGRhdGEgaW4gdGhlIGpzb24gb2JqZWN0XG4gKiBAcmV0dXJuIGRhdGEtbGltaXQgPSBUaGUgYW1vdW50IG9mIGl0ZW1zIHRvIGJlIHJlbmRlcmVkIGluIHRoZSBjYXJvdXNlbFxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XG4gKi9cbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgICAgIGlnbHMgPSBnZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgZGF0YUtleSA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2FydGljbGVzJyk7XG4gICAgICAgIGF2YWlsYWJsZUl0ZW1zID0gc2h1ZmZsZWRDYXJvdXNlbERhdGFbZGF0YUtleV07XG4gICAgICAgIGFydGljbGVMaW1pdCA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2xpbWl0Jyk7XG5cbiAgICAgICAgaWYgKCFpZ2xzW2RhdGFLZXldKSB7XG4gICAgICAgICAgICAvL29iamVjdCBkb2VzIG5vdCBleGlzdCB5ZXRcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Vlbkl0ZW1zID0gaWdsc1tkYXRhS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGUoZ2V0UmFuZEFydGljbGVzKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZihTdG9yYWdlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikgPyBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpIDogY3JlYXRlSUdMUygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdsb2NhbHN0b3JhZ2UgaXMgbm90IGF2YWlsYWJsZSEnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSUdMUygpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbFN0b3JhZ2UoYXJ0aWNsZXMpIHtcbiAgICAgICAgdmFyIHVwZGF0ZWRPYmogPSBPYmplY3QuYXNzaWduKHt9LCBzZWVuSXRlbXMpO1xuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkubWFwKChrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRPYmpba10gPSBpdGVtW2tdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIGRlbGV0ZSBpZ2xzW2RhdGFLZXldO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgdW5zZWVuID0gW10sXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoYXZhaWxhYmxlSXRlbXMpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBhdmFpbGFibGVJdGVtc1trZXldO1xuXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XG4gICAgICAgICAgICAgICAgdW5zZWVuLnB1c2gobmV3T2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmFuZEFydGljbGVzID0gdW5zZWVuLnNwbGljZSgwLCBhcnRpY2xlTGltaXQpO1xuXG4gICAgICAgIGlmIChyYW5kQXJ0aWNsZXMubGVuZ3RoIDwgYXJ0aWNsZUxpbWl0KSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdMZXNzIHRoYW4gJyArIGFydGljbGVMaW1pdCArICcgaXRlbXMgbGVmdCB0byB2aWV3LCBlbXB0eWluZyBzZWVuSXRlbXMgYW5kIHJlc3RhcnRpbmcuJyk7XG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcbiAgICAgICAgICAgIC8vY2xlYXIgc2Vlbkl0ZW1zLCByZXNldCBscywgYW5kIHJlaW5pdFxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGluaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaHVmZmxlKHJhbmRBcnRpY2xlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcblxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG5cbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVRlbXBsYXRlKHJhbmRvbUFydGljbGVzKSB7XG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICBodG1sLFxuICAgICAgICAgICAgdGVtcGxhdGVEYXRhID0gW107XG5cbiAgICAgICAgaWYoIXJhbmRvbUFydGljbGVzKSB7IHJldHVybjsgfVxuXG4gICAgICAgIHJhbmRvbUFydGljbGVzLmZvckVhY2goKGFydGljbGUpID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFydGljbGUpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEYXRhLnB1c2goYXJ0aWNsZVtrZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBodG1sID0gTXVzdGFjaGUudG9faHRtbCgkKGAjJHtkYXRhS2V5fWApLmh0bWwoKSwgeyBcImFydGljbGVzXCI6IHRlbXBsYXRlRGF0YSB9KTtcblxuICAgICAgICAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5odG1sKGh0bWwpO1xuXG4gICAgICAgIHVwZGF0ZUxvY2FsU3RvcmFnZShyYW5kb21BcnRpY2xlcyk7XG5cbiAgICAgICAgYnVpbGRDYXJvdXNlbCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgICAgIHZhciBwcmV2QXJyb3csXG4gICAgICAgICAgICBuZXh0QXJyb3csXG4gICAgICAgICAgICAkY2Fyb3VzZWw7XG5cbiAgICAgICAgJCgnLmlnLWNhcm91c2VsJykubm90KCcuc2xpY2staW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XG4gICAgICAgICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xuICAgICAgICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xuXG4gICAgICAgICAgICAkY2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxuICAgICAgICAgICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKVxuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gICAgdmFyIHZpZHMgPSBbXSwgYnJpZ2h0Q292ZTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIF9wYXJzZVZpZGVvcygpO1xuXG4gICAgICAgIC8vIE5vdCB1c2luZyB0aGlzIGZ1bmN0aW9uYWxpdHkgYXQgdGhlIG1vbWVudCAoZXNzZW50aWFsbHkgYW4gb25Mb2FkQ29tcGxldGUpIC0gbWlnaHQgYmUgcmVxdWlyZWQgZG93biB0aGUgcm9hZFxuICAgICAgICAvL1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIFZpZGVvSlMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhbmQgZmlyZSByZWFkeSBldmVudCBoYW5kbGVycyBpZiBzb1xuICAgICAgICAvLyBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAgIGlmICgkKCcudmpzLXBsdWdpbnMtcmVhZHknKS5sZW5ndGgpIHtcbiAgICAgICAgLy8gICAgIF9icmlnaHRDb3ZlUmVhZHkoKTtcbiAgICAgICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9LCA1MDApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xuICAgICAgICB2YXIgJGdyb3VwLFxuICAgICAgICAgICAgJHZpZGVvLFxuICAgICAgICAgICAgZGF0YSA9IHt9LFxuICAgICAgICAgICAgcHJlbG9hZE9wdGlvbnMgPSBbJ2F1dG8nLCAnbWV0YWRhdGEnLCAnbm9uZSddXG5cbiAgICAgICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcbiAgICAgICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xuICAgICAgICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcbiAgICAgICAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xuXG4gICAgICAgICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxuICAgICAgICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcblxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcbiAgICAgICAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgICAgICR2aWRlbyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKHJlcXVpcmVkKVxuICAgICAgICAgICAgICAgIGRhdGEuaWQgPSAkdmlkZW8uZGF0YSgnaWQnKTtcblxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAob3B0aW9uYWwpXG4gICAgICAgICAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcbiAgICAgICAgICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xuICAgICAgICAgICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xuICAgICAgICAgICAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJyA6ICcnO1xuICAgICAgICAgICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcbiAgICAgICAgICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA6ICcnO1xuXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgSUQncyBmb3IgYWxsIHZpZGVvJ3Mgb24gdGhlIHBhZ2UgLSBpbiBjYXNlIHdlIHdhbnQgdG8gcnVuIGEgcG9zdC1sb2FkIHByb2Nlc3Mgb24gZWFjaFxuICAgICAgICAgICAgICAgIHZpZHMucHVzaChkYXRhLmlkKTtcblxuICAgICAgICAgICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcbiAgICAgICAgICAgICAgICBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XG4gICAgICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LyR7ZGF0YS5hY2NvdW50fS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PmA7XG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheSAke2RhdGEuaWR9XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPjx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PmBcbiAgICAgICAgaWYgKGRhdGEudHJhbnNjcmlwdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNjcmlwdFwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEudHJhbnNjcmlwdH1cIj5UcmFuc2NyaXB0PC9hPjwvZGl2PmA7XG4gICAgICAgIH1cbiAgICAgICAgaHRtbCArPSBgPC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xuICAgICAgICAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcbiAgICAgICAgdmlkcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgdmlkZW9qcygnIycgKyBlbCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vICQoJy52aWRlby1vdmVybGF5LicrIGVsKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgLy8gRGVmaW5lIGNvbXBvbmVudC1sZXZlbCB2YXJpYWJsZXNcbiAgdmFyIG1lc3NhZ2VzID0gW10sXG4gICAgY291bnRlciA9IDA7XG5cbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xuICAgIC8vIE9mdGVuIGEgZ29vZCBpZGVhIHRvIGluaXQgd2l0aCBhbiBIVE1MIHNjb3BlIChpZSwgY2xhc3MpXG4gICAgdmFyICR0aGlzID0gJChzY29wZSk7XG5cbiAgICAvLyBMZXQncyBjcmVhdGUgYSBtZXNzYWdlIGFycmF5XG4gICAgbWVzc2FnZXMgPSBbJ0hlbGxvIScsICdJcyBpdCBtZSB5b3VcXCdyZSBsb29raW5nIGZvcj8nLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgZXllcycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBzbWlsZScsICdZb3VcXCdyZSBhbGwgSVxcJ3ZlIGV2ZXIgd2FudGVkJywgJ0FuZCBteSBhcm1zIGFyZSBvcGVuIHdpZGUnLCAnXFwnY2F1c2UgeW91IGtub3cganVzdCB3aGF0IHRvIHNheScsICdBbmQgeW91IGtub3cganVzdCB3aGF0IHRvIGRvJywgJ0FuZCBJIHdhbnQgdG8gdGVsbCB5b3Ugc28gbXVjaCddO1xuXG4gICAgLy8gUmVnaXN0ZXIgY2xpY2sgaGFuZGxlclxuICAgICR0aGlzLmZpbmQoJ2EuYnV0dG9uLm1lc3NhZ2UnKS5vbignY2xpY2snLCBldmVudCwgX3NheUhlbGxvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zYXlIZWxsbygpIHtcbiAgICAvLyBMZXQncyBlbWl0IGFuIGV2ZW50IHdpdGggYW4gaW5kZW50aWZpZXIgb2YgJ2hlbGxvJyBhbmQgc2VuZCBhbG9uZyBzb21ldGhpbmcgdG8gZGlzcGxheVxuICAgIGlnLmVtaXR0ZXIuZW1pdCgnaGVsbG8nLCBtZXNzYWdlc1tjb3VudGVyXSk7XG4gICAgY291bnRlciArPSAxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuICB2YXIgJHRoaXNcblxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcbiAgICAkdGhpcyA9ICQoc2NvcGUpO1xuICAgIF9saXN0ZW5lcigpO1xuICB9XG5cbiAgLy8gV2Uga25vdyBub3RoaW5nIGFib3V0IHRoZSBjb21wb25lbnQgdGhhdCB3aWxsIHNlbmQgdGhlIG1lc3NhZ2UuIE9ubHkgdGhhdCBpdCB3aWxsIGhhdmVcbiAgLy8gYW4gaWRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCB0aGF0IHdlIHdpbGwgcmVjZWl2ZSBhICdtZXNzYWdlJyB0byBkaXNwbGF5LlxuICBmdW5jdGlvbiBfbGlzdGVuZXIoKSB7XG4gICAgaWcuZW1pdHRlci5vbignaGVsbG8nLCBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgJCgnPHAgY2xhc3M9XCJhbGVydC1ib3ggYWxlcnRcIj4nICsgbWVzc2FnZSArICc8L3A+JykuaGlkZSgpLmFwcGVuZFRvKCR0aGlzKS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cblxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXG4gZm9yIGluc3RhbmNlKS5cblxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXG4gKi9cblxuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcbmltcG9ydCBzaHVmZmxlZENhcm91c2VsIGZyb20gJy4vc2h1ZmZsZWQtY2Fyb3VzZWwuanMnO1xuaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL2FjY29yZGlvbi5qcyc7XG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXG5pbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XG5pbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XG5cbmNvbnN0IGFwcCA9ICgoKSA9PiB7XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XG5cbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSBtb3JlLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLWNhcm91c2VsJykubGVuZ3RoKSBjYXJvdXNlbC5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmxlbmd0aCkgc2h1ZmZsZWRDYXJvdXNlbC5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xuXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcbiAgICBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcbiAgICBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcblxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XG4gICAgX2xhbmd1YWdlKCk7XG4gIH1cblxuICAvLyBMZXQncyB1c2UgYSBnbG9iYWwgdmFyaWFibGUgKGdsb2JhbCBhcyBpbiBhdmFpbGFibGUgdG8gYWxsIG91ciBjb21wb25lbnRzIC0gbm90IHRoZSB3aW5kb3cgb2JqZWN0ISlcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoaWcubGFuZyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfVxufSkoKTtcblxuLy8gQm9vdHN0cmFwIGFwcFxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICBhcHAuaW5pdCgpO1xufSk7XG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwiYnJvd3NlcldpZHRoIiwib3V0ZXJXaWR0aCIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJpbml0Iiwib24iLCJldmVudCIsIl9tb3JlU2VjdGlvbk1lbnVJdGVtIiwiX21vYmlsZUNhdGVnb3J5TWVudSIsIl9jbG9zZUJ1dHRvbiIsIl9vcGVuU29jaWFsRHJhd2VyIiwiX3Jlc2l6ZSIsInJlc2l6ZSIsImlnIiwicmVtb3ZlQ2xhc3MiLCIkIiwiY3NzIiwicHJldmVudERlZmF1bHQiLCIkdGhpcyIsIm9mZnNldCIsIndpZHRoIiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfZmlsdGVyRHJvcGRvd24iLCJmYWRlSW4iLCJmb2N1cyIsImZpbHRlciIsImhpZGUiLCJhZGRDbGFzcyIsIl9maWx0ZXJUaXRsZSIsImZhZGVPdXQiLCJfcmVwb3NpdGlvbkFycm93Iiwic2hvdyIsIl9hbmltYXRpb25VbmRlcmxpbmUiLCJ0b2dnbGVDbGFzcyIsImpzU29jaWFsRHJhd2VyIiwibmV4dCIsImhhc0NsYXNzIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwibG9nIiwiX2J1aWxkQ2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkY2Fyb3VzZWwiLCJlYWNoIiwiaW5kZXgiLCJzbGljayIsImF2YWlsYWJsZUl0ZW1zIiwic2Vlbkl0ZW1zIiwiaWdscyIsImRhdGFLZXkiLCJhcnRpY2xlTGltaXQiLCJnZXRMb2NhbFN0b3JhZ2UiLCJzaHVmZmxlZENhcm91c2VsRGF0YSIsImdldFJhbmRBcnRpY2xlcyIsIlN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlSUdMUyIsIndhcm4iLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlTG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJ1cGRhdGVkT2JqIiwiT2JqZWN0IiwiYXNzaWduIiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwia2V5cyIsIm1hcCIsImsiLCJyZXNldExvY2FsU3RvcmFnZSIsInVuc2VlbiIsInJhbmRBcnRpY2xlcyIsImtleSIsIm5ld09iaiIsInB1c2giLCJzcGxpY2UiLCJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2VuZXJhdGVUZW1wbGF0ZSIsInJhbmRvbUFydGljbGVzIiwiaHRtbCIsInRlbXBsYXRlRGF0YSIsImFydGljbGUiLCJNdXN0YWNoZSIsInRvX2h0bWwiLCJidWlsZENhcm91c2VsIiwibm90IiwidmlkcyIsImJyaWdodENvdmUiLCJfcGFyc2VWaWRlb3MiLCIkZ3JvdXAiLCIkdmlkZW8iLCJwcmVsb2FkT3B0aW9ucyIsImFjY291bnQiLCJwbGF5ZXIiLCJpZCIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwidHJhbnNjcmlwdCIsIl9pbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2luamVjdFRlbXBsYXRlIiwicmVwbGFjZVdpdGgiLCJtZXNzYWdlcyIsImNvdW50ZXIiLCJzY29wZSIsIl9zYXlIZWxsbyIsImVtaXQiLCJfbGlzdGVuZXIiLCJtZXNzYWdlIiwiYXBwZW5kVG8iLCJhcHAiLCJkb2N1bWVudCIsImZvdW5kYXRpb24iLCJmb3JtcyIsIm1vcmUiLCJjYXJvdXNlbCIsInNodWZmbGVkQ2Fyb3VzZWwiLCJ2aWRlbyIsImV2dDEiLCJldnQyIiwiX2xhbmd1YWdlIiwicmVhZHkiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7V0FDNUMsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQLEFBQU8sSUFBSUMsZUFBZ0IsWUFBTTtTQUN4QkosT0FBT0ssVUFBZDtDQUR3QixFQUFuQjs7O0FBS1AsQUFBTyxJQUFJQyxVQUFVLElBQUlDLFlBQUosRUFBZDs7QUM1QlA7Ozs7QUFJQSxBQUVBLFdBQWUsQ0FBQyxZQUFNO1dBQ1hDLElBQVQsR0FBZ0I7Ozs7Ozs7O01BUVosd0JBQUYsRUFBNEJDLEVBQTVCLENBQStCLE9BQS9CLEVBQXdDQyxLQUF4QyxFQUErQ0Msb0JBQS9DOzs7TUFHRSxpQ0FBRixFQUFxQ0YsRUFBckMsQ0FBd0MsT0FBeEMsRUFBaURHLG1CQUFqRDs7O01BR0UsZUFBRixFQUFtQkgsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0JJLFlBQS9COzs7TUFHRSx1QkFBRixFQUEyQkosRUFBM0IsQ0FBOEIsT0FBOUIsRUFBdUNLLGlCQUF2Qzs7Ozs7V0FLT0MsT0FBVCxHQUFtQjtNQUNmZixNQUFGLEVBQVVnQixNQUFWLENBQWlCLFlBQVk7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