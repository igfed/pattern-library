//Any code that involves the main navigation goes here

import * as ig from './global.js';

export default (() => {

	let body = $('.off-canvas-content'),
		searchInput = $('#site-search-q'),
		searchForm = $('#site-search'),
		hasSubNav = $('.has-subnav'),
		inSectionNavToggle = $('.in-section-nav-toggle button'),
		inSectionNav = $('.in-section-nav-toggle');

	function init(scope) {

		searchInput.focus(() => {
			body.addClass('site-nav-search-form-is-active');
		});
		searchInput.blur(() => {
			body.removeClass('site-nav-search-form-is-active');
		});

		inSectionNavToggle.click((e) => {
			inSectionNav.toggleClass('is-active');
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
