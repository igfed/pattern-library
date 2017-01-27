// *****************************************************
// Some Boilerplate Patterns
// *****************************************************

// ******************************************************
// Forms
// ******************************************************

const form = (function () {
  var endpointURL,
    successURL,
    cancelURL,
    $form,
    $formWrapper;

  function init() {
    if ($('.ig-form').length) {
      $formWrapper = $('.ig-form');
      $form = $formWrapper.find('form');
      endpointURL = $formWrapper.find('form').data('endpoint');
      cancelURL = $formWrapper.find('form').data('cancel');
      validation();
    }
  }

  function validation() {
    $.validator.setDefaults({
      debug: true,
      success: 'valid'
    });

    $.validator.addMethod('cdnPostal', function (postal, element) {
      return this.optional(element) ||
        postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
    }, 'Please specify a valid postal code.');

    $form.validate({
      errorPlacement: function (label, element) {
        // if (element.attr('name') === 'current_client') {
        //   label.insertBefore(element);
        // } else if (element.attr('name') === 'opt_in') {
        //   label.insertAfter('#optIn + span');
        // } else {
        //   label.insertAfter(element); // standard behaviour
        // }
      },
      rules: {
        phone: {
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
        extension: {
          number: true
        }
      }
    });
    $form.find('button[type=submit]').on('click', function () {
      $form.submit();
    });
    $form.find('button.cancel').on('click', function () {
      window.location.replace(cancelURL);
    });

  }

  function process(event) {
    var formData;
    event.preventDefault();
    if ($form.valid()) {
      $form.removeClass('server-error');
      $formWrapper.addClass('submitting');
      formData = $form.serializeArray();

      submit(formData);
    }

    return false;
  }

  function submit(data) {
    $.ajax({
      method: 'POST',
      url: endpointURL,
      data: data
    }).success(function (msg) {
      showSuccessModal();
      $formWrapper.removeClass('submitting');
    })
      .error(function (msg) {
        $form.addClass('server-error');
        $formWrapper.removeClass('submitting');
        ScrollMan.to($('#server-error'));
      });
  }

  return {
    init, // Can use shorthand notation. (init: init) not required. ES6 for the win!
    validation,
    process,
    submit
  };
}());

form.init();


// Carousel

$(function () {
  $(document).foundation();
  $('[data-responsive-toggle] button').on('click', function () {
    $('body').toggleClass('site-header-is-active');
  });
  $('.text-carousel').slick({
    dots: true,
    speed: 300,
    infinite: true,
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
    nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>'
  });
  $('.carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
    nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });
});

//More Header

$(function () {

  $('.more-section-menuitem').on('click', function (e) {
    e.preventDefault();

    // Filter the catrgory dropdown on click
    var className = $(this).attr('class').match(/[\w-]*category[\w-]*/g);
    $('.more-section-menu-dropdown-category').show().filter(':not(.' + className + ')').hide();

    // Filter the category title on click
    var title = $(this).text();
    $('p.more-section-tagline-tag').hide();
    $('h1.more-section-tagline-tag').addClass('active').text(title);
    // $('.tertiary-cta-more').addClass('active');

    //Arrow position move on click
    var $this = $(this);
    var offset = $this.offset();
    var width = $this.width();
    var centerX = offset.left + width / 2 - 50;
    $('.more-section-menu-dropdown-arrow-up').show();
    $('.more-section-menu-dropdown-arrow-up').css({ left: centerX });

    //Underline
    $('.tertiary-cta-more').addClass('active');

  });


  // $('.more-section-menuitem').mouseup(function(){
  // 	$('.tertiary-cta-more').addClass('active');
  // }).mousedown(function(){
  // 	$('.tertiary-cta-more').removeClass('active');
  // });


  //Toggle the Open/Close mobile categories menu
  $('.more-section-menu-mobile-title').on('click', function (e) {
    e.preventDefault();
    $('.more-section-menu-mobile').toggle();
  })

});

//Accordion

$('.help-topics-accordion').on('up.zf.accordion', function (event) {
  setTimeout(function () {
    $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
  }, 10); //Adjust to match slideSpeed
});