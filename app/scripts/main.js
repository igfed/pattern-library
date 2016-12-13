$(function(){
	$(document).foundation();
	$('[data-responsive-toggle]').on('click', function(){
		$('body').toggleClass('site-header-is-active');
	});
});