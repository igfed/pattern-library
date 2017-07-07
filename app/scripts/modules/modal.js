import * as ig from './global.js';

export default (() => {

	let directCallRule = 'modal_click';

	function init() {
	  console.log('modal init');
		$(document).on('open.zf.reveal', function () {
		  console.log('modal open');
			window._satellite = window._satellite || {};
			window._satellite.track = window._satellite.track || function(){};
			_satellite.track(directCallRule);
		});
	}

	return {
		init
	};
})()


