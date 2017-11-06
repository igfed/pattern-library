//Any code that involves the main navigation goes here

import * as ig from './global.js';

export default (() => {

	let searchInput = $('#site-search-q'),
		searchForm = $('#site-search'),
		hasSubNav = $('.has-subnav');

	function init(scope) {

		searchInput.focus(() => {
			searchForm.addClass('is-active');
		});
		searchInput.blur(() => {
			searchForm.removeClass('is-active');
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
