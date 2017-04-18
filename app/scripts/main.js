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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxyXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XHJcblxyXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxyXG4gKi9cclxuXHJcbi8vIHVybCBwYXRoXHJcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbn0pKClcclxuXHJcbi8vIGxhbmd1YWdlXHJcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIuJykgIT09IC0xIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gJ2ZyJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdlbic7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBicm93c2VyIHdpZHRoXHJcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XHJcbn0pKClcclxuXHJcbi8vIGJhc2UgZXZlbnRFbWl0dGVyXHJcbmV4cG9ydCB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbmV4cG9ydCB2YXIgZGVib3VuY2UgPSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSA9PiB7XHJcblx0dmFyIHRpbWVvdXQ7XHJcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG5cdFx0dmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xyXG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuXHRcdH07XHJcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcclxuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcclxuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdH07XHJcbn07IiwiLy9BbnkgY29kZSB0aGF0IGludm9sdmVzIHRoZSBtYWluIG5hdmlnYXRpb24gZ29lcyBoZXJlXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuXHRsZXQgXHJcblx0XHRib2R5ID0gJCgnYm9keScpLFxyXG5cdFx0bWVudUljb24gPSAkKCcubWVudS1pY29uJyksXHJcblx0XHRjbG9zZUJ1dHRvbiA9ICQoJy5jbG9zZS1idXR0b24tY2lyY2xlJyksXHJcblx0XHRzaG93Rm9yTGFyZ2UgPSAkKCcuc2hvdy1mb3ItbGFyZ2UnKSxcclxuXHRcdHNlYXJjaElucHV0ID0gJCgnI3NpdGUtc2VhcmNoLXEnKSxcclxuXHRcdGhhc1N1Yk5hdiA9ICQoJy5oYXMtc3VibmF2Jyk7XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcclxuXHRcdG1lbnVJY29uLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGJvZHkuYWRkQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG5cdFx0fSk7XHRcclxuXHJcblx0XHRjbG9zZUJ1dHRvbi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRib2R5LnJlbW92ZUNsYXNzKCduby1zY3JvbGwnKTtcdFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2hvd0ZvckxhcmdlLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdHNlYXJjaElucHV0LmZvY3VzKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRoYXNTdWJOYXYuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0bGV0IHNuVGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG5cdFx0XHRpZiggc25UYXJnZXQuaGFzQ2xhc3MoXCJhY3RpdmVcIikgKSB7XHJcblx0XHRcdFx0Ly9kZWFjdGl2YXRlXHJcblx0XHRcdFx0c25UYXJnZXQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vYWN0aXZhdGVcclxuXHRcdFx0XHRzblRhcmdldC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXRcclxuXHR9O1xyXG59KSgpXHJcbiIsIi8vIFRoaXMgaXMgbGVzcyBvZiBhIG1vZHVsZSB0aGFuIGl0IGlzIGEgY29sbGVjdGlvbiBvZiBjb2RlIGZvciBhIGNvbXBsZXRlIHBhZ2UgKE1vcmUgcGFnZSBpbiB0aGlzIGNhc2UpLlxyXG4vLyBBdCBzb21lIHBvaW50LCB3ZSBzaG91bGQgY29uc2lkZXIgc3BsaXR0aW5nIGl0IHVwIGludG8gYml0ZS1zaXplZCBwaWVjZXMuIEV4OiBtb3JlLW5hdi5qcywgbW9yZS1zb2NpYWwuanNcclxuLy8gYW5kIHNvIG9uLlxyXG5cclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIHJlc2l6ZSBiZWhhdmlvdXJcclxuICAgIF9yZXNpemUoKTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnVpdGVtJykub24oJ2NsaWNrJywgaWcuZGVib3VuY2UoX21vcmVTZWN0aW9uTWVudUl0ZW0sIDUwMCwgdHJ1ZSkpO1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtbW9iaWxlLXRpdGxlJykub24oJ2NsaWNrJywgX21vYmlsZUNhdGVnb3J5TWVudSk7XHJcblxyXG4gICAgLy8gQ2xvc2UgYnV0dG9uXHJcbiAgICAkKCcuY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgX2Nsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAvLyBTb2NpYWwgZHJhd2VyXHJcbiAgICAkKCcuanMtb3Blbi1zb2NpYWxkcmF3ZXInKS5vbignY2xpY2snLCBfb3BlblNvY2lhbERyYXdlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFbmQgb2YgSW5pdFxyXG5cclxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSAzNzUpIHtcclxuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2ZsZXgnKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21vcmVTZWN0aW9uTWVudUl0ZW0oZXZlbnQpIHtcclxuXHJcbiAgICBpZih3aW5kb3cubWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDY0MHB4KVwiKS5tYXRjaGVzKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy9JRSBmaXhcclxuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICB9IGNhdGNoKGVycikgeyBjb25zb2xlLndhcm4oJ2V2ZW50LnJldHVyblZhbHVlIG5vdCBhdmFpbGFibGUnKX1cclxuXHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcclxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXHJcbiAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgZHJvcGRvd24gb24gY2xpY2tcclxuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgdGl0bGUgb24gY2xpY2tcclxuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XHJcblxyXG4gICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxyXG5cclxuICAgIC8vIFVuZGVybGluZSBhbmltYXRpb25cclxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLicgKyBjbGFzc05hbWVbMF0pLmZhZGVJbignc2xvdycpLmZvY3VzKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyVGl0bGUodGl0bGUpIHtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZU91dCgpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmFkZENsYXNzKCdhY3RpdmUnKS50ZXh0KHRpdGxlKTtcclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLnNob3coKS5jc3MoeyBsZWZ0OiBjZW50ZXJYIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FuaW1hdGlvblVuZGVybGluZSgpIHtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykuYWRkQ2xhc3MoJ2FuaW1hdGUnKVxyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9iaWxlQ2F0ZWdvcnlNZW51KCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfb3BlblNvY2lhbERyYXdlcigpIHtcclxuICAgIC8vIHRoaXMubmV4dCgpIHNlbGVjdHMgbmV4dCBzaWJsaW5nIGVsZW1lbnRcclxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cclxuICAgIHZhciBqc1NvY2lhbERyYXdlciA9ICQodGhpcykubmV4dCgpO1xyXG5cclxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLnJlbW92ZUNsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIGVuZHBvaW50VVJMLFxyXG4gICAgc3VjY2Vzc1VSTCxcclxuICAgIGNhbmNlbFVSTCxcclxuICAgICRmb3JtLFxyXG4gICAgJGZvcm1XcmFwcGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcclxuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XHJcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XHJcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcclxuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XHJcblxyXG4gICAgX3ZhbGlkYXRpb24oKTtcclxuICAgIF90b2dnbGVyKCk7XHJcbiAgICBfbWVzc2FnZXMoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XHJcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xyXG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgZGVidWc6IHRydWUsXHJcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxyXG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XHJcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcclxuXHJcbiAgICAkZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfcHJvY2VzcygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gVXNlIHRoZSBjdXN0b20tZXJyb3ItbG9jYXRpb24gbWFya2VyIGNsYXNzIHRvIGNoYW5nZSB3aGVyZSB0aGUgZXJyb3IgbGFiZWwgc2hvd3MgdXBcclxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcclxuICAgICAgICAgICQoZWxlbWVudCkucGFyZW50KCkuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBob25lMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0YWxfY29kZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBjZG5Qb3N0YWw6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRmb3JtLmZpbmQoJ2J1dHRvbi5jYW5jZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcHJvY2Vzcyhmb3JtKSB7XHJcbiAgICB2YXIgZm9ybURhdGFSYXcsXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkO1xyXG5cclxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgICAgLy8gSWYgd2UgbmVlZCB0byBtb2RpZnkgdGhlIGRhdGEsIHVzZSBwYXJzZSBtZXRob2RcclxuICAgICAgZm9ybURhdGFQYXJzZWQgPSBfcGFyc2UoZm9ybURhdGFSYXcpO1xyXG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxyXG4gICAgICBfc3VibWl0KGZvcm1EYXRhUGFyc2VkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XHJcbiAgICAvLyBFeGVjdXRlIGFueSBjdXN0b20gbG9naWMgaGVyZVxyXG5cclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N1Ym1pdChkYXRhKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgdXJsOiBlbmRwb2ludFVSTCxcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgIH0pXHJcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICAgIFNjcm9sbE1hbi50bygkKCcjc2VydmVyLWVycm9yJykpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF90b2dnbGVyKCkge1xyXG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXHJcbiAgICAkKCcudG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnRvZ2dsZS1jb250ZW50JykuaGlkZSgpO1xyXG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tZXNzYWdlcygpIHtcclxuICAgIGlmIChpZy5sYW5nID09PSBcImZyXCIpIHtcclxuICAgICAgJC5leHRlbmQoICQudmFsaWRhdG9yLm1lc3NhZ2VzLCB7XHJcbiAgICAgICAgcmVxdWlyZWQ6IFwiQ2UgY2hhbXAgZXN0IG9ibGlnYXRvaXJlLlwiLFxyXG4gICAgICAgIHJlbW90ZTogXCJWZXVpbGxleiBjb3JyaWdlciBjZSBjaGFtcC5cIixcclxuICAgICAgICBlbWFpbDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIMOpbGVjdHJvbmlxdWUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHVybDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIFVSTCB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGF0ZTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZS5cIixcclxuICAgICAgICBkYXRlSVNPOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlIChJU08pLlwiLFxyXG4gICAgICAgIG51bWJlcjogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gdmFsaWRlLlwiLFxyXG4gICAgICAgIGRpZ2l0czogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgY2hpZmZyZXMuXCIsXHJcbiAgICAgICAgY3JlZGl0Y2FyZDogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgY2FydGUgZGUgY3LDqWRpdCB2YWxpZGUuXCIsXHJcbiAgICAgICAgZXF1YWxUbzogXCJWZXVpbGxleiBmb3VybmlyIGVuY29yZSBsYSBtw6ptZSB2YWxldXIuXCIsXHJcbiAgICAgICAgZXh0ZW5zaW9uOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBhdmVjIHVuZSBleHRlbnNpb24gdmFsaWRlLlwiLFxyXG4gICAgICAgIG1heGxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgcGx1cyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICBtaW5sZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIHJhbmdlbGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIHF1aSBjb250aWVudCBlbnRyZSB7MH0gZXQgezF9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgcmFuZ2U6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgZW50cmUgezB9IGV0IHsxfS5cIiApLFxyXG4gICAgICAgIG1heDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBpbmbDqXJpZXVyZSBvdSDDqWdhbGUgw6AgezB9LlwiICksXHJcbiAgICAgICAgbWluOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIHN1cMOpcmlldXJlIG91IMOpZ2FsZSDDoCB7MH0uXCIgKSxcclxuICAgICAgICBzdGVwOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIG11bHRpcGxlIGRlIHswfS5cIiApLFxyXG4gICAgICAgIG1heFdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBtb3RzLlwiICksXHJcbiAgICAgICAgbWluV29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBtb3RzLlwiICksXHJcbiAgICAgICAgcmFuZ2VXb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgZW50cmUgezB9IGV0IHsxfSBtb3RzLlwiICksXHJcbiAgICAgICAgbGV0dGVyc3dpdGhiYXNpY3B1bmM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMgZXQgZGVzIHNpZ25lcyBkZSBwb25jdHVhdGlvbi5cIixcclxuICAgICAgICBhbHBoYW51bWVyaWM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMsIG5vbWJyZXMsIGVzcGFjZXMgZXQgc291bGlnbmFnZXMuXCIsXHJcbiAgICAgICAgbGV0dGVyc29ubHk6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMuXCIsXHJcbiAgICAgICAgbm93aGl0ZXNwYWNlOiBcIlZldWlsbGV6IG5lIHBhcyBpbnNjcmlyZSBkJ2VzcGFjZXMgYmxhbmNzLlwiLFxyXG4gICAgICAgIHppcHJhbmdlOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gY29kZSBwb3N0YWwgZW50cmUgOTAyeHgteHh4eCBldCA5MDUteHgteHh4eC5cIixcclxuICAgICAgICBpbnRlZ2VyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbm9tYnJlIG5vbiBkw6ljaW1hbCBxdWkgZXN0IHBvc2l0aWYgb3UgbsOpZ2F0aWYuXCIsXHJcbiAgICAgICAgdmluVVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGQnaWRlbnRpZmljYXRpb24gZHUgdsOpaGljdWxlIChWSU4pLlwiLFxyXG4gICAgICAgIGRhdGVJVEE6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdGltZTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBoZXVyZSB2YWxpZGUgZW50cmUgMDA6MDAgZXQgMjM6NTkuXCIsXHJcbiAgICAgICAgcGhvbmVVUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHBob25lVUs6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIHZhbGlkZS5cIixcclxuICAgICAgICBtb2JpbGVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgbW9iaWxlIHZhbGlkZS5cIixcclxuICAgICAgICBzdHJpcHBlZG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgZW1haWwyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2Ugw6lsZWN0cm9uaXF1ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdXJsMjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIFVSTCB2YWxpZGUuXCIsXHJcbiAgICAgICAgY3JlZGl0Y2FyZHR5cGVzOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcclxuICAgICAgICBpcHY0OiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgSVAgdjQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGlwdjY6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NiB2YWxpZGUuXCIsXHJcbiAgICAgICAgcmVxdWlyZV9mcm9tX2dyb3VwOiBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGRlIGNlcyBjaGFtcHMuXCIsXHJcbiAgICAgICAgbmlmRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIE5JRiB2YWxpZGUuXCIsXHJcbiAgICAgICAgbmllRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIE5JRSB2YWxpZGUuXCIsXHJcbiAgICAgICAgY2lmRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIENJRiB2YWxpZGUuXCIsXHJcbiAgICAgICAgcG9zdGFsQ29kZUNBOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gY29kZSBwb3N0YWwgdmFsaWRlLlwiXHJcbiAgICAgIH0gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcclxuICAgIF9idWlsZENhcm91c2VsKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgIHZhciBwcmV2QXJyb3csXHJcbiAgICAgIG5leHRBcnJvdyxcclxuICAgICAgJGNhcm91c2VsO1xyXG5cclxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XHJcbiAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcclxuXHJcbiAgICAgICRjYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcclxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxyXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCIvKipcclxuICogU2h1ZmZsZWQgQ2Fyb3VzZWxcclxuICogVGFrZXMgZWlnaHQgaXRlbXMgZnJvbSBhbiBvYmplY3Qgb2YgMjAsIGFuZCByZW5kZXJzIHRoZW0gaW4gYSBjYXJvdXNlbCBpbiByYW5kb20gb3JkZXIuXHJcbiAqXHJcbiAqIFVwb24gcmVmcmVzaCBvZiB0aGUgYnJvd3NlciwgdGhlIGZpcnN0IHR3byBpdGVtcyBhcmUgYWRkZWQgdG8gdGhlIHNlZW5JdGVtcyBvYmplY3RcclxuICogYW5kIHdyaXR0ZW4gdG8gbG9jYWwgc3RvcmFnZSwgd2hlbiB0aGUgYW1vdW50IG9mIHVuc2VlbiBpdGVtcyBkcm9wcyBiZWxvdyA4LCBzZWVuSXRlbXMgXHJcbiAqIGlzIGNsZWFyZWQgYW5kIHRoZSBjYXJvdXNlbCByZXNldC5cclxuICpcclxuICogVGhlcmUgYXJlIHR3byBjb25maWd1cmFibGUgZGF0YSBhdHRyaWJ1dGVzIHRoYXQgbmVlZCB0byBiZSBhZGRlZCB0byB0aGUgbWFya3VwOlxyXG4gKiBAcGFyYW0gZGF0YS1hcnRpY2xlcyA9IFRoZSBrZXkgb2YgdGhlIGRhdGEgaW4gdGhlIGpzb24gb2JqZWN0XHJcbiAqIEByZXR1cm4gZGF0YS1saW1pdCA9IFRoZSBhbW91bnQgb2YgaXRlbXMgdG8gYmUgcmVuZGVyZWQgaW4gdGhlIGNhcm91c2VsXHJcbiAqIEV4LiA8ZGl2IGNsYXNzPVwiaWctc2h1ZmZsZWQtY2Fyb3VzZWxcIiBkYXRhLWFydGljbGVzPVwiYWR2aWNlLXN0b3JpZXNcIiBkYXRhLWxpbWl0PVwiOFwiPjwvZGl2PlxyXG4gKi9cclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgICB2YXIgYXZhaWxhYmxlSXRlbXMsIHNlZW5JdGVtcywgaWdscywgZGF0YUtleSwgYXJ0aWNsZUxpbWl0O1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgICAgIGlnbHMgPSBnZXRMb2NhbFN0b3JhZ2UoKTtcclxuICAgICAgICBhdmFpbGFibGVJdGVtcyA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2FydGljbGVzJykuYXJ0aWNsZXM7XHJcbiAgICAgICAgZGF0YUtleSA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ25hbWUnKTtcclxuICAgICAgICBhcnRpY2xlTGltaXQgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdsaW1pdCcpO1xyXG5cclxuICAgICAgICBpZiAoIWlnbHNbZGF0YUtleV0pIHtcclxuICAgICAgICAgICAgLy9vYmplY3QgZG9lcyBub3QgZXhpc3QgeWV0XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IGlnbHNbZGF0YUtleV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlKGdldFJhbmRBcnRpY2xlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMb2NhbFN0b3JhZ2UoKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZihTdG9yYWdlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSA/IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSkgOiBjcmVhdGVJR0xTKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdsb2NhbHN0b3JhZ2UgaXMgbm90IGF2YWlsYWJsZSEnKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUlHTFMoKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeSh7fSkpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxvY2FsU3RvcmFnZShhcnRpY2xlcykge1xyXG4gICAgICAgIHZhciB1cGRhdGVkT2JqID0gT2JqZWN0LmFzc2lnbih7fSwgc2Vlbkl0ZW1zKTtcclxuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLm1hcCgoaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRPYmpba10gPSBpdGVtW2tdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWdsc1tkYXRhS2V5XSA9IHVwZGF0ZWRPYmo7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzZXRMb2NhbFN0b3JhZ2UoKSB7XHJcbiAgICAgICAgZGVsZXRlIGlnbHNbZGF0YUtleV07XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmFuZEFydGljbGVzKCkge1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICB1bnNlZW4gPSBbXSxcclxuICAgICAgICAgICAgcmFuZEFydGljbGVzOyAgIFxyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhhdmFpbGFibGVJdGVtcykuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB7fTtcclxuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBhdmFpbGFibGVJdGVtc1trZXldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWVuSXRlbXNba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdW5zZWVuLnB1c2gobmV3T2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByYW5kQXJ0aWNsZXMgPSB1bnNlZW4uc3BsaWNlKDAsIGFydGljbGVMaW1pdCk7XHJcblxyXG4gICAgICAgIGlmIChyYW5kQXJ0aWNsZXMubGVuZ3RoIDwgYXJ0aWNsZUxpbWl0KSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0xlc3MgdGhhbiAnICsgYXJ0aWNsZUxpbWl0ICsgJyBpdGVtcyBsZWZ0IHRvIHZpZXcsIGVtcHR5aW5nIHNlZW5JdGVtcyBhbmQgcmVzdGFydGluZy4nKTtcclxuICAgICAgICAgICAgLy9UaGVyZSdzIGxlc3MgdW5zZWVuIGFydGljbGVzIHRoYXQgdGhlIGxpbWl0XHJcbiAgICAgICAgICAgIC8vY2xlYXIgc2Vlbkl0ZW1zLCByZXNldCBscywgYW5kIHJlaW5pdFxyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcclxuICAgICAgICAgICAgcmVzZXRMb2NhbFN0b3JhZ2UoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaHVmZmxlKHJhbmRBcnRpY2xlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cclxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVRlbXBsYXRlKHJhbmRvbUFydGljbGVzKSB7XHJcblxyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICBodG1sLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZURhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgaWYoIXJhbmRvbUFydGljbGVzKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICByYW5kb21BcnRpY2xlcy5mb3JFYWNoKChhcnRpY2xlKSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFydGljbGUpLm1hcCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURhdGEucHVzaChhcnRpY2xlW2tleV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwoJChgIyR7ZGF0YUtleX1gKS5odG1sKCksIHsgXCJhcnRpY2xlc1wiOiB0ZW1wbGF0ZURhdGEgfSk7XHJcblxyXG4gICAgICAgICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmh0bWwoaHRtbCk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUxvY2FsU3RvcmFnZShyYW5kb21BcnRpY2xlcyk7XHJcblxyXG4gICAgICAgIGJ1aWxkQ2Fyb3VzZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBidWlsZENhcm91c2VsKCkge1xyXG4gICAgICAgIHZhciBwcmV2QXJyb3csXHJcbiAgICAgICAgICAgIG5leHRBcnJvdyxcclxuICAgICAgICAgICAgJGNhcm91c2VsO1xyXG5cclxuICAgICAgICAkKCcuaWctY2Fyb3VzZWwnKS5ub3QoJy5zbGljay1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICAgICAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcclxuXHJcbiAgICAgICAgICAgICRjYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcclxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXRcclxuICAgIH07XHJcbn0pKClcclxuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcblx0bGV0IHNlY3Rpb25UaXRsZSA9ICQoJy5hY2NvcmRpb24tbWVudS1zZWN0aW9uLXRpdGxlJyk7XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQoKSB7XHJcblx0XHRzZWN0aW9uVGl0bGUuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvL0lFIGZpeFxyXG5cdFx0XHRcdGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdFx0fSBjYXRjaChlcnIpIHsgY29uc29sZS53YXJuKCdldmVudC5yZXR1cm5WYWx1ZSBub3QgYXZhaWxhYmxlJyl9XHJcblx0XHRcdFxyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0XHJcblx0fTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgdmFyIHZpZGVvSURzID0gW10sXHJcbiAgICAgICAgcGxheWVycyA9IFtdLFxyXG4gICAgICAgIGJyaWdodENvdmU7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGNhcHR1cmUgdGhlIHZpZGVvIHBsYXllciBzZXR0aW5ncyBkZWZpbmVkIGluIHRoZSBIVE1MIGFuZCBjcmVhdGUgdGhlIG1hcmt1cCB0aGF0IEJyaWdodGNvdmUgcmVxdWlyZXNcclxuICAgICAgICBfcGFyc2VWaWRlb3MoKTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGJyaWdodENvdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwKVxyXG5cclxuICAgICAgICAvLyBGdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdmlkZW8ncyBoYXZlIHNjcm9sbGVkIG9mZiBzY3JlZW4gYW5kIG5lZWQgdG8gYmUgcGF1c2VkXHJcbiAgICAgICAgX3ZpZXdTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XHJcbiAgICAgICAgdmFyICRncm91cCxcclxuICAgICAgICAgICAgJHZpZGVvLFxyXG4gICAgICAgICAgICBkYXRhID0ge30sXHJcbiAgICAgICAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXTtcclxuXHJcbiAgICAgICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcclxuICAgICAgICAkKCcuaWctdmlkZW8tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJGdyb3VwID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcclxuICAgICAgICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxyXG4gICAgICAgICAgICBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcclxuICAgICAgICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChvcHRpb25hbClcclxuICAgICAgICAgICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JykgPyAkdmlkZW8uZGF0YSgnb3ZlcmxheScpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5jdHJsID0gJHZpZGVvLmRhdGEoJ2NvbnRyb2xzJykgPyAnY29udHJvbHMnIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA6ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICAgICAgICAgIHZpZGVvSURzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgICAgICAgICAgX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LyR7ZGF0YS5hY2NvdW50fS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PmA7XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgICAgIHZhciB0cmFuc2NyaXB0VGV4dCA9IHsnZW4nOiAnVHJhbnNjcmlwdCcsICdmcic6ICdUcmFuc2NyaXB0aW9uJ307XHJcbiAgICAgICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPmBcclxuICAgICAgICBpZiAoZGF0YS5vdmVybGF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5ICR7ZGF0YS5pZH1cIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vJHtkYXRhLm92ZXJsYXl9Jyk7XCI+PC9zcGFuPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwgKz0gYDx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PmBcclxuICAgICAgICBpZiAoZGF0YS50cmFuc2NyaXB0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInZpZGVvLXRyYW5zY3JpcHRcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnRyYW5zY3JpcHR9XCI+JHt0cmFuc2NyaXB0VGV4dFtpZy5sYW5nXX08L2E+PC9kaXY+YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaHRtbCArPSBgPC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEub3ZlcmxheSkge1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnIycgKyBkYXRhLmlkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudmlkZW8tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcclxuICAgICAgICB2YXIgcGxheWVyO1xyXG4gICAgICAgIHZpZGVvSURzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiB0aGlzIHBsYXllciB0byBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIub24oJ3BsYXknLCBfb25QbGF5KTtcclxuICAgICAgICAgICAgICAgIC8vIHB1c2ggdGhlIHBsYXllciB0byB0aGUgcGxheWVycyBhcnJheVxyXG4gICAgICAgICAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX29uUGxheShlKSB7XHJcbiAgICAgICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHBsYXllciB0aGUgZXZlbnQgaXMgY29taW5nIGZyb21cclxuICAgICAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcclxuICAgICAgICAvLyBnbyB0aHJvdWdoIHBsYXllcnNcclxuICAgICAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xyXG4gICAgICAgICAgICBpZiAocGxheWVyLmlkKCkgIT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwYXVzZSB0aGUgb3RoZXIgcGxheWVyKHMpXHJcbiAgICAgICAgICAgICAgICB2aWRlb2pzKHBsYXllci5pZCgpKS5wYXVzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfdmlld1N0YXR1cygpIHtcclxuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghJCgnIycgKyBwbGF5ZXIuaWQoKSkudmlzaWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXRcclxuICAgIH07XHJcbn0pKCkiLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcclxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cclxuXHJcbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXHJcbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXHJcbiBmb3IgaW5zdGFuY2UpLlxyXG5cclxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xyXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cclxuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXHJcbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IG5hdmlnYXRpb24gZnJvbSAnLi9uYXZpZ2F0aW9uLmpzJ1xyXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IHNodWZmbGVkQ2Fyb3VzZWwgZnJvbSAnLi9zaHVmZmxlZC1jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xyXG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXHJcbi8vIGltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcclxuLy8gaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xyXG5cclxuY29uc3QgYXBwID0gKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxyXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXHJcbiAgICBpZigkKCcjbWFpbi1uYXZpZ2F0aW9uJykubGVuZ3RoKSBuYXZpZ2F0aW9uLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmxlbmd0aCkgc2h1ZmZsZWRDYXJvdXNlbC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmFjY29yZGlvbicpLmxlbmd0aCkgYWNjb3JkaW9uLmluaXQoKTtcclxuXHJcbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxyXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQxJykubGVuZ3RoKSBldnQxLmluaXQoJy5pZy1ldnQxJyk7XHJcbiAgICAvLyBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcclxuXHJcbiAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxyXG4gICAgX2xhbmd1YWdlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBMZXQncyB1c2UgYSBnbG9iYWwgdmFyaWFibGUgKGdsb2JhbCBhcyBpbiBhdmFpbGFibGUgdG8gYWxsIG91ciBjb21wb25lbnRzIC0gbm90IHRoZSB3aW5kb3cgb2JqZWN0ISlcclxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcclxuICBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoaWcubGFuZyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH1cclxufSkoKTtcclxuXHJcbi8vIEJvb3RzdHJhcCBhcHBcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIGFwcC5pbml0KCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImRlYm91bmNlIiwiZnVuYyIsIndhaXQiLCJpbW1lZGlhdGUiLCJ0aW1lb3V0IiwiY29udGV4dCIsImFyZ3MiLCJhcmd1bWVudHMiLCJsYXRlciIsImFwcGx5IiwiY2FsbE5vdyIsInNldFRpbWVvdXQiLCJib2R5IiwiJCIsIm1lbnVJY29uIiwiY2xvc2VCdXR0b24iLCJzaG93Rm9yTGFyZ2UiLCJzZWFyY2hJbnB1dCIsImhhc1N1Yk5hdiIsImluaXQiLCJzY29wZSIsImNsaWNrIiwiZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJmb2N1cyIsInNuVGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImhhc0NsYXNzIiwib24iLCJpZyIsIl9tb3JlU2VjdGlvbk1lbnVJdGVtIiwiX21vYmlsZUNhdGVnb3J5TWVudSIsIl9jbG9zZUJ1dHRvbiIsIl9vcGVuU29jaWFsRHJhd2VyIiwiX3Jlc2l6ZSIsInJlc2l6ZSIsIndpZHRoIiwiY3NzIiwiZXZlbnQiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInJldHVyblZhbHVlIiwiZXJyIiwid2FybiIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCJvZmZzZXQiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImhpZGUiLCJmYWRlSW4iLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJfbWVzc2FnZXMiLCJleHRlbmQiLCJtZXNzYWdlcyIsImZvcm1hdCIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlTG9jYWxTdG9yYWdlIiwidXBkYXRlZE9iaiIsImZvckVhY2giLCJpdGVtIiwiaSIsImtleXMiLCJtYXAiLCJrIiwicmVzZXRMb2NhbFN0b3JhZ2UiLCJ1bnNlZW4iLCJyYW5kQXJ0aWNsZXMiLCJrZXkiLCJuZXdPYmoiLCJwdXNoIiwic3BsaWNlIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdlbmVyYXRlVGVtcGxhdGUiLCJyYW5kb21BcnRpY2xlcyIsImh0bWwiLCJ0ZW1wbGF0ZURhdGEiLCJhcnRpY2xlIiwiTXVzdGFjaGUiLCJ0b19odG1sIiwiYnVpbGRDYXJvdXNlbCIsIm5vdCIsInNlY3Rpb25UaXRsZSIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCJzZXRJbnRlcnZhbCIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwib3ZlcmxheSIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwidHJhbnNjcmlwdCIsIl9pbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2luamVjdFRlbXBsYXRlIiwidHJhbnNjcmlwdFRleHQiLCJyZXBsYWNlV2l0aCIsImRvY3VtZW50Iiwic2libGluZ3MiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZWwiLCJyZWFkeSIsIl9vblBsYXkiLCJ0YXJnZXQiLCJwYXVzZSIsIl92aWV3U3RhdHVzIiwic2Nyb2xsIiwidmlzaWJsZSIsImFwcCIsImZvdW5kYXRpb24iLCJuYXZpZ2F0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJzaHVmZmxlZENhcm91c2VsIiwidmlkZW8iLCJhY2NvcmRpb24iLCJfbGFuZ3VhZ2UiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtLQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBOUMsSUFBbURILE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQXJHLEVBQXdHO1NBQy9GLElBQVA7RUFERixNQUVPO1NBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPOzs7QUFLUCxBQUFPLElBQUlDLFVBQVUsSUFBSUMsWUFBSixFQUFkOztBQUVQLEFBQU8sSUFBSUMsV0FBVyxTQUFYQSxRQUFXLENBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxTQUFiLEVBQTJCO0tBQzVDQyxPQUFKO1FBQ08sWUFBVztNQUNiQyxVQUFVLElBQWQ7TUFBb0JDLE9BQU9DLFNBQTNCO01BQ0lDLFFBQVEsU0FBUkEsS0FBUSxHQUFXO2FBQ1osSUFBVjtPQUNJLENBQUNMLFNBQUwsRUFBZ0JGLEtBQUtRLEtBQUwsQ0FBV0osT0FBWCxFQUFvQkMsSUFBcEI7R0FGakI7TUFJSUksVUFBVVAsYUFBYSxDQUFDQyxPQUE1QjtlQUNhQSxPQUFiO1lBQ1VPLFdBQVdILEtBQVgsRUFBa0JOLElBQWxCLENBQVY7TUFDSVEsT0FBSixFQUFhVCxLQUFLUSxLQUFMLENBQVdKLE9BQVgsRUFBb0JDLElBQXBCO0VBVGQ7Q0FGTTs7QUM5QlA7O0FBRUEsQUFFQSxpQkFBZSxDQUFDLFlBQU07O0tBR3BCTSxPQUFPQyxFQUFFLE1BQUYsQ0FEUjtLQUVDQyxXQUFXRCxFQUFFLFlBQUYsQ0FGWjtLQUdDRSxjQUFjRixFQUFFLHNCQUFGLENBSGY7S0FJQ0csZUFBZUgsRUFBRSxpQkFBRixDQUpoQjtLQUtDSSxjQUFjSixFQUFFLGdCQUFGLENBTGY7S0FNQ0ssWUFBWUwsRUFBRSxhQUFGLENBTmI7O1VBUVNNLElBQVQsQ0FBY0MsS0FBZCxFQUFxQjtXQUNYQyxLQUFULENBQWUsVUFBQ0MsQ0FBRCxFQUFPO1FBQ2hCQyxRQUFMLENBQWMsV0FBZDtHQUREOztjQUlZRixLQUFaLENBQWtCLFVBQUNDLENBQUQsRUFBTztRQUNuQkUsV0FBTCxDQUFpQixXQUFqQjtHQUREOztlQUlhSCxLQUFiLENBQW1CLFVBQUNDLENBQUQsRUFBTztlQUNiRyxLQUFaO0dBREQ7O1lBSVVKLEtBQVYsQ0FBZ0IsVUFBQ0MsQ0FBRCxFQUFPO09BQ2xCSSxXQUFXYixFQUFFUyxFQUFFSyxhQUFKLENBQWY7T0FDSUQsU0FBU0UsUUFBVCxDQUFrQixRQUFsQixDQUFKLEVBQWtDOzthQUV4QkosV0FBVCxDQUFxQixRQUFyQjtJQUZELE1BR087O2FBRUdELFFBQVQsQ0FBa0IsUUFBbEI7O0dBUEY7OztRQVlNOztFQUFQO0NBbkNjLEdBQWY7O0FDSkE7Ozs7QUFJQSxBQUVBLFdBQWUsQ0FBQyxZQUFNO1dBQ1hKLElBQVQsR0FBZ0I7Ozs7Ozs7O01BUVosd0JBQUYsRUFBNEJVLEVBQTVCLENBQStCLE9BQS9CLEVBQXdDQyxRQUFBLENBQVlDLG9CQUFaLEVBQWtDLEdBQWxDLEVBQXVDLElBQXZDLENBQXhDOzs7TUFHRSxpQ0FBRixFQUFxQ0YsRUFBckMsQ0FBd0MsT0FBeEMsRUFBaURHLG1CQUFqRDs7O01BR0UsZUFBRixFQUFtQkgsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0JJLFlBQS9COzs7TUFHRSx1QkFBRixFQUEyQkosRUFBM0IsQ0FBOEIsT0FBOUIsRUFBdUNLLGlCQUF2Qzs7Ozs7V0FLT0MsT0FBVCxHQUFtQjtNQUNmekMsTUFBRixFQUFVMEMsTUFBVixDQUFpQixZQUFZO1VBQ3ZCdkIsRUFBRW5CLE1BQUYsRUFBVTJDLEtBQVYsTUFBcUIsR0FBekIsRUFBOEI7VUFDMUIsb0JBQUYsRUFBd0JiLFdBQXhCLENBQW9DLFNBQXBDO1lBQ0lYLEVBQUUsb0JBQUYsRUFBd0J5QixHQUF4QixDQUE0QixTQUE1QixNQUEyQyxNQUEvQyxFQUF1RDtZQUNuRCxvQkFBRixFQUF3QkEsR0FBeEIsQ0FBNEIsU0FBNUIsRUFBdUMsT0FBdkM7O09BSEosTUFLTztZQUNEekIsRUFBRSxvQkFBRixFQUF3QnlCLEdBQXhCLENBQTRCLFNBQTVCLE1BQTJDLE9BQS9DLEVBQXdEO1lBQ3BELG9CQUFGLEVBQXdCQSxHQUF4QixDQUE0QixTQUE1QixFQUF1QyxNQUF2Qzs7O0tBUk47OztXQXVCT1Asb0JBQVQsQ0FBOEJRLEtBQTlCLEVBQXFDOztRQUVoQzdDLE9BQU84QyxVQUFQLENBQWtCLG9CQUFsQixFQUF3Q0MsT0FBM0MsRUFBb0Q7VUFDOUM7O2NBRUlDLFdBQU4sR0FBb0IsS0FBcEI7T0FGRixDQUdFLE9BQU1DLEdBQU4sRUFBVztnQkFBVUMsSUFBUixDQUFhLGlDQUFiOzs7WUFFVEMsY0FBTjs7O1FBR0VDLFFBQVFqQyxFQUFFLElBQUYsQ0FBWjtRQUNFa0MsU0FBU0QsTUFBTUMsTUFBTixFQURYO1FBRUVWLFFBQVFTLE1BQU1ULEtBQU4sRUFGVjtRQUdFVyxVQUFVRCxPQUFPRSxJQUFQLEdBQWNaLFFBQVEsQ0FBdEIsR0FBMEIsRUFIdEM7UUFJRWEsWUFBWUosTUFBTUssSUFBTixDQUFXLE9BQVgsRUFBb0JDLEtBQXBCLENBQTBCLHVCQUExQixDQUpkO1FBS0VDLFFBQVFQLE1BQU1RLElBQU4sRUFMVjs7O29CQVFnQkosU0FBaEI7OztpQkFHYUcsS0FBYjs7O3FCQUdpQkwsT0FBakI7Ozs7OztXQU1PTyxlQUFULENBQXlCTCxTQUF6QixFQUFvQztNQUNoQyw4Q0FBRixFQUFrRE0sSUFBbEQ7TUFDRSxNQUFNTixVQUFVLENBQVYsQ0FBUixFQUFzQk8sTUFBdEIsQ0FBNkIsTUFBN0IsRUFBcUNoQyxLQUFyQztNQUNFLDZCQUFGLEVBQWlDRixRQUFqQyxDQUEwQyxRQUExQzs7O1dBR09tQyxZQUFULENBQXNCTCxLQUF0QixFQUE2QjtNQUN6Qiw0QkFBRixFQUFnQ00sT0FBaEM7TUFDRSw2QkFBRixFQUFpQ25DLFdBQWpDLENBQTZDLFFBQTdDO2VBQ1csWUFBTTtRQUNiLDZCQUFGLEVBQWlDRCxRQUFqQyxDQUEwQyxRQUExQyxFQUFvRCtCLElBQXBELENBQXlERCxLQUF6RDtLQURGLEVBRUcsR0FGSDs7O1dBS09PLGdCQUFULENBQTBCWixPQUExQixFQUFtQztNQUMvQixzQ0FBRixFQUEwQ2EsSUFBMUMsR0FBaUR2QixHQUFqRCxDQUFxRCxFQUFFVyxNQUFNRCxPQUFSLEVBQXJEOzs7V0FHT2MsbUJBQVQsR0FBK0I7TUFDM0Isb0JBQUYsRUFBd0J0QyxXQUF4QixDQUFvQyxTQUFwQztlQUNXLFlBQU07UUFDYixvQkFBRixFQUF3QkQsUUFBeEIsQ0FBaUMsU0FBakM7S0FERixFQUVHLEdBRkg7OztXQUtPVSxZQUFULEdBQXdCO01BQ3BCLDhDQUFGLEVBQWtEdUIsSUFBbEQ7TUFDRSxzQ0FBRixFQUEwQ0EsSUFBMUM7TUFDRSxvQkFBRixFQUF3QmhDLFdBQXhCLENBQW9DLFNBQXBDO01BQ0UsNkJBQUYsRUFBaUNBLFdBQWpDLENBQTZDLFFBQTdDO01BQ0UsNEJBQUYsRUFBZ0NpQyxNQUFoQyxDQUF1QyxNQUF2QztNQUNFLDZCQUFGLEVBQWlDakMsV0FBakMsQ0FBNkMsUUFBN0M7OztXQUdPUSxtQkFBVCxHQUErQjtNQUMzQixvQkFBRixFQUF3QitCLFdBQXhCLENBQW9DLFFBQXBDO01BQ0UsSUFBRixFQUFRQSxXQUFSLENBQW9CLFFBQXBCOzs7V0FHTzdCLGlCQUFULEdBQTZCOzs7UUFHdkI4QixpQkFBaUJuRCxFQUFFLElBQUYsRUFBUW9ELElBQVIsRUFBckI7O1FBRUlELGVBQWVwQyxRQUFmLENBQXdCLHdCQUF4QixDQUFKLEVBQXVEO3FCQUN0Q0osV0FBZixDQUEyQix3QkFBM0I7S0FERixNQUVPO3FCQUNVRCxRQUFmLENBQXdCLHdCQUF4Qjs7OztTQUlHOztHQUFQO0NBaklhLEdBQWY7O0FDSkEsWUFBZSxDQUFDLFlBQU07O01BRWhCMkMsV0FBSixFQUNFQyxVQURGLEVBRUVDLFNBRkYsRUFHRUMsS0FIRixFQUlFQyxZQUpGOztXQU1TbkQsSUFBVCxHQUFnQjs7bUJBRUNOLEVBQUUsVUFBRixDQUFmO1lBQ1F5RCxhQUFhQyxJQUFiLENBQWtCLE1BQWxCLENBQVI7a0JBQ2NELGFBQWFDLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFVBQS9CLENBQWQ7Z0JBQ1lGLGFBQWFDLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFFBQS9CLENBQVo7Ozs7Ozs7V0FPT0MsV0FBVCxHQUF1Qjs7UUFFakJDLFNBQVM3RCxFQUFFLGtCQUFGLENBQWI7V0FDTzhELE1BQVAsQ0FBYyxVQUFVQyxRQUFWLEVBQW9CO1FBQzlCLElBQUYsRUFBUXJELFFBQVIsQ0FBaUIsT0FBakI7S0FERjs7TUFJRXNELFNBQUYsQ0FBWUMsV0FBWixDQUF3QjthQUNmLElBRGU7ZUFFYjtLQUZYOztNQUtFRCxTQUFGLENBQVlFLFNBQVosQ0FBc0IsV0FBdEIsRUFBbUMsVUFBVUMsTUFBVixFQUFrQkMsT0FBbEIsRUFBMkI7YUFDckQsS0FBS0MsUUFBTCxDQUFjRCxPQUFkLEtBQ0xELE9BQU81QixLQUFQLENBQWEsK0NBQWIsQ0FERjtLQURGLEVBR0cscUNBSEg7O1VBS00rQixRQUFOLENBQWU7cUJBQ0UseUJBQVk7O09BRGQ7c0JBSUcsd0JBQVVDLEtBQVYsRUFBaUJILE9BQWpCLEVBQTBCOztZQUVwQyxDQUFDcEUsRUFBRW9FLE9BQUYsRUFBV0ksT0FBWCxDQUFtQixNQUFuQixFQUEyQmQsSUFBM0IsQ0FBZ0Msd0JBQWhDLEVBQTBEZSxNQUEvRCxFQUF1RTtZQUNuRUwsT0FBRixFQUFXTSxNQUFYLEdBQW9CQyxNQUFwQixDQUEyQkosS0FBM0I7U0FERixNQUVPO1lBQ0hILE9BQUYsRUFBV0ksT0FBWCxDQUFtQixNQUFuQixFQUEyQmQsSUFBM0IsQ0FBZ0Msd0JBQWhDLEVBQTBEaUIsTUFBMUQsQ0FBaUVKLEtBQWpFOztPQVRTO2FBWU47ZUFDRTtvQkFDSyxJQURMO21CQUVJO1NBSE47Z0JBS0c7b0JBQ0ksSUFESjttQkFFRztTQVBOO3FCQVNRO29CQUNELElBREM7cUJBRUE7U0FYUjttQkFhTTtvQkFDQyxJQUREO3FCQUVFO1NBZlI7a0JBaUJLO29CQUNFLElBREY7cUJBRUc7U0FuQlI7ZUFxQkU7b0JBQ0ssSUFETDtxQkFFTTtTQXZCUjtnQkF5Qkc7b0JBQ0ksSUFESjtxQkFFSzs7O0tBdkNqQjs7VUE0Q01iLElBQU4sQ0FBVyxlQUFYLEVBQTRCMUMsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsWUFBWTthQUMzQ2xDLFFBQVAsQ0FBZ0I4RixPQUFoQixDQUF3QnJCLFNBQXhCO0tBREY7OztXQU1Pc0IsUUFBVCxDQUFrQkMsSUFBbEIsRUFBd0I7UUFDbEJDLFdBQUosRUFDRUMsY0FERjs7UUFHSXhCLE1BQU15QixLQUFOLEVBQUosRUFBbUI7WUFDWHRFLFdBQU4sQ0FBa0IsY0FBbEI7bUJBQ2FELFFBQWIsQ0FBc0IsWUFBdEI7b0JBQ2M4QyxNQUFNMEIsY0FBTixFQUFkOzt1QkFFaUJDLE9BQU9KLFdBQVAsQ0FBakI7O2NBRVFDLGNBQVI7O1dBRUssS0FBUDs7O1dBR09HLE1BQVQsQ0FBZ0J4QixJQUFoQixFQUFzQjs7OztXQUliQSxJQUFQOzs7V0FHT3lCLE9BQVQsQ0FBaUJ6QixJQUFqQixFQUF1QjtNQUNuQjBCLElBQUYsQ0FBTztjQUNHLE1BREg7V0FFQWhDLFdBRkE7WUFHQ007S0FIUixFQUlHMkIsT0FKSCxDQUlXLFVBQVVDLEdBQVYsRUFBZTttQkFDWDdFLFFBQWIsQ0FBc0IsU0FBdEI7bUJBQ2FDLFdBQWIsQ0FBeUIsWUFBekI7S0FORixFQVFHNkUsS0FSSCxDQVFTLFVBQVVELEdBQVYsRUFBZTtZQUNkN0UsUUFBTixDQUFlLGNBQWY7bUJBQ2FDLFdBQWIsQ0FBeUIsWUFBekI7Z0JBQ1U4RSxFQUFWLENBQWF6RixFQUFFLGVBQUYsQ0FBYjtLQVhKOzs7V0FlTzBGLFFBQVQsR0FBb0I7O01BRWhCLFVBQUYsRUFBYzFFLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsWUFBWTtRQUNsQyxpQkFBRixFQUFxQjJCLElBQXJCO1FBQ0UsTUFBTTNDLEVBQUUsSUFBRixFQUFRMkQsSUFBUixDQUFhLFNBQWIsQ0FBUixFQUFpQ1gsSUFBakM7S0FGRjs7O1dBTU8yQyxTQUFULEdBQXFCO1FBQ2YxRSxJQUFBLEtBQVksSUFBaEIsRUFBc0I7UUFDbEIyRSxNQUFGLENBQVU1RixFQUFFZ0UsU0FBRixDQUFZNkIsUUFBdEIsRUFBZ0M7a0JBQ3BCLDJCQURvQjtnQkFFdEIsNkJBRnNCO2VBR3ZCLG1EQUh1QjthQUl6QiwwQ0FKeUI7Y0FLeEIsbUNBTHdCO2lCQU1yQix5Q0FOcUI7Z0JBT3RCLG9DQVBzQjtnQkFRdEIsMENBUnNCO29CQVNsQix1REFUa0I7aUJBVXJCLHlDQVZxQjttQkFXbkIsd0RBWG1CO21CQVluQjdGLEVBQUVnRSxTQUFGLENBQVk4QixNQUFaLENBQW9CLDBDQUFwQixDQVptQjttQkFhbkI5RixFQUFFZ0UsU0FBRixDQUFZOEIsTUFBWixDQUFvQiwyQ0FBcEIsQ0FibUI7cUJBY2pCOUYsRUFBRWdFLFNBQUYsQ0FBWThCLE1BQVosQ0FBb0IsdUVBQXBCLENBZGlCO2VBZXZCOUYsRUFBRWdFLFNBQUYsQ0FBWThCLE1BQVosQ0FBb0IsK0NBQXBCLENBZnVCO2FBZ0J6QjlGLEVBQUVnRSxTQUFGLENBQVk4QixNQUFaLENBQW9CLHdEQUFwQixDQWhCeUI7YUFpQnpCOUYsRUFBRWdFLFNBQUYsQ0FBWThCLE1BQVosQ0FBb0Isd0RBQXBCLENBakJ5QjtjQWtCeEI5RixFQUFFZ0UsU0FBRixDQUFZOEIsTUFBWixDQUFvQiw4Q0FBcEIsQ0FsQndCO2tCQW1CcEI5RixFQUFFZ0UsU0FBRixDQUFZOEIsTUFBWixDQUFvQixvQ0FBcEIsQ0FuQm9CO2tCQW9CcEI5RixFQUFFZ0UsU0FBRixDQUFZOEIsTUFBWixDQUFvQixxQ0FBcEIsQ0FwQm9CO29CQXFCbEI5RixFQUFFZ0UsU0FBRixDQUFZOEIsTUFBWixDQUFvQix5Q0FBcEIsQ0FyQmtCOzhCQXNCUixzRUF0QlE7c0JBdUJoQiwwRUF2QmdCO3FCQXdCakIseUNBeEJpQjtzQkF5QmhCLDRDQXpCZ0I7a0JBMEJwQixrRUExQm9CO2lCQTJCckIsb0VBM0JxQjtlQTRCdkIsZ0VBNUJ1QjtpQkE2QnJCLG1DQTdCcUI7Y0E4QnhCLHlEQTlCd0I7aUJBK0JyQixpREEvQnFCO2lCQWdDckIsaURBaENxQjtrQkFpQ3BCLHdEQWpDb0I7MkJBa0NYOUYsRUFBRWdFLFNBQUYsQ0FBWThCLE1BQVosQ0FBb0IsMkNBQXBCLENBbENXO2dCQW1DdEIsbURBbkNzQjtjQW9DeEIsMENBcEN3Qjt5QkFxQ2IsdURBckNhO2NBc0N4Qiw0Q0F0Q3dCO2NBdUN4Qiw0Q0F2Q3dCOzRCQXdDViw4Q0F4Q1U7ZUF5Q3ZCLHdDQXpDdUI7ZUEwQ3ZCLHdDQTFDdUI7ZUEyQ3ZCLHdDQTNDdUI7c0JBNENoQjtPQTVDaEI7Ozs7U0FpREc7O0dBQVA7Q0F6TGEsR0FBZjs7QUNBQSxlQUFlLENBQUMsWUFBTTs7V0FFWHhGLElBQVQsR0FBZ0I7WUFDTnlGLEdBQVIsQ0FBWSx1QkFBWjs7OztXQUlPQyxjQUFULEdBQTBCO1FBQ3BCQyxTQUFKLEVBQ0VDLFNBREYsRUFFRUMsU0FGRjs7TUFJRSxjQUFGLEVBQWtCQyxJQUFsQixDQUF1QixVQUFVQyxLQUFWLEVBQWlCO2tCQUMxQnJHLEVBQUUsSUFBRixDQUFaO2tCQUNhbUcsVUFBVXhDLElBQVYsQ0FBZSxlQUFmLENBQUQsR0FBb0Msd0VBQXdFd0MsVUFBVXhDLElBQVYsQ0FBZSxlQUFmLENBQXhFLEdBQTBHLGtCQUE5SSxHQUFtSyw2RkFBL0s7a0JBQ2F3QyxVQUFVeEMsSUFBVixDQUFlLGVBQWYsQ0FBRCxHQUFvQyx3RUFBd0V3QyxVQUFVeEMsSUFBVixDQUFlLGVBQWYsQ0FBeEUsR0FBMEcsa0JBQTlJLEdBQW1LLHlGQUEvSzs7Z0JBRVUyQyxLQUFWLENBQWdCO3dCQUNFSCxVQUFVeEMsSUFBVixDQUFlLGdCQUFmLEtBQW9DLEtBRHRDO2dCQUVOd0MsVUFBVXhDLElBQVYsQ0FBZSxRQUFmLEtBQTRCLEtBRnRCO2tCQUdKd0MsVUFBVXhDLElBQVYsQ0FBZSxVQUFmLEtBQThCLEtBSDFCO2NBSVJ3QyxVQUFVeEMsSUFBVixDQUFlLE1BQWYsS0FBMEIsS0FKbEI7Y0FLUndDLFVBQVV4QyxJQUFWLENBQWUsTUFBZixLQUEwQixLQUxsQjtrQkFNSndDLFVBQVV4QyxJQUFWLENBQWUsVUFBZixLQUE4QixLQU4xQjtxQkFPRCxJQVBDO21CQVFIdUMsU0FSRzttQkFTSEQsU0FURztvQkFVRkUsVUFBVXhDLElBQVYsQ0FBZSxZQUFmLEtBQWdDLEVBVjlCO2VBV1B3QyxVQUFVeEMsSUFBVixDQUFlLE9BQWYsS0FBMkIsRUFYcEI7d0JBWUV3QyxVQUFVeEMsSUFBVixDQUFlLGVBQWYsS0FBbUMsQ0FackM7c0JBYUF3QyxVQUFVeEMsSUFBVixDQUFlLGNBQWYsS0FBa0MsQ0FibEM7ZUFjUHdDLFVBQVV4QyxJQUFWLENBQWUsT0FBZixLQUEyQjtPQWRwQztLQUxGOzs7U0F3Qks7O0dBQVA7Q0FwQ2EsR0FBZjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNXQSxBQUVBLHVCQUFlLENBQUMsWUFBTTs7UUFFZDRDLGNBQUosRUFBb0JDLFNBQXBCLEVBQStCQyxJQUEvQixFQUFxQ0MsT0FBckMsRUFBOENDLFlBQTlDOzthQUVTckcsSUFBVCxHQUFnQjs7ZUFFTHNHLGlCQUFQO3lCQUNpQjVHLEVBQUUsdUJBQUYsRUFBMkIyRCxJQUEzQixDQUFnQyxVQUFoQyxFQUE0Q2tELFFBQTdEO2tCQUNVN0csRUFBRSx1QkFBRixFQUEyQjJELElBQTNCLENBQWdDLE1BQWhDLENBQVY7dUJBQ2UzRCxFQUFFLHVCQUFGLEVBQTJCMkQsSUFBM0IsQ0FBZ0MsT0FBaEMsQ0FBZjs7WUFFSSxDQUFDOEMsS0FBS0MsT0FBTCxDQUFMLEVBQW9COzt3QkFFSixFQUFaO1NBRkosTUFHTzt3QkFDU0QsS0FBS0MsT0FBTCxDQUFaOzs7eUJBR2FJLGlCQUFqQjs7O2FBR0tGLGVBQVQsR0FBMkI7WUFDbkIsT0FBT0csT0FBUCxLQUFvQixXQUF4QixFQUFxQzttQkFDMUJDLGFBQWFDLE9BQWIsQ0FBcUIsSUFBckIsSUFBNkJDLEtBQUtDLEtBQUwsQ0FBV0gsYUFBYUMsT0FBYixDQUFxQixJQUFyQixDQUFYLENBQTdCLEdBQXNFRyxZQUE3RTtTQURKLE1BRU87b0JBQ0tyRixJQUFSLENBQWEsZ0NBQWI7Ozs7O2FBS0NxRixVQUFULEdBQXNCO3FCQUNMQyxPQUFiLENBQXFCLElBQXJCLEVBQTJCSCxLQUFLSSxTQUFMLENBQWUsRUFBZixDQUEzQjtlQUNPSixLQUFLQyxLQUFMLENBQVdILGFBQWFDLE9BQWIsQ0FBcUIsSUFBckIsQ0FBWCxDQUFQOzs7YUFHS00sa0JBQVQsQ0FBNEJWLFFBQTVCLEVBQXNDO1lBQzlCVyxhQUFhLFNBQWMsRUFBZCxFQUFrQmhCLFNBQWxCLENBQWpCO2lCQUNTaUIsT0FBVCxDQUFpQixVQUFDQyxJQUFELEVBQU9DLENBQVAsRUFBYTtnQkFDdEJBLEtBQUssQ0FBVCxFQUFZO3VCQUNEQyxJQUFQLENBQVlGLElBQVosRUFBa0JHLEdBQWxCLENBQXNCLFVBQUNDLENBQUQsRUFBTzsrQkFDZEEsQ0FBWCxJQUFnQkosS0FBS0ksQ0FBTCxDQUFoQjtpQkFESjs7U0FGUjs7YUFRS3BCLE9BQUwsSUFBZ0JjLFVBQWhCO3FCQUNhSCxPQUFiLENBQXFCLElBQXJCLEVBQTJCSCxLQUFLSSxTQUFMLENBQWViLElBQWYsQ0FBM0I7OzthQUdLc0IsaUJBQVQsR0FBNkI7ZUFDbEJ0QixLQUFLQyxPQUFMLENBQVA7cUJBQ2FXLE9BQWIsQ0FBcUIsSUFBckIsRUFBMkJILEtBQUtJLFNBQUwsQ0FBZWIsSUFBZixDQUEzQjs7O2FBR0tLLGVBQVQsR0FBMkI7WUFFbkJrQixTQUFTLEVBRGI7WUFFSUMsWUFGSjs7ZUFJT0wsSUFBUCxDQUFZckIsY0FBWixFQUE0QmtCLE9BQTVCLENBQW9DLFVBQUNTLEdBQUQsRUFBTVAsQ0FBTixFQUFZO2dCQUN4Q1EsU0FBUyxFQUFiO21CQUNPRCxHQUFQLElBQWMzQixlQUFlMkIsR0FBZixDQUFkOztnQkFFSSxDQUFDMUIsVUFBVTBCLEdBQVYsQ0FBTCxFQUFxQjt1QkFDVkUsSUFBUCxDQUFZRCxNQUFaOztTQUxSOzt1QkFTZUgsT0FBT0ssTUFBUCxDQUFjLENBQWQsRUFBaUIxQixZQUFqQixDQUFmOztZQUVJc0IsYUFBYXhELE1BQWIsR0FBc0JrQyxZQUExQixFQUF3Qzs7Ozt3QkFJeEIsRUFBWjs7O21CQUdPckcsTUFBUDs7O2VBR0dnSSxRQUFRTCxZQUFSLENBQVA7OzthQUdLSyxPQUFULENBQWlCQyxLQUFqQixFQUF3QjtZQUVoQkMsZUFBZUQsTUFBTTlELE1BRHpCO1lBRUlnRSxjQUZKO1lBRW9CQyxXQUZwQjs7O2VBS08sTUFBTUYsWUFBYixFQUEyQjs7OzBCQUdURyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JMLFlBQTNCLENBQWQ7NEJBQ2dCLENBQWhCOzs7NkJBR2lCRCxNQUFNQyxZQUFOLENBQWpCO2tCQUNNQSxZQUFOLElBQXNCRCxNQUFNRyxXQUFOLENBQXRCO2tCQUNNQSxXQUFOLElBQXFCRCxjQUFyQjs7O2VBR0dGLEtBQVA7OzthQUdLTyxnQkFBVCxDQUEwQkMsY0FBMUIsRUFBMEM7O1lBR2xDQyxJQURKO1lBRUlDLGVBQWUsRUFGbkI7O1lBSUcsQ0FBQ0YsY0FBSixFQUFvQjs7Ozt1QkFFTHRCLE9BQWYsQ0FBdUIsVUFBQ3lCLE9BQUQsRUFBYTttQkFDekJ0QixJQUFQLENBQVlzQixPQUFaLEVBQXFCckIsR0FBckIsQ0FBeUIsVUFBQ0ssR0FBRCxFQUFTOzZCQUNqQkUsSUFBYixDQUFrQmMsUUFBUWhCLEdBQVIsQ0FBbEI7YUFESjtTQURKOztlQU1PaUIsU0FBU0MsT0FBVCxDQUFpQnBKLFFBQU0wRyxPQUFOLEVBQWlCc0MsSUFBakIsRUFBakIsRUFBMEMsRUFBRSxZQUFZQyxZQUFkLEVBQTFDLENBQVA7O1VBRUUsdUJBQUYsRUFBMkJELElBQTNCLENBQWdDQSxJQUFoQzs7MkJBRW1CRCxjQUFuQjs7Ozs7YUFLS00sYUFBVCxHQUF5QjtZQUNqQnBELFNBQUosRUFDSUMsU0FESixFQUVJQyxTQUZKOztVQUlFLGNBQUYsRUFBa0JtRCxHQUFsQixDQUFzQixvQkFBdEIsRUFBNENsRCxJQUE1QyxDQUFpRCxVQUFTQyxLQUFULEVBQWdCOzt3QkFFakRyRyxFQUFFLElBQUYsQ0FBWjt3QkFDYW1HLFVBQVV4QyxJQUFWLENBQWUsZUFBZixDQUFELEdBQW9DLHdFQUF3RXdDLFVBQVV4QyxJQUFWLENBQWUsZUFBZixDQUF4RSxHQUEwRyxrQkFBOUksR0FBbUssNkZBQS9LO3dCQUNhd0MsVUFBVXhDLElBQVYsQ0FBZSxlQUFmLENBQUQsR0FBb0Msd0VBQXdFd0MsVUFBVXhDLElBQVYsQ0FBZSxlQUFmLENBQXhFLEdBQTBHLGtCQUE5SSxHQUFtSyx5RkFBL0s7O3NCQUVVMkMsS0FBVixDQUFnQjtnQ0FDSUgsVUFBVXhDLElBQVYsQ0FBZSxnQkFBZixLQUFvQyxLQUR4Qzt3QkFFSndDLFVBQVV4QyxJQUFWLENBQWUsUUFBZixLQUE0QixLQUZ4QjswQkFHRndDLFVBQVV4QyxJQUFWLENBQWUsVUFBZixLQUE4QixLQUg1QjtzQkFJTndDLFVBQVV4QyxJQUFWLENBQWUsTUFBZixLQUEwQixLQUpwQjtzQkFLTndDLFVBQVV4QyxJQUFWLENBQWUsTUFBZixLQUEwQixLQUxwQjswQkFNRndDLFVBQVV4QyxJQUFWLENBQWUsVUFBZixLQUE4QixLQU41Qjs2QkFPQyxJQVBEOzJCQVFEdUMsU0FSQzsyQkFTREQsU0FUQzs0QkFVQUUsVUFBVXhDLElBQVYsQ0FBZSxZQUFmLEtBQWdDLEVBVmhDO3VCQVdMd0MsVUFBVXhDLElBQVYsQ0FBZSxPQUFmLEtBQTJCLEVBWHRCO2dDQVlJd0MsVUFBVXhDLElBQVYsQ0FBZSxlQUFmLEtBQW1DLENBWnZDOzhCQWFFd0MsVUFBVXhDLElBQVYsQ0FBZSxjQUFmLEtBQWtDLENBYnBDO3VCQWNMd0MsVUFBVXhDLElBQVYsQ0FBZSxPQUFmLEtBQTJCO2FBZHRDO1NBTko7OztXQXlCRzs7S0FBUDtDQTdKVyxHQUFmOztBQ2JBLGdCQUFlLENBQUMsWUFBTTs7S0FFakI0RixlQUFldkosRUFBRSwrQkFBRixDQUFuQjs7VUFFU00sSUFBVCxHQUFnQjtlQUNGRSxLQUFiLENBQW1CLFVBQUNDLENBQUQsRUFBTztPQUNyQjs7TUFFRG9CLFdBQUYsR0FBZ0IsS0FBaEI7SUFGRCxDQUdFLE9BQU1DLEdBQU4sRUFBVztZQUFVQyxJQUFSLENBQWEsaUNBQWI7OztLQUViQyxjQUFGO0dBTkQ7OztRQVVNOztFQUFQO0NBZmMsR0FBZjs7QUNBQSxZQUFlLENBQUMsWUFBTTs7UUFFZHdILFdBQVcsRUFBZjtRQUNJQyxVQUFVLEVBRGQ7UUFFSUMsVUFGSjs7YUFJU3BKLElBQVQsR0FBZ0I7Ozs7O3FCQUtDcUosWUFBWSxZQUFZO2dCQUM3QjNKLEVBQUUsb0JBQUYsRUFBd0J5RSxNQUE1QixFQUFvQzs7OEJBRWxCaUYsVUFBZDs7U0FISyxFQUtWLEdBTFUsQ0FBYjs7Ozs7O2FBV0tFLFlBQVQsR0FBd0I7WUFDaEJDLE1BQUo7WUFDSUMsTUFESjtZQUVJbkcsT0FBTyxFQUZYO1lBR0lvRyxpQkFBaUIsQ0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixNQUFyQixDQUhyQjs7O1VBTUUsaUJBQUYsRUFBcUIzRCxJQUFyQixDQUEwQixZQUFZO3FCQUN6QnBHLEVBQUUsSUFBRixDQUFUO2lCQUNLZ0ssT0FBTCxHQUFlSCxPQUFPbEcsSUFBUCxDQUFZLFNBQVosQ0FBZjtpQkFDS3NHLE1BQUwsR0FBY0osT0FBT2xHLElBQVAsQ0FBWSxRQUFaLENBQWQ7OztnQ0FHb0JBLElBQXBCOzs7bUJBR09ELElBQVAsQ0FBWSxjQUFaLEVBQTRCMEMsSUFBNUIsQ0FBaUMsVUFBVUMsS0FBVixFQUFpQjt5QkFDckNyRyxFQUFFLElBQUYsQ0FBVDs7O3FCQUdLa0ssRUFBTCxHQUFVSixPQUFPbkcsSUFBUCxDQUFZLElBQVosQ0FBVjs7O3FCQUdLd0csT0FBTCxHQUFlTCxPQUFPbkcsSUFBUCxDQUFZLFNBQVosSUFBeUJtRyxPQUFPbkcsSUFBUCxDQUFZLFNBQVosQ0FBekIsR0FBa0QsRUFBakU7cUJBQ0tuQixLQUFMLEdBQWFzSCxPQUFPbkcsSUFBUCxDQUFZLE9BQVosSUFBdUJtRyxPQUFPbkcsSUFBUCxDQUFZLE9BQVosQ0FBdkIsR0FBOEMsRUFBM0Q7cUJBQ0t5RyxXQUFMLEdBQW1CTixPQUFPbkcsSUFBUCxDQUFZLGFBQVosSUFBNkJtRyxPQUFPbkcsSUFBUCxDQUFZLGFBQVosQ0FBN0IsR0FBMEQsRUFBN0U7cUJBQ0swRyxJQUFMLEdBQVlQLE9BQU9uRyxJQUFQLENBQVksVUFBWixJQUEwQixVQUExQixHQUF1QyxFQUFuRDtxQkFDSzJHLElBQUwsR0FBWVIsT0FBT25HLElBQVAsQ0FBWSxVQUFaLElBQTBCLFVBQTFCLEdBQXVDLEVBQW5EO3FCQUNLNEcsT0FBTCxHQUFnQlIsZUFBZS9LLE9BQWYsQ0FBdUI4SyxPQUFPbkcsSUFBUCxDQUFZLFNBQVosQ0FBdkIsSUFBaUQsQ0FBQyxDQUFuRCxHQUF3RG1HLE9BQU9uRyxJQUFQLENBQVksU0FBWixDQUF4RCxHQUFpRixNQUFoRztxQkFDSzZHLFVBQUwsR0FBa0JWLE9BQU9uRyxJQUFQLENBQVksWUFBWixJQUE0Qm1HLE9BQU9uRyxJQUFQLENBQVksWUFBWixDQUE1QixHQUF3RCxFQUExRTs7O3lCQUdTeUUsSUFBVCxDQUFjekUsS0FBS3VHLEVBQW5COzs7Z0NBR2dCSixNQUFoQixFQUF3Qm5HLElBQXhCLEVBQThCMEMsS0FBOUI7YUFuQko7U0FUSjs7O2FBa0NLb0UsbUJBQVQsQ0FBNkI5RyxJQUE3QixFQUFtQztZQUMzQitHLHFEQUFtRC9HLEtBQUtxRyxPQUF4RCxTQUFtRXJHLEtBQUtzRyxNQUF4RSxxQ0FBSjtVQUNFLE1BQUYsRUFBVXRGLE1BQVYsQ0FBaUIrRixPQUFqQjs7O2FBR0tDLGVBQVQsQ0FBeUJiLE1BQXpCLEVBQWlDbkcsSUFBakMsRUFBdUMwQyxLQUF2QyxFQUE4QztZQUN0Q3VFLGlCQUFpQixFQUFDLE1BQU0sWUFBUCxFQUFxQixNQUFNLGVBQTNCLEVBQXJCO1lBQ0k1Qiw4RUFBSjtZQUNJckYsS0FBS3dHLE9BQUwsQ0FBYTFGLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7b0RBQ2FkLEtBQUt1RyxFQUEzQyw0Q0FBbUZ2RyxLQUFLd0csT0FBeEY7O21GQUVtRXhHLEtBQUt1RyxFQUE1RSxtQkFBNEZ2RyxLQUFLNEcsT0FBakcsd0JBQTJINUcsS0FBS3FHLE9BQWhJLHVCQUF5SnJHLEtBQUtzRyxNQUE5SixvREFBbU41RCxLQUFuTiwrQkFBa1AxQyxLQUFLdUcsRUFBdlAsVUFBOFB2RyxLQUFLMkcsSUFBblEsU0FBMlEzRyxLQUFLMEcsSUFBaFI7WUFDSTFHLEtBQUs2RyxVQUFMLENBQWdCL0YsTUFBaEIsR0FBeUIsQ0FBN0IsRUFBZ0M7Z0ZBQ3NDZCxLQUFLNkcsVUFBdkUsVUFBc0ZJLGVBQWUzSixJQUFmLENBQXRGOzttREFFcUMwQyxLQUFLbkIsS0FBOUMsMENBQXdGbUIsS0FBS3lHLFdBQTdGO2lCQUNTTixPQUFPZSxXQUFQLENBQW1CN0IsSUFBbkIsQ0FBVDs7WUFFSXJGLEtBQUt3RyxPQUFULEVBQWtCO2NBQ1pXLFFBQUYsRUFBWTlKLEVBQVosQ0FBZSxPQUFmLEVBQXdCLE1BQU0yQyxLQUFLdUcsRUFBbkMsRUFBdUMsWUFBWTtrQkFDN0MsSUFBRixFQUFRYSxRQUFSLENBQWlCLGdCQUFqQixFQUFtQ3BJLElBQW5DO2FBREo7Ozs7YUFNQ3FJLGdCQUFULEdBQTRCO1lBQ3BCZixNQUFKO2lCQUNTeEMsT0FBVCxDQUFpQixVQUFVd0QsRUFBVixFQUFjO29CQUNuQixNQUFNQSxFQUFkLEVBQWtCQyxLQUFsQixDQUF3QixZQUFZOzt5QkFFdkIsSUFBVDs7dUJBRU9sSyxFQUFQLENBQVUsTUFBVixFQUFrQm1LLE9BQWxCOzt3QkFFUS9DLElBQVIsQ0FBYTZCLE1BQWI7YUFOSjtTQURKOzs7YUFZS2tCLE9BQVQsQ0FBaUIxSyxDQUFqQixFQUFvQjs7WUFFWnlKLEtBQUt6SixFQUFFMkssTUFBRixDQUFTbEIsRUFBbEI7O2dCQUVRekMsT0FBUixDQUFnQixVQUFVd0MsTUFBVixFQUFrQjtnQkFDMUJBLE9BQU9DLEVBQVAsT0FBZ0JBLEVBQXBCLEVBQXdCOzt3QkFFWkQsT0FBT0MsRUFBUCxFQUFSLEVBQXFCbUIsS0FBckI7O1NBSFI7OzthQVFLQyxXQUFULEdBQXVCO1VBQ2pCek0sTUFBRixFQUFVME0sTUFBVixDQUFpQixZQUFZO29CQUNqQjlELE9BQVIsQ0FBZ0IsVUFBVXdDLE1BQVYsRUFBa0I7b0JBQzFCLENBQUNqSyxFQUFFLE1BQU1pSyxPQUFPQyxFQUFQLEVBQVIsRUFBcUJzQixPQUFyQixFQUFMLEVBQXFDOzRCQUN6QnZCLE9BQU9DLEVBQVAsRUFBUixFQUFxQm1CLEtBQXJCOzthQUZSO1NBREo7OztXQVNHOztLQUFQO0NBNUhXLEdBQWY7O0FDRkE7Ozs7Ozs7Ozs7Ozs7QUFhQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBRUE7Ozs7QUFJQSxJQUFNSSxNQUFPLFlBQU07V0FDUm5MLElBQVQsR0FBZ0I7OztNQUdad0ssUUFBRixFQUFZWSxVQUFaOzs7UUFHRzFMLEVBQUUsa0JBQUYsRUFBc0J5RSxNQUF6QixFQUFpQ2tILFdBQVdyTCxJQUFYO1FBQzdCTixFQUFFLFVBQUYsRUFBY3lFLE1BQWxCLEVBQTBCbUgsTUFBTXRMLElBQU47UUFDdEJOLEVBQUUsZUFBRixFQUFtQnlFLE1BQXZCLEVBQStCb0gsS0FBS3ZMLElBQUw7UUFDM0JOLEVBQUUsY0FBRixFQUFrQnlFLE1BQXRCLEVBQThCcUgsU0FBU3hMLElBQVQ7UUFDMUJOLEVBQUUsdUJBQUYsRUFBMkJ5RSxNQUEvQixFQUF1Q3NILGlCQUFpQnpMLElBQWpCO1FBQ25DTixFQUFFLGlCQUFGLEVBQXFCeUUsTUFBekIsRUFBaUN1SCxNQUFNMUwsSUFBTjtRQUM3Qk4sRUFBRSxZQUFGLEVBQWdCeUUsTUFBcEIsRUFBNEJ3SCxVQUFVM0wsSUFBVjs7Ozs7Ozs7Ozs7O1dBWXJCNEwsU0FBVCxHQUFxQjtNQUNqQixNQUFGLEVBQVV4TCxRQUFWLENBQW1CTyxJQUFuQjs7O1NBR0s7O0dBQVA7Q0E3QlUsRUFBWjs7O0FBbUNBakIsRUFBRThLLFFBQUYsRUFBWUksS0FBWixDQUFrQixZQUFZO01BQ3hCNUssSUFBSjtDQURGOzsifQ==