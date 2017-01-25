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
});

//More Header

$(function(){

	$('.more-section-menuitem').on('click',function(e){
		 e.preventDefault();

		 // Filter the catrgory dropdown on click
		var className = $(this).attr('class').match(/[\w-]*category[\w-]*/g);
		$('.more-section-menu-dropdown-category-wrapper').show().filter(':not(.'+className+')').hide();

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
		$('.more-section-menu-dropdown-arrow-up').css({left: centerX});

		//Underline
		$('.tertiary-cta-more').removeClass('active');
		 $('.tertiary-cta-more').addClass('active');

	});


	// $('.more-section-menuitem').mouseup(function(){
	// 	$('.tertiary-cta-more').addClass('active');
	// }).mousedown(function(){
	// 	$('.tertiary-cta-more').removeClass('active');
	// });


		
	//Toggle the Open/Close mobile categories menu
	$('.more-section-menu-mobile-title').on('click', function(){
		 
		 $('html, body').animate({
	        scrollTop: $("#more-mobile-menu").offset().top
	    }, 2000);

		 $('.more-section-menu-mobile-title').toggleClass('active');
		$('.more-section-menu-mobile').toggle();
	})

	// Close button
	$('.close-button').on('click', function(){
		$('.more-section-menu-dropdown-category-wrapper').hide();
		$('.more-section-menu-dropdown-arrow-up').hide();
	});

});

//Accordion

$('.help-topics-accordion').on('up.zf.accordion', function(event) {
    setTimeout(function(){
        $('html,body').animate({scrollTop: $('.is-active').offset().top}, 'slow');
    }, 10); //Adjust to match slideSpeed
}); 


	// if($(window).width() < 1024){
	// 	// $(".more-section-menu-dropdown-story").hide();
	// 	$(".more-section-menu-dropdown-story('Content')").slice(0,5).show();
	// }

