var _ = require('lib/underscore')._;
IntervalPoller = require('lib/IntervalPoller').IntervalPoller;

var globalExports = {
    _: _,
    Database: null,
    IntervalPoller: IntervalPoller,
    isAndroid: (Titanium.Platform.osname=='android'),
    isIPhone: (Titanium.Platform.osname=='iphone'),
    isIPad: (Titanium.Platform.osname=='ipad'),
    screenWidth: ((Titanium.Platform.displayCaps.platformWidth > Titanium.Platform.displayCaps.platformHeight) ? Titanium.Platform.displayCaps.platformHeight : Titanium.Platform.displayCaps.platformWidth),
    screenHeight: ((Titanium.Platform.displayCaps.platformWidth > Titanium.Platform.displayCaps.platformHeight) ? Titanium.Platform.displayCaps.platformWidth : Titanium.Platform.displayCaps.platformHeight),
    getTabIconForDevice: function(normalIcon, smallIcon) {
        if (!globalExports.isAndroid || (globalExports.isAndroid && 480 > Titanium.Platform.displayCaps.platformWidth)) {
            return smallIcon;
        }
        return normalIcon;
    },
    parseBoolean: function(value) {
        var result = false;
        if ('string' === typeof(value) && ('true' === value.toLowerCase() || '1' === value)) {
            result = true;
        }
        return result;
    },
    loginManager: {
        _loginWindow: null,
        openLoginWindow: function() {
            if (globalExports.loginManager.isUserLoggedIn()) {
                var dialog = Titanium.UI.createAlertDialog({
                    message: L('confirm_logout'),
                    buttonNames: [L('logout_button'), L('cancel_button')],
                    cancel: 1
                });
                dialog.addEventListener('click', function(e) {
                    // Workaround for iOS where e.cancel is always true (BUG!)
                    if (!e.cancel || (!globalExports.isAndroid && e.source.cancel !== e.index)) {
                        globalExports.Database.setSetting('loginname', null);
                        globalExports.Database.setSetting('session', null);
                        globalExports.Database.setSetting('cookie', null);
                        globalExports.Database.setSetting('username', null);
                        globalExports.Database.setSetting('firstname', null);
                        globalExports.Database.setSetting('lastname', null);
                        globalExports.Database.setSetting('employee_firstname', null);
                        globalExports.Database.setSetting('employee_lastname', null);
                        globalExports.Database.setSetting('employee_phone1', null);
                        globalExports.Database.setSetting('employee_phone2', null);
                        globalExports.Database.setSetting('employee_skype', null);
                        globalExports.Database.setSetting('employee_email', null);
                        Titanium.App.fireEvent('updateUserState', { source: dialog, type: 'updateUserState'});
                        globalExports.httpManager.request(
                            globalExports.httpManager.buildUrl({ fnc: 'logout' })
                        );
                    }
                });
                dialog.show();
            } else {
                if (null === globalExports.loginManager._loginWindow) {
                    var LoginScreen = require('views/LoginScreen').LoginScreen;
                    globalExports.loginManager._loginWindow = new LoginScreen();
                }
                globalExports.windowManager.enterWindow(globalExports.loginManager._loginWindow);
            }
        },
        isUserLoggedIn: function() { return (null !== globalExports.Database.getSetting('session')); },
        _checkUserState: function() {
            if (globalExports.loginManager.isUserLoggedIn()) {
                globalExports.httpManager.request(
                    globalExports.httpManager.buildUrl({ fnc: 'getUserData' }),
                    function() {
                        var response = JSON.parse(this.responseText);
                        if (response.error) {
                            globalExports.Database.setSetting('username', null);
                            globalExports.Database.setSetting('session', null);
                            globalExports.Database.setSetting('cookie', null);
                            Titanium.App.fireEvent('updateUserState', { source: this, type: 'updateUserState'});
                        }
                    }
                );
            }
        }
    },
    windowManager: {
        _windows: [],
        _loadingDialog: null,
        _loadingDialogTimeout: null,
        addMenuToWindow: function(window) {
            if (globalExports.isAndroid) {
                window.activity.onCreateOptionsMenu = function(e) {
                    var isUserLoggedIn = globalExports.loginManager.isUserLoggedIn();
                    var menu = e.menu;

                    var menuItem = menu.add({ itemId: 0, title: isUserLoggedIn ? L('logout_button') : L('login_button') });
                    menuItem.setIcon("icons/login.png");
                    menuItem.addEventListener('click', globalExports.loginManager.openLoginWindow);
                };

                window.activity.onPrepareOptionsMenu = function(e) {
                    var isUserLoggedIn = globalExports.loginManager.isUserLoggedIn();
                    var menu = e.menu;

                    _.each(menu.getItems(), function(menuItem) {
                        switch(menuItem.itemId) {
                            case 0:
                                menuItem.setTitle(isUserLoggedIn ? L('logout_button') : L('login_button'));
                                break;
                        }
                    });
                };
            }
        },
        _getLoadingDialog: function() {
            if (null === globalExports.windowManager._loadingDialog) {
                var activityIndicator = Titanium.UI.createActivityIndicator({
                    height: 50,
                    width: globalExports.isAndroid ? (globalExports.screenWidth * 0.9) : (globalExports.screenWidth * 0.65625),
                    color: globalExports.isAndroid ? '#404347' : '#FFF',
                    font: {
                        fontSize: 14,
                        fontWeight: 'normal'
                    },
                    messageid: 'loading_message',
                    style: globalExports.isAndroid ? null : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
                });
                if (globalExports.isAndroid) {
                    globalExports.windowManager._loadingDialog = activityIndicator;
                } else {
                    var activityView = Titanium.UI.createView({
                        backgroundColor: '#000',
                        opacity: 0.9,
                        borderRadius: 10,
                        height: 'auto',
                        width: 'auto'
                    });
                    activityView.hide();
                    activityView.add(activityIndicator);
                    activityIndicator.show();
                    globalExports.windowManager._loadingDialog = activityView;
                    this._windows[0].add(globalExports.windowManager._getLoadingDialog());
                }
            }
            return globalExports.windowManager._loadingDialog;
        },
        showLoadingDialog: function() {
            if (null === globalExports.windowManager._loadingDialogTimeout) {
                globalExports.windowManager._loadingDialogTimeout = setTimeout(function() {
                    globalExports.windowManager._getLoadingDialog().show();
                    globalExports.windowManager._loadingDialogTimeout = null;
                }, parseInt(globalExports.Database.getSetting('loadingDialogTimeout'), 10));
            }
        },
        hideLoadingDialog: function() {
            if (null !== globalExports.windowManager._loadingDialogTimeout) {
                clearTimeout(globalExports.windowManager._loadingDialogTimeout);
                globalExports.windowManager._loadingDialogTimeout = null;
            }

            if (null !== globalExports.windowManager._loadingDialog) {
                globalExports.windowManager._getLoadingDialog().hide();
            }
        },
        enterWindow: function(window) {
            this._windows.push(window);

            var _that = this;
            window.addEventListener('close', function(e) {
                var index = _that._windows.indexOf(e.source);
                if (-1 !== index) {
                    _that._windows.splice(index, 1);
                }
            });
            window.open({ fullscreen: (globalExports.isAndroid) ? true : false });
        },
        leaveCurrentWindow: function() {
            var _that = this;
            if (1 === this._windows.length) {
                var dialog = Titanium.UI.createAlertDialog({
                    messageid: 'confirm_close_app',
                    buttonNames: [L('close_button'), L('cancel_button')],
                    cancel: 1
                });
                dialog.addEventListener('click', function(e) {
                    if (!e.cancel) {
                        _that._windows.pop().close();
                    }
                });
                dialog.show();
            } else {
                this._windows.pop().close();
            }
        },
        getCurrentWindow: function() {
            return this._windows[this._windows.length - 1];
        }
    },
    tabWindowManager: function(outerWindow, rootWindow) {
        globalExports.windowManager.addMenuToWindow(outerWindow);
        this._outerWindow = outerWindow;
        this._events = [];

        if (undefined === rootWindow || null === rootWindow) {
            this._windows = [];
            this._activeWindow = -1;
        } else {
            this._windows = [rootWindow];
            this._activeWindow = 0;
        }

        var _that = this;
        outerWindow.addEventListener('android:back', function() {
            _that.close.call(_that);
        });
    },
    httpManager: {
        isOnline: function() { return !(Titanium.Network.networkType === Titanium.Network.NETWORK_NONE); },
        setLanguage: function(callback) {
            var callCallback = function() {
                if ('function' === typeof callback) {
                    callback();
                }
            };

            globalExports.httpManager.request(
                globalExports.httpManager.buildUrl({ fnc: 'setLanguage', device_language: Titanium.Locale.getCurrentLanguage() }),
                callCallback,
                callCallback
            );
        },
        buildUrl: function(params) {
            var urlParams = params || {};
            var url = globalExports.Database.getSetting('baseUrl');
            _.each(urlParams, function(value, key) {
                if (-1 === url.indexOf('?')) {
                    url += '?';
                } else {
                    url += '&';
                }
                url += key + '=' + value;
            });
            return url;
        },
        _saveCookie: function(cookieString) {
            var cookieStringRegEx = /(\w+)=([^;]+)/gi;
            var cookieRegEx = /(\w+)=([^;]+)/i;

            var cookies = {};
            _.each(cookieString.match(cookieStringRegEx), function(cookie) {
                var parsedCookie = cookie.match(cookieRegEx);

                var name = parsedCookie[1];
                var value = parsedCookie[2];

                if (['path', 'oxid_1', 'expires'].every(function(el) { return name.toLocaleLowerCase() !== el;})) {
                    cookies[name] = value;
                }
            });

            var settingCookie = globalExports.Database.getSetting('cookie');
            if (settingCookie) {
                settingCookie = JSON.parse(settingCookie);
            } else {
                settingCookie = {};
            }

            _.extend(settingCookie, cookies);
            globalExports.Database.setSetting('cookie', JSON.stringify(settingCookie));
        },
        _getCookie: function() {
            var settingCookie = globalExports.Database.getSetting('cookie');
            if (settingCookie) {
                settingCookie = JSON.parse(settingCookie);

                var cookie = globalExports.isAndroid ? '' : [];
                _.each(settingCookie, function(value, name) {
                    if (globalExports.isAndroid) {
                        if ('' != cookie) {
                            cookie += '; ';
                        }
                        cookie += name + '=' + value;
                    } else {
                        cookie.push(name + '=' + value);
                    }
                });

                if (globalExports.isAndroid) {
                    if ('' != cookie) {
                        return cookie;
                    }
                } else {
                    if (0 !== cookie.length) {
                        return cookie;
                    }
                }
            }
            return null;
        },
        request: function(url, successCallback, errorCallback) {
            if (!globalExports.httpManager.isOnline()) {
                if (undefined !== errorCallback && null !== errorCallback) {
                    errorCallback.call(this, { error: 'not online', isOffline: true });
                }
                return;
            }

            var client = Titanium.Network.createHTTPClient({
                timeout : parseInt(globalExports.Database.getSetting('networkTimeout'), 10),
                onload: function(e) {
                    globalExports.windowManager.hideLoadingDialog();
                    globalExports.httpManager._saveCookie(this.getResponseHeader('Set-Cookie'));

                    if ('function' === typeof successCallback) {
                        successCallback.call(this, e)
                    }
                    delete(client);
                },
                onerror: function(e) {
                    globalExports.windowManager.hideLoadingDialog();

                    if ('function' === typeof errorCallback) {
                        errorCallback.call(this, e);
                    } else {
                        alert(L('network_error'));
                    }
                    delete(client);
                }
            });

            globalExports.windowManager.showLoadingDialog();
Ti.API.debug('REQUEST: ' + url);
            client.open('GET', url);
            var cookie = globalExports.httpManager._getCookie();
            if (cookie) {
                if (globalExports.isAndroid) {
                    client.setRequestHeader('Cookie', cookie);
                } else {
                    _.each(cookie, function(c) {
                        client.setRequestHeader('Cookie', c);
                    });
                }
            }
            client.send();
        }
    }
};

