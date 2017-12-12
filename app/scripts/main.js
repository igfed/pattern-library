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

	var body = $('.off-canvas-content'),
	    searchInput = $('#site-search-q'),
	    searchForm = $('#site-search'),
	    hasSubNav = $('.has-subnav'),
	    inSectionNavToggle = $('.in-section-nav-toggle button'),
	    inSectionNav = $('.in-section-nav-toggle');

	function init(scope) {

		searchInput.focus(function () {
			body.addClass('site-nav-search-form-is-active');
		});
		searchInput.blur(function () {
			body.removeClass('site-nav-search-form-is-active');
		});

		inSectionNavToggle.click(function (e) {
			inSectionNav.toggleClass('is-active');
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

        // Capture required options
        data.id = $video.data('id');

        // Capture options that are optional
        data.overlay = $video.data('overlay') ? $video.data('overlay') : '';
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data('description') : '';
        data.auto = $video.data('autoplay') ? 'autoplay' : '';
        data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';
        data.transcript = $video.data('transcript') ? $video.data('transcript') : '';
        data.ctaTemplate = $video.data('ctaTemplate') ? $video.data('ctaTemplate') : '';

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
    var transcriptText = { 'en': 'Transcript', 'fr': 'Transcription' },
        html = '<div class="video-container ' + data.id + '"><div class="video-container-responsive">';

    if (data.ctaTemplate.length > 0) {
      html += '<span class="video-cta">' + data.ctaTemplate + '</span>';
    }
    if (data.overlay.length > 0) {
      html += '<span class="video-overlay" style="background-image: url(\'' + data.overlay + '\');"></span>';
    }
    html += '<video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" controls ' + data.auto + '></video></div>';
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
        // assign an event listener for ended event
        player.on('ended', _onComplete);
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

  function _onComplete(e) {
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
    if ($('.site-nav').length) navigation.init();
    if ($('.ig-form').length) forms.init();
    if ($('.more-section').length) more.init();
    if ($('.ig-carousel').length) carousel.init();
    if ($('.ig-shuffled-carousel').length) shuffledCarousel.init();
    if ($('.ig-video-group').length) video.init();
    if ($('.accordion').length) accordion.init();

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9mYWdhbmQxL0Rlc2t0b3AvcHJvamVjdHMvcGF0dGVybi1saWJyYXJ5L2FwcC9zY3JpcHRzL21vZHVsZXMvZ2xvYmFsLmpzIiwiL1VzZXJzL2ZhZ2FuZDEvRGVza3RvcC9wcm9qZWN0cy9wYXR0ZXJuLWxpYnJhcnkvYXBwL3NjcmlwdHMvbW9kdWxlcy9uYXZpZ2F0aW9uLmpzIiwiL1VzZXJzL2ZhZ2FuZDEvRGVza3RvcC9wcm9qZWN0cy9wYXR0ZXJuLWxpYnJhcnkvYXBwL3NjcmlwdHMvbW9kdWxlcy9tb3JlLmpzIiwiL1VzZXJzL2ZhZ2FuZDEvRGVza3RvcC9wcm9qZWN0cy9wYXR0ZXJuLWxpYnJhcnkvYXBwL3NjcmlwdHMvbW9kdWxlcy9mb3Jtcy5qcyIsIi9Vc2Vycy9mYWdhbmQxL0Rlc2t0b3AvcHJvamVjdHMvcGF0dGVybi1saWJyYXJ5L2FwcC9zY3JpcHRzL21vZHVsZXMvY2Fyb3VzZWwuanMiLCIvVXNlcnMvZmFnYW5kMS9EZXNrdG9wL3Byb2plY3RzL3BhdHRlcm4tbGlicmFyeS9hcHAvc2NyaXB0cy9tb2R1bGVzL3NodWZmbGVkLWNhcm91c2VsLmpzIiwiL1VzZXJzL2ZhZ2FuZDEvRGVza3RvcC9wcm9qZWN0cy9wYXR0ZXJuLWxpYnJhcnkvYXBwL3NjcmlwdHMvbW9kdWxlcy9hY2NvcmRpb24uanMiLCIvVXNlcnMvZmFnYW5kMS9EZXNrdG9wL3Byb2plY3RzL3BhdHRlcm4tbGlicmFyeS9hcHAvc2NyaXB0cy9tb2R1bGVzL3ZpZGVvLmpzIiwiL1VzZXJzL2ZhZ2FuZDEvRGVza3RvcC9wcm9qZWN0cy9wYXR0ZXJuLWxpYnJhcnkvYXBwL3NjcmlwdHMvbW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcblxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxuICovXG5cbi8vIHVybCBwYXRoXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbn0pKClcblxuLy8gbGFuZ3VhZ2VcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLicpICE9PSAtMSB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xuICAgIHJldHVybiAnZnInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnZW4nO1xuICB9XG59KSgpXG5cbi8vIGJyb3dzZXIgd2lkdGhcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xufSkoKVxuXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxuLy8gZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5leHBvcnQgdmFyIGRlYm91bmNlID0gKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkgPT4ge1xuXHR2YXIgdGltZW91dDtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9O1xufTsiLCIvL0FueSBjb2RlIHRoYXQgaW52b2x2ZXMgdGhlIG1haW4gbmF2aWdhdGlvbiBnb2VzIGhlcmVcblxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG5cdGxldCBib2R5ID0gJCgnLm9mZi1jYW52YXMtY29udGVudCcpLFxuXHRcdHNlYXJjaElucHV0ID0gJCgnI3NpdGUtc2VhcmNoLXEnKSxcblx0XHRzZWFyY2hGb3JtID0gJCgnI3NpdGUtc2VhcmNoJyksXG5cdFx0aGFzU3ViTmF2ID0gJCgnLmhhcy1zdWJuYXYnKSxcblx0XHRpblNlY3Rpb25OYXZUb2dnbGUgPSAkKCcuaW4tc2VjdGlvbi1uYXYtdG9nZ2xlIGJ1dHRvbicpLFxuXHRcdGluU2VjdGlvbk5hdiA9ICQoJy5pbi1zZWN0aW9uLW5hdi10b2dnbGUnKTtcblxuXHRmdW5jdGlvbiBpbml0KHNjb3BlKSB7XG5cblx0XHRzZWFyY2hJbnB1dC5mb2N1cygoKSA9PiB7XG5cdFx0XHRib2R5LmFkZENsYXNzKCdzaXRlLW5hdi1zZWFyY2gtZm9ybS1pcy1hY3RpdmUnKTtcblx0XHR9KTtcblx0XHRzZWFyY2hJbnB1dC5ibHVyKCgpID0+IHtcblx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ3NpdGUtbmF2LXNlYXJjaC1mb3JtLWlzLWFjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0aW5TZWN0aW9uTmF2VG9nZ2xlLmNsaWNrKChlKSA9PiB7XG5cdFx0XHRpblNlY3Rpb25OYXYudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0aGFzU3ViTmF2LmNsaWNrKChlKSA9PiB7XG5cdFx0XHRsZXQgc25UYXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRpZiggc25UYXJnZXQuaGFzQ2xhc3MoXCJhY3RpdmVcIikgKSB7XG5cdFx0XHRcdC8vZGVhY3RpdmF0ZVxuXHRcdFx0XHRzblRhcmdldC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL2FjdGl2YXRlXG5cdFx0XHRcdHNuVGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdFxuXHR9O1xufSkoKVxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXG4vLyBBdCBzb21lIHBvaW50LCB3ZSBzaG91bGQgY29uc2lkZXIgc3BsaXR0aW5nIGl0IHVwIGludG8gYml0ZS1zaXplZCBwaWVjZXMuIEV4OiBtb3JlLW5hdi5qcywgbW9yZS1zb2NpYWwuanNcbi8vIGFuZCBzbyBvbi5cblxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxuICAgIF9yZXNpemUoKTtcblxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXG5cbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBpZy5kZWJvdW5jZShfbW9yZVNlY3Rpb25NZW51SXRlbSwgNTAwLCB0cnVlKSk7XG5cbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcblxuICAgIC8vIENsb3NlIGJ1dHRvblxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xuXG4gICAgLy8gU29jaWFsIGRyYXdlclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcbiAgfVxuXG4gIC8vIEVuZCBvZiBJbml0XG5cbiAgZnVuY3Rpb24gX3Jlc2l6ZSgpIHtcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSAzNzUpIHtcbiAgICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb3JlU2VjdGlvbk1lbnVJdGVtKGV2ZW50KSB7XG5cbiAgICBpZih3aW5kb3cubWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDY0MHB4KVwiKS5tYXRjaGVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvL0lFIGZpeFxuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfSBjYXRjaChlcnIpIHsgY29uc29sZS53YXJuKCdldmVudC5yZXR1cm5WYWx1ZSBub3QgYXZhaWxhYmxlJyl9XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpLFxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXG4gICAgICBjbGFzc05hbWUgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC9bXFx3LV0qY2F0ZWdvcnlbXFx3LV0qL2cpLFxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XG5cbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XG5cbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IHRpdGxlIG9uIGNsaWNrXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcblxuICAgIC8vIEFycm93IHBvc2l0aW9uIG1vdmUgb24gY2xpY2tcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXG5cbiAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy4nICsgY2xhc3NOYW1lWzBdKS5mYWRlSW4oJ3Nsb3cnKS5mb2N1cygpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZU91dCgpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmFkZENsYXNzKCdhY3RpdmUnKS50ZXh0KHRpdGxlKTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfbW9iaWxlQ2F0ZWdvcnlNZW51KCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xuICAgIC8vIHRoaXMubmV4dCgpIHNlbGVjdHMgbmV4dCBzaWJsaW5nIGVsZW1lbnRcbiAgICAvLyBhbnkgc3VnZ2VzdGlvbnMgb24gYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/XG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XG5cbiAgICBpZiAoanNTb2NpYWxEcmF3ZXIuaGFzQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKSkge1xuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAganNTb2NpYWxEcmF3ZXIuYWRkQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgdmFyIGVuZHBvaW50VVJMLFxuICAgIHN1Y2Nlc3NVUkwsXG4gICAgY2FuY2VsVVJMLFxuICAgICRmb3JtLFxuICAgICRmb3JtV3JhcHBlcjtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcblxuICAgIF92YWxpZGF0aW9uKCk7XG4gICAgX3RvZ2dsZXIoKTtcbiAgICBfbWVzc2FnZXMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XG4gICAgfSk7XG5cbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XG4gICAgICBkZWJ1ZzogdHJ1ZSxcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcbiAgICB9KTtcblxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcblxuICAgICRmb3JtLnZhbGlkYXRlKHtcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3Byb2Nlc3MoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBlbGVtZW50KSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xuICAgICAgICAgICQoZWxlbWVudCkucGFyZW50KCkuYXBwZW5kKGxhYmVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJ1bGVzOiB7XG4gICAgICAgIHBob25lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwaG9uZTI6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGZpcnN0bmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGxhc3RuYW1lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBlbWFpbDI6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcbiAgICB9KTtcblxuICB9XG5cbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xuICAgIHZhciBmb3JtRGF0YVJhdyxcbiAgICAgIGZvcm1EYXRhUGFyc2VkO1xuXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdzZXJ2ZXItZXJyb3InKTtcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgICAgLy8gSWYgd2UgbmVlZCB0byBtb2RpZnkgdGhlIGRhdGEsIHVzZSBwYXJzZSBtZXRob2RcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXG4gICAgICBfc3VibWl0KGZvcm1EYXRhUGFyc2VkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcbiAgICAvLyBFeGVjdXRlIGFueSBjdXN0b20gbG9naWMgaGVyZVxuXG5cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gX3N1Ym1pdChkYXRhKSB7XG4gICAgJC5hamF4KHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiBlbmRwb2ludFVSTCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VjY2VzcycpO1xuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XG4gICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XG4gICAgICAgIFNjcm9sbE1hbi50bygkKCcjc2VydmVyLWVycm9yJykpO1xuICAgICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcbiAgICAkKCcudG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tZXNzYWdlcygpIHtcbiAgICBpZiAoaWcubGFuZyA9PT0gXCJmclwiKSB7XG4gICAgICAkLmV4dGVuZCggJC52YWxpZGF0b3IubWVzc2FnZXMsIHtcbiAgICAgICAgcmVxdWlyZWQ6IFwiQ2UgY2hhbXAgZXN0IG9ibGlnYXRvaXJlLlwiLFxuICAgICAgICByZW1vdGU6IFwiVmV1aWxsZXogY29ycmlnZXIgY2UgY2hhbXAuXCIsXG4gICAgICAgIGVtYWlsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2Ugw6lsZWN0cm9uaXF1ZSB2YWxpZGUuXCIsXG4gICAgICAgIHVybDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIFVSTCB2YWxpZGUuXCIsXG4gICAgICAgIGRhdGU6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUuXCIsXG4gICAgICAgIGRhdGVJU086IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUgKElTTykuXCIsXG4gICAgICAgIG51bWJlcjogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gdmFsaWRlLlwiLFxuICAgICAgICBkaWdpdHM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGNoaWZmcmVzLlwiLFxuICAgICAgICBjcmVkaXRjYXJkOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcbiAgICAgICAgZXF1YWxUbzogXCJWZXVpbGxleiBmb3VybmlyIGVuY29yZSBsYSBtw6ptZSB2YWxldXIuXCIsXG4gICAgICAgIGV4dGVuc2lvbjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgYXZlYyB1bmUgZXh0ZW5zaW9uIHZhbGlkZS5cIixcbiAgICAgICAgbWF4bGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBjYXJhY3TDqHJlcy5cIiApLFxuICAgICAgICBtaW5sZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBjYXJhY3TDqHJlcy5cIiApLFxuICAgICAgICByYW5nZWxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBxdWkgY29udGllbnQgZW50cmUgezB9IGV0IHsxfSBjYXJhY3TDqHJlcy5cIiApLFxuICAgICAgICByYW5nZTogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBlbnRyZSB7MH0gZXQgezF9LlwiICksXG4gICAgICAgIG1heDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBpbmbDqXJpZXVyZSBvdSDDqWdhbGUgw6AgezB9LlwiICksXG4gICAgICAgIG1pbjogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBzdXDDqXJpZXVyZSBvdSDDqWdhbGUgw6AgezB9LlwiICksXG4gICAgICAgIHN0ZXA6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgbXVsdGlwbGUgZGUgezB9LlwiICksXG4gICAgICAgIG1heFdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBtb3RzLlwiICksXG4gICAgICAgIG1pbldvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gbW90cy5cIiApLFxuICAgICAgICByYW5nZVdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBlbnRyZSB7MH0gZXQgezF9IG1vdHMuXCIgKSxcbiAgICAgICAgbGV0dGVyc3dpdGhiYXNpY3B1bmM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMgZXQgZGVzIHNpZ25lcyBkZSBwb25jdHVhdGlvbi5cIixcbiAgICAgICAgYWxwaGFudW1lcmljOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzLCBub21icmVzLCBlc3BhY2VzIGV0IHNvdWxpZ25hZ2VzLlwiLFxuICAgICAgICBsZXR0ZXJzb25seTogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcy5cIixcbiAgICAgICAgbm93aGl0ZXNwYWNlOiBcIlZldWlsbGV6IG5lIHBhcyBpbnNjcmlyZSBkJ2VzcGFjZXMgYmxhbmNzLlwiLFxuICAgICAgICB6aXByYW5nZTogXCJWZXVpbGxleiBmb3VybmlyIHVuIGNvZGUgcG9zdGFsIGVudHJlIDkwMnh4LXh4eHggZXQgOTA1LXh4LXh4eHguXCIsXG4gICAgICAgIGludGVnZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBub21icmUgbm9uIGTDqWNpbWFsIHF1aSBlc3QgcG9zaXRpZiBvdSBuw6lnYXRpZi5cIixcbiAgICAgICAgdmluVVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGQnaWRlbnRpZmljYXRpb24gZHUgdsOpaGljdWxlIChWSU4pLlwiLFxuICAgICAgICBkYXRlSVRBOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxuICAgICAgICB0aW1lOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGhldXJlIHZhbGlkZSBlbnRyZSAwMDowMCBldCAyMzo1OS5cIixcbiAgICAgICAgcGhvbmVVUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxuICAgICAgICBwaG9uZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUuXCIsXG4gICAgICAgIG1vYmlsZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSBtb2JpbGUgdmFsaWRlLlwiLFxuICAgICAgICBzdHJpcHBlZG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGNhcmFjdMOocmVzLlwiICksXG4gICAgICAgIGVtYWlsMjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIMOpbGVjdHJvbmlxdWUgdmFsaWRlLlwiLFxuICAgICAgICB1cmwyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcbiAgICAgICAgY3JlZGl0Y2FyZHR5cGVzOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcbiAgICAgICAgaXB2NDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY0IHZhbGlkZS5cIixcbiAgICAgICAgaXB2NjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY2IHZhbGlkZS5cIixcbiAgICAgICAgcmVxdWlyZV9mcm9tX2dyb3VwOiBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGRlIGNlcyBjaGFtcHMuXCIsXG4gICAgICAgIG5pZkVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBOSUYgdmFsaWRlLlwiLFxuICAgICAgICBuaWVFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklFIHZhbGlkZS5cIixcbiAgICAgICAgY2lmRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIENJRiB2YWxpZGUuXCIsXG4gICAgICAgIHBvc3RhbENvZGVDQTogXCJWZXVpbGxleiBmb3VybmlyIHVuIGNvZGUgcG9zdGFsIHZhbGlkZS5cIlxuICAgICAgfSApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxuICAgIF9idWlsZENhcm91c2VsKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfYnVpbGRDYXJvdXNlbCgpIHtcbiAgICB2YXIgcHJldkFycm93LFxuICAgICAgbmV4dEFycm93LFxuICAgICAgJGNhcm91c2VsO1xuXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XG4gICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xuXG4gICAgICAkY2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXG4gICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxuICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXG4gICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXG4gICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxuICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxuICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxuICAgICAgfSlcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsIi8qKlxuICogU2h1ZmZsZWQgQ2Fyb3VzZWxcbiAqIFRha2VzIGVpZ2h0IGl0ZW1zIGZyb20gYW4gb2JqZWN0IG9mIDIwLCBhbmQgcmVuZGVycyB0aGVtIGluIGEgY2Fyb3VzZWwgaW4gcmFuZG9tIG9yZGVyLlxuICpcbiAqIFVwb24gcmVmcmVzaCBvZiB0aGUgYnJvd3NlciwgdGhlIGZpcnN0IHR3byBpdGVtcyBhcmUgYWRkZWQgdG8gdGhlIHNlZW5JdGVtcyBvYmplY3RcbiAqIGFuZCB3cml0dGVuIHRvIGxvY2FsIHN0b3JhZ2UsIHdoZW4gdGhlIGFtb3VudCBvZiB1bnNlZW4gaXRlbXMgZHJvcHMgYmVsb3cgOCwgc2Vlbkl0ZW1zIFxuICogaXMgY2xlYXJlZCBhbmQgdGhlIGNhcm91c2VsIHJlc2V0LlxuICpcbiAqIFRoZXJlIGFyZSB0d28gY29uZmlndXJhYmxlIGRhdGEgYXR0cmlidXRlcyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgdG8gdGhlIG1hcmt1cDpcbiAqIEBwYXJhbSBkYXRhLWFydGljbGVzID0gVGhlIGtleSBvZiB0aGUgZGF0YSBpbiB0aGUganNvbiBvYmplY3RcbiAqIEByZXR1cm4gZGF0YS1saW1pdCA9IFRoZSBhbW91bnQgb2YgaXRlbXMgdG8gYmUgcmVuZGVyZWQgaW4gdGhlIGNhcm91c2VsXG4gKiBFeC4gPGRpdiBjbGFzcz1cImlnLXNodWZmbGVkLWNhcm91c2VsXCIgZGF0YS1hcnRpY2xlcz1cImFkdmljZS1zdG9yaWVzXCIgZGF0YS1saW1pdD1cIjhcIj48L2Rpdj5cbiAqL1xuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gICAgdmFyIGF2YWlsYWJsZUl0ZW1zLCBzZWVuSXRlbXMsIGlnbHMsIGRhdGFLZXksIGFydGljbGVMaW1pdDtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICAgICAgaWdscyA9IGdldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICBhdmFpbGFibGVJdGVtcyA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2FydGljbGVzJykuYXJ0aWNsZXM7XG4gICAgICAgIGRhdGFLZXkgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCduYW1lJyk7XG4gICAgICAgIGFydGljbGVMaW1pdCA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2xpbWl0Jyk7XG5cbiAgICAgICAgaWYgKCFpZ2xzW2RhdGFLZXldKSB7XG4gICAgICAgICAgICAvL29iamVjdCBkb2VzIG5vdCBleGlzdCB5ZXRcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Vlbkl0ZW1zID0gaWdsc1tkYXRhS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGUoZ2V0UmFuZEFydGljbGVzKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHR5cGVvZihTdG9yYWdlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikgPyBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpIDogY3JlYXRlSUdMUygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdsb2NhbHN0b3JhZ2UgaXMgbm90IGF2YWlsYWJsZSEnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSUdMUygpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbFN0b3JhZ2UoYXJ0aWNsZXMpIHtcbiAgICAgICAgdmFyIHVwZGF0ZWRPYmogPSBPYmplY3QuYXNzaWduKHt9LCBzZWVuSXRlbXMpO1xuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkubWFwKChrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRPYmpba10gPSBpdGVtW2tdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIGRlbGV0ZSBpZ2xzW2RhdGFLZXldO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgdW5zZWVuID0gW10sXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7ICAgXG5cbiAgICAgICAgT2JqZWN0LmtleXMoYXZhaWxhYmxlSXRlbXMpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBhdmFpbGFibGVJdGVtc1trZXldO1xuXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XG4gICAgICAgICAgICAgICAgdW5zZWVuLnB1c2gobmV3T2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmFuZEFydGljbGVzID0gdW5zZWVuLnNwbGljZSgwLCBhcnRpY2xlTGltaXQpO1xuXG4gICAgICAgIGlmIChyYW5kQXJ0aWNsZXMubGVuZ3RoIDwgYXJ0aWNsZUxpbWl0KSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdMZXNzIHRoYW4gJyArIGFydGljbGVMaW1pdCArICcgaXRlbXMgbGVmdCB0byB2aWV3LCBlbXB0eWluZyBzZWVuSXRlbXMgYW5kIHJlc3RhcnRpbmcuJyk7XG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcbiAgICAgICAgICAgIC8vY2xlYXIgc2Vlbkl0ZW1zLCByZXNldCBscywgYW5kIHJlaW5pdFxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBpbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2h1ZmZsZShyYW5kQXJ0aWNsZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgICAgICAgdmFyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XG5cbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xuXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVUZW1wbGF0ZShyYW5kb21BcnRpY2xlcykge1xuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgIHRlbXBsYXRlRGF0YSA9IFtdO1xuXG4gICAgICAgIGlmKCFyYW5kb21BcnRpY2xlcykgeyByZXR1cm47IH1cblxuICAgICAgICByYW5kb21BcnRpY2xlcy5mb3JFYWNoKChhcnRpY2xlKSA9PiB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcnRpY2xlKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS5wdXNoKGFydGljbGVba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwoJChgIyR7ZGF0YUtleX1gKS5odG1sKCksIHsgXCJhcnRpY2xlc1wiOiB0ZW1wbGF0ZURhdGEgfSk7XG5cbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcblxuICAgICAgICB1cGRhdGVMb2NhbFN0b3JhZ2UocmFuZG9tQXJ0aWNsZXMpO1xuXG4gICAgICAgIGJ1aWxkQ2Fyb3VzZWwoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWlsZENhcm91c2VsKCkge1xuICAgICAgICB2YXIgcHJldkFycm93LFxuICAgICAgICAgICAgbmV4dEFycm93LFxuICAgICAgICAgICAgJGNhcm91c2VsO1xuXG4gICAgICAgICQoJy5pZy1jYXJvdXNlbCcpLm5vdCgnLnNsaWNrLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuXG4gICAgICAgICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgICAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcbiAgICAgICAgICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0XG4gICAgfTtcbn0pKClcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuXHRsZXQgc2VjdGlvblRpdGxlID0gJCgnLmFjY29yZGlvbi1tZW51LXNlY3Rpb24tdGl0bGUnKTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHNlY3Rpb25UaXRsZS5jbGljaygoZSkgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Ly9JRSBmaXhcblx0XHRcdFx0ZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuXHRcdFx0fSBjYXRjaChlcnIpIHsgY29uc29sZS53YXJuKCdldmVudC5yZXR1cm5WYWx1ZSBub3QgYXZhaWxhYmxlJyl9XG5cdFx0XHRcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdFxuXHR9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICB2YXIgdmlkZW9JRHMgPSBbXSxcbiAgICBwbGF5ZXJzID0gW10sXG4gICAgYnJpZ2h0Q292ZTtcblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdG8gY2FwdHVyZSB0aGUgdmlkZW8gcGxheWVyIHNldHRpbmdzIGRlZmluZWQgaW4gdGhlIEhUTUwgYW5kIGNyZWF0ZSB0aGUgbWFya3VwIHRoYXQgQnJpZ2h0Y292ZSByZXF1aXJlc1xuICAgIF9wYXJzZVZpZGVvcygpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnNcbiAgICBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xuICAgICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcblxuICAgIC8vIEZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB2aWRlbydzIGhhdmUgc2Nyb2xsZWQgb2ZmIHNjcmVlbiBhbmQgbmVlZCB0byBiZSBwYXVzZWRcbiAgICBfdmlld1N0YXR1cygpO1xuXG4gIH1cblxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XG4gICAgdmFyICRncm91cCxcbiAgICAgICR2aWRlbyxcbiAgICAgIGRhdGEgPSB7fSxcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXTtcblxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xuICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xuXG4gICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIENhcHR1cmUgcmVxdWlyZWQgb3B0aW9uc1xuICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIHRoYXQgYXJlIG9wdGlvbmFsXG4gICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JylcbiAgICAgICAgICA/ICR2aWRlby5kYXRhKCdvdmVybGF5JylcbiAgICAgICAgICA6ICcnO1xuICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YShcbiAgICAgICAgICAnZGVzY3JpcHRpb24nKSA6ICcnO1xuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcbiAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xuICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoXG4gICAgICAgICAgJ3RyYW5zY3JpcHQnKSA6ICcnO1xuICAgICAgICBkYXRhLmN0YVRlbXBsYXRlID0gJHZpZGVvLmRhdGEoJ2N0YVRlbXBsYXRlJykgPyAkdmlkZW8uZGF0YShcbiAgICAgICAgICAnY3RhVGVtcGxhdGUnKSA6ICcnO1xuXG4gICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcbiAgICAgICAgdmlkZW9JRHMucHVzaChkYXRhLmlkKTtcblxuICAgICAgICAvLyBMZXQncyByZXBsYWNlIHRoZSBpZy12aWRlby1qcyAnZGlyZWN0aXZlJyB3aXRoIHRoZSBuZWNlc3NhcnkgQnJpZ2h0Y292ZSBjb2RlXG4gICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xuICAgIHZhciB0cmFuc2NyaXB0VGV4dCA9IHsgJ2VuJzogJ1RyYW5zY3JpcHQnLCAnZnInOiAnVHJhbnNjcmlwdGlvbicgfSxcbiAgICAgIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lciAke2RhdGEuaWR9XCI+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+YDtcblxuICAgIGlmIChkYXRhLmN0YVRlbXBsYXRlLmxlbmd0aCA+IDApIHtcbiAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tY3RhXCI+JHtkYXRhLmN0YVRlbXBsYXRlfTwvc3Bhbj5gO1xuICAgIH1cbiAgICBpZiAoZGF0YS5vdmVybGF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheVwiIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcke2RhdGEub3ZlcmxheX0nKTtcIj48L3NwYW4+YDtcbiAgICB9XG4gICAgaHRtbCArPSBgPHZpZGVvIGRhdGEtc2V0dXA9J3tcInRlY2hPcmRlclwiOiBbXCJodG1sNVwiXX0nIGRhdGEtdmlkZW8taWQ9XCIke2RhdGEuaWR9XCIgcHJlbG9hZD1cIiR7ZGF0YS5wcmVsb2FkfVwiIGRhdGEtYWNjb3VudD1cIiR7ZGF0YS5hY2NvdW50fVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiBjb250cm9scyAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gO1xuICAgIGlmIChkYXRhLnRyYW5zY3JpcHQubGVuZ3RoID4gMCkge1xuICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInZpZGVvLXRyYW5zY3JpcHRcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnRyYW5zY3JpcHR9XCI+JHt0cmFuc2NyaXB0VGV4dFtpZy5sYW5nXX08L2E+PC9kaXY+YDtcbiAgICB9XG4gICAgaHRtbCArPSBgPC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xuICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcblxuICAgIGlmIChkYXRhLm92ZXJsYXkpIHtcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcjJyArIGRhdGEuaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnZpZGVvLW92ZXJsYXknKS5oaWRlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfYnJpZ2h0Q292ZVJlYWR5KCkge1xuICAgIHZhciBwbGF5ZXI7XG4gICAgdmlkZW9JRHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gYXNzaWduIHRoaXMgcGxheWVyIHRvIGEgdmFyaWFibGVcbiAgICAgICAgcGxheWVyID0gdGhpcztcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XG4gICAgICAgIHBsYXllci5vbigncGxheScsIF9vblBsYXkpO1xuICAgICAgICAvLyBhc3NpZ24gYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGVuZGVkIGV2ZW50XG4gICAgICAgIHBsYXllci5vbignZW5kZWQnLCBfb25Db21wbGV0ZSk7XG4gICAgICAgIC8vIHB1c2ggdGhlIHBsYXllciB0byB0aGUgcGxheWVycyBhcnJheVxuICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX29uUGxheShlKSB7XG4gICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHBsYXllciB0aGUgZXZlbnQgaXMgY29taW5nIGZyb21cbiAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcbiAgICAvLyBnbyB0aHJvdWdoIHBsYXllcnNcbiAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xuICAgICAgaWYgKHBsYXllci5pZCgpICE9PSBpZCkge1xuICAgICAgICAvLyBwYXVzZSB0aGUgb3RoZXIgcGxheWVyKHMpXG4gICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfb25Db21wbGV0ZShlKSB7XG4gICAgJCgnLicgKyBlLnRhcmdldC5pZCkuYWRkQ2xhc3MoJ2NvbXBsZXRlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBfdmlld1N0YXR1cygpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgICAgIGlmICghJCgnIycgKyBwbGF5ZXIuaWQoKSkudmlzaWJsZSgpKSB7XG4gICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQsXG4gIH07XG59KSgpO1xuIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxuXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcbiBmb3IgaW5zdGFuY2UpLlxuXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cbiAqL1xuXG5pbXBvcnQgbmF2aWdhdGlvbiBmcm9tICcuL25hdmlnYXRpb24uanMnXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xuaW1wb3J0IHNodWZmbGVkQ2Fyb3VzZWwgZnJvbSAnLi9zaHVmZmxlZC1jYXJvdXNlbC5qcyc7XG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcbi8vIGltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcbi8vIGltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcblxuY29uc3QgYXBwID0gKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcblxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXG4gICAgaWYgKCQoJy5zaXRlLW5hdicpLmxlbmd0aCkgbmF2aWdhdGlvbi5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykubGVuZ3RoKSBzaHVmZmxlZENhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XG4gICAgaWYgKCQoJy5hY2NvcmRpb24nKS5sZW5ndGgpIGFjY29yZGlvbi5pbml0KCk7XG5cbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxuICAgIC8vIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xuICAgIC8vIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xuXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcbiAgICBfbGFuZ3VhZ2UoKTtcbiAgfVxuXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9XG59KSgpO1xuXG4vLyBCb290c3RyYXAgYXBwXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIGFwcC5pbml0KCk7XG59KTtcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJzZXRUaW1lb3V0IiwiYm9keSIsIiQiLCJzZWFyY2hJbnB1dCIsInNlYXJjaEZvcm0iLCJoYXNTdWJOYXYiLCJpblNlY3Rpb25OYXZUb2dnbGUiLCJpblNlY3Rpb25OYXYiLCJpbml0Iiwic2NvcGUiLCJmb2N1cyIsImFkZENsYXNzIiwiYmx1ciIsInJlbW92ZUNsYXNzIiwiY2xpY2siLCJlIiwidG9nZ2xlQ2xhc3MiLCJzblRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJoYXNDbGFzcyIsIm9uIiwiaWciLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJ3aWR0aCIsImNzcyIsImV2ZW50IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJyZXR1cm5WYWx1ZSIsImVyciIsIndhcm4iLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0IiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfZmlsdGVyRHJvcGRvd24iLCJoaWRlIiwiZmFkZUluIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsImpzU29jaWFsRHJhd2VyIiwibmV4dCIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsIl9tZXNzYWdlcyIsImV4dGVuZCIsIm1lc3NhZ2VzIiwiZm9ybWF0IiwibG9nIiwiX2J1aWxkQ2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkY2Fyb3VzZWwiLCJlYWNoIiwiaW5kZXgiLCJzbGljayIsImF2YWlsYWJsZUl0ZW1zIiwic2Vlbkl0ZW1zIiwiaWdscyIsImRhdGFLZXkiLCJhcnRpY2xlTGltaXQiLCJnZXRMb2NhbFN0b3JhZ2UiLCJhcnRpY2xlcyIsImdldFJhbmRBcnRpY2xlcyIsIlN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlSUdMUyIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ1cGRhdGVMb2NhbFN0b3JhZ2UiLCJ1cGRhdGVkT2JqIiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwia2V5cyIsIm1hcCIsImsiLCJyZXNldExvY2FsU3RvcmFnZSIsInVuc2VlbiIsInJhbmRBcnRpY2xlcyIsImtleSIsIm5ld09iaiIsInB1c2giLCJzcGxpY2UiLCJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2VuZXJhdGVUZW1wbGF0ZSIsInJhbmRvbUFydGljbGVzIiwiaHRtbCIsInRlbXBsYXRlRGF0YSIsImFydGljbGUiLCJNdXN0YWNoZSIsInRvX2h0bWwiLCJidWlsZENhcm91c2VsIiwibm90Iiwic2VjdGlvblRpdGxlIiwidmlkZW9JRHMiLCJwbGF5ZXJzIiwiYnJpZ2h0Q292ZSIsInNldEludGVydmFsIiwiX3BhcnNlVmlkZW9zIiwiJGdyb3VwIiwiJHZpZGVvIiwicHJlbG9hZE9wdGlvbnMiLCJhY2NvdW50IiwicGxheWVyIiwiaWQiLCJvdmVybGF5IiwiZGVzY3JpcHRpb24iLCJhdXRvIiwicHJlbG9hZCIsInRyYW5zY3JpcHQiLCJjdGFUZW1wbGF0ZSIsIl9pbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2luamVjdFRlbXBsYXRlIiwidHJhbnNjcmlwdFRleHQiLCJyZXBsYWNlV2l0aCIsImRvY3VtZW50Iiwic2libGluZ3MiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZWwiLCJyZWFkeSIsIl9vblBsYXkiLCJfb25Db21wbGV0ZSIsInRhcmdldCIsInBhdXNlIiwiX3ZpZXdTdGF0dXMiLCJzY3JvbGwiLCJ2aXNpYmxlIiwiYXBwIiwiZm91bmRhdGlvbiIsIm5hdmlnYXRpb24iLCJmb3JtcyIsIm1vcmUiLCJjYXJvdXNlbCIsInNodWZmbGVkQ2Fyb3VzZWwiLCJ2aWRlbyIsImFjY29yZGlvbiIsIl9sYW5ndWFnZSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNBOzs7QUFLQSxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBOUMsSUFBbURILE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQXJHLEVBQXdHO1dBQy9GLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUDs7Ozs7QUFPQSxBQUFPLElBQUlDLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBYUMsU0FBYixFQUEyQjtNQUM1Q0MsT0FBSjtTQUNPLFlBQVc7UUFDYkMsVUFBVSxJQUFkO1FBQW9CQyxPQUFPQyxTQUEzQjtRQUNJQyxRQUFRLFNBQVJBLEtBQVEsR0FBVztnQkFDWixJQUFWO1VBQ0ksQ0FBQ0wsU0FBTCxFQUFnQkYsS0FBS1EsS0FBTCxDQUFXSixPQUFYLEVBQW9CQyxJQUFwQjtLQUZqQjtRQUlJSSxVQUFVUCxhQUFhLENBQUNDLE9BQTVCO2lCQUNhQSxPQUFiO2NBQ1VPLFdBQVdILEtBQVgsRUFBa0JOLElBQWxCLENBQVY7UUFDSVEsT0FBSixFQUFhVCxLQUFL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