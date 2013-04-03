exports.HomeTab = function() {
    var globals = require('globals');
    var ContentScreen = require('views/more/ContentScreen').ContentScreen;
    var searchBarHeight = globals.isAndroid ? '50dp' : '43dp';

    var outerWindow = Titanium.UI.createWindow({
        navBarHidden: true
    });

    /**
     * Create "home" window
     */
    var homeWindow = null;
    var navigation = null;
    if (globals.isAndroid) {
        homeWindow = Titanium.UI.createView({
            backgroundColor: '#fff'
        });

        var androidNavigation = new globals.tabWindowManager(outerWindow);
        androidNavigation.open(homeWindow);
        navigation = androidNavigation;
    } else {
        homeWindow = Titanium.UI.createWindow({
            titleid: 'shop_title',
            backgroundColor: '#fff'
        });

        var loginButton = Titanium.UI.createButton({
            titleid: globals.loginManager.isUserLoggedIn() ? 'logout_button' : 'login_button'
        });
        loginButton.addEventListener('click', globals.loginManager.openLoginWindow);
        homeWindow.setRightNavButton(loginButton);

        var iOsNavigation = Titanium.UI.iPhone.createNavigationGroup({ window: homeWindow });
        outerWindow.add(iOsNavigation);
        navigation = iOsNavigation;

        Titanium.App.addEventListener('updateUserState', function() {
            if (globals.loginManager.isUserLoggedIn()) {
                loginButton.setTitle(L('logout_button'));
            } else {
                loginButton.setTitle(L('login_button'));
            }
            homeWindow.getRightNavButton(loginButton);
        });
    }
    
    // var homeView = Titanium.UI.createScrollableView({
        // views: [
            // Titanium.UI.createImageView({
                // image: globals.isAndroid ? '/default.png' : '/Default.png',
                // backgroundColor: '#000'
            // })
        // ],
        // showPagingControl: true,
        // disableBounce: true
    // });
    var contentView = Titanium.UI.createWebView({
        backgroundColor: '#FFF',
        enableZoomControls: false,
        top:searchBarHeight
    });
    
    var loadStartContent = function () {
        globals.httpManager.request(
            globals.httpManager.buildUrl({fnc:'getStartPage'}),
            function() {
                var response = JSON.parse(this.responseText);
                if (response.error) {
                    Titanium.UI.createAlertDialog({message:response.error,okid:'ok_button',titleid:'dialog_title_warning'}).show();
                }
                if (response.result) {
                    contentView.html = response.result;
                }
            }
        );
    };

    homeWindow.addEventListener('focus', loadStartContent);
    
    loadStartContent();    

    homeWindow.add(contentView);
    
    // contentView.setHtml('<html><head></head><body>Hello world!</body></html>');
    // alert(contentView.html);

    /**
     * Create search bar last to show it atop
     */
    var ProductsTable = require('views/product/ProductsTable').ProductsTable;
    var homeSearchBar = Titanium.UI.createSearchBar({
        height: searchBarHeight,
        showCancel: false,
        hinttextid: 'hint_searchbar',
        top: '0dp'
    });
    homeSearchBar.addEventListener('cancel', function() {
        homeSearchBar.blur();
    });
    homeSearchBar.addEventListener('focus', function() {
        homeSearchBar.setShowCancel(true);
    });
    homeSearchBar.addEventListener('blur', function() {
        homeSearchBar.setShowCancel(false);
    });
    homeSearchBar.addEventListener('return', function() {
        homeSearchBar.blur();
        globals.httpManager.request(
            globals.httpManager.buildUrl({ fnc: 'searchProducts', searchparam: homeSearchBar.value }),
            function() {
                var response = JSON.parse(this.responseText);
                navigation.open(new ProductsTable(navigation, null, {
                    searchText: homeSearchBar.value,
                    result: response.result
                }), { animated: true });
                homeSearchBar.value = '';
            }
        );
    });
    homeWindow.add(homeSearchBar);

    /**
     * Create "home" tab
     */
    var homeTab = Titanium.UI.createTab({
        icon: globals.getTabIconForDevice('icons/home.png', 'icons/home_small.png'),
        titleid: 'home_tab_title',
        window: outerWindow
    });
        
    return homeTab;
};
