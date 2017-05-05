import * as ig from './global.js';

export default (() => {

  var videoIDs = [],
    players = [],
    brightCove;

  function init() {
    // We need to capture the video player settings defined in the HTML and create the markup that Brightcove requires
    _parseVideos();

    // Make sure the VideoJS method is available and fire ready event handlers
    brightCove = setInterval(function () {
      if ($('.vjs-plugins-ready').length) {
        _brightCoveReady();
        clearInterval(brightCove);
      }
    }, 500);

    // Function for checking if video's have scrolled off screen and need to be paused
    _viewStatus();

  }

  function _parseVideos() {
    var $group,
      $video,
      data = {},
      preloadOptions = ['auto', 'metadata', 'none'];

    // Each group can effectively use a different player which will only be loaded once
    $('.ig-video-group').each(function () {
      $group = $(this);
      data.account = $group.data('account');
      data.player = $group.data('player');

      // Load required JS for a player
      _injectBrightCoveJS(data);

      // Loop through video's
      $group.find('.ig-video-js').each(function (index) {
        $video = $(this);

        // Capture required options
        data.id = $video.data('id');

        // Capture options that are optional
        data.overlay = $video.data('overlay')
          ? $video.data('overlay')
          : '';
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data(
          'description') : '';
        data.auto = $video.data('autoplay') ? 'autoplay' : '';
        data.ctrl = $video.data('controls') ? 'controls' : '';
        data.preload = (preloadOptions.indexOf($video.data('preload')) > -1) ? $video.data('preload') : 'auto';
        data.transcript = $video.data('transcript') ? $video.data(
          'transcript') : '';
        data.ctaTemplate = $video.data('ctaTemplate') ? $video.data(
          'ctaTemplate') : '';

        // Store ID's for all video's on the page - in case we want to run a post-load process on each
        videoIDs.push(data.id);

        // Let's replace the ig-video-js 'directive' with the necessary Brightcove code
        _injectTemplate($video, data, index);
      });

    });
  }

  function _injectBrightCoveJS(data) {
    var indexjs = `<script src="//players.brightcove.net/${data.account}/${data.player}_default/index.min.js"></script>`;
    $('body').append(indexjs);
  }

  function _injectTemplate($video, data, index) {
    var transcriptText = { 'en': 'Transcript', 'fr': 'Transcription' },
      html = `<div class="video-container ${data.id}"><div class="video-container-responsive">`;

    if (data.ctaTemplate.length > 0) {
      html += `<span class="video-cta">${data.ctaTemplate}</span>`;
    }
    if (data.overlay.length > 0) {
      html += `<span class="video-overlay" style="background-image: url('${data.overlay}');"></span>`;
    }
    html += `<video data-setup='{"techOrder": ["html5"]}' data-video-id="${data.id}" preload="${data.preload}" data-account="${data.account}" data-player="${data.player}" data-embed="default" data-application-id="${index}" class="video-js" id="${data.id}" ${data.ctrl} ${data.auto}></video></div>`;
    if (data.transcript.length > 0) {
      html += `<div class="video-transcript"><a target="_blank" href="${data.transcript}">${transcriptText[ig.lang]}</a></div>`;
    }
    html += `</div><h2 class="video-title">${data.title}</h2><p class="video-description">${data.description}</p>`;
    $video = $video.replaceWith(html);

    if (data.overlay) {
      $(document).on('click', '#' + data.id, function () {
        $(this).siblings('.video-overlay').hide();
      });
    }
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
    $('.' + e.target.id).addClass('complete');
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

  return {
    init,
  };
})();