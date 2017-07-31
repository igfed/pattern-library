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

var more = (function (window) {
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

    // Adobe Analytics
    $('.ga-article-share').on('click', function () {
      var shareType, title;
      var $this = $(this);

      window.digitalData.event = {};
      title = $this.data("gaTitle").replace(/[\s]+/g, "_");

      if (title.substring(0, title.length) === "_") {
        title = title.substring(0, title.length - 1);
      }

      if ($this.hasClass("facebook-share")) {
        shareType = "Facebook";
      }

      if ($this.hasClass("linkedin-share")) {
        shareType = "LinkedIn";
      }

      if ($this.hasClass("twitter-share")) {
        shareType = "Twitter";
      }

      if ($this.hasClass("email-share")) {
        shareType = "Email";
      }

      window.digitalData.event.shareType = shareType;
      window.digitalData.event.title = title;
    });
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
    $('.more-section-menu-dropdown-arrow-up').show().css({
      left: centerX
    });
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
})(window);

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

var video = (function (window) {

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
          // The check for an id already being stored is necessary for video's in a Slick carousel
          if (videoIDs.indexOf(data.id) === -1) {
            videoIDs.push(data.id);
          }

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
    var transcriptText = {
      'en': 'Transcript',
      'fr': 'Transcription'
    },
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
    html += '</div><h2 class="video-title ' + data.id + '">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video = $video.replaceWith(html);

    if (data.overlay) {
      $(document).on('click', '#' + data.id, function () {
        $(this).siblings('.video-overlay').hide();
      });
    }
  }

  function _injectIframe(data) {
    var html = '<div class="video-container">\n      <div class="video-container-responsive">\n      <iframe class="video-js" src=\'//players.brightcove.net/3906942861001/' + data.player + '_default/index.html?videoId=' + data.id + '\'\n    allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>\n    </div>\n    </div><h2 class="video-title ' + data.id + '">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
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
    window.digitalData.event.id = e.target.id;
    window.digitalData.event.title = _retrieveTitle(e.target.id);
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
    window.digitalData.event.id = e.target.id;
    window.digitalData.event.title = _retrieveTitle(e.target.id);
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

  function _retrieveTitle(id) {
    return $('.video-title.' + id).first().text();
  }

  return {
    init: init
  };
})(window);

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

