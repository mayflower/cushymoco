var communication = require('communication');
var webStyle = require('webStyle');
var windowMapping = {
    "productsTab":{controller:"products",window:"productsWindow"},
    "moreTab":{controller:"more",window:"moreWindow"},
    "accountTab":{controller:"account",window:"accountWindow",loginRequired:true},
    "cartTab":{controller:"checkout/cart",window:"cartWindow"}
};

var windows = {};
var tabId;

function showLogoutButton()
{
    $.homeWindow.rightNavButton = $.logoutButton;
    $.accountWindow.rightNavButton = $.logoutButton;
    $.logoutButton.visible = true;
}

function hideLogoutButton()
{
    $.logoutButton.visible = false;
    $.homeWindow.rightNavButton = null;
    $.accountWindow.rightNavButton = null;
}

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
            loginWin.addEventListener('close:window.login', function(e) {
                $.getView(windowMapping[tabId].window).remove(windows['_loginWindow']);
                windows['_loginWindow'] = null;
                showLogoutButton();
                realOpenWindow();
            });
            $.getView(windowInfo.window).add(loginWin);
            windows['_loginWindow'] = loginWin;
        } else {
            realOpenWindow();
        }
        
    }
}

function onTabFocus(e)
{
    if (e.source.id == 'homeTab') {
        loadStartPage();
    }
    
    openWindow(e);
}

function bindTabEvents(e)
{
    e.source.tabs.map(function(tab) {
        tab.addEventListener('focus', onTabFocus);
    });
}

function doLogout(e)
{
    communication.logout(function(response) {
        Alloy.Globals.loggedIn = false;
        hideLogoutButton();
        if (windowMapping[tabId] && windowMapping[tabId].loginRequired) {
            $.index.getActiveTab().fireEvent('focus', {previousTab:$.getView(tabId),source:$.getView(tabId)});
        }
    });
}

function loadStartPage()
{
    communication.startScreen(function(response) {
        $.startContent.html = webStyle.getBasicPageLayout(response.pageContent, false);
        $.startContent.setDisableBounce(true);
    
        $.homeWindow.title = response.title;
        Alloy.Globals.loggedIn = response.loggedIn;
        if (response.loggedIn) {
            showLogoutButton();
        }
    });
}

loadStartPage();

Alloy.Globals.cartTab = $.cartTab;
Alloy.Globals.homeTab = $.homeTab;
Alloy.Globals.productsTab = $.productsTab;
$.index.open();
