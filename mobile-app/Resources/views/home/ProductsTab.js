exports.ProductsTab = function() {
    var globals = require('globals');
    var CategoryTable = require('views/product/CategoryTable').CategoryTable;

    var outerWindow = Titanium.UI.createWindow({
        navBarHidden: true
    });

    if (globals.isAndroid) {
        var androidNavigation = new globals.tabWindowManager(outerWindow);
        androidNavigation.open(new CategoryTable(androidNavigation));
    } else {
        var iOsNavigation = Titanium.UI.iPhone.createNavigationGroup();
        iOsNavigation.window = new CategoryTable(iOsNavigation);
        outerWindow.add(iOsNavigation);
    }

    var tab = Titanium.UI.createTab({
        icon: globals.getTabIconForDevice('icons/magnifier.png', 'icons/magnifier_small.png'),
        titleid: 'products_tab_title',
        window: outerWindow,
        disabled: !globals.httpManager.isOnline()
    });
    
    Titanium.App.addEventListener('changeonlinestate', function(e) {
        tab.disabled = !e.isOnline;
    });
    return tab;
};
exports.Products = {};