globalExports.tabWindowManager.prototype.open = function(newWindow) {
    if (-1 !== this._activeWindow) {
        var oldWindow = this._windows[this._activeWindow];
        this.fireEvent('change', { source: oldWindow, target: newWindow });
        oldWindow.hide();
    }

    var newWindowIndex = this._windows.indexOf(newWindow);
    if (-1 === newWindowIndex) {
        this._windows.push(newWindow);
        this._activeWindow = (this._windows.length - 1);

        this._outerWindow.add(newWindow);
    } else {
        this._activeWindow = newWindowIndex;
        newWindow.show();
    }
};

globalExports.tabWindowManager.prototype.close = function(window) {
    if (1 === this._windows.length || 0 === this._activeWindow) {
        globalExports.windowManager.leaveCurrentWindow();
        return;
    }

    var oldIndex = this._activeWindow;
    if (undefined !== window && null !== window) {
        oldIndex = this._windows.indexOf(window);
        if (-1 === oldIndex) {
            return;
        }
    }

    var oldWindow = this._windows[oldIndex];
    var oldActiveWindow = this._activeWindow--;

    if (oldIndex == oldActiveWindow) {
        var newWindow = this._windows[this._activeWindow];
        this.fireEvent('change', { source: oldWindow, target: newWindow }, this);

        newWindow.show();
    }

    this._outerWindow.remove(oldWindow);
    this._windows.splice(oldIndex, 1);

    delete(oldWindow);
    delete(window);
};

globalExports.tabWindowManager.prototype.addEventListener = function(name, callback) {
    if (undefined === this._events[name]) {
        this._events[name] = [callback];
    } else {
        this._events[name].push(callback);
    }
};

globalExports.tabWindowManager.prototype.removeEventListener = function(name, callback) {
    if (undefined !== this._events[name]) {
        if (undefined === callback || null === callback) {
            this._events[name].splice(0, this._events[name].length);
        } else {
            var index = this._events[name].indexOf(callback);
            if (-1 !== index) {
                this._events[name].splice(index, 1);
            }
        }
    }
};

globalExports.tabWindowManager.prototype.fireEvent = function(name, event, context) {
    if (undefined !== this._events[name]) {
        var _that = context || this;
        _.each(this._events[name], function(callback) {
            callback.call(_that, event);
        });
    }
};

globalExports.tabWindowManager.prototype.getOuterWindow = function() {
    return this._outerWindow;
};

var Database = require('Database').Database;
globalExports.Database = new Database(globalExports);
_.extend(exports, globalExports);
