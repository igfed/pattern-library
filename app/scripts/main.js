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
        var updatedObj = Object.assign({}, seenItems);
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
                data.transcript = $video.data('transcript') ? $video.data('transcript') : '';

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
        var html = '<div class="video-container"><span class="video-overlay ' + data.id + '"></span><div class="video-container-responsive"><video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video></div>';
        if (data.transcript.length > 0) {
            html += '<div class="video-transcript"><a target="_blank" href="' + data.transcript + '">Transcript</a></div>';
        }
        html += '</div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCIvLyBUaGlzIGlzIGxlc3Mgb2YgYSBtb2R1bGUgdGhhbiBpdCBpcyBhIGNvbGxlY3Rpb24gb2YgY29kZSBmb3IgYSBjb21wbGV0ZSBwYWdlIChNb3JlIHBhZ2UgaW4gdGhpcyBjYXNlKS5cclxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXHJcbi8vIGFuZCBzbyBvbi5cclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXHJcbiAgICBfcmVzaXplKCk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgQ2xpY2sgSGFuZGxlcnNcclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGV2ZW50LCBfbW9yZVNlY3Rpb25NZW51SXRlbSk7XHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcclxuXHJcbiAgICAvLyBDbG9zZSBidXR0b25cclxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xyXG5cclxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcclxuICB9XHJcblxyXG4gIC8vIEVuZCBvZiBJbml0XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGlnLmJyb3dzZXJXaWR0aCA8IDY0MCkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9yZVNlY3Rpb25NZW51SXRlbSgpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcclxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXHJcbiAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgZHJvcGRvd24gb24gY2xpY2tcclxuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgdGl0bGUgb24gY2xpY2tcclxuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XHJcblxyXG4gICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxyXG5cclxuICAgIC8vIFVuZGVybGluZSBhbmltYXRpb25cclxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuZmFkZUluKCdzbG93JykuZm9jdXMoKS5maWx0ZXIoJzpub3QoLicgKyBjbGFzc05hbWUgKyAnKScpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xyXG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxyXG4gICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xyXG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XHJcblxyXG4gICAgaWYgKGpzU29jaWFsRHJhd2VyLmhhc0NsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJykpIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLmFkZENsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qKlxyXG4gKiBTaHVmZmxlZCBDYXJvdXNlbFxyXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cclxuICpcclxuICogVXBvbiByZWZyZXNoIG9mIHRoZSBicm93c2VyLCB0aGUgZmlyc3QgdHdvIGl0ZW1zIGFyZSBhZGRlZCB0byB0aGUgc2Vlbkl0ZW1zIG9iamVjdFxyXG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcclxuICogaXMgY2xlYXJlZCBhbmQgdGhlIGNhcm91c2VsIHJlc2V0LlxyXG4gKlxyXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XHJcbiAqIEBwYXJhbSBkYXRhLWFydGljbGVzID0gVGhlIGtleSBvZiB0aGUgZGF0YSBpbiB0aGUganNvbiBvYmplY3RcclxuICogQHJldHVybiBkYXRhLWxpbWl0ID0gVGhlIGFtb3VudCBvZiBpdGVtcyB0byBiZSByZW5kZXJlZCBpbiB0aGUgY2Fyb3VzZWxcclxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgaWdscyA9IGdldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgIGF2YWlsYWJsZUl0ZW1zID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnYXJ0aWNsZXMnKS5hcnRpY2xlcztcclxuICAgICAgICBkYXRhS2V5ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbmFtZScpO1xyXG4gICAgICAgIGFydGljbGVMaW1pdCA9ICQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmRhdGEoJ2xpbWl0Jyk7XHJcblxyXG4gICAgICAgIGlmICghaWdsc1tkYXRhS2V5XSkge1xyXG4gICAgICAgICAgICAvL29iamVjdCBkb2VzIG5vdCBleGlzdCB5ZXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0gaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdlbmVyYXRlVGVtcGxhdGUoZ2V0UmFuZEFydGljbGVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBpZiAodHlwZW9mKFN0b3JhZ2UpICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKSA6IGNyZWF0ZUlHTFMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2xvY2Fsc3RvcmFnZSBpcyBub3QgYXZhaWxhYmxlIScpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSUdMUygpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KHt9KSk7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJpZ1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9jYWxTdG9yYWdlKGFydGljbGVzKSB7XHJcbiAgICAgICAgdmFyIHVwZGF0ZWRPYmogPSBPYmplY3QuYXNzaWduKHt9LCBzZWVuSXRlbXMpO1xyXG4gICAgICAgIGFydGljbGVzLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkubWFwKChrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZE9ialtrXSA9IGl0ZW1ba107XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZ2xzW2RhdGFLZXldID0gdXBkYXRlZE9iajtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXNldExvY2FsU3RvcmFnZSgpIHtcclxuICAgICAgICBkZWxldGUgaWdsc1tkYXRhS2V5XTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImlnXCIsIEpTT04uc3RyaW5naWZ5KGlnbHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSYW5kQXJ0aWNsZXMoKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIHVuc2VlbiA9IFtdLFxyXG4gICAgICAgICAgICByYW5kQXJ0aWNsZXM7ICAgXHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGF2YWlsYWJsZUl0ZW1zKS5mb3JFYWNoKChrZXksIGkpID0+IHtcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xyXG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IGF2YWlsYWJsZUl0ZW1zW2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlZW5JdGVtc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICB1bnNlZW4ucHVzaChuZXdPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJhbmRBcnRpY2xlcyA9IHVuc2Vlbi5zcGxpY2UoMCwgYXJ0aWNsZUxpbWl0KTtcclxuXHJcbiAgICAgICAgaWYgKHJhbmRBcnRpY2xlcy5sZW5ndGggPCBhcnRpY2xlTGltaXQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTGVzcyB0aGFuICcgKyBhcnRpY2xlTGltaXQgKyAnIGl0ZW1zIGxlZnQgdG8gdmlldywgZW1wdHlpbmcgc2Vlbkl0ZW1zIGFuZCByZXN0YXJ0aW5nLicpO1xyXG4gICAgICAgICAgICAvL1RoZXJlJ3MgbGVzcyB1bnNlZW4gYXJ0aWNsZXMgdGhhdCB0aGUgbGltaXRcclxuICAgICAgICAgICAgLy9jbGVhciBzZWVuSXRlbXMsIHJlc2V0IGxzLCBhbmQgcmVpbml0XHJcbiAgICAgICAgICAgIHNlZW5JdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICByZXNldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNodWZmbGUocmFuZEFydGljbGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxyXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGUocmFuZG9tQXJ0aWNsZXMpIHtcclxuXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGh0bWwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlRGF0YSA9IFtdO1xyXG5cclxuICAgICAgICBpZighcmFuZG9tQXJ0aWNsZXMpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHJhbmRvbUFydGljbGVzLmZvckVhY2goKGFydGljbGUpID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJ0aWNsZSkubWFwKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS5wdXNoKGFydGljbGVba2V5XSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBodG1sID0gTXVzdGFjaGUudG9faHRtbCgkKGAjJHtkYXRhS2V5fWApLmh0bWwoKSwgeyBcImFydGljbGVzXCI6IHRlbXBsYXRlRGF0YSB9KTtcclxuXHJcbiAgICAgICAgJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgdXBkYXRlTG9jYWxTdG9yYWdlKHJhbmRvbUFydGljbGVzKTtcclxuXHJcbiAgICAgICAgYnVpbGRDYXJvdXNlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJ1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICAgICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgICAgICAgbmV4dEFycm93LFxyXG4gICAgICAgICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgICAgICQoJy5pZy1jYXJvdXNlbCcpLm5vdCgnLnNsaWNrLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkoKVxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciB2aWRzID0gW10sIGJyaWdodENvdmU7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICBfcGFyc2VWaWRlb3MoKTtcclxuXHJcbiAgICAgICAgLy8gTm90IHVzaW5nIHRoaXMgZnVuY3Rpb25hbGl0eSBhdCB0aGUgbW9tZW50IChlc3NlbnRpYWxseSBhbiBvbkxvYWRDb21wbGV0ZSkgLSBtaWdodCBiZSByZXF1aXJlZCBkb3duIHRoZSByb2FkXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIFZpZGVvSlMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhbmQgZmlyZSByZWFkeSBldmVudCBoYW5kbGVycyBpZiBzb1xyXG4gICAgICAgIC8vIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gICAgIF9icmlnaHRDb3ZlUmVhZHkoKTtcclxuICAgICAgICAvLyAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgICAgICAvLyAgIH1cclxuICAgICAgICAvLyB9LCA1MDApXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xyXG4gICAgICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgICAgICAgICR2aWRlbyxcclxuICAgICAgICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICAgICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ11cclxuXHJcbiAgICAgICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcclxuICAgICAgICAkKCcuaWctdmlkZW8tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJGdyb3VwID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcclxuICAgICAgICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxyXG4gICAgICAgICAgICBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcclxuICAgICAgICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChvcHRpb25hbClcclxuICAgICAgICAgICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5hdXRvID0gJHZpZGVvLmRhdGEoJ2F1dG9wbGF5JykgPyAnYXV0b3BsYXknIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmN0cmwgPSAkdmlkZW8uZGF0YSgnY29udHJvbHMnKSA/ICdjb250cm9scycgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcclxuICAgICAgICAgICAgICAgIGRhdGEudHJhbnNjcmlwdCA9ICR2aWRlby5kYXRhKCd0cmFuc2NyaXB0JykgPyAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpIDogJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgSUQncyBmb3IgYWxsIHZpZGVvJ3Mgb24gdGhlIHBhZ2UgLSBpbiBjYXNlIHdlIHdhbnQgdG8gcnVuIGEgcG9zdC1sb2FkIHByb2Nlc3Mgb24gZWFjaFxyXG4gICAgICAgICAgICAgICAgdmlkcy5wdXNoKGRhdGEuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICAgICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcclxuICAgICAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xyXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcclxuICAgICAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+PHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5ICR7ZGF0YS5pZH1cIj48L3NwYW4+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+PHZpZGVvIGRhdGEtc2V0dXA9J3tcInRlY2hPcmRlclwiOiBbXCJodG1sNVwiXX0nIGRhdGEtdmlkZW8taWQ9XCIke2RhdGEuaWR9XCIgcHJlbG9hZD1cIiR7ZGF0YS5wcmVsb2FkfVwiIGRhdGEtYWNjb3VudD1cIiR7ZGF0YS5hY2NvdW50fVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiAke2RhdGEuY3RybH0gJHtkYXRhLmF1dG99PjwvdmlkZW8+PC9kaXY+YFxyXG4gICAgICAgIGlmIChkYXRhLnRyYW5zY3JpcHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNjcmlwdFwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEudHJhbnNjcmlwdH1cIj5UcmFuc2NyaXB0PC9hPjwvZGl2PmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwgKz0gYDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICAgICAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcclxuICAgICAgICB2aWRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vICQoJy52aWRlby1vdmVybGF5LicrIGVsKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgLy8gRGVmaW5lIGNvbXBvbmVudC1sZXZlbCB2YXJpYWJsZXNcclxuICB2YXIgbWVzc2FnZXMgPSBbXSxcclxuICAgIGNvdW50ZXIgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KHNjb3BlKSB7XHJcbiAgICAvLyBPZnRlbiBhIGdvb2QgaWRlYSB0byBpbml0IHdpdGggYW4gSFRNTCBzY29wZSAoaWUsIGNsYXNzKVxyXG4gICAgdmFyICR0aGlzID0gJChzY29wZSk7XHJcblxyXG4gICAgLy8gTGV0J3MgY3JlYXRlIGEgbWVzc2FnZSBhcnJheVxyXG4gICAgbWVzc2FnZXMgPSBbJ0hlbGxvIScsICdJcyBpdCBtZSB5b3VcXCdyZSBsb29raW5nIGZvcj8nLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgZXllcycsICdJIGNhbiBzZWUgaXQgaW4geW91ciBzbWlsZScsICdZb3VcXCdyZSBhbGwgSVxcJ3ZlIGV2ZXIgd2FudGVkJywgJ0FuZCBteSBhcm1zIGFyZSBvcGVuIHdpZGUnLCAnXFwnY2F1c2UgeW91IGtub3cganVzdCB3aGF0IHRvIHNheScsICdBbmQgeW91IGtub3cganVzdCB3aGF0IHRvIGRvJywgJ0FuZCBJIHdhbnQgdG8gdGVsbCB5b3Ugc28gbXVjaCddO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIGNsaWNrIGhhbmRsZXJcclxuICAgICR0aGlzLmZpbmQoJ2EuYnV0dG9uLm1lc3NhZ2UnKS5vbignY2xpY2snLCBldmVudCwgX3NheUhlbGxvKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zYXlIZWxsbygpIHtcclxuICAgIC8vIExldCdzIGVtaXQgYW4gZXZlbnQgd2l0aCBhbiBpbmRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCBzZW5kIGFsb25nIHNvbWV0aGluZyB0byBkaXNwbGF5XHJcbiAgICBpZy5lbWl0dGVyLmVtaXQoJ2hlbGxvJywgbWVzc2FnZXNbY291bnRlcl0pO1xyXG4gICAgY291bnRlciArPSAxO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuICB2YXIgJHRoaXNcclxuXHJcbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcclxuICAgICR0aGlzID0gJChzY29wZSk7XHJcbiAgICBfbGlzdGVuZXIoKTtcclxuICB9XHJcblxyXG4gIC8vIFdlIGtub3cgbm90aGluZyBhYm91dCB0aGUgY29tcG9uZW50IHRoYXQgd2lsbCBzZW5kIHRoZSBtZXNzYWdlLiBPbmx5IHRoYXQgaXQgd2lsbCBoYXZlXHJcbiAgLy8gYW4gaWRlbnRpZmllciBvZiAnaGVsbG8nIGFuZCB0aGF0IHdlIHdpbGwgcmVjZWl2ZSBhICdtZXNzYWdlJyB0byBkaXNwbGF5LlxyXG4gIGZ1bmN0aW9uIF9saXN0ZW5lcigpIHtcclxuICAgIGlnLmVtaXR0ZXIub24oJ2hlbGxvJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgICAgJCgnPHAgY2xhc3M9XCJhbGVydC1ib3ggYWxlcnRcIj4nICsgbWVzc2FnZSArICc8L3A+JykuaGlkZSgpLmFwcGVuZFRvKCR0aGlzKS5mYWRlSW4oJ2Zhc3QnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBtb3JlIGZyb20gJy4vbW9yZS5qcyc7XHJcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcclxuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgc2h1ZmZsZWRDYXJvdXNlbCBmcm9tICcuL3NodWZmbGVkLWNhcm91c2VsLmpzJztcclxuaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL2FjY29yZGlvbi5qcyc7XHJcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcclxuaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xyXG5pbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1zaHVmZmxlZC1jYXJvdXNlbCcpLmxlbmd0aCkgc2h1ZmZsZWRDYXJvdXNlbC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XHJcblxyXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XHJcblxyXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgIF9sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImJyb3dzZXJXaWR0aCIsIm91dGVyV2lkdGgiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiaW5pdCIsIm9uIiwiZXZlbnQiLCJfbW9yZVNlY3Rpb25NZW51SXRlbSIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfb3BlblNvY2lhbERyYXdlciIsIl9yZXNpemUiLCJyZXNpemUiLCJpZyIsInJlbW92ZUNsYXNzIiwiJCIsImNzcyIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCJvZmZzZXQiLCJ3aWR0aCIsImNlbnRlclgiLCJsZWZ0IiwiY2xhc3NOYW1lIiwiYXR0ciIsIm1hdGNoIiwidGl0bGUiLCJ0ZXh0IiwiX2ZpbHRlckRyb3Bkb3duIiwiZmFkZUluIiwiZm9jdXMiLCJmaWx0ZXIiLCJoaWRlIiwiYWRkQ2xhc3MiLCJfZmlsdGVyVGl0bGUiLCJmYWRlT3V0IiwiX3JlcG9zaXRpb25BcnJvdyIsInNob3ciLCJfYW5pbWF0aW9uVW5kZXJsaW5lIiwidG9nZ2xlQ2xhc3MiLCJqc1NvY2lhbERyYXdlciIsIm5leHQiLCJoYXNDbGFzcyIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImxvZyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJhdmFpbGFibGVJdGVtcyIsInNlZW5JdGVtcyIsImlnbHMiLCJkYXRhS2V5IiwiYXJ0aWNsZUxpbWl0IiwiZ2V0TG9jYWxTdG9yYWdlIiwiYXJ0aWNsZXMiLCJnZXRSYW5kQXJ0aWNsZXMiLCJTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZUlHTFMiLCJ3YXJuIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInVwZGF0ZUxvY2FsU3RvcmFnZSIsInVwZGF0ZWRPYmoiLCJPYmplY3QiLCJhc3NpZ24iLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJrZXlzIiwibWFwIiwiayIsInJlc2V0TG9jYWxTdG9yYWdlIiwidW5zZWVuIiwicmFuZEFydGljbGVzIiwia2V5IiwibmV3T2JqIiwicHVzaCIsInNwbGljZSIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZW5lcmF0ZVRlbXBsYXRlIiwicmFuZG9tQXJ0aWNsZXMiLCJodG1sIiwidGVtcGxhdGVEYXRhIiwiYXJ0aWNsZSIsIk11c3RhY2hlIiwidG9faHRtbCIsImJ1aWxkQ2Fyb3VzZWwiLCJub3QiLCJ2aWRzIiwiYnJpZ2h0Q292ZSIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJ0cmFuc2NyaXB0IiwiX2luamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfaW5qZWN0VGVtcGxhdGUiLCJyZXBsYWNlV2l0aCIsIm1lc3NhZ2VzIiwiY291bnRlciIsInNjb3BlIiwiX3NheUhlbGxvIiwiZW1pdCIsIl9saXN0ZW5lciIsIm1lc3NhZ2UiLCJhcHBlbmRUbyIsImFwcCIsImRvY3VtZW50IiwiZm91bmRhdGlvbiIsImZvcm1zIiwibW9yZSIsImNhcm91c2VsIiwic2h1ZmZsZWRDYXJvdXNlbCIsInZpZGVvIiwiZXZ0MSIsImV2dDIiLCJfbGFuZ3VhZ2UiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNBLEFBQU87OztBQUtQLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01B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