
'use strict';

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
}());

var form = (function () {

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
}());

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
      console.log(more);
      console.log(more.init());
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


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlcyI6WyJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm0uanMiLCJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXHJcbiAgICBfcmVzaXplKCk7XHJcblxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxyXG4gICAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXHJcbiAgICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgICBfZmlsdGVyVGl0bGUodGl0bGUpO1xyXG5cclxuICAgICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXHJcbiAgICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcbiAgICAvL1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtbW9iaWxlLXRpdGxlJykub24oJ2NsaWNrJywgX21vYmlsZUNhdGVnb3J5TWVudSk7XHJcblxyXG4gICAgLy8gQ2xvc2UgYnV0dG9uXHJcbiAgICAkKCcuY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgX2Nsb3NlQnV0dG9uKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHdpZHRoID0gd2luZG93Lm91dGVyV2lkdGg7XHJcbiAgICAgIGlmICh3aWR0aCA8IDY0MCkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuZmFkZUluKCdzbG93JykuZm9jdXMoKS5maWx0ZXIoJzpub3QoLicgKyBjbGFzc05hbWUgKyAnKScpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvcm0uX3Byb2Nlc3MoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXHJcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG9uZTI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWwyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xyXG4gICAgdmFyIGZvcm1EYXRhUmF3LFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcclxuXHJcbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcclxuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcclxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xyXG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcclxuXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICB9KVxyXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcclxuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcclxuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0iLCJpbXBvcnQgbW9yZSBmcm9tICcuL21vZHVsZXMvbW9yZS5qcyc7XHJcbmltcG9ydCBmb3JtIGZyb20gJy4vbW9kdWxlcy9mb3JtLmpzJztcclxuXHJcbmNvbnN0IGlnID0gKGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcGF0aE5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXHJcbiAgICBsYW5nID0gX2xhbmcoKSxcclxuICAgIGJyb3dzZXJXaWR0aCA9IF93aWR0aCgpO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gU2VhcmNoXHJcblxyXG4gICAgLy8gRm9ybXNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkge1xyXG4gICAgICBmb3JtLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNb3JlXHJcbiAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICBtb3JlLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYXJvdXNlbFxyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkge1xyXG4gICAgICAvLyBjYXJvdXNlbC5pbml0KCk7XHJcbiAgICB9XHJcbiAgICAvLyBBbm90aGVyIG1vZHVsZVxyXG5cclxuICB9XHJcblxyXG4gIC8vIFNldCBwYWdlIGxhbmd1YWdlXHJcbiAgZnVuY3Rpb24gX2xhbmcoKSB7XHJcbiAgICBpZiAocGF0aE5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgICByZXR1cm4gJ2ZyJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnZW4nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGluaXRpYWwgYnJvd3NlciB3aWR0aFxyXG4gIGZ1bmN0aW9uIF93aWR0aCgpIHtcclxuICAgIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxuICB9XHJcblxyXG4gIC8vIE9ubHkgcmV0dXJuIHB1YmxpYyBtZXRob2RzIGFuZCB2YXJpYWJsZXNcclxuICByZXR1cm4ge1xyXG4gICAgaW5pdCxcclxuICAgIHBhdGhOYW1lLFxyXG4gICAgbGFuZyxcclxuICAgIGJyb3dzZXJXaWR0aFxyXG4gIH07XHJcbn0oKSk7XHJcblxyXG5cclxuLy9BY2NvcmRpb25cclxuXHJcbi8vICQoJy5oZWxwLXRvcGljcy1hY2NvcmRpb24nKS5vbigndXAuemYuYWNjb3JkaW9uJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbi8vICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuaXMtYWN0aXZlJykub2Zmc2V0KCkudG9wIH0sICdzbG93Jyk7XHJcbi8vICAgfSwgMTApOyAvL0FkanVzdCB0byBtYXRjaCBzbGlkZVNwZWVkXHJcbi8vIH0pO1xyXG5cclxuLy8gS2ljayB0aGluZ3Mgb2ZmXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBpZy5pbml0KCk7XHJcbn0pXHJcbiJdLCJuYW1lcyI6WyJpbml0Iiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCIkdGhpcyIsIiQiLCJvZmZzZXQiLCJ3aWR0aCIsImNlbnRlclgiLCJsZWZ0IiwiY2xhc3NOYW1lIiwiYXR0ciIsIm1hdGNoIiwidGl0bGUiLCJ0ZXh0IiwiX21vYmlsZUNhdGVnb3J5TWVudSIsIl9jbG9zZUJ1dHRvbiIsIl9yZXNpemUiLCJ3aW5kb3ciLCJyZXNpemUiLCJvdXRlcldpZHRoIiwicmVtb3ZlQ2xhc3MiLCJjc3MiLCJfZmlsdGVyRHJvcGRvd24iLCJmYWRlSW4iLCJmb2N1cyIsImZpbHRlciIsImhpZGUiLCJhZGRDbGFzcyIsIl9maWx0ZXJUaXRsZSIsImZhZGVPdXQiLCJfcmVwb3NpdGlvbkFycm93Iiwic2hvdyIsIl9hbmltYXRpb25VbmRlcmxpbmUiLCJ0b2dnbGVDbGFzcyIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ2YWxpZGF0ZSIsIl9wcm9jZXNzIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwibG9jYXRpb24iLCJyZXBsYWNlIiwiX3RvZ2dsZXIiLCJpZyIsInBhdGhOYW1lIiwicGF0aG5hbWUiLCJsYW5nIiwiX2xhbmciLCJicm93c2VyV2lkdGgiLCJfd2lkdGgiLCJkb2N1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
