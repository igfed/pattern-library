import * as ig from './global.js';

export default (() => {

  var a;

  function init() {

    _parseVideoComponents();
  }

  function _parseVideoComponents() {
    var $video,
      data = {},
      id,
      account,
      player,
      html,
      preloadOptions = ['auto', 'metadata', 'none']

    $('.ig-video-js').each(function (index) {
      $video = $(this);

      // Capture options (required)
      data.id = $video.data('id');
      data.account = $video.data('account');
      data.player = $video.data('player');

      // Capture options (optional)
      data.title = $video.data('title') ? $video.data('title'): '';
      data.description = $video.data('description') ? $video.data('description'): '';
      data.auto = $video.data('autoplay') ? 'autoplay': '';
      data.ctrl = $video.data('controls') ? 'controls': '';
      data.preload = (preloadOptions.indexOf($video.data('preload')) > -1) ? $video.data('preload'): 'auto';

      // Let's replace the ig-video 'directive' with the necessary Brightcove code
      _injectTemplate($video, data, index)



      // _displayVideo(id);

    });
  }

  function _injectTemplate($video, data, index) {
    var html = `<div class="video-container"><span class="video-overlay"></span><div class="video-container-responsive"><video data-video-id="${data.id}" preload="${data.preload}" data-account="${data.account}" data-player="${data.player}" data-embed="default" data-application-id="${index}" class="video-js" id="${data.id}" ${data.ctrl} ${data.auto}></video><script src="//players.brightcove.net/${data.account}/${data.player}_default/index.min.js"></script></div></div><h2 class="video-title">${data.title}</h2><p class="video-description">${data.description}</p>`;
    $video.replaceWith(html);
  }

  function _displayVideo(id) {
    videojs(id).ready(function () {
      $('#' + id).css({ 'display': 'none' });

    });

  }


  return {
    init
  };
})()