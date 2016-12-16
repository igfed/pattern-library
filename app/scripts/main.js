$(function(){
	$(document).foundation();
	$('[data-responsive-toggle]').on('click', function(){
		$('body').toggleClass('site-header-is-active');
	});
});

$("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});