$(function(){
	$(document).foundation();
	$('[data-responsive-toggle] button').on('click', function(){
		$('body').toggleClass('site-header-is-active');
	});
	$('.carousel').slick({
		dots: true,
  		infinite: false,
  		speed: 300,
  		slidesToShow: 3,
  		slidesToScroll: 3,
  		responsive: [
    	{
      		breakpoint: 1024,
      		settings: {
        		slidesToShow: 3,
        		slidesToScroll: 3
      		}
    	},
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

// $('a[href^="#"]').bind('click.smoothscroll',function (e) {
//     e.preventDefault();
//     var target = this.hash,
//         $target = $(target);

//     $('html, body').stop().animate( {
//       'scrollTop': $target.offset().top-40
//     }, 900, 'swing', function () {
//       window.location.hash = target;
//     } );
// } );