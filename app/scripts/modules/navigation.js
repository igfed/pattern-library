//Any code that involves the main navigation goes here

import * as ig from './global.js';

export default (() => {

	let 
		body = $('body'),
		menuIcon = $('.menu-icon'),
		closeButton = $('.close-button-circle'),
		showForLarge = $('.show-for-large'),
		searchInput = $('#site-search-q'),
		hasSubNav = $('.has-subnav');

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

		hasSubNav.click((e) => {
			let snTarget = $(e.currentTarget);
			if( snTarget.hasClass("active") ) {
				//deactivate
				snTarget.removeClass('active');
			} else {
				//activate
				snTarget.addClass('active');
			}
		});
	}

	return {
		init
	};
})()
