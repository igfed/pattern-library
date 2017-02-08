export default (function() {
  function init() {
    // Register resize behaviour
    _resize();

    $('.more-section-menuitem').on('click', function (e) {
      e.preventDefault();

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
    });

    // Register Click Handlers
    //

    // Mobile Category menu
    $('.more-section-menu-mobile-title').on('click', _mobileCategoryMenu);

    // Close button
    $('.close-button').on('click', _closeButton);
  }

  function _resize() {
    $(window).resize(function () {
      var width = window.outerWidth;
      if (width < 640) {
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

  function _filterDropdown(className) {
    $('.more-section-menu-dropdown-category-wrapper').fadeIn('slow').focus().filter(':not(.' + className + ')').hide();
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
    $('.more-section-menu-dropdown-arrow-up').show().css({ left: centerX });
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

  return {
    init
  };
}())