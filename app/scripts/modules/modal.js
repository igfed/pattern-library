import * as ig from './global.js';

export default (() => {

	let directCallRule = 'modal_click';

	function init() {
		$(document).on('open.zf.reveal', function () {
			_satellite.track(directCallRule);
		});
	}

	return {
		init
	};
})()