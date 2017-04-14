//Any code that involves the main navigation goes here

import * as ig from './global.js';

export default (() => {

	let 
		body = $('body'),
		menuIcon = $('.menu-icon'),
		closeButton = $('.close-button-circle'),
		showForLarge = $('.show-for-large'),
		searchInput = $('#site-search-q');

	function init(scope) {
		menuIcon.click((e) => {
			body.addClass('no-scroll');
		});	

		closeButton.click((e) => {
			body.removeClass('no-scroll');	
		});

		showForLarge.click((e) => {
			searchInput.focus();
		});
	}

	return {
		init
	};
})()
