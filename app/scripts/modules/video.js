import * as ig from './global.js';

export default (() => {

    var vids = [], players = [], brightCove;

    function init() {
        _parseVideos();

        // Make sure the VideoJS method is available and fire ready event handlers if so
        brightCove = setInterval(function () {
            if ($('.vjs-plugins-ready').length) {
                _brightCoveReady();
                clearInterval(brightCove);
            }
        }, 500)

        $(window).scroll(function () {
            vids.forEach(function (el) {
                console.log($('#' + el).visible());
            })
        });
    }

    function _parseVideos() {
        var $group,
            $video,
            data = {},
            preloadOptions = ['auto', 'metadata', 'none']

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

                // Capture options (required)
                data.id = $video.data('id');

                // Capture options (optional)
                data.title = $video.data('title') ? $video.data('title') : '';
                data.description = $video.data('description') ? $video.data('description') : '';
                data.auto = $video.data('autoplay') ? 'autoplay' : '';
                data.ctrl = $video.data('controls') ? 'controls' : '';
                data.preload = (preloadOptions.indexOf($video.data('preload')) > -1) ? $video.data('preload') : 'auto';
                data.transcript = $video.data('transcript') ? $video.data('transcript') : '';

                // Store ID's for all video's on the page - in case we want to run a post-load process on each
                vids.push(data.id);

                // Let's replace the ig-video-js 'directive' with the necessary Brightcove code
                _injectTemplate($video, data, index)
            });

        })
    }

    function _injectBrightCoveJS(data) {
        var indexjs = `<script src="//players.brightcove.net/${data.account}/${data.player}_default/index.min.js"></script>`;
        $('body').append(indexjs);
    }

    function _injectTemplate($video, data, index) {
        var html = `<div class="video-container"><span class="video-overlay ${data.id}"></span><div class="video-container-responsive"><video data-setup='{"techOrder": ["html5"]}' data-video-id="${data.id}" preload="${data.preload}" data-account="${data.account}" data-player="${data.player}" data-embed="default" data-application-id="${index}" class="video-js" id="${data.id}" ${data.ctrl} ${data.auto}></video></div>`
        if (data.transcript.length > 0) {
            html += `<div class="video-transcript"><a target="_blank" href="${data.transcript}">Transcript</a></div>`;
        }
        html += `</div><h2 class="video-title">${data.title}</h2><p class="video-description">${data.description}</p>`;
        $video.replaceWith(html);
    }

    function _brightCoveReady() {
        var player;
        vids.forEach(function (el) {
            videojs('#' + el).ready(function () {
                // assign this player to a variable
                player = this;
                // assign an event listener for play event
                player.on('play', _onPlay);
                // push the player to the players array
                players.push(player);
            });
        })
    }

    function _onPlay(e) {
        // determine which player the event is coming from
        var id = e.target.id;
        // go through the array of players
        for (var i = 0; i < players.length; i++) {
            // get the player(s) that did not trigger the play event
            if (players[i].id() !== id) {
                // pause the other player(s)
                videojs(players[i].id()).pause();
            }
        }
    }

    return {
        init
    };
})()