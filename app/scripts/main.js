// ******************************************************
// Forms (Reveal module pattern, form namespace)
// ******************************************************

const form = (function () {
  var endpointURL,
    successURL,
    cancelURL,
    $form,
    $formWrapper;

  function init() {
    // Forms should always be wrapped in '.ig-form'
    if ($('.ig-form').length) {
      $formWrapper = $('.ig-form');
      $form = $formWrapper.find('form');
      endpointURL = $formWrapper.find('form').data('endpoint');
      cancelURL = $formWrapper.find('form').data('cancel');

      // Very simple form toggler
      $('.toggler').on('click', function(){
        $('.toggle-content').hide();
        $('.' + $(this).data('content')).show();
      });

      validation();
    }
  }

  function validation() {
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
      return this.optional(element) ||
        postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
    }, 'Please specify a valid postal code.');

    $form.validate({
      errorPlacement: function (label, element) {
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
    $form.find('button[type=submit]').on('click', function () {
      $form.submit();
    });
    $form.find('button.cancel').on('click', function () {
      window.location.replace(cancelURL);
    });

  }

  function process(event) {
    var formDataRaw,
      formDataParsed;
    event.preventDefault();

    if ($form.valid()) {
      $form.removeClass('server-error');
      $formWrapper.addClass('submitting');
      formDataRaw = $form.serializeArray();

      // If we need to modify the data, use parse method
      formDataParsed = parse(formDataRaw);
      submit(formDataParsed);
    }
    console.log(formDataParsed);
    return false;
  }

  function parse(data) {
    // Execute any custom logic here


    return data
  }

  function submit(data) {
    $.ajax({
      method: 'POST',
      url: endpointURL,
      data: data
    }).success(function (msg) {
      $formWrapper.addClass('success');
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
    parse,
    submit
  };
}());

form.init();

//Carousel
$(function(){
	$(document).foundation();
	$('[data-responsive-toggle] button').on('click', function(){
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
	$('.homepage-carousel').slick({
		dots: true,
		infinite: true,
		speed: 500,
		mobileFirst: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
		nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
		responsive: [
			{
				breakpoint: 640,
				settings: {
					fade: true,
				}
			},
			{
				breakpoint: 1024,
				settings: {
					arrows: true,
					fade: true,
				}
			}
		]
	});

	$('.js-open-socialdrawer').click(function() {
		// this.next() selects next sibling element
		// any suggestions on a better way to do this?
		var jsSocialDrawer = $(this).next();

		if (jsSocialDrawer.hasClass('js-socialdrawer-opened')) {
			jsSocialDrawer.removeClass('js-socialdrawer-opened');
		} else {
			jsSocialDrawer.addClass('js-socialdrawer-opened');
		}
	});

	$('.homepage-carousel-slide').hover(
		showSocialListOnHover, hideSocialListOnHover
	);

	$('.home-hero').hover(
		showSocialListOnHover, hideSocialListOnHover
	);

	$('.tile').hover(
		showSocialListOnHover, hideSocialListOnHover
	);
});

//More Header

$(function(){

	$('.more-section-menuitem').on('click',function(e){
		e.preventDefault();

		 // Filter the catrgory dropdown on click
		var className = $(this).attr('class').match(/[\w-]*category[\w-]*/g);
		$('.more-section-menu-dropdown-category-wrapper').fadeIn('slow').filter(':not(.'+className+')').hide();

		// Filter the category title on click
		var title = $(this).text();
		$('p.more-section-tagline-tag').fadeOut();

		$('h1.more-section-tagline-tag').removeClass('active');
		setTimeout(function() {
        	$('h1.more-section-tagline-tag').addClass('active').text(title);
   		 }, 200);

		//Arrow position move on click
		var $this = $(this);
		var offset = $this.offset();
		var width = $this.width();
		var centerX = offset.left + width / 2 - 50;
		$('.more-section-menu-dropdown-arrow-up').show().css({left: centerX});;

		//Underline animation
		$('.tertiary-cta-more').removeClass('animate');
		setTimeout(function() {
        	$('.tertiary-cta-more').addClass('animate')
   		 }, 100);

	});

		// $(document).mouseup(function(e){
		//
		// 	var container = $('.more-section-menu-dropdown');
		//
		// 	if (!container.is(e.target) // if the target of the click isn't the container...
	  //       && container.has(e.target).length === 0) // ... nor a descendant of the container
		//     {
		//         container.hide();
		//     }
		// });


// });

	//Toggle the Open/Close mobile categories menu
	$('.more-section-menu-mobile-title').on('click', function(){

		 // $('html, body').animate({
	  //       scrollTop: $("#more-mobile-menu").offset().top
	  //   }, 2000);

		$('.more-section-menu').toggleClass('active');
	})

	// Close button
	$('.close-button').on('click', function(){
		$('.more-section-menu-dropdown-category-wrapper').hide();
		$('.more-section-menu-dropdown-arrow-up').hide();
		$('.tertiary-cta-more').removeClass('animate');
		$('h1.more-section-tagline-tag').removeClass('active');
		$('p.more-section-tagline-tag').fadeIn('slow');
	});

});

// More Header Responsive

$(window).resize(function() {

    var width = $(document).width();

    if (width < 640) {
    	$('.tertiary-cta-more').removeClass('animate');

    	if($('.more-section-menu').css('display') === 'flex'){
    		$('.more-section-menu').css('display','block');
    	}
    }
    if (width > 640) {

    	if($('.more-section-menu').css('display') === 'block'){
    		$('.more-section-menu').css('display','flex');
    	}

    }
});

//Accordion

$('.help-topics-accordion').on('up.zf.accordion', function(event) {
    setTimeout(function(){
        $('html,body').animate({scrollTop: $('.is-active').offset().top}, 'slow');
    }, 10); //Adjust to match slideSpeed
});

// helper functions
const showSocialListOnHover = function() {
	if ($(window).width() > 1024) {
		var jsSocialDrawerList = $(this).find('.js-socialdrawer > ul');

		jsSocialDrawerList.addClass('show-list-on-hover');
	}
}

const hideSocialListOnHover = function() {
	if ($(window).width() > 1024) {
		var jsSocialDrawerList = $(this).find('.js-socialdrawer > ul');

		jsSocialDrawerList.removeClass('show-list-on-hover');
	}
}
