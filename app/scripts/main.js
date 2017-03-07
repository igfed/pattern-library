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
  if (window.location.pathname.indexOf('/fr/') !== -1) {
    return 'fr';
  } else {
    return 'en';
  }
}();

// browser width
var browserWidth = function () {
  return window.outerWidth;
}();

// base eventEmitter
var emitter = new EventEmitter();

// This is less of a module than it is a collection of code for a complete page (More page in this case).
// At some point, we should consider splitting it up into bite-sized pieces. Ex: more-nav.js, more-social.js
// and so on.

var more = (function () {
  function init() {

    // Register resize behaviour
    _resize();

    // Register Click Handlers

    // Mobile Category menu
    $('.more-section-menuitem').on('click', event, _moreSectionMenuItem);

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
      if (browserWidth < 640) {
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

  function _moreSectionMenuItem() {
    event.preventDefault();

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
    $('.more-section-menu-dropdown-category-wrapper').fadeIn('slow').focus().filter(':not(.' + className + ')').hide();
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

  return {
    init: init
  };
})();

var carousel = (function () {

  function init() {
    console.log('Carousel Initialized!');

    // Not sure what this does at this point or how it relates to Carousels
    $('[data-responsive-toggle] button').on('click', function () {
      $('body').toggleClass('site-header-is-active');
    });

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

var shuffledCarousel = (function () {

    var data = {
        "content": {
            "0": {
                "title": "A lifetime of memories awaits!",
                "description": "Introduce a friend, collegue or a family member to an Investors Group Consultant to win a trip for two.",
                "image-path": "images/featured-topics-brazil.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "1": {
                "title": "This week in the markets",
                "description": "Central bank action prompts equity market gains.",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "2": {
                "title": "About your client statement",
                "description": "To help you get the most value out of your statement, this guide explains what's behind each section.",
                "image-path": "images/featured-topics-client-statement.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "3": {
                "title": "Item 4",
                "description": "Item 4",
                "image-path": "images/featured-topics-brazil.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "4": {
                "title": "Item 5",
                "description": "Item 5",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "5": {
                "title": "Item 6",
                "description": "Item 6",
                "image-path": "images/featured-topics-brazil.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "6": {
                "title": "Item 7",
                "description": "Item 7",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },

            "7": {
                "title": "Item 8",
                "description": "Item 8",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "8": {
                "title": "Item 9",
                "description": "Item 9",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "9": {
                "title": "Item 10",
                "description": "Item 10",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "10": {
                "title": "Item 11",
                "description": "Item 11",
                "image-path": "images/featured-topics-brazil.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "11": {
                "title": "Item 12",
                "description": "Item 12",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "12": {
                "title": "Item 13",
                "description": "Item 13",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "13": {
                "title": "Item 14",
                "description": "Item 14",
                "image-path": "images/featured-topics-brazil.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "14": {
                "title": "Item 15",
                "description": "Item 15",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "15": {
                "title": "Item 16",
                "description": "Item 16",
                "image-path": "images/featured-topics-brazil.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "16": {
                "title": "Item 17",
                "description": "Item 17",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "17": {
                "title": "Item 18",
                "description": "Item 18",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "18": {
                "title": "Item 19",
                "description": "Item 19",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "19": {
                "title": "Item 20",
                "description": "Item 20",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            }
        }
    },
        template,
        html,
        availableItems,
        seenItems,
        igls;

    function init() {

        igls = getLocalStorage(), availableItems = data.content;
        seenItems = {
            "0": {
                "title": "A lifetime of memories awaits!",
                "description": "Introduce a friend, collegue or a family member to an Investors Group Consultant to win a trip for two.",
                "image-path": "images/featured-topics-brazil.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            },
            "7": {
                "title": "Item 8",
                "description": "Item 8",
                "image-path": "images/featured-topics-investments-fez.jpg",
                "image-alt": "Win a Trip to Brazil image",
                "cta": "Learn More",
                "link": "more/en/"
            }
        };

        //Will have to do a check later to see if this already exists in ls, 
        //but for POC I will do this
        igls['advice-stories'] = seenItems;

        generateTemplate(getRandEight(igls['advice-stories']));
    }

    function getLocalStorage() {
        if (typeof Storage !== "undefined") {
            return localStorage.getItem("ig") ? JSON.parse(localStorage.getItem("ig")) : localStorage.setItem("ig", JSON.stringify({}));
        } else {
            console.warn('localstorage is not available!');
            return;
        }
    }

    function getRandEight(blackList) {
        var unseen = [];
        Object.keys(availableItems).forEach(function (key) {
            if (!seenItems[key]) {
                unseen.push(availableItems[key]);
            }
        });
        return shuffle(unseen).splice(0, 8);
    }

    function generateTemplate(data) {

        template = "\n        <div class=\"row ig-carousel carousel\" data-dots=\"true\" data-infinite=\"true\" data-arrows=\"true\" data-responsive='[{\"breakpoint\": 640, \"settings\": {\"slidesToShow\": 3}}]'>\n            {{#content}}\n            <div class=\"medium-4 columns\">\n              <figure>\n                <a href=\"{{link}}\">\n                  <img src=\"{{image-path}}\" alt=\"{{image-alt}}\" />\n                  <figcaption>\n                    <h2>{{title}}</h2>\n                    <p>{{description}}</p>\n                    <p class=\"tertiary-cta\">{{cta}}</p>\n                  </figcaption>\n                </a>\n              </figure>\n            </div>\n            {{/content}}\n        </div>";

        var html = Mustache.to_html(template, { "content": data });
        $('.ig-shuffled-carousel').html(html);

        buildCarousel();
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

  var vids = [],
      brightCove;

  function init() {
    _parseVideos();

    // Not using this functionality at the moment (essentially an onLoadComplete) - might be required down the road
    //
    // Make sure the VideoJS method is available and fire ready event handlers if so
    // brightCove = setInterval(function () {
    //   if ($('.vjs-plugins-ready').length) {
    //     _brightCoveReady();
    //     clearInterval(brightCove);
    //   }
    // }, 500)
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
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data('description') : '';
        data.auto = $video.data('autoplay') ? 'autoplay' : '';
        data.ctrl = $video.data('controls') ? 'controls' : '';
        data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';

        // Store ID's for all video's on the page - in case we want to run a post-load process on each
        vids.push(data.id);

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
    var html = '<div class="video-container"><span class="video-overlay ' + data.id + '"></span><div class="video-container-responsive"><video data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video></div></div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video.replaceWith(html);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXG51c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XG5cbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcbiAqL1xuXG4vLyB1cmwgcGF0aFxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG59KSgpXG5cbi8vIGxhbmd1YWdlXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gJ2ZyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufSkoKVxuXG4vLyBicm93c2VyIHdpZHRoXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcbn0pKClcblxuLy8gYmFzZSBldmVudEVtaXR0ZXJcbmV4cG9ydCB2YXIgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXG5cbiIsIi8vIFRoaXMgaXMgbGVzcyBvZiBhIG1vZHVsZSB0aGFuIGl0IGlzIGEgY29sbGVjdGlvbiBvZiBjb2RlIGZvciBhIGNvbXBsZXRlIHBhZ2UgKE1vcmUgcGFnZSBpbiB0aGlzIGNhc2UpLlxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXG4vLyBhbmQgc28gb24uXG5cbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIFJlZ2lzdGVyIHJlc2l6ZSBiZWhhdmlvdXJcbiAgICBfcmVzaXplKCk7XG5cbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xuXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnVpdGVtJykub24oJ2NsaWNrJywgZXZlbnQsIF9tb3JlU2VjdGlvbk1lbnVJdGVtKTtcblxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xuXG4gICAgLy8gQ2xvc2UgYnV0dG9uXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XG5cbiAgICAvLyBTb2NpYWwgZHJhd2VyXG4gICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykub24oJ2NsaWNrJywgX29wZW5Tb2NpYWxEcmF3ZXIpO1xuICB9XG5cbiAgLy8gRW5kIG9mIEluaXRcblxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlnLmJyb3dzZXJXaWR0aCA8IDY0MCkge1xuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdmbGV4Jykge1xuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfY2xvc2VCdXR0b24oKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX21vcmVTZWN0aW9uTWVudUl0ZW0oKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKSxcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcbiAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxuICAgICAgY2xhc3NOYW1lID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvW1xcdy1dKmNhdGVnb3J5W1xcdy1dKi9nKSxcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xuXG4gICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XG5cbiAgICAvLyBBcnJvdyBwb3NpdGlvbiBtb3ZlIG9uIGNsaWNrXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxuXG4gICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmZhZGVJbignc2xvdycpLmZvY3VzKCkuZmlsdGVyKCc6bm90KC4nICsgY2xhc3NOYW1lICsgJyknKS5oaWRlKCk7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2ZpbHRlclRpdGxlKHRpdGxlKSB7XG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xuICAgIH0sIDIwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5zaG93KCkuY3NzKHsgbGVmdDogY2VudGVyWCB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hbmltYXRpb25VbmRlcmxpbmUoKSB7XG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLmFkZENsYXNzKCdhbmltYXRlJylcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLmhpZGUoKTtcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCdwLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmZhZGVJbignc2xvdycpO1xuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gX29wZW5Tb2NpYWxEcmF3ZXIoKSB7XG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxuICAgIC8vIGFueSBzdWdnZXN0aW9ucyBvbiBhIGJldHRlciB3YXkgdG8gZG8gdGhpcz9cbiAgICB2YXIganNTb2NpYWxEcmF3ZXIgPSAkKHRoaXMpLm5leHQoKTtcblxuICAgIGlmIChqc1NvY2lhbERyYXdlci5oYXNDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpKSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc1NvY2lhbERyYXdlci5hZGRDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICB2YXIgZW5kcG9pbnRVUkwsXG4gICAgc3VjY2Vzc1VSTCxcbiAgICBjYW5jZWxVUkwsXG4gICAgJGZvcm0sXG4gICAgJGZvcm1XcmFwcGVyO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xuXG4gICAgX3ZhbGlkYXRpb24oKTtcbiAgICBfdG9nZ2xlcigpXG4gIH1cblxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xuICAgIH0pO1xuXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xuICAgICAgZGVidWc6IHRydWUsXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXG4gICAgfSk7XG5cbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XG5cbiAgICAkZm9ybS52YWxpZGF0ZSh7XG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9wcm9jZXNzKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBydWxlczoge1xuICAgICAgICBwaG9uZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHBob25lVVM6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcGhvbmUyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwb3N0YWxfY29kZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmaXJzdG5hbWU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBsYXN0bmFtZToge1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWwyOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcbiAgICB2YXIgZm9ybURhdGFSYXcsXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcblxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcblxuXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xuICAgICQuYWpheCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcblxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXG4gICAgJCgnW2RhdGEtcmVzcG9uc2l2ZS10b2dnbGVdIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2l0ZS1oZWFkZXItaXMtYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgdmFyIHByZXZBcnJvdyxcbiAgICAgIG5leHRBcnJvdyxcbiAgICAgICRjYXJvdXNlbDtcblxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcblxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIFwiY29udGVudFwiOiB7XG4gICAgICAgICAgICAgICAgXCIwXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkEgbGlmZXRpbWUgb2YgbWVtb3JpZXMgYXdhaXRzIVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiSW50cm9kdWNlIGEgZnJpZW5kLCBjb2xsZWd1ZSBvciBhIGZhbWlseSBtZW1iZXIgdG8gYW4gSW52ZXN0b3JzIEdyb3VwIENvbnN1bHRhbnQgdG8gd2luIGEgdHJpcCBmb3IgdHdvLlwiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWJyYXppbC5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCIxXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlRoaXMgd2VlayBpbiB0aGUgbWFya2V0c1wiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQ2VudHJhbCBiYW5rIGFjdGlvbiBwcm9tcHRzIGVxdWl0eSBtYXJrZXQgZ2FpbnMuXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtcGF0aFwiOiBcImltYWdlcy9mZWF0dXJlZC10b3BpY3MtaW52ZXN0bWVudHMtZmV6LmpwZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLWFsdFwiOiBcIldpbiBhIFRyaXAgdG8gQnJhemlsIGltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3RhXCI6IFwiTGVhcm4gTW9yZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCJtb3JlL2VuL1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIjJcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQWJvdXQgeW91ciBjbGllbnQgc3RhdGVtZW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJUbyBoZWxwIHlvdSBnZXQgdGhlIG1vc3QgdmFsdWUgb3V0IG9mIHlvdXIgc3RhdGVtZW50LCB0aGlzIGd1aWRlIGV4cGxhaW5zIHdoYXQncyBiZWhpbmQgZWFjaCBzZWN0aW9uLlwiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWNsaWVudC1zdGF0ZW1lbnQuanBnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtYWx0XCI6IFwiV2luIGEgVHJpcCB0byBCcmF6aWwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjdGFcIjogXCJMZWFybiBNb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiM1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJJdGVtIDRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gNFwiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWJyYXppbC5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCI0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkl0ZW0gNVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiSXRlbSA1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtcGF0aFwiOiBcImltYWdlcy9mZWF0dXJlZC10b3BpY3MtaW52ZXN0bWVudHMtZmV6LmpwZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLWFsdFwiOiBcIldpbiBhIFRyaXAgdG8gQnJhemlsIGltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3RhXCI6IFwiTGVhcm4gTW9yZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCJtb3JlL2VuL1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIjVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSXRlbSA2XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJdGVtIDZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1wYXRoXCI6IFwiaW1hZ2VzL2ZlYXR1cmVkLXRvcGljcy1icmF6aWwuanBnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtYWx0XCI6IFwiV2luIGEgVHJpcCB0byBCcmF6aWwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjdGFcIjogXCJMZWFybiBNb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiNlwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJJdGVtIDdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gN1wiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWludmVzdG1lbnRzLWZlei5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBcIjdcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSXRlbSA4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJdGVtIDhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1wYXRoXCI6IFwiaW1hZ2VzL2ZlYXR1cmVkLXRvcGljcy1pbnZlc3RtZW50cy1mZXouanBnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtYWx0XCI6IFwiV2luIGEgVHJpcCB0byBCcmF6aWwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjdGFcIjogXCJMZWFybiBNb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiOFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJJdGVtIDlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gOVwiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWludmVzdG1lbnRzLWZlei5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCI5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkl0ZW0gMTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gMTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1wYXRoXCI6IFwiaW1hZ2VzL2ZlYXR1cmVkLXRvcGljcy1pbnZlc3RtZW50cy1mZXouanBnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtYWx0XCI6IFwiV2luIGEgVHJpcCB0byBCcmF6aWwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjdGFcIjogXCJMZWFybiBNb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiMTBcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSXRlbSAxMVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiSXRlbSAxMVwiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWJyYXppbC5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCIxMVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJJdGVtIDEyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJdGVtIDEyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtcGF0aFwiOiBcImltYWdlcy9mZWF0dXJlZC10b3BpY3MtaW52ZXN0bWVudHMtZmV6LmpwZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLWFsdFwiOiBcIldpbiBhIFRyaXAgdG8gQnJhemlsIGltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3RhXCI6IFwiTGVhcm4gTW9yZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCJtb3JlL2VuL1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIjEyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkl0ZW0gMTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gMTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1wYXRoXCI6IFwiaW1hZ2VzL2ZlYXR1cmVkLXRvcGljcy1pbnZlc3RtZW50cy1mZXouanBnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtYWx0XCI6IFwiV2luIGEgVHJpcCB0byBCcmF6aWwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjdGFcIjogXCJMZWFybiBNb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiMTNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSXRlbSAxNFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiSXRlbSAxNFwiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWJyYXppbC5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCIxNFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJJdGVtIDE1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJdGVtIDE1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtcGF0aFwiOiBcImltYWdlcy9mZWF0dXJlZC10b3BpY3MtaW52ZXN0bWVudHMtZmV6LmpwZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLWFsdFwiOiBcIldpbiBhIFRyaXAgdG8gQnJhemlsIGltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3RhXCI6IFwiTGVhcm4gTW9yZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCJtb3JlL2VuL1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIjE1XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkl0ZW0gMTZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gMTZcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1wYXRoXCI6IFwiaW1hZ2VzL2ZlYXR1cmVkLXRvcGljcy1icmF6aWwuanBnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtYWx0XCI6IFwiV2luIGEgVHJpcCB0byBCcmF6aWwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjdGFcIjogXCJMZWFybiBNb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiMTZcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSXRlbSAxN1wiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiSXRlbSAxN1wiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWludmVzdG1lbnRzLWZlei5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCIxN1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJJdGVtIDE4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJdGVtIDE4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtcGF0aFwiOiBcImltYWdlcy9mZWF0dXJlZC10b3BpY3MtaW52ZXN0bWVudHMtZmV6LmpwZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLWFsdFwiOiBcIldpbiBhIFRyaXAgdG8gQnJhemlsIGltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY3RhXCI6IFwiTGVhcm4gTW9yZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCJtb3JlL2VuL1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIjE4XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkl0ZW0gMTlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gMTlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1wYXRoXCI6IFwiaW1hZ2VzL2ZlYXR1cmVkLXRvcGljcy1pbnZlc3RtZW50cy1mZXouanBnXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UtYWx0XCI6IFwiV2luIGEgVHJpcCB0byBCcmF6aWwgaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjdGFcIjogXCJMZWFybiBNb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiMTlcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiSXRlbSAyMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiSXRlbSAyMFwiLFxuICAgICAgICAgICAgICAgICAgICBcImltYWdlLXBhdGhcIjogXCJpbWFnZXMvZmVhdHVyZWQtdG9waWNzLWludmVzdG1lbnRzLWZlei5qcGdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZS1hbHRcIjogXCJXaW4gYSBUcmlwIHRvIEJyYXppbCBpbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwibW9yZS9lbi9cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGUsIGh0bWwsIGF2YWlsYWJsZUl0ZW1zLCBzZWVuSXRlbXMsIGlnbHM7XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuXG4gICAgICAgIGlnbHMgPSBnZXRMb2NhbFN0b3JhZ2UoKSxcbiAgICAgICAgYXZhaWxhYmxlSXRlbXMgPSBkYXRhLmNvbnRlbnQ7XG4gICAgICAgIHNlZW5JdGVtcyA9IHtcbiAgICAgICAgICBcIjBcIjoge1xuICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQSBsaWZldGltZSBvZiBtZW1vcmllcyBhd2FpdHMhXCIsXG4gICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJbnRyb2R1Y2UgYSBmcmllbmQsIGNvbGxlZ3VlIG9yIGEgZmFtaWx5IG1lbWJlciB0byBhbiBJbnZlc3RvcnMgR3JvdXAgQ29uc3VsdGFudCB0byB3aW4gYSB0cmlwIGZvciB0d28uXCIsXG4gICAgICAgICAgICAgIFwiaW1hZ2UtcGF0aFwiOiBcImltYWdlcy9mZWF0dXJlZC10b3BpY3MtYnJhemlsLmpwZ1wiLFxuICAgICAgICAgICAgICBcImltYWdlLWFsdFwiOiBcIldpbiBhIFRyaXAgdG8gQnJhemlsIGltYWdlXCIsXG4gICAgICAgICAgICAgIFwiY3RhXCI6IFwiTGVhcm4gTW9yZVwiLFxuICAgICAgICAgICAgICBcImxpbmtcIjogXCJtb3JlL2VuL1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIjdcIjoge1xuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkl0ZW0gOFwiLFxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkl0ZW0gOFwiLFxuICAgICAgICAgICAgXCJpbWFnZS1wYXRoXCI6IFwiaW1hZ2VzL2ZlYXR1cmVkLXRvcGljcy1pbnZlc3RtZW50cy1mZXouanBnXCIsXG4gICAgICAgICAgICBcImltYWdlLWFsdFwiOiBcIldpbiBhIFRyaXAgdG8gQnJhemlsIGltYWdlXCIsXG4gICAgICAgICAgICBcImN0YVwiOiBcIkxlYXJuIE1vcmVcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIm1vcmUvZW4vXCJcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9XaWxsIGhhdmUgdG8gZG8gYSBjaGVjayBsYXRlciB0byBzZWUgaWYgdGhpcyBhbHJlYWR5IGV4aXN0cyBpbiBscywgXG4gICAgICAgIC8vYnV0IGZvciBQT0MgSSB3aWxsIGRvIHRoaXNcbiAgICAgICAgaWdsc1snYWR2aWNlLXN0b3JpZXMnXSA9IHNlZW5JdGVtcztcblxuICAgICAgICBnZW5lcmF0ZVRlbXBsYXRlKGdldFJhbmRFaWdodChpZ2xzWydhZHZpY2Utc3RvcmllcyddKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBpZiAodHlwZW9mKFN0b3JhZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSA/IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSkgOiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KHt9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2xvY2Fsc3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlIScpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kRWlnaHQoYmxhY2tMaXN0KSB7XG4gICAgICB2YXIgdW5zZWVuID0gW107XG4gICAgICBPYmplY3Qua2V5cyhhdmFpbGFibGVJdGVtcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmKCFzZWVuSXRlbXNba2V5XSkge1xuICAgICAgICAgIHVuc2Vlbi5wdXNoKGF2YWlsYWJsZUl0ZW1zW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzaHVmZmxlKHVuc2Vlbikuc3BsaWNlKDAsIDgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUoZGF0YSkge1xuXG4gICAgICAgIHRlbXBsYXRlID0gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGlnLWNhcm91c2VsIGNhcm91c2VsXCIgZGF0YS1kb3RzPVwidHJ1ZVwiIGRhdGEtaW5maW5pdGU9XCJ0cnVlXCIgZGF0YS1hcnJvd3M9XCJ0cnVlXCIgZGF0YS1yZXNwb25zaXZlPSdbe1wiYnJlYWtwb2ludFwiOiA2NDAsIFwic2V0dGluZ3NcIjoge1wic2xpZGVzVG9TaG93XCI6IDN9fV0nPlxuICAgICAgICAgICAge3sjY29udGVudH19XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaXVtLTQgY29sdW1uc1wiPlxuICAgICAgICAgICAgICA8ZmlndXJlPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7e2xpbmt9fVwiPlxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJ7e2ltYWdlLXBhdGh9fVwiIGFsdD1cInt7aW1hZ2UtYWx0fX1cIiAvPlxuICAgICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxoMj57e3RpdGxlfX08L2gyPlxuICAgICAgICAgICAgICAgICAgICA8cD57e2Rlc2NyaXB0aW9ufX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGVydGlhcnktY3RhXCI+e3tjdGF9fTwvcD5cbiAgICAgICAgICAgICAgICAgIDwvZmlnY2FwdGlvbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZmlndXJlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7ey9jb250ZW50fX1cbiAgICAgICAgPC9kaXY+YDtcblxuICAgICAgICB2YXIgaHRtbCA9IE11c3RhY2hlLnRvX2h0bWwodGVtcGxhdGUsIHsgXCJjb250ZW50XCIgOiBkYXRhIH0gKTtcbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcblxuICAgICAgICBidWlsZENhcm91c2VsKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1aWxkQ2Fyb3VzZWwoKSB7XG4gICAgICAgIHZhciBwcmV2QXJyb3csXG4gICAgICAgICAgICBuZXh0QXJyb3csXG4gICAgICAgICAgICAkY2Fyb3VzZWw7XG5cbiAgICAgICAgJCgnLmlnLWNhcm91c2VsJykubm90KCcuc2xpY2staW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XG4gICAgICAgICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xuICAgICAgICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xuXG4gICAgICAgICAgICAkY2Fyb3VzZWwuc2xpY2soe1xuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxuICAgICAgICAgICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKVxuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG4gIHZhciB2aWRzID0gW10sIGJyaWdodENvdmU7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBfcGFyc2VWaWRlb3MoKTtcblxuICAgIC8vIE5vdCB1c2luZyB0aGlzIGZ1bmN0aW9uYWxpdHkgYXQgdGhlIG1vbWVudCAoZXNzZW50aWFsbHkgYW4gb25Mb2FkQ29tcGxldGUpIC0gbWlnaHQgYmUgcmVxdWlyZWQgZG93biB0aGUgcm9hZFxuICAgIC8vXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnMgaWYgc29cbiAgICAvLyBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIC8vICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xuICAgIC8vICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XG4gICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XG4gICAgLy8gICB9XG4gICAgLy8gfSwgNTAwKVxuICB9XG5cbiAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xuICAgIHZhciAkZ3JvdXAsXG4gICAgICAkdmlkZW8sXG4gICAgICBkYXRhID0ge30sXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ11cblxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xuICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xuXG4gICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXG4gICAgICAgIGRhdGEuaWQgPSAkdmlkZW8uZGF0YSgnaWQnKTtcblxuICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcbiAgICAgICAgZGF0YS5jdHJsID0gJHZpZGVvLmRhdGEoJ2NvbnRyb2xzJykgPyAnY29udHJvbHMnIDogJyc7XG4gICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcblxuICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXG4gICAgICAgIHZpZHMucHVzaChkYXRhLmlkKTtcblxuICAgICAgICAvLyBMZXQncyByZXBsYWNlIHRoZSBpZy12aWRlby1qcyAnZGlyZWN0aXZlJyB3aXRoIHRoZSBuZWNlc3NhcnkgQnJpZ2h0Y292ZSBjb2RlXG4gICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KVxuICAgICAgfSk7XG5cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX2luamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcbiAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4anMpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcbiAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+PHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5ICR7ZGF0YS5pZH1cIj48L3NwYW4+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+PHZpZGVvIGRhdGEtdmlkZW8taWQ9XCIke2RhdGEuaWR9XCIgcHJlbG9hZD1cIiR7ZGF0YS5wcmVsb2FkfVwiIGRhdGEtYWNjb3VudD1cIiR7ZGF0YS5hY2NvdW50fVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiAke2RhdGEuY3RybH0gJHtkYXRhLmF1dG99PjwvdmlkZW8+PC9kaXY+PC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xuICAgICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XG4gICAgdmlkcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmlkZW9qcygnIycgKyBlbCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAkKCcudmlkZW8tb3ZlcmxheS4nKyBlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICAvLyBEZWZpbmUgY29tcG9uZW50LWxldmVsIHZhcmlhYmxlc1xuICB2YXIgbWVzc2FnZXMgPSBbXSxcbiAgICBjb3VudGVyID0gMDtcblxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcbiAgICB2YXIgJHRoaXMgPSAkKHNjb3BlKTtcblxuICAgIC8vIExldCdzIGNyZWF0ZSBhIG1lc3NhZ2UgYXJyYXlcbiAgICBtZXNzYWdlcyA9IFsnSGVsbG8hJywgJ0lzIGl0IG1lIHlvdVxcJ3JlIGxvb2tpbmcgZm9yPycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBleWVzJywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIHNtaWxlJywgJ1lvdVxcJ3JlIGFsbCBJXFwndmUgZXZlciB3YW50ZWQnLCAnQW5kIG15IGFybXMgYXJlIG9wZW4gd2lkZScsICdcXCdjYXVzZSB5b3Uga25vdyBqdXN0IHdoYXQgdG8gc2F5JywgJ0FuZCB5b3Uga25vdyBqdXN0IHdoYXQgdG8gZG8nLCAnQW5kIEkgd2FudCB0byB0ZWxsIHlvdSBzbyBtdWNoJ107XG5cbiAgICAvLyBSZWdpc3RlciBjbGljayBoYW5kbGVyXG4gICAgJHRoaXMuZmluZCgnYS5idXR0b24ubWVzc2FnZScpLm9uKCdjbGljaycsIGV2ZW50LCBfc2F5SGVsbG8pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NheUhlbGxvKCkge1xuICAgIC8vIExldCdzIGVtaXQgYW4gZXZlbnQgd2l0aCBhbiBpbmRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCBzZW5kIGFsb25nIHNvbWV0aGluZyB0byBkaXNwbGF5XG4gICAgaWcuZW1pdHRlci5lbWl0KCdoZWxsbycsIG1lc3NhZ2VzW2NvdW50ZXJdKTtcbiAgICBjb3VudGVyICs9IDE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XG4gIHZhciAkdGhpc1xuXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxuICAgICR0aGlzID0gJChzY29wZSk7XG4gICAgX2xpc3RlbmVyKCk7XG4gIH1cblxuICAvLyBXZSBrbm93IG5vdGhpbmcgYWJvdXQgdGhlIGNvbXBvbmVudCB0aGF0IHdpbGwgc2VuZCB0aGUgbWVzc2FnZS4gT25seSB0aGF0IGl0IHdpbGwgaGF2ZVxuICAvLyBhbiBpZGVudGlmaWVyIG9mICdoZWxsbycgYW5kIHRoYXQgd2Ugd2lsbCByZWNlaXZlIGEgJ21lc3NhZ2UnIHRvIGRpc3BsYXkuXG4gIGZ1bmN0aW9uIF9saXN0ZW5lcigpIHtcbiAgICBpZy5lbWl0dGVyLm9uKCdoZWxsbycsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAkKCc8cCBjbGFzcz1cImFsZXJ0LWJveCBhbGVydFwiPicgKyBtZXNzYWdlICsgJzwvcD4nKS5oaWRlKCkuYXBwZW5kVG8oJHRoaXMpLmZhZGVJbignZmFzdCcpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxuXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcbiBmb3IgaW5zdGFuY2UpLlxuXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cbiAqL1xuXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xuaW1wb3J0IHNodWZmbGVkQ2Fyb3VzZWwgZnJvbSAnLi9zaHVmZmxlZC1jYXJvdXNlbC5qcyc7XG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vYWNjb3JkaW9uLmpzJztcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcbmltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcbmltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcblxuY29uc3QgYXBwID0gKCgpID0+IHtcbiAgZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcblxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykubGVuZ3RoKSBzaHVmZmxlZENhcm91c2VsLmluaXQoKTtcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XG5cbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxuICAgIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xuICAgIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xuXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcbiAgICBfbGFuZ3VhZ2UoKTtcbiAgfVxuXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9XG59KSgpO1xuXG4vLyBCb290c3RyYXAgYXBwXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gIGFwcC5pbml0KCk7XG59KTtcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJicm93c2VyV2lkdGgiLCJvdXRlcldpZHRoIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImluaXQiLCJvbiIsImV2ZW50IiwiX21vcmVTZWN0aW9uTWVudUl0ZW0iLCJfbW9iaWxlQ2F0ZWdvcnlNZW51IiwiX2Nsb3NlQnV0dG9uIiwiX29wZW5Tb2NpYWxEcmF3ZXIiLCJfcmVzaXplIiwicmVzaXplIiwiaWciLCJyZW1vdmVDbGFzcyIsIiQiLCJjc3MiLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0Iiwid2lkdGgiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZvY3VzIiwiZmlsdGVyIiwiaGlkZSIsImFkZENsYXNzIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiaGFzQ2xhc3MiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwidGVtcGxhdGUiLCJodG1sIiwiYXZhaWxhYmxlSXRlbXMiLCJzZWVuSXRlbXMiLCJpZ2xzIiwiZ2V0TG9jYWxTdG9yYWdlIiwiY29udGVudCIsImdldFJhbmRFaWdodCIsIlN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsIndhcm4iLCJibGFja0xpc3QiLCJ1bnNlZW4iLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsInB1c2giLCJzaHVmZmxlIiwic3BsaWNlIiwiZ2VuZXJhdGVUZW1wbGF0ZSIsIk11c3RhY2hlIiwidG9faHRtbCIsImFycmF5IiwiY3VycmVudEluZGV4IiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkQ2Fyb3VzZWwiLCJub3QiLCJ2aWRzIiwiYnJpZ2h0Q292ZSIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJfaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9pbmplY3RUZW1wbGF0ZSIsInJlcGxhY2VXaXRoIiwibWVzc2FnZXMiLCJjb3VudGVyIiwic2NvcGUiLCJfc2F5SGVsbG8iLCJlbWl0IiwiX2xpc3RlbmVyIiwibWVzc2FnZSIsImFwcGVuZFRvIiwiYXBwIiwiZG9jdW1lbnQiLCJmb3VuZGF0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJzaHVmZmxlZENhcm91c2VsIiwidmlkZW8iLCJldnQxIiwiZXZ0MiIsIl9sYW5ndWFnZSIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07TUFDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQWxELEVBQXFEO1dBQzVDLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPLElBQUlDLGVBQWdCLFlBQU07U0FDeEJKLE9BQU9LLFVBQWQ7Q0FEd0IsRUFBbkI7OztBQUtQLEFBQU8sSUFBSUMsVUFBVSxJQUFJQyxZQUFKLEVBQWQ7O0FDNUJQOzs7O0FBSUEsQUFFQSxXQUFlLENBQUMsWUFBTTtXQUNYQyxJQUFULEdBQWdCOzs7Ozs7OztNQVFaLHdCQUFGLEVBQTRCQyxFQUE1QixDQUErQixPQUEvQixFQUF3Q0MsS0FBeEMsRUFBK0NDLG9CQUEvQzs7O01BR0UsaUNBQUYsRUFBcUNGLEVBQXJDLENBQXdDLE9BQXhDLEVBQWlERyxtQkFBakQ7OztNQUdFLGVBQUYsRUFBbUJILEVBQW5CLENBQXNCLE9BQXRCLEVBQStCSSxZQUEvQjs7O01BR0UsdUJBQUYsRUFBMkJKLEVBQTNCLENBQThCLE9BQTlCLEVBQXVDSyxpQkFBdkM7Ozs7O1dBS09DLE9BQVQsR0FBbUI7TUFDZmYsTUFBRixFQUFVZ0IsTUFBVixDQUFpQixZQUFZO1VBQ3ZCQyxZQUFBLEdBQWtCLEdBQXRCLEVBQTJCO1VBQ3ZC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