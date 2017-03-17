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
        dataKey = $('.ig-shuffled-carousel').data('articles');
        availableItems = shuffledCarouselData[dataKey];
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
            console.log('transcript');
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvc2h1ZmZsZWQtY2Fyb3VzZWwuanMiLCJtb2R1bGVzL3ZpZGVvLmpzIiwibW9kdWxlcy9ldmVudC10ZXN0LTEuanMiLCJtb2R1bGVzL2V2ZW50LXRlc3QtMi5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCIvLyBUaGlzIGlzIGxlc3Mgb2YgYSBtb2R1bGUgdGhhbiBpdCBpcyBhIGNvbGxlY3Rpb24gb2YgY29kZSBmb3IgYSBjb21wbGV0ZSBwYWdlIChNb3JlIHBhZ2UgaW4gdGhpcyBjYXNlKS5cclxuLy8gQXQgc29tZSBwb2ludCwgd2Ugc2hvdWxkIGNvbnNpZGVyIHNwbGl0dGluZyBpdCB1cCBpbnRvIGJpdGUtc2l6ZWQgcGllY2VzLiBFeDogbW9yZS1uYXYuanMsIG1vcmUtc29jaWFsLmpzXHJcbi8vIGFuZCBzbyBvbi5cclxuXHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXHJcbiAgICBfcmVzaXplKCk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgQ2xpY2sgSGFuZGxlcnNcclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGV2ZW50LCBfbW9yZVNlY3Rpb25NZW51SXRlbSk7XHJcblxyXG4gICAgLy8gTW9iaWxlIENhdGVnb3J5IG1lbnVcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1tb2JpbGUtdGl0bGUnKS5vbignY2xpY2snLCBfbW9iaWxlQ2F0ZWdvcnlNZW51KTtcclxuXHJcbiAgICAvLyBDbG9zZSBidXR0b25cclxuICAgICQoJy5jbG9zZS1idXR0b24nKS5vbignY2xpY2snLCBfY2xvc2VCdXR0b24pO1xyXG5cclxuICAgIC8vIFNvY2lhbCBkcmF3ZXJcclxuICAgICQoJy5qcy1vcGVuLXNvY2lhbGRyYXdlcicpLm9uKCdjbGljaycsIF9vcGVuU29jaWFsRHJhd2VyKTtcclxuICB9XHJcblxyXG4gIC8vIEVuZCBvZiBJbml0XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGlnLmJyb3dzZXJXaWR0aCA8IDY0MCkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9yZVNlY3Rpb25NZW51SXRlbSgpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcclxuICAgICAgY2VudGVyWCA9IG9mZnNldC5sZWZ0ICsgd2lkdGggLyAyIC0gNTAsXHJcbiAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgZHJvcGRvd24gb24gY2xpY2tcclxuICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgdGl0bGUgb24gY2xpY2tcclxuICAgIF9maWx0ZXJUaXRsZSh0aXRsZSk7XHJcblxyXG4gICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxyXG5cclxuICAgIC8vIFVuZGVybGluZSBhbmltYXRpb25cclxuICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuZmFkZUluKCdzbG93JykuZm9jdXMoKS5maWx0ZXIoJzpub3QoLicgKyBjbGFzc05hbWUgKyAnKScpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vcGVuU29jaWFsRHJhd2VyKCkge1xyXG4gICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxyXG4gICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xyXG4gICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XHJcblxyXG4gICAgaWYgKGpzU29jaWFsRHJhd2VyLmhhc0NsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJykpIHtcclxuICAgICAganNTb2NpYWxEcmF3ZXIucmVtb3ZlQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzU29jaWFsRHJhd2VyLmFkZENsYXNzKCdqcy1zb2NpYWxkcmF3ZXItb3BlbmVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qKlxyXG4gKiBTaHVmZmxlZCBDYXJvdXNlbFxyXG4gKiBUYWtlcyBlaWdodCBpdGVtcyBmcm9tIGFuIG9iamVjdCBvZiAyMCwgYW5kIHJlbmRlcnMgdGhlbSBpbiBhIGNhcm91c2VsIGluIHJhbmRvbSBvcmRlci5cclxuICpcclxuICogVXBvbiByZWZyZXNoIG9mIHRoZSBicm93c2VyLCB0aGUgZmlyc3QgdHdvIGl0ZW1zIGFyZSBhZGRlZCB0byB0aGUgc2Vlbkl0ZW1zIG9iamVjdFxyXG4gKiBhbmQgd3JpdHRlbiB0byBsb2NhbCBzdG9yYWdlLCB3aGVuIHRoZSBhbW91bnQgb2YgdW5zZWVuIGl0ZW1zIGRyb3BzIGJlbG93IDgsIHNlZW5JdGVtcyBcclxuICogaXMgY2xlYXJlZCBhbmQgdGhlIGNhcm91c2VsIHJlc2V0LlxyXG4gKlxyXG4gKiBUaGVyZSBhcmUgdHdvIGNvbmZpZ3VyYWJsZSBkYXRhIGF0dHJpYnV0ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBtYXJrdXA6XHJcbiAqIEBwYXJhbSBkYXRhLWFydGljbGVzID0gVGhlIGtleSBvZiB0aGUgZGF0YSBpbiB0aGUganNvbiBvYmplY3RcclxuICogQHJldHVybiBkYXRhLWxpbWl0ID0gVGhlIGFtb3VudCBvZiBpdGVtcyB0byBiZSByZW5kZXJlZCBpbiB0aGUgY2Fyb3VzZWxcclxuICogRXguIDxkaXYgY2xhc3M9XCJpZy1zaHVmZmxlZC1jYXJvdXNlbFwiIGRhdGEtYXJ0aWNsZXM9XCJhZHZpY2Utc3Rvcmllc1wiIGRhdGEtbGltaXQ9XCI4XCI+PC9kaXY+XHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIHZhciBhdmFpbGFibGVJdGVtcywgc2Vlbkl0ZW1zLCBpZ2xzLCBkYXRhS2V5LCBhcnRpY2xlTGltaXQ7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgaWdscyA9IGdldExvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgIGRhdGFLZXkgPSAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5kYXRhKCdhcnRpY2xlcycpO1xyXG4gICAgICAgIGF2YWlsYWJsZUl0ZW1zID0gc2h1ZmZsZWRDYXJvdXNlbERhdGFbZGF0YUtleV07XHJcbiAgICAgICAgYXJ0aWNsZUxpbWl0ID0gJCgnLmlnLXNodWZmbGVkLWNhcm91c2VsJykuZGF0YSgnbGltaXQnKTtcclxuXHJcbiAgICAgICAgaWYgKCFpZ2xzW2RhdGFLZXldKSB7XHJcbiAgICAgICAgICAgIC8vb2JqZWN0IGRvZXMgbm90IGV4aXN0IHlldFxyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWVuSXRlbXMgPSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2VuZXJhdGVUZW1wbGF0ZShnZXRSYW5kQXJ0aWNsZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YoU3RvcmFnZSkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikgPyBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaWdcIikpIDogY3JlYXRlSUdMUygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignbG9jYWxzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUhJylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJR0xTKCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoe30pKTtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImlnXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbFN0b3JhZ2UoYXJ0aWNsZXMpIHtcclxuICAgICAgICB2YXIgdXBkYXRlZE9iaiA9IE9iamVjdC5hc3NpZ24oe30sIHNlZW5JdGVtcyk7XHJcbiAgICAgICAgYXJ0aWNsZXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5tYXAoKGspID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkT2JqW2tdID0gaXRlbVtrXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlnbHNbZGF0YUtleV0gPSB1cGRhdGVkT2JqO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc2V0TG9jYWxTdG9yYWdlKCkge1xyXG4gICAgICAgIGRlbGV0ZSBpZ2xzW2RhdGFLZXldO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaWdcIiwgSlNPTi5zdHJpbmdpZnkoaWdscykpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJhbmRBcnRpY2xlcygpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgdW5zZWVuID0gW10sXHJcbiAgICAgICAgICAgIHJhbmRBcnRpY2xlcztcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXMoYXZhaWxhYmxlSXRlbXMpLmZvckVhY2goKGtleSwgaSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgbmV3T2JqID0ge307XHJcbiAgICAgICAgICAgIG5ld09ialtrZXldID0gYXZhaWxhYmxlSXRlbXNba2V5XTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2Vlbkl0ZW1zW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHVuc2Vlbi5wdXNoKG5ld09iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmFuZEFydGljbGVzID0gdW5zZWVuLnNwbGljZSgwLCBhcnRpY2xlTGltaXQpO1xyXG5cclxuICAgICAgICBpZiAocmFuZEFydGljbGVzLmxlbmd0aCA8IGFydGljbGVMaW1pdCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdMZXNzIHRoYW4gJyArIGFydGljbGVMaW1pdCArICcgaXRlbXMgbGVmdCB0byB2aWV3LCBlbXB0eWluZyBzZWVuSXRlbXMgYW5kIHJlc3RhcnRpbmcuJyk7XHJcbiAgICAgICAgICAgIC8vVGhlcmUncyBsZXNzIHVuc2VlbiBhcnRpY2xlcyB0aGF0IHRoZSBsaW1pdFxyXG4gICAgICAgICAgICAvL2NsZWFyIHNlZW5JdGVtcywgcmVzZXQgbHMsIGFuZCByZWluaXRcclxuICAgICAgICAgICAgc2Vlbkl0ZW1zID0ge307XHJcbiAgICAgICAgICAgIHJlc2V0TG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBpbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2h1ZmZsZShyYW5kQXJ0aWNsZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLFxyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXHJcbiAgICAgICAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcblxyXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVUZW1wbGF0ZShyYW5kb21BcnRpY2xlcykge1xyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgaHRtbCxcclxuICAgICAgICAgICAgdGVtcGxhdGVEYXRhID0gW107XHJcblxyXG4gICAgICAgIGlmKCFyYW5kb21BcnRpY2xlcykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgcmFuZG9tQXJ0aWNsZXMuZm9yRWFjaCgoYXJ0aWNsZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhcnRpY2xlKS5tYXAoKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEYXRhLnB1c2goYXJ0aWNsZVtrZXldKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGh0bWwgPSBNdXN0YWNoZS50b19odG1sKCQoYCMke2RhdGFLZXl9YCkuaHRtbCgpLCB7IFwiYXJ0aWNsZXNcIjogdGVtcGxhdGVEYXRhIH0pO1xyXG5cclxuICAgICAgICAkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICB1cGRhdGVMb2NhbFN0b3JhZ2UocmFuZG9tQXJ0aWNsZXMpO1xyXG5cclxuICAgICAgICBidWlsZENhcm91c2VsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgICAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICAgICAgICBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAgICAgJCgnLmlnLWNhcm91c2VsJykubm90KCcuc2xpY2staW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICAgICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAgICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpXHJcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgdmFyIHZpZHMgPSBbXSwgYnJpZ2h0Q292ZTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgICAgICAvLyBOb3QgdXNpbmcgdGhpcyBmdW5jdGlvbmFsaXR5IGF0IHRoZSBtb21lbnQgKGVzc2VudGlhbGx5IGFuIG9uTG9hZENvbXBsZXRlKSAtIG1pZ2h0IGJlIHJlcXVpcmVkIGRvd24gdGhlIHJvYWRcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzIGlmIHNvXHJcbiAgICAgICAgLy8gYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAgIGlmICgkKCcudmpzLXBsdWdpbnMtcmVhZHknKS5sZW5ndGgpIHtcclxuICAgICAgICAvLyAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgICAgIC8vICAgICBjbGVhckludGVydmFsKGJyaWdodENvdmUpO1xyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vIH0sIDUwMClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XHJcbiAgICAgICAgdmFyICRncm91cCxcclxuICAgICAgICAgICAgJHZpZGVvLFxyXG4gICAgICAgICAgICBkYXRhID0ge30sXHJcbiAgICAgICAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXVxyXG5cclxuICAgICAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgICAgICQoJy5pZy12aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBkYXRhLmFjY291bnQgPSAkZ3JvdXAuZGF0YSgnYWNjb3VudCcpO1xyXG4gICAgICAgICAgICBkYXRhLnBsYXllciA9ICRncm91cC5kYXRhKCdwbGF5ZXInKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExvYWQgcmVxdWlyZWQgSlMgZm9yIGEgcGxheWVyXHJcbiAgICAgICAgICAgIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggdmlkZW8nc1xyXG4gICAgICAgICAgICAkZ3JvdXAuZmluZCgnLmlnLXZpZGVvLWpzJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICR2aWRlbyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChyZXF1aXJlZClcclxuICAgICAgICAgICAgICAgIGRhdGEuaWQgPSAkdmlkZW8uZGF0YSgnaWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKG9wdGlvbmFsKVxyXG4gICAgICAgICAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICAgICAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJyA6ICcnO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xyXG4gICAgICAgICAgICAgICAgZGF0YS50cmFuc2NyaXB0ID0gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA/ICR2aWRlby5kYXRhKCd0cmFuc2NyaXB0JykgOiAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXHJcbiAgICAgICAgICAgICAgICB2aWRzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgICAgICAgICAgX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LyR7ZGF0YS5hY2NvdW50fS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PmA7XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj48c3BhbiBjbGFzcz1cInZpZGVvLW92ZXJsYXkgJHtkYXRhLmlkfVwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj48dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiJHtkYXRhLmFjY291bnR9XCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiICR7ZGF0YS5jdHJsfSAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gXHJcblxyXG4gICAgICAgIGlmIChkYXRhLnRyYW5zY3JpcHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndHJhbnNjcmlwdCcpO1xyXG4gICAgICAgICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNjcmlwdFwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEudHJhbnNjcmlwdH1cIj5UcmFuc2NyaXB0PC9hPjwvZGl2PmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sICs9IGA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XHJcbiAgICAgICAgJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICAgICAgdmlkcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAkKCcudmlkZW8tb3ZlcmxheS4nKyBlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIC8vIERlZmluZSBjb21wb25lbnQtbGV2ZWwgdmFyaWFibGVzXHJcbiAgdmFyIG1lc3NhZ2VzID0gW10sXHJcbiAgICBjb3VudGVyID0gMDtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdChzY29wZSkge1xyXG4gICAgLy8gT2Z0ZW4gYSBnb29kIGlkZWEgdG8gaW5pdCB3aXRoIGFuIEhUTUwgc2NvcGUgKGllLCBjbGFzcylcclxuICAgIHZhciAkdGhpcyA9ICQoc2NvcGUpO1xyXG5cclxuICAgIC8vIExldCdzIGNyZWF0ZSBhIG1lc3NhZ2UgYXJyYXlcclxuICAgIG1lc3NhZ2VzID0gWydIZWxsbyEnLCAnSXMgaXQgbWUgeW91XFwncmUgbG9va2luZyBmb3I/JywgJ0kgY2FuIHNlZSBpdCBpbiB5b3VyIGV5ZXMnLCAnSSBjYW4gc2VlIGl0IGluIHlvdXIgc21pbGUnLCAnWW91XFwncmUgYWxsIElcXCd2ZSBldmVyIHdhbnRlZCcsICdBbmQgbXkgYXJtcyBhcmUgb3BlbiB3aWRlJywgJ1xcJ2NhdXNlIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBzYXknLCAnQW5kIHlvdSBrbm93IGp1c3Qgd2hhdCB0byBkbycsICdBbmQgSSB3YW50IHRvIHRlbGwgeW91IHNvIG11Y2gnXTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciBjbGljayBoYW5kbGVyXHJcbiAgICAkdGhpcy5maW5kKCdhLmJ1dHRvbi5tZXNzYWdlJykub24oJ2NsaWNrJywgZXZlbnQsIF9zYXlIZWxsbyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc2F5SGVsbG8oKSB7XHJcbiAgICAvLyBMZXQncyBlbWl0IGFuIGV2ZW50IHdpdGggYW4gaW5kZW50aWZpZXIgb2YgJ2hlbGxvJyBhbmQgc2VuZCBhbG9uZyBzb21ldGhpbmcgdG8gZGlzcGxheVxyXG4gICAgaWcuZW1pdHRlci5lbWl0KCdoZWxsbycsIG1lc3NhZ2VzW2NvdW50ZXJdKTtcclxuICAgIGNvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcbiAgdmFyICR0aGlzXHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoc2NvcGUpIHtcclxuICAgIC8vIE9mdGVuIGEgZ29vZCBpZGVhIHRvIGluaXQgd2l0aCBhbiBIVE1MIHNjb3BlIChpZSwgY2xhc3MpXHJcbiAgICAkdGhpcyA9ICQoc2NvcGUpO1xyXG4gICAgX2xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICAvLyBXZSBrbm93IG5vdGhpbmcgYWJvdXQgdGhlIGNvbXBvbmVudCB0aGF0IHdpbGwgc2VuZCB0aGUgbWVzc2FnZS4gT25seSB0aGF0IGl0IHdpbGwgaGF2ZVxyXG4gIC8vIGFuIGlkZW50aWZpZXIgb2YgJ2hlbGxvJyBhbmQgdGhhdCB3ZSB3aWxsIHJlY2VpdmUgYSAnbWVzc2FnZScgdG8gZGlzcGxheS5cclxuICBmdW5jdGlvbiBfbGlzdGVuZXIoKSB7XHJcbiAgICBpZy5lbWl0dGVyLm9uKCdoZWxsbycsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgICQoJzxwIGNsYXNzPVwiYWxlcnQtYm94IGFsZXJ0XCI+JyArIG1lc3NhZ2UgKyAnPC9wPicpLmhpZGUoKS5hcHBlbmRUbygkdGhpcykuZmFkZUluKCdmYXN0Jyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxyXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxyXG5cclxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cclxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcclxuIGZvciBpbnN0YW5jZSkuXHJcblxyXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXHJcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xyXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cclxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cclxuICovXHJcblxyXG5pbXBvcnQgbW9yZSBmcm9tICcuL21vcmUuanMnO1xyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IHNodWZmbGVkQ2Fyb3VzZWwgZnJvbSAnLi9zaHVmZmxlZC1jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xyXG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXHJcbmltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcclxuaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xyXG5cclxuY29uc3QgYXBwID0gKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxyXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXHJcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcclxuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSBtb3JlLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctc2h1ZmZsZWQtY2Fyb3VzZWwnKS5sZW5ndGgpIHNodWZmbGVkQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG5cclxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXHJcbiAgICBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcclxuICAgIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xyXG5cclxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XHJcbiAgICBfbGFuZ3VhZ2UoKTtcclxuICB9XHJcblxyXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxyXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xyXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgYXBwLmluaXQoKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJicm93c2VyV2lkdGgiLCJvdXRlcldpZHRoIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImluaXQiLCJvbiIsImV2ZW50IiwiX21vcmVTZWN0aW9uTWVudUl0ZW0iLCJfbW9iaWxlQ2F0ZWdvcnlNZW51IiwiX2Nsb3NlQnV0dG9uIiwiX29wZW5Tb2NpYWxEcmF3ZXIiLCJfcmVzaXplIiwicmVzaXplIiwiaWciLCJyZW1vdmVDbGFzcyIsIiQiLCJjc3MiLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwib2Zmc2V0Iiwid2lkdGgiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZvY3VzIiwiZmlsdGVyIiwiaGlkZSIsImFkZENsYXNzIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwianNTb2NpYWxEcmF3ZXIiLCJuZXh0IiwiaGFzQ2xhc3MiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJsb2ciLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiYXZhaWxhYmxlSXRlbXMiLCJzZWVuSXRlbXMiLCJpZ2xzIiwiZGF0YUtleSIsImFydGljbGVMaW1pdCIsImdldExvY2FsU3RvcmFnZSIsInNodWZmbGVkQ2Fyb3VzZWxEYXRhIiwiZ2V0UmFuZEFydGljbGVzIiwiU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJjcmVhdGVJR0xTIiwid2FybiIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ1cGRhdGVMb2NhbFN0b3JhZ2UiLCJhcnRpY2xlcyIsInVwZGF0ZWRPYmoiLCJPYmplY3QiLCJhc3NpZ24iLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJrZXlzIiwibWFwIiwiayIsInJlc2V0TG9jYWxTdG9yYWdlIiwidW5zZWVuIiwicmFuZEFydGljbGVzIiwia2V5IiwibmV3T2JqIiwicHVzaCIsInNwbGljZSIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZW5lcmF0ZVRlbXBsYXRlIiwicmFuZG9tQXJ0aWNsZXMiLCJodG1sIiwidGVtcGxhdGVEYXRhIiwiYXJ0aWNsZSIsIk11c3RhY2hlIiwidG9faHRtbCIsImJ1aWxkQ2Fyb3VzZWwiLCJub3QiLCJ2aWRzIiwiYnJpZ2h0Q292ZSIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJ0cmFuc2NyaXB0IiwiX2luamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfaW5qZWN0VGVtcGxhdGUiLCJyZXBsYWNlV2l0aCIsIm1lc3NhZ2VzIiwiY291bnRlciIsInNjb3BlIiwiX3NheUhlbGxvIiwiZW1pdCIsIl9saXN0ZW5lciIsIm1lc3NhZ2UiLCJhcHBlbmRUbyIsImFwcCIsImRvY3VtZW50IiwiZm91bmRhdGlvbiIsImZvcm1zIiwibW9yZSIsImNhcm91c2VsIiwic2h1ZmZsZWRDYXJvdXNlbCIsInZpZGVvIiwiZXZ0MSIsImV2dDIiLCJfbGFuZ3VhZ2UiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNB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