var more = (function () {
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
})();

var form$1 = (function () {

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
})();

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
      form$1.init();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlcyI6WyIuLi9hcHAvc2NyaXB0cy9tb2R1bGVzL21vcmUuanMiLCIuLi9hcHAvc2NyaXB0cy9tb2R1bGVzL2Zvcm0uanMiLCIuLi9hcHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCkge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXHJcbiAgICBfcmVzaXplKCk7XHJcblxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxyXG4gICAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXHJcbiAgICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgICBfZmlsdGVyVGl0bGUodGl0bGUpO1xyXG5cclxuICAgICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXHJcbiAgICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcbiAgICAvL1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtbW9iaWxlLXRpdGxlJykub24oJ2NsaWNrJywgX21vYmlsZUNhdGVnb3J5TWVudSk7XHJcblxyXG4gICAgLy8gQ2xvc2UgYnV0dG9uXHJcbiAgICAkKCcuY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgX2Nsb3NlQnV0dG9uKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHdpZHRoID0gd2luZG93Lm91dGVyV2lkdGg7XHJcbiAgICAgIGlmICh3aWR0aCA8IDY0MCkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuZmFkZUluKCdzbG93JykuZm9jdXMoKS5maWx0ZXIoJzpub3QoLicgKyBjbGFzc05hbWUgKyAnKScpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSgpKSIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIGVuZHBvaW50VVJMLFxyXG4gICAgc3VjY2Vzc1VSTCxcclxuICAgIGNhbmNlbFVSTCxcclxuICAgICRmb3JtLFxyXG4gICAgJGZvcm1XcmFwcGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcclxuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XHJcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XHJcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcclxuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XHJcblxyXG4gICAgX3ZhbGlkYXRpb24oKTtcclxuICAgIF90b2dnbGVyKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XHJcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xyXG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgZGVidWc6IHRydWUsXHJcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxyXG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XHJcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcclxuXHJcbiAgICAkZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3JtLl9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KCkpIiwiaW1wb3J0IG1vcmUgZnJvbSAnLi9zY3JpcHRzL21vZHVsZXMvbW9yZS5qcyc7XHJcbmltcG9ydCBmb3JtIGZyb20gJy4vc2NyaXB0cy9tb2R1bGVzL2Zvcm0uanMnO1xyXG5cclxuY29uc3QgaWcgPSAoZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwYXRoTmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcclxuICAgIGxhbmcgPSBfbGFuZygpLFxyXG4gICAgYnJvd3NlcldpZHRoID0gX3dpZHRoKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBTZWFyY2hcclxuXHJcbiAgICAvLyBGb3Jtc1xyXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSB7XHJcbiAgICAgIGZvcm0uaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vcmVcclxuICAgIGlmICgkKCcubW9yZS1zZWN0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgIG1vcmUuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhcm91c2VsXHJcbiAgICBpZiAoJCgnLmlnLWNhcm91c2VsJykubGVuZ3RoKSB7XHJcbiAgICAgIC8vIGNhcm91c2VsLmluaXQoKTtcclxuICAgIH1cclxuICAgIC8vIEFub3RoZXIgbW9kdWxlXHJcblxyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHBhZ2UgbGFuZ3VhZ2VcclxuICBmdW5jdGlvbiBfbGFuZygpIHtcclxuICAgIGlmIChwYXRoTmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICAgIHJldHVybiAnZnInO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICdlbic7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgaW5pdGlhbCBicm93c2VyIHdpZHRoXHJcbiAgZnVuY3Rpb24gX3dpZHRoKCkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG4gIH1cclxuXHJcbiAgLy8gT25seSByZXR1cm4gcHVibGljIG1ldGhvZHMgYW5kIHZhcmlhYmxlc1xyXG4gIHJldHVybiB7XHJcbiAgICBpbml0LFxyXG4gICAgcGF0aE5hbWUsXHJcbiAgICBsYW5nLFxyXG4gICAgYnJvd3NlcldpZHRoXHJcbiAgfTtcclxufSgpKTtcclxuXHJcblxyXG4vL0FjY29yZGlvblxyXG5cclxuLy8gJCgnLmhlbHAtdG9waWNzLWFjY29yZGlvbicpLm9uKCd1cC56Zi5hY2NvcmRpb24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuLy8gICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJy5pcy1hY3RpdmUnKS5vZmZzZXQoKS50b3AgfSwgJ3Nsb3cnKTtcclxuLy8gICB9LCAxMCk7IC8vQWRqdXN0IHRvIG1hdGNoIHNsaWRlU3BlZWRcclxuLy8gfSk7XHJcblxyXG4vLyBLaWNrIHRoaW5ncyBvZmZcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIGlnLmluaXQoKTtcclxufSlcclxuIl0sIm5hbWVzIjpbImluaXQiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIiR0aGlzIiwiJCIsIm9mZnNldCIsIndpZHRoIiwiY2VudGVyWCIsImxlZnQiLCJjbGFzc05hbWUiLCJhdHRyIiwibWF0Y2giLCJ0aXRsZSIsInRleHQiLCJfbW9iaWxlQ2F0ZWdvcnlNZW51IiwiX2Nsb3NlQnV0dG9uIiwiX3Jlc2l6ZSIsIndpbmRvdyIsInJlc2l6ZSIsIm91dGVyV2lkdGgiLCJyZW1vdmVDbGFzcyIsImNzcyIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZvY3VzIiwiZmlsdGVyIiwiaGlkZSIsImFkZENsYXNzIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwiX3Byb2Nlc3MiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJsb2NhdGlvbiIsInJlcGxhY2UiLCJfdG9nZ2xlciIsImlnIiwicGF0aE5hbWUiLCJwYXRobmFtZSIsImxhbmciLCJfbGFuZyIsImJyb3dzZXJXaWR0aCIsIl93aWR0aCIsImRvY3VtZW50IiwiZm91bmRhdGlvbiIsImluZGV4T2YiLCJyZWFkeSJdLCJtYXBwaW5ncyI6IkFBQUEsV0FBZ0IsYUFBVztXQUNoQkEsSUFBVCxHQUFnQjs7OztNQUlaLHdCQUFGLEVBQTRCQyxFQUE1QixDQUErQixPQUEvQixFQUF3QyxVQUFVQyxDQUFWLEVBQWE7UUFDakRDLGNBQUY7O1VBRUlDLFFBQVFDLEVBQUUsSUFBRixDQUFaO1VBQ0VDLFNBQVNGLE1BQU1FLE1BQU4sRUFEWDtVQUVFQyxRQUFRSCxNQUFNRyxLQUFOLEVBRlY7VUFHRUMsVUFBVUYsT0FBT0csSUFBUCxHQUFjRixRQUFRLENBQXRCLEdBQTBCLEVBSHRDO1VBSUVHLFlBQVlOLE1BQU1PLElBQU4sQ0FBVyxPQUFYLEVBQW9CQyxLQUFwQixDQUEwQix1QkFBMUIsQ0FKZDtVQUtFQyxRQUFRVCxNQUFNVSxJQUFOLEVBTFY7OztzQkFRZ0JKLFNBQWhCOzs7bUJBR2FHLEtBQWI7Ozt1QkFHaUJMLE9BQWpCOzs7O0tBakJGOzs7Ozs7TUEyQkUsaUNBQUYsRUFBcUNQLEVBQXJDLENBQXdDLE9BQXhDLEVBQWlEYyxtQkFBakQ7OztNQUdFLGVBQUYsRUFBbUJkLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCZSxZQUEvQjs7O1dBR09DLE9BQVQsR0FBbUI7TUFDZkMsTUFBRixFQUFVQyxNQUFWLENBQWlCLFlBQVk7VUFDdkJaLFFBQVFXLE9BQU9FLFVBQW5CO1VBQ0liLFFBQVEsR0FBWixFQUFpQjtVQUNiLG9CQUFGLEVBQXdCYyxXQUF4QixDQUFvQyxTQUFwQztZQUNJaEIsRUFBRSxvQkFBRixFQUF3QmlCLEdBQXhCLENBQTRCLFNBQTVCLE1BQTJDLE1BQS9DLEVBQXVEO1lBQ25ELG9CQUFGLEVBQXdCQSxHQUF4QixDQUE0QixTQUE1QixFQUF1QyxPQUF2Qzs7T0FISixNQUtPO1lBQ0RqQixFQUFFLG9CQUFGLEVBQXdCaUIsR0FBeEIsQ0FB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
