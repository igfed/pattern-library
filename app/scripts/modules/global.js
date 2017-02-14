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
  if (window.location.pathname.indexOf('/fr/') !== -1) {
    return 'fr';
  } else {
    return 'en';
  }
})()

// browser width
export var browserWidth = (() => {
  return window.outerWidth;
})()

// base eventEmitter
export var emitter = new EventEmitter();



