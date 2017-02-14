import * as ig from './global.js';

export default (() => {

  function init() {
    console.log('Accordion init!')

    // $('.help-topics-accordion').on('up.zf.accordion', function (event) {
    //   setTimeout(function () {
    //     $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
    //   }, 10); //Adjust to match slideSpeed
    // });
  }

  return {
    init
  };
})()