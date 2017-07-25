/* This file is for methods and variables that are going to be
 useful across all modules. In order to use them anywhere, import with:

 import * as ig from './global.js';

 and then call with the ig namespace (i.e., ig.pathname, ig.lang, etc)
 */

// url path
export var pathname = (() => {
  return window.location.pathname;
})()

// language
export var lang = (() => {
  if (window.location.pathname.indexOf('/fr.') !== -1 || window.location.pathname.indexOf('/fr/') !== -1) {
    return 'fr';
  } else {
    return 'en';
  }
})()

// browser width
export var browserWidth = (() => {
  return window.outerWidth;
})()

// check for IE (pre Edge)
export var oldIE = (() => {
  if ("ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
})()

export var track = ((dcrName) => {
  window._satellite = window._satellite || {};
  window._satellite.track = window._satellite.track || function(){};
  _satellite.track(dcrName);
})()

// base eventEmitter
// export var emitter = new EventEmitter();

export var debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
