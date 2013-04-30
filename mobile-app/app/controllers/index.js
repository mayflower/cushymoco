var windowMapping = {
    "productsTab":{controller:"products",window:"productsWindow"},
    "moreTab":{controller:"more",window:"moreWindow"},
    "accountTab":{controller:"account",window:"accountWindow",loginRequired:true}
};
var windows = {};
var tabId;

function openWindow(e)
{
    var oldTabId = e.previousTab.id;
    if (windows[oldTabId] && windowMapping[oldTabId]) {
        $.getView(windowMapping[oldTabId].window).remove(windows[oldTabId]);
        windows[oldTabId] = null;
    }
    
    tabId = e.source.id;
    if (!windows[tabId] && windowMapping[tabId]) {
        var windowInfo = windowMapping[tabId];
        
        var realOpenWindow = function() {
            if (!windowInfo) {
                var windowInfo = windowMapping[tabId];
            } 
            var windowInstance = Alloy.createController(windowInfo.controller).getView();
            $.getView(windowInfo.window).add(windowInstance);
            windows[tabId] = windowInstance;
        }
        
        if (windowInfo.loginRequired && !Alloy.Globals.loggedIn) {
            var loginWin = Alloy.createController("login").getView();
            loginWin.addEventListener('window.close', function(e) {
                $.getView(windowMapping[tabId].window).remove(windows['_loginWindow']);
                windows['_loginWindow'] = null;
                realOpenWindow();
            });
            $.getView(windowInfo.window).add(loginWin);
            windows['_loginWindow'] = loginWin;
        } else {
            realOpenWindow();
        }
        
    }
}

function bindTabEvents(e)
{
    e.source.tabs.map(function(tab) {
        tab.addEventListener('focus', openWindow);
    });
}

require('communication').startScreen(function(response) {
    $.startContent.html = response.pageContent;
    $.homeWindow.title = response.title;
    Alloy.Globals.loggedIn = response.loggedIn;
    if (response.loggedIn) {
        $.homeWindow.rightNavButton = Titanium.UI.createButton({titleid:"login.logoutButton"});
    }
});

Alloy.Globals.cartTab = $.cartTab;
$.index.open();
