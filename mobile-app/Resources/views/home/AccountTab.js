exports.AccountTab = function() {
    var globals = require('globals');
    var AccountScreen = require('views/account/AccountScreen').AccountScreen;
    var LoginScreen = require('views/LoginScreen').LoginScreen;

    /**
     * Create "account" tab and window
     */
    var outerWindow = Titanium.UI.createWindow({
        navBarHidden: true,
        backgroundColor: '#FFF'
    });

    var nav = null;
    var accountView = null;
    var loginView = null;
    if (globals.isAndroid) {
        nav = new globals.tabWindowManager(outerWindow);
        accountView = new AccountScreen(nav);
        loginView = new LoginScreen(nav);
        nav.open(globals.loginManager.isUserLoggedIn() ? accountView : loginView);
    } else {
        nav = Titanium.UI.iPhone.createNavigationGroup();
        accountView = new AccountScreen(nav);
        loginView = new LoginScreen(nav);
        nav.window = globals.loginManager.isUserLoggedIn() ? accountView : loginView;
        outerWindow.add(nav);
    }

    var tab = Titanium.UI.createTab({
        icon: globals.getTabIconForDevice('icons/user.png', 'icons/user_small.png'),
        titleid: 'account_tab_title',
        window: outerWindow,
        disabled: !globals.httpManager.isOnline()
    });

    Titanium.App.addEventListener('updateUserState', function() {
        if (globals.loginManager.isUserLoggedIn()) {
            nav.open(accountView);
            nav.close(loginView);
        } else {
            nav.open(loginView);
            nav.close(accountView);
        }
        tab.disabled = !globals.httpManager.isOnline();
    });
    Titanium.App.addEventListener('changeonlinestate', function() {
        tab.disabled = !globals.httpManager.isOnline();
    });
    return tab;
};
