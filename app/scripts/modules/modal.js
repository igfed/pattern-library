import * as ig from './global.js';

export default (() => {

	let directCallRule = 'modal_click';

	function init() {
		$(document).on('open.zf.reveal', function () {
			window._satellite = window._satellite || {};
			window._satellite.track = window._satellite.track || function(){};
			_satellite.track(directCallRule);
		});
	}

	return {
		init
	};
})()