(function () {
'use strict';

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
    console.log('Carousel init!');
    // console.log('This is a shared variable, ig.width:' + ig.browserWidth);
  }

  return {
    init: init
  };
})();

//Carousel
// $(function () {
//   $('[data-responsive-toggle] button').on('click', function () {
//     $('body').toggleClass('site-header-is-active');
//   });
//   $('.text-carousel').slick({
//     dots: true,
//     speed: 300,
//     infinite: true,
//     mobileFirst: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
//     nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>'
//   });
//   $('.carousel').slick({
//     dots: true,
//     infinite: true,
//     speed: 300,
//     mobileFirst: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
//     nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
//     responsive: [
//       {
//         breakpoint: 640,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2
//         }
//       }
//     ]
//   });
//   $('.homepage-carousel').slick({
//     dots: true,
//     infinite: true,
//     speed: 500,
//     mobileFirst: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
//     nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
//     responsive: [
//       {
//         breakpoint: 640,
//         settings: {
//           fade: true,
//         }
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           arrows: true,
//           fade: true,
//         }
//       }
//     ]
//   });
//
//   $('.js-open-socialdrawer').click(function () {
//     // this.next() selects next sibling element
//     // any suggestions on a better way to do this?
//     var jsSocialDrawer = $(this).next();
//
//     if (jsSocialDrawer.hasClass('js-socialdrawer-opened')) {
//       jsSocialDrawer.removeClass('js-socialdrawer-opened');
//     } else {
//       jsSocialDrawer.addClass('js-socialdrawer-opened');
//     }
//   });
// });

var app = function () {
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
    init: init
  };

  //Accordion

  // $('.help-topics-accordion').on('up.zf.accordion', function (event) {
  //   setTimeout(function () {
  //     $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
  //   }, 10); //Adjust to match slideSpeed
  // });
}();

