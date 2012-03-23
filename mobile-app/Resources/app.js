require('lib/require_patch').monkeypatch(this);

(function() {
    var globals = require('globals');

    Titanium.App.addEventListener('resume', function() {
        globals.httpManager.setLanguage();
        globals.loginManager._checkUserState();
    });

    var onlineInterval = parseInt(globals.Database.getSetting('checkIsOnlineInterval'));
    var offlineInterval = parseInt(globals.Database.getSetting('checkIsOfflineInterval'));
    var isOnline = true;

    var onlinePoller = new globals.IntervalPoller(
        parseInt(globals.Database.getSetting('checkIsOnlineInterval')),
        function() {
            var poller = this;
            if (globals.httpManager.isOnline()) {
                if (onlineInterval !== poller.getIntervalTime()) {
                    poller.setIntervalTime(onlineInterval);
                }

                if (!isOnline) {
                    isOnline = true;
                    globals.httpManager.setLanguage(function() {
                        globals.loginManager._checkUserState();
                        Titanium.App.fireEvent('changeonlinestate', {
                            source: poller,
                            type: 'changeonlinestate',
                            isOnline: isOnline
                        });
                    });
                }
            } else {
                if (offlineInterval !== poller.getIntervalTime()) {
                    poller.setIntervalTime(offlineInterval);
                }

                if (isOnline) {
                    isOnline = false;
                    Titanium.App.fireEvent('changeonlinestate', {
                        source: poller,
                        type: 'changeonlinestate',
                        isOnline: isOnline
                    });
                }
            }
        }
    );
    
    var runApp = function() {
Ti.API.debug('RUN APP');
        var HomeScreen = require('views/home/HomeScreen').HomeScreen;
        globals.windowManager.enterWindow(new HomeScreen(globals));

        onlinePoller.start(true);
    };

    globals.httpManager.setLanguage(runApp);
    globals.loginManager._checkUserState();
})();
