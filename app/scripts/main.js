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
      player,
      players = [],
      brightCove;

  function init() {
    // We need to capture the video player settings defined in the HTML and create the markup that Brightcove requires
    _parseVideos();

    // Make sure the VideoJS method is available and fire ready event handlers
    brightCove = setInterval(function () {
      if ($('.vjs-plugins-ready').length) {
        clearInterval(brightCove);
        _brightCoveReady();
      }
    }, 500);

    // _viewStatus()
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
    var indexjs = '<script src="//players.brightcove.net/' + data.account + '/' + data.player + '_default/index.js"></script>';
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

  // function _viewStatus() {
  //   $(window).scroll(function () {
  //     if (player.length && players.length) {
  //       players.forEach(function (player) {
  //         if (!$('#' + player.id()).visible()) {
  //           videojs(player.id()).pause();
  //         }
  //       });
  //     }
  //   });
  // }

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxyXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XHJcblxyXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxyXG4gKi9cclxuXHJcbi8vIHVybCBwYXRoXHJcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbn0pKClcclxuXHJcbi8vIGxhbmd1YWdlXHJcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIuJykgIT09IC0xIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gJ2ZyJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdlbic7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBicm93c2VyIHdpZHRoXHJcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XHJcbn0pKClcclxuXHJcbi8vIGJhc2UgZXZlbnRFbWl0dGVyXHJcbi8vIGV4cG9ydCB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbmV4cG9ydCB2YXIgZGVib3VuY2UgPSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSA9PiB7XHJcblx0dmFyIHRpbWVvdXQ7XHJcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG5cdFx0dmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xyXG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuXHRcdH07XHJcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcclxuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcclxuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdH07XHJcbn07IiwiLy9BbnkgY29kZSB0aGF0IGludm9sdmVzIHRoZSBtYWluIG5hdmlnYXRpb24gZ29lcyBoZXJlXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuXHRsZXQgXHJcblx0XHRib2R5ID0gJCgnYm9keScpLFxyXG5cdFx0bWVudUljb24gPSAkKCcubWVudS1pY29uJyksXHJcblx0XHRjbG9zZUJ1dHRvbiA9ICQoJy5jbG9zZS1idXR0b24tY2lyY2xlJyksXHJcblx0XHRzaG93Rm9yTGFyZ2UgPSAkKCcuc2hvdy1mb3ItbGFyZ2UnKSxcclxuXHRcdHNlYXJjaElucHV0ID0gJCgnI3NpdGUtc2VhcmNoLXEnKSxcclxuXHRcdGhhc1N1Yk5hdiA9ICQoJy5oYXMtc3VibmF2Jyk7XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcclxuXHRcdG1lbnVJY29uLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGJvZHkuYWRkQ2xhc3MoJ25vLXNjcm9sbCcpO1xyXG5cdFx0fSk7XHRcclxuXHJcblx0XHRjbG9zZUJ1dHRvbi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRib2R5LnJlbW92ZUNsYXNzKCduby1zY3JvbGwnKTtcdFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2hvd0ZvckxhcmdlLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdHNlYXJjaElucHV0LmZvY3VzKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRoYXNTdWJOYXYuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0bGV0IHNuVGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG5cdFx0XHRpZiggc25UYXJnZXQuaGFzQ2xhc3MoXCJhY3RpdmVcIikgKSB7XHJcblx0XHRcdFx0Ly9kZWFjdGl2YXRlXHJcblx0XHRcdFx0c25UYXJnZXQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vYWN0aXZhdGVcclxuXHRcdFx0XHRzblRhcmdldC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXRcclxuXHR9O1xyXG59KSgpXHJcbiIsIi8vIFRoaXMgaXMgbGVzcyBvZiBhIG1vZHVsZSB0aGFuIGl0IGlzIGEgY29sbGVjdGlvbiBvZiBjb2RlIGZvciBhIGNvbXBsZXRlIHBhZ2UgKE1vcmUgcGFnZSBpbiB0aGlzIGNhc2UpLlxyXG4vLyBBdCBzb21lIHBvaW50LCB3ZSBzaG91bGQgY29uc2lkZXIgc3BsaXR0aW5nIGl0IHVwIGludG8gYml0ZS1zaXplZCBwaWVjZXMuIEV4OiBtb3JlLW5hdi5qcywgbW9yZS1zb2NpYWwuanNcclxuLy8gYW5kIHNvIG9uLlxyXG5cclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIHJlc2l6ZSBiZWhhdmlvdXJcclxuICAgIF9yZXNpemUoKTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnVpdGVtJykub24oJ2NsaWNrJywgaWcuZGVib3VuY2UoX21vcmVTZWN0aW9uTWVudUl0ZW0sIDUwMCwgdHJ1ZSkpO1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtbW9iaWxlLXRpdGxlJykub24oJ2NsaWNrJywgX21vYmlsZUNhdGVnb3J5TWVudSk7XHJcblxyXG4gICAgLy8gQ2xvc2UgYnV0dG9uXHJcbiAgICAkKCcuY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgX2Nsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAvLyBTb2NpYWwgZHJhd2VyXHJcbiAgICAkKCcuanMtb3Blbi1zb2NpYWxkcmF3ZXInKS5vbignY2xpY2snLCBfb3BlblNvY2lhbERyYXdlcik7XHJcbiAgfVxyXG5cclxuICAvLyBFbmQgb2YgSW5pdFxyXG5cclxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8PSAzNzUpIHtcclxuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2ZsZXgnKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21vcmVTZWN0aW9uTWVudUl0ZW0oZXZlbnQpIHtcclxuXHJcbiAgICBpZih3aW5kb3cubWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDY0MHB4KVwiKS5tYXRjaGVzKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy9JRSBmaXhcclxuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICB9IGNhdGNoKGVycikgeyBjb25zb2xlLndhcm4oJ2V2ZW50LnJldHVyblZhbHVlIG5vdCBhdmFpbGFibGUnKX1cclxuXHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcclxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXHJcbiAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgZHJvcGRvd24gb24gY2xpY2tcclxuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgdGl0bGUgb24gY2xpY2tcclxuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XHJcblxyXG4gICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxyXG5cclxuICAgIC8vIFVuZGVybGluZSBhbmltYXRpb25cclxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLicgKyBjbGFzc05hbWVbMF0pLmZhZGVJbignc2xvdycpLmZvY3VzKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyVGl0bGUodGl0bGUpIHtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZU91dCgpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmFkZENsYXNzKCdhY3RpdmUnKS50ZXh0KHRpdGxlKTtcclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLnNob3coKS5jc3MoeyBsZWZ0OiBjZW50ZXJYIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FuaW1hdGlvblVuZGVybGluZSgpIHtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykuYWRkQ2xhc3MoJ2FuaW1hdGUnKVxyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9iaWxlQ2F0ZWdvcnlNZW51KCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfb3BlblNvY2lhbERyYXdlcigpIHtcclxuICAgIC8vIHRoaXMubmV4dCgpIHNlbGVjdHMgbmV4dCBzaWJsaW5nIGVsZW1lbnRcclxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cclxuICAgIHZhciBqc1NvY2lhbERyYXdlciA9ICQodGhpcykubmV4dCgpO1xyXG5cclxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLnJlbW92ZUNsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIGVuZHBvaW50VVJMLFxyXG4gICAgc3VjY2Vzc1VSTCxcclxuICAgIGNhbmNlbFVSTCxcclxuICAgICRmb3JtLFxyXG4gICAgJGZvcm1XcmFwcGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcclxuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XHJcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XHJcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcclxuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XHJcblxyXG4gICAgX3ZhbGlkYXRpb24oKTtcclxuICAgIF90b2dnbGVyKCk7XHJcbiAgICBfbWVzc2FnZXMoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XHJcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xyXG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgZGVidWc6IHRydWUsXHJcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxyXG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XHJcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcclxuXHJcbiAgICAkZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfcHJvY2VzcygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gVXNlIHRoZSBjdXN0b20tZXJyb3ItbG9jYXRpb24gbWFya2VyIGNsYXNzIHRvIGNoYW5nZSB3aGVyZSB0aGUgZXJyb3IgbGFiZWwgc2hvd3MgdXBcclxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcclxuICAgICAgICAgICQoZWxlbWVudCkucGFyZW50KCkuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBob25lMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0YWxfY29kZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBjZG5Qb3N0YWw6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRmb3JtLmZpbmQoJ2J1dHRvbi5jYW5jZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcHJvY2Vzcyhmb3JtKSB7XHJcbiAgICB2YXIgZm9ybURhdGFSYXcsXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkO1xyXG5cclxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgICAgLy8gSWYgd2UgbmVlZCB0byBtb2RpZnkgdGhlIGRhdGEsIHVzZSBwYXJzZSBtZXRob2RcclxuICAgICAgZm9ybURhdGFQYXJzZWQgPSBfcGFyc2UoZm9ybURhdGFSYXcpO1xyXG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxyXG4gICAgICBfc3VibWl0KGZvcm1EYXRhUGFyc2VkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XHJcbiAgICAvLyBFeGVjdXRlIGFueSBjdXN0b20gbG9naWMgaGVyZVxyXG5cclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N1Ym1pdChkYXRhKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgdXJsOiBlbmRwb2ludFVSTCxcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgIH0pXHJcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICAgIFNjcm9sbE1hbi50bygkKCcjc2VydmVyLWVycm9yJykpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF90b2dnbGVyKCkge1xyXG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXHJcbiAgICAkKCcudG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnRvZ2dsZS1jb250ZW50JykuaGlkZSgpO1xyXG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tZXNzYWdlcygpIHtcclxuICAgIGlmIChpZy5sYW5nID09PSBcImZyXCIpIHtcclxuICAgICAgJC5leHRlbmQoICQudmFsaWRhdG9yLm1lc3NhZ2VzLCB7XHJcbiAgICAgICAgcmVxdWlyZWQ6IFwiQ2UgY2hhbXAgZXN0IG9ibGlnYXRvaXJlLlwiLFxyXG4gICAgICAgIHJlbW90ZTogXCJWZXVpbGxleiBjb3JyaWdlciBjZSBjaGFtcC5cIixcclxuICAgICAgICBlbWFpbDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIMOpbGVjdHJvbmlxdWUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHVybDogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIFVSTCB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGF0ZTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZS5cIixcclxuICAgICAgICBkYXRlSVNPOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlIChJU08pLlwiLFxyXG4gICAgICAgIG51bWJlcjogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gdmFsaWRlLlwiLFxyXG4gICAgICAgIGRpZ2l0czogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgY2hpZmZyZXMuXCIsXHJcbiAgICAgICAgY3JlZGl0Y2FyZDogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgY2FydGUgZGUgY3LDqWRpdCB2YWxpZGUuXCIsXHJcbiAgICAgICAgZXF1YWxUbzogXCJWZXVpbGxleiBmb3VybmlyIGVuY29yZSBsYSBtw6ptZSB2YWxldXIuXCIsXHJcbiAgICAgICAgZXh0ZW5zaW9uOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBhdmVjIHVuZSBleHRlbnNpb24gdmFsaWRlLlwiLFxyXG4gICAgICAgIG1heGxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgcGx1cyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICBtaW5sZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIHJhbmdlbGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIHF1aSBjb250aWVudCBlbnRyZSB7MH0gZXQgezF9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgcmFuZ2U6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgZW50cmUgezB9IGV0IHsxfS5cIiApLFxyXG4gICAgICAgIG1heDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBpbmbDqXJpZXVyZSBvdSDDqWdhbGUgw6AgezB9LlwiICksXHJcbiAgICAgICAgbWluOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIHN1cMOpcmlldXJlIG91IMOpZ2FsZSDDoCB7MH0uXCIgKSxcclxuICAgICAgICBzdGVwOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIG11bHRpcGxlIGRlIHswfS5cIiApLFxyXG4gICAgICAgIG1heFdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBtb3RzLlwiICksXHJcbiAgICAgICAgbWluV29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IG1vaW5zIHswfSBtb3RzLlwiICksXHJcbiAgICAgICAgcmFuZ2VXb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgZW50cmUgezB9IGV0IHsxfSBtb3RzLlwiICksXHJcbiAgICAgICAgbGV0dGVyc3dpdGhiYXNpY3B1bmM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMgZXQgZGVzIHNpZ25lcyBkZSBwb25jdHVhdGlvbi5cIixcclxuICAgICAgICBhbHBoYW51bWVyaWM6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMsIG5vbWJyZXMsIGVzcGFjZXMgZXQgc291bGlnbmFnZXMuXCIsXHJcbiAgICAgICAgbGV0dGVyc29ubHk6IFwiVmV1aWxsZXogZm91cm5pciBzZXVsZW1lbnQgZGVzIGxldHRyZXMuXCIsXHJcbiAgICAgICAgbm93aGl0ZXNwYWNlOiBcIlZldWlsbGV6IG5lIHBhcyBpbnNjcmlyZSBkJ2VzcGFjZXMgYmxhbmNzLlwiLFxyXG4gICAgICAgIHppcHJhbmdlOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gY29kZSBwb3N0YWwgZW50cmUgOTAyeHgteHh4eCBldCA5MDUteHgteHh4eC5cIixcclxuICAgICAgICBpbnRlZ2VyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbm9tYnJlIG5vbiBkw6ljaW1hbCBxdWkgZXN0IHBvc2l0aWYgb3UgbsOpZ2F0aWYuXCIsXHJcbiAgICAgICAgdmluVVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGQnaWRlbnRpZmljYXRpb24gZHUgdsOpaGljdWxlIChWSU4pLlwiLFxyXG4gICAgICAgIGRhdGVJVEE6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdGltZTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBoZXVyZSB2YWxpZGUgZW50cmUgMDA6MDAgZXQgMjM6NTkuXCIsXHJcbiAgICAgICAgcGhvbmVVUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHBob25lVUs6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIHTDqWzDqXBob25lIHZhbGlkZS5cIixcclxuICAgICAgICBtb2JpbGVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgbW9iaWxlIHZhbGlkZS5cIixcclxuICAgICAgICBzdHJpcHBlZG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgZW1haWwyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2Ugw6lsZWN0cm9uaXF1ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdXJsMjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIFVSTCB2YWxpZGUuXCIsXHJcbiAgICAgICAgY3JlZGl0Y2FyZHR5cGVzOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcclxuICAgICAgICBpcHY0OiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgSVAgdjQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGlwdjY6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NiB2YWxpZGUuXCIsXHJcbiAgICAgICAgcmVxdWlyZV9mcm9tX2dyb3VwOiBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGRlIGNlcyBjaGFtcHMuXCIsXHJcbiAgICAgICAgbmlmRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIE5JRiB2YWxpZGUuXCIsXHJcbiAgICAgICAgbmllRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIE5JRSB2YWxpZGUuXCIsXHJcbiAgICAgICAgY2lmRVM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIENJRiB2YWxpZGUuXCIsXHJcbiAgICAgICAgcG9zdGFsQ29kZUNBOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gY29kZSBwb3N0YWwgdmFsaWRlLlwiXHJcbiAgICAgIH0gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcclxuICAgIF9idWlsZENhcm91c2VsKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgIHZhciBwcmV2QXJyb3csXHJcbiAgICAgIG5leHRBcnJvdyxcclxuICAgICAgJGNhcm91c2VsO1xyXG5cclxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XHJcbiAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcclxuXHJcbiAgICAgICRjYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcclxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxyXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCIvKipcclxuICogU2h1ZmZsZWQgQ2Fyb3VzZWxcclxuICogVGFrZXMgZWlnaHQgaXRlbXMgZnJvbSBhbiBvYmplY3Qgb2YgMjAsIGFuZCByZW5kZXJzIHRoZW0gaW4gYSBjYXJvdXNlbCBpbiByYW5kb20gb3JkZXIuXHJcbiAqXHJcbiAqIFVwb24gcmVmcmVzaCBvZiB0aGUgYnJvd3NlciwgdGhlIGZpcnN0IHR3byBpdGVtcyBhcmUgYWRkZWQgdG8gdGhlIHNlZW5JdGVtcyBvYmplY3RcclxuICogYW5kIHdyaXR0ZW4gdG8gbG9jYWwgc3RvcmFnZSwgd2hlbiB0aGUgYW1vdW50IG9mIHVuc2VlbiBpdGVtcyBkcm9wcyBiZWxvdyA4LCBzZWVuSXRlbXMgXHJcbiAqIGlzIGNsZWFyZWQgYW5kIHRoZSBjYXJvdXNlbCByZXNldC5cclxuICpcclxuICogVGhlcmUgYXJlIHR3byBjb25maWd1cmFibGUgZGF0YSBhdHRyaWJ1dGVzIHRoYXQgbmVlZCB0byBiZSBhZGRlZCB0byB0aGUgbWFya3VwOlxyXG4gKiBAcGFyYW0gZGF0YS1hcnRpY2xlcyA9IFRoZSBrZXkgb2YgdGhlIGRhdGEgaW4gdGhlIGpzb24gb2JqZWN0XHJcbiAqIEByZXR1cm4gZGF0YS1saW1pdCA9IFRoZSBhbW91bnQgb2YgaXRlbXMgdG8gYmUgcmVuZGVyZWQgaW4gdGhlIGNhcm91c2VsXHJcbiAqIEV4LiA8ZGl2IGNsYXNzPVwiaWctc2h1ZmZsZWQtY2Fyb3VzZWxcIiBkYXRhLWFydGljbGVzPVwiYWR2aWNlLXN0b3JpZXNcIiBkYXRhLWxpbWl0PVwiOFwiPjwvZGl2PlxyXG4gKi9cclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgICB2YXIgYXZhaWxhYmxlSXRlbXMsIHNlZW5JdGVtcywgaWdscywgZGF0YUtleSwgYXJ0aWNsZUxpbWl0O1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgICAgIGlnbHMgPSBnZXRMb2NhbFN0b3JhZ2UoKTtcclxuICAgICAgICBhdmFpbGFibGVJdGVtcyA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2FydGljbGVzJykuYXJ0aWNsZXM7XHJcbiAgICAgICAgZGF0YUtleSA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ25hbWUnKTtcclxuICAgICAgICBhcnRpY2xlTGltaXQgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdsaW1pdCcpO1xyXG5cclxuICAgICAgICBpZiAoIWlnbHNbZGF0YUtleV0pIHtcclxuICAgICAgICAgICAgLy9vYmplY3QgZG9lcyBub3QgZXhpc3QgeWV0XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IGlnbHNbZGF0YUtleV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlKGdldFJhbmRBcnRpY2xlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRMb2NhbFN0b3JhZ2UoKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZihTdG9yYWdlKSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSA/IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSkgOiBjcmVhdGVJR0xTKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdsb2NhbHN0b3JhZ2UgaXMgbm90IGF2YWlsYWJsZSEnKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUlHTFMoKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeSh7fSkpO1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxvY2FsU3RvcmFnZShhcnRpY2xlcykge1xyXG4gICAgICAgIHZhciB1cGRhdGVkT2JqID0gT2JqZWN0LmFzc2lnbih7fSwgc2Vlbkl0ZW1zKTtcclxuICAgICAgICBhcnRpY2xlcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLm1hcCgoaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRPYmpba10gPSBpdGVtW2tdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWdsc1tkYXRhS2V5XSA9IHVwZGF0ZWRPYmo7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzZXRMb2NhbFN0b3JhZ2UoKSB7XHJcbiAgICAgICAgZGVsZXRlIGlnbHNbZGF0YUtleV07XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJpZ1wiLCBKU09OLnN0cmluZ2lmeShpZ2xzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmFuZEFydGljbGVzKCkge1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICB1bnNlZW4gPSBbXSxcclxuICAgICAgICAgICAgcmFuZEFydGljbGVzOyAgIFxyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhhdmFpbGFibGVJdGVtcykuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB7fTtcclxuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBhdmFpbGFibGVJdGVtc1trZXldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZWVuSXRlbXNba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdW5zZWVuLnB1c2gobmV3T2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByYW5kQXJ0aWNsZXMgPSB1bnNlZW4uc3BsaWNlKDAsIGFydGljbGVMaW1pdCk7XHJcblxyXG4gICAgICAgIGlmIChyYW5kQXJ0aWNsZXMubGVuZ3RoIDwgYXJ0aWNsZUxpbWl0KSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0xlc3MgdGhhbiAnICsgYXJ0aWNsZUxpbWl0ICsgJyBpdGVtcyBsZWZ0IHRvIHZpZXcsIGVtcHR5aW5nIHNlZW5JdGVtcyBhbmQgcmVzdGFydGluZy4nKTtcclxuICAgICAgICAgICAgLy9UaGVyZSdzIGxlc3MgdW5zZWVuIGFydGljbGVzIHRoYXQgdGhlIGxpbWl0XHJcbiAgICAgICAgICAgIC8vY2xlYXIgc2Vlbkl0ZW1zLCByZXNldCBscywgYW5kIHJlaW5pdFxyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcclxuICAgICAgICAgICAgcmVzZXRMb2NhbFN0b3JhZ2UoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIGluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaHVmZmxlKHJhbmRBcnRpY2xlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cclxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVRlbXBsYXRlKHJhbmRvbUFydGljbGVzKSB7XHJcblxyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICBodG1sLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZURhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgaWYoIXJhbmRvbUFydGljbGVzKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICByYW5kb21BcnRpY2xlcy5mb3JFYWNoKChhcnRpY2xlKSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFydGljbGUpLm1hcCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURhdGEucHVzaChhcnRpY2xlW2tleV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwoJChgIyR7ZGF0YUtleX1gKS5odG1sKCksIHsgXCJhcnRpY2xlc1wiOiB0ZW1wbGF0ZURhdGEgfSk7XHJcblxyXG4gICAgICAgICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmh0bWwoaHRtbCk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUxvY2FsU3RvcmFnZShyYW5kb21BcnRpY2xlcyk7XHJcblxyXG4gICAgICAgIGJ1aWxkQ2Fyb3VzZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBidWlsZENhcm91c2VsKCkge1xyXG4gICAgICAgIHZhciBwcmV2QXJyb3csXHJcbiAgICAgICAgICAgIG5leHRBcnJvdyxcclxuICAgICAgICAgICAgJGNhcm91c2VsO1xyXG5cclxuICAgICAgICAkKCcuaWctY2Fyb3VzZWwnKS5ub3QoJy5zbGljay1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICAgICAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcclxuXHJcbiAgICAgICAgICAgICRjYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcclxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXRcclxuICAgIH07XHJcbn0pKClcclxuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcblx0bGV0IHNlY3Rpb25UaXRsZSA9ICQoJy5hY2NvcmRpb24tbWVudS1zZWN0aW9uLXRpdGxlJyk7XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQoKSB7XHJcblx0XHRzZWN0aW9uVGl0bGUuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHQvL0lFIGZpeFxyXG5cdFx0XHRcdGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdFx0fSBjYXRjaChlcnIpIHsgY29uc29sZS53YXJuKCdldmVudC5yZXR1cm5WYWx1ZSBub3QgYXZhaWxhYmxlJyl9XHJcblx0XHRcdFxyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0XHJcblx0fTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICB2YXIgdmlkZW9JRHMgPSBbXSxcbiAgICBwbGF5ZXIsXG4gICAgcGxheWVycyA9IFtdLFxuICAgIGJyaWdodENvdmU7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNhcHR1cmUgdGhlIHZpZGVvIHBsYXllciBzZXR0aW5ncyBkZWZpbmVkIGluIHRoZSBIVE1MIGFuZCBjcmVhdGUgdGhlIG1hcmt1cCB0aGF0IEJyaWdodGNvdmUgcmVxdWlyZXNcbiAgICBfcGFyc2VWaWRlb3MoKTtcblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXG4gICAgYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkKCcudmpzLXBsdWdpbnMtcmVhZHknKS5sZW5ndGgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcbiAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xuICAgICAgfVxuICAgIH0sIDUwMCk7XG5cbiAgICAvLyBfdmlld1N0YXR1cygpXG4gIH1cblxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XG4gICAgdmFyICRncm91cCxcbiAgICAgICR2aWRlbyxcbiAgICAgIGRhdGEgPSB7fSxcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXTtcblxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xuICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xuXG4gICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIENhcHR1cmUgcmVxdWlyZWQgb3B0aW9uc1xuICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIHRoYXQgYXJlIG9wdGlvbmFsXG4gICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JylcbiAgICAgICAgICA/ICR2aWRlby5kYXRhKCdvdmVybGF5JylcbiAgICAgICAgICA6ICcnO1xuICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YShcbiAgICAgICAgICAnZGVzY3JpcHRpb24nKSA6ICcnO1xuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcbiAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xuICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoXG4gICAgICAgICAgJ3RyYW5zY3JpcHQnKSA6ICcnO1xuICAgICAgICBkYXRhLmN0YVRlbXBsYXRlID0gJHZpZGVvLmRhdGEoJ2N0YVRlbXBsYXRlJykgPyAkdmlkZW8uZGF0YShcbiAgICAgICAgICAnY3RhVGVtcGxhdGUnKSA6ICcnO1xuXG4gICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcbiAgICAgICAgdmlkZW9JRHMucHVzaChkYXRhLmlkKTtcblxuICAgICAgICAvLyBMZXQncyByZXBsYWNlIHRoZSBpZy12aWRlby1qcyAnZGlyZWN0aXZlJyB3aXRoIHRoZSBuZWNlc3NhcnkgQnJpZ2h0Y292ZSBjb2RlXG4gICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5qc1wiPjwvc2NyaXB0PmA7XG4gICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KSB7XG4gICAgdmFyIHRyYW5zY3JpcHRUZXh0ID0geyAnZW4nOiAnVHJhbnNjcmlwdCcsICdmcic6ICdUcmFuc2NyaXB0aW9uJyB9LFxuICAgICAgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyICR7ZGF0YS5pZH1cIj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5gO1xuXG4gICAgaWYgKGRhdGEuY3RhVGVtcGxhdGUubGVuZ3RoID4gMCkge1xuICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1jdGFcIj4ke2RhdGEuY3RhVGVtcGxhdGV9PC9zcGFuPmA7XG4gICAgfVxuICAgIGlmIChkYXRhLm92ZXJsYXkubGVuZ3RoID4gMCkge1xuICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyR7ZGF0YS5vdmVybGF5fScpO1wiPjwvc3Bhbj5gO1xuICAgIH1cbiAgICBodG1sICs9IGA8dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiJHtkYXRhLmFjY291bnR9XCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiIGNvbnRyb2xzICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PmA7XG4gICAgaWYgKGRhdGEudHJhbnNjcmlwdC5sZW5ndGggPiAwKSB7XG4gICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNjcmlwdFwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEudHJhbnNjcmlwdH1cIj4ke3RyYW5zY3JpcHRUZXh0W2lnLmxhbmddfTwvYT48L2Rpdj5gO1xuICAgIH1cbiAgICBodG1sICs9IGA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XG4gICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xuXG4gICAgaWYgKGRhdGEub3ZlcmxheSkge1xuICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJyMnICsgZGF0YS5pZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudmlkZW8tb3ZlcmxheScpLmhpZGUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XG4gICAgdmlkZW9JRHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gYXNzaWduIHRoaXMgcGxheWVyIHRvIGEgdmFyaWFibGVcbiAgICAgICAgcGxheWVyID0gdGhpcztcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XG4gICAgICAgIHBsYXllci5vbigncGxheScsIF9vblBsYXkpO1xuICAgICAgICAvLyBhc3NpZ24gYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGVuZGVkIGV2ZW50XG4gICAgICAgIHBsYXllci5vbignZW5kZWQnLCBfb25Db21wbGV0ZSk7XG4gICAgICAgIC8vIHB1c2ggdGhlIHBsYXllciB0byB0aGUgcGxheWVycyBhcnJheVxuICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX29uUGxheShlKSB7XG4gICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHBsYXllciB0aGUgZXZlbnQgaXMgY29taW5nIGZyb21cbiAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcbiAgICAvLyBnbyB0aHJvdWdoIHBsYXllcnNcbiAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xuICAgICAgaWYgKHBsYXllci5pZCgpICE9PSBpZCkge1xuICAgICAgICAvLyBwYXVzZSB0aGUgb3RoZXIgcGxheWVyKHMpXG4gICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfb25Db21wbGV0ZShlKSB7XG4gICAgJCgnLicgKyBlLnRhcmdldC5pZCkuYWRkQ2xhc3MoJ2NvbXBsZXRlJyk7XG4gIH1cblxuICAvLyBmdW5jdGlvbiBfdmlld1N0YXR1cygpIHtcbiAgLy8gICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgLy8gICAgIGlmIChwbGF5ZXIubGVuZ3RoICYmIHBsYXllcnMubGVuZ3RoKSB7XG4gIC8vICAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gIC8vICAgICAgICAgaWYgKCEkKCcjJyArIHBsYXllci5pZCgpKS52aXNpYmxlKCkpIHtcbiAgLy8gICAgICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XG4gIC8vICAgICAgICAgfVxuICAvLyAgICAgICB9KTtcbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdCxcbiAgfTtcbn0pKCk7XG4iLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXG5cbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxuIGZvciBpbnN0YW5jZSkuXG5cbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxuICovXG5cbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vbmF2aWdhdGlvbi5qcydcbmltcG9ydCBtb3JlIGZyb20gJy4vbW9yZS5qcyc7XG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XG5pbXBvcnQgc2h1ZmZsZWRDYXJvdXNlbCBmcm9tICcuL3NodWZmbGVkLWNhcm91c2VsLmpzJztcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xuLy8gaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xuLy8gaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xuXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xuICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcbiAgICBpZiAoJCgnI21haW4tbmF2aWdhdGlvbicpLmxlbmd0aCkgbmF2aWdhdGlvbi5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykubGVuZ3RoKSBzaHVmZmxlZENhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XG4gICAgaWYgKCQoJy5hY2NvcmRpb24nKS5sZW5ndGgpIGFjY29yZGlvbi5pbml0KCk7XG5cbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxuICAgIC8vIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xuICAgIC8vIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xuXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcbiAgICBfbGFuZ3VhZ2UoKTtcbiAgfVxuXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9XG59KSgpO1xuXG4vLyBCb290c3RyYXAgYXBwXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIGFwcC5pbml0KCk7XG59KTtcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJzZXRUaW1lb3V0IiwiYm9keSIsIiQiLCJtZW51SWNvbiIsImNsb3NlQnV0dG9uIiwic2hvd0ZvckxhcmdlIiwic2VhcmNoSW5wdXQiLCJoYXNTdWJOYXYiLCJpbml0Iiwic2NvcGUiLCJjbGljayIsImUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZm9jdXMiLCJzblRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJoYXNDbGFzcyIsIm9uIiwiaWciLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJ3aWR0aCIsImNzcyIsImV2ZW50IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJyZXR1cm5WYWx1ZSIsImVyciIsIndhcm4iLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0IiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfZmlsdGVyRHJvcGRvd24iLCJoaWRlIiwiZmFkZUluIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiX21lc3NhZ2VzIiwiZXh0ZW5kIiwibWVzc2FnZXMiLCJmb3JtYXQiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiYXZhaWxhYmxlSXRlbXMiLCJzZWVuSXRlbXMiLCJpZ2xzIiwiZGF0YUtleSIsImFydGljbGVMaW1pdCIsImdldExvY2FsU3RvcmFnZSIsImFydGljbGVzIiwiZ2V0UmFuZEFydGljbGVzIiwiU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJjcmVhdGVJR0xTIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVwZGF0ZUxvY2FsU3RvcmFnZSIsInVwZGF0ZWRPYmoiLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJrZXlzIiwibWFwIiwiayIsInJlc2V0TG9jYWxTdG9yYWdlIiwidW5zZWVuIiwicmFuZEFydGljbGVzIiwia2V5IiwibmV3T2JqIiwicHVzaCIsInNwbGljZSIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZW5lcmF0ZVRlbXBsYXRlIiwicmFuZG9tQXJ0aWNsZXMiLCJodG1sIiwidGVtcGxhdGVEYXRhIiwiYXJ0aWNsZSIsIk11c3RhY2hlIiwidG9faHRtbCIsImJ1aWxkQ2Fyb3VzZWwiLCJub3QiLCJzZWN0aW9uVGl0bGUiLCJ2aWRlb0lEcyIsInBsYXllciIsInBsYXllcnMiLCJicmlnaHRDb3ZlIiwic2V0SW50ZXJ2YWwiLCJfcGFyc2VWaWRlb3MiLCIkZ3JvdXAiLCIkdmlkZW8iLCJwcmVsb2FkT3B0aW9ucyIsImFjY291bnQiLCJpZCIsIm92ZXJsYXkiLCJkZXNjcmlwdGlvbiIsImF1dG8iLCJwcmVsb2FkIiwidHJhbnNjcmlwdCIsImN0YVRlbXBsYXRlIiwiX2luamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfaW5qZWN0VGVtcGxhdGUiLCJ0cmFuc2NyaXB0VGV4dCIsInJlcGxhY2VXaXRoIiwiZG9jdW1lbnQiLCJzaWJsaW5ncyIsIl9icmlnaHRDb3ZlUmVhZHkiLCJlbCIsInJlYWR5IiwiX29uUGxheSIsIl9vbkNvbXBsZXRlIiwidGFyZ2V0IiwicGF1c2UiLCJhcHAiLCJmb3VuZGF0aW9uIiwibmF2aWdhdGlvbiIsImZvcm1zIiwibW9yZSIsImNhcm91c2VsIiwic2h1ZmZsZWRDYXJvdXNl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