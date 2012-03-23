exports.MoreTab = function() {
    var globals = require('globals');
//    var SettingScreen = require('views/more/SettingScreen').SettingScreen;
    var ContentScreen = require('views/more/ContentScreen').ContentScreen;

    /**
     * Create "more" tab and window
     */
    var outerMoreWindow = Titanium.UI.createWindow({
        navBarHidden: true
    });

    var nav = null;
    var moreMenu = Ti.UI.createTableView({
        style: Titanium.UI.iPhone.TableViewStyle.PLAIN,
        scrollable: false,
        minRowHeight: '40dp',
        data: [
//            { title: L('settings_more_menu'), hasChild: true, screen: new SettingScreen() },
            { title: L('terms_and_condition_more_menu'), methode: 'getTermsAndConditions', hasChild: true },
            { title: L('imprint_more_menu'), methode: 'getImprint', hasChild: true }
        ]
    });
    moreMenu.addEventListener('click', function(e) {
        if (e.rowData.methode) {
            nav.open(new ContentScreen(e.rowData.methode, e.rowData.title), { animated: true });
        } else if (e.rowData.screen) {
            nav.open(e.rowData.screen, { animated: true });
        }
    });

    if (globals.isAndroid) {
        var moreScreen = Titanium.UI.createView();
        moreScreen.add(moreMenu);

        nav = new globals.tabWindowManager(outerMoreWindow);
        nav.open(moreScreen);
    } else {
        var moreWindow = Titanium.UI.createWindow({
            titleid: 'more_tab_title'
        });
        moreWindow.add(moreMenu);

        nav = Titanium.UI.iPhone.createNavigationGroup({
           window: moreWindow
        });
        outerMoreWindow.add(nav);
    }

    return Titanium.UI.createTab({
        icon: globals.getTabIconForDevice('icons/gear.png', 'icons/gear_small.png'),
        titleid: 'more_tab_title',
        window: outerMoreWindow
    });
};
