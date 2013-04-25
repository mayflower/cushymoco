function Controller() {
    function openWindow(e) {
        if (!windows[e.source.id] && windowMapping[e.source.id]) {
            Ti.API.warn("Creating controller for: " + e.source.id);
            var windowInfo = windowMapping[e.source.id];
            var window = Alloy.createController(windowInfo.controller).getView();
            $.getView(windowInfo.window).add(window);
            windows[e.source.id] = window;
        }
    }
    function bindTabEvents(e) {
        e.source.tabs.map(function(tab) {
            tab.addEventListener("focus", openWindow);
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.homeWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Shop",
        id: "homeWindow"
    });
    $.__views.startContent = Ti.UI.createWebView({
        id: "startContent"
    });
    $.__views.homeWindow.add($.__views.startContent);
    $.__views.homeTab = Ti.UI.createTab({
        window: $.__views.homeWindow,
        id: "homeTab",
        title: "Home",
        icon: "/icons/home_small.png"
    });
    $.__views.index.addTab($.__views.homeTab);
    $.__views.productsWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Window Title",
        id: "productsWindow",
        navBarHidden: "true"
    });
    $.__views.productsTab = Ti.UI.createTab({
        window: $.__views.productsWindow,
        id: "productsTab",
        title: "Products",
        icon: "/icons/magnifier_small.png"
    });
    $.__views.index.addTab($.__views.productsTab);
    $.__views.accountWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Account",
        id: "accountWindow"
    });
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "Brunsverreggd",
        id: "__alloyId1"
    });
    $.__views.accountWindow.add($.__views.__alloyId1);
    $.__views.accountTab = Ti.UI.createTab({
        window: $.__views.accountWindow,
        id: "accountTab",
        title: "Account",
        icon: "/icons/user_small.png"
    });
    $.__views.index.addTab($.__views.accountTab);
    $.__views.cartWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Shopping cart",
        id: "cartWindow"
    });
    $.__views.__alloyId2 = Ti.UI.createLabel({
        text: "Buscare",
        id: "__alloyId2"
    });
    $.__views.cartWindow.add($.__views.__alloyId2);
    $.__views.cartTab = Ti.UI.createTab({
        window: $.__views.cartWindow,
        id: "cartTab",
        title: "Cart",
        icon: "/icons/cart_small.png"
    });
    $.__views.index.addTab($.__views.cartTab);
    $.__views.moreWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "More Info",
        id: "moreWindow"
    });
    $.__views.moreTab = Ti.UI.createTab({
        window: $.__views.moreWindow,
        id: "moreTab",
        title: "More",
        icon: "/icons/gear_small.png"
    });
    $.__views.index.addTab($.__views.moreTab);
    $.__views.index && $.addTopLevelView($.__views.index);
    bindTabEvents ? $.__views.index.addEventListener("open", bindTabEvents) : __defers["$.__views.index!open!bindTabEvents"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var windowMapping = {
        productsTab: {
            controller: "products",
            window: "productsWindow"
        },
        moreTab: {
            controller: "more",
            window: "moreWindow"
        }
    };
    var windows = {};
    require("communication").startScreen(function(text) {
        $.startContent.html = text;
    });
    Alloy.Globals.cartTab = $.cartTab;
    $.index.open();
    __defers["$.__views.index!open!bindTabEvents"] && $.__views.index.addEventListener("open", bindTabEvents);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;