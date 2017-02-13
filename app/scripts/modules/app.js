/* This file is the entry point for rollup (http://rollupjs.org/) and
essentionally 'bootstraps' our ig.com 'application'.

All modules should be imported here so that they can be initialized on
a case-by-case basis (not all pages require the initialization of a carousel
for instance).

Any tasks or processes that need to be initiated on page load should live in this
file. An included example is adding a 'en' or 'fr' class to the body based on the
url which we can use to write custom styles based on the language of the page

 */

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

})()

// Bootstrap app
$(document).ready(function () {
  app.init();
});