// Bootstrap app
$(document).ready(function () {
  app.init();
});

}());

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL21vcmUuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHVybCBwYXRoXHJcbmV4cG9ydCBjb25zdCBwYXRoID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG59KSgpXHJcblxyXG4vLyBsYW5ndWFnZVxyXG5leHBvcnQgY29uc3QgbGFuZyA9ICgoKSA9PiB7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gJ2ZyJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdlbic7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBicm93c2VyIHdpZHRoXHJcbmV4cG9ydCBjb25zdCBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBSZWdpc3RlciByZXNpemUgYmVoYXZpb3VyXHJcbiAgICBfcmVzaXplKCk7XHJcblxyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51aXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCksXHJcbiAgICAgICAgd2lkdGggPSAkdGhpcy53aWR0aCgpLFxyXG4gICAgICAgIGNlbnRlclggPSBvZmZzZXQubGVmdCArIHdpZHRoIC8gMiAtIDUwLFxyXG4gICAgICAgIGNsYXNzTmFtZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL1tcXHctXSpjYXRlZ29yeVtcXHctXSovZyksXHJcbiAgICAgICAgdGl0bGUgPSAkdGhpcy50ZXh0KCk7XHJcblxyXG4gICAgICAvLyBGaWx0ZXIgdGhlIGNhdGVnb3J5IGRyb3Bkb3duIG9uIGNsaWNrXHJcbiAgICAgIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpO1xyXG5cclxuICAgICAgLy8gRmlsdGVyIHRoZSBjYXRlZ29yeSB0aXRsZSBvbiBjbGlja1xyXG4gICAgICBfZmlsdGVyVGl0bGUodGl0bGUpO1xyXG5cclxuICAgICAgLy8gQXJyb3cgcG9zaXRpb24gbW92ZSBvbiBjbGlja1xyXG4gICAgICBfcmVwb3NpdGlvbkFycm93KGNlbnRlclgpXHJcblxyXG4gICAgICAvLyBVbmRlcmxpbmUgYW5pbWF0aW9uXHJcbiAgICAgIF9hbmltYXRpb25VbmRlcmxpbmUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIENsaWNrIEhhbmRsZXJzXHJcbiAgICAvL1xyXG5cclxuICAgIC8vIE1vYmlsZSBDYXRlZ29yeSBtZW51XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtbW9iaWxlLXRpdGxlJykub24oJ2NsaWNrJywgX21vYmlsZUNhdGVnb3J5TWVudSk7XHJcblxyXG4gICAgLy8gQ2xvc2UgYnV0dG9uXHJcbiAgICAkKCcuY2xvc2UtYnV0dG9uJykub24oJ2NsaWNrJywgX2Nsb3NlQnV0dG9uKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXNpemUoKSB7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGlnLmJyb3dzZXJXaWR0aCA8IDY0MCkge1xyXG4gICAgICAgICQoJy50ZXJ0aWFyeS1jdGEtbW9yZScpLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XHJcbiAgICAgICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoJCgnLm1vcmUtc2VjdGlvbi1tZW51JykuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jaycpIHtcclxuICAgICAgICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudScpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJEcm9wZG93bihjbGFzc05hbWUpIHtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bi1jYXRlZ29yeS13cmFwcGVyJykuZmFkZUluKCdzbG93JykuZm9jdXMoKS5maWx0ZXIoJzpub3QoLicgKyBjbGFzc05hbWUgKyAnKScpLmhpZGUoKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9maWx0ZXJUaXRsZSh0aXRsZSkge1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlT3V0KCk7XHJcbiAgICAkKCdoMS5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnRleHQodGl0bGUpO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9yZXBvc2l0aW9uQXJyb3coY2VudGVyWCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWFycm93LXVwJykuc2hvdygpLmNzcyh7IGxlZnQ6IGNlbnRlclggfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYW5pbWF0aW9uVW5kZXJsaW5lKCkge1xyXG4gICAgJCgnLnRlcnRpYXJ5LWN0YS1tb3JlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5hZGRDbGFzcygnYW5pbWF0ZScpXHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2Nsb3NlQnV0dG9uKCkge1xyXG4gICAgJCgnLm1vcmUtc2VjdGlvbi1tZW51LWRyb3Bkb3duLWNhdGVnb3J5LXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUtZHJvcGRvd24tYXJyb3ctdXAnKS5oaWRlKCk7XHJcbiAgICAkKCcudGVydGlhcnktY3RhLW1vcmUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xyXG4gICAgJCgnaDEubW9yZS1zZWN0aW9uLXRhZ2xpbmUtdGFnJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgncC5tb3JlLXNlY3Rpb24tdGFnbGluZS10YWcnKS5mYWRlSW4oJ3Nsb3cnKTtcclxuICAgICQoJy5tb3JlLXNlY3Rpb24tbWVudS1kcm9wZG93bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9tb2JpbGVDYXRlZ29yeU1lbnUoKSB7XHJcbiAgICAkKCcubW9yZS1zZWN0aW9uLW1lbnUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciBlbmRwb2ludFVSTCxcclxuICAgIHN1Y2Nlc3NVUkwsXHJcbiAgICBjYW5jZWxVUkwsXHJcbiAgICAkZm9ybSxcclxuICAgICRmb3JtV3JhcHBlcjtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXHJcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xyXG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xyXG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XHJcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xyXG5cclxuICAgIF92YWxpZGF0aW9uKCk7XHJcbiAgICBfdG9nZ2xlcigpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxyXG4gICAgdmFyIGpJbnB1dCA9ICQoJzppbnB1dCwgdGV4dGFyZWEnKTtcclxuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlLFxyXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcclxuICAgICAgICBwb3N0YWwubWF0Y2goL1thLXpBLVpdWzAtOV1bYS16QS1aXSgtfCB8KVswLTldW2EtekEtWl1bMC05XS8pO1xyXG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XHJcblxyXG4gICAgJGZvcm0udmFsaWRhdGUoe1xyXG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3Byb2Nlc3MoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXHJcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG9uZTI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWwyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xyXG4gICAgdmFyIGZvcm1EYXRhUmF3LFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcclxuXHJcbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcclxuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcclxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xyXG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcclxuXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICB9KVxyXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcclxuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcclxuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIGluaXQhJylcclxuICAgIC8vIGNvbnNvbGUubG9nKCdUaGlzIGlzIGEgc2hhcmVkIHZhcmlhYmxlLCBpZy53aWR0aDonICsgaWcuYnJvd3NlcldpZHRoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKVxyXG5cclxuLy9DYXJvdXNlbFxyXG4vLyAkKGZ1bmN0aW9uICgpIHtcclxuLy8gICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdzaXRlLWhlYWRlci1pcy1hY3RpdmUnKTtcclxuLy8gICB9KTtcclxuLy8gICAkKCcudGV4dC1jYXJvdXNlbCcpLnNsaWNrKHtcclxuLy8gICAgIGRvdHM6IHRydWUsXHJcbi8vICAgICBzcGVlZDogMzAwLFxyXG4vLyAgICAgaW5maW5pdGU6IHRydWUsXHJcbi8vICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuLy8gICAgIHNsaWRlc1RvU2hvdzogMSxcclxuLy8gICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4vLyAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPicsXHJcbi8vICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nXHJcbi8vICAgfSk7XHJcbi8vICAgJCgnLmNhcm91c2VsJykuc2xpY2soe1xyXG4vLyAgICAgZG90czogdHJ1ZSxcclxuLy8gICAgIGluZmluaXRlOiB0cnVlLFxyXG4vLyAgICAgc3BlZWQ6IDMwMCxcclxuLy8gICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4vLyAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4vLyAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbi8vICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JyxcclxuLy8gICAgIG5leHRBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPicsXHJcbi8vICAgICByZXNwb25zaXZlOiBbXHJcbi8vICAgICAgIHtcclxuLy8gICAgICAgICBicmVha3BvaW50OiA2NDAsXHJcbi8vICAgICAgICAgc2V0dGluZ3M6IHtcclxuLy8gICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuLy8gICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICB9XHJcbi8vICAgICBdXHJcbi8vICAgfSk7XHJcbi8vICAgJCgnLmhvbWVwYWdlLWNhcm91c2VsJykuc2xpY2soe1xyXG4vLyAgICAgZG90czogdHJ1ZSxcclxuLy8gICAgIGluZmluaXRlOiB0cnVlLFxyXG4vLyAgICAgc3BlZWQ6IDUwMCxcclxuLy8gICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4vLyAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4vLyAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbi8vICAgICBhcnJvd3M6IGZhbHNlLFxyXG4vLyAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPicsXHJcbi8vICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nLFxyXG4vLyAgICAgcmVzcG9uc2l2ZTogW1xyXG4vLyAgICAgICB7XHJcbi8vICAgICAgICAgYnJlYWtwb2ludDogNjQwLFxyXG4vLyAgICAgICAgIHNldHRpbmdzOiB7XHJcbi8vICAgICAgICAgICBmYWRlOiB0cnVlLFxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgfSxcclxuLy8gICAgICAge1xyXG4vLyAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjQsXHJcbi8vICAgICAgICAgc2V0dGluZ3M6IHtcclxuLy8gICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuLy8gICAgICAgICAgIGZhZGU6IHRydWUsXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICB9XHJcbi8vICAgICBdXHJcbi8vICAgfSk7XHJcbi8vXHJcbi8vICAgJCgnLmpzLW9wZW4tc29jaWFsZHJhd2VyJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgLy8gdGhpcy5uZXh0KCkgc2VsZWN0cyBuZXh0IHNpYmxpbmcgZWxlbWVudFxyXG4vLyAgICAgLy8gYW55IHN1Z2dlc3Rpb25zIG9uIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xyXG4vLyAgICAgdmFyIGpzU29jaWFsRHJhd2VyID0gJCh0aGlzKS5uZXh0KCk7XHJcbi8vXHJcbi8vICAgICBpZiAoanNTb2NpYWxEcmF3ZXIuaGFzQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKSkge1xyXG4vLyAgICAgICBqc1NvY2lhbERyYXdlci5yZW1vdmVDbGFzcygnanMtc29jaWFsZHJhd2VyLW9wZW5lZCcpO1xyXG4vLyAgICAgfSBlbHNlIHtcclxuLy8gICAgICAganNTb2NpYWxEcmF3ZXIuYWRkQ2xhc3MoJ2pzLXNvY2lhbGRyYXdlci1vcGVuZWQnKTtcclxuLy8gICAgIH1cclxuLy8gICB9KTtcclxuLy8gfSk7IiwiaW1wb3J0IG1vcmUgZnJvbSAnLi9tb3JlLmpzJztcclxuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xyXG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBhY2NvcmRpb24gZnJvbSAnLi9hY2NvcmRpb24uanMnO1xyXG5cclxuY29uc3QgYXBwID0gKGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIG1vZHVsZXNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5tb3JlLXNlY3Rpb24nKS5sZW5ndGgpIG1vcmUuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG5cclxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XHJcbiAgICBfbGFuZ3VhZ2UoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcclxuICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2ZyJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2VuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH1cclxuXHJcbi8vQWNjb3JkaW9uXHJcblxyXG4vLyAkKCcuaGVscC10b3BpY3MtYWNjb3JkaW9uJykub24oJ3VwLnpmLmFjY29yZGlvbicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4vLyAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgJCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnLmlzLWFjdGl2ZScpLm9mZnNldCgpLnRvcCB9LCAnc2xvdycpO1xyXG4vLyAgIH0sIDEwKTsgLy9BZGp1c3QgdG8gbWF0Y2ggc2xpZGVTcGVlZFxyXG4vLyB9KTtcclxufSkoKVxyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgYXBwLmluaXQoKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJicm93c2VyV2lkdGgiLCJvdXRlcldpZHRoIiwiaW5pdCIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiJHRoaXMiLCIkIiwib2Zmc2V0Iiwid2lkdGgiLCJjZW50ZXJYIiwibGVmdCIsImNsYXNzTmFtZSIsImF0dHIiLCJtYXRjaCIsInRpdGxlIiwidGV4dCIsIl9tb2JpbGVDYXRlZ29yeU1lbnUiLCJfY2xvc2VCdXR0b24iLCJfcmVzaXplIiwicmVzaXplIiwiaWciLCJyZW1vdmVDbGFzcyIsImNzcyIsIl9maWx0ZXJEcm9wZG93biIsImZhZGVJbiIsImZvY3VzIiwiZmlsdGVyIiwiaGlkZSIsImFkZENsYXNzIiwiX2ZpbHRlclRpdGxlIiwiZmFkZU91dCIsIl9yZXBvc2l0aW9uQXJyb3ciLCJzaG93IiwiX2FuaW1hdGlvblVuZGVybGluZSIsInRvZ2dsZUNsYXNzIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwibG9nIiwiYXBwIiwiZG9jdW1lbnQiLCJmb3VuZGF0aW9uIiwiZm9ybXMiLCJtb3JlIiwiY2Fyb3VzZWwiLCJfbGFuZ3VhZ2UiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQSxBQUFPOzs7QUFLUCxBQUFPLElBQU1BLE9BQVEsWUFBTTtNQUNyQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7V0FDNUMsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpnQixFQUFiOzs7QUFTUCxBQUFPLElBQU1DLGVBQWdCLFlBQU07U0FDMUJKLE9BQU9LLFVBQWQ7Q0FEMEIsRUFBckI7O0FDYlAsV0FBZSxDQUFDLFlBQU07V0FDWEMsSUFBVCxHQUFnQjs7OztNQUlaLHdCQUFGLEVBQTRCQyxFQUE1QixDQUErQixPQUEvQixFQUF3QyxVQUFVQyxDQUFWLEVBQWE7UUFDakRDLGNBQUY7O1VBRUlDLFFBQVFDLEVBQUUsSUFBRixDQUFaO1VBQ0VDLFNBQVNGLE1BQU1FLE1BQU4sRUFEWDtVQUVFQyxRQUFRSCxNQUFNRyxLQUFOLEVBRlY7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