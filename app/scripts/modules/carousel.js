import * as ig from './global.js';

export default (() => {

  function init() {
    console.log('Carousel Initialized!')

    _buildCarousel();
  }

  function _buildCarousel() {
    var responsive = {},
      prevArrow,
      nextArrow,
      $carousel = $('.ig-carousel');

    if ($carousel.data('responsive')) {

    }
    prevArrow = ($carousel.data('prevArrowText')) ? '<button type="button" class="slick-prev"><span class="show-for-sr">' + $carousel.data('prevArrowText') + '</span></button>': '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>';
    nextArrow = ($carousel.data('nextArrowText')) ? '<button type="button" class="slick-prev"><span class="show-for-sr">' + $carousel.data('nextArrowText') + '</span></button>': '<button type="button" class="slick-prev"><span class="show-for-sr">Next</span></button>';

    $('.ig-carousel').slick({
      adaptiveHeight: $carousel.data('adaptiveHeight') || false,
      arrows: $carousel.data('arrows') || true,
      autoPlay: $carousel.data('autoPlay') || false,
      dots: $carousel.data('dots') || false,
      fade: $carousel.data('fade') || false,
      infinite: $carousel.data('infinite') || false,
      mobileFirst: $carousel.data('mobileFirst') || false,
      nextArrow: nextArrow,
      prevArrow: prevArrow,
      responsive: responsive,
      slide: $carousel.data('slide') || '',
      slidesToScroll: $carousel.data('slidesToScroll') || 1,
      slidesToShow: $carousel.data('slidesToShow') || 1,
      speed: $carousel.data('speed') || 300,
    })

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
//     mobileFirst: truex,
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

// });