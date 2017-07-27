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


// check for IE (pre Edge)
var oldIE = function () {
  if ("ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
}();

// base eventEmitter
// export var emitter = new EventEmitter();

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
	    searchInput = $('#site-search-q'),
	    hasSubNav = $('.has-subnav');

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

		hasSubNav.click(function (e) {
			var snTarget = $(e.currentTarget);
			if (snTarget.hasClass("active")) {
				//deactivate
				snTarget.removeClass('active');
			} else {
				//activate
				snTarget.addClass('active');
			}
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
    _messages();
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

  function _messages() {
    if (lang === "fr") {
      $.extend($.validator.messages, {
        required: "Ce champ est obligatoire.",
        remote: "Veuillez corriger ce champ.",
        email: "Veuillez fournir une adresse électronique valide.",
        url: "Veuillez fournir une adresse URL valide.",
        date: "Veuillez fournir une date valide.",
        dateISO: "Veuillez fournir une date valide (ISO).",
        number: "Veuillez fournir un numéro valide.",
        digits: "Veuillez fournir seulement des chiffres.",
        creditcard: "Veuillez fournir un numéro de carte de crédit valide.",
        equalTo: "Veuillez fournir encore la même valeur.",
        extension: "Veuillez fournir une valeur avec une extension valide.",
        maxlength: $.validator.format("Veuillez fournir au plus {0} caractères."),
        minlength: $.validator.format("Veuillez fournir au moins {0} caractères."),
        rangelength: $.validator.format("Veuillez fournir une valeur qui contient entre {0} et {1} caractères."),
        range: $.validator.format("Veuillez fournir une valeur entre {0} et {1}."),
        max: $.validator.format("Veuillez fournir une valeur inférieure ou égale à {0}."),
        min: $.validator.format("Veuillez fournir une valeur supérieure ou égale à {0}."),
        step: $.validator.format("Veuillez fournir une valeur multiple de {0}."),
        maxWords: $.validator.format("Veuillez fournir au plus {0} mots."),
        minWords: $.validator.format("Veuillez fournir au moins {0} mots."),
        rangeWords: $.validator.format("Veuillez fournir entre {0} et {1} mots."),
        letterswithbasicpunc: "Veuillez fournir seulement des lettres et des signes de ponctuation.",
        alphanumeric: "Veuillez fournir seulement des lettres, nombres, espaces et soulignages.",
        lettersonly: "Veuillez fournir seulement des lettres.",
        nowhitespace: "Veuillez ne pas inscrire d'espaces blancs.",
        ziprange: "Veuillez fournir un code postal entre 902xx-xxxx et 905-xx-xxxx.",
        integer: "Veuillez fournir un nombre non décimal qui est positif ou négatif.",
        vinUS: "Veuillez fournir un numéro d'identification du véhicule (VIN).",
        dateITA: "Veuillez fournir une date valide.",
        time: "Veuillez fournir une heure valide entre 00:00 et 23:59.",
        phoneUS: "Veuillez fournir un numéro de téléphone valide.",
        phoneUK: "Veuillez fournir un numéro de téléphone valide.",
        mobileUK: "Veuillez fournir un numéro de téléphone mobile valide.",
        strippedminlength: $.validator.format("Veuillez fournir au moins {0} caractères."),
        email2: "Veuillez fournir une adresse électronique valide.",
        url2: "Veuillez fournir une adresse URL valide.",
        creditcardtypes: "Veuillez fournir un numéro de carte de crédit valide.",
        ipv4: "Veuillez fournir une adresse IP v4 valide.",
        ipv6: "Veuillez fournir une adresse IP v6 valide.",
        require_from_group: "Veuillez fournir au moins {0} de ces champs.",
        nifES: "Veuillez fournir un numéro NIF valide.",
        nieES: "Veuillez fournir un numéro NIE valide.",
        cifES: "Veuillez fournir un numéro CIF valide.",
        postalCodeCA: "Veuillez fournir un code postal valide."
      });
    }
  }

  return {
    init: init
  };
})();

var carousel = (function () {

  function init() {
    console.log('Carousel Initialized!');
    _buildCarousel();
    _addTrackingHandlers();
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

  function _addTrackingHandlers() {
    $('.ig-carousel').on('click', 'button', function () {
      console.log(_satellite);
      console.log("Carousel Scroll");
      _satellite.track('carousel_scroll');
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

var accordion = (function () {

	var sectionTitle = $('.accordion-menu-section-title');

	function init() {
		sectionTitle.click(function (e) {
			try {
				//IE fix
				e.returnValue = false;
			} catch (err) {
				console.warn('event.returnValue not available');
			}

			e.preventDefault();
		});
	}

	return {
		init: init
	};
})();

var video = (function () {

  var videoIDs = [],
      players = [],
      brightCove,
      $video;

  function init() {

    _parseVideos();

    if (!oldIE) {

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
  }

  function _parseVideos() {
    var $group,
        data = {},
        preloadOptions = ['auto', 'metadata', 'none'];

    // Each group can effectively use a different player which will only be loaded once
    $('.ig-video-group').each(function () {
      $group = $(this);
      data.player = $group.data('player');

      // Loop through video's
      $group.find('.ig-video-js').each(function (index) {
        $video = $(this);

        data.id = $video.data('id');
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data('description') : '';

        if (oldIE) {

          _injectIframe(data, $video);
        } else {

          // Capture options that are used with modern browsers
          data.overlay = $video.data('overlay') ? $video.data('overlay') : '';
          data.auto = $video.data('autoplay') ? 'autoplay' : '';
          data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';
          data.transcript = $video.data('transcript') ? $video.data('transcript') : '';
          data.ctaTemplate = $video.data('ctaTemplate') ? $video.data('ctaTemplate') : '';

          // Store ID's for all video's on the page - in case we want to run a post-load process on each
          videoIDs.push(data.id);

          // Let's replace the ig-video-js 'directive' with the necessary Brightcove code
          _injectTemplate(data, index);
        }
      });

      // Only inject Brightcove JS if modern browser
      if (!oldIE) {
        injectBrightCoveJS(data);
      }
    });
  }

  function _injectTemplate(data, index) {
    var transcriptText = { 'en': 'Transcript', 'fr': 'Transcription' },
        html = '<div class="video-container ' + data.id + '"><div class="video-container-responsive">';

    if (data.ctaTemplate.length > 0) {
      html += '<span class="video-cta">' + data.ctaTemplate + '</span>';
    }
    if (data.overlay.length > 0) {
      html += '<span class="video-overlay" style="background-image: url(\'' + data.overlay + '\');"></span>';
    }
    html += '<video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="3906942861001" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" controls ' + data.auto + '></video></div>';
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

  function _injectIframe(data) {
    var html = '<div class="video-container">\n      <div class="video-container-responsive">\n      <iframe class="video-js" src=\'//players.brightcove.net/3906942861001/' + data.player + '_default/index.html?videoId=' + data.id + '\'\n    allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>\n    </div>\n    </div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video = $video.replaceWith(html);
  }

  function injectBrightCoveJS(data) {
    var indexjs = '<script src="//players.brightcove.net/3906942861001/' + data.player + '_default/index.min.js"></script>';
    $('body').append(indexjs);
  }

  function _brightCoveReady() {
    var player;
    videoIDs.forEach(function (el) {
      videojs('#' + el).ready(function () {
        // assign this player to a variable
        player = this;
        // assign an event listener for play event
        player.on('play', _onPlay);
        // assign an event listener for ended event
        player.on('ended', _onComplete);
        // push the player to the players array
        players.push(player);
      });
    });
  }

  function _onPlay(e) {
    // Adobe Analytics
    _satellite.track('video_start');
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

  function _onComplete(e) {
    // Adobe Analytics
    _satellite.track('video_end');
    $('.' + e.target.id).addClass('complete');
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

var modal = (function () {

	function init() {
		$(document).on('open.zf.reveal', function () {
			_satellite.track('modal_click');
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

// Init Satellite
window._satellite = window._satellite || {};
window._satellite.track = window._satellite.track || function () {};

// Event Emitter test modules
// import evt1 from './event-test-1.js';
// import evt2 from './event-test-2.js';

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
    if ($('.accordion').length) accordion.init();
    if ($('[data-open]').length) modal.init();

    // Components can also be setup to receive an HTML 'scope' (.ig-evt1... .ig-evt2.... etc)
    // if ($('.ig-evt1').length) evt1.init('.ig-evt1');
    // if ($('.ig-evt2').length) evt2.init('.ig-evt2');

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL21vZGFsLmpzIiwibW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcbiB1c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XG5cbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcbiAqL1xuXG4vLyB1cmwgcGF0aFxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG59KSgpXG5cbi8vIGxhbmd1YWdlXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci4nKSAhPT0gLTEgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gJ2ZyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufSkoKVxuXG4vLyBicm93c2VyIHdpZHRoXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcbn0pKClcblxuLy8gY2hlY2sgZm9yIElFIChwcmUgRWRnZSlcbmV4cG9ydCB2YXIgb2xkSUUgPSAoKCkgPT4ge1xuICBpZiAoXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KSgpXG5cbi8vIGJhc2UgZXZlbnRFbWl0dGVyXG4vLyBleHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbmV4cG9ydCB2YXIgZGVib3VuY2UgPSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSA9PiB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfTtcbn07XG4iLCIvL0FueSBjb2RlIHRoYXQgaW52b2x2ZXMgdGhlIG1haW4gbmF2aWdhdGlvbiBnb2VzIGhlcmVcclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBcclxuXHRcdGJvZHkgPSAkKCdib2R5JyksXHJcblx0XHRtZW51SWNvbiA9ICQoJy5tZW51LWljb24nKSxcclxuXHRcdGNsb3NlQnV0dG9uID0gJCgnLmNsb3NlLWJ1dHRvbi1jaXJjbGUnKSxcclxuXHRcdHNob3dGb3JMYXJnZSA9ICQoJy5zaG93LWZvci1sYXJnZScpLFxyXG5cdFx0c2VhcmNoSW5wdXQgPSAkKCcjc2l0ZS1zZWFyY2gtcScpLFxyXG5cdFx0aGFzU3ViTmF2ID0gJCgnLmhhcy1zdWJuYXYnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG5cdFx0bWVudUljb24uY2xpY2soKGUpID0+IHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblx0XHR9KTtcdFxyXG5cclxuXHRcdGNsb3NlQnV0dG9uLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1x0XHJcblx0XHR9KTtcclxuXHJcblx0XHRzaG93Rm9yTGFyZ2UuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0c2VhcmNoSW5wdXQuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGhhc1N1Yk5hdi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRsZXQgc25UYXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcblx0XHRcdGlmKCBzblRhcmdldC5oYXNDbGFzcyhcImFjdGl2ZVwiKSApIHtcclxuXHRcdFx0XHQvL2RlYWN0aXZhdGVcclxuXHRcdFx0XHRzblRhcmdldC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly9hY3RpdmF0ZVxyXG5cdFx0XHRcdHNuVGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdFxyXG5cdH07XHJcbn0pKClcclxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXHJcbi8vIEF0IHNvbWUgcG9pbnQsIHdlIHNob3VsZCBjb25zaWRlciBzcGxpdHRpbmcgaXQgdXAgaW50byBiaXRlLXNpemVkIHBpZWNlcy4gRXg6IG1vcmUtbmF2LmpzLCBtb3JlLXNvY2lhbC5qc1xyXG4vLyBhbmQgc28gb24uXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxyXG4gICAgX3Jlc2l6ZSgpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBpZy5kZWJvdW5jZShfbW9yZVNlY3Rpb25NZW51SXRlbSwgNTAwLCB0cnVlKSk7XHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcclxuXHJcbiAgICAvLyBDbG9zZSBidXR0b25cclxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xyXG5cclxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcclxuICB9XHJcblxyXG4gIC8vIEVuZCBvZiBJbml0XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDw9IDM3NSkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9yZVNlY3Rpb25NZW51SXRlbShldmVudCkge1xyXG5cclxuICAgIGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1pbi13aWR0aDogNjQwcHgpXCIpLm1hdGNoZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICAvL0lFIGZpeFxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgIH0gY2F0Y2goZXJyKSB7IGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpfVxyXG5cclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcclxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICBjZW50ZXJYID0gb2Zmc2V0LmxlZnQgKyB3aWR0aCAvIDIgLSA1MCxcclxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcclxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xyXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcclxuXHJcbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXHJcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxyXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcuJyArIGNsYXNzTmFtZVswXSkuZmFkZUluKCdzbG93JykuZm9jdXMoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xyXG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxyXG4gICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xyXG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XHJcblxyXG4gICAgaWYgKGpzU29jaWFsRHJhd2VyLmhhc0NsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJykpIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLmFkZENsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKTtcclxuICAgIF9tZXNzYWdlcygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21lc3NhZ2VzKCkge1xyXG4gICAgaWYgKGlnLmxhbmcgPT09IFwiZnJcIikge1xyXG4gICAgICAkLmV4dGVuZCggJC52YWxpZGF0b3IubWVzc2FnZXMsIHtcclxuICAgICAgICByZXF1aXJlZDogXCJDZSBjaGFtcCBlc3Qgb2JsaWdhdG9pcmUuXCIsXHJcbiAgICAgICAgcmVtb3RlOiBcIlZldWlsbGV6IGNvcnJpZ2VyIGNlIGNoYW1wLlwiLFxyXG4gICAgICAgIGVtYWlsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2Ugw6lsZWN0cm9uaXF1ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdXJsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBkYXRlOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIGRhdGVJU086IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUgKElTTykuXCIsXHJcbiAgICAgICAgbnVtYmVyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGlnaXRzOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBjaGlmZnJlcy5cIixcclxuICAgICAgICBjcmVkaXRjYXJkOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcclxuICAgICAgICBlcXVhbFRvOiBcIlZldWlsbGV6IGZvdXJuaXIgZW5jb3JlIGxhIG3Dqm1lIHZhbGV1ci5cIixcclxuICAgICAgICBleHRlbnNpb246IFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGF2ZWMgdW5lIGV4dGVuc2lvbiB2YWxpZGUuXCIsXHJcbiAgICAgICAgbWF4bGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgcmFuZ2VsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgcXVpIGNvbnRpZW50IGVudHJlIHswfSBldCB7MX0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICByYW5nZTogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBlbnRyZSB7MH0gZXQgezF9LlwiICksXHJcbiAgICAgICAgbWF4OiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGluZsOpcmlldXJlIG91IMOpZ2FsZSDDoCB7MH0uXCIgKSxcclxuICAgICAgICBtaW46ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgc3Vww6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxyXG4gICAgICAgIHN0ZXA6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgbXVsdGlwbGUgZGUgezB9LlwiICksXHJcbiAgICAgICAgbWF4V29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IHBsdXMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICBtaW5Xb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICByYW5nZVdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBlbnRyZSB7MH0gZXQgezF9IG1vdHMuXCIgKSxcclxuICAgICAgICBsZXR0ZXJzd2l0aGJhc2ljcHVuYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcyBldCBkZXMgc2lnbmVzIGRlIHBvbmN0dWF0aW9uLlwiLFxyXG4gICAgICAgIGFscGhhbnVtZXJpYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcywgbm9tYnJlcywgZXNwYWNlcyBldCBzb3VsaWduYWdlcy5cIixcclxuICAgICAgICBsZXR0ZXJzb25seTogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcy5cIixcclxuICAgICAgICBub3doaXRlc3BhY2U6IFwiVmV1aWxsZXogbmUgcGFzIGluc2NyaXJlIGQnZXNwYWNlcyBibGFuY3MuXCIsXHJcbiAgICAgICAgemlwcmFuZ2U6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCBlbnRyZSA5MDJ4eC14eHh4IGV0IDkwNS14eC14eHh4LlwiLFxyXG4gICAgICAgIGludGVnZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBub21icmUgbm9uIGTDqWNpbWFsIHF1aSBlc3QgcG9zaXRpZiBvdSBuw6lnYXRpZi5cIixcclxuICAgICAgICB2aW5VUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZCdpZGVudGlmaWNhdGlvbiBkdSB2w6loaWN1bGUgKFZJTikuXCIsXHJcbiAgICAgICAgZGF0ZUlUQTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZS5cIixcclxuICAgICAgICB0aW1lOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGhldXJlIHZhbGlkZSBlbnRyZSAwMDowMCBldCAyMzo1OS5cIixcclxuICAgICAgICBwaG9uZVVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgcGhvbmVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxyXG4gICAgICAgIG1vYmlsZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSBtb2JpbGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHN0cmlwcGVkbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICBlbWFpbDI6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSDDqWxlY3Ryb25pcXVlIHZhbGlkZS5cIixcclxuICAgICAgICB1cmwyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBjcmVkaXRjYXJkdHlwZXM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIGNhcnRlIGRlIGNyw6lkaXQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGlwdjQ6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NCB2YWxpZGUuXCIsXHJcbiAgICAgICAgaXB2NjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY2IHZhbGlkZS5cIixcclxuICAgICAgICByZXF1aXJlX2Zyb21fZ3JvdXA6IFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gZGUgY2VzIGNoYW1wcy5cIixcclxuICAgICAgICBuaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklGIHZhbGlkZS5cIixcclxuICAgICAgICBuaWVFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklFIHZhbGlkZS5cIixcclxuICAgICAgICBjaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gQ0lGIHZhbGlkZS5cIixcclxuICAgICAgICBwb3N0YWxDb2RlQ0E6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCB2YWxpZGUuXCJcclxuICAgICAgfSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcbiAgICBfYWRkVHJhY2tpbmdIYW5kbGVycygpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgdmFyIHByZXZBcnJvdyxcbiAgICAgIG5leHRBcnJvdyxcbiAgICAgICRjYXJvdXNlbDtcblxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIF9hZGRUcmFja2luZ0hhbmRsZXJzKCkge1xuICAgICQoJy5pZy1jYXJvdXNlbCcpLm9uKCdjbGljaycsICdidXR0b24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhfc2F0ZWxsaXRlKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ2Fyb3VzZWwgU2Nyb2xsXCIpXG4gICAgICBfc2F0ZWxsaXRlLnRyYWNrKCdjYXJvdXNlbF9zY3JvbGwnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKVxuIiwiLyoqXHJcbiAqIFNodWZmbGVkIENhcm91c2VsXHJcbiAqIFRha2VzIGVpZ2h0IGl0ZW1zIGZyb20gYW4gb2JqZWN0IG9mIDIwLCBhbmQgcmVuZGVycyB0aGVtIGluIGEgY2Fyb3VzZWwgaW4gcmFuZG9tIG9yZGVyLlxyXG4gKlxyXG4gKiBVcG9uIHJlZnJlc2ggb2YgdGhlIGJyb3dzZXIsIHRoZSBmaXJzdCB0d28gaXRlbXMgYXJlIGFkZGVkIHRvIHRoZSBzZWVuSXRlbXMgb2JqZWN0XHJcbiAqIGFuZCB3cml0dGVuIHRvIGxvY2FsIHN0b3JhZ2UsIHdoZW4gdGhlIGFtb3VudCBvZiB1bnNlZW4gaXRlbXMgZHJvcHMgYmVsb3cgOCwgc2Vlbkl0ZW1zIFxyXG4gKiBpcyBjbGVhcmVkIGFuZCB0aGUgY2Fyb3VzZWwgcmVzZXQuXHJcbiAqXHJcbiAqIFRoZXJlIGFyZSB0d28gY29uZmlndXJhYmxlIGRhdGEgYXR0cmlidXRlcyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgdG8gdGhlIG1hcmt1cDpcclxuICogQHBhcmFtIGRhdGEtYXJ0aWNsZXMgPSBUaGUga2V5IG9mIHRoZSBkYXRhIGluIHRoZSBqc29uIG9iamVjdFxyXG4gKiBAcmV0dXJuIGRhdGEtbGltaXQgPSBUaGUgYW1vdW50IG9mIGl0ZW1zIHRvIGJlIHJlbmRlcmVkIGluIHRoZSBjYXJvdXNlbFxyXG4gKiBFeC4gPGRpdiBjbGFzcz1cImlnLXNodWZmbGVkLWNhcm91c2VsXCIgZGF0YS1hcnRpY2xlcz1cImFkdmljZS1zdG9yaWVzXCIgZGF0YS1saW1pdD1cIjhcIj48L2Rpdj5cclxuICovXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgdmFyIGF2YWlsYWJsZUl0ZW1zLCBzZWVuSXRlbXMsIGlnbHMsIGRhdGFLZXksIGFydGljbGVMaW1pdDtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgICAgICBpZ2xzID0gZ2V0TG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgYXZhaWxhYmxlSXRlbXMgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdhcnRpY2xlcycpLmFydGljbGVzO1xyXG4gICAgICAgIGRhdGFLZXkgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCduYW1lJyk7XHJcbiAgICAgICAgYXJ0aWNsZUxpbWl0ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbGltaXQnKTtcclxuXHJcbiAgICAgICAgaWYgKCFpZ2xzW2RhdGFLZXldKSB7XHJcbiAgICAgICAgICAgIC8vb2JqZWN0IGRvZXMgbm90IGV4aXN0IHlldFxyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2VuZXJhdGVUZW1wbGF0ZShnZXRSYW5kQXJ0aWNsZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YoU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikgPyBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpIDogY3JlYXRlSUdMUygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbG9jYWxzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUhJylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJR0xTKCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoe30pKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbFN0b3JhZ2UoYXJ0aWNsZXMpIHtcclxuICAgICAgICB2YXIgdXBkYXRlZE9iaiA9IE9iamVjdC5hc3NpZ24oe30sIHNlZW5JdGVtcyk7XHJcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5tYXAoKGspID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkT2JqW2tdID0gaXRlbVtrXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlnbHNbZGF0YUtleV0gPSB1cGRhdGVkT2JqO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGRlbGV0ZSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJhbmRBcnRpY2xlcygpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgdW5zZWVuID0gW10sXHJcbiAgICAgICAgICAgIHJhbmRBcnRpY2xlczsgICBcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXMoYXZhaWxhYmxlSXRlbXMpLmZvckVhY2goKGtleSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgbmV3T2JqID0ge307XHJcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gYXZhaWxhYmxlSXRlbXNba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2Vlbkl0ZW1zW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHVuc2Vlbi5wdXNoKG5ld09iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmFuZEFydGljbGVzID0gdW5zZWVuLnNwbGljZSgwLCBhcnRpY2xlTGltaXQpO1xyXG5cclxuICAgICAgICBpZiAocmFuZEFydGljbGVzLmxlbmd0aCA8IGFydGljbGVMaW1pdCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdMZXNzIHRoYW4gJyArIGFydGljbGVMaW1pdCArICcgaXRlbXMgbGVmdCB0byB2aWV3LCBlbXB0eWluZyBzZWVuSXRlbXMgYW5kIHJlc3RhcnRpbmcuJyk7XHJcbiAgICAgICAgICAgIC8vVGhlcmUncyBsZXNzIHVuc2VlbiBhcnRpY2xlcyB0aGF0IHRoZSBsaW1pdFxyXG4gICAgICAgICAgICAvL2NsZWFyIHNlZW5JdGVtcywgcmVzZXQgbHMsIGFuZCByZWluaXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgICAgIHJlc2V0TG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBpbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2h1ZmZsZShyYW5kQXJ0aWNsZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLFxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXHJcbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcblxyXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVUZW1wbGF0ZShyYW5kb21BcnRpY2xlcykge1xyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgaHRtbCxcclxuICAgICAgICAgICAgdGVtcGxhdGVEYXRhID0gW107XHJcblxyXG4gICAgICAgIGlmKCFyYW5kb21BcnRpY2xlcykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgcmFuZG9tQXJ0aWNsZXMuZm9yRWFjaCgoYXJ0aWNsZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcnRpY2xlKS5tYXAoKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEYXRhLnB1c2goYXJ0aWNsZVtrZXldKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKCQoYCMke2RhdGFLZXl9YCkuaHRtbCgpLCB7IFwiYXJ0aWNsZXNcIjogdGVtcGxhdGVEYXRhIH0pO1xyXG5cclxuICAgICAgICAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICB1cGRhdGVMb2NhbFN0b3JhZ2UocmFuZG9tQXJ0aWNsZXMpO1xyXG5cclxuICAgICAgICBidWlsZENhcm91c2VsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgICAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICAgICAgICBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAgICAgJCgnLmlnLWNhcm91c2VsJykubm90KCcuc2xpY2staW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICAgICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpXHJcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBzZWN0aW9uVGl0bGUgPSAkKCcuYWNjb3JkaW9uLW1lbnUtc2VjdGlvbi10aXRsZScpO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0c2VjdGlvblRpdGxlLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Ly9JRSBmaXhcclxuXHRcdFx0XHRlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHRcdH0gY2F0Y2goZXJyKSB7IGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpfVxyXG5cdFx0XHRcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdFxyXG5cdH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgdmFyIHZpZGVvSURzID0gW10sXG4gICAgcGxheWVycyA9IFtdLFxuICAgIGJyaWdodENvdmUsXG4gICAgJHZpZGVvO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBfcGFyc2VWaWRlb3MoKTtcblxuICAgIGlmICghaWcub2xkSUUpIHtcblxuICAgICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnNcbiAgICAgIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKCcudmpzLXBsdWdpbnMtcmVhZHknKS5sZW5ndGgpIHtcbiAgICAgICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTAwKTtcblxuICAgICAgLy8gRnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHZpZGVvJ3MgaGF2ZSBzY3JvbGxlZCBvZmYgc2NyZWVuIGFuZCBuZWVkIHRvIGJlIHBhdXNlZFxuICAgICAgX3ZpZXdTdGF0dXMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XG4gICAgdmFyICRncm91cCxcbiAgICAgIGRhdGEgPSB7fSxcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXTtcblxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xuICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXG4gICAgICAkZ3JvdXAuZmluZCgnLmlnLXZpZGVvLWpzJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcblxuICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XG4gICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpIDogJyc7XG5cbiAgICAgICAgaWYgKGlnLm9sZElFKSB7XG5cbiAgICAgICAgICBfaW5qZWN0SWZyYW1lKGRhdGEsICR2aWRlbyk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyB0aGF0IGFyZSB1c2VkIHdpdGggbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgICAgZGF0YS5vdmVybGF5ID0gJHZpZGVvLmRhdGEoJ292ZXJsYXknKVxuICAgICAgICAgICAgPyAkdmlkZW8uZGF0YSgnb3ZlcmxheScpXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xuICAgICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcbiAgICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoXG4gICAgICAgICAgICAndHJhbnNjcmlwdCcpIDogJyc7XG4gICAgICAgICAgZGF0YS5jdGFUZW1wbGF0ZSA9ICR2aWRlby5kYXRhKCdjdGFUZW1wbGF0ZScpID8gJHZpZGVvLmRhdGEoXG4gICAgICAgICAgICAnY3RhVGVtcGxhdGUnKSA6ICcnO1xuXG4gICAgICAgICAgLy8gU3RvcmUgSUQncyBmb3IgYWxsIHZpZGVvJ3Mgb24gdGhlIHBhZ2UgLSBpbiBjYXNlIHdlIHdhbnQgdG8gcnVuIGEgcG9zdC1sb2FkIHByb2Nlc3Mgb24gZWFjaFxuICAgICAgICAgIHZpZGVvSURzLnB1c2goZGF0YS5pZCk7XG5cbiAgICAgICAgICAvLyBMZXQncyByZXBsYWNlIHRoZSBpZy12aWRlby1qcyAnZGlyZWN0aXZlJyB3aXRoIHRoZSBuZWNlc3NhcnkgQnJpZ2h0Y292ZSBjb2RlXG4gICAgICAgICAgX2luamVjdFRlbXBsYXRlKGRhdGEsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIE9ubHkgaW5qZWN0IEJyaWdodGNvdmUgSlMgaWYgbW9kZXJuIGJyb3dzZXJcbiAgICAgIGlmICghaWcub2xkSUUpIHtcbiAgICAgICAgaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoZGF0YSwgaW5kZXgpIHtcbiAgICB2YXIgdHJhbnNjcmlwdFRleHQgPSB7ICdlbic6ICdUcmFuc2NyaXB0JywgJ2ZyJzogJ1RyYW5zY3JpcHRpb24nIH0sXG4gICAgICBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXIgJHtkYXRhLmlkfVwiPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPmA7XG5cbiAgICBpZiAoZGF0YS5jdGFUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLWN0YVwiPiR7ZGF0YS5jdGFUZW1wbGF0ZX08L3NwYW4+YDtcbiAgICB9XG4gICAgaWYgKGRhdGEub3ZlcmxheS5sZW5ndGggPiAwKSB7XG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLW92ZXJsYXlcIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJHtkYXRhLm92ZXJsYXl9Jyk7XCI+PC9zcGFuPmA7XG4gICAgfVxuICAgIGh0bWwgKz0gYDx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIzOTA2OTQyODYxMDAxXCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiIGNvbnRyb2xzICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PmA7XG4gICAgaWYgKGRhdGEudHJhbnNjcmlwdC5sZW5ndGggPiAwKSB7XG4gICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNjcmlwdFwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEudHJhbnNjcmlwdH1cIj4ke3RyYW5zY3JpcHRUZXh0W2lnLmxhbmddfTwvYT48L2Rpdj5gO1xuICAgIH1cbiAgICBodG1sICs9IGA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XG4gICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xuXG4gICAgaWYgKGRhdGEub3ZlcmxheSkge1xuICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJyMnICsgZGF0YS5pZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudmlkZW8tb3ZlcmxheScpLmhpZGUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9pbmplY3RJZnJhbWUoZGF0YSkge1xuICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPlxuICAgICAgPGlmcmFtZSBjbGFzcz1cInZpZGVvLWpzXCIgc3JjPScvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvMzkwNjk0Mjg2MTAwMS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lmh0bWw/dmlkZW9JZD0ke2RhdGEuaWR9J1xuICAgIGFsbG93ZnVsbHNjcmVlbiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPlxuICAgIDwvZGl2PlxuICAgIDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcbiAgICAkdmlkZW8gPSAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xuICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LzM5MDY5NDI4NjEwMDEvJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XG4gIH1cblxuICBmdW5jdGlvbiBfYnJpZ2h0Q292ZVJlYWR5KCkge1xuICAgIHZhciBwbGF5ZXI7XG4gICAgdmlkZW9JRHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gYXNzaWduIHRoaXMgcGxheWVyIHRvIGEgdmFyaWFibGVcbiAgICAgICAgcGxheWVyID0gdGhpcztcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XG4gICAgICAgIHBsYXllci5vbigncGxheScsIF9vblBsYXkpO1xuICAgICAgICAvLyBhc3NpZ24gYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGVuZGVkIGV2ZW50XG4gICAgICAgIHBsYXllci5vbignZW5kZWQnLCBfb25Db21wbGV0ZSk7XG4gICAgICAgIC8vIHB1c2ggdGhlIHBsYXllciB0byB0aGUgcGxheWVycyBhcnJheVxuICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX29uUGxheShlKSB7XG4gICAgLy8gQWRvYmUgQW5hbHl0aWNzXG4gICAgX3NhdGVsbGl0ZS50cmFjaygndmlkZW9fc3RhcnQnKTtcbiAgICAvLyBkZXRlcm1pbmUgd2hpY2ggcGxheWVyIHRoZSBldmVudCBpcyBjb21pbmcgZnJvbVxuICAgIHZhciBpZCA9IGUudGFyZ2V0LmlkO1xuICAgIC8vIGdvIHRocm91Z2ggcGxheWVyc1xuICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgICBpZiAocGxheWVyLmlkKCkgIT09IGlkKSB7XG4gICAgICAgIC8vIHBhdXNlIHRoZSBvdGhlciBwbGF5ZXIocylcbiAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vbkNvbXBsZXRlKGUpIHtcbiAgICAvLyBBZG9iZSBBbmFseXRpY3NcbiAgICBfc2F0ZWxsaXRlLnRyYWNrKCd2aWRlb19lbmQnKTtcbiAgICAkKCcuJyArIGUudGFyZ2V0LmlkKS5hZGRDbGFzcygnY29tcGxldGUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF92aWV3U3RhdHVzKCkge1xuICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xuICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgICAgaWYgKCEkKCcjJyArIHBsYXllci5pZCgpKS52aXNpYmxlKCkpIHtcbiAgICAgICAgICB2aWRlb2pzKHBsYXllci5pZCgpKS5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdCxcbiAgfTtcbn0pKCk7XG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQkKGRvY3VtZW50KS5vbignb3Blbi56Zi5yZXZlYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBfc2F0ZWxsaXRlLnRyYWNrKCdtb2RhbF9jbGljaycpO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0XG5cdH07XG59KSgpXG5cblxuIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxuXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcbiBmb3IgaW5zdGFuY2UpLlxuXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cbiAqL1xuXG4vLyBJbml0IFNhdGVsbGl0ZVxud2luZG93Ll9zYXRlbGxpdGUgPSB3aW5kb3cuX3NhdGVsbGl0ZSB8fCB7fTtcbndpbmRvdy5fc2F0ZWxsaXRlLnRyYWNrID0gd2luZG93Ll9zYXRlbGxpdGUudHJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuXG5pbXBvcnQgbmF2aWdhdGlvbiBmcm9tICcuL25hdmlnYXRpb24uanMnXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xuaW1wb3J0IHNodWZmbGVkQ2Fyb3VzZWwgZnJvbSAnLi9zaHVmZmxlZC1jYXJvdXNlbC5qcyc7XG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcbmltcG9ydCBtb2RhbCBmcm9tICcuL21vZGFsLmpzJztcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcbi8vIGltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcbi8vIGltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcblxuY29uc3QgYXBwID0gKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcblxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXG4gICAgaWYgKCQoJyNtYWluLW5hdmlnYXRpb24nKS5sZW5ndGgpIG5hdmlnYXRpb24uaW5pdCgpO1xuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSBtb3JlLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLWNhcm91c2VsJykubGVuZ3RoKSBjYXJvdXNlbC5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmxlbmd0aCkgc2h1ZmZsZWRDYXJvdXNlbC5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xuICAgIGlmICgkKCcuYWNjb3JkaW9uJykubGVuZ3RoKSBhY2NvcmRpb24uaW5pdCgpO1xuICAgIGlmICgkKCdbZGF0YS1vcGVuXScpLmxlbmd0aCkgbW9kYWwuaW5pdCgpO1xuXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcbiAgICAvLyBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcbiAgICAvLyBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcblxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XG4gICAgX2xhbmd1YWdlKCk7XG4gIH1cblxuICAvLyBMZXQncyB1c2UgYSBnbG9iYWwgdmFyaWFibGUgKGdsb2JhbCBhcyBpbiBhdmFpbGFibGUgdG8gYWxsIG91ciBjb21wb25lbnRzIC0gbm90IHRoZSB3aW5kb3cgb2JqZWN0ISlcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoaWcubGFuZyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfVxufSkoKTtcblxuLy8gQm9vdHN0cmFwIGFwcFxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICBhcHAuaW5pdCgpO1xufSk7XG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwib2xkSUUiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJzZXRUaW1lb3V0IiwiYm9keSIsIiQiLCJtZW51SWNvbiIsImNsb3NlQnV0dG9uIiwic2hvd0ZvckxhcmdlIiwic2VhcmNoSW5wdXQiLCJoYXNTdWJOYXYiLCJpbml0Iiwic2NvcGUiLCJjbGljayIsImUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZm9jdXMiLCJzblRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJoYXNDbGFzcyIsIm9uIiwiaWciLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJ3aWR0aCIsImNzcyIsImV2ZW50IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJyZXR1cm5WYWx1ZSIsImVyciIsIndhcm4iLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0IiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfZmlsdGVyRHJvcGRvd24iLCJoaWRlIiwiZmFkZUluIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiX21lc3NhZ2VzIiwiZXh0ZW5kIiwibWVzc2FnZXMiLCJmb3JtYXQiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiX2FkZFRyYWNraW5nSGFuZGxlcnMiLCJfc2F0ZWxsaXRlIiwidHJhY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlTG9jYWxTdG9yYWdlIiwidXBkYXRlZE9iaiIsImZvckVhY2giLCJpdGVtIiwiaSIsImtleXMiLCJtYXAiLCJrIiwicmVzZXRMb2NhbFN0b3JhZ2UiLCJ1bnNlZW4iLCJyYW5kQXJ0aWNsZXMiLCJrZXkiLCJuZXdPYmoiLCJwdXNoIiwic3BsaWNlIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdlbmVyYXRlVGVtcGxhdGUiLCJyYW5kb21BcnRpY2xlcyIsImh0bWwiLCJ0ZW1wbGF0ZURhdGEiLCJhcnRpY2xlIiwiTXVzdGFjaGUiLCJ0b19odG1sIiwiYnVpbGRDYXJvdXNlbCIsIm5vdCIsInNlY3Rpb25UaXRsZSIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCIkdmlkZW8iLCJzZXRJbnRlcnZhbCIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsInByZWxvYWRPcHRpb25zIiwicGxheWVyIiwiaWQiLCJkZXNjcmlwdGlvbiIsIm92ZXJsYXkiLCJhdXRvIiwicHJlbG9hZCIsInRyYW5zY3JpcHQiLCJjdGFUZW1wbGF0ZSIsIl9pbmplY3RUZW1wbGF0ZSIsInRyYW5zY3JpcHRUZXh0IiwicmVwbGFjZVdpdGgiLCJkb2N1bWVudCIsInNpYmxpbmdzIiwiX2luamVjdElmcmFtZSIsImluamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZWwiLCJyZWFkeSIsIl9vblBsYXkiLCJfb25Db21wbGV0ZSIsInRhcmdldCIsInBhdXNlIiwiX3ZpZXdTdGF0dXMiLCJzY3JvbGwiLCJ2aXNpYmxlIiwiYXBwIiwiZm91bmRhdGlvbiIsIm5hdmlnYXRpb24iLCJmb3JtcyIsIm1vcmUiLCJjYXJvdXNlbCIsInNodWZmbGVkQ2Fyb3VzZWwiLCJ2aWRlbyIsImFjY29yZGlvbiIsIm1vZGFsIiwiX2xhbmd1YWdlIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0E7OztBQUtBLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01BQ25CQyxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUE5QyxJQUFtREgsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBckcsRUFBd0c7V0FDL0YsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQOzs7QUFLQSxBQUFPLElBQUlDLFFBQVMsWUFBTTtNQUNwQixtQkFBbUJKLE1BQXZC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