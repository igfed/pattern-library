import more from './scripts/modules/more.js';
import form from './scripts/modules/form.js';
import form from './scripts/modules/carousel.js';

const ig = (function () {
  var pathName = window.location.pathname,
    lang = _lang(),
    browserWidth = _width();
    modules = ['form', 'more', 'carousel']
  function init() {
    // Initialize Foundation
    $(document).foundation();

    // Search

    // Forms
    if ($('.ig-form').length) {
      form.init();
    }

    // More
    if ($('.more-section').length) {
      more.init();
    }

    // Carousel
    if ($('.ig-carousel').length) {
      carousel.init();
    }
    // Another module

  }

  // Set page language
  function _lang() {
    if (pathName.indexOf('/fr/') !== -1) {
      return 'fr';
    } else {
      return 'en';
    }
  }

  // Get initial browser width
  function _width() {
    return window.outerWidth;
  }

  // Only return public methods and variables
  return {
    init,
    pathName,
    lang,
    browserWidth
  };
}());


//Accordion

// $('.help-topics-accordion').on('up.zf.accordion', function (event) {
//   setTimeout(function () {
//     $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
//   }, 10); //Adjust to match slideSpeed
// });

// Kick things off
$(document).ready(function () {
  ig.init();
})
