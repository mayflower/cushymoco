exports.ProductVideoWindow = function(title, videoUrl) {
    var globals = require('globals');

    var videoConfig = {
        mediaControlStyle: Titanium.Media.VIDEO_CONTROL_EMBEDDED,
        mediaTypes: Titanium.Media.VIDEO_MEDIA_TYPE_VIDEO,
        scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
        autoplay: true,
        url: videoUrl
    };
    if (globals.isAndroid) {
        globals._.extend(videoConfig, {
            mediaControlStyle: Titanium.Media.VIDEO_CONTROL_DEFAULT,
            fullscreen: true
        });
    }
    var videoPlayer = Titanium.Media.createVideoPlayer(videoConfig);

    var videoWindow = null;
    if (globals.isAndroid) {
        videoWindow = videoPlayer;
    } else {
        videoWindow = Titanium.UI.createWindow({
            backgroundColor:'#000',
            title: title
        });
        videoWindow.add(videoPlayer);
    }

    return videoWindow;
};