// Init Satellite and event object
window._satellite = window._satellite || {};
window._satellite.track = window._satellite.track || function () {};
window.digitalData.event = {};

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

    // Due to different implementations of carousels, tracking needs to be added here and not in carousel.js
    _addCarouselTracking();
  }

  // Let's use a global variable (global as in available to all our components - not the window object!)
  // to add a class to the body tag
  function _language() {
    $('body').addClass(lang);
  }

  function _addCarouselTracking() {
    $('.slick-arrow').on('click', function () {
      _satellite.track('carousel_scroll');
    });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL25hdmlnYXRpb24uanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL2FjY29yZGlvbi5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL21vZGFsLmpzIiwibW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcbiB1c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XG5cbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcbiAqL1xuXG4vLyB1cmwgcGF0aFxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG59KSgpXG5cbi8vIGxhbmd1YWdlXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci4nKSAhPT0gLTEgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gJ2ZyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufSkoKVxuXG4vLyBicm93c2VyIHdpZHRoXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcbn0pKClcblxuLy8gY2hlY2sgZm9yIElFIChwcmUgRWRnZSlcbmV4cG9ydCB2YXIgb2xkSUUgPSAoKCkgPT4ge1xuICBpZiAoXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KSgpXG5cbi8vIGJhc2UgZXZlbnRFbWl0dGVyXG4vLyBleHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbmV4cG9ydCB2YXIgZGVib3VuY2UgPSAoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSA9PiB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfTtcbn07XG4iLCIvL0FueSBjb2RlIHRoYXQgaW52b2x2ZXMgdGhlIG1haW4gbmF2aWdhdGlvbiBnb2VzIGhlcmVcclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG5cdGxldCBcclxuXHRcdGJvZHkgPSAkKCdib2R5JyksXHJcblx0XHRtZW51SWNvbiA9ICQoJy5tZW51LWljb24nKSxcclxuXHRcdGNsb3NlQnV0dG9uID0gJCgnLmNsb3NlLWJ1dHRvbi1jaXJjbGUnKSxcclxuXHRcdHNob3dGb3JMYXJnZSA9ICQoJy5zaG93LWZvci1sYXJnZScpLFxyXG5cdFx0c2VhcmNoSW5wdXQgPSAkKCcjc2l0ZS1zZWFyY2gtcScpLFxyXG5cdFx0aGFzU3ViTmF2ID0gJCgnLmhhcy1zdWJuYXYnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG5cdFx0bWVudUljb24uY2xpY2soKGUpID0+IHtcclxuXHRcdFx0Ym9keS5hZGRDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblx0XHR9KTtcdFxyXG5cclxuXHRcdGNsb3NlQnV0dG9uLmNsaWNrKChlKSA9PiB7XHJcblx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ25vLXNjcm9sbCcpO1x0XHJcblx0XHR9KTtcclxuXHJcblx0XHRzaG93Rm9yTGFyZ2UuY2xpY2soKGUpID0+IHtcclxuXHRcdFx0c2VhcmNoSW5wdXQuZm9jdXMoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGhhc1N1Yk5hdi5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHRsZXQgc25UYXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcblx0XHRcdGlmKCBzblRhcmdldC5oYXNDbGFzcyhcImFjdGl2ZVwiKSApIHtcclxuXHRcdFx0XHQvL2RlYWN0aXZhdGVcclxuXHRcdFx0XHRzblRhcmdldC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly9hY3RpdmF0ZVxyXG5cdFx0XHRcdHNuVGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdFxyXG5cdH07XHJcbn0pKClcclxuIiwiLy8gVGhpcyBpcyBsZXNzIG9mIGEgbW9kdWxlIHRoYW4gaXQgaXMgYSBjb2xsZWN0aW9uIG9mIGNvZGUgZm9yIGEgY29tcGxldGUgcGFnZSAoTW9yZSBwYWdlIGluIHRoaXMgY2FzZSkuXHJcbi8vIEF0IHNvbWUgcG9pbnQsIHdlIHNob3VsZCBjb25zaWRlciBzcGxpdHRpbmcgaXQgdXAgaW50byBiaXRlLXNpemVkIHBpZWNlcy4gRXg6IG1vcmUtbmF2LmpzLCBtb3JlLXNvY2lhbC5qc1xyXG4vLyBhbmQgc28gb24uXHJcblxyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKHdpbmRvdykgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxyXG4gICAgX3Jlc2l6ZSgpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBpZy5kZWJvdW5jZShfbW9yZVNlY3Rpb25NZW51SXRlbSwgNTAwLCB0cnVlKSk7XHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcclxuXHJcbiAgICAvLyBDbG9zZSBidXR0b25cclxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xyXG5cclxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcclxuXHJcbiAgICAvLyBBZG9iZSBBbmFseXRpY3NcclxuICAgICQoJy5nYS1hcnRpY2xlLXNoYXJlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgc2hhcmVUeXBlLCB0aXRsZTtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgIHdpbmRvdy5kaWdpdGFsRGF0YS5ldmVudCA9IHt9O1xyXG4gICAgICB0aXRsZSA9ICR0aGlzLmRhdGEoXCJnYVRpdGxlXCIpLnJlcGxhY2UoL1tcXHNdKy9nLCBcIl9cIik7XHJcblxyXG4gICAgICBpZiAodGl0bGUuc3Vic3RyaW5nKDAsIHRpdGxlLmxlbmd0aCkgPT09IFwiX1wiKSB7XHJcbiAgICAgICAgdGl0bGUgPSB0aXRsZS5zdWJzdHJpbmcoMCwgdGl0bGUubGVuZ3RoIC0gMSlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKFwiZmFjZWJvb2stc2hhcmVcIikpIHtcclxuICAgICAgICBzaGFyZVR5cGUgPSBcIkZhY2Vib29rXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgkdGhpcy5oYXNDbGFzcyhcImxpbmtlZGluLXNoYXJlXCIpKSB7XHJcbiAgICAgICAgc2hhcmVUeXBlID0gXCJMaW5rZWRJblwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoJHRoaXMuaGFzQ2xhc3MoXCJ0d2l0dGVyLXNoYXJlXCIpKSB7XHJcbiAgICAgICAgc2hhcmVUeXBlID0gXCJUd2l0dGVyXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICgkdGhpcy5oYXNDbGFzcyhcImVtYWlsLXNoYXJlXCIpKSB7XHJcbiAgICAgICAgc2hhcmVUeXBlID0gXCJFbWFpbFwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQuc2hhcmVUeXBlID0gc2hhcmVUeXBlO1xyXG4gICAgICB3aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQudGl0bGUgPSB0aXRsZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRW5kIG9mIEluaXRcclxuXHJcbiAgZnVuY3Rpb24gX3Jlc2l6ZSgpIHtcclxuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gMzc1KSB7XHJcbiAgICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgICAgICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb3JlU2VjdGlvbk1lbnVJdGVtKGV2ZW50KSB7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1pbi13aWR0aDogNjQwcHgpXCIpLm1hdGNoZXMpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICAvL0lFIGZpeFxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignZXZlbnQucmV0dXJuVmFsdWUgbm90IGF2YWlsYWJsZScpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcclxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXHJcbiAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgZHJvcGRvd24gb24gY2xpY2tcclxuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgdGl0bGUgb24gY2xpY2tcclxuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XHJcblxyXG4gICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxyXG5cclxuICAgIC8vIFVuZGVybGluZSBhbmltYXRpb25cclxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLicgKyBjbGFzc05hbWVbMF0pLmZhZGVJbignc2xvdycpLmZvY3VzKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyVGl0bGUodGl0bGUpIHtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZU91dCgpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmFkZENsYXNzKCdhY3RpdmUnKS50ZXh0KHRpdGxlKTtcclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLnNob3coKS5jc3Moe1xyXG4gICAgICBsZWZ0OiBjZW50ZXJYXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcclxuICAgIH0sIDEwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21vYmlsZUNhdGVnb3J5TWVudSgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XHJcbiAgICAvLyB0aGlzLm5leHQoKSBzZWxlY3RzIG5leHQgc2libGluZyBlbGVtZW50XHJcbiAgICAvLyBhbnkgc3VnZ2VzdGlvbnMgb24gYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXM/XHJcbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcclxuXHJcbiAgICBpZiAoanNTb2NpYWxEcmF3ZXIuaGFzQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKSkge1xyXG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIuYWRkQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkod2luZG93KVxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKTtcclxuICAgIF9tZXNzYWdlcygpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX21lc3NhZ2VzKCkge1xyXG4gICAgaWYgKGlnLmxhbmcgPT09IFwiZnJcIikge1xyXG4gICAgICAkLmV4dGVuZCggJC52YWxpZGF0b3IubWVzc2FnZXMsIHtcclxuICAgICAgICByZXF1aXJlZDogXCJDZSBjaGFtcCBlc3Qgb2JsaWdhdG9pcmUuXCIsXHJcbiAgICAgICAgcmVtb3RlOiBcIlZldWlsbGV6IGNvcnJpZ2VyIGNlIGNoYW1wLlwiLFxyXG4gICAgICAgIGVtYWlsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2Ugw6lsZWN0cm9uaXF1ZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgdXJsOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBkYXRlOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGRhdGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIGRhdGVJU086IFwiVmV1aWxsZXogZm91cm5pciB1bmUgZGF0ZSB2YWxpZGUgKElTTykuXCIsXHJcbiAgICAgICAgbnVtYmVyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyB2YWxpZGUuXCIsXHJcbiAgICAgICAgZGlnaXRzOiBcIlZldWlsbGV6IGZvdXJuaXIgc2V1bGVtZW50IGRlcyBjaGlmZnJlcy5cIixcclxuICAgICAgICBjcmVkaXRjYXJkOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSBjYXJ0ZSBkZSBjcsOpZGl0IHZhbGlkZS5cIixcclxuICAgICAgICBlcXVhbFRvOiBcIlZldWlsbGV6IGZvdXJuaXIgZW5jb3JlIGxhIG3Dqm1lIHZhbGV1ci5cIixcclxuICAgICAgICBleHRlbnNpb246IFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGF2ZWMgdW5lIGV4dGVuc2lvbiB2YWxpZGUuXCIsXHJcbiAgICAgICAgbWF4bGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBwbHVzIHswfSBjYXJhY3TDqHJlcy5cIiApLFxyXG4gICAgICAgIG1pbmxlbmd0aDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IGNhcmFjdMOocmVzLlwiICksXHJcbiAgICAgICAgcmFuZ2VsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgcXVpIGNvbnRpZW50IGVudHJlIHswfSBldCB7MX0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICByYW5nZTogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIHZhbGV1ciBlbnRyZSB7MH0gZXQgezF9LlwiICksXHJcbiAgICAgICAgbWF4OiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciB1bmUgdmFsZXVyIGluZsOpcmlldXJlIG91IMOpZ2FsZSDDoCB7MH0uXCIgKSxcclxuICAgICAgICBtaW46ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgc3Vww6lyaWV1cmUgb3Ugw6lnYWxlIMOgIHswfS5cIiApLFxyXG4gICAgICAgIHN0ZXA6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIHVuZSB2YWxldXIgbXVsdGlwbGUgZGUgezB9LlwiICksXHJcbiAgICAgICAgbWF4V29yZHM6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJWZXVpbGxleiBmb3VybmlyIGF1IHBsdXMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICBtaW5Xb3JkczogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlZldWlsbGV6IGZvdXJuaXIgYXUgbW9pbnMgezB9IG1vdHMuXCIgKSxcclxuICAgICAgICByYW5nZVdvcmRzOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBlbnRyZSB7MH0gZXQgezF9IG1vdHMuXCIgKSxcclxuICAgICAgICBsZXR0ZXJzd2l0aGJhc2ljcHVuYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcyBldCBkZXMgc2lnbmVzIGRlIHBvbmN0dWF0aW9uLlwiLFxyXG4gICAgICAgIGFscGhhbnVtZXJpYzogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcywgbm9tYnJlcywgZXNwYWNlcyBldCBzb3VsaWduYWdlcy5cIixcclxuICAgICAgICBsZXR0ZXJzb25seTogXCJWZXVpbGxleiBmb3VybmlyIHNldWxlbWVudCBkZXMgbGV0dHJlcy5cIixcclxuICAgICAgICBub3doaXRlc3BhY2U6IFwiVmV1aWxsZXogbmUgcGFzIGluc2NyaXJlIGQnZXNwYWNlcyBibGFuY3MuXCIsXHJcbiAgICAgICAgemlwcmFuZ2U6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCBlbnRyZSA5MDJ4eC14eHh4IGV0IDkwNS14eC14eHh4LlwiLFxyXG4gICAgICAgIGludGVnZXI6IFwiVmV1aWxsZXogZm91cm5pciB1biBub21icmUgbm9uIGTDqWNpbWFsIHF1aSBlc3QgcG9zaXRpZiBvdSBuw6lnYXRpZi5cIixcclxuICAgICAgICB2aW5VUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZCdpZGVudGlmaWNhdGlvbiBkdSB2w6loaWN1bGUgKFZJTikuXCIsXHJcbiAgICAgICAgZGF0ZUlUQTogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBkYXRlIHZhbGlkZS5cIixcclxuICAgICAgICB0aW1lOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGhldXJlIHZhbGlkZSBlbnRyZSAwMDowMCBldCAyMzo1OS5cIixcclxuICAgICAgICBwaG9uZVVTOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSB2YWxpZGUuXCIsXHJcbiAgICAgICAgcGhvbmVVSzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gZGUgdMOpbMOpcGhvbmUgdmFsaWRlLlwiLFxyXG4gICAgICAgIG1vYmlsZVVLOiBcIlZldWlsbGV6IGZvdXJuaXIgdW4gbnVtw6lybyBkZSB0w6lsw6lwaG9uZSBtb2JpbGUgdmFsaWRlLlwiLFxyXG4gICAgICAgIHN0cmlwcGVkbWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gY2FyYWN0w6hyZXMuXCIgKSxcclxuICAgICAgICBlbWFpbDI6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSDDqWxlY3Ryb25pcXVlIHZhbGlkZS5cIixcclxuICAgICAgICB1cmwyOiBcIlZldWlsbGV6IGZvdXJuaXIgdW5lIGFkcmVzc2UgVVJMIHZhbGlkZS5cIixcclxuICAgICAgICBjcmVkaXRjYXJkdHlwZXM6IFwiVmV1aWxsZXogZm91cm5pciB1biBudW3DqXJvIGRlIGNhcnRlIGRlIGNyw6lkaXQgdmFsaWRlLlwiLFxyXG4gICAgICAgIGlwdjQ6IFwiVmV1aWxsZXogZm91cm5pciB1bmUgYWRyZXNzZSBJUCB2NCB2YWxpZGUuXCIsXHJcbiAgICAgICAgaXB2NjogXCJWZXVpbGxleiBmb3VybmlyIHVuZSBhZHJlc3NlIElQIHY2IHZhbGlkZS5cIixcclxuICAgICAgICByZXF1aXJlX2Zyb21fZ3JvdXA6IFwiVmV1aWxsZXogZm91cm5pciBhdSBtb2lucyB7MH0gZGUgY2VzIGNoYW1wcy5cIixcclxuICAgICAgICBuaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklGIHZhbGlkZS5cIixcclxuICAgICAgICBuaWVFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gTklFIHZhbGlkZS5cIixcclxuICAgICAgICBjaWZFUzogXCJWZXVpbGxleiBmb3VybmlyIHVuIG51bcOpcm8gQ0lGIHZhbGlkZS5cIixcclxuICAgICAgICBwb3N0YWxDb2RlQ0E6IFwiVmV1aWxsZXogZm91cm5pciB1biBjb2RlIHBvc3RhbCB2YWxpZGUuXCJcclxuICAgICAgfSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xuICAgIHZhciBwcmV2QXJyb3csXG4gICAgICBuZXh0QXJyb3csXG4gICAgICAkY2Fyb3VzZWw7XG5cbiAgICAkKCcuaWctY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcbiAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XG4gICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XG5cbiAgICAgICRjYXJvdXNlbC5zbGljayh7XG4gICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXG4gICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcbiAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcbiAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXG4gICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxuICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXG4gICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXG4gICAgICB9KVxuICAgIH0pO1xuXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKClcbiIsIi8qKlxyXG4gKiBTaHVmZmxlZCBDYXJvdXNlbFxyXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cclxuICpcclxuICogVXBvbiByZWZyZXNoIG9mIHRoZSBicm93c2VyLCB0aGUgZmlyc3QgdHdvIGl0ZW1zIGFyZSBhZGRlZCB0byB0aGUgc2Vlbkl0ZW1zIG9iamVjdFxyXG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcclxuICogaXMgY2xlYXJlZCBhbmQgdGhlIGNhcm91c2VsIHJlc2V0LlxyXG4gKlxyXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XHJcbiAqIEBwYXJhbSBkYXRhLWFydGljbGVzID0gVGhlIGtleSBvZiB0aGUgZGF0YSBpbiB0aGUganNvbiBvYmplY3RcclxuICogQHJldHVybiBkYXRhLWxpbWl0ID0gVGhlIGFtb3VudCBvZiBpdGVtcyB0byBiZSByZW5kZXJlZCBpbiB0aGUgY2Fyb3VzZWxcclxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgaWdscyA9IGdldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgIGF2YWlsYWJsZUl0ZW1zID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnYXJ0aWNsZXMnKS5hcnRpY2xlcztcclxuICAgICAgICBkYXRhS2V5ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbmFtZScpO1xyXG4gICAgICAgIGFydGljbGVMaW1pdCA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2xpbWl0Jyk7XHJcblxyXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xyXG4gICAgICAgICAgICAvL29iamVjdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0gaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGUoZ2V0UmFuZEFydGljbGVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBpZiAodHlwZW9mKFN0b3JhZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2xvY2Fsc3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlIScpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSUdMUygpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KHt9KSk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XHJcbiAgICAgICAgdmFyIHVwZGF0ZWRPYmogPSBPYmplY3QuYXNzaWduKHt9LCBzZWVuSXRlbXMpO1xyXG4gICAgICAgIGFydGljbGVzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkubWFwKChrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZE9ialtrXSA9IGl0ZW1ba107XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBkZWxldGUgaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIHVuc2VlbiA9IFtdLFxyXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7ICAgXHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGF2YWlsYWJsZUl0ZW1zKS5mb3JFYWNoKChrZXksIGkpID0+IHtcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xyXG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IGF2YWlsYWJsZUl0ZW1zW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICB1bnNlZW4ucHVzaChuZXdPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJhbmRBcnRpY2xlcyA9IHVuc2Vlbi5zcGxpY2UoMCwgYXJ0aWNsZUxpbWl0KTtcclxuXHJcbiAgICAgICAgaWYgKHJhbmRBcnRpY2xlcy5sZW5ndGggPCBhcnRpY2xlTGltaXQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVzcyB0aGFuICcgKyBhcnRpY2xlTGltaXQgKyAnIGl0ZW1zIGxlZnQgdG8gdmlldywgZW1wdHlpbmcgc2Vlbkl0ZW1zIGFuZCByZXN0YXJ0aW5nLicpO1xyXG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcclxuICAgICAgICAgICAgLy9jbGVhciBzZWVuSXRlbXMsIHJlc2V0IGxzLCBhbmQgcmVpbml0XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNodWZmbGUocmFuZEFydGljbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUocmFuZG9tQXJ0aWNsZXMpIHtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGh0bWwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZighcmFuZG9tQXJ0aWNsZXMpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHJhbmRvbUFydGljbGVzLmZvckVhY2goKGFydGljbGUpID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJ0aWNsZSkubWFwKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS5wdXNoKGFydGljbGVba2V5XSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBodG1sID0gTXVzdGFjaGUudG9faHRtbCgkKGAjJHtkYXRhS2V5fWApLmh0bWwoKSwgeyBcImFydGljbGVzXCI6IHRlbXBsYXRlRGF0YSB9KTtcclxuXHJcbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgdXBkYXRlTG9jYWxTdG9yYWdlKHJhbmRvbUFydGljbGVzKTtcclxuXHJcbiAgICAgICAgYnVpbGRDYXJvdXNlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICAgICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgICAgICAgbmV4dEFycm93LFxyXG4gICAgICAgICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgICAgICQoJy5pZy1jYXJvdXNlbCcpLm5vdCgnLnNsaWNrLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkoKVxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuXHRsZXQgc2VjdGlvblRpdGxlID0gJCgnLmFjY29yZGlvbi1tZW51LXNlY3Rpb24tdGl0bGUnKTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdHNlY3Rpb25UaXRsZS5jbGljaygoZSkgPT4ge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdC8vSUUgZml4XHJcblx0XHRcdFx0ZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHR9IGNhdGNoKGVycikgeyBjb25zb2xlLndhcm4oJ2V2ZW50LnJldHVyblZhbHVlIG5vdCBhdmFpbGFibGUnKX1cclxuXHRcdFx0XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXRcclxuXHR9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCh3aW5kb3cpID0+IHtcclxuXHJcbiAgdmFyIHZpZGVvSURzID0gW10sXHJcbiAgICBwbGF5ZXJzID0gW10sXHJcbiAgICBicmlnaHRDb3ZlLFxyXG4gICAgJHZpZGVvO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3BhcnNlVmlkZW9zKCk7XHJcblxyXG4gICAgaWYgKCFpZy5vbGRJRSkge1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAgICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKGJyaWdodENvdmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgIC8vIEZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB2aWRlbydzIGhhdmUgc2Nyb2xsZWQgb2ZmIHNjcmVlbiBhbmQgbmVlZCB0byBiZSBwYXVzZWRcclxuICAgICAgX3ZpZXdTdGF0dXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZVZpZGVvcygpIHtcclxuICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgIGRhdGEgPSB7fSxcclxuICAgICAgcHJlbG9hZE9wdGlvbnMgPSBbJ2F1dG8nLCAnbWV0YWRhdGEnLCAnbm9uZSddO1xyXG5cclxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXHJcbiAgICAkKCcuaWctdmlkZW8tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgJGdyb3VwID0gJCh0aGlzKTtcclxuICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XHJcblxyXG4gICAgICAvLyBMb29wIHRocm91Z2ggdmlkZW8nc1xyXG4gICAgICAkZ3JvdXAuZmluZCgnLmlnLXZpZGVvLWpzJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcbiAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xyXG5cclxuICAgICAgICBpZiAoaWcub2xkSUUpIHtcclxuXHJcbiAgICAgICAgICBfaW5qZWN0SWZyYW1lKGRhdGEsICR2aWRlbyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIHRoYXQgYXJlIHVzZWQgd2l0aCBtb2Rlcm4gYnJvd3NlcnNcclxuICAgICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JykgP1xyXG4gICAgICAgICAgICAkdmlkZW8uZGF0YSgnb3ZlcmxheScpIDpcclxuICAgICAgICAgICAgJyc7XHJcbiAgICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcclxuICAgICAgICAgIGRhdGEudHJhbnNjcmlwdCA9ICR2aWRlby5kYXRhKCd0cmFuc2NyaXB0JykgPyAkdmlkZW8uZGF0YShcclxuICAgICAgICAgICAgJ3RyYW5zY3JpcHQnKSA6ICcnO1xyXG4gICAgICAgICAgZGF0YS5jdGFUZW1wbGF0ZSA9ICR2aWRlby5kYXRhKCdjdGFUZW1wbGF0ZScpID8gJHZpZGVvLmRhdGEoXHJcbiAgICAgICAgICAgICdjdGFUZW1wbGF0ZScpIDogJyc7XHJcblxyXG4gICAgICAgICAgLy8gU3RvcmUgSUQncyBmb3IgYWxsIHZpZGVvJ3Mgb24gdGhlIHBhZ2UgLSBpbiBjYXNlIHdlIHdhbnQgdG8gcnVuIGEgcG9zdC1sb2FkIHByb2Nlc3Mgb24gZWFjaFxyXG4gICAgICAgICAgLy8gVGhlIGNoZWNrIGZvciBhbiBpZCBhbHJlYWR5IGJlaW5nIHN0b3JlZCBpcyBuZWNlc3NhcnkgZm9yIHZpZGVvJ3MgaW4gYSBTbGljayBjYXJvdXNlbFxyXG4gICAgICAgICAgaWYgKHZpZGVvSURzLmluZGV4T2YoZGF0YS5pZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHZpZGVvSURzLnB1c2goZGF0YS5pZCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgICAgX2luamVjdFRlbXBsYXRlKGRhdGEsIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gT25seSBpbmplY3QgQnJpZ2h0Y292ZSBKUyBpZiBtb2Rlcm4gYnJvd3NlclxyXG4gICAgICBpZiAoIWlnLm9sZElFKSB7XHJcbiAgICAgICAgaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoZGF0YSwgaW5kZXgpIHtcclxuICAgIHZhciB0cmFuc2NyaXB0VGV4dCA9IHtcclxuICAgICAgICAnZW4nOiAnVHJhbnNjcmlwdCcsXHJcbiAgICAgICAgJ2ZyJzogJ1RyYW5zY3JpcHRpb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lciAke2RhdGEuaWR9XCI+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+YDtcclxuXHJcbiAgICBpZiAoZGF0YS5jdGFUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tY3RhXCI+JHtkYXRhLmN0YVRlbXBsYXRlfTwvc3Bhbj5gO1xyXG4gICAgfVxyXG4gICAgaWYgKGRhdGEub3ZlcmxheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheVwiIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcke2RhdGEub3ZlcmxheX0nKTtcIj48L3NwYW4+YDtcclxuICAgIH1cclxuICAgIGh0bWwgKz0gYDx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIzOTA2OTQyODYxMDAxXCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiIGNvbnRyb2xzICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PmA7XHJcbiAgICBpZiAoZGF0YS50cmFuc2NyaXB0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInZpZGVvLXRyYW5zY3JpcHRcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnRyYW5zY3JpcHR9XCI+JHt0cmFuc2NyaXB0VGV4dFtpZy5sYW5nXX08L2E+PC9kaXY+YDtcclxuICAgIH1cclxuICAgIGh0bWwgKz0gYDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlICR7ZGF0YS5pZH1cIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG5cclxuICAgIGlmIChkYXRhLm92ZXJsYXkpIHtcclxuICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJyMnICsgZGF0YS5pZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy52aWRlby1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RJZnJhbWUoZGF0YSkge1xyXG4gICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5cclxuICAgICAgPGlmcmFtZSBjbGFzcz1cInZpZGVvLWpzXCIgc3JjPScvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvMzkwNjk0Mjg2MTAwMS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lmh0bWw/dmlkZW9JZD0ke2RhdGEuaWR9J1xyXG4gICAgYWxsb3dmdWxsc2NyZWVuIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlICR7ZGF0YS5pZH1cIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcclxuICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LzM5MDY5NDI4NjEwMDEvJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xyXG4gICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICB2YXIgcGxheWVyO1xyXG4gICAgdmlkZW9JRHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgdmlkZW9qcygnIycgKyBlbCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIGFzc2lnbiB0aGlzIHBsYXllciB0byBhIHZhcmlhYmxlXHJcbiAgICAgICAgcGxheWVyID0gdGhpcztcclxuICAgICAgICAvLyBhc3NpZ24gYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHBsYXkgZXZlbnRcclxuICAgICAgICBwbGF5ZXIub24oJ3BsYXknLCBfb25QbGF5KTtcclxuICAgICAgICAvLyBhc3NpZ24gYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGVuZGVkIGV2ZW50XHJcbiAgICAgICAgcGxheWVyLm9uKCdlbmRlZCcsIF9vbkNvbXBsZXRlKTtcclxuICAgICAgICAvLyBwdXNoIHRoZSBwbGF5ZXIgdG8gdGhlIHBsYXllcnMgYXJyYXlcclxuICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vblBsYXkoZSkge1xyXG4gICAgLy8gQWRvYmUgQW5hbHl0aWNzXHJcbiAgICB3aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQuaWQgPSBlLnRhcmdldC5pZDtcclxuICAgIHdpbmRvdy5kaWdpdGFsRGF0YS5ldmVudC50aXRsZSA9IF9yZXRyaWV2ZVRpdGxlKGUudGFyZ2V0LmlkKTtcclxuICAgIF9zYXRlbGxpdGUudHJhY2soJ3ZpZGVvX3N0YXJ0Jyk7XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHBsYXllciB0aGUgZXZlbnQgaXMgY29taW5nIGZyb21cclxuICAgIHZhciBpZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgLy8gZ28gdGhyb3VnaCBwbGF5ZXJzXHJcbiAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xyXG4gICAgICBpZiAocGxheWVyLmlkKCkgIT09IGlkKSB7XHJcbiAgICAgICAgLy8gcGF1c2UgdGhlIG90aGVyIHBsYXllcihzKVxyXG4gICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29uQ29tcGxldGUoZSkge1xyXG4gICAgLy8gQWRvYmUgQW5hbHl0aWNzXHJcbiAgICB3aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQuaWQgPSBlLnRhcmdldC5pZDtcclxuICAgIHdpbmRvdy5kaWdpdGFsRGF0YS5ldmVudC50aXRsZSA9IF9yZXRyaWV2ZVRpdGxlKGUudGFyZ2V0LmlkKTtcclxuICAgIF9zYXRlbGxpdGUudHJhY2soJ3ZpZGVvX2VuZCcpO1xyXG5cclxuICAgICQoJy4nICsgZS50YXJnZXQuaWQpLmFkZENsYXNzKCdjb21wbGV0ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZpZXdTdGF0dXMoKSB7XHJcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgICBpZiAoISQoJyMnICsgcGxheWVyLmlkKCkpLnZpc2libGUoKSkge1xyXG4gICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmV0cmlldmVUaXRsZShpZCkge1xyXG4gICAgcmV0dXJuICQoJy52aWRlby10aXRsZS4nICsgaWQpLmZpcnN0KCkudGV4dCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQsXHJcbiAgfTtcclxufSkod2luZG93KTtcclxuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0JChkb2N1bWVudCkub24oJ29wZW4uemYucmV2ZWFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgX3NhdGVsbGl0ZS50cmFjaygnbW9kYWxfY2xpY2snKTtcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdFxuXHR9O1xufSkoKVxuXG5cbiIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cblxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXG4gZm9yIGluc3RhbmNlKS5cblxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXG4gKi9cblxuLy8gSW5pdCBTYXRlbGxpdGUgYW5kIGV2ZW50IG9iamVjdFxud2luZG93Ll9zYXRlbGxpdGUgPSB3aW5kb3cuX3NhdGVsbGl0ZSB8fCB7fTtcbndpbmRvdy5fc2F0ZWxsaXRlLnRyYWNrID0gd2luZG93Ll9zYXRlbGxpdGUudHJhY2sgfHwgZnVuY3Rpb24gKCkge307XG53aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQgPSB7fTtcblxuaW1wb3J0IG5hdmlnYXRpb24gZnJvbSAnLi9uYXZpZ2F0aW9uLmpzJ1xuaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcbmltcG9ydCBzaHVmZmxlZENhcm91c2VsIGZyb20gJy4vc2h1ZmZsZWQtY2Fyb3VzZWwuanMnO1xuaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL2FjY29yZGlvbi5qcyc7XG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XG5pbXBvcnQgbW9kYWwgZnJvbSAnLi9tb2RhbC5qcyc7XG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXG4vLyBpbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XG4vLyBpbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XG5cbmNvbnN0IGFwcCA9ICgoKSA9PiB7XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XG5cbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xuICAgIGlmICgkKCcjbWFpbi1uYXZpZ2F0aW9uJykubGVuZ3RoKSBuYXZpZ2F0aW9uLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcbiAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbicpLmxlbmd0aCkgbW9yZS5pbml0KCk7XG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5sZW5ndGgpIHNodWZmbGVkQ2Fyb3VzZWwuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctdmlkZW8tZ3JvdXAnKS5sZW5ndGgpIHZpZGVvLmluaXQoKTtcbiAgICBpZiAoJCgnLmFjY29yZGlvbicpLmxlbmd0aCkgYWNjb3JkaW9uLmluaXQoKTtcbiAgICBpZiAoJCgnW2RhdGEtb3Blbl0nKS5sZW5ndGgpIG1vZGFsLmluaXQoKTtcblxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQxJykubGVuZ3RoKSBldnQxLmluaXQoJy5pZy1ldnQxJyk7XG4gICAgLy8gaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XG5cbiAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxuICAgIF9sYW5ndWFnZSgpO1xuXG4gICAgLy8gRHVlIHRvIGRpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnMgb2YgY2Fyb3VzZWxzLCB0cmFja2luZyBuZWVkcyB0byBiZSBhZGRlZCBoZXJlIGFuZCBub3QgaW4gY2Fyb3VzZWwuanNcbiAgICBfYWRkQ2Fyb3VzZWxUcmFja2luZygpO1xuICB9XG5cbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xuICBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2FkZENhcm91c2VsVHJhY2tpbmcoKSB7XG4gICAgJCgnLnNsaWNrLWFycm93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgX3NhdGVsbGl0ZS50cmFjaygnY2Fyb3VzZWxfc2Nyb2xsJyk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfVxufSkoKTtcblxuLy8gQm9vdHN0cmFwIGFwcFxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICBhcHAuaW5pdCgpO1xufSk7XG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwib2xkSUUiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJzZXRUaW1lb3V0IiwiYm9keSIsIiQiLCJtZW51SWNvbiIsImNsb3NlQnV0dG9uIiwic2hvd0ZvckxhcmdlIiwic2VhcmNoSW5wdXQiLCJoYXNTdWJOYXYiLCJpbml0Iiwic2NvcGUiLCJjbGljayIsImUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiZm9jdXMiLCJzblRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJoYXNDbGFzcyIsIm9uIiwiaWciLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsInNoYXJlVHlwZSIsInRpdGxlIiwiJHRoaXMiLCJkaWdpdGFsRGF0YSIsImV2ZW50IiwiZGF0YSIsInJlcGxhY2UiLCJzdWJzdHJpbmciLCJsZW5ndGgiLCJfcmVzaXplIiwicmVzaXplIiwid2lkdGgiLCJjc3MiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInJldHVyblZhbHVlIiwiZXJyIiwid2FybiIsInByZXZlbnREZWZhdWx0Iiwib2Zmc2V0IiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0ZXh0IiwiX2ZpbHRlckRyb3Bkb3duIiwiaGlkZSIsImZhZGVJbiIsIl9maWx0ZXJUaXRsZSIsImZhZGVPdXQiLCJfcmVwb3NpdGlvbkFycm93Iiwic2hvdyIsIl9hbmltYXRpb25VbmRlcmxpbmUiLCJ0b2dnbGVDbGFzcyIsImpzU29jaWFsRHJhd2VyIiwibmV4dCIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwicGFyZW50IiwiYXBwZW5kIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJfbWVzc2FnZXMiLCJleHRlbmQiLCJtZXNzYWdlcyIsImZvcm1hdCIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlTG9jYWxTdG9yYWdlIiwidXBkYXRlZE9iaiIsImZvckVhY2giLCJpdGVtIiwiaSIsImtleXMiLCJtYXAiLCJrIiwicmVzZXRMb2NhbFN0b3JhZ2UiLCJ1bnNlZW4iLCJyYW5kQXJ0aWNsZXMiLCJrZXkiLCJuZXdPYmoiLCJwdXNoIiwic3BsaWNlIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdlbmVyYXRlVGVtcGxhdGUiLCJyYW5kb21BcnRpY2xlcyIsImh0bWwiLCJ0ZW1wbGF0ZURhdGEiLCJhcnRpY2xlIiwiTXVzdGFjaGUiLCJ0b19odG1sIiwiYnVpbGRDYXJvdXNlbCIsIm5vdCIsInNlY3Rpb25UaXRsZSIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCIkdmlkZW8iLCJzZXRJbnRlcnZhbCIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsInByZWxvYWRPcHRpb25zIiwicGxheWVyIiwiaWQiLCJkZXNjcmlwdGlvbiIsIm92ZXJsYXkiLCJhdXRvIiwicHJlbG9hZCIsInRyYW5zY3JpcHQiLCJjdGFUZW1wbGF0ZSIsIl9pbmplY3RUZW1wbGF0ZSIsInRyYW5zY3JpcHRUZXh0IiwicmVwbGFjZVdpdGgiLCJkb2N1bWVudCIsInNpYmxpbmdzIiwiX2luamVjdElmcmFtZSIsImluamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZWwiLCJyZWFkeSIsIl9vblBsYXkiLCJfb25Db21wbGV0ZSIsInRhcmdldCIsIl9yZXRyaWV2ZVRpdGxlIiwidHJhY2siLCJwYXVzZSIsIl92aWV3U3RhdHVzIiwic2Nyb2xsIiwidmlzaWJsZSIsImZpcnN0IiwiX3NhdGVsbGl0ZSIsImFwcCIsImZvdW5kYXRpb24iLCJuYXZpZ2F0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJzaHVmZmxlZENhcm91c2VsIiwidmlkZW8iLCJhY2NvcmRpb24iLCJtb2RhbCIsIl9sYW5ndWFnZSIsIl9hZGRDYXJvdXNlbFRyYWNraW5nIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0E7OztBQUtBLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01BQ25CQyxPQUFPQyxRQUFQLENB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