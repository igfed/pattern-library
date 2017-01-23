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
		var className = $(this).attr('class').match(/[\w-]*category[\w-]*/g);
		$('.more-section-menu-dropdown-category').show().filter(':not(.'+className+')').hide();
		var title = $(this).text();
		$('p.more-section-tagline-tag').hide();
		$('h1.more-section-tagline-tag').addClass('active').text(title);
	})

	$('.more-section-menu-mobile-title').on('click', function(e){
		 e.preventDefault();
		$('.more-section-menu-mobile').toggle();
	})
});

//Accordion

$(".help-topics-accordion").on("up.zf.accordion", function(event) {
    setTimeout(function(){
        $('html,body').animate({scrollTop: $('.is-active').offset().top}, 'slow');
    }, 10); //Adjust to match slideSpeed
}); 