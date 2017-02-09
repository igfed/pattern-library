import more from './more.js';
import forms from './forms.js';
import carousel from './carousel.js';
import accordion from './accordion.js';

const app = (function () {
  function init() {
    // Initialize Foundation
    $(document).foundation();

    // Check for modules
    if ($('.ig-form').length) forms.init();
    if ($('.more-section').length) more.init();
    if ($('.ig-carousel').length) carousel.init();

    // Add language class to body
    _language();
  }

  function _language() {
    if (window.location.pathname.indexOf('/fr/') !== -1) {
      $('body').addClass('fr');
    } else {
      $('body').addClass('en');
    }
  }

  return {
    init
  }

//Accordion

// $('.help-topics-accordion').on('up.zf.accordion', function (event) {
//   setTimeout(function () {
//     $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
//   }, 10); //Adjust to match slideSpeed
// });
})()

// Bootstrap app
$(document).ready(function () {
  app.init();
});
