import * as ig from './global.js';

export default (() => {

	function init() {
		$(document).on('open.zf.reveal', function () {
		  ig.track('modal_click');
		});
	}

	return {
		init
	};
})()


