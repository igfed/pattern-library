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
	if (window.location.pathname.indexOf('/fr.') !== -1 || window.location.pathname.indexOf('/fr/') !== -1) {
		return 'fr';
	} else {
		return 'en';
	}
}();

// browser width


// base eventEmitter
var emitter = new EventEmitter();

var debounce = function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
		    args = arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

//Any code that involves the main navigation goes here

var navigation = (function () {

	var body = $('body'),
	    menuIcon = $('.menu-icon'),
	    closeButton = $('.close-button-circle'),
	    showForLarge = $('.show-for-large'),
	    searchInput = $('#site-search-q');

	function init(scope) {
		menuIcon.click(function (e) {
			body.addClass('no-scroll');
		});

		closeButton.click(function (e) {
			body.removeClass('no-scroll');
		});

		showForLarge.click(function (e) {
			searchInput.focus();
		});
	}

	return {
		init: init
	};
})();

// This is less of a module than it is a collection of code for a complete page (More page in this case).
// At some point, we should consider splitting it up into bite-sized pieces. Ex: more-nav.js, more-social.js
// and so on.

var more = (function () {
  function init() {

    // Register resize behaviour
    _resize();

    // Register Click Handlers

    // Mobile Category menu
    $('.more-section-menuitem').on('click', debounce(_moreSectionMenuItem, 500, true));

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
      if ($(window).width() <= 375) {
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

  function _moreSectionMenuItem(event) {

    if (window.matchMedia("(min-width: 640px)").matches) {
      try {
        //IE fix
        event.returnValue = false;
      } catch (err) {
        console.warn('event.returnValue not available');
      }

      event.preventDefault();
    }

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
    $('.more-section-menu-dropdown-category-wrapper').hide();
    $('.' + className[0]).fadeIn('slow').focus();
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
        availableItems = $('.ig-shuffled-carousel').data('articles').articles;
        dataKey = $('.ig-shuffled-carousel').data('name');
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
        var updatedObj = _extends({}, seenItems);
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

    var videoIDs = [],
        players = [],
        brightCove;

    function init() {
        // We need to capture the video player settings defined in the HTML and create the markup that Brightcove requires
        _parseVideos();

        // Make sure the VideoJS method is available and fire ready event handlers
        brightCove = setInterval(function () {
            if ($('.vjs-plugins-ready').length) {
                _brightCoveReady();
                clearInterval(brightCove);
            }
        }, 500);

        // Function for checking if video's have scrolled off screen and need to be paused
        _viewStatus();
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
                data.overlay = $video.data('overlay') ? $video.data('overlay') : '';
                data.title = $video.data('title') ? $video.data('title') : '';
                data.description = $video.data('description') ? $video.data('description') : '';
                data.auto = $video.data('autoplay') ? 'autoplay' : '';
                data.ctrl = $video.data('controls') ? 'controls' : '';
                data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';
                data.transcript = $video.data('transcript') ? $video.data('transcript') : '';

                // Store ID's for all video's on the page - in case we want to run a post-load process on each
                videoIDs.push(data.id);

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
        var transcriptText = { 'en': 'Transcript', 'fr': 'Transcription' };
        var html = '<div class="video-container"><div class="video-container-responsive">';
        if (data.overlay.length > 0) {
            html += '<span class="video-overlay ' + data.id + '" style="background-image: url(\'../' + data.overlay + '\');"></span>';
        }
        html += '<video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video></div>';
        if (data.transcript.length > 0) {
            html += '<div class="video-transcript"><a target="_blank" href="' + data.transcript + '">' + transcriptText[lang] + '</a></div>';
        }
        html += '</div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
        $video = $video.replaceWith(html);

        if (data.overlay) {
            $(document).on('click', '#' + data.id, function () {
                $(this).siblings('.video-overlay').hide();
            });
        }
    }

    function _brightCoveReady() {
        var player;
        videoIDs.forEach(function (el) {
            videojs('#' + el).ready(function () {
                // assign this player to a variable
                player = this;
                // assign an event listener for play event
                player.on('play', _onPlay);
                // push the player to the players array
                players.push(player);
            });
        });
    }

    function _onPlay(e) {
        // determine which player the event is coming from
        var id = e.target.id;
        // go through players
        players.forEach(function (player) {
            if (player.id() !== id) {
                // pause the other player(s)
                videojs(player.id()).pause();
            }
        });
    }

    function _viewStatus() {
        $(window).scroll(function () {
            players.forEach(function (player) {
                if (!$('#' + player.id()).visible()) {
                    videojs(player.id()).pause();
                }
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
    if ($('#main-navigation').length) navigation.init();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci4nKSAhPT0gLTEgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuZXhwb3J0IHZhciBkZWJvdW5jZSA9IChmdW5jLCB3YWl0LCBpbW1lZGlhdGUpID0+IHtcclxuXHR2YXIgdGltZW91dDtcclxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGltZW91dCA9IG51bGw7XHJcblx0XHRcdGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0fTtcclxuXHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xyXG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcblx0fTtcclxufTsiLCIvL0FueSBjb2RlIHRoYXQgaW52b2x2ZXMgdGhlIG1haW4gbmF2aWdhdGlvbiBnb2VzIGhlcmVcclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBcclxuXHRcdGJvZHkgPSAkKCdib2R5JyksXHJcblx0XHRtZW51SWNvbiA9ICQoJy5tZW51LWljb24nKSxcclxuXHRcdGNsb3NlQnV0dG9uID0gJCgnLmNsb3NlLWJ1dHRvbi1jaXJjbGUnKSxcclxuXHRcdHNob3dGb3JMYXJnZSA9ICQoJy5zaG93LWZvci1sYXJnZScpLFxyXG5cdFx0c2VhcmNoSW5wdXQgPSAkKCcjc2l0ZS1zZWFyY2gtcScpO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KHNjb3BlKSB7XHJcblx0XHRtZW51SWNvbi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRib2R5LmFkZENsYXNzKCduby1zY3JvbGwnKTtcclxuXHRcdH0pO1x0XHJcblxyXG5cdFx0Y2xvc2VCdXR0b24uY2xpY2soKGUpID0+IHtcclxuXHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHRcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNob3dGb3JMYXJnZS5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRzZWFyY2hJbnB1dC5mb2N1cygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdFxyXG5cdH07XHJcbn0pKClcclxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXHJcbi8vIEF0IHNvbWUgcG9pbnQsIHdlIHNob3VsZCBjb25zaWRlciBzcGxpdHRpbmcgaXQgdXAgaW50byBiaXRlLXNpemVkIHBpZWNlcy4gRXg6IG1vcmUtbmF2LmpzLCBtb3JlLXNvY2lhbC5qc1xyXG4vLyBhbmQgc28gb24uXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxyXG4gICAgX3Jlc2l6ZSgpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBpZy5kZWJvdW5jZShfbW9yZVNlY3Rpb25NZW51SXRlbSwgNTAwLCB0cnVlKSk7XHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcclxuXHJcbiAgICAvLyBDbG9zZSBidXR0b25cclxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xyXG5cclxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcclxuICB9XHJcblxyXG4gIC8vIEVuZCBvZiBJbml0XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDw9IDM3NSkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9yZVNlY3Rpb25NZW51SXRlbShldmVudCkge1xyXG5cclxuICAgIGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1pbi13aWR0aDogNjQwcHgpXCIpLm1hdGNoZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICAvL0lFIGZpeFxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgIH0gY2F0Y2goZXJyKSB7IGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpfVxyXG5cclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcclxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICBjZW50ZXJYID0gb2Zmc2V0LmxlZnQgKyB3aWR0aCAvIDIgLSA1MCxcclxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcclxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xyXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcclxuXHJcbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXHJcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxyXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcuJyArIGNsYXNzTmFtZVswXSkuZmFkZUluKCdzbG93JykuZm9jdXMoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xyXG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxyXG4gICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xyXG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XHJcblxyXG4gICAgaWYgKGpzU29jaWFsRHJhd2VyLmhhc0NsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJykpIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLmFkZENsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qKlxyXG4gKiBTaHVmZmxlZCBDYXJvdXNlbFxyXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cclxuICpcclxuICogVXBvbiByZWZyZXNoIG9mIHRoZSBicm93c2VyLCB0aGUgZmlyc3QgdHdvIGl0ZW1zIGFyZSBhZGRlZCB0byB0aGUgc2Vlbkl0ZW1zIG9iamVjdFxyXG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcclxuICogaXMgY2xlYXJlZCBhbmQgdGhlIGNhcm91c2VsIHJlc2V0LlxyXG4gKlxyXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XHJcbiAqIEBwYXJhbSBkYXRhLWFydGljbGVzID0gVGhlIGtleSBvZiB0aGUgZGF0YSBpbiB0aGUganNvbiBvYmplY3RcclxuICogQHJldHVybiBkYXRhLWxpbWl0ID0gVGhlIGFtb3VudCBvZiBpdGVtcyB0byBiZSByZW5kZXJlZCBpbiB0aGUgY2Fyb3VzZWxcclxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgaWdscyA9IGdldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgIGF2YWlsYWJsZUl0ZW1zID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnYXJ0aWNsZXMnKS5hcnRpY2xlcztcclxuICAgICAgICBkYXRhS2V5ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbmFtZScpO1xyXG4gICAgICAgIGFydGljbGVMaW1pdCA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2xpbWl0Jyk7XHJcblxyXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xyXG4gICAgICAgICAgICAvL29iamVjdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0gaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGUoZ2V0UmFuZEFydGljbGVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBpZiAodHlwZW9mKFN0b3JhZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2xvY2Fsc3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlIScpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSUdMUygpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KHt9KSk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XHJcbiAgICAgICAgdmFyIHVwZGF0ZWRPYmogPSBPYmplY3QuYXNzaWduKHt9LCBzZWVuSXRlbXMpO1xyXG4gICAgICAgIGFydGljbGVzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkubWFwKChrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZE9ialtrXSA9IGl0ZW1ba107XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBkZWxldGUgaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIHVuc2VlbiA9IFtdLFxyXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7ICAgXHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGF2YWlsYWJsZUl0ZW1zKS5mb3JFYWNoKChrZXksIGkpID0+IHtcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xyXG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IGF2YWlsYWJsZUl0ZW1zW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICB1bnNlZW4ucHVzaChuZXdPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJhbmRBcnRpY2xlcyA9IHVuc2Vlbi5zcGxpY2UoMCwgYXJ0aWNsZUxpbWl0KTtcclxuXHJcbiAgICAgICAgaWYgKHJhbmRBcnRpY2xlcy5sZW5ndGggPCBhcnRpY2xlTGltaXQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVzcyB0aGFuICcgKyBhcnRpY2xlTGltaXQgKyAnIGl0ZW1zIGxlZnQgdG8gdmlldywgZW1wdHlpbmcgc2Vlbkl0ZW1zIGFuZCByZXN0YXJ0aW5nLicpO1xyXG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcclxuICAgICAgICAgICAgLy9jbGVhciBzZWVuSXRlbXMsIHJlc2V0IGxzLCBhbmQgcmVpbml0XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNodWZmbGUocmFuZEFydGljbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUocmFuZG9tQXJ0aWNsZXMpIHtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGh0bWwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZighcmFuZG9tQXJ0aWNsZXMpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHJhbmRvbUFydGljbGVzLmZvckVhY2goKGFydGljbGUpID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJ0aWNsZSkubWFwKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS5wdXNoKGFydGljbGVba2V5XSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBodG1sID0gTXVzdGFjaGUudG9faHRtbCgkKGAjJHtkYXRhS2V5fWApLmh0bWwoKSwgeyBcImFydGljbGVzXCI6IHRlbXBsYXRlRGF0YSB9KTtcclxuXHJcbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgdXBkYXRlTG9jYWxTdG9yYWdlKHJhbmRvbUFydGljbGVzKTtcclxuXHJcbiAgICAgICAgYnVpbGRDYXJvdXNlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICAgICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgICAgICAgbmV4dEFycm93LFxyXG4gICAgICAgICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgICAgICQoJy5pZy1jYXJvdXNlbCcpLm5vdCgnLnNsaWNrLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkoKVxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciB2aWRlb0lEcyA9IFtdLFxyXG4gICAgICAgIHBsYXllcnMgPSBbXSxcclxuICAgICAgICBicmlnaHRDb3ZlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgLy8gV2UgbmVlZCB0byBjYXB0dXJlIHRoZSB2aWRlbyBwbGF5ZXIgc2V0dGluZ3MgZGVmaW5lZCBpbiB0aGUgSFRNTCBhbmQgY3JlYXRlIHRoZSBtYXJrdXAgdGhhdCBCcmlnaHRjb3ZlIHJlcXVpcmVzXHJcbiAgICAgICAgX3BhcnNlVmlkZW9zKCk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMClcclxuXHJcbiAgICAgICAgLy8gRnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHZpZGVvJ3MgaGF2ZSBzY3JvbGxlZCBvZmYgc2NyZWVuIGFuZCBuZWVkIHRvIGJlIHBhdXNlZFxyXG4gICAgICAgIF92aWV3U3RhdHVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xyXG4gICAgICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgICAgICAgICR2aWRlbyxcclxuICAgICAgICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICAgICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ107XHJcblxyXG4gICAgICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXHJcbiAgICAgICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgICAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcclxuICAgICAgICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKHJlcXVpcmVkKVxyXG4gICAgICAgICAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAob3B0aW9uYWwpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm92ZXJsYXkgPSAkdmlkZW8uZGF0YSgnb3ZlcmxheScpID8gJHZpZGVvLmRhdGEoJ292ZXJsYXknKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJyA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xyXG4gICAgICAgICAgICAgICAgZGF0YS50cmFuc2NyaXB0ID0gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA/ICR2aWRlby5kYXRhKCd0cmFuc2NyaXB0JykgOiAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXHJcbiAgICAgICAgICAgICAgICB2aWRlb0lEcy5wdXNoKGRhdGEuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICAgICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcclxuICAgICAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xyXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcclxuICAgICAgICB2YXIgdHJhbnNjcmlwdFRleHQgPSB7J2VuJzogJ1RyYW5zY3JpcHQnLCAnZnInOiAnVHJhbnNjcmlwdGlvbid9O1xyXG4gICAgICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5gXHJcbiAgICAgICAgaWYgKGRhdGEub3ZlcmxheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheSAke2RhdGEuaWR9XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLyR7ZGF0YS5vdmVybGF5fScpO1wiPjwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBodG1sICs9IGA8dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiJHtkYXRhLmFjY291bnR9XCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiICR7ZGF0YS5jdHJsfSAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gXHJcbiAgICAgICAgaWYgKGRhdGEudHJhbnNjcmlwdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJ2aWRlby10cmFuc2NyaXB0XCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZGF0YS50cmFuc2NyaXB0fVwiPiR7dHJhbnNjcmlwdFRleHRbaWcubGFuZ119PC9hPjwvZGl2PmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwgKz0gYDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICAgICAkdmlkZW8gPSAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLm92ZXJsYXkpIHtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJyMnICsgZGF0YS5pZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnZpZGVvLW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICAgICAgdmFyIHBsYXllcjtcclxuICAgICAgICB2aWRlb0lEcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhc3NpZ24gdGhpcyBwbGF5ZXIgdG8gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gdGhpcztcclxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBhbiBldmVudCBsaXN0ZW5lciBmb3IgcGxheSBldmVudFxyXG4gICAgICAgICAgICAgICAgcGxheWVyLm9uKCdwbGF5JywgX29uUGxheSk7XHJcbiAgICAgICAgICAgICAgICAvLyBwdXNoIHRoZSBwbGF5ZXIgdG8gdGhlIHBsYXllcnMgYXJyYXlcclxuICAgICAgICAgICAgICAgIHBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9vblBsYXkoZSkge1xyXG4gICAgICAgIC8vIGRldGVybWluZSB3aGljaCBwbGF5ZXIgdGhlIGV2ZW50IGlzIGNvbWluZyBmcm9tXHJcbiAgICAgICAgdmFyIGlkID0gZS50YXJnZXQuaWQ7XHJcbiAgICAgICAgLy8gZ28gdGhyb3VnaCBwbGF5ZXJzXHJcbiAgICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHBsYXllci5pZCgpICE9PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gcGF1c2UgdGhlIG90aGVyIHBsYXllcihzKVxyXG4gICAgICAgICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX3ZpZXdTdGF0dXMoKSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQoJyMnICsgcGxheWVyLmlkKCkpLnZpc2libGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgLy8gRGVmaW5lIGNvbXBvbmVudC1sZXZlbCB2YXJpYWJsZXNcclxuICB2YXIgbWVzc2FnZXMgPSBbXSxcclxuICAgIGNvdW50ZXIgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XHJcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxyXG4gICAgdmFyICR0aGlzID0gJChzY29wZSk7XHJcblxyXG4gICAgLy8gTGV0J3MgY3JlYXRlIGEgbWVzc2FnZSBhcnJheVxyXG4gICAgbWVzc2FnZXMgPSBbJ0hlbGxvIScsICdJcyBpdCBtZSB5b3VcXCdyZSBsb29raW5nIGZvcj8nLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgZXllcycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBzbWlsZScsICdZb3VcXCdyZSBhbGwgSVxcJ3ZlIGV2ZXIgd2FudGVkJywgJ0FuZCBteSBhcm1zIGFyZSBvcGVuIHdpZGUnLCAnXFwnY2F1c2UgeW91IGtub3cganVzdCB3aGF0IHRvIHNheScsICdBbmQgeW91IGtub3cganVzdCB3aGF0IHRvIGRvJywgJ0FuZCBJIHdhbnQgdG8gdGVsbCB5b3Ugc28gbXVjaCddO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIGNsaWNrIGhhbmRsZXJcclxuICAgICR0aGlzLmZpbmQoJ2EuYnV0dG9uLm1lc3NhZ2UnKS5vbignY2xpY2snLCBldmVudCwgX3NheUhlbGxvKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zYXlIZWxsbygpIHtcclxuICAgIC8vIExldCdzIGVtaXQgYW4gZXZlbnQgd2l0aCBhbiBpbmRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCBzZW5kIGFsb25nIHNvbWV0aGluZyB0byBkaXNwbGF5XHJcbiAgICBpZy5lbWl0dGVyLmVtaXQoJ2hlbGxvJywgbWVzc2FnZXNbY291bnRlcl0pO1xyXG4gICAgY291bnRlciArPSAxO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuICB2YXIgJHRoaXNcclxuXHJcbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcclxuICAgICR0aGlzID0gJChzY29wZSk7XHJcbiAgICBfbGlzdGVuZXIoKTtcclxuICB9XHJcblxyXG4gIC8vIFdlIGtub3cgbm90aGluZyBhYm91dCB0aGUgY29tcG9uZW50IHRoYXQgd2lsbCBzZW5kIHRoZSBtZXNzYWdlLiBPbmx5IHRoYXQgaXQgd2lsbCBoYXZlXHJcbiAgLy8gYW4gaWRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCB0aGF0IHdlIHdpbGwgcmVjZWl2ZSBhICdtZXNzYWdlJyB0byBkaXNwbGF5LlxyXG4gIGZ1bmN0aW9uIF9saXN0ZW5lcigpIHtcclxuICAgIGlnLmVtaXR0ZXIub24oJ2hlbGxvJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgICAgJCgnPHAgY2xhc3M9XCJhbGVydC1ib3ggYWxlcnRcIj4nICsgbWVzc2FnZSArICc8L3A+JykuaGlkZSgpLmFwcGVuZFRvKCR0aGlzKS5mYWRlSW4oJ2Zhc3QnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vbmF2aWdhdGlvbi5qcydcclxuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcclxuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xyXG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBzaHVmZmxlZENhcm91c2VsIGZyb20gJy4vc2h1ZmZsZWQtY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xyXG5pbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XHJcbmltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgaWYoJCgnI21haW4tbmF2aWdhdGlvbicpLmxlbmd0aCkgbmF2aWdhdGlvbi5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcclxuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSBtb3JlLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5sZW5ndGgpIHNodWZmbGVkQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG5cclxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXHJcbiAgICBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcclxuICAgIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xyXG5cclxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XHJcbiAgICBfbGFuZ3VhZ2UoKTtcclxuICB9XHJcblxyXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxyXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xyXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgYXBwLmluaXQoKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiZGVib3VuY2UiLCJmdW5jIiwid2FpdCIsImltbWVkaWF0ZSIsInRpbWVvdXQiLCJjb250ZXh0IiwiYXJncyIsImFyZ3VtZW50cyIsImxhdGVyIiwiYXBwbHkiLCJjYWxsTm93Iiwic2V0VGltZW91dCIsImJvZHkiLCIkIiwibWVudUljb24iLCJjbG9zZUJ1dHRvbiIsInNob3dGb3JMYXJnZSIsInNlYXJjaElucHV0IiwiaW5pdCIsInNjb3BlIiwiY2xpY2siLCJlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImZvY3VzIiwib24iLCJpZyIsIl9tb3JlU2VjdGlvbk1lbnVJdGVtIiwiX21vYmlsZUNhdGVnb3J5TWVudSIsIl9jbG9zZUJ1dHRvbiIsIl9vcGVuU29jaWFsRHJhd2VyIiwiX3Jlc2l6ZSIsInJlc2l6ZSIsIndpZHRoIiwiY3NzIiwiZXZlbnQiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInJldHVyblZhbHVlIiwiZXJyIiwid2FybiIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCJvZmZzZXQiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImhpZGUiLCJmYWRlSW4iLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJoYXNDbGFzcyIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlTG9jYWxTdG9yYWdlIiwidXBkYXRlZE9iaiIsImZvckVhY2giLCJpdGVtIiwiaSIsImtleXMiLCJtYXAiLCJrIiwicmVzZXRMb2NhbFN0b3JhZ2UiLCJ1bnNlZW4iLCJyYW5kQXJ0aWNsZXMiLCJrZXkiLCJuZXdPYmoiLCJwdXNoIiwic3BsaWNlIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdlbmVyYXRlVGVtcGxhdGUiLCJyYW5kb21BcnRpY2xlcyIsImh0bWwiLCJ0ZW1wbGF0ZURhdGEiLCJhcnRpY2xlIiwiTXVzdGFjaGUiLCJ0b19odG1sIiwiYnVpbGRDYXJvdXNlbCIsIm5vdCIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCJzZXRJbnRlcnZhbCIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwib3ZlcmxheSIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwidHJhbnNjcmlwdCIsIl9pbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2luamVjdFRlbXBsYXRlIiwidHJhbnNjcmlwdFRleHQiLCJyZXBsYWNlV2l0aCIsImRvY3VtZW50Iiwic2libGluZ3MiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZWwiLCJyZWFkeSIsIl9vblBsYXkiLCJ0YXJnZXQiLCJwYXVzZSIsIl92aWV3U3RhdHVzIiwic2Nyb2xsIiwidmlzaWJsZSIsIm1lc3NhZ2VzIiwiY291bnRlciIsIl9zYXlIZWxsbyIsImVtaXQiLCJfbGlzdGVuZXIiLCJtZXNzYWdlIiwiYXBwZW5kVG8iLCJhcHAiLCJmb3VuZGF0aW9uIiwibmF2aWdhdGlvbiIsImZvcm1zIiwibW9yZSIsImNhcm91c2VsIiwic2h1ZmZsZWRDYXJvdXNlbCIsInZpZGVvIiwiZXZ0MSIsImV2dDIiLCJfbGFuZ3VhZ2UiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtLQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBOUMsSUFBbURILE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQXJHLEVBQXdHO1NBQy9GLElBQVA7RUFERixNQUVPO1NBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPOzs7QUFLUCxBQUFPLElBQUlDLFVBQVUsSUFBSUMsWUFBSixFQUFkOztBQUVQLEFBQU8sSUFBSUMsV0FBVyxTQUFYQSxRQUFXLENBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxTQUFiLEVBQTJCO0tB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