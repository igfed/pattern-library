import * as ig from './global.js';

export default (() => {

  function init() {
    console.log('Carousel init!')
    // console.log('This is a shared variable, ig.width:' + ig.browserWidth);
  }

  return {
    init
  };
})()

//Carousel
// $(function () {
//   $('[data-responsive-toggle] button').on('click', function () {
//     $('body').toggleClass('site-header-is-active');
//   });
//   $('.text-carousel').slick({
//     dots: true,
//     speed: 300,
//     infinite: true,
//     mobileFirst: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
//     nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>'
//   });
//   $('.carousel').slick({
//     dots: true,
//     infinite: true,
//     speed: 300,
//     mobileFirst: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
//     nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
//     responsive: [
//       {
//         breakpoint: 640,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2
//         }
//       }
//     ]
//   });
//   $('.homepage-carousel').slick({
//     dots: true,
//     infinite: true,
//     speed: 500,
//     mobileFirst: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     prevArrow: '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',
//     nextArrow: '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',
//     responsive: [
//       {
//         breakpoint: 640,
//         settings: {
//           fade: true,
//         }
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           arrows: true,
//           fade: true,
//         }
//       }
//     ]
//   });
//
//   $('.js-open-socialdrawer').click(function () {
//     // this.next() selects next sibling element
//     // any suggestions on a better way to do this?
//     var jsSocialDrawer = $(this).next();
//
//     if (jsSocialDrawer.hasClass('js-socialdrawer-opened')) {
//       jsSocialDrawer.removeClass('js-socialdrawer-opened');
//     } else {
//       jsSocialDrawer.addClass('js-socialdrawer-opened');
//     }
//   });
// });