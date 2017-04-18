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
//export var emitter = new EventEmitter();

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
            html += '<span class="video-overlay" style="background-image: url(\'../' + data.overlay + '\');"></span>';
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxyXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XHJcblxyXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxyXG4gKi9cclxuXHJcbi8vIHVybCBwYXRoXHJcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbn0pKClcclxuXHJcbi8vIGxhbmd1YWdlXHJcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIuJykgIT09IC0xIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gJ2ZyJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdlbic7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBicm93c2VyIHdpZHRoXHJcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XHJcbn0pKClcclxuXHJcbi8vIGJhc2UgZXZlbnRFbWl0dGVyXHJcbi8vZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuZXhwb3J0IHZhciBkZWJvdW5jZSA9IChmdW5jLCB3YWl0LCBpbW1lZGlhdGUpID0+IHtcclxuXHR2YXIgdGltZW91dDtcclxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGltZW91dCA9IG51bGw7XHJcblx0XHRcdGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0fTtcclxuXHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xyXG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcblx0fTtcclxufTsiLCIvL0FueSBjb2RlIHRoYXQgaW52b2x2ZXMgdGhlIG1haW4gbmF2aWdhdGlvbiBnb2VzIGhlcmVcclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBcclxuXHRcdGJvZHkgPSAkKCdib2R5JyksXHJcblx0XHRtZW51SWNvbiA9ICQoJy5tZW51LWljb24nKSxcclxuXHRcdGNsb3NlQnV0dG9uID0gJCgnLmNsb3NlLWJ1dHRvbi1jaXJjbGUnKSxcclxuXHRcdHNob3dGb3JMYXJnZSA9ICQoJy5zaG93LWZvci1sYXJnZScpLFxyXG5cdFx0c2VhcmNoSW5wdXQgPSAkKCcjc2l0ZS1zZWFyY2gtcScpLFxyXG5cdFx0aGFzU3ViTmF2ID0gJCgnLmhhcy1zdWJuYXYnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG5cdFx0bWVudUljb24uY2xpY2soKGUpID0+IHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblx0XHR9KTtcdFxyXG5cclxuXHRcdGNsb3NlQnV0dG9uLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1x0XHJcblx0XHR9KTtcclxuXHJcblx0XHRzaG93Rm9yTGFyZ2UuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0c2VhcmNoSW5wdXQuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGhhc1N1Yk5hdi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRsZXQgc25UYXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcblx0XHRcdGlmKCBzblRhcmdldC5oYXNDbGFzcyhcImFjdGl2ZVwiKSApIHtcclxuXHRcdFx0XHQvL2RlYWN0aXZhdGVcclxuXHRcdFx0XHRzblRhcmdldC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly9hY3RpdmF0ZVxyXG5cdFx0XHRcdHNuVGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdFxyXG5cdH07XHJcbn0pKClcclxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXHJcbi8vIEF0IHNvbWUgcG9pbnQsIHdlIHNob3VsZCBjb25zaWRlciBzcGxpdHRpbmcgaXQgdXAgaW50byBiaXRlLXNpemVkIHBpZWNlcy4gRXg6IG1vcmUtbmF2LmpzLCBtb3JlLXNvY2lhbC5qc1xyXG4vLyBhbmQgc28gb24uXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxyXG4gICAgX3Jlc2l6ZSgpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBpZy5kZWJvdW5jZShfbW9yZVNlY3Rpb25NZW51SXRlbSwgNTAwLCB0cnVlKSk7XHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcclxuXHJcbiAgICAvLyBDbG9zZSBidXR0b25cclxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xyXG5cclxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcclxuICB9XHJcblxyXG4gIC8vIEVuZCBvZiBJbml0XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDw9IDM3NSkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9yZVNlY3Rpb25NZW51SXRlbShldmVudCkge1xyXG5cclxuICAgIGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1pbi13aWR0aDogNjQwcHgpXCIpLm1hdGNoZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICAvL0lFIGZpeFxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgIH0gY2F0Y2goZXJyKSB7IGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpfVxyXG5cclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcclxuICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICBjZW50ZXJYID0gb2Zmc2V0LmxlZnQgKyB3aWR0aCAvIDIgLSA1MCxcclxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcclxuICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xyXG4gICAgX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSk7XHJcblxyXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcclxuXHJcbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXHJcbiAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxyXG4gICAgX2FuaW1hdGlvblVuZGVybGluZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlckRyb3Bkb3duKGNsYXNzTmFtZSkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcuJyArIGNsYXNzTmFtZVswXSkuZmFkZUluKCdzbG93JykuZm9jdXMoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xyXG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxyXG4gICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xyXG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XHJcblxyXG4gICAgaWYgKGpzU29jaWFsRHJhd2VyLmhhc0NsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJykpIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLmFkZENsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKTtcclxuICAgIF9tZXNzYWdlcygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21lc3NhZ2VzKCkge1xyXG4gICAgaWYgKGlnLmxhbmcgPT09IFwiZnJcIikge1xyXG4gICAgICAkLmV4dGVuZCggJC52YWxpZGF0b3IubWVzc2FnZXMsIHtcclxuICAgICAgICByZXF1aXJlZDogXCJDZSBjaGFtcCBlc3Qgb2JsaWdhdG9pcmUuXCIsXHJcbiAgICAgICAgcmVtb3RlOiBcIlZldWlsbGV6IGNvcnJpZ2VyIGNlIGNoYW1wLlwiLFxyXG4gICAgICAgIGVtYWlsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2Ugw6lsZWN0cm9uaXF1ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdXJsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBkYXRlOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIGRhdGVJU086IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUgKElTTykuXCIsXHJcbiAgICAgICAgbnVtYmVyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGlnaXRzOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBjaGlmZnJlcy5cIixcclxuICAgICAgICBjcmVkaXRjYXJkOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcclxuICAgICAgICBlcXVhbFRvOiBcIlZldWlsbGV6IGZvdXJuaXIgZW5jb3JlIGxhIG3Dqm1lIHZhbGV1ci5cIixcclxuICAgICAgICBleHRlbnNpb246IFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGF2ZWMgdW5lIGV4dGVuc2lvbiB2YWxpZGUuXCIsXHJcbiAgICAgICAgbWF4bGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgcmFuZ2VsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgcXVpIGNvbnRpZW50IGVudHJlIHswfSBldCB7MX0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICByYW5nZTogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBlbnRyZSB7MH0gZXQgezF9LlwiICksXHJcbiAgICAgICAgbWF4OiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGluZsOpcmlldXJlIG91IMOpZ2FsZSDDoCB7MH0uXCIgKSxcclxuICAgICAgICBtaW46ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgc3Vww6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxyXG4gICAgICAgIHN0ZXA6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgbXVsdGlwbGUgZGUgezB9LlwiICksXHJcbiAgICAgICAgbWF4V29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IHBsdXMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICBtaW5Xb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICByYW5nZVdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBlbnRyZSB7MH0gZXQgezF9IG1vdHMuXCIgKSxcclxuICAgICAgICBsZXR0ZXJzd2l0aGJhc2ljcHVuYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcyBldCBkZXMgc2lnbmVzIGRlIHBvbmN0dWF0aW9uLlwiLFxyXG4gICAgICAgIGFscGhhbnVtZXJpYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcywgbm9tYnJlcywgZXNwYWNlcyBldCBzb3VsaWduYWdlcy5cIixcclxuICAgICAgICBsZXR0ZXJzb25seTogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcy5cIixcclxuICAgICAgICBub3doaXRlc3BhY2U6IFwiVmV1aWxsZXogbmUgcGFzIGluc2NyaXJlIGQnZXNwYWNlcyBibGFuY3MuXCIsXHJcbiAgICAgICAgemlwcmFuZ2U6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCBlbnRyZSA5MDJ4eC14eHh4IGV0IDkwNS14eC14eHh4LlwiLFxyXG4gICAgICAgIGludGVnZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBub21icmUgbm9uIGTDqWNpbWFsIHF1aSBlc3QgcG9zaXRpZiBvdSBuw6lnYXRpZi5cIixcclxuICAgICAgICB2aW5VUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZCdpZGVudGlmaWNhdGlvbiBkdSB2w6loaWN1bGUgKFZJTikuXCIsXHJcbiAgICAgICAgZGF0ZUlUQTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZS5cIixcclxuICAgICAgICB0aW1lOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGhldXJlIHZhbGlkZSBlbnRyZSAwMDowMCBldCAyMzo1OS5cIixcclxuICAgICAgICBwaG9uZVVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgcGhvbmVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxyXG4gICAgICAgIG1vYmlsZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSBtb2JpbGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHN0cmlwcGVkbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICBlbWFpbDI6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSDDqWxlY3Ryb25pcXVlIHZhbGlkZS5cIixcclxuICAgICAgICB1cmwyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBjcmVkaXRjYXJkdHlwZXM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIGNhcnRlIGRlIGNyw6lkaXQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGlwdjQ6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NCB2YWxpZGUuXCIsXHJcbiAgICAgICAgaXB2NjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY2IHZhbGlkZS5cIixcclxuICAgICAgICByZXF1aXJlX2Zyb21fZ3JvdXA6IFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gZGUgY2VzIGNoYW1wcy5cIixcclxuICAgICAgICBuaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklGIHZhbGlkZS5cIixcclxuICAgICAgICBuaWVFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklFIHZhbGlkZS5cIixcclxuICAgICAgICBjaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gQ0lGIHZhbGlkZS5cIixcclxuICAgICAgICBwb3N0YWxDb2RlQ0E6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCB2YWxpZGUuXCJcclxuICAgICAgfSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qKlxyXG4gKiBTaHVmZmxlZCBDYXJvdXNlbFxyXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cclxuICpcclxuICogVXBvbiByZWZyZXNoIG9mIHRoZSBicm93c2VyLCB0aGUgZmlyc3QgdHdvIGl0ZW1zIGFyZSBhZGRlZCB0byB0aGUgc2Vlbkl0ZW1zIG9iamVjdFxyXG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcclxuICogaXMgY2xlYXJlZCBhbmQgdGhlIGNhcm91c2VsIHJlc2V0LlxyXG4gKlxyXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XHJcbiAqIEBwYXJhbSBkYXRhLWFydGljbGVzID0gVGhlIGtleSBvZiB0aGUgZGF0YSBpbiB0aGUganNvbiBvYmplY3RcclxuICogQHJldHVybiBkYXRhLWxpbWl0ID0gVGhlIGFtb3VudCBvZiBpdGVtcyB0byBiZSByZW5kZXJlZCBpbiB0aGUgY2Fyb3VzZWxcclxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgaWdscyA9IGdldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgIGF2YWlsYWJsZUl0ZW1zID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnYXJ0aWNsZXMnKS5hcnRpY2xlcztcclxuICAgICAgICBkYXRhS2V5ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbmFtZScpO1xyXG4gICAgICAgIGFydGljbGVMaW1pdCA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2xpbWl0Jyk7XHJcblxyXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xyXG4gICAgICAgICAgICAvL29iamVjdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0gaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGUoZ2V0UmFuZEFydGljbGVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBpZiAodHlwZW9mKFN0b3JhZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2xvY2Fsc3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlIScpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSUdMUygpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KHt9KSk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XHJcbiAgICAgICAgdmFyIHVwZGF0ZWRPYmogPSBPYmplY3QuYXNzaWduKHt9LCBzZWVuSXRlbXMpO1xyXG4gICAgICAgIGFydGljbGVzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkubWFwKChrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZE9ialtrXSA9IGl0ZW1ba107XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBkZWxldGUgaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIHVuc2VlbiA9IFtdLFxyXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7ICAgXHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGF2YWlsYWJsZUl0ZW1zKS5mb3JFYWNoKChrZXksIGkpID0+IHtcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xyXG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IGF2YWlsYWJsZUl0ZW1zW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICB1bnNlZW4ucHVzaChuZXdPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJhbmRBcnRpY2xlcyA9IHVuc2Vlbi5zcGxpY2UoMCwgYXJ0aWNsZUxpbWl0KTtcclxuXHJcbiAgICAgICAgaWYgKHJhbmRBcnRpY2xlcy5sZW5ndGggPCBhcnRpY2xlTGltaXQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVzcyB0aGFuICcgKyBhcnRpY2xlTGltaXQgKyAnIGl0ZW1zIGxlZnQgdG8gdmlldywgZW1wdHlpbmcgc2Vlbkl0ZW1zIGFuZCByZXN0YXJ0aW5nLicpO1xyXG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcclxuICAgICAgICAgICAgLy9jbGVhciBzZWVuSXRlbXMsIHJlc2V0IGxzLCBhbmQgcmVpbml0XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNodWZmbGUocmFuZEFydGljbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUocmFuZG9tQXJ0aWNsZXMpIHtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGh0bWwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZighcmFuZG9tQXJ0aWNsZXMpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHJhbmRvbUFydGljbGVzLmZvckVhY2goKGFydGljbGUpID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJ0aWNsZSkubWFwKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS5wdXNoKGFydGljbGVba2V5XSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBodG1sID0gTXVzdGFjaGUudG9faHRtbCgkKGAjJHtkYXRhS2V5fWApLmh0bWwoKSwgeyBcImFydGljbGVzXCI6IHRlbXBsYXRlRGF0YSB9KTtcclxuXHJcbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgdXBkYXRlTG9jYWxTdG9yYWdlKHJhbmRvbUFydGljbGVzKTtcclxuXHJcbiAgICAgICAgYnVpbGRDYXJvdXNlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICAgICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgICAgICAgbmV4dEFycm93LFxyXG4gICAgICAgICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgICAgICQoJy5pZy1jYXJvdXNlbCcpLm5vdCgnLnNsaWNrLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkoKVxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuXHRsZXQgc2VjdGlvblRpdGxlID0gJCgnLmFjY29yZGlvbi1tZW51LXNlY3Rpb24tdGl0bGUnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdHNlY3Rpb25UaXRsZS5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdC8vSUUgZml4XHJcblx0XHRcdFx0ZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHR9IGNhdGNoKGVycikgeyBjb25zb2xlLndhcm4oJ2V2ZW50LnJldHVyblZhbHVlIG5vdCBhdmFpbGFibGUnKX1cclxuXHRcdFx0XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXRcclxuXHR9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgICB2YXIgdmlkZW9JRHMgPSBbXSxcclxuICAgICAgICBwbGF5ZXJzID0gW10sXHJcbiAgICAgICAgYnJpZ2h0Q292ZTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gY2FwdHVyZSB0aGUgdmlkZW8gcGxheWVyIHNldHRpbmdzIGRlZmluZWQgaW4gdGhlIEhUTUwgYW5kIGNyZWF0ZSB0aGUgbWFya3VwIHRoYXQgQnJpZ2h0Y292ZSByZXF1aXJlc1xyXG4gICAgICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIFZpZGVvSlMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhbmQgZmlyZSByZWFkeSBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgIC8vIEZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB2aWRlbydzIGhhdmUgc2Nyb2xsZWQgb2ZmIHNjcmVlbiBhbmQgbmVlZCB0byBiZSBwYXVzZWRcclxuICAgICAgICBfdmlld1N0YXR1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9wYXJzZVZpZGVvcygpIHtcclxuICAgICAgICB2YXIgJGdyb3VwLFxyXG4gICAgICAgICAgICAkdmlkZW8sXHJcbiAgICAgICAgICAgIGRhdGEgPSB7fSxcclxuICAgICAgICAgICAgcHJlbG9hZE9wdGlvbnMgPSBbJ2F1dG8nLCAnbWV0YWRhdGEnLCAnbm9uZSddO1xyXG5cclxuICAgICAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgICAgICQoJy5pZy12aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgICAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcclxuICAgICAgICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChvcHRpb25hbClcclxuICAgICAgICAgICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JylcclxuICAgICAgICAgICAgICAgICAgICA/ICR2aWRlby5kYXRhKCdvdmVybGF5JylcclxuICAgICAgICAgICAgICAgICAgICA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKFxyXG4gICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbicpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJyA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPlxyXG4gICAgICAgICAgICAgICAgLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcclxuICAgICAgICAgICAgICAgIGRhdGEudHJhbnNjcmlwdCA9ICR2aWRlby5kYXRhKCd0cmFuc2NyaXB0JykgPyAkdmlkZW8uZGF0YShcclxuICAgICAgICAgICAgICAgICAgICAndHJhbnNjcmlwdCcpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmN0YVRlbXBsYXRlID0gJHZpZGVvLmRhdGEoJ2N0YVRlbXBsYXRlJykgPyAkdmlkZW8uZGF0YShcclxuICAgICAgICAgICAgICAgICAgICAnY3RhVGVtcGxhdGUnKSA6ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICAgICAgICAgIHZpZGVvSURzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgICAgICAgICAgX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2luamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XHJcbiAgICAgICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4anMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KSB7XHJcbiAgICAgICAgdmFyIHRyYW5zY3JpcHRUZXh0ID0geydlbic6ICdUcmFuc2NyaXB0JywgJ2ZyJzogJ1RyYW5zY3JpcHRpb24nfSxcclxuICAgICAgICAgICAgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyICR7ZGF0YS5pZH1cIj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5gO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5jdGFUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tY3RhXCI+JHtkYXRhLmN0YVRlbXBsYXRlfTwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGF0YS5vdmVybGF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLyR7ZGF0YS5vdmVybGF5fScpO1wiPjwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBodG1sICs9IGA8dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiJHtkYXRhLmFjY291bnR9XCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiICR7ZGF0YS5jdHJsfSAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gO1xyXG4gICAgICAgIGlmIChkYXRhLnRyYW5zY3JpcHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNjcmlwdFwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEudHJhbnNjcmlwdH1cIj4ke3RyYW5zY3JpcHRUZXh0W2lnLmxhbmddfTwvYT48L2Rpdj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBodG1sICs9IGA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XHJcbiAgICAgICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5vdmVybGF5KSB7XHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcjJyArIGRhdGEuaWQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnZpZGVvLW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfYnJpZ2h0Q292ZVJlYWR5KCkge1xyXG4gICAgICAgIHZhciBwbGF5ZXI7XHJcbiAgICAgICAgdmlkZW9JRHMuZm9yRWFjaChmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiB0aGlzIHBsYXllciB0byBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIub24oJ3BsYXknLCBfb25QbGF5KTtcclxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBhbiBldmVudCBsaXN0ZW5lciBmb3IgZW5kZWQgZXZlbnRcclxuICAgICAgICAgICAgICAgIHBsYXllci5vbignZW5kZWQnLCBfb25Db21wbGV0ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBwdXNoIHRoZSBwbGF5ZXIgdG8gdGhlIHBsYXllcnMgYXJyYXlcclxuICAgICAgICAgICAgICAgIHBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfb25QbGF5KGUpIHtcclxuICAgICAgICAvLyBkZXRlcm1pbmUgd2hpY2ggcGxheWVyIHRoZSBldmVudCBpcyBjb21pbmcgZnJvbVxyXG4gICAgICAgIHZhciBpZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgICAgIC8vIGdvIHRocm91Z2ggcGxheWVyc1xyXG4gICAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbihwbGF5ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHBsYXllci5pZCgpICE9PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gcGF1c2UgdGhlIG90aGVyIHBsYXllcihzKVxyXG4gICAgICAgICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9vbkNvbXBsZXRlKGUpIHtcclxuICAgICAgICAkKCcuJyArIGUudGFyZ2V0LmlkKS5hZGRDbGFzcygnY29tcGxldGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfdmlld1N0YXR1cygpIHtcclxuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24ocGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQoJyMnICsgcGxheWVyLmlkKCkpLnZpc2libGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdCxcclxuICAgIH07XHJcbn0pKCk7IiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vbmF2aWdhdGlvbi5qcydcclxuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcclxuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xyXG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBzaHVmZmxlZENhcm91c2VsIGZyb20gJy4vc2h1ZmZsZWQtY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xyXG4vLyBpbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XHJcbi8vIGltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgaWYoJCgnI21haW4tbmF2aWdhdGlvbicpLmxlbmd0aCkgbmF2aWdhdGlvbi5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcclxuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSBtb3JlLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5sZW5ndGgpIHNodWZmbGVkQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5hY2NvcmRpb24nKS5sZW5ndGgpIGFjY29yZGlvbi5pbml0KCk7XHJcblxyXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgIC8vIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XHJcblxyXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgIF9sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImRlYm91bmNlIiwiZnVuYyIsIndhaXQiLCJpbW1lZGlhdGUiLCJ0aW1lb3V0IiwiY29udGV4dCIsImFyZ3MiLCJhcmd1bWVudHMiLCJsYXRlciIsImFwcGx5IiwiY2FsbE5vdyIsInNldFRpbWVvdXQiLCJib2R5IiwiJCIsIm1lbnVJY29uIiwiY2xvc2VCdXR0b24iLCJzaG93Rm9yTGFyZ2UiLCJzZWFyY2hJbnB1dCIsImhhc1N1Yk5hdiIsImluaXQiLCJzY29wZSIsImNsaWNrIiwiZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJmb2N1cyIsInNuVGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImhhc0NsYXNzIiwib24iLCJpZyIsIl9tb3JlU2VjdGlvbk1lbnVJdGVtIiwiX21vYmlsZUNhdGVnb3J5TWVudSIsIl9jbG9zZUJ1dHRvbiIsIl9vcGVuU29jaWFsRHJhd2VyIiwiX3Jlc2l6ZSIsInJlc2l6ZSIsIndpZHRoIiwiY3NzIiwiZXZlbnQiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInJldHVyblZhbHVlIiwiZXJyIiwid2FybiIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCJvZmZzZXQiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImhpZGUiLCJmYWRlSW4iLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJfbWVzc2FnZXMiLCJleHRlbmQiLCJtZXNzYWdlcyIsImZvcm1hdCIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlTG9jYWxTdG9yYWdlIiwidXBkYXRlZE9iaiIsImZvckVhY2giLCJpdGVtIiwiaSIsImtleXMiLCJtYXAiLCJrIiwicmVzZXRMb2NhbFN0b3JhZ2UiLCJ1bnNlZW4iLCJyYW5kQXJ0aWNsZXMiLCJrZXkiLCJuZXdPYmoiLCJwdXNoIiwic3BsaWNlIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdlbmVyYXRlVGVtcGxhdGUiLCJyYW5kb21BcnRpY2xlcyIsImh0bWwiLCJ0ZW1wbGF0ZURhdGEiLCJhcnRpY2xlIiwiTXVzdGFjaGUiLCJ0b19odG1sIiwiYnVpbGRDYXJvdXNlbCIsIm5vdCIsInNlY3Rpb25UaXRsZSIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCJzZXRJbnRlcnZhbCIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwib3ZlcmxheSIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwidHJhbnNjcmlwdCIsImN0YVRlbXBsYXRlIiwiX2luamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfaW5qZWN0VGVtcGxhdGUiLCJ0cmFuc2NyaXB0VGV4dCIsInJlcGxhY2VXaXRoIiwiZG9jdW1lbnQiLCJzaWJsaW5ncyIsIl9icmlnaHRDb3ZlUmVhZHkiLCJlbCIsInJlYWR5IiwiX29uUGxheSIsIl9vbkNvbXBsZXRlIiwidGFyZ2V0IiwicGF1c2UiLCJfdmlld1N0YXR1cyIsInNjcm9sbCIsInZpc2libGUiLCJhcHAiLCJmb3VuZGF0aW9uIiwibmF2aWdhdGlvbiIsImZvcm1zIiwibW9yZSIsImNhcm91c2VsIiwic2h1ZmZsZWRDYXJvdXNlbCIsInZpZGVvIiwiYWNjb3JkaW9uIiwiX2xhbmd1YWdlIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07S0FDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQTlDLElBQW1ESCxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUFyRyxFQUF3RztTQUMvRixJQUFQO0VBREYsTUFFTztTQUNFLElBQVA7O0NBSmMsRUFBWDs7O0FBU1AsQUFBTzs7Ozs7QUFPUCxBQUFPLElBQUlDLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBYUMsU0FBYixFQUEyQjtLQUM1Q0MsT0FBSjtRQUNPLFlBQVc7TUFDYkMsVUFBVSxJQUFkO01BQW9CQyxPQUFPQyxTQUEzQjtNQUNJQyxRQUFRLFNBQVJBLEtBQVEsR0FBVzthQUNaLElBQVY7T0FDSSxDQUFDTCxTQUFMLEVBQWdCRixLQUFLUSxLQUFMLENBQVdKLE9BQVgsRUFBb0JDLElBQXBCO0dBRmpCO01BSUlJLFVBQVVQLGFBQWEsQ0FBQ0MsT0FBNUI7ZUFDYUEsT0FBYjtZQUNVTyxXQUFXSCxLQUFYLEVBQWtCTixJQUFsQixDQUFWO01BQ0lRLE9B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