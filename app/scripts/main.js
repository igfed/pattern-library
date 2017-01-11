$(function(){
	$(document).foundation();
	$('[data-responsive-toggle] button').on('click', function(){
		$('body').toggleClass('site-header-is-active');
	});
	$('.carousel').slick({
		dots: true,
  		infinite: false,
  		speed: 300,
  		slidesToShow: 2,
  		slidesToScroll: 2,
  		responsive: [
	    {
	      breakpoint: 768,
	      settings: {
	        slidesToShow: 2,
	        slidesToScroll: 2
	      }
	    },
	    {
	      breakpoint: 640,
	      settings: {
	        slidesToShow: 1,
	        slidesToScroll: 1
	      }
	    }
	    ]
	});
});