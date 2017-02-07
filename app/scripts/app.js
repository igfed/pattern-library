(function () {
'use strict';

var more = function more() {
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
      _repositionArrow(centerX);

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

  return {
    init: init
  };
};

var form = function form() {
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
        form._process();
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
};

var ig = function () {
  var pathName = window.location.pathname,
      lang = _lang(),
      browserWidth = _width();

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
    if ($('.ig-carousel').length) {}
    // carousel.init();

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
    init: init,
    pathName: pathName,
    lang: lang,
    browserWidth: browserWidth
  };
}();

//Accordion

// $('.help-topics-accordion').on('up.zf.accordion', function (event) {
//   setTimeout(function () {
//     $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
//   }, 10); //Adjust to match slideSpeed
// });

// Kick things off
$(document).ready(function () {
  ig.init();
});

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlcyI6WyJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm0uanMiLCJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1vcmUgPSBmdW5jdGlvbigpIHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gUmVnaXN0ZXIgcmVzaXplIGJlaGF2aW91clxyXG4gICAgX3Jlc2l6ZSgpO1xyXG5cclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudWl0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpLFxyXG4gICAgICAgIHdpZHRoID0gJHRoaXMud2lkdGgoKSxcclxuICAgICAgICBjZW50ZXJYID0gb2Zmc2V0LmxlZnQgKyB3aWR0aCAvIDIgLSA1MCxcclxuICAgICAgICBjbGFzc05hbWUgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC9bXFx3LV0qY2F0ZWdvcnlbXFx3LV0qL2cpLFxyXG4gICAgICAgIHRpdGxlID0gJHRoaXMudGV4dCgpO1xyXG5cclxuICAgICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSBkcm9wZG93biBvbiBjbGlja1xyXG4gICAgICBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKTtcclxuXHJcbiAgICAgIC8vIEZpbHRlciB0aGUgY2F0ZWdvcnkgdGl0bGUgb24gY2xpY2tcclxuICAgICAgX2ZpbHRlclRpdGxlKHRpdGxlKTtcclxuXHJcbiAgICAgIC8vIEFycm93IHBvc2l0aW9uIG1vdmUgb24gY2xpY2tcclxuICAgICAgX3JlcG9zaXRpb25BcnJvdyhjZW50ZXJYKVxyXG5cclxuICAgICAgLy8gVW5kZXJsaW5lIGFuaW1hdGlvblxyXG4gICAgICBfYW5pbWF0aW9uVW5kZXJsaW5lKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciBDbGljayBIYW5kbGVyc1xyXG4gICAgLy9cclxuXHJcbiAgICAvLyBNb2JpbGUgQ2F0ZWdvcnkgbWVudVxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LW1vYmlsZS10aXRsZScpLm9uKCdjbGljaycsIF9tb2JpbGVDYXRlZ29yeU1lbnUpO1xyXG5cclxuICAgIC8vIENsb3NlIGJ1dHRvblxyXG4gICAgJCgnLmNsb3NlLWJ1dHRvbicpLm9uKCdjbGljaycsIF9jbG9zZUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVzaXplKCkge1xyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB3aWR0aCA9IHdpbmRvdy5vdXRlcldpZHRoO1xyXG4gICAgICBpZiAod2lkdGggPCA2NDApIHtcclxuICAgICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgICAgIGlmICgkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2ZsZXgnKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnYmxvY2snKSB7XHJcbiAgICAgICAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyRHJvcGRvd24oY2xhc3NOYW1lKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tY2F0ZWdvcnktd3JhcHBlcicpLmZhZGVJbignc2xvdycpLmZvY3VzKCkuZmlsdGVyKCc6bm90KC4nICsgY2xhc3NOYW1lICsgJyknKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZmlsdGVyVGl0bGUodGl0bGUpIHtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZU91dCgpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLmFkZENsYXNzKCdhY3RpdmUnKS50ZXh0KHRpdGxlKTtcclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1hcnJvdy11cCcpLnNob3coKS5jc3MoeyBsZWZ0OiBjZW50ZXJYIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2FuaW1hdGlvblVuZGVybGluZSgpIHtcclxuICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykuYWRkQ2xhc3MoJ2FuaW1hdGUnKVxyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jbG9zZUJ1dHRvbigpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuaGlkZSgpO1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgICQoJ2gxLm1vcmUtc2VjdGlvbi10YWdsaW5lLXRhZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJ3AubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuZmFkZUluKCdzbG93Jyk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfbW9iaWxlQ2F0ZWdvcnlNZW51KCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCB7IG1vcmUgfSIsImNvbnN0IGZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGVuZHBvaW50VVJMLFxyXG4gICAgc3VjY2Vzc1VSTCxcclxuICAgIGNhbmNlbFVSTCxcclxuICAgICRmb3JtLFxyXG4gICAgJGZvcm1XcmFwcGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcclxuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XHJcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XHJcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcclxuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XHJcblxyXG4gICAgX3ZhbGlkYXRpb24oKTtcclxuICAgIF90b2dnbGVyKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XHJcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xyXG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgZGVidWc6IHRydWUsXHJcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxyXG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XHJcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcclxuXHJcbiAgICAkZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3JtLl9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgeyBmb3JtIH0iLCJpbXBvcnQgeyBtb3JlIH0gZnJvbSAnLi9tb2R1bGVzL21vcmUuanMnO1xyXG5pbXBvcnQgeyBmb3JtIH0gZnJvbSAnLi9tb2R1bGVzL2Zvcm0uanMnO1xyXG5cclxuY29uc3QgaWcgPSAoZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwYXRoTmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcclxuICAgIGxhbmcgPSBfbGFuZygpLFxyXG4gICAgYnJvd3NlcldpZHRoID0gX3dpZHRoKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBTZWFyY2hcclxuXHJcbiAgICAvLyBGb3Jtc1xyXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSB7XHJcbiAgICAgIGZvcm0uaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vcmVcclxuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgIG1vcmUuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhcm91c2VsXHJcbiAgICBpZiAoJCgnLmlnLWNhcm91c2VsJykubGVuZ3RoKSB7XHJcbiAgICAgIC8vIGNhcm91c2VsLmluaXQoKTtcclxuICAgIH1cclxuICAgIC8vIEFub3RoZXIgbW9kdWxlXHJcblxyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHBhZ2UgbGFuZ3VhZ2VcclxuICBmdW5jdGlvbiBfbGFuZygpIHtcclxuICAgIGlmIChwYXRoTmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICAgIHJldHVybiAnZnInO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICdlbic7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgaW5pdGlhbCBicm93c2VyIHdpZHRoXHJcbiAgZnVuY3Rpb24gX3dpZHRoKCkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG4gIH1cclxuXHJcbiAgLy8gT25seSByZXR1cm4gcHVibGljIG1ldGhvZHMgYW5kIHZhcmlhYmxlc1xyXG4gIHJldHVybiB7XHJcbiAgICBpbml0LFxyXG4gICAgcGF0aE5hbWUsXHJcbiAgICBsYW5nLFxyXG4gICAgYnJvd3NlcldpZHRoXHJcbiAgfTtcclxufSgpKTtcclxuXHJcblxyXG4vL0FjY29yZGlvblxyXG5cclxuLy8gJCgnLmhlbHAtdG9waWNzLWFjY29yZGlvbicpLm9uKCd1cC56Zi5hY2NvcmRpb24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuLy8gICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJy5pcy1hY3RpdmUnKS5vZmZzZXQoKS50b3AgfSwgJ3Nsb3cnKTtcclxuLy8gICB9LCAxMCk7IC8vQWRqdXN0IHRvIG1hdGNoIHNsaWRlU3BlZWRcclxuLy8gfSk7XHJcblxyXG4vLyBLaWNrIHRoaW5ncyBvZmZcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIGlnLmluaXQoKTtcclxufSlcclxuIl0sIm5hbWVzIjpbIm1vcmUiLCJpbml0Iiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCIkdGhpcyIsIiQiLCJvZmZzZXQiLCJ3aWR0aCIsImNlbnRlclgiLCJsZWZ0IiwiY2xhc3NOYW1lIiwiYXR0ciIsIm1hdGNoIiwidGl0bGUiLCJ0ZXh0IiwiX21vYmlsZUNhdGVnb3J5TWVudSIsIl9jbG9zZUJ1dHRvbiIsIl9yZXNpemUiLCJ3aW5kb3ciLCJyZXNpemUiLCJvdXRlcldpZHRoIiwicmVtb3ZlQ2xhc3MiLCJjc3MiLCJfZmlsdGVyRHJvcGRvd24iLCJmYWRlSW4iLCJmb2N1cyIsImZpbHRlciIsImhpZGUiLCJhZGRDbGFzcyIsIl9maWx0ZXJUaXRsZSIsImZhZGVPdXQiLCJfcmVwb3NpdGlvbkFycm93Iiwic2hvdyIsIl9hbmltYXRpb25VbmRlcmxpbmUiLCJ0b2dnbGVDbGFzcyIsImZvcm0iLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwidmFsaWRhdGUiLCJfcHJvY2VzcyIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsImxvY2F0aW9uIiwicmVwbGFjZSIsIl90b2dnbGVyIiwiaWciLCJwYXRoTmFtZSIsInBhdGhuYW1lIiwibGFuZyIsIl9sYW5nIiwiYnJvd3NlcldpZHRoIiwiX3dpZHRoIiwiZG9jdW1lbnQiLCJmb3VuZGF0aW9uIiwiaW5kZXhPZiIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFNQSxPQUFPLFNBQVBBLElBQU8sR0FBVztXQUNiQyxJQUFULEdBQWdCOzs7O01BSVosd0JBQUYsRUFBNEJDLEVBQTVCLENBQStCLE9BQS9CLEVBQXdDLFVBQVVDLENBQVYsRUFBYTtRQUNqREMsY0FBRjs7VUFFSUMsUUFBUUMsRUFBRSxJQUFGLENBQVo7VUFDRUMsU0FBU0YsTUFBTUUsTUFBTixFQURYO1VBRUVDLFFBQVFILE1BQU1HLEtBQU4sRUFGVjtVQUdFQyxVQUFVRixPQUFPRyxJQUFQLEdBQWNGLFFBQVEsQ0FBdEIsR0FBMEIsRUFIdEM7VUFJRUcsWUFBWU4sTUFBTU8sSUFBTixDQUFXLE9BQVgsRUFBb0JDLEtBQXBCLENBQTBCLHVCQUExQixDQUpkO1VBS0VDLFFBQVFULE1BQU1VLElBQU4sRUFMVjs7O3NCQVFnQkosU0FBaEI7OzttQkFHYUcsS0FBYjs7O3VCQUdpQkwsT0FBakI7Ozs7S0FqQkY7Ozs7OztNQTJCRSxpQ0FBRixFQUFxQ1AsRUFBckMsQ0FBd0MsT0FBeEMsRUFBaURjLG1CQUFqRDs7O01BR0UsZUFBRixFQUFtQmQsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0JlLFlBQS9COzs7V0FHT0MsT0FBVCxHQUFtQjtNQUNmQyxNQUFGLEVBQVVDLE1BQVYsQ0FBaUIsWUFBWTtVQUN2QlosUUFBUVcsT0FBT0UsVUFBbkI7VUFDSWIsUUFBUSxHQUFaLEVBQWlCO1VBQ2Isb0JBQUYsRUFBd0JjLFdBQXhCLENBQW9DLFNBQXBDO1lBQ0loQixFQUFFLG9CQUFGLEVBQXdCaUIsR0FBeEIsQ0FBNEIsU0FBNUIsTUFBMkMsTUFBL0MsRUFBdUQ7WUFDbkQsb0JBQUYsRUFBd0JBLEdBQXhCLENBQTRCLFNBQTVCLEVBQXVDLE9BQXZDOztPQUhKLE1BS087WUFDRGpCLEVBQUUsb0JBQUYs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
