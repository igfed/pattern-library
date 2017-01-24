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
	$('.js-socialdrawer-open').click(function() {
		// this.next() selects next sibling element
		var maxHeightStatus = $(this).next().css('max-height');

		if (maxHeightStatus == '0px') {
			$(this).next().css({ maxHeight: '50px' });
		} else {
			$(this).next().css({ maxHeight: '0px' });
		}
	});
});
