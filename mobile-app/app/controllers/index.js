var windowMapping = {
    "productsTab":{controller:"products",window:"productsWindow"},
    "moreTab":{controller:"more",window:"moreWindow"}
};
var windows = {};

function openWindow(e)
{
    if (!windows[e.source.id] && windowMapping[e.source.id]) {
        var windowInfo = windowMapping[e.source.id];
        var window = Alloy.createController(windowInfo.controller).getView();
        $.getView(windowInfo.window).add(window);
        windows[e.source.id] = window;
    }
}

function bindTabEvents(e)
{
    e.source.tabs.map(function(tab) {
        tab.addEventListener('focus', openWindow);
    });
}

require('communication').startScreen(function(text) {
    $.startContent.html = text;
});

Alloy.Globals.cartTab = $.cartTab;
$.index.open();
