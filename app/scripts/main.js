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
    if ($('.accordion').length) accordion.init();

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMS5qcyIsIm1vZHVsZXMvZXZlbnQtdGVzdC0yLmpzIiwibW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcclxudXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxyXG5cclxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcclxuICovXHJcblxyXG4vLyB1cmwgcGF0aFxyXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG59KSgpXHJcblxyXG4vLyBsYW5ndWFnZVxyXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xyXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLicpICE9PSAtMSB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgcmV0dXJuICdmcic7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnZW4nO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYnJvd3NlciB3aWR0aFxyXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG59KSgpXHJcblxyXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxyXG5leHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5leHBvcnQgdmFyIGRlYm91bmNlID0gKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkgPT4ge1xyXG5cdHZhciB0aW1lb3V0O1xyXG5cdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcclxuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aW1lb3V0ID0gbnVsbDtcclxuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcblx0XHR9O1xyXG5cdFx0dmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XHJcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XHJcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XHJcblx0XHRpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuXHR9O1xyXG59OyIsIi8vQW55IGNvZGUgdGhhdCBpbnZvbHZlcyB0aGUgbWFpbiBuYXZpZ2F0aW9uIGdvZXMgaGVyZVxyXG5cclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcblx0bGV0IFxyXG5cdFx0Ym9keSA9ICQoJ2JvZHknKSxcclxuXHRcdG1lbnVJY29uID0gJCgnLm1lbnUtaWNvbicpLFxyXG5cdFx0Y2xvc2VCdXR0b24gPSAkKCcuY2xvc2UtYnV0dG9uLWNpcmNsZScpLFxyXG5cdFx0c2hvd0ZvckxhcmdlID0gJCgnLnNob3ctZm9yLWxhcmdlJyksXHJcblx0XHRzZWFyY2hJbnB1dCA9ICQoJyNzaXRlLXNlYXJjaC1xJyksXHJcblx0XHRoYXNTdWJOYXYgPSAkKCcuaGFzLXN1Ym5hdicpO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KHNjb3BlKSB7XHJcblx0XHRtZW51SWNvbi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRib2R5LmFkZENsYXNzKCduby1zY3JvbGwnKTtcclxuXHRcdH0pO1x0XHJcblxyXG5cdFx0Y2xvc2VCdXR0b24uY2xpY2soKGUpID0+IHtcclxuXHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHRcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNob3dGb3JMYXJnZS5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRzZWFyY2hJbnB1dC5mb2N1cygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aGFzU3ViTmF2LmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGxldCBzblRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuXHRcdFx0aWYoIHNuVGFyZ2V0Lmhhc0NsYXNzKFwiYWN0aXZlXCIpICkge1xyXG5cdFx0XHRcdC8vZGVhY3RpdmF0ZVxyXG5cdFx0XHRcdHNuVGFyZ2V0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvL2FjdGl2YXRlXHJcblx0XHRcdFx0c25UYXJnZXQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0XHJcblx0fTtcclxufSkoKVxyXG4iLCIvLyBUaGlzIGlzIGxlc3Mgb2YgYSBtb2R1bGUgdGhhbiBpdCBpcyBhIGNvbGxlY3Rpb24gb2YgY29kZSBmb3IgYSBjb21wbGV0ZSBwYWdlIChNb3JlIHBhZ2UgaW4gdGhpcyBjYXNlKS5cclxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXHJcbi8vIGFuZCBzbyBvbi5cclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXHJcbiAgICBfcmVzaXplKCk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgQ2xpY2sgSGFuZGxlcnNcclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGlnLmRlYm91bmNlKF9tb3JlU2VjdGlvbk1lbnVJdGVtLCA1MDAsIHRydWUpKTtcclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xyXG5cclxuICAgIC8vIENsb3NlIGJ1dHRvblxyXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XHJcblxyXG4gICAgLy8gU29jaWFsIGRyYXdlclxyXG4gICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykub24oJ2NsaWNrJywgX29wZW5Tb2NpYWxEcmF3ZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRW5kIG9mIEluaXRcclxuXHJcbiAgZnVuY3Rpb24gX3Jlc2l6ZSgpIHtcclxuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gMzc1KSB7XHJcbiAgICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb3JlU2VjdGlvbk1lbnVJdGVtKGV2ZW50KSB7XHJcblxyXG4gICAgaWYod2luZG93Lm1hdGNoTWVkaWEoXCIobWluLXdpZHRoOiA2NDBweClcIikubWF0Y2hlcykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIC8vSUUgZml4XHJcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgfSBjYXRjaChlcnIpIHsgY29uc29sZS53YXJuKCdldmVudC5yZXR1cm5WYWx1ZSBub3QgYXZhaWxhYmxlJyl9XHJcblxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpLFxyXG4gICAgICB3aWR0aCA9ICR0aGlzLndpZHRoKCksXHJcbiAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxyXG4gICAgICBjbGFzc05hbWUgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC9bXFx3LV0qY2F0ZWdvcnlbXFx3LV0qL2cpLFxyXG4gICAgICB0aXRsZSA9ICR0aGlzLnRleHQoKTtcclxuXHJcbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXHJcbiAgICBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKTtcclxuXHJcbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IHRpdGxlIG9uIGNsaWNrXHJcbiAgICBfZmlsdGVyVGl0bGUodGl0bGUpO1xyXG5cclxuICAgIC8vIEFycm93IHBvc2l0aW9uIG1vdmUgb24gY2xpY2tcclxuICAgIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWClcclxuXHJcbiAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXHJcbiAgICBfYW5pbWF0aW9uVW5kZXJsaW5lKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy4nICsgY2xhc3NOYW1lWzBdKS5mYWRlSW4oJ3Nsb3cnKS5mb2N1cygpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVPdXQoKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5hZGRDbGFzcygnYWN0aXZlJykudGV4dCh0aXRsZSk7XHJcbiAgICB9LCAyMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcclxuICAgIH0sIDEwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21vYmlsZUNhdGVnb3J5TWVudSgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XHJcbiAgICAvLyB0aGlzLm5leHQoKSBzZWxlY3RzIG5leHQgc2libGluZyBlbGVtZW50XHJcbiAgICAvLyBhbnkgc3VnZ2VzdGlvbnMgb24gYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/XHJcbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcclxuXHJcbiAgICBpZiAoanNTb2NpYWxEcmF3ZXIuaGFzQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKSkge1xyXG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIuYWRkQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciBlbmRwb2ludFVSTCxcclxuICAgIHN1Y2Nlc3NVUkwsXHJcbiAgICBjYW5jZWxVUkwsXHJcbiAgICAkZm9ybSxcclxuICAgICRmb3JtV3JhcHBlcjtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXHJcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xyXG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xyXG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XHJcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xyXG5cclxuICAgIF92YWxpZGF0aW9uKCk7XHJcbiAgICBfdG9nZ2xlcigpO1xyXG4gICAgX21lc3NhZ2VzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxyXG4gICAgdmFyIGpJbnB1dCA9ICQoJzppbnB1dCwgdGV4dGFyZWEnKTtcclxuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlLFxyXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcclxuICAgICAgICBwb3N0YWwubWF0Y2goL1thLXpBLVpdWzAtOV1bYS16QS1aXSgtfCB8KVswLTldW2EtekEtWl1bMC05XS8pO1xyXG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XHJcblxyXG4gICAgJGZvcm0udmFsaWRhdGUoe1xyXG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3Byb2Nlc3MoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXHJcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG9uZTI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWwyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xyXG4gICAgdmFyIGZvcm1EYXRhUmF3LFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcclxuXHJcbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcclxuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcclxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xyXG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcclxuXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICB9KVxyXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcclxuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcclxuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbWVzc2FnZXMoKSB7XHJcbiAgICBpZiAoaWcubGFuZyA9PT0gXCJmclwiKSB7XHJcbiAgICAgICQuZXh0ZW5kKCAkLnZhbGlkYXRvci5tZXNzYWdlcywge1xyXG4gICAgICAgIHJlcXVpcmVkOiBcIkNlIGNoYW1wIGVzdCBvYmxpZ2F0b2lyZS5cIixcclxuICAgICAgICByZW1vdGU6IFwiVmV1aWxsZXogY29ycmlnZXIgY2UgY2hhbXAuXCIsXHJcbiAgICAgICAgZW1haWw6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSDDqWxlY3Ryb25pcXVlIHZhbGlkZS5cIixcclxuICAgICAgICB1cmw6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBVUkwgdmFsaWRlLlwiLFxyXG4gICAgICAgIGRhdGU6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGF0ZUlTTzogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZSAoSVNPKS5cIixcclxuICAgICAgICBudW1iZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIHZhbGlkZS5cIixcclxuICAgICAgICBkaWdpdHM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGNoaWZmcmVzLlwiLFxyXG4gICAgICAgIGNyZWRpdGNhcmQ6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIGNhcnRlIGRlIGNyw6lkaXQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGVxdWFsVG86IFwiVmV1aWxsZXogZm91cm5pciBlbmNvcmUgbGEgbcOqbWUgdmFsZXVyLlwiLFxyXG4gICAgICAgIGV4dGVuc2lvbjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgYXZlYyB1bmUgZXh0ZW5zaW9uIHZhbGlkZS5cIixcclxuICAgICAgICBtYXhsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IHBsdXMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICByYW5nZWxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBxdWkgY29udGllbnQgZW50cmUgezB9IGV0IHsxfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIHJhbmdlOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGVudHJlIHswfSBldCB7MX0uXCIgKSxcclxuICAgICAgICBtYXg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgaW5mw6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxyXG4gICAgICAgIG1pbjogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBzdXDDqXJpZXVyZSBvdSDDqWdhbGUgw6AgezB9LlwiICksXHJcbiAgICAgICAgc3RlcDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBtdWx0aXBsZSBkZSB7MH0uXCIgKSxcclxuICAgICAgICBtYXhXb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgcGx1cyB7MH0gbW90cy5cIiApLFxyXG4gICAgICAgIG1pbldvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gbW90cy5cIiApLFxyXG4gICAgICAgIHJhbmdlV29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGVudHJlIHswfSBldCB7MX0gbW90cy5cIiApLFxyXG4gICAgICAgIGxldHRlcnN3aXRoYmFzaWNwdW5jOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzIGV0IGRlcyBzaWduZXMgZGUgcG9uY3R1YXRpb24uXCIsXHJcbiAgICAgICAgYWxwaGFudW1lcmljOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzLCBub21icmVzLCBlc3BhY2VzIGV0IHNvdWxpZ25hZ2VzLlwiLFxyXG4gICAgICAgIGxldHRlcnNvbmx5OiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzLlwiLFxyXG4gICAgICAgIG5vd2hpdGVzcGFjZTogXCJWZXVpbGxleiBuZSBwYXMgaW5zY3JpcmUgZCdlc3BhY2VzIGJsYW5jcy5cIixcclxuICAgICAgICB6aXByYW5nZTogXCJWZXVpbGxleiBmb3VybmlyIHVuIGNvZGUgcG9zdGFsIGVudHJlIDkwMnh4LXh4eHggZXQgOTA1LXh4LXh4eHguXCIsXHJcbiAgICAgICAgaW50ZWdlcjogXCJWZXVpbGxleiBmb3VybmlyIHVuIG5vbWJyZSBub24gZMOpY2ltYWwgcXVpIGVzdCBwb3NpdGlmIG91IG7DqWdhdGlmLlwiLFxyXG4gICAgICAgIHZpblVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkJ2lkZW50aWZpY2F0aW9uIGR1IHbDqWhpY3VsZSAoVklOKS5cIixcclxuICAgICAgICBkYXRlSVRBOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHRpbWU6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgaGV1cmUgdmFsaWRlIGVudHJlIDAwOjAwIGV0IDIzOjU5LlwiLFxyXG4gICAgICAgIHBob25lVVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIHZhbGlkZS5cIixcclxuICAgICAgICBwaG9uZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgbW9iaWxlVUs6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIG1vYmlsZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgc3RyaXBwZWRtaW5sZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIGVtYWlsMjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIMOpbGVjdHJvbmlxdWUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHVybDI6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBVUkwgdmFsaWRlLlwiLFxyXG4gICAgICAgIGNyZWRpdGNhcmR0eXBlczogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgY2FydGUgZGUgY3LDqWRpdCB2YWxpZGUuXCIsXHJcbiAgICAgICAgaXB2NDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY0IHZhbGlkZS5cIixcclxuICAgICAgICBpcHY2OiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgSVAgdjYgdmFsaWRlLlwiLFxyXG4gICAgICAgIHJlcXVpcmVfZnJvbV9ncm91cDogXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBkZSBjZXMgY2hhbXBzLlwiLFxyXG4gICAgICAgIG5pZkVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBOSUYgdmFsaWRlLlwiLFxyXG4gICAgICAgIG5pZUVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBOSUUgdmFsaWRlLlwiLFxyXG4gICAgICAgIGNpZkVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBDSUYgdmFsaWRlLlwiLFxyXG4gICAgICAgIHBvc3RhbENvZGVDQTogXCJWZXVpbGxleiBmb3VybmlyIHVuIGNvZGUgcG9zdGFsIHZhbGlkZS5cIlxyXG4gICAgICB9ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXHJcbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICBuZXh0QXJyb3csXHJcbiAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAkKCcuaWctY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcclxuICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcclxuICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyoqXHJcbiAqIFNodWZmbGVkIENhcm91c2VsXHJcbiAqIFRha2VzIGVpZ2h0IGl0ZW1zIGZyb20gYW4gb2JqZWN0IG9mIDIwLCBhbmQgcmVuZGVycyB0aGVtIGluIGEgY2Fyb3VzZWwgaW4gcmFuZG9tIG9yZGVyLlxyXG4gKlxyXG4gKiBVcG9uIHJlZnJlc2ggb2YgdGhlIGJyb3dzZXIsIHRoZSBmaXJzdCB0d28gaXRlbXMgYXJlIGFkZGVkIHRvIHRoZSBzZWVuSXRlbXMgb2JqZWN0XHJcbiAqIGFuZCB3cml0dGVuIHRvIGxvY2FsIHN0b3JhZ2UsIHdoZW4gdGhlIGFtb3VudCBvZiB1bnNlZW4gaXRlbXMgZHJvcHMgYmVsb3cgOCwgc2Vlbkl0ZW1zIFxyXG4gKiBpcyBjbGVhcmVkIGFuZCB0aGUgY2Fyb3VzZWwgcmVzZXQuXHJcbiAqXHJcbiAqIFRoZXJlIGFyZSB0d28gY29uZmlndXJhYmxlIGRhdGEgYXR0cmlidXRlcyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgdG8gdGhlIG1hcmt1cDpcclxuICogQHBhcmFtIGRhdGEtYXJ0aWNsZXMgPSBUaGUga2V5IG9mIHRoZSBkYXRhIGluIHRoZSBqc29uIG9iamVjdFxyXG4gKiBAcmV0dXJuIGRhdGEtbGltaXQgPSBUaGUgYW1vdW50IG9mIGl0ZW1zIHRvIGJlIHJlbmRlcmVkIGluIHRoZSBjYXJvdXNlbFxyXG4gKiBFeC4gPGRpdiBjbGFzcz1cImlnLXNodWZmbGVkLWNhcm91c2VsXCIgZGF0YS1hcnRpY2xlcz1cImFkdmljZS1zdG9yaWVzXCIgZGF0YS1saW1pdD1cIjhcIj48L2Rpdj5cclxuICovXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgdmFyIGF2YWlsYWJsZUl0ZW1zLCBzZWVuSXRlbXMsIGlnbHMsIGRhdGFLZXksIGFydGljbGVMaW1pdDtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgICAgICBpZ2xzID0gZ2V0TG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgYXZhaWxhYmxlSXRlbXMgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdhcnRpY2xlcycpLmFydGljbGVzO1xyXG4gICAgICAgIGRhdGFLZXkgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCduYW1lJyk7XHJcbiAgICAgICAgYXJ0aWNsZUxpbWl0ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbGltaXQnKTtcclxuXHJcbiAgICAgICAgaWYgKCFpZ2xzW2RhdGFLZXldKSB7XHJcbiAgICAgICAgICAgIC8vb2JqZWN0IGRvZXMgbm90IGV4aXN0IHlldFxyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2VuZXJhdGVUZW1wbGF0ZShnZXRSYW5kQXJ0aWNsZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YoU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikgPyBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpIDogY3JlYXRlSUdMUygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbG9jYWxzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUhJylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJR0xTKCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoe30pKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbFN0b3JhZ2UoYXJ0aWNsZXMpIHtcclxuICAgICAgICB2YXIgdXBkYXRlZE9iaiA9IE9iamVjdC5hc3NpZ24oe30sIHNlZW5JdGVtcyk7XHJcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5tYXAoKGspID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkT2JqW2tdID0gaXRlbVtrXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlnbHNbZGF0YUtleV0gPSB1cGRhdGVkT2JqO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGRlbGV0ZSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJhbmRBcnRpY2xlcygpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgdW5zZWVuID0gW10sXHJcbiAgICAgICAgICAgIHJhbmRBcnRpY2xlczsgICBcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXMoYXZhaWxhYmxlSXRlbXMpLmZvckVhY2goKGtleSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgbmV3T2JqID0ge307XHJcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gYXZhaWxhYmxlSXRlbXNba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2Vlbkl0ZW1zW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHVuc2Vlbi5wdXNoKG5ld09iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmFuZEFydGljbGVzID0gdW5zZWVuLnNwbGljZSgwLCBhcnRpY2xlTGltaXQpO1xyXG5cclxuICAgICAgICBpZiAocmFuZEFydGljbGVzLmxlbmd0aCA8IGFydGljbGVMaW1pdCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdMZXNzIHRoYW4gJyArIGFydGljbGVMaW1pdCArICcgaXRlbXMgbGVmdCB0byB2aWV3LCBlbXB0eWluZyBzZWVuSXRlbXMgYW5kIHJlc3RhcnRpbmcuJyk7XHJcbiAgICAgICAgICAgIC8vVGhlcmUncyBsZXNzIHVuc2VlbiBhcnRpY2xlcyB0aGF0IHRoZSBsaW1pdFxyXG4gICAgICAgICAgICAvL2NsZWFyIHNlZW5JdGVtcywgcmVzZXQgbHMsIGFuZCByZWluaXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgICAgIHJlc2V0TG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBpbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2h1ZmZsZShyYW5kQXJ0aWNsZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLFxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXHJcbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcblxyXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVUZW1wbGF0ZShyYW5kb21BcnRpY2xlcykge1xyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgaHRtbCxcclxuICAgICAgICAgICAgdGVtcGxhdGVEYXRhID0gW107XHJcblxyXG4gICAgICAgIGlmKCFyYW5kb21BcnRpY2xlcykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgcmFuZG9tQXJ0aWNsZXMuZm9yRWFjaCgoYXJ0aWNsZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcnRpY2xlKS5tYXAoKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEYXRhLnB1c2goYXJ0aWNsZVtrZXldKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKCQoYCMke2RhdGFLZXl9YCkuaHRtbCgpLCB7IFwiYXJ0aWNsZXNcIjogdGVtcGxhdGVEYXRhIH0pO1xyXG5cclxuICAgICAgICAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICB1cGRhdGVMb2NhbFN0b3JhZ2UocmFuZG9tQXJ0aWNsZXMpO1xyXG5cclxuICAgICAgICBidWlsZENhcm91c2VsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgICAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICAgICAgICBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAgICAgJCgnLmlnLWNhcm91c2VsJykubm90KCcuc2xpY2staW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICAgICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpXHJcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBzZWN0aW9uVGl0bGUgPSAkKCcuYWNjb3JkaW9uLW1lbnUtc2VjdGlvbi10aXRsZScpO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0c2VjdGlvblRpdGxlLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Ly9JRSBmaXhcclxuXHRcdFx0XHRlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHRcdH0gY2F0Y2goZXJyKSB7IGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpfVxyXG5cdFx0XHRcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdFxyXG5cdH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciB2aWRlb0lEcyA9IFtdLFxyXG4gICAgICAgIHBsYXllcnMgPSBbXSxcclxuICAgICAgICBicmlnaHRDb3ZlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgLy8gV2UgbmVlZCB0byBjYXB0dXJlIHRoZSB2aWRlbyBwbGF5ZXIgc2V0dGluZ3MgZGVmaW5lZCBpbiB0aGUgSFRNTCBhbmQgY3JlYXRlIHRoZSBtYXJrdXAgdGhhdCBCcmlnaHRjb3ZlIHJlcXVpcmVzXHJcbiAgICAgICAgX3BhcnNlVmlkZW9zKCk7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMClcclxuXHJcbiAgICAgICAgLy8gRnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHZpZGVvJ3MgaGF2ZSBzY3JvbGxlZCBvZmYgc2NyZWVuIGFuZCBuZWVkIHRvIGJlIHBhdXNlZFxyXG4gICAgICAgIF92aWV3U3RhdHVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xyXG4gICAgICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgICAgICAgICR2aWRlbyxcclxuICAgICAgICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICAgICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ107XHJcblxyXG4gICAgICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXHJcbiAgICAgICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgICAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcclxuICAgICAgICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKHJlcXVpcmVkKVxyXG4gICAgICAgICAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAob3B0aW9uYWwpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm92ZXJsYXkgPSAkdmlkZW8uZGF0YSgnb3ZlcmxheScpID8gJHZpZGVvLmRhdGEoJ292ZXJsYXknKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJyA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xyXG4gICAgICAgICAgICAgICAgZGF0YS50cmFuc2NyaXB0ID0gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA/ICR2aWRlby5kYXRhKCd0cmFuc2NyaXB0JykgOiAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXHJcbiAgICAgICAgICAgICAgICB2aWRlb0lEcy5wdXNoKGRhdGEuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICAgICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcclxuICAgICAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xyXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcclxuICAgICAgICB2YXIgdHJhbnNjcmlwdFRleHQgPSB7J2VuJzogJ1RyYW5zY3JpcHQnLCAnZnInOiAnVHJhbnNjcmlwdGlvbid9O1xyXG4gICAgICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5gXHJcbiAgICAgICAgaWYgKGRhdGEub3ZlcmxheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheSAke2RhdGEuaWR9XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLyR7ZGF0YS5vdmVybGF5fScpO1wiPjwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBodG1sICs9IGA8dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiJHtkYXRhLmFjY291bnR9XCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiICR7ZGF0YS5jdHJsfSAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gXHJcbiAgICAgICAgaWYgKGRhdGEudHJhbnNjcmlwdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJ2aWRlby10cmFuc2NyaXB0XCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZGF0YS50cmFuc2NyaXB0fVwiPiR7dHJhbnNjcmlwdFRleHRbaWcubGFuZ119PC9hPjwvZGl2PmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwgKz0gYDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICAgICAkdmlkZW8gPSAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLm92ZXJsYXkpIHtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJyMnICsgZGF0YS5pZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnZpZGVvLW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICAgICAgdmFyIHBsYXllcjtcclxuICAgICAgICB2aWRlb0lEcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhc3NpZ24gdGhpcyBwbGF5ZXIgdG8gYSB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gdGhpcztcclxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBhbiBldmVudCBsaXN0ZW5lciBmb3IgcGxheSBldmVudFxyXG4gICAgICAgICAgICAgICAgcGxheWVyLm9uKCdwbGF5JywgX29uUGxheSk7XHJcbiAgICAgICAgICAgICAgICAvLyBwdXNoIHRoZSBwbGF5ZXIgdG8gdGhlIHBsYXllcnMgYXJyYXlcclxuICAgICAgICAgICAgICAgIHBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9vblBsYXkoZSkge1xyXG4gICAgICAgIC8vIGRldGVybWluZSB3aGljaCBwbGF5ZXIgdGhlIGV2ZW50IGlzIGNvbWluZyBmcm9tXHJcbiAgICAgICAgdmFyIGlkID0gZS50YXJnZXQuaWQ7XHJcbiAgICAgICAgLy8gZ28gdGhyb3VnaCBwbGF5ZXJzXHJcbiAgICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHBsYXllci5pZCgpICE9PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gcGF1c2UgdGhlIG90aGVyIHBsYXllcihzKVxyXG4gICAgICAgICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX3ZpZXdTdGF0dXMoKSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISQoJyMnICsgcGxheWVyLmlkKCkpLnZpc2libGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgLy8gRGVmaW5lIGNvbXBvbmVudC1sZXZlbCB2YXJpYWJsZXNcclxuICB2YXIgbWVzc2FnZXMgPSBbXSxcclxuICAgIGNvdW50ZXIgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XHJcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxyXG4gICAgdmFyICR0aGlzID0gJChzY29wZSk7XHJcblxyXG4gICAgLy8gTGV0J3MgY3JlYXRlIGEgbWVzc2FnZSBhcnJheVxyXG4gICAgbWVzc2FnZXMgPSBbJ0hlbGxvIScsICdJcyBpdCBtZSB5b3VcXCdyZSBsb29raW5nIGZvcj8nLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgZXllcycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBzbWlsZScsICdZb3VcXCdyZSBhbGwgSVxcJ3ZlIGV2ZXIgd2FudGVkJywgJ0FuZCBteSBhcm1zIGFyZSBvcGVuIHdpZGUnLCAnXFwnY2F1c2UgeW91IGtub3cganVzdCB3aGF0IHRvIHNheScsICdBbmQgeW91IGtub3cganVzdCB3aGF0IHRvIGRvJywgJ0FuZCBJIHdhbnQgdG8gdGVsbCB5b3Ugc28gbXVjaCddO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIGNsaWNrIGhhbmRsZXJcclxuICAgICR0aGlzLmZpbmQoJ2EuYnV0dG9uLm1lc3NhZ2UnKS5vbignY2xpY2snLCBldmVudCwgX3NheUhlbGxvKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zYXlIZWxsbygpIHtcclxuICAgIC8vIExldCdzIGVtaXQgYW4gZXZlbnQgd2l0aCBhbiBpbmRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCBzZW5kIGFsb25nIHNvbWV0aGluZyB0byBkaXNwbGF5XHJcbiAgICBpZy5lbWl0dGVyLmVtaXQoJ2hlbGxvJywgbWVzc2FnZXNbY291bnRlcl0pO1xyXG4gICAgY291bnRlciArPSAxO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuICB2YXIgJHRoaXNcclxuXHJcbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcclxuICAgICR0aGlzID0gJChzY29wZSk7XHJcbiAgICBfbGlzdGVuZXIoKTtcclxuICB9XHJcblxyXG4gIC8vIFdlIGtub3cgbm90aGluZyBhYm91dCB0aGUgY29tcG9uZW50IHRoYXQgd2lsbCBzZW5kIHRoZSBtZXNzYWdlLiBPbmx5IHRoYXQgaXQgd2lsbCBoYXZlXHJcbiAgLy8gYW4gaWRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCB0aGF0IHdlIHdpbGwgcmVjZWl2ZSBhICdtZXNzYWdlJyB0byBkaXNwbGF5LlxyXG4gIGZ1bmN0aW9uIF9saXN0ZW5lcigpIHtcclxuICAgIGlnLmVtaXR0ZXIub24oJ2hlbGxvJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgICAgJCgnPHAgY2xhc3M9XCJhbGVydC1ib3ggYWxlcnRcIj4nICsgbWVzc2FnZSArICc8L3A+JykuaGlkZSgpLmFwcGVuZFRvKCR0aGlzKS5mYWRlSW4oJ2Zhc3QnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vbmF2aWdhdGlvbi5qcydcclxuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcclxuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xyXG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBzaHVmZmxlZENhcm91c2VsIGZyb20gJy4vc2h1ZmZsZWQtY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xyXG5pbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XHJcbmltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgaWYoJCgnI21haW4tbmF2aWdhdGlvbicpLmxlbmd0aCkgbmF2aWdhdGlvbi5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcclxuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSBtb3JlLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5sZW5ndGgpIHNodWZmbGVkQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5hY2NvcmRpb24nKS5sZW5ndGgpIGFjY29yZGlvbi5pbml0KCk7XHJcblxyXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XHJcblxyXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgIF9sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJzZXRUaW1lb3V0IiwiYm9keSIsIiQiLCJtZW51SWNvbiIsImNsb3NlQnV0dG9uIiwic2hvd0ZvckxhcmdlIiwic2VhcmNoSW5wdXQiLCJoYXNTdWJOYXYiLCJpbml0Iiwic2NvcGUiLCJjbGljayIsImUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZm9jdXMiLCJzblRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJoYXNDbGFzcyIsIm9uIiwiaWciLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJ3aWR0aCIsImNzcyIsImV2ZW50IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJyZXR1cm5WYWx1ZSIsImVyciIsIndhcm4iLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0IiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfZmlsdGVyRHJvcGRvd24iLCJoaWRlIiwiZmFkZUluIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiX21lc3NhZ2VzIiwiZXh0ZW5kIiwibWVzc2FnZXMiLCJmb3JtYXQiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiYXZhaWxhYmxlSXRlbXMiLCJzZWVuSXRlbXMiLCJpZ2xzIiwiZGF0YUtleSIsImFydGljbGVMaW1pdCIsImdldExvY2FsU3RvcmFnZSIsImFydGljbGVzIiwiZ2V0UmFuZEFydGljbGVzIiwiU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJjcmVhdGVJR0xTIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVwZGF0ZUxvY2FsU3RvcmFnZSIsInVwZGF0ZWRPYmoiLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJrZXlzIiwibWFwIiwiayIsInJlc2V0TG9jYWxTdG9yYWdlIiwidW5zZWVuIiwicmFuZEFydGljbGVzIiwia2V5IiwibmV3T2JqIiwicHVzaCIsInNwbGljZSIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZW5lcmF0ZVRlbXBsYXRlIiwicmFuZG9tQXJ0aWNsZXMiLCJodG1sIiwidGVtcGxhdGVEYXRhIiwiYXJ0aWNsZSIsIk11c3RhY2hlIiwidG9faHRtbCIsImJ1aWxkQ2Fyb3VzZWwiLCJub3QiLCJzZWN0aW9uVGl0bGUiLCJ2aWRlb0lEcyIsInBsYXllcnMiLCJicmlnaHRDb3ZlIiwic2V0SW50ZXJ2YWwiLCJfcGFyc2VWaWRlb3MiLCIkZ3JvdXAiLCIkdmlkZW8iLCJwcmVsb2FkT3B0aW9ucyIsImFjY291bnQiLCJwbGF5ZXIiLCJpZCIsIm92ZXJsYXkiLCJkZXNjcmlwdGlvbiIsImF1dG8iLCJjdHJsIiwicHJlbG9hZCIsInRyYW5zY3JpcHQiLCJfaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9pbmplY3RUZW1wbGF0ZSIsInRyYW5zY3JpcHRUZXh0IiwicmVwbGFjZVdpdGgiLCJkb2N1bWVudCIsInNpYmxpbmdzIiwiX2JyaWdodENvdmVSZWFkeSIsImVsIiwicmVhZHkiLCJfb25QbGF5IiwidGFyZ2V0IiwicGF1c2UiLCJfdmlld1N0YXR1cyIsInNjcm9sbCIsInZpc2libGUiLCJjb3VudGVyIiwiX3NheUhlbGxvIiwiZW1pdCIsIl9saXN0ZW5lciIsIm1lc3NhZ2UiLCJhcHBlbmRUbyIsImFwcCIsImZvdW5kYXRpb24iLCJuYXZpZ2F0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJzaHVmZmxlZENhcm91c2VsIiwidmlkZW8iLCJhY2NvcmRpb24iLCJldnQxIiwiZXZ0MiIsIl9sYW5ndWFnZSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNBLEFBQU87OztBQUtQLEFBQU8sSUFBSUEsT0FBUSxZQUFNO0tBQ25CQyxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUE5QyxJQUFtREgsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBckcsRUFBd0c7U0FDL0YsSUFBUDtFQURGLE1BRU87U0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQLEFBQU87OztBQUtQLEFBQU8sSUFBSUMsVUFBVSxJQUFJQyxZQUFKLEVBQWQ7O0FBRVAsQUFBTyxJQUFJ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