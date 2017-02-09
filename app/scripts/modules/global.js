// url path
export const path = (() => {
  return window.location.pathname;
})()

// language
export const lang = (() => {
  if (window.location.pathname.indexOf('/fr/') !== -1) {
    return 'fr';
  } else {
    return 'en';
  }
})()

// browser width
export const browserWidth = (() => {
  return window.outerWidth;
})()



