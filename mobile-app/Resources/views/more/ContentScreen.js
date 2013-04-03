exports.ContentScreen = function(methode, title, returnView) {
    var globals = require('globals');

    var contentView = Titanium.UI.createWebView({
        backgroundColor: '#FFF',
        enableZoomControls: false
    });
    
    globals.httpManager.request(
        globals.httpManager.buildUrl({ fnc: methode }),
        function() {
            var response = JSON.parse(this.responseText);
            if (response.result) {
                contentView.html = response.result;
            }
        }
    );
    
    if (returnView) {
        return contentView;
    }

    var window = null;
    if (globals.isAndroid) {
        window = Titanium.UI.createView();
    } else {
        window = Titanium.UI.createWindow({ title: title });
    }

    window.add(contentView);
    return window;
};