//Any code that involves the main navigation goes here

import * as ig from './global.js';

export default (() => {

	let 
		body = $('body'),
		menuIcon = $('.menu-icon'),
		closeButton = $('.close-button-circle');

	function init(scope) {
		menuIcon.click((e) => {
			body.addClass('no-scroll');
		});	

		closeButton.click((e) => {
			body.removeClass('no-scroll');	
		});
	}

	return {
		init
	};
})()
