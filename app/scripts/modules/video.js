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
      html;

    $('.ig-video-js').each(function (index) {
      $video = $(this);

      // Capture options
      data.id = $video.data('id'); // required
      data.account = $video.data('account'); // required
      data.player = $video.data('player'); // required
      data.title = $video.data('title') ? $video.data('title'): ''; // optional
      data.description = $video.data('description') ? $video.data('description'): ''; //optional
      data.ctrl = $video.data('controls') ? 'controls': ''; // optional

      // Let's replace the ig-video 'directive' with the necessary Brightcove code
      _injectTemplate($video, data, index)



      // _displayVideo(id);

    });
  }

  function _injectTemplate($video, data, index) {
    var html = `<div class="video-container"><div class="video-container-responsive"><video data-video-id="${data.id}" data-account="${data.account}" data-player="${data.player}" data-embed="default" data-application-id="${index}" class="video-js" id="${data.id}" ${data.ctrl}></video><script src="//players.brightcove.net/${data.account}/${data.player}_default/index.min.js"></script></div></div><h2 class="video-title">${data.title}</h2><p class="video-description">${data.description}</p>`;
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