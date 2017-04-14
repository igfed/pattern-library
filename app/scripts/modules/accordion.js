import * as ig from './global.js';

export default (() => {

	let sectionTitle = $('.accordion-menu-section-title');

	function init() {
		sectionTitle.click((e) => {
			try {
				//IE fix
				e.returnValue = false;
			} catch(err) { console.warn('event.returnValue not available')}
			
			e.preventDefault();
		});
	}

	return {
		init
	};
})()