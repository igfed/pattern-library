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

    $('.more-section-menu > li').on('click', _toggleClassActive);
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

    // Toggles class Active on click
    _toggleClassActive();
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

  function _toggleClassActive() {
    $('.more-section-menu > li').removeClass('active');
    $(this).addClass('active');
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
    if ($('#main-navigation').length) navigation.init();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxudXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxuXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXG4gKi9cblxuLy8gdXJsIHBhdGhcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xufSkoKVxuXG4vLyBsYW5ndWFnZVxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIuJykgIT09IC0xIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XG4gICAgcmV0dXJuICdmcic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdlbic7XG4gIH1cbn0pKClcblxuLy8gYnJvd3NlciB3aWR0aFxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XG59KSgpXG5cbi8vIGJhc2UgZXZlbnRFbWl0dGVyXG4vLyBleHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbmV4cG9ydCB2YXIgZGVib3VuY2UgPSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSA9PiB7XG5cdHZhciB0aW1lb3V0O1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9O1xuXHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdH07XG59OyIsIi8vQW55IGNvZGUgdGhhdCBpbnZvbHZlcyB0aGUgbWFpbiBuYXZpZ2F0aW9uIGdvZXMgaGVyZVxuXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cblx0bGV0IFxuXHRcdGJvZHkgPSAkKCdib2R5JyksXG5cdFx0bWVudUljb24gPSAkKCcubWVudS1pY29uJyksXG5cdFx0Y2xvc2VCdXR0b24gPSAkKCcuY2xvc2UtYnV0dG9uLWNpcmNsZScpLFxuXHRcdHNob3dGb3JMYXJnZSA9ICQoJy5zaG93LWZvci1sYXJnZScpLFxuXHRcdHNlYXJjaElucHV0ID0gJCgnI3NpdGUtc2VhcmNoLXEnKSxcblx0XHRoYXNTdWJOYXYgPSAkKCcuaGFzLXN1Ym5hdicpO1xuXG5cdGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcblx0XHRtZW51SWNvbi5jbGljaygoZSkgPT4ge1xuXHRcdFx0Ym9keS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XG5cdFx0fSk7XHRcblxuXHRcdGNsb3NlQnV0dG9uLmNsaWNrKChlKSA9PiB7XG5cdFx0XHRib2R5LnJlbW92ZUNsYXNzKCduby1zY3JvbGwnKTtcdFxuXHRcdH0pO1xuXG5cdFx0c2hvd0ZvckxhcmdlLmNsaWNrKChlKSA9PiB7XG5cdFx0XHRzZWFyY2hJbnB1dC5mb2N1cygpO1xuXHRcdH0pO1xuXG5cdFx0aGFzU3ViTmF2LmNsaWNrKChlKSA9PiB7XG5cdFx0XHRsZXQgc25UYXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRpZiggc25UYXJnZXQuaGFzQ2xhc3MoXCJhY3RpdmVcIikgKSB7XG5cdFx0XHRcdC8vZGVhY3RpdmF0ZVxuXHRcdFx0XHRzblRhcmdldC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL2FjdGl2YXRlXG5cdFx0XHRcdHNuVGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdFxuXHR9O1xufSkoKVxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXG4vLyBBdCBzb21lIHBvaW50LCB3ZSBzaG91bGQgY29uc2lkZXIgc3BsaXR0aW5nIGl0IHVwIGludG8gYml0ZS1zaXplZCBwaWVjZXMuIEV4OiBtb3JlLW5hdi5qcywgbW9yZS1zb2NpYWwuanNcbi8vIGFuZCBzbyBvbi5cblxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxuICAgIF9yZXNpemUoKTtcblxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXG5cbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBpZy5kZWJvdW5jZShfbW9yZVNlY3Rpb25NZW51SXRlbSwgNTAwLCB0cnVlKSk7XG5cbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcblxuICAgIC8vIENsb3NlIGJ1dHRvblxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xuXG4gICAgLy8gU29jaWFsIGRyYXdlclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcblxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudSA+IGxpJykub24oJ2NsaWNrJywgX3RvZ2dsZUNsYXNzQWN0aXZlKTtcbiAgfVxuXG4gIC8vIEVuZCBvZiBJbml0XG5cbiAgZnVuY3Rpb24gX3Jlc2l6ZSgpIHtcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSAzNzUpIHtcbiAgICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb3JlU2VjdGlvbk1lbnVJdGVtKGV2ZW50KSB7XG5cbiAgICBpZih3aW5kb3cubWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDY0MHB4KVwiKS5tYXRjaGVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvL0lFIGZpeFxuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfSBjYXRjaChlcnIpIHsgY29uc29sZS53YXJuKCdldmVudC5yZXR1cm5WYWx1ZSBub3QgYXZhaWxhYmxlJyl9XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpLFxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXG4gICAgICBjbGFzc05hbWUgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC9bXFx3LV0qY2F0ZWdvcnlbXFx3LV0qL2cpLFxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XG5cbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XG5cbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IHRpdGxlIG9uIGNsaWNrXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcblxuICAgIC8vIEFycm93IHBvc2l0aW9uIG1vdmUgb24gY2xpY2tcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXG5cbiAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xuXG4gICAgLy8gVG9nZ2xlcyBjbGFzcyBBY3RpdmUgb24gY2xpY2tcbiAgICBfdG9nZ2xlQ2xhc3NBY3RpdmUoKTtcblxuXG4gIH1cblxuICBmdW5jdGlvbiBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XG4gICAgJCgnLicgKyBjbGFzc05hbWVbMF0pLmZhZGVJbignc2xvdycpLmZvY3VzKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcblxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF90b2dnbGVDbGFzc0FjdGl2ZSgpe1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudSA+IGxpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIHZhciBlbmRwb2ludFVSTCxcbiAgICBzdWNjZXNzVVJMLFxuICAgIGNhbmNlbFVSTCxcbiAgICAkZm9ybSxcbiAgICAkZm9ybVdyYXBwZXI7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XG5cbiAgICBfdmFsaWRhdGlvbigpO1xuICAgIF90b2dnbGVyKCk7XG4gICAgX21lc3NhZ2VzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xuICAgIH0pO1xuXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xuICAgICAgZGVidWc6IHRydWUsXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXG4gICAgfSk7XG5cbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XG5cbiAgICAkZm9ybS52YWxpZGF0ZSh7XG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9wcm9jZXNzKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBydWxlczoge1xuICAgICAgICBwaG9uZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHBob25lVVM6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcGhvbmUyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwb3N0YWxfY29kZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmaXJzdG5hbWU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBsYXN0bmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWwyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcbiAgICB2YXIgZm9ybURhdGFSYXcsXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcblxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcblxuXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xuICAgICQuYWpheCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfbWVzc2FnZXMoKSB7XG4gICAgaWYgKGlnLmxhbmcgPT09IFwiZnJcIikge1xuICAgICAgJC5leHRlbmQoICQudmFsaWRhdG9yLm1lc3NhZ2VzLCB7XG4gICAgICAgIHJlcXVpcmVkOiBcIkNlIGNoYW1wIGVzdCBvYmxpZ2F0b2lyZS5cIixcbiAgICAgICAgcmVtb3RlOiBcIlZldWlsbGV6IGNvcnJpZ2VyIGNlIGNoYW1wLlwiLFxuICAgICAgICBlbWFpbDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIMOpbGVjdHJvbmlxdWUgdmFsaWRlLlwiLFxuICAgICAgICB1cmw6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBVUkwgdmFsaWRlLlwiLFxuICAgICAgICBkYXRlOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxuICAgICAgICBkYXRlSVNPOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlIChJU08pLlwiLFxuICAgICAgICBudW1iZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIHZhbGlkZS5cIixcbiAgICAgICAgZGlnaXRzOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBjaGlmZnJlcy5cIixcbiAgICAgICAgY3JlZGl0Y2FyZDogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgY2FydGUgZGUgY3LDqWRpdCB2YWxpZGUuXCIsXG4gICAgICAgIGVxdWFsVG86IFwiVmV1aWxsZXogZm91cm5pciBlbmNvcmUgbGEgbcOqbWUgdmFsZXVyLlwiLFxuICAgICAgICBleHRlbnNpb246IFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGF2ZWMgdW5lIGV4dGVuc2lvbiB2YWxpZGUuXCIsXG4gICAgICAgIG1heGxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgcGx1cyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcbiAgICAgICAgbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcbiAgICAgICAgcmFuZ2VsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgcXVpIGNvbnRpZW50IGVudHJlIHswfSBldCB7MX0gY2FyYWN0w6hyZXMuXCIgKSxcbiAgICAgICAgcmFuZ2U6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgZW50cmUgezB9IGV0IHsxfS5cIiApLFxuICAgICAgICBtYXg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgaW5mw6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxuICAgICAgICBtaW46ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgc3Vww6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxuICAgICAgICBzdGVwOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIG11bHRpcGxlIGRlIHswfS5cIiApLFxuICAgICAgICBtYXhXb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgcGx1cyB7MH0gbW90cy5cIiApLFxuICAgICAgICBtaW5Xb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IG1vdHMuXCIgKSxcbiAgICAgICAgcmFuZ2VXb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgZW50cmUgezB9IGV0IHsxfSBtb3RzLlwiICksXG4gICAgICAgIGxldHRlcnN3aXRoYmFzaWNwdW5jOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzIGV0IGRlcyBzaWduZXMgZGUgcG9uY3R1YXRpb24uXCIsXG4gICAgICAgIGFscGhhbnVtZXJpYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcywgbm9tYnJlcywgZXNwYWNlcyBldCBzb3VsaWduYWdlcy5cIixcbiAgICAgICAgbGV0dGVyc29ubHk6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMuXCIsXG4gICAgICAgIG5vd2hpdGVzcGFjZTogXCJWZXVpbGxleiBuZSBwYXMgaW5zY3JpcmUgZCdlc3BhY2VzIGJsYW5jcy5cIixcbiAgICAgICAgemlwcmFuZ2U6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCBlbnRyZSA5MDJ4eC14eHh4IGV0IDkwNS14eC14eHh4LlwiLFxuICAgICAgICBpbnRlZ2VyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbm9tYnJlIG5vbiBkw6ljaW1hbCBxdWkgZXN0IHBvc2l0aWYgb3UgbsOpZ2F0aWYuXCIsXG4gICAgICAgIHZpblVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkJ2lkZW50aWZpY2F0aW9uIGR1IHbDqWhpY3VsZSAoVklOKS5cIixcbiAgICAgICAgZGF0ZUlUQTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZS5cIixcbiAgICAgICAgdGltZTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBoZXVyZSB2YWxpZGUgZW50cmUgMDA6MDAgZXQgMjM6NTkuXCIsXG4gICAgICAgIHBob25lVVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIHZhbGlkZS5cIixcbiAgICAgICAgcGhvbmVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxuICAgICAgICBtb2JpbGVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgbW9iaWxlIHZhbGlkZS5cIixcbiAgICAgICAgc3RyaXBwZWRtaW5sZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBjYXJhY3TDqHJlcy5cIiApLFxuICAgICAgICBlbWFpbDI6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSDDqWxlY3Ryb25pcXVlIHZhbGlkZS5cIixcbiAgICAgICAgdXJsMjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIFVSTCB2YWxpZGUuXCIsXG4gICAgICAgIGNyZWRpdGNhcmR0eXBlczogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgY2FydGUgZGUgY3LDqWRpdCB2YWxpZGUuXCIsXG4gICAgICAgIGlwdjQ6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NCB2YWxpZGUuXCIsXG4gICAgICAgIGlwdjY6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NiB2YWxpZGUuXCIsXG4gICAgICAgIHJlcXVpcmVfZnJvbV9ncm91cDogXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBkZSBjZXMgY2hhbXBzLlwiLFxuICAgICAgICBuaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklGIHZhbGlkZS5cIixcbiAgICAgICAgbmllRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIE5JRSB2YWxpZGUuXCIsXG4gICAgICAgIGNpZkVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBDSUYgdmFsaWRlLlwiLFxuICAgICAgICBwb3N0YWxDb2RlQ0E6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCB2YWxpZGUuXCJcbiAgICAgIH0gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgdmFyIHByZXZBcnJvdyxcbiAgICAgIG5leHRBcnJvdyxcbiAgICAgICRjYXJvdXNlbDtcblxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCIvKipcbiAqIFNodWZmbGVkIENhcm91c2VsXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cbiAqXG4gKiBVcG9uIHJlZnJlc2ggb2YgdGhlIGJyb3dzZXIsIHRoZSBmaXJzdCB0d28gaXRlbXMgYXJlIGFkZGVkIHRvIHRoZSBzZWVuSXRlbXMgb2JqZWN0XG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcbiAqIGlzIGNsZWFyZWQgYW5kIHRoZSBjYXJvdXNlbCByZXNldC5cbiAqXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XG4gKiBAcGFyYW0gZGF0YS1hcnRpY2xlcyA9IFRoZSBrZXkgb2YgdGhlIGRhdGEgaW4gdGhlIGpzb24gb2JqZWN0XG4gKiBAcmV0dXJuIGRhdGEtbGltaXQgPSBUaGUgYW1vdW50IG9mIGl0ZW1zIHRvIGJlIHJlbmRlcmVkIGluIHRoZSBjYXJvdXNlbFxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XG4gKi9cbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgICAgIGlnbHMgPSBnZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgYXZhaWxhYmxlSXRlbXMgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdhcnRpY2xlcycpLmFydGljbGVzO1xuICAgICAgICBkYXRhS2V5ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbmFtZScpO1xuICAgICAgICBhcnRpY2xlTGltaXQgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdsaW1pdCcpO1xuXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xuICAgICAgICAgICAgLy9vYmplY3QgZG9lcyBub3QgZXhpc3QgeWV0XG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IGlnbHNbZGF0YUtleV07XG4gICAgICAgIH1cblxuICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlKGdldFJhbmRBcnRpY2xlcygpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIGlmICh0eXBlb2YoU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbG9jYWxzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUhJylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUlHTFMoKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XG4gICAgICAgIHZhciB1cGRhdGVkT2JqID0gT2JqZWN0LmFzc2lnbih7fSwgc2Vlbkl0ZW1zKTtcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkT2JqW2tdID0gaXRlbVtrXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWdsc1tkYXRhS2V5XSA9IHVwZGF0ZWRPYmo7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0TG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBkZWxldGUgaWdsc1tkYXRhS2V5XTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZEFydGljbGVzKCkge1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIHVuc2VlbiA9IFtdLFxuICAgICAgICAgICAgcmFuZEFydGljbGVzOyAgIFxuXG4gICAgICAgIE9iamVjdC5rZXlzKGF2YWlsYWJsZUl0ZW1zKS5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB7fTtcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gYXZhaWxhYmxlSXRlbXNba2V5XTtcblxuICAgICAgICAgICAgaWYgKCFzZWVuSXRlbXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHVuc2Vlbi5wdXNoKG5ld09iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJhbmRBcnRpY2xlcyA9IHVuc2Vlbi5zcGxpY2UoMCwgYXJ0aWNsZUxpbWl0KTtcblxuICAgICAgICBpZiAocmFuZEFydGljbGVzLmxlbmd0aCA8IGFydGljbGVMaW1pdCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVzcyB0aGFuICcgKyBhcnRpY2xlTGltaXQgKyAnIGl0ZW1zIGxlZnQgdG8gdmlldywgZW1wdHlpbmcgc2Vlbkl0ZW1zIGFuZCByZXN0YXJ0aW5nLicpO1xuICAgICAgICAgICAgLy9UaGVyZSdzIGxlc3MgdW5zZWVuIGFydGljbGVzIHRoYXQgdGhlIGxpbWl0XG4gICAgICAgICAgICAvL2NsZWFyIHNlZW5JdGVtcywgcmVzZXQgbHMsIGFuZCByZWluaXRcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xuICAgICAgICAgICAgcmVzZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNodWZmbGUocmFuZEFydGljbGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUocmFuZG9tQXJ0aWNsZXMpIHtcblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICB0ZW1wbGF0ZURhdGEgPSBbXTtcblxuICAgICAgICBpZighcmFuZG9tQXJ0aWNsZXMpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgcmFuZG9tQXJ0aWNsZXMuZm9yRWFjaCgoYXJ0aWNsZSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJ0aWNsZSkubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURhdGEucHVzaChhcnRpY2xlW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKCQoYCMke2RhdGFLZXl9YCkuaHRtbCgpLCB7IFwiYXJ0aWNsZXNcIjogdGVtcGxhdGVEYXRhIH0pO1xuXG4gICAgICAgICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmh0bWwoaHRtbCk7XG5cbiAgICAgICAgdXBkYXRlTG9jYWxTdG9yYWdlKHJhbmRvbUFydGljbGVzKTtcblxuICAgICAgICBidWlsZENhcm91c2VsKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRDYXJvdXNlbCgpIHtcbiAgICAgICAgdmFyIHByZXZBcnJvdyxcbiAgICAgICAgICAgIG5leHRBcnJvdyxcbiAgICAgICAgICAgICRjYXJvdXNlbDtcblxuICAgICAgICAkKCcuaWctY2Fyb3VzZWwnKS5ub3QoJy5zbGljay1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XG4gICAgICAgICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XG5cbiAgICAgICAgICAgICRjYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgICAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdFxuICAgIH07XG59KSgpXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cblx0bGV0IHNlY3Rpb25UaXRsZSA9ICQoJy5hY2NvcmRpb24tbWVudS1zZWN0aW9uLXRpdGxlJyk7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRzZWN0aW9uVGl0bGUuY2xpY2soKGUpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vSUUgZml4XG5cdFx0XHRcdGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcblx0XHRcdH0gY2F0Y2goZXJyKSB7IGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpfVxuXHRcdFx0XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXRcblx0fTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgdmFyIHZpZGVvSURzID0gW10sXG4gICAgcGxheWVycyA9IFtdLFxuICAgIGJyaWdodENvdmU7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNhcHR1cmUgdGhlIHZpZGVvIHBsYXllciBzZXR0aW5ncyBkZWZpbmVkIGluIHRoZSBIVE1MIGFuZCBjcmVhdGUgdGhlIG1hcmt1cCB0aGF0IEJyaWdodGNvdmUgcmVxdWlyZXNcbiAgICBfcGFyc2VWaWRlb3MoKTtcblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXG4gICAgYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkKCcudmpzLXBsdWdpbnMtcmVhZHknKS5sZW5ndGgpIHtcbiAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xuICAgICAgICBjbGVhckludGVydmFsKGJyaWdodENvdmUpO1xuICAgICAgfVxuICAgIH0sIDUwMCk7XG5cbiAgICAvLyBGdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdmlkZW8ncyBoYXZlIHNjcm9sbGVkIG9mZiBzY3JlZW4gYW5kIG5lZWQgdG8gYmUgcGF1c2VkXG4gICAgX3ZpZXdTdGF0dXMoKTtcblxuICB9XG5cbiAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xuICAgIHZhciAkZ3JvdXAsXG4gICAgICAkdmlkZW8sXG4gICAgICBkYXRhID0ge30sXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ107XG5cbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxuICAgICQoJy5pZy12aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJGdyb3VwID0gJCh0aGlzKTtcbiAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XG4gICAgICBkYXRhLnBsYXllciA9ICRncm91cC5kYXRhKCdwbGF5ZXInKTtcblxuICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcbiAgICAgIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSk7XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXG4gICAgICAkZ3JvdXAuZmluZCgnLmlnLXZpZGVvLWpzJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcblxuICAgICAgICAvLyBDYXB0dXJlIHJlcXVpcmVkIG9wdGlvbnNcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xuXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyB0aGF0IGFyZSBvcHRpb25hbFxuICAgICAgICBkYXRhLm92ZXJsYXkgPSAkdmlkZW8uZGF0YSgnb3ZlcmxheScpXG4gICAgICAgICAgPyAkdmlkZW8uZGF0YSgnb3ZlcmxheScpXG4gICAgICAgICAgOiAnJztcbiAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcbiAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoXG4gICAgICAgICAgJ2Rlc2NyaXB0aW9uJykgOiAnJztcbiAgICAgICAgZGF0YS5hdXRvID0gJHZpZGVvLmRhdGEoJ2F1dG9wbGF5JykgPyAnYXV0b3BsYXknIDogJyc7XG4gICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcbiAgICAgICAgZGF0YS50cmFuc2NyaXB0ID0gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA/ICR2aWRlby5kYXRhKFxuICAgICAgICAgICd0cmFuc2NyaXB0JykgOiAnJztcbiAgICAgICAgZGF0YS5jdGFUZW1wbGF0ZSA9ICR2aWRlby5kYXRhKCdjdGFUZW1wbGF0ZScpID8gJHZpZGVvLmRhdGEoXG4gICAgICAgICAgJ2N0YVRlbXBsYXRlJykgOiAnJztcblxuICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXG4gICAgICAgIHZpZGVvSURzLnB1c2goZGF0YS5pZCk7XG5cbiAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxuICAgICAgICBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCk7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcbiAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4anMpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcbiAgICB2YXIgdHJhbnNjcmlwdFRleHQgPSB7ICdlbic6ICdUcmFuc2NyaXB0JywgJ2ZyJzogJ1RyYW5zY3JpcHRpb24nIH0sXG4gICAgICBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXIgJHtkYXRhLmlkfVwiPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPmA7XG5cbiAgICBpZiAoZGF0YS5jdGFUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLWN0YVwiPiR7ZGF0YS5jdGFUZW1wbGF0ZX08L3NwYW4+YDtcbiAgICB9XG4gICAgaWYgKGRhdGEub3ZlcmxheS5sZW5ndGggPiAwKSB7XG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLW92ZXJsYXlcIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJHtkYXRhLm92ZXJsYXl9Jyk7XCI+PC9zcGFuPmA7XG4gICAgfVxuICAgIGh0bWwgKz0gYDx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgY29udHJvbHMgJHtkYXRhLmF1dG99PjwvdmlkZW8+PC9kaXY+YDtcbiAgICBpZiAoZGF0YS50cmFuc2NyaXB0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJ2aWRlby10cmFuc2NyaXB0XCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZGF0YS50cmFuc2NyaXB0fVwiPiR7dHJhbnNjcmlwdFRleHRbaWcubGFuZ119PC9hPjwvZGl2PmA7XG4gICAgfVxuICAgIGh0bWwgKz0gYDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcbiAgICAkdmlkZW8gPSAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XG5cbiAgICBpZiAoZGF0YS5vdmVybGF5KSB7XG4gICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnIycgKyBkYXRhLmlkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy52aWRlby1vdmVybGF5JykuaGlkZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcbiAgICB2YXIgcGxheWVyO1xuICAgIHZpZGVvSURzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGFzc2lnbiB0aGlzIHBsYXllciB0byBhIHZhcmlhYmxlXG4gICAgICAgIHBsYXllciA9IHRoaXM7XG4gICAgICAgIC8vIGFzc2lnbiBhbiBldmVudCBsaXN0ZW5lciBmb3IgcGxheSBldmVudFxuICAgICAgICBwbGF5ZXIub24oJ3BsYXknLCBfb25QbGF5KTtcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBlbmRlZCBldmVudFxuICAgICAgICBwbGF5ZXIub24oJ2VuZGVkJywgX29uQ29tcGxldGUpO1xuICAgICAgICAvLyBwdXNoIHRoZSBwbGF5ZXIgdG8gdGhlIHBsYXllcnMgYXJyYXlcbiAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vblBsYXkoZSkge1xuICAgIC8vIGRldGVybWluZSB3aGljaCBwbGF5ZXIgdGhlIGV2ZW50IGlzIGNvbWluZyBmcm9tXG4gICAgdmFyIGlkID0gZS50YXJnZXQuaWQ7XG4gICAgLy8gZ28gdGhyb3VnaCBwbGF5ZXJzXG4gICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgIGlmIChwbGF5ZXIuaWQoKSAhPT0gaWQpIHtcbiAgICAgICAgLy8gcGF1c2UgdGhlIG90aGVyIHBsYXllcihzKVxuICAgICAgICB2aWRlb2pzKHBsYXllci5pZCgpKS5wYXVzZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX29uQ29tcGxldGUoZSkge1xuICAgICQoJy4nICsgZS50YXJnZXQuaWQpLmFkZENsYXNzKCdjb21wbGV0ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3ZpZXdTdGF0dXMoKSB7XG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XG4gICAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xuICAgICAgICBpZiAoISQoJyMnICsgcGxheWVyLmlkKCkpLnZpc2libGUoKSkge1xuICAgICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0LFxuICB9O1xufSkoKTtcbiIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cblxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXG4gZm9yIGluc3RhbmNlKS5cblxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXG4gKi9cblxuaW1wb3J0IG5hdmlnYXRpb24gZnJvbSAnLi9uYXZpZ2F0aW9uLmpzJ1xuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcbmltcG9ydCBzaHVmZmxlZENhcm91c2VsIGZyb20gJy4vc2h1ZmZsZWQtY2Fyb3VzZWwuanMnO1xuaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL2FjY29yZGlvbi5qcyc7XG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXG4vLyBpbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XG4vLyBpbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XG5cbmNvbnN0IGFwcCA9ICgoKSA9PiB7XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XG5cbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xuICAgIGlmICgkKCcjbWFpbi1uYXZpZ2F0aW9uJykubGVuZ3RoKSBuYXZpZ2F0aW9uLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcbiAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbicpLmxlbmd0aCkgbW9yZS5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5sZW5ndGgpIHNodWZmbGVkQ2Fyb3VzZWwuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctdmlkZW8tZ3JvdXAnKS5sZW5ndGgpIHZpZGVvLmluaXQoKTtcbiAgICBpZiAoJCgnLmFjY29yZGlvbicpLmxlbmd0aCkgYWNjb3JkaW9uLmluaXQoKTtcblxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQxJykubGVuZ3RoKSBldnQxLmluaXQoJy5pZy1ldnQxJyk7XG4gICAgLy8gaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XG5cbiAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxuICAgIF9sYW5ndWFnZSgpO1xuICB9XG5cbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xuICBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH1cbn0pKCk7XG5cbi8vIEJvb3RzdHJhcCBhcHBcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgYXBwLmluaXQoKTtcbn0pO1xuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImRlYm91bmNlIiwiZnVuYyIsIndhaXQiLCJpbW1lZGlhdGUiLCJ0aW1lb3V0IiwiY29udGV4dCIsImFyZ3MiLCJhcmd1bWVudHMiLCJsYXRlciIsImFwcGx5IiwiY2FsbE5vdyIsInNldFRpbWVvdXQiLCJib2R5IiwiJCIsIm1lbnVJY29uIiwiY2xvc2VCdXR0b24iLCJzaG93Rm9yTGFyZ2UiLCJzZWFyY2hJbnB1dCIsImhhc1N1Yk5hdiIsImluaXQiLCJzY29wZSIsImNsaWNrIiwiZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJmb2N1cyIsInNuVGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImhhc0NsYXNzIiwib24iLCJpZyIsIl9tb3JlU2VjdGlvbk1lbnVJdGVtIiwiX21vYmlsZUNhdGVnb3J5TWVudSIsIl9jbG9zZUJ1dHRvbiIsIl9vcGVuU29jaWFsRHJhd2VyIiwiX3RvZ2dsZUNsYXNzQWN0aXZlIiwiX3Jlc2l6ZSIsInJlc2l6ZSIsIndpZHRoIiwiY3NzIiwiZXZlbnQiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInJldHVyblZhbHVlIiwiZXJyIiwid2FybiIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCJvZmZzZXQiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImhpZGUiLCJmYWRlSW4iLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJfbWVzc2FnZXMiLCJleHRlbmQiLCJtZXNzYWdlcyIsImZvcm1hdCIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlTG9jYWxTdG9yYWdlIiwidXBkYXRlZE9iaiIsImZvckVhY2giLCJpdGVtIiwiaSIsImtleXMiLCJtYXAiLCJrIiwicmVzZXRMb2NhbFN0b3JhZ2UiLCJ1bnNlZW4iLCJyYW5kQXJ0aWNsZXMiLCJrZXkiLCJuZXdPYmoiLCJwdXNoIiwic3BsaWNlIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdlbmVyYXRlVGVtcGxhdGUiLCJyYW5kb21BcnRpY2xlcyIsImh0bWwiLCJ0ZW1wbGF0ZURhdGEiLCJhcnRpY2xlIiwiTXVzdGFjaGUiLCJ0b19odG1sIiwiYnVpbGRDYXJvdXNlbCIsIm5vdCIsInNlY3Rpb25UaXRsZSIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCJzZXRJbnRlcnZhbCIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwib3ZlcmxheSIsImRlc2NyaXB0aW9uIiwiYXV0byIsInByZWxvYWQiLCJ0cmFuc2NyaXB0IiwiY3RhVGVtcGxhdGUiLCJfaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9pbmplY3RUZW1wbGF0ZSIsInRyYW5zY3JpcHRUZXh0IiwicmVwbGFjZVdpdGgiLCJkb2N1bWVudCIsInNpYmxpbmdzIiwiX2JyaWdodENvdmVSZWFkeSIsImVsIiwicmVhZHkiLCJfb25QbGF5IiwiX29uQ29tcGxldGUiLCJ0YXJnZXQiLCJwYXVzZSIsIl92aWV3U3RhdHVzIiwic2Nyb2xsIiwidmlzaWJsZSIsImFwcCIsImZvdW5kYXRpb24iLCJuYXZpZ2F0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJzaHVmZmxlZENhcm91c2VsIiwidmlkZW8iLCJhY2NvcmRpb24iLCJfbGFuZ3VhZ2UiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFL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