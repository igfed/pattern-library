import * as ig from './global.js';

export default (() => {

	function init() {
		$(document).on('open.zf.reveal', function () {
      _satellite.track('modal_click');
		});
	}

	return {
		init
	};
})()


