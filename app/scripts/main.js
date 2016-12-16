$(function(){
	$(document).foundation();
	$('[data-responsive-toggle]').on('click', function(){
		$('body').toggleClass('site-header-is-active');
	});
});

$('a[href^="#"]').bind('click.smoothscroll',function (e) {
    e.preventDefault();
    var target = this.hash,
        $target = $(target);

    $('html, body').stop().animate( {
      'scrollTop': $target.offset().top-40
    }, 900, 'swing', function () {
      window.location.hash = target;
    } );
} );