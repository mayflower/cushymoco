var windowMapping = {
    "productsTab":{controller:"products",window:"productsWindow"},
    "accountTab":{controller:"account", window:"accountWindow"},
    "moreTab":{controller:"more",window:"moreWindow"}
};
var windows = {};

function openWindow(e)
{
    if (!windows[e.source.id] && windowMapping[e.source.id]) {
        var windowInfo = windowMapping[e.source.id];
        var windowInstance = Alloy.createController(windowInfo.controller).getView();
        $.getView(windowInfo.window).add(windowInstance);
        windows[e.source.id] = windowInstance;
        windowInstance.addEventListener('blur', function(e){
            Ti.API.warn(e);
        })
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
});

Alloy.Globals.cartTab = $.cartTab;
$.index.open();
