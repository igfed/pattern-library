const ig = (function () {
  var pathName = window.location.pathname,
    lang = _lang(),
    browserWidth = _width();

  function init() {
    // Initialize Foundation
    $(document).foundation();

    // Check for modules registered on page with 'ig-'

  }
  // Set page language
  function _lang() {
    if (pathName.indexOf('/fr/') !== -1) {
      return 'fr';
    } else {
      return 'en';
    }
  }

  // Get initial browser width
  function _width() {
    return window.outerWidth;
  }

  // Only return public methods and variables
  return {
    init,
    pathName,
    lang,
    browserWidth
  };
}());


//Accordion

// $('.help-topics-accordion').on('up.zf.accordion', function (event) {
//   setTimeout(function () {
//     $('html,body').animate({ scrollTop: $('.is-active').offset().top }, 'slow');
//   }, 10); //Adjust to match slideSpeed
// });

// Kick things off
$(document).ready(function () {
  ig.init();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vYXBwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3JlIGZyb20gJy4vc2NyaXB0cy9tb2R1bGVzL21vcmUuanMnO1xyXG5pbXBvcnQgZm9ybSBmcm9tICcuL3NjcmlwdHMvbW9kdWxlcy9mb3JtLmpzJztcclxuXHJcbmNvbnN0IGlnID0gKGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcGF0aE5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXHJcbiAgICBsYW5nID0gX2xhbmcoKSxcclxuICAgIGJyb3dzZXJXaWR0aCA9IF93aWR0aCgpO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIG1vZHVsZXMgcmVnaXN0ZXJlZCBvbiBwYWdlIHdpdGggJ2lnLSdcclxuXHJcbiAgfVxyXG4gIC8vIFNldCBwYWdlIGxhbmd1YWdlXHJcbiAgZnVuY3Rpb24gX2xhbmcoKSB7XHJcbiAgICBpZiAocGF0aE5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgICByZXR1cm4gJ2ZyJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnZW4nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGluaXRpYWwgYnJvd3NlciB3aWR0aFxyXG4gIGZ1bmN0aW9uIF93aWR0aCgpIHtcclxuICAgIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxuICB9XHJcblxyXG4gIC8vIE9ubHkgcmV0dXJuIHB1YmxpYyBtZXRob2RzIGFuZCB2YXJpYWJsZXNcclxuICByZXR1cm4ge1xyXG4gICAgaW5pdCxcclxuICAgIHBhdGhOYW1lLFxyXG4gICAgbGFuZyxcclxuICAgIGJyb3dzZXJXaWR0aFxyXG4gIH07XHJcbn0oKSk7XHJcblxyXG5cclxuLy9BY2NvcmRpb25cclxuXHJcbi8vICQoJy5oZWxwLXRvcGljcy1hY2NvcmRpb24nKS5vbigndXAuemYuYWNjb3JkaW9uJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbi8vICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuaXMtYWN0aXZlJykub2Zmc2V0KCkudG9wIH0sICdzbG93Jyk7XHJcbi8vICAgfSwgMTApOyAvL0FkanVzdCB0byBtYXRjaCBzbGlkZVNwZWVkXHJcbi8vIH0pO1xyXG5cclxuLy8gS2ljayB0aGluZ3Mgb2ZmXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBpZy5pbml0KCk7XHJcbn0pXHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLEVBQUUsSUFBSSxZQUFZO0VBQ3RCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUTtJQUNyQyxJQUFJLEdBQUcsS0FBSyxFQUFFO0lBQ2QsWUFBWSxHQUFHLE1BQU0sRUFBRSxDQUFDOztFQUUxQixTQUFTLElBQUksR0FBRzs7SUFFZCxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7Ozs7R0FJMUI7O0VBRUQsU0FBUyxLQUFLLEdBQUc7SUFDZixJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7TUFDbkMsT0FBTyxJQUFJLENBQUM7S0FDYixNQUFNO01BQ0wsT0FBTyxJQUFJLENBQUM7S0FDYjtHQUNGOzs7RUFHRCxTQUFTLE1BQU0sR0FBRztJQUNoQixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUM7R0FDMUI7OztFQUdELE9BQU87SUFDTCxJQUFJO0lBQ0osUUFBUTtJQUNSLElBQUk7SUFDSixZQUFZO0dBQ2IsQ0FBQztDQUNILEVBQUUsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUFZTCxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVk7RUFDNUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0NBQ1gsQ0FBQyxDQUFBIn0=
