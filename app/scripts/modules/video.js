import * as ig from './global.js';

export default ((window) => {

  var videoIDs = [],
    players = [],
    brightCove,
    $video;

  function init() {
    _parseVideos();

    if (!ig.oldIE) {

      // Make sure the VideoJS method is available and fire ready event handlers
      brightCove = setInterval(function () {
        if ($('.vjs-plugins-ready').length) {
          _brightCoveReady();
          clearInterval(brightCove);
        }
      }, 500);

      // Function for checking if video'cs have scrolled off screen and need to be paused
      _viewStatus();

    }
  }

  function _parseVideos() {
    var $group,
      data = {},
      preloadOptions = ['auto', 'metadata', 'none'];

    // Each group can effectively use a different player which will only be loaded once
    $('.ig-video-group').each(function () {
      $group = $(this);
      data.player = $group.data('player');

      // Loop through video's
      $group.find('.ig-video-js').each(function (index) {
        $video = $(this);

        data.id = $video.data('id');
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data('description') : '';

        if (ig.oldIE) {

          _injectIframe(data, $video);

        } else {

          // Capture options that are used with modern browsers
          data.overlay = $video.data('overlay') ?
            $video.data('overlay') :
            '';
          data.auto = $video.data('autoplay') ? 'autoplay' : '';
          data.preload = (preloadOptions.indexOf($video.data('preload')) > -1) ? $video.data('preload') : 'auto';
          data.transcript = $video.data('transcript') ? $video.data(
            'transcript') : '';
          data.ctaTemplate = $video.data('ctaTemplate') ? $video.data(
            'ctaTemplate') : '';

          // Store ID's for all video's on the page - in case we want to run a post-load process on each
          // The check for an id already being stored is necessary for video's in a Slick carousel
          if (videoIDs.indexOf(data.id) === -1) {
            videoIDs.push(data.id);
          }

          // Let's replace the ig-video-js 'directive' with the necessary Brightcove code
          _injectTemplate(data, index);
        }
      });

      // Only inject Brightcove JS if modern browser
      if (!ig.oldIE) {
        injectBrightCoveJS(data);
      }
    });

  }

  function _injectTemplate(data, index) {
    var transcriptText = {
        'en': 'Transcript',
        'fr': 'Transcription'
      },
      html = `<div class="video-container ${data.id}"><div class="video-container-responsive">`;

    if (data.ctaTemplate.length > 0) {
      html += `<span class="video-cta">${data.ctaTemplate}</span>`;
    }
    if (data.overlay.length > 0) {
      html += `<span class="video-overlay" style="background-image: url('${data.overlay}');"></span>`;
    }
    html += `<video data-setup='{"techOrder": ["html5"]}' data-video-id="${data.id}" preload="${data.preload}" data-account="3906942861001" data-player="${data.player}" data-embed="default" data-application-id="${index}" class="video-js" id="${data.id}" controls ${data.auto}></video></div>`;
    if (data.transcript.length > 0) {
      html += `<div class="video-transcript"><a target="_blank" href="${data.transcript}">${transcriptText[ig.lang]}</a></div>`;
    }
    html += `</div><h2 class="video-title ${data.id}">${data.title}</h2><p class="video-description">${data.description}</p>`;
    $video = $video.replaceWith(html);

    if (data.overlay) {
      $(document).on('click', '#' + data.id, function () {
        $(this).siblings('.video-overlay').hide();
      });
    }
  }

  function _injectIframe(data) {
    var html = `<div class="video-container">
      <div class="video-container-responsive">
      <iframe class="video-js" src='//players.brightcove.net/3906942861001/${data.player}_default/index.html?videoId=${data.id}'
    allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
    </div>
    </div><h2 class="video-title ${data.id}">${data.title}</h2><p class="video-description">${data.description}</p>`;
    $video = $video.replaceWith(html);
  }

  function injectBrightCoveJS(data) {
    var indexjs = `<script src="//players.brightcove.net/3906942861001/${data.player}_default/index.min.js"></script>`;
    $('body').append(indexjs);
  }

  function _brightCoveReady() {
    var player;
    videoIDs.forEach(function (el) {
      videojs('#' + el).ready(function () {
        // assign this player to a variable
        player = this;
        // assign an event listener for play event
        player.on('play', _onPlay);
        // assign an event listener for ended event
        player.on('ended', _onComplete);
        // push the player to the players array
        players.push(player);
      });
    });
  }

  function _onPlay(e) {
    // Adobe Analytics
    if (!$('.' + e.target.id).hasClass('played')) {
      $('.' + e.target.id).addClass('played');
      window.digitalData.event.id = e.target.id;
      window.digitalData.event.title = _retrieveTitle(e.target.id);
      _satellite.track('video_start');
    }

    // determine which player the event is coming from
    var id = e.target.id;
    // go through players
    players.forEach(function (player) {
      if (player.id() !== id) {
        // pause the other player(s)
        videojs(player.id()).pause();
      }
    });
  }

  function _onComplete(e) {
    // Adobe Analytics
    $('.' + e.target.id).addClass('complete');
    window.digitalData.event.id = e.target.id;
    window.digitalData.event.title = _retrieveTitle(e.target.id);
    _satellite.track('video_end');
  }

  function _viewStatus() {
    $(window).scroll(function () {
      players.forEach(function (player) {
        if (!$('#' + player.id()).visible()) {
          videojs(player.id()).pause();
        }
      });
    });
  }

  function _retrieveTitle(id) {
    return $('.video-title.' + id).first().text();
  }

  return {
    init
  };
})(window);
