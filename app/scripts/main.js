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

var track = function (dcrName) {
  window._satellite = window._satellite || {};
  window._satellite.track = window._satellite.track || function () {};
  _satellite.track(dcrName);
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
    $(document).on('click', ".slick-arrow", function () {
      track('carousel_scroll');
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
    track('video_end');
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
    track('video_end');
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
			track('modal_click');
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL21vZGFsLmpzIiwibW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcbiB1c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XG5cbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcbiAqL1xuXG4vLyB1cmwgcGF0aFxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG59KSgpXG5cbi8vIGxhbmd1YWdlXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci4nKSAhPT0gLTEgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gJ2ZyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufSkoKVxuXG4vLyBicm93c2VyIHdpZHRoXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcbn0pKClcblxuLy8gY2hlY2sgZm9yIElFIChwcmUgRWRnZSlcbmV4cG9ydCB2YXIgb2xkSUUgPSAoKCkgPT4ge1xuICBpZiAoXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KSgpXG5cbmV4cG9ydCB2YXIgdHJhY2sgPSAoKGRjck5hbWUpID0+IHtcbiAgd2luZG93Ll9zYXRlbGxpdGUgPSB3aW5kb3cuX3NhdGVsbGl0ZSB8fCB7fTtcbiAgd2luZG93Ll9zYXRlbGxpdGUudHJhY2sgPSB3aW5kb3cuX3NhdGVsbGl0ZS50cmFjayB8fCBmdW5jdGlvbigpe307XG4gIF9zYXRlbGxpdGUudHJhY2soZGNyTmFtZSk7XG59KSgpXG5cbi8vIGJhc2UgZXZlbnRFbWl0dGVyXG4vLyBleHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbmV4cG9ydCB2YXIgZGVib3VuY2UgPSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSA9PiB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfTtcbn07XG4iLCIvL0FueSBjb2RlIHRoYXQgaW52b2x2ZXMgdGhlIG1haW4gbmF2aWdhdGlvbiBnb2VzIGhlcmVcclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBcclxuXHRcdGJvZHkgPSAkKCdib2R5JyksXHJcblx0XHRtZW51SWNvbiA9ICQoJy5tZW51LWljb24nKSxcclxuXHRcdGNsb3NlQnV0dG9uID0gJCgnLmNsb3NlLWJ1dHRvbi1jaXJjbGUnKSxcclxuXHRcdHNob3dGb3JMYXJnZSA9ICQoJy5zaG93LWZvci1sYXJnZScpLFxyXG5cdFx0c2VhcmNoSW5wdXQgPSAkKCcjc2l0ZS1zZWFyY2gtcScpLFxyXG5cdFx0aGFzU3ViTmF2ID0gJCgnLmhhcy1zdWJuYXYnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG5cdFx0bWVudUljb24uY2xpY2soKGUpID0+IHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblx0XHR9KTtcdFxyXG5cclxuXHRcdGNsb3NlQnV0dG9uLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1x0XHJcblx0XHR9KTtcclxuXHJcblx0XHRzaG93Rm9yTGFyZ2UuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0c2VhcmNoSW5wdXQuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGhhc1N1Yk5hdi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRsZXQgc25UYXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcblx0XHRcdGlmKCBzblRhcmdldC5oYXNDbGFzcyhcImFjdGl2ZVwiKSApIHtcclxuXHRcdFx0XHQvL2RlYWN0aXZhdGVcclxuXHRcdFx0XHRzblRhcmdldC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly9hY3RpdmF0ZVxyXG5cdFx0XHRcdHNuVGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdFxyXG5cdH07XHJcbn0pKClcclxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXHJcbi8vIEF0IHNvbWUgcG9pbnQsIHdlIHNob3VsZCBjb25zaWRlciBzcGxpdHRpbmcgaXQgdXAgaW50byBiaXRlLXNpemVkIHBpZWNlcy4gRXg6IG1vcmUtbmF2LmpzLCBtb3JlLXNvY2lhbC5qc1xyXG4vLyBhbmQgc28gb24uXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxyXG4gICAgX3Jlc2l6ZSgpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBpZy5kZWJvdW5jZShfbW9yZVNlY3Rpb25NZW51SXRlbSwgNTAwLCB0cnVlKSk7XHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcclxuXHJcbiAgICAvLyBDbG9zZSBidXR0b25cclxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xyXG5cclxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcclxuICB9XHJcblxyXG4gIC8vIEVuZCBvZiBJbml0XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDw9IDM3NSkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9yZVNlY3Rpb25NZW51SXRlbShldmVudCkge1xyXG5cclxuICAgIGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1pbi13aWR0aDogNjQwcHgpXCIpLm1hdGNoZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICAvL0lFIGZpeFxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgIH0gY2F0Y2goZXJyKSB7IGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpfVxyXG5cclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcclxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICBjZW50ZXJYID0gb2Zmc2V0LmxlZnQgKyB3aWR0aCAvIDIgLSA1MCxcclxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcclxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xyXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcclxuXHJcbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXHJcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxyXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcuJyArIGNsYXNzTmFtZVswXSkuZmFkZUluKCdzbG93JykuZm9jdXMoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xyXG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxyXG4gICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xyXG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XHJcblxyXG4gICAgaWYgKGpzU29jaWFsRHJhd2VyLmhhc0NsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJykpIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLmFkZENsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKTtcclxuICAgIF9tZXNzYWdlcygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21lc3NhZ2VzKCkge1xyXG4gICAgaWYgKGlnLmxhbmcgPT09IFwiZnJcIikge1xyXG4gICAgICAkLmV4dGVuZCggJC52YWxpZGF0b3IubWVzc2FnZXMsIHtcclxuICAgICAgICByZXF1aXJlZDogXCJDZSBjaGFtcCBlc3Qgb2JsaWdhdG9pcmUuXCIsXHJcbiAgICAgICAgcmVtb3RlOiBcIlZldWlsbGV6IGNvcnJpZ2VyIGNlIGNoYW1wLlwiLFxyXG4gICAgICAgIGVtYWlsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2Ugw6lsZWN0cm9uaXF1ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdXJsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBkYXRlOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIGRhdGVJU086IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUgKElTTykuXCIsXHJcbiAgICAgICAgbnVtYmVyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGlnaXRzOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBjaGlmZnJlcy5cIixcclxuICAgICAgICBjcmVkaXRjYXJkOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcclxuICAgICAgICBlcXVhbFRvOiBcIlZldWlsbGV6IGZvdXJuaXIgZW5jb3JlIGxhIG3Dqm1lIHZhbGV1ci5cIixcclxuICAgICAgICBleHRlbnNpb246IFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGF2ZWMgdW5lIGV4dGVuc2lvbiB2YWxpZGUuXCIsXHJcbiAgICAgICAgbWF4bGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgcmFuZ2VsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgcXVpIGNvbnRpZW50IGVudHJlIHswfSBldCB7MX0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICByYW5nZTogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBlbnRyZSB7MH0gZXQgezF9LlwiICksXHJcbiAgICAgICAgbWF4OiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGluZsOpcmlldXJlIG91IMOpZ2FsZSDDoCB7MH0uXCIgKSxcclxuICAgICAgICBtaW46ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgc3Vww6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxyXG4gICAgICAgIHN0ZXA6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgbXVsdGlwbGUgZGUgezB9LlwiICksXHJcbiAgICAgICAgbWF4V29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IHBsdXMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICBtaW5Xb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICByYW5nZVdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBlbnRyZSB7MH0gZXQgezF9IG1vdHMuXCIgKSxcclxuICAgICAgICBsZXR0ZXJzd2l0aGJhc2ljcHVuYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcyBldCBkZXMgc2lnbmVzIGRlIHBvbmN0dWF0aW9uLlwiLFxyXG4gICAgICAgIGFscGhhbnVtZXJpYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcywgbm9tYnJlcywgZXNwYWNlcyBldCBzb3VsaWduYWdlcy5cIixcclxuICAgICAgICBsZXR0ZXJzb25seTogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcy5cIixcclxuICAgICAgICBub3doaXRlc3BhY2U6IFwiVmV1aWxsZXogbmUgcGFzIGluc2NyaXJlIGQnZXNwYWNlcyBibGFuY3MuXCIsXHJcbiAgICAgICAgemlwcmFuZ2U6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCBlbnRyZSA5MDJ4eC14eHh4IGV0IDkwNS14eC14eHh4LlwiLFxyXG4gICAgICAgIGludGVnZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBub21icmUgbm9uIGTDqWNpbWFsIHF1aSBlc3QgcG9zaXRpZiBvdSBuw6lnYXRpZi5cIixcclxuICAgICAgICB2aW5VUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZCdpZGVudGlmaWNhdGlvbiBkdSB2w6loaWN1bGUgKFZJTikuXCIsXHJcbiAgICAgICAgZGF0ZUlUQTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZS5cIixcclxuICAgICAgICB0aW1lOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGhldXJlIHZhbGlkZSBlbnRyZSAwMDowMCBldCAyMzo1OS5cIixcclxuICAgICAgICBwaG9uZVVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgcGhvbmVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxyXG4gICAgICAgIG1vYmlsZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSBtb2JpbGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHN0cmlwcGVkbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICBlbWFpbDI6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSDDqWxlY3Ryb25pcXVlIHZhbGlkZS5cIixcclxuICAgICAgICB1cmwyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBjcmVkaXRjYXJkdHlwZXM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIGNhcnRlIGRlIGNyw6lkaXQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGlwdjQ6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NCB2YWxpZGUuXCIsXHJcbiAgICAgICAgaXB2NjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY2IHZhbGlkZS5cIixcclxuICAgICAgICByZXF1aXJlX2Zyb21fZ3JvdXA6IFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gZGUgY2VzIGNoYW1wcy5cIixcclxuICAgICAgICBuaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklGIHZhbGlkZS5cIixcclxuICAgICAgICBuaWVFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklFIHZhbGlkZS5cIixcclxuICAgICAgICBjaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gQ0lGIHZhbGlkZS5cIixcclxuICAgICAgICBwb3N0YWxDb2RlQ0E6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCB2YWxpZGUuXCJcclxuICAgICAgfSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcbiAgICBfYWRkVHJhY2tpbmdIYW5kbGVycygpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgdmFyIHByZXZBcnJvdyxcbiAgICAgIG5leHRBcnJvdyxcbiAgICAgICRjYXJvdXNlbDtcblxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfYWRkVHJhY2tpbmdIYW5kbGVycygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBcIi5zbGljay1hcnJvd1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZy50cmFjaygnY2Fyb3VzZWxfc2Nyb2xsJyk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKClcbiIsIi8qKlxyXG4gKiBTaHVmZmxlZCBDYXJvdXNlbFxyXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cclxuICpcclxuICogVXBvbiByZWZyZXNoIG9mIHRoZSBicm93c2VyLCB0aGUgZmlyc3QgdHdvIGl0ZW1zIGFyZSBhZGRlZCB0byB0aGUgc2Vlbkl0ZW1zIG9iamVjdFxyXG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcclxuICogaXMgY2xlYXJlZCBhbmQgdGhlIGNhcm91c2VsIHJlc2V0LlxyXG4gKlxyXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XHJcbiAqIEBwYXJhbSBkYXRhLWFydGljbGVzID0gVGhlIGtleSBvZiB0aGUgZGF0YSBpbiB0aGUganNvbiBvYmplY3RcclxuICogQHJldHVybiBkYXRhLWxpbWl0ID0gVGhlIGFtb3VudCBvZiBpdGVtcyB0byBiZSByZW5kZXJlZCBpbiB0aGUgY2Fyb3VzZWxcclxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgaWdscyA9IGdldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgIGF2YWlsYWJsZUl0ZW1zID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnYXJ0aWNsZXMnKS5hcnRpY2xlcztcclxuICAgICAgICBkYXRhS2V5ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbmFtZScpO1xyXG4gICAgICAgIGFydGljbGVMaW1pdCA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2xpbWl0Jyk7XHJcblxyXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xyXG4gICAgICAgICAgICAvL29iamVjdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0gaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGUoZ2V0UmFuZEFydGljbGVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBpZiAodHlwZW9mKFN0b3JhZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2xvY2Fsc3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlIScpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSUdMUygpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KHt9KSk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XHJcbiAgICAgICAgdmFyIHVwZGF0ZWRPYmogPSBPYmplY3QuYXNzaWduKHt9LCBzZWVuSXRlbXMpO1xyXG4gICAgICAgIGFydGljbGVzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkubWFwKChrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZE9ialtrXSA9IGl0ZW1ba107XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBkZWxldGUgaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIHVuc2VlbiA9IFtdLFxyXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7ICAgXHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGF2YWlsYWJsZUl0ZW1zKS5mb3JFYWNoKChrZXksIGkpID0+IHtcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xyXG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IGF2YWlsYWJsZUl0ZW1zW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICB1bnNlZW4ucHVzaChuZXdPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJhbmRBcnRpY2xlcyA9IHVuc2Vlbi5zcGxpY2UoMCwgYXJ0aWNsZUxpbWl0KTtcclxuXHJcbiAgICAgICAgaWYgKHJhbmRBcnRpY2xlcy5sZW5ndGggPCBhcnRpY2xlTGltaXQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVzcyB0aGFuICcgKyBhcnRpY2xlTGltaXQgKyAnIGl0ZW1zIGxlZnQgdG8gdmlldywgZW1wdHlpbmcgc2Vlbkl0ZW1zIGFuZCByZXN0YXJ0aW5nLicpO1xyXG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcclxuICAgICAgICAgICAgLy9jbGVhciBzZWVuSXRlbXMsIHJlc2V0IGxzLCBhbmQgcmVpbml0XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNodWZmbGUocmFuZEFydGljbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUocmFuZG9tQXJ0aWNsZXMpIHtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGh0bWwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZighcmFuZG9tQXJ0aWNsZXMpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHJhbmRvbUFydGljbGVzLmZvckVhY2goKGFydGljbGUpID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJ0aWNsZSkubWFwKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS5wdXNoKGFydGljbGVba2V5XSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBodG1sID0gTXVzdGFjaGUudG9faHRtbCgkKGAjJHtkYXRhS2V5fWApLmh0bWwoKSwgeyBcImFydGljbGVzXCI6IHRlbXBsYXRlRGF0YSB9KTtcclxuXHJcbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgdXBkYXRlTG9jYWxTdG9yYWdlKHJhbmRvbUFydGljbGVzKTtcclxuXHJcbiAgICAgICAgYnVpbGRDYXJvdXNlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICAgICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgICAgICAgbmV4dEFycm93LFxyXG4gICAgICAgICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgICAgICQoJy5pZy1jYXJvdXNlbCcpLm5vdCgnLnNsaWNrLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkoKVxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuXHRsZXQgc2VjdGlvblRpdGxlID0gJCgnLmFjY29yZGlvbi1tZW51LXNlY3Rpb24tdGl0bGUnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdHNlY3Rpb25UaXRsZS5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdC8vSUUgZml4XHJcblx0XHRcdFx0ZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHR9IGNhdGNoKGVycikgeyBjb25zb2xlLndhcm4oJ2V2ZW50LnJldHVyblZhbHVlIG5vdCBhdmFpbGFibGUnKX1cclxuXHRcdFx0XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXRcclxuXHR9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIHZhciB2aWRlb0lEcyA9IFtdLFxuICAgIHBsYXllcnMgPSBbXSxcbiAgICBicmlnaHRDb3ZlLFxuICAgICR2aWRlbztcblxuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgX3BhcnNlVmlkZW9zKCk7XG5cbiAgICBpZiAoIWlnLm9sZElFKSB7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXG4gICAgICBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XG4gICAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCk7XG5cbiAgICAgIC8vIEZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB2aWRlbydzIGhhdmUgc2Nyb2xsZWQgb2ZmIHNjcmVlbiBhbmQgbmVlZCB0byBiZSBwYXVzZWRcbiAgICAgIF92aWV3U3RhdHVzKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xuICAgIHZhciAkZ3JvdXAsXG4gICAgICBkYXRhID0ge30sXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ107XG5cbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxuICAgICQoJy5pZy12aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJGdyb3VwID0gJCh0aGlzKTtcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggdmlkZW8nc1xuICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICR2aWRlbyA9ICQodGhpcyk7XG5cbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xuICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xuXG4gICAgICAgIGlmIChpZy5vbGRJRSkge1xuXG4gICAgICAgICAgX2luamVjdElmcmFtZShkYXRhLCAkdmlkZW8pO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgdGhhdCBhcmUgdXNlZCB3aXRoIG1vZGVybiBicm93c2Vyc1xuICAgICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JylcbiAgICAgICAgICAgID8gJHZpZGVvLmRhdGEoJ292ZXJsYXknKVxuICAgICAgICAgICAgOiAnJztcbiAgICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcbiAgICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XG4gICAgICAgICAgZGF0YS50cmFuc2NyaXB0ID0gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA/ICR2aWRlby5kYXRhKFxuICAgICAgICAgICAgJ3RyYW5zY3JpcHQnKSA6ICcnO1xuICAgICAgICAgIGRhdGEuY3RhVGVtcGxhdGUgPSAkdmlkZW8uZGF0YSgnY3RhVGVtcGxhdGUnKSA/ICR2aWRlby5kYXRhKFxuICAgICAgICAgICAgJ2N0YVRlbXBsYXRlJykgOiAnJztcblxuICAgICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcbiAgICAgICAgICB2aWRlb0lEcy5wdXNoKGRhdGEuaWQpO1xuXG4gICAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxuICAgICAgICAgIF9pbmplY3RUZW1wbGF0ZShkYXRhLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBPbmx5IGluamVjdCBCcmlnaHRjb3ZlIEpTIGlmIG1vZGVybiBicm93c2VyXG4gICAgICBpZiAoIWlnLm9sZElFKSB7XG4gICAgICAgIGluamVjdEJyaWdodENvdmVKUyhkYXRhKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG5cbiAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKGRhdGEsIGluZGV4KSB7XG4gICAgdmFyIHRyYW5zY3JpcHRUZXh0ID0geyAnZW4nOiAnVHJhbnNjcmlwdCcsICdmcic6ICdUcmFuc2NyaXB0aW9uJyB9LFxuICAgICAgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyICR7ZGF0YS5pZH1cIj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5gO1xuXG4gICAgaWYgKGRhdGEuY3RhVGVtcGxhdGUubGVuZ3RoID4gMCkge1xuICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1jdGFcIj4ke2RhdGEuY3RhVGVtcGxhdGV9PC9zcGFuPmA7XG4gICAgfVxuICAgIGlmIChkYXRhLm92ZXJsYXkubGVuZ3RoID4gMCkge1xuICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyR7ZGF0YS5vdmVybGF5fScpO1wiPjwvc3Bhbj5gO1xuICAgIH1cbiAgICBodG1sICs9IGA8dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiMzkwNjk0Mjg2MTAwMVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiBjb250cm9scyAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gO1xuICAgIGlmIChkYXRhLnRyYW5zY3JpcHQubGVuZ3RoID4gMCkge1xuICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInZpZGVvLXRyYW5zY3JpcHRcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnRyYW5zY3JpcHR9XCI+JHt0cmFuc2NyaXB0VGV4dFtpZy5sYW5nXX08L2E+PC9kaXY+YDtcbiAgICB9XG4gICAgaHRtbCArPSBgPC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xuICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcblxuICAgIGlmIChkYXRhLm92ZXJsYXkpIHtcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcjJyArIGRhdGEuaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnZpZGVvLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfaW5qZWN0SWZyYW1lKGRhdGEpIHtcbiAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5cbiAgICAgIDxpZnJhbWUgY2xhc3M9XCJ2aWRlby1qc1wiIHNyYz0nLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LzM5MDY5NDI4NjEwMDEvJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5odG1sP3ZpZGVvSWQ9JHtkYXRhLmlkfSdcbiAgICBhbGxvd2Z1bGxzY3JlZW4gd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cbiAgICA8L2Rpdj5cbiAgICA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XG4gICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8zOTA2OTQyODYxMDAxLyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcbiAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4anMpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcbiAgICB2YXIgcGxheWVyO1xuICAgIHZpZGVvSURzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGFzc2lnbiB0aGlzIHBsYXllciB0byBhIHZhcmlhYmxlXG4gICAgICAgIHBsYXllciA9IHRoaXM7XG4gICAgICAgIC8vIGFzc2lnbiBhbiBldmVudCBsaXN0ZW5lciBmb3IgcGxheSBldmVudFxuICAgICAgICBwbGF5ZXIub24oJ3BsYXknLCBfb25QbGF5KTtcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBlbmRlZCBldmVudFxuICAgICAgICBwbGF5ZXIub24oJ2VuZGVkJywgX29uQ29tcGxldGUpO1xuICAgICAgICAvLyBwdXNoIHRoZSBwbGF5ZXIgdG8gdGhlIHBsYXllcnMgYXJyYXlcbiAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vblBsYXkoZSkge1xuICAgIC8vIEFkb2JlIEFuYWx5dGljc1xuICAgIGlnLnRyYWNrKCd2aWRlb19lbmQnKTtcbiAgICAvLyBkZXRlcm1pbmUgd2hpY2ggcGxheWVyIHRoZSBldmVudCBpcyBjb21pbmcgZnJvbVxuICAgIHZhciBpZCA9IGUudGFyZ2V0LmlkO1xuICAgIC8vIGdvIHRocm91Z2ggcGxheWVyc1xuICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgICBpZiAocGxheWVyLmlkKCkgIT09IGlkKSB7XG4gICAgICAgIC8vIHBhdXNlIHRoZSBvdGhlciBwbGF5ZXIocylcbiAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vbkNvbXBsZXRlKGUpIHtcbiAgICAvLyBBZG9iZSBBbmFseXRpY3NcbiAgICBpZy50cmFjaygndmlkZW9fZW5kJyk7XG4gICAgJCgnLicgKyBlLnRhcmdldC5pZCkuYWRkQ2xhc3MoJ2NvbXBsZXRlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfdmlld1N0YXR1cygpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgICAgIGlmICghJCgnIycgKyBwbGF5ZXIuaWQoKSkudmlzaWJsZSgpKSB7XG4gICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQsXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ29wZW4uemYucmV2ZWFsJywgZnVuY3Rpb24gKCkge1xuXHRcdCAgaWcudHJhY2soJ21vZGFsX2NsaWNrJyk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXRcblx0fTtcbn0pKClcblxuXG4iLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXG5cbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxuIGZvciBpbnN0YW5jZSkuXG5cbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxuICovXG5cbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vbmF2aWdhdGlvbi5qcydcbmltcG9ydCBtb3JlIGZyb20gJy4vbW9yZS5qcyc7XG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XG5pbXBvcnQgc2h1ZmZsZWRDYXJvdXNlbCBmcm9tICcuL3NodWZmbGVkLWNhcm91c2VsLmpzJztcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xuaW1wb3J0IG1vZGFsIGZyb20gJy4vbW9kYWwuanMnO1xuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xuLy8gaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xuLy8gaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xuXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcbiAgICBpZiAoJCgnI21haW4tbmF2aWdhdGlvbicpLmxlbmd0aCkgbmF2aWdhdGlvbi5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykubGVuZ3RoKSBzaHVmZmxlZENhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XG4gICAgaWYgKCQoJy5hY2NvcmRpb24nKS5sZW5ndGgpIGFjY29yZGlvbi5pbml0KCk7XG4gICAgaWYgKCQoJ1tkYXRhLW9wZW5dJykubGVuZ3RoKSBtb2RhbC5pbml0KCk7XG5cbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxuICAgIC8vIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xuICAgIC8vIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xuXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcbiAgICBfbGFuZ3VhZ2UoKTtcbiAgfVxuXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9XG59KSgpO1xuXG4vLyBCb290c3RyYXAgYXBwXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIGFwcC5pbml0KCk7XG59KTtcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJvbGRJRSIsInRyYWNrIiwiZGNyTmFtZSIsIl9zYXRlbGxpdGUiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJzZXRUaW1lb3V0IiwiYm9keSIsIiQiLCJtZW51SWNvbiIsImNsb3NlQnV0dG9uIiwic2hvd0ZvckxhcmdlIiwic2VhcmNoSW5wdXQiLCJoYXNTdWJOYXYiLCJpbml0Iiwic2NvcGUiLCJjbGljayIsImUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZm9jdXMiLCJzblRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJoYXNDbGFzcyIsIm9uIiwiaWciLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJ3aWR0aCIsImNzcyIsImV2ZW50IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJyZXR1cm5WYWx1ZSIsImVyciIsIndhcm4iLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0IiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfZmlsdGVyRHJvcGRvd24iLCJoaWRlIiwiZmFkZUluIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiX21lc3NhZ2VzIiwiZXh0ZW5kIiwibWVzc2FnZXMiLCJmb3JtYXQiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiX2FkZFRyYWNraW5nSGFuZGxlcnMiLCJkb2N1bWVudCIsImF2YWlsYWJsZUl0ZW1zIiwic2Vlbkl0ZW1zIiwiaWdscyIsImRhdGFLZXkiLCJhcnRpY2xlTGltaXQiLCJnZXRMb2NhbFN0b3JhZ2UiLCJhcnRpY2xlcyIsImdldFJhbmRBcnRpY2xlcyIsIlN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlSUdMUyIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ1cGRhdGVMb2NhbFN0b3JhZ2UiLCJ1cGRhdGVkT2JqIiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwia2V5cyIsIm1hcCIsImsiLCJyZXNldExvY2FsU3RvcmFnZSIsInVuc2VlbiIsInJhbmRBcnRpY2xlcyIsImtleSIsIm5ld09iaiIsInB1c2giLCJzcGxpY2UiLCJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2VuZXJhdGVUZW1wbGF0ZSIsInJhbmRvbUFydGljbGVzIiwiaHRtbCIsInRlbXBsYXRlRGF0YSIsImFydGljbGUiLCJNdXN0YWNoZSIsInRvX2h0bWwiLCJidWlsZENhcm91c2VsIiwibm90Iiwic2VjdGlvblRpdGxlIiwidmlkZW9JRHMiLCJwbGF5ZXJzIiwiYnJpZ2h0Q292ZSIsIiR2aWRlbyIsInNldEludGVydmFsIiwiX3BhcnNlVmlkZW9zIiwiJGdyb3VwIiwicHJlbG9hZE9wdGlvbnMiLCJwbGF5ZXIiLCJpZCIsImRlc2NyaXB0aW9uIiwib3ZlcmxheSIsImF1dG8iLCJwcmVsb2FkIiwidHJhbnNjcmlwdCIsImN0YVRlbXBsYXRlIiwiX2luamVjdFRlbXBsYXRlIiwidHJhbnNjcmlwdFRleHQiLCJyZXBsYWNlV2l0aCIsInNpYmxpbmdzIiwiX2luamVjdElmcmFtZSIsImluamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZWwiLCJyZWFkeSIsIl9vblBsYXkiLCJfb25Db21wbGV0ZSIsInRhcmdldCIsInBhdXNlIiwiX3ZpZXdTdGF0dXMiLCJzY3JvbGwiLCJ2aXNpYmxlIiwiYXBwIiwiZm91bmRhdGlvbiIsIm5hdmlnYXRpb24iLCJmb3JtcyIsIm1vcmUiLCJjYXJvdXNlbCIsInNodWZmbGVkQ2Fyb3VzZWwiLCJ2aWRlbyIsImFjY29yZGlvbiIsIm1vZGFsIiwiX2xhbmd1YWdlIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0E7OztBQUtBLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01BQ25CQyxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUE5QyxJQUFtREgsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBckcsRUFBd0c7V0FDL0YsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQOzs7QUFLQSxBQUFPLElBQUlDLFFBQVMsWUFBTTtNQUNwQixtQkFBbUJKLE1BQXZCLEVBQStCO1dBQ3RCLElBQVA7R0FERixNQUVPO1dBQ0UsS0FBUDs7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