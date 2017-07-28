// This is less of a module than it is a collection of code for a complete page (More page in this case).
// At some point, we should consider splitting it up into bite-sized pieces. Ex: more-nav.js, more-social.js
// and so on.

import * as ig from './global.js';

export default ((window) => {
  function init() {

    // Register resize behaviour
    _resize();

    // Register Click Handlers

    // Mobile Category menu
    $('.more-section-menuitem').on('click', ig.debounce(_moreSectionMenuItem, 500, true));

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
        title = title.substring(0, title.length - 1)
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

  function _closeButton() {
    $('.more-section-menu-dropdown-category-wrapper').hide();
    $('.more-section-menu-dropdown-arrow-up').hide();
    $('.tertiary-cta-more').removeClass('animate');
    $('h1.more-section-tagline-tag').removeClass('active');
    $('p.more-section-tagline-tag').fadeIn('slow');
    $('.more-section-menu-dropdown').removeClass('active');
  }

  function _moreSectionMenuItem(event) {

    if (window.matchMedia("(min-width: 640px)").matches) {
      try {
        //IE fix
        event.returnValue = false;
      } catch (err) {
        console.warn('event.returnValue not available')
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
    _repositionArrow(centerX)

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
    setTimeout(() => {
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
    setTimeout(() => {
      $('.tertiary-cta-more').addClass('animate')
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
    init
  };
})(window)
