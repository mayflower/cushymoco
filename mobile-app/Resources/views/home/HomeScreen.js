exports.HomeScreen = function(globals) {
    var HomeTab = require('views/home/HomeTab').HomeTab;
    var ProductsTab = require('views/home/ProductsTab').ProductsTab;
    var AccountTab = require('views/home/AccountTab').AccountTab;
    var CartTab = require('views/home/CartTab').CartTab;
    var MoreTab = require('views/home/MoreTab').MoreTab;

    var rootTab = 0;
    var tabGroup = Titanium.UI.createTabGroup();
    tabGroup.addTab(new HomeTab());
    tabGroup.addTab(new ProductsTab());
    tabGroup.addTab(new AccountTab());
    tabGroup.addTab(new CartTab());
    tabGroup.addTab(new MoreTab());
    tabGroup.setActiveTab(rootTab);

    var activeTabIndex = rootTab;
    var detectTabChange = function() {
        var tabs = tabGroup.getTabs();
        var currentTabIndex = tabs.indexOf(tabGroup.getActiveTab());
        if (currentTabIndex !== activeTabIndex) {
            tabGroup.fireEvent('change', {
                tab: tabs[currentTabIndex],
                index: currentTabIndex,
                previousTab: tabs[activeTabIndex],
                previousIndex: activeTabIndex,
                source: tabGroup,
                type: 'change'
            });
        }
    };

    var callDialogTabDisabled = function(changeToTab) {
        var dialog = Titanium.UI.createAlertDialog({
            message: globals.httpManager.isOnline() ? L('login_required') : L('network_required'),
            okid: 'close_button'
        });
        dialog.addEventListener('click', function() {
            tabGroup.setActiveTab(changeToTab);
        });
        dialog.show();
    };

    globals._.each(tabGroup.getTabs(), function(tab) {
        if (globals.isAndroid) {
            tab.addEventListener('click', detectTabChange);
        } else {
            tab.addEventListener('focus', detectTabChange);
        }
    });
    tabGroup.addEventListener('change', function(e) {
        if (e.tab.disabled) {
            activeTabIndex = e.previousIndex;
            callDialogTabDisabled(e.previousIndex);
        } else {
            activeTabIndex = e.index;
        }
    });

    var detectIsDisabledTabOpen = function() {
        if (tabGroup.getActiveTab().disabled) {
            activeTabIndex = rootTab;
            callDialogTabDisabled(rootTab);
        }
    };
    Titanium.App.addEventListener('updateUserState', detectIsDisabledTabOpen);
    Titanium.App.addEventListener('changeonlinestate', detectIsDisabledTabOpen);

    return tabGroup;
};
