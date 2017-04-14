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
	    closeButton = $('.close-button-circle');

	function init(scope) {
		menuIcon.click(function (e) {
			body.addClass('no-scroll');
		});

		closeButton.click(function (e) {
			body.removeClass('no-scroll');
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci4nKSAhPT0gLTEgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuZXhwb3J0IHZhciBkZWJvdW5jZSA9IChmdW5jLCB3YWl0LCBpbW1lZGlhdGUpID0+IHtcclxuXHR2YXIgdGltZW91dDtcclxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGltZW91dCA9IG51bGw7XHJcblx0XHRcdGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0fTtcclxuXHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xyXG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcblx0fTtcclxufTsiLCIvL0FueSBjb2RlIHRoYXQgaW52b2x2ZXMgdGhlIG1haW4gbmF2aWdhdGlvbiBnb2VzIGhlcmVcclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBcclxuXHRcdGJvZHkgPSAkKCdib2R5JyksXHJcblx0XHRtZW51SWNvbiA9ICQoJy5tZW51LWljb24nKSxcclxuXHRcdGNsb3NlQnV0dG9uID0gJCgnLmNsb3NlLWJ1dHRvbi1jaXJjbGUnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG5cdFx0bWVudUljb24uY2xpY2soKGUpID0+IHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblx0XHR9KTtcdFxyXG5cclxuXHRcdGNsb3NlQnV0dG9uLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1x0XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0XHJcblx0fTtcclxufSkoKVxyXG4iLCIvLyBUaGlzIGlzIGxlc3Mgb2YgYSBtb2R1bGUgdGhhbiBpdCBpcyBhIGNvbGxlY3Rpb24gb2YgY29kZSBmb3IgYSBjb21wbGV0ZSBwYWdlIChNb3JlIHBhZ2UgaW4gdGhpcyBjYXNlKS5cclxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXHJcbi8vIGFuZCBzbyBvbi5cclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXHJcbiAgICBfcmVzaXplKCk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgQ2xpY2sgSGFuZGxlcnNcclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGlnLmRlYm91bmNlKF9tb3JlU2VjdGlvbk1lbnVJdGVtLCA1MDAsIHRydWUpKTtcclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xyXG5cclxuICAgIC8vIENsb3NlIGJ1dHRvblxyXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XHJcblxyXG4gICAgLy8gU29jaWFsIGRyYXdlclxyXG4gICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykub24oJ2NsaWNrJywgX29wZW5Tb2NpYWxEcmF3ZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gRW5kIG9mIEluaXRcclxuXHJcbiAgZnVuY3Rpb24gX3Jlc2l6ZSgpIHtcclxuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gMzc1KSB7XHJcbiAgICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb3JlU2VjdGlvbk1lbnVJdGVtKGV2ZW50KSB7XHJcblxyXG4gICAgaWYod2luZG93Lm1hdGNoTWVkaWEoXCIobWluLXdpZHRoOiA2NDBweClcIikubWF0Y2hlcykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIC8vSUUgZml4XHJcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgfSBjYXRjaChlcnIpIHsgY29uc29sZS53YXJuKCdldmVudC5yZXR1cm5WYWx1ZSBub3QgYXZhaWxhYmxlJyl9XHJcblxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpLFxyXG4gICAgICB3aWR0aCA9ICR0aGlzLndpZHRoKCksXHJcbiAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxyXG4gICAgICBjbGFzc05hbWUgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC9bXFx3LV0qY2F0ZWdvcnlbXFx3LV0qL2cpLFxyXG4gICAgICB0aXRsZSA9ICR0aGlzLnRleHQoKTtcclxuXHJcbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXHJcbiAgICBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKTtcclxuXHJcbiAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IHRpdGxlIG9uIGNsaWNrXHJcbiAgICBfZmlsdGVyVGl0bGUodGl0bGUpO1xyXG5cclxuICAgIC8vIEFycm93IHBvc2l0aW9uIG1vdmUgb24gY2xpY2tcclxuICAgIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWClcclxuXHJcbiAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXHJcbiAgICBfYW5pbWF0aW9uVW5kZXJsaW5lKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy4nICsgY2xhc3NOYW1lWzBdKS5mYWRlSW4oJ3Nsb3cnKS5mb2N1cygpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVPdXQoKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5hZGRDbGFzcygnYWN0aXZlJykudGV4dCh0aXRsZSk7XHJcbiAgICB9LCAyMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcclxuICAgIH0sIDEwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21vYmlsZUNhdGVnb3J5TWVudSgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XHJcbiAgICAvLyB0aGlzLm5leHQoKSBzZWxlY3RzIG5leHQgc2libGluZyBlbGVtZW50XHJcbiAgICAvLyBhbnkgc3VnZ2VzdGlvbnMgb24gYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/XHJcbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcclxuXHJcbiAgICBpZiAoanNTb2NpYWxEcmF3ZXIuaGFzQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKSkge1xyXG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIuYWRkQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciBlbmRwb2ludFVSTCxcclxuICAgIHN1Y2Nlc3NVUkwsXHJcbiAgICBjYW5jZWxVUkwsXHJcbiAgICAkZm9ybSxcclxuICAgICRmb3JtV3JhcHBlcjtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXHJcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xyXG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xyXG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XHJcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xyXG5cclxuICAgIF92YWxpZGF0aW9uKCk7XHJcbiAgICBfdG9nZ2xlcigpO1xyXG4gICAgX21lc3NhZ2VzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxyXG4gICAgdmFyIGpJbnB1dCA9ICQoJzppbnB1dCwgdGV4dGFyZWEnKTtcclxuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlLFxyXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcclxuICAgICAgICBwb3N0YWwubWF0Y2goL1thLXpBLVpdWzAtOV1bYS16QS1aXSgtfCB8KVswLTldW2EtekEtWl1bMC05XS8pO1xyXG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XHJcblxyXG4gICAgJGZvcm0udmFsaWRhdGUoe1xyXG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3Byb2Nlc3MoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXHJcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG9uZTI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWwyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xyXG4gICAgdmFyIGZvcm1EYXRhUmF3LFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcclxuXHJcbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcclxuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcclxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xyXG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcclxuXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICB9KVxyXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcclxuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcclxuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbWVzc2FnZXMoKSB7XHJcbiAgICBpZiAoaWcubGFuZyA9PT0gXCJmclwiKSB7XHJcbiAgICAgICQuZXh0ZW5kKCAkLnZhbGlkYXRvci5tZXNzYWdlcywge1xyXG4gICAgICAgIHJlcXVpcmVkOiBcIkNlIGNoYW1wIGVzdCBvYmxpZ2F0b2lyZS5cIixcclxuICAgICAgICByZW1vdGU6IFwiVmV1aWxsZXogY29ycmlnZXIgY2UgY2hhbXAuXCIsXHJcbiAgICAgICAgZW1haWw6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSDDqWxlY3Ryb25pcXVlIHZhbGlkZS5cIixcclxuICAgICAgICB1cmw6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBVUkwgdmFsaWRlLlwiLFxyXG4gICAgICAgIGRhdGU6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGF0ZUlTTzogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZSAoSVNPKS5cIixcclxuICAgICAgICBudW1iZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIHZhbGlkZS5cIixcclxuICAgICAgICBkaWdpdHM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGNoaWZmcmVzLlwiLFxyXG4gICAgICAgIGNyZWRpdGNhcmQ6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIGNhcnRlIGRlIGNyw6lkaXQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGVxdWFsVG86IFwiVmV1aWxsZXogZm91cm5pciBlbmNvcmUgbGEgbcOqbWUgdmFsZXVyLlwiLFxyXG4gICAgICAgIGV4dGVuc2lvbjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgYXZlYyB1bmUgZXh0ZW5zaW9uIHZhbGlkZS5cIixcclxuICAgICAgICBtYXhsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IHBsdXMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICByYW5nZWxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBxdWkgY29udGllbnQgZW50cmUgezB9IGV0IHsxfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIHJhbmdlOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGVudHJlIHswfSBldCB7MX0uXCIgKSxcclxuICAgICAgICBtYXg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgaW5mw6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxyXG4gICAgICAgIG1pbjogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBzdXDDqXJpZXVyZSBvdSDDqWdhbGUgw6AgezB9LlwiICksXHJcbiAgICAgICAgc3RlcDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBtdWx0aXBsZSBkZSB7MH0uXCIgKSxcclxuICAgICAgICBtYXhXb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgcGx1cyB7MH0gbW90cy5cIiApLFxyXG4gICAgICAgIG1pbldvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gbW90cy5cIiApLFxyXG4gICAgICAgIHJhbmdlV29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGVudHJlIHswfSBldCB7MX0gbW90cy5cIiApLFxyXG4gICAgICAgIGxldHRlcnN3aXRoYmFzaWNwdW5jOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzIGV0IGRlcyBzaWduZXMgZGUgcG9uY3R1YXRpb24uXCIsXHJcbiAgICAgICAgYWxwaGFudW1lcmljOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzLCBub21icmVzLCBlc3BhY2VzIGV0IHNvdWxpZ25hZ2VzLlwiLFxyXG4gICAgICAgIGxldHRlcnNvbmx5OiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBsZXR0cmVzLlwiLFxyXG4gICAgICAgIG5vd2hpdGVzcGFjZTogXCJWZXVpbGxleiBuZSBwYXMgaW5zY3JpcmUgZCdlc3BhY2VzIGJsYW5jcy5cIixcclxuICAgICAgICB6aXByYW5nZTogXCJWZXVpbGxleiBmb3VybmlyIHVuIGNvZGUgcG9zdGFsIGVudHJlIDkwMnh4LXh4eHggZXQgOTA1LXh4LXh4eHguXCIsXHJcbiAgICAgICAgaW50ZWdlcjogXCJWZXVpbGxleiBmb3VybmlyIHVuIG5vbWJyZSBub24gZMOpY2ltYWwgcXVpIGVzdCBwb3NpdGlmIG91IG7DqWdhdGlmLlwiLFxyXG4gICAgICAgIHZpblVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkJ2lkZW50aWZpY2F0aW9uIGR1IHbDqWhpY3VsZSAoVklOKS5cIixcclxuICAgICAgICBkYXRlSVRBOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHRpbWU6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgaGV1cmUgdmFsaWRlIGVudHJlIDAwOjAwIGV0IDIzOjU5LlwiLFxyXG4gICAgICAgIHBob25lVVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIHZhbGlkZS5cIixcclxuICAgICAgICBwaG9uZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgbW9iaWxlVUs6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIG1vYmlsZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgc3RyaXBwZWRtaW5sZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIGVtYWlsMjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIMOpbGVjdHJvbmlxdWUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHVybDI6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBVUkwgdmFsaWRlLlwiLFxyXG4gICAgICAgIGNyZWRpdGNhcmR0eXBlczogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgY2FydGUgZGUgY3LDqWRpdCB2YWxpZGUuXCIsXHJcbiAgICAgICAgaXB2NDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY0IHZhbGlkZS5cIixcclxuICAgICAgICBpcHY2OiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgSVAgdjYgdmFsaWRlLlwiLFxyXG4gICAgICAgIHJlcXVpcmVfZnJvbV9ncm91cDogXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBkZSBjZXMgY2hhbXBzLlwiLFxyXG4gICAgICAgIG5pZkVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBOSUYgdmFsaWRlLlwiLFxyXG4gICAgICAgIG5pZUVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBOSUUgdmFsaWRlLlwiLFxyXG4gICAgICAgIGNpZkVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBDSUYgdmFsaWRlLlwiLFxyXG4gICAgICAgIHBvc3RhbENvZGVDQTogXCJWZXVpbGxleiBmb3VybmlyIHVuIGNvZGUgcG9zdGFsIHZhbGlkZS5cIlxyXG4gICAgICB9ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXHJcbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICBuZXh0QXJyb3csXHJcbiAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAkKCcuaWctY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcclxuICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcclxuICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyoqXHJcbiAqIFNodWZmbGVkIENhcm91c2VsXHJcbiAqIFRha2VzIGVpZ2h0IGl0ZW1zIGZyb20gYW4gb2JqZWN0IG9mIDIwLCBhbmQgcmVuZGVycyB0aGVtIGluIGEgY2Fyb3VzZWwgaW4gcmFuZG9tIG9yZGVyLlxyXG4gKlxyXG4gKiBVcG9uIHJlZnJlc2ggb2YgdGhlIGJyb3dzZXIsIHRoZSBmaXJzdCB0d28gaXRlbXMgYXJlIGFkZGVkIHRvIHRoZSBzZWVuSXRlbXMgb2JqZWN0XHJcbiAqIGFuZCB3cml0dGVuIHRvIGxvY2FsIHN0b3JhZ2UsIHdoZW4gdGhlIGFtb3VudCBvZiB1bnNlZW4gaXRlbXMgZHJvcHMgYmVsb3cgOCwgc2Vlbkl0ZW1zIFxyXG4gKiBpcyBjbGVhcmVkIGFuZCB0aGUgY2Fyb3VzZWwgcmVzZXQuXHJcbiAqXHJcbiAqIFRoZXJlIGFyZSB0d28gY29uZmlndXJhYmxlIGRhdGEgYXR0cmlidXRlcyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgdG8gdGhlIG1hcmt1cDpcclxuICogQHBhcmFtIGRhdGEtYXJ0aWNsZXMgPSBUaGUga2V5IG9mIHRoZSBkYXRhIGluIHRoZSBqc29uIG9iamVjdFxyXG4gKiBAcmV0dXJuIGRhdGEtbGltaXQgPSBUaGUgYW1vdW50IG9mIGl0ZW1zIHRvIGJlIHJlbmRlcmVkIGluIHRoZSBjYXJvdXNlbFxyXG4gKiBFeC4gPGRpdiBjbGFzcz1cImlnLXNodWZmbGVkLWNhcm91c2VsXCIgZGF0YS1hcnRpY2xlcz1cImFkdmljZS1zdG9yaWVzXCIgZGF0YS1saW1pdD1cIjhcIj48L2Rpdj5cclxuICovXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgdmFyIGF2YWlsYWJsZUl0ZW1zLCBzZWVuSXRlbXMsIGlnbHMsIGRhdGFLZXksIGFydGljbGVMaW1pdDtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgICAgICBpZ2xzID0gZ2V0TG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgYXZhaWxhYmxlSXRlbXMgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdhcnRpY2xlcycpLmFydGljbGVzO1xyXG4gICAgICAgIGRhdGFLZXkgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCduYW1lJyk7XHJcbiAgICAgICAgYXJ0aWNsZUxpbWl0ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbGltaXQnKTtcclxuXHJcbiAgICAgICAgaWYgKCFpZ2xzW2RhdGFLZXldKSB7XHJcbiAgICAgICAgICAgIC8vb2JqZWN0IGRvZXMgbm90IGV4aXN0IHlldFxyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2VuZXJhdGVUZW1wbGF0ZShnZXRSYW5kQXJ0aWNsZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YoU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikgPyBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpIDogY3JlYXRlSUdMUygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbG9jYWxzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUhJylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJR0xTKCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoe30pKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbFN0b3JhZ2UoYXJ0aWNsZXMpIHtcclxuICAgICAgICB2YXIgdXBkYXRlZE9iaiA9IE9iamVjdC5hc3NpZ24oe30sIHNlZW5JdGVtcyk7XHJcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5tYXAoKGspID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkT2JqW2tdID0gaXRlbVtrXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlnbHNbZGF0YUtleV0gPSB1cGRhdGVkT2JqO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGRlbGV0ZSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJhbmRBcnRpY2xlcygpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgdW5zZWVuID0gW10sXHJcbiAgICAgICAgICAgIHJhbmRBcnRpY2xlczsgICBcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXMoYXZhaWxhYmxlSXRlbXMpLmZvckVhY2goKGtleSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgbmV3T2JqID0ge307XHJcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gYXZhaWxhYmxlSXRlbXNba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2Vlbkl0ZW1zW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHVuc2Vlbi5wdXNoKG5ld09iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmFuZEFydGljbGVzID0gdW5zZWVuLnNwbGljZSgwLCBhcnRpY2xlTGltaXQpO1xyXG5cclxuICAgICAgICBpZiAocmFuZEFydGljbGVzLmxlbmd0aCA8IGFydGljbGVMaW1pdCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdMZXNzIHRoYW4gJyArIGFydGljbGVMaW1pdCArICcgaXRlbXMgbGVmdCB0byB2aWV3LCBlbXB0eWluZyBzZWVuSXRlbXMgYW5kIHJlc3RhcnRpbmcuJyk7XHJcbiAgICAgICAgICAgIC8vVGhlcmUncyBsZXNzIHVuc2VlbiBhcnRpY2xlcyB0aGF0IHRoZSBsaW1pdFxyXG4gICAgICAgICAgICAvL2NsZWFyIHNlZW5JdGVtcywgcmVzZXQgbHMsIGFuZCByZWluaXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgICAgIHJlc2V0TG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBpbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2h1ZmZsZShyYW5kQXJ0aWNsZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLFxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXHJcbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcblxyXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVUZW1wbGF0ZShyYW5kb21BcnRpY2xlcykge1xyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgaHRtbCxcclxuICAgICAgICAgICAgdGVtcGxhdGVEYXRhID0gW107XHJcblxyXG4gICAgICAgIGlmKCFyYW5kb21BcnRpY2xlcykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgcmFuZG9tQXJ0aWNsZXMuZm9yRWFjaCgoYXJ0aWNsZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcnRpY2xlKS5tYXAoKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEYXRhLnB1c2goYXJ0aWNsZVtrZXldKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKCQoYCMke2RhdGFLZXl9YCkuaHRtbCgpLCB7IFwiYXJ0aWNsZXNcIjogdGVtcGxhdGVEYXRhIH0pO1xyXG5cclxuICAgICAgICAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICB1cGRhdGVMb2NhbFN0b3JhZ2UocmFuZG9tQXJ0aWNsZXMpO1xyXG5cclxuICAgICAgICBidWlsZENhcm91c2VsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgICAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICAgICAgICBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAgICAgJCgnLmlnLWNhcm91c2VsJykubm90KCcuc2xpY2staW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICAgICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpXHJcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgdmFyIHZpZGVvSURzID0gW10sXHJcbiAgICAgICAgcGxheWVycyA9IFtdLFxyXG4gICAgICAgIGJyaWdodENvdmU7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGNhcHR1cmUgdGhlIHZpZGVvIHBsYXllciBzZXR0aW5ncyBkZWZpbmVkIGluIHRoZSBIVE1MIGFuZCBjcmVhdGUgdGhlIG1hcmt1cCB0aGF0IEJyaWdodGNvdmUgcmVxdWlyZXNcclxuICAgICAgICBfcGFyc2VWaWRlb3MoKTtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGJyaWdodENvdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwKVxyXG5cclxuICAgICAgICAvLyBGdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdmlkZW8ncyBoYXZlIHNjcm9sbGVkIG9mZiBzY3JlZW4gYW5kIG5lZWQgdG8gYmUgcGF1c2VkXHJcbiAgICAgICAgX3ZpZXdTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XHJcbiAgICAgICAgdmFyICRncm91cCxcclxuICAgICAgICAgICAgJHZpZGVvLFxyXG4gICAgICAgICAgICBkYXRhID0ge30sXHJcbiAgICAgICAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXTtcclxuXHJcbiAgICAgICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcclxuICAgICAgICAkKCcuaWctdmlkZW8tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJGdyb3VwID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcclxuICAgICAgICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxyXG4gICAgICAgICAgICBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcclxuICAgICAgICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChvcHRpb25hbClcclxuICAgICAgICAgICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JykgPyAkdmlkZW8uZGF0YSgnb3ZlcmxheScpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5jdHJsID0gJHZpZGVvLmRhdGEoJ2NvbnRyb2xzJykgPyAnY29udHJvbHMnIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA6ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICAgICAgICAgIHZpZGVvSURzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgICAgICAgICAgX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LyR7ZGF0YS5hY2NvdW50fS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PmA7XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgICAgIHZhciB0cmFuc2NyaXB0VGV4dCA9IHsnZW4nOiAnVHJhbnNjcmlwdCcsICdmcic6ICdUcmFuc2NyaXB0aW9uJ307XHJcbiAgICAgICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPmBcclxuICAgICAgICBpZiAoZGF0YS5vdmVybGF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5ICR7ZGF0YS5pZH1cIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vJHtkYXRhLm92ZXJsYXl9Jyk7XCI+PC9zcGFuPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwgKz0gYDx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PmBcclxuICAgICAgICBpZiAoZGF0YS50cmFuc2NyaXB0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInZpZGVvLXRyYW5zY3JpcHRcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnRyYW5zY3JpcHR9XCI+JHt0cmFuc2NyaXB0VGV4dFtpZy5sYW5nXX08L2E+PC9kaXY+YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaHRtbCArPSBgPC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEub3ZlcmxheSkge1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnIycgKyBkYXRhLmlkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudmlkZW8tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcclxuICAgICAgICB2YXIgcGxheWVyO1xyXG4gICAgICAgIHZpZGVvSURzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiB0aGlzIHBsYXllciB0byBhIHZhcmlhYmxlXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIub24oJ3BsYXknLCBfb25QbGF5KTtcclxuICAgICAgICAgICAgICAgIC8vIHB1c2ggdGhlIHBsYXllciB0byB0aGUgcGxheWVycyBhcnJheVxyXG4gICAgICAgICAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX29uUGxheShlKSB7XHJcbiAgICAgICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHBsYXllciB0aGUgZXZlbnQgaXMgY29taW5nIGZyb21cclxuICAgICAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcclxuICAgICAgICAvLyBnbyB0aHJvdWdoIHBsYXllcnNcclxuICAgICAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xyXG4gICAgICAgICAgICBpZiAocGxheWVyLmlkKCkgIT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwYXVzZSB0aGUgb3RoZXIgcGxheWVyKHMpXHJcbiAgICAgICAgICAgICAgICB2aWRlb2pzKHBsYXllci5pZCgpKS5wYXVzZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfdmlld1N0YXR1cygpIHtcclxuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghJCgnIycgKyBwbGF5ZXIuaWQoKSkudmlzaWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXRcclxuICAgIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAvLyBEZWZpbmUgY29tcG9uZW50LWxldmVsIHZhcmlhYmxlc1xyXG4gIHZhciBtZXNzYWdlcyA9IFtdLFxyXG4gICAgY291bnRlciA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcclxuICAgIC8vIE9mdGVuIGEgZ29vZCBpZGVhIHRvIGluaXQgd2l0aCBhbiBIVE1MIHNjb3BlIChpZSwgY2xhc3MpXHJcbiAgICB2YXIgJHRoaXMgPSAkKHNjb3BlKTtcclxuXHJcbiAgICAvLyBMZXQncyBjcmVhdGUgYSBtZXNzYWdlIGFycmF5XHJcbiAgICBtZXNzYWdlcyA9IFsnSGVsbG8hJywgJ0lzIGl0IG1lIHlvdVxcJ3JlIGxvb2tpbmcgZm9yPycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBleWVzJywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIHNtaWxlJywgJ1lvdVxcJ3JlIGFsbCBJXFwndmUgZXZlciB3YW50ZWQnLCAnQW5kIG15IGFybXMgYXJlIG9wZW4gd2lkZScsICdcXCdjYXVzZSB5b3Uga25vdyBqdXN0IHdoYXQgdG8gc2F5JywgJ0FuZCB5b3Uga25vdyBqdXN0IHdoYXQgdG8gZG8nLCAnQW5kIEkgd2FudCB0byB0ZWxsIHlvdSBzbyBtdWNoJ107XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgY2xpY2sgaGFuZGxlclxyXG4gICAgJHRoaXMuZmluZCgnYS5idXR0b24ubWVzc2FnZScpLm9uKCdjbGljaycsIGV2ZW50LCBfc2F5SGVsbG8pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3NheUhlbGxvKCkge1xyXG4gICAgLy8gTGV0J3MgZW1pdCBhbiBldmVudCB3aXRoIGFuIGluZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHNlbmQgYWxvbmcgc29tZXRoaW5nIHRvIGRpc3BsYXlcclxuICAgIGlnLmVtaXR0ZXIuZW1pdCgnaGVsbG8nLCBtZXNzYWdlc1tjb3VudGVyXSk7XHJcbiAgICBjb3VudGVyICs9IDE7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIHZhciAkdGhpc1xyXG5cclxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XHJcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxyXG4gICAgJHRoaXMgPSAkKHNjb3BlKTtcclxuICAgIF9saXN0ZW5lcigpO1xyXG4gIH1cclxuXHJcbiAgLy8gV2Uga25vdyBub3RoaW5nIGFib3V0IHRoZSBjb21wb25lbnQgdGhhdCB3aWxsIHNlbmQgdGhlIG1lc3NhZ2UuIE9ubHkgdGhhdCBpdCB3aWxsIGhhdmVcclxuICAvLyBhbiBpZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHRoYXQgd2Ugd2lsbCByZWNlaXZlIGEgJ21lc3NhZ2UnIHRvIGRpc3BsYXkuXHJcbiAgZnVuY3Rpb24gX2xpc3RlbmVyKCkge1xyXG4gICAgaWcuZW1pdHRlci5vbignaGVsbG8nLCBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgICAkKCc8cCBjbGFzcz1cImFsZXJ0LWJveCBhbGVydFwiPicgKyBtZXNzYWdlICsgJzwvcD4nKS5oaWRlKCkuYXBwZW5kVG8oJHRoaXMpLmZhZGVJbignZmFzdCcpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcclxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cclxuXHJcbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXHJcbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXHJcbiBmb3IgaW5zdGFuY2UpLlxyXG5cclxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xyXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cclxuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXHJcbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IG5hdmlnYXRpb24gZnJvbSAnLi9uYXZpZ2F0aW9uLmpzJ1xyXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IHNodWZmbGVkQ2Fyb3VzZWwgZnJvbSAnLi9zaHVmZmxlZC1jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xyXG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXHJcbmltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcclxuaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xyXG5cclxuY29uc3QgYXBwID0gKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxyXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXHJcbiAgICBpZigkKCcjbWFpbi1uYXZpZ2F0aW9uJykubGVuZ3RoKSBuYXZpZ2F0aW9uLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmxlbmd0aCkgc2h1ZmZsZWRDYXJvdXNlbC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XHJcblxyXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XHJcblxyXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgIF9sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJzZXRUaW1lb3V0IiwiYm9keSIsIiQiLCJtZW51SWNvbiIsImNsb3NlQnV0dG9uIiwiaW5pdCIsInNjb3BlIiwiY2xpY2siLCJlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIm9uIiwiaWciLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJ3aWR0aCIsImNzcyIsImV2ZW50IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJyZXR1cm5WYWx1ZSIsImVyciIsIndhcm4iLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0IiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfZmlsdGVyRHJvcGRvd24iLCJoaWRlIiwiZmFkZUluIiwiZm9jdXMiLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJoYXNDbGFzcyIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsIl9tZXNzYWdlcyIsImV4dGVuZCIsIm1lc3NhZ2VzIiwiZm9ybWF0IiwibG9nIiwiX2J1aWxkQ2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkY2Fyb3VzZWwiLCJlYWNoIiwiaW5kZXgiLCJzbGljayIsImF2YWlsYWJsZUl0ZW1zIiwic2Vlbkl0ZW1zIiwiaWdscyIsImRhdGFLZXkiLCJhcnRpY2xlTGltaXQiLCJnZXRMb2NhbFN0b3JhZ2UiLCJhcnRpY2xlcyIsImdldFJhbmRBcnRpY2xlcyIsIlN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlSUdMUyIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ1cGRhdGVMb2NhbFN0b3JhZ2UiLCJ1cGRhdGVkT2JqIiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwia2V5cyIsIm1hcCIsImsiLCJyZXNldExvY2FsU3RvcmFnZSIsInVuc2VlbiIsInJhbmRBcnRpY2xlcyIsImtleSIsIm5ld09iaiIsInB1c2giLCJzcGxpY2UiLCJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ2VuZXJhdGVUZW1wbGF0ZSIsInJhbmRvbUFydGljbGVzIiwiaHRtbCIsInRlbXBsYXRlRGF0YSIsImFydGljbGUiLCJNdXN0YWNoZSIsInRvX2h0bWwiLCJidWlsZENhcm91c2VsIiwibm90IiwidmlkZW9JRHMiLCJwbGF5ZXJzIiwiYnJpZ2h0Q292ZSIsInNldEludGVydmFsIiwiX3BhcnNlVmlkZW9zIiwiJGdyb3VwIiwiJHZpZGVvIiwicHJlbG9hZE9wdGlvbnMiLCJhY2NvdW50IiwicGxheWVyIiwiaWQiLCJvdmVybGF5IiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJ0cmFuc2NyaXB0IiwiX2luamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfaW5qZWN0VGVtcGxhdGUiLCJ0cmFuc2NyaXB0VGV4dCIsInJlcGxhY2VXaXRoIiwiZG9jdW1lbnQiLCJzaWJsaW5ncyIsIl9icmlnaHRDb3ZlUmVhZHkiLCJlbCIsInJlYWR5IiwiX29uUGxheSIsInRhcmdldCIsInBhdXNlIiwiX3ZpZXdTdGF0dXMiLCJzY3JvbGwiLCJ2aXNpYmxlIiwiY291bnRlciIsIl9zYXlIZWxsbyIsImVtaXQiLCJfbGlzdGVuZXIiLCJtZXNzYWdlIiwiYXBwZW5kVG8iLCJhcHAiLCJmb3VuZGF0aW9uIiwibmF2aWdhdGlvbiIsImZvcm1zIiwibW9yZSIsImNhcm91c2VsIiwic2h1ZmZsZWRDYXJvdXNlbCIsInZpZGVvIiwiZXZ0MSIsImV2dDIiLCJfbGFuZ3VhZ2UiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtLQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBOUMsSUFBbURILE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQXJHLEVBQXdHO1NBQy9GLElBQVA7RUFERixNQUVPO1NBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPOzs7QUFLUCxBQUFPLElBQUlDLFVBQVUsSUFBSUMsWUFBSixFQUFkOztBQUVQLEFBQU8sSUFBSUMsV0FBVyxTQUFYQSxRQUFXLENBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxTQUFiLEVBQTJCO0tBQzVDQyxPQUFKO1FBQ08sWUFBVztNQUNiQyxVQUFVLElBQWQ7TUFBb0JDLE9BQU9DLFNBQTNCO01BQ0lDLFFBQVEsU0FBUkEsS0FBUSxHQUFXO2FBQ1osSUFBVjtPQUNJLENBQUNMLFNBQUwsRUFBZ0JGLEtBQUtRLEtBQUwsQ0FBV0osT0FBWCxFQUFvQkMsSUFBcEI7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